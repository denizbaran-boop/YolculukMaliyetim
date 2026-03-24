/**
 * /api/fuel — live fuel prices (Petrol Ofisi via scrape-petrol.vercel.app)
 *
 * Why not OPET directly?
 *   api.opet.com.tr is geo-restricted to Turkish IPs. Vercel has no Turkish
 *   PoP, so every runtime (edge or Node.js) gets blocked. scrape-petrol.vercel.app
 *   is a Vercel service that re-serves Petrol Ofisi province prices as JSON
 *   with no geo-restriction — accessible from any Vercel PoP.
 *
 * runtime = 'edge'  → Cloudflare PoP closest to user for lowest latency.
 * Cache-Control     → Vercel CDN caches until midnight (Turkey time UTC+3).
 */

export const runtime         = "edge";
export const preferredRegion = "fra1";

import { NextRequest, NextResponse } from "next/server";

// ── Data sources ───────────────────────────────────────────────────────────────

const PROVINCES_URL = "https://scrape-petrol.vercel.app/scrape";
const BRANDS_URL    = "https://scrape-petrol.vercel.app/scrape/akaryakit";

/** LPG & electric not in province feed — static reference (EPDK, Mar 2026) */
const LPG_STATIC  = 30.50;
const ELEC_STATIC = 8.85;

// ── Types ──────────────────────────────────────────────────────────────────────

interface PriceField {
  withTax: string;
}

interface ScrapedProvince {
  name:           string;       // "ISTANBUL (AVRUPA)", "ANKARA", …
  vMaxKursunsuz?: PriceField;   // Benzin 95, TL/L
  vMaxDiesel?:    PriceField;   // Motorin, TL/L
}

interface ScrapedBrand {
  lpg:   string;  // "₺30,49" or "-"
  tarih: string;  // "20.03.2026"
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Seconds from now until next midnight (Turkey = UTC+3) */
function secondsUntilMidnight(): number {
  const nowTR = Date.now() + 3 * 60 * 60 * 1000;
  const msInDay = 24 * 60 * 60 * 1000;
  return Math.max(60, Math.floor((msInDay - (nowTR % msInDay)) / 1000));
}

/** ASCII-fold Turkish characters for case-insensitive matching.
 *  IMPORTANT: İ/ı replacements must come BEFORE .toLowerCase() because
 *  JS toLowerCase() turns "İ" (U+0130) into "i" + combining dot (U+0307),
 *  not plain "i" — so post-lowercase replacement never matches. */
function normTR(s: string): string {
  return s
    .replace(/İ/g, "I")   // Turkish İ → Latin I  (before toLowerCase)
    .replace(/ı/g, "i")   // Turkish ı → Latin i  (before toLowerCase)
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
    .trim();
}

/** "43,25" or "43.25" → 43.25; returns null if invalid */
function parseTRFloat(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(",", "."));
  return isNaN(n) || n <= 0 ? null : n;
}

/** "₺30,49" → 30.49; "-" → null */
function parseBrandPrice(s: string): number | null {
  if (!s || s === "-") return null;
  return parseTRFloat(s.replace(/[₺\s]/g, ""));
}

function parseTRDate(s: string): Date {
  const [d, m, y] = s.split(".");
  return new Date(`${y}-${m}-${d}T00:00:00Z`);
}

// ── Province matching ──────────────────────────────────────────────────────────

function findProvince(provinces: ScrapedProvince[], city: string): ScrapedProvince | null {
  const nc = normTR(city);
  return (
    provinces.find(p => normTR(p.name) === nc) ??
    provinces.find(p => {
      const np = normTR(p.name);
      return np.includes(nc) || nc.includes(np);
    }) ??
    null
  );
}

function nationalAvg(provinces: ScrapedProvince[], field: "gasoline" | "diesel"): number {
  const values = provinces.map(p => {
    const raw = field === "gasoline" ? p.vMaxKursunsuz?.withTax : p.vMaxDiesel?.withTax;
    return parseTRFloat(raw);
  }).filter((v): v is number => v !== null);

  if (!values.length) throw new Error(`No province data for ${field}`);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length * 100) / 100;
}

// ── LPG from brand-level data ──────────────────────────────────────────────────

function extractLpg(brands: ScrapedBrand[]): number | null {
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const prices = brands
    .filter(b => b.tarih && (now - parseTRDate(b.tarih).getTime()) <= maxAgeMs)
    .map(b => parseBrandPrice(b.lpg))
    .filter((v): v is number => v !== null && v >= 20 && v <= 60);

  if (!prices.length) return null;
  return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length * 100) / 100;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";
  const ttl  = secondsUntilMidnight();

  try {
    const headers: HeadersInit = {
      "User-Agent":      "Mozilla/5.0 (compatible; yolculukmaliyetim.com/1.0)",
      "Accept":          "application/json",
      "Accept-Language": "tr-TR,tr;q=0.9",
    };

    const [provRes, brandRes] = await Promise.all([
      fetch(PROVINCES_URL, { headers }),
      fetch(BRANDS_URL,    { headers }),
    ]);

    if (!provRes.ok) throw new Error(`scrape-petrol HTTP ${provRes.status}`);

    const provData = (await provRes.json()) as { results: ScrapedProvince[] };
    const provinces = (provData.results ?? []).filter(
      p => parseTRFloat(p.vMaxKursunsuz?.withTax) !== null
        && parseTRFloat(p.vMaxDiesel?.withTax) !== null
    );

    if (!provinces.length) throw new Error("Province list empty after parsing");

    // LPG from brand data (TL/L average of recent brands)
    let lpg = LPG_STATIC;
    if (brandRes.ok) {
      const brandData = (await brandRes.json()) as { results: ScrapedBrand[] };
      lpg = extractLpg(brandData.results ?? []) ?? LPG_STATIC;
    }

    const province = city ? findProvince(provinces, city) : null;

    const gasoline = province
      ? (parseTRFloat(province.vMaxKursunsuz?.withTax) ?? nationalAvg(provinces, "gasoline"))
      : nationalAvg(provinces, "gasoline");

    const diesel = province
      ? (parseTRFloat(province.vMaxDiesel?.withTax) ?? nationalAvg(provinces, "diesel"))
      : nationalAvg(provinces, "diesel");

    const matchedProvince = province?.name
      ?? (city ? `Türkiye (ulusal ortalama — "${city}" eşleşmedi)` : "Türkiye (ulusal ortalama)");

    return NextResponse.json(
      {
        city:             city || "Türkiye",
        updatedAt:        new Date().toISOString(),
        gasoline,
        diesel,
        lpg,
        electric:         ELEC_STATIC,
        isFallback:       false,
        source:           "Petrol Ofisi (scrape-petrol.vercel.app)",
        matchedProvince,
      },
      { headers: { "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=60` } }
    );

  } catch (err) {
    const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[fuel/route] failed:", reason);

    return NextResponse.json(
      {
        city:             city || "Türkiye",
        updatedAt:        new Date().toISOString(),
        gasoline:         70,
        diesel:           65,
        lpg:              LPG_STATIC,
        electric:         ELEC_STATIC,
        isFallback:       true,
        fallback:         true,
        source:           "Statik referans — canlı veri alınamadı",
        matchedProvince:  null,
        fallbackReason:   reason,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
