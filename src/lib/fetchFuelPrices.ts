/**
 * fetchFuelPrices.ts
 *
 * Fetches live fuel prices from Opet's internal JSON API:
 *   https://api.opet.com.tr/api/fuelprices/allprices
 *
 * Discovered from inspecting FuelPrice.js (the React component served at
 * opet.com.tr/akaryakit-fiyatlari). The page is a client-rendered SPA —
 * HTML scraping yields nothing. This JSON endpoint is what the component
 * actually calls; it returns structured data for all 81 Turkish provinces,
 * no auth required.
 *
 * ── Products ─────────────────────────────────────────────────────────────────
 *   A100  "Kurşunsuz Benzin 95"  ← gasoline
 *   A121  "Motorin UltraForce"   ← diesel (preferred)
 *   A128  "Motorin EcoForce"     ← diesel (fallback)
 *   NOTE: LPG / Otogaz is NOT in Opet's API. We use a static reference value.
 *
 * ── Geo-restriction note ──────────────────────────────────────────────────────
 *   api.opet.com.tr appears to block non-Turkish IP ranges (Vercel US servers).
 *   The route is deployed with `runtime = 'edge'` so it runs at the Cloudflare
 *   PoP closest to the user (Istanbul for Turkish users), and with
 *   `preferredRegion = 'fra1'` as the Node.js fallback (Frankfurt, Europe).
 *
 * ── Caching ──────────────────────────────────────────────────────────────────
 *   Edge Runtime does not support module-level persistent state, so we cannot
 *   use an in-memory cache. Instead we use `fetch` with `next: { revalidate }`
 *   which hooks into Next.js's Data Cache (persists across invocations in
 *   Node.js runtime; in Edge Runtime the CDN Cache-Control header handles it).
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_PRICES_URL  = "https://api.opet.com.tr/api/fuelprices/allprices";
const LAST_UPDATE_URL = "https://api.opet.com.tr/api/fuelprices/lastupdate";
const SOURCE_LABEL    = "Opet (api.opet.com.tr)";

/** LPG is not in Opet's API — static reference (EPDK max price band, March 2026) */
const LPG_STATIC_REF  = 32.15;
const LPG_SOURCE_NOTE = "Statik referans (LPG Opet API'sinde yok)";

/** Revalidate interval for Next.js Data Cache / CDN — 15 minutes */
const REVALIDATE_SECS = 900;

// ── Types ─────────────────────────────────────────────────────────────────────

interface OpetPriceEntry {
  id: string;
  productName:      string;
  productShortName: string;
  amount:           number;
  productCode:      string;
}

interface OpetProvinceEntry {
  provinceCode: number;
  provinceName: string;
  districtCode: string;
  districtName: string;
  prices:       OpetPriceEntry[];
}

interface ProvincePrices {
  provinceCode:         number;
  provinceName:         string;
  gasoline:             number;
  diesel:               number;
  matchedGasolineLabel: string;
  matchedDieselLabel:   string;
}

export interface LiveFuelData {
  gasoline:             number;
  diesel:               number;
  lpg:                  number;
  lpgIsStatic:          boolean;
  electric:             number | null;
  source:               string;
  lpgSource:            string;
  fetchedAt:            string;
  opetLastUpdate:       string;
  matchedProvince:      string;
  matchedGasolineLabel: string;
  matchedDieselLabel:   string;
  isNationalAverage:    boolean;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns live fuel prices for the given city/province.
 * Pass empty string for the national average.
 *
 * Throws on network failure so the caller can build a meaningful fallbackReason.
 */
export async function fetchFuelPricesForCity(city: string): Promise<LiveFuelData> {
  const { provinces, opetLastUpdate } = await loadProvinces();
  const fetchedAt = new Date().toISOString();

  if (!city.trim()) {
    const avg = nationalAverage(provinces);
    return {
      ...avg,
      lpg: LPG_STATIC_REF, lpgIsStatic: true, electric: null,
      source: SOURCE_LABEL, lpgSource: LPG_SOURCE_NOTE,
      fetchedAt, opetLastUpdate,
      matchedProvince: "Türkiye (ulusal ortalama)",
      isNationalAverage: true,
    };
  }

  const match = findProvince(provinces, city);

  if (match) {
    return {
      gasoline: match.gasoline,
      diesel:   match.diesel,
      lpg: LPG_STATIC_REF, lpgIsStatic: true, electric: null,
      source: SOURCE_LABEL, lpgSource: LPG_SOURCE_NOTE,
      fetchedAt, opetLastUpdate,
      matchedProvince:      match.provinceName,
      matchedGasolineLabel: match.matchedGasolineLabel,
      matchedDieselLabel:   match.matchedDieselLabel,
      isNationalAverage: false,
    };
  }

  // District or unrecognised city → national average (still live data)
  const avg = nationalAverage(provinces);
  return {
    ...avg,
    lpg: LPG_STATIC_REF, lpgIsStatic: true, electric: null,
    source: SOURCE_LABEL, lpgSource: LPG_SOURCE_NOTE,
    fetchedAt, opetLastUpdate,
    matchedProvince: `Türkiye (ulusal ortalama — "${city}" il eşleşmedi)`,
    isNationalAverage: true,
  };
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadProvinces(): Promise<{ provinces: ProvincePrices[]; opetLastUpdate: string }> {
  // next: { revalidate } hooks into Next.js Data Cache for Node.js runtime.
  // For Edge Runtime the response Cache-Control header handles CDN caching.
  const fetchOpts: RequestInit = {
    headers: {
      Accept:            "application/json, */*",
      "Accept-Language": "tr-TR,tr;q=0.9",
    },
    // next is a Next.js-specific fetch extension for the Data Cache
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: { revalidate: REVALIDATE_SECS } as any,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9_000);

  try {
    const [pricesRes, updateRes] = await Promise.all([
      fetch(ALL_PRICES_URL,  { ...fetchOpts, signal: controller.signal }),
      fetch(LAST_UPDATE_URL, { ...fetchOpts, signal: controller.signal }),
    ]);

    clearTimeout(timeout);

    if (!pricesRes.ok) {
      throw new Error(`HTTP ${pricesRes.status} from ${ALL_PRICES_URL}`);
    }

    const rawData: OpetProvinceEntry[] = await pricesRes.json();
    let opetLastUpdate = "";
    if (updateRes.ok) {
      const upd = await updateRes.json() as { lastUpdateDate?: string };
      opetLastUpdate = upd.lastUpdateDate ?? "";
    }

    console.log(
      "[fetchFuelPrices] OK — entries:", rawData.length,
      "| lastUpdate:", opetLastUpdate,
      "| sample:", JSON.stringify(rawData[0]?.prices?.find(p => p.productCode === "A100"))
    );

    const provinces = rawData
      .map(parseEntry)
      .filter((p): p is ProvincePrices => p !== null);

    return { provinces, opetLastUpdate };

  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error
      ? `${err.name}: ${err.message}`
      : String(err);
    console.error("[fetchFuelPrices] FETCH FAILED:", msg);
    // Re-throw so route.ts can set fallbackReason
    throw new Error(`Opet API ulaşılamadı: ${msg}`);
  }
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseEntry(entry: OpetProvinceEntry): ProvincePrices | null {
  const gasEntry    = entry.prices.find(p => p.productCode === "A100");
  const dieselEntry = entry.prices.find(p => p.productCode === "A121")
                   ?? entry.prices.find(p => p.productCode === "A128");

  if (!gasEntry || !dieselEntry) return null;

  return {
    provinceCode: entry.provinceCode,
    provinceName: entry.provinceName,
    gasoline:     gasEntry.amount,
    diesel:       dieselEntry.amount,
    matchedGasolineLabel: gasEntry.productName,
    matchedDieselLabel:   dieselEntry.productName,
  };
}

// ── City matching ─────────────────────────────────────────────────────────────

export function normalizeTurkish(s: string): string {
  return s.toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

function findProvince(provinces: ProvincePrices[], city: string): ProvincePrices | null {
  const nc = normalizeTurkish(city.trim());
  return (
    provinces.find(p => normalizeTurkish(p.provinceName) === nc) ??
    provinces.find(p => {
      const np = normalizeTurkish(p.provinceName);
      return nc.includes(np) || np.includes(nc);
    }) ??
    null
  );
}

// ── National average ──────────────────────────────────────────────────────────

function nationalAverage(provinces: ProvincePrices[]): {
  gasoline: number; diesel: number;
  matchedGasolineLabel: string; matchedDieselLabel: string;
} {
  if (!provinces.length) throw new Error("Province list empty");
  const avg = (vals: number[]) => Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) / 100;
  return {
    gasoline: avg(provinces.map(p => p.gasoline)),
    diesel:   avg(provinces.map(p => p.diesel)),
    matchedGasolineLabel: "Kurşunsuz Benzin 95 (ulusal ortalama)",
    matchedDieselLabel:   "Motorin UltraForce (ulusal ortalama)",
  };
}
