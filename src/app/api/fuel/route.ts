/**
 * /api/fuel — live fuel prices from OPET
 *
 * OPET's price page (opet.com.tr/akaryakit-fiyatlari) is React-rendered;
 * static HTML contains no price data so cheerio HTML-parsing is not viable.
 * Prices are fetched from OPET's own internal JSON API — the same endpoints
 * the FuelPrice React component calls on every page load.
 *
 * Endpoints used:
 *   GET https://api.opet.com.tr/api/fuelprices/allprices
 *   GET https://api.opet.com.tr/api/fuelprices/lastupdate
 *
 * Caching: module-level in-memory cache, expires at midnight each day.
 *   — Works on warm serverless instances (Vercel Node.js runtime).
 *   — Cold-start triggers one fresh fetch from OPET.
 */

import { NextRequest, NextResponse } from "next/server";

// ── OPET API ───────────────────────────────────────────────────────────────────

const OPET_ALL_PRICES  = "https://api.opet.com.tr/api/fuelprices/allprices";
const OPET_LAST_UPDATE = "https://api.opet.com.tr/api/fuelprices/lastupdate";

/** OPET product codes */
const CODE_GASOLINE = "A100"; // Kurşunsuz Benzin 95
const CODE_DIESEL   = "A121"; // Motorin UltraForce

/** LPG & electric not in OPET's price feed — static reference (EPDK, Mar 2026) */
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

// ── In-memory cache (invalidated at midnight) ──────────────────────────────────

interface Cache {
  provinces:  OpetProvince[];
  lastUpdate: string;          // "DD.MM.YYYY" from OPET
  expiry:     number;          // Unix ms — next midnight
}

let _cache: Cache | null = null;

function nextMidnight(): number {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

// ── Data loading ───────────────────────────────────────────────────────────────

async function loadOpetData(): Promise<Cache> {
  if (_cache && Date.now() < _cache.expiry) return _cache;

  const headers: HeadersInit = {
    "User-Agent": "Mozilla/5.0 (compatible; yolculukmaliyetim.com/1.0)",
    "Accept":     "application/json",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const [pricesRes, updateRes] = await Promise.all([
      fetch(OPET_ALL_PRICES,  { headers, signal: controller.signal }),
      fetch(OPET_LAST_UPDATE, { headers, signal: controller.signal }),
    ]);
    clearTimeout(timeout);

    if (!pricesRes.ok) throw new Error(`OPET HTTP ${pricesRes.status}`);

    const provinces   = (await pricesRes.json()) as OpetProvince[];
    const updateJson  = updateRes.ok ? (await updateRes.json()) as { lastUpdateDate?: string } : null;
    const lastUpdate  = updateJson?.lastUpdateDate ?? new Date().toLocaleDateString("tr-TR");

    if (!Array.isArray(provinces) || provinces.length === 0) {
      throw new Error("OPET returned empty province list");
    }

    _cache = { provinces, lastUpdate, expiry: nextMidnight() };
    return _cache;

  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** ASCII-fold Turkish letters for case-insensitive province matching */
export function normaliseTR(s: string): string {
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
  if (!values.length) throw new Error(`No province data for code ${code}`);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";

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
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" } }
    );

  } catch (err) {
    const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[fuel/route] live fetch failed:", reason);

    return NextResponse.json({
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
    });
  }
}
