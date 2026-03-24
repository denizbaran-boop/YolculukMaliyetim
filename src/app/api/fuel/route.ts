/**
 * /api/fuel — live fuel prices from OPET
 *
 * runtime = 'edge'  → Cloudflare PoP closest to user.
 *                      For Turkish visitors this is Istanbul → can reach
 *                      api.opet.com.tr (geo-restricted, unreachable from
 *                      Vercel's Frankfurt Node.js servers).
 *
 * Caching: Next.js Data Cache with revalidate = seconds until midnight.
 *   Each city slug gets its own cache entry that refreshes daily at midnight.
 *   CDN (Vercel Edge Network) also caches the response via Cache-Control.
 *
 * OPET's price page (opet.com.tr/akaryakit-fiyatlari) is React-rendered;
 * the static HTML contains no price data so HTML scraping is not viable.
 * Prices come from OPET's own internal JSON API — the same endpoints the
 * FuelPrice React component calls on every page load.
 */

export const runtime         = "edge";
export const preferredRegion = "fra1"; // fallback region if edge can't determine user PoP

import { NextRequest, NextResponse } from "next/server";

// ── OPET API ───────────────────────────────────────────────────────────────────

const OPET_ALL_PRICES  = "https://api.opet.com.tr/api/fuelprices/allprices";
const OPET_LAST_UPDATE = "https://api.opet.com.tr/api/fuelprices/lastupdate";

/** OPET product codes embedded in allprices response */
const CODE_GASOLINE = "A100"; // Kurşunsuz Benzin 95
const CODE_DIESEL   = "A121"; // Motorin UltraForce

/** LPG & electric are not in OPET's price feed — static reference (EPDK, Mar 2026) */
const LPG_STATIC  = 30.50;
const ELEC_STATIC = 8.85;

// ── Types ──────────────────────────────────────────────────────────────────────

interface OpetPriceItem {
  productCode: string;
  amount:      number;
}

interface OpetProvince {
  provinceCode: number;
  provinceName: string;
  prices:       OpetPriceItem[];
}

// ── Cache helpers ──────────────────────────────────────────────────────────────

/** Seconds from now until the next midnight (Turkey time = UTC+3) */
function secondsUntilMidnight(): number {
  const now    = new Date();
  const turkeyOffsetMs = 3 * 60 * 60 * 1000;
  const localMs = now.getTime() + turkeyOffsetMs;
  const msInDay = 24 * 60 * 60 * 1000;
  const msUntilMidnight = msInDay - (localMs % msInDay);
  return Math.max(60, Math.floor(msUntilMidnight / 1000));
}

// ── Data loading ───────────────────────────────────────────────────────────────

async function loadOpetData(): Promise<{ provinces: OpetProvince[]; lastUpdate: string }> {
  const headers: HeadersInit = {
    "User-Agent": "Mozilla/5.0 (compatible; yolculukmaliyetim.com/1.0)",
    "Accept":     "application/json",
  };

  const [pricesRes, updateRes] = await Promise.all([
    fetch(OPET_ALL_PRICES,  { headers }),
    fetch(OPET_LAST_UPDATE, { headers }),
  ]);

  if (!pricesRes.ok) throw new Error(`OPET HTTP ${pricesRes.status}`);

  const provinces  = (await pricesRes.json()) as OpetProvince[];
  const updateJson = updateRes.ok ? (await updateRes.json()) as { lastUpdateDate?: string } : null;
  const lastUpdate = updateJson?.lastUpdateDate ?? new Date().toLocaleDateString("tr-TR");

  if (!Array.isArray(provinces) || provinces.length === 0) {
    throw new Error("OPET returned empty province list");
  }

  return { provinces, lastUpdate };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** ASCII-fold Turkish characters for case-insensitive province matching */
function normaliseTR(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .trim();
}

function findProvince(provinces: OpetProvince[], city: string): OpetProvince | null {
  const nc = normaliseTR(city);
  return (
    provinces.find(p => normaliseTR(p.provinceName) === nc) ??
    provinces.find(p => {
      const np = normaliseTR(p.provinceName);
      return np.includes(nc) || nc.includes(np);
    }) ??
    null
  );
}

function getPrice(province: OpetProvince, code: string): number | null {
  const item = province.prices.find(p => p.productCode === code);
  return item && item.amount > 0 ? item.amount : null;
}

function nationalAvg(provinces: OpetProvince[], code: string): number {
  const values = provinces
    .map(p => getPrice(p, code))
    .filter((v): v is number => v !== null);
  if (!values.length) throw new Error(`No province data for product ${code}`);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";
  const ttl  = secondsUntilMidnight();

  try {
    const { provinces, lastUpdate } = await loadOpetData();

    const province = city ? findProvince(provinces, city) : null;

    const gasoline = province
      ? (getPrice(province, CODE_GASOLINE) ?? nationalAvg(provinces, CODE_GASOLINE))
      : nationalAvg(provinces, CODE_GASOLINE);

    const diesel = province
      ? (getPrice(province, CODE_DIESEL) ?? nationalAvg(provinces, CODE_DIESEL))
      : nationalAvg(provinces, CODE_DIESEL);

    const matchedProvince = province?.provinceName
      ?? (city ? `Türkiye (ulusal ortalama — "${city}" eşleşmedi)` : "Türkiye (ulusal ortalama)");

    return NextResponse.json(
      {
        city:             city || "Türkiye",
        updatedAt:        new Date().toISOString(),
        gasoline,
        diesel,
        lpg:              LPG_STATIC,
        electric:         ELEC_STATIC,
        isFallback:       false,
        source:           `OPET — ${lastUpdate}`,
        matchedProvince,
      },
      { headers: { "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=60` } }
    );

  } catch (err) {
    const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[fuel/route] live fetch failed:", reason);

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
        source:           "Statik referans — OPET verisi alınamadı",
        matchedProvince:  null,
        fallbackReason:   reason,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
