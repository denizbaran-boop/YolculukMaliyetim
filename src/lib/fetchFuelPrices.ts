/**
 * fetchFuelPrices.ts
 *
 * Fetches live fuel prices from scrape-petrol.vercel.app which scrapes
 * Petrol Ofisi's official price bulletins — all 82 Turkish provinces.
 *
 * ── Endpoints ────────────────────────────────────────────────────────────────
 *   /scrape           — Province-level Petrol Ofisi prices (benzin 95, motorin)
 *   /scrape/akaryakit — Brand-level prices (used for LPG national average)
 *
 * ── Province name format ─────────────────────────────────────────────────────
 *   Province names are uppercase ASCII approximations: "ISTANBUL (AVRUPA)",
 *   "ANKARA", "IZMIR", "CANAKKALE" etc. normalizeTurkish() handles matching
 *   from user-supplied Turkish city names to these ASCII forms.
 *
 * ── LPG ──────────────────────────────────────────────────────────────────────
 *   Province data has poGazOtogaz in TL/KG (not litre) — unusable directly.
 *   Instead we derive LPG from brand-level data (/scrape/akaryakit), filtering
 *   to brands with dates within the last 7 days and averaging their TL/L prices.
 *
 * ── Caching ──────────────────────────────────────────────────────────────────
 *   `fetch` with `next: { revalidate }` hooks into Next.js Data Cache.
 *   CDN Cache-Control is set in route.ts (s-maxage=900).
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const SCRAPE_PROVINCES_URL = "https://scrape-petrol.vercel.app/scrape";
const SCRAPE_BRANDS_URL    = "https://scrape-petrol.vercel.app/scrape/akaryakit";
const SOURCE_LABEL         = "Petrol Ofisi (scrape-petrol.vercel.app)";

/** LPG fallback if brand-level data is unavailable (EPDK ref, March 2026) */
const LPG_STATIC_REF  = 30.50;
const LPG_SOURCE_NOTE = "Statik referans (LPG canlı veriden türetildi)";

/** Revalidate interval for Next.js Data Cache — 15 minutes */
const REVALIDATE_SECS = 900;

/** Max age for brand-level data to be considered "current" (7 days) */
const MAX_AGE_DAYS = 7;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ScrapedPriceField {
  withTax:    string;
  withoutTax: string;
  currency:   string;
}

interface ScrapedProvince {
  name:           string; // "ISTANBUL (AVRUPA)", "ANKARA", ...
  vMaxKursunsuz?: ScrapedPriceField; // Benzin 95, TL/LT
  vMaxDiesel?:    ScrapedPriceField; // Motorin, TL/LT
  vProDiesel?:    ScrapedPriceField; // Premium motorin, TL/LT
  poGazOtogaz?:   ScrapedPriceField; // LPG — TL/KG (not usable as TL/L directly)
}

interface ScrapedBrand {
  name:    string;
  benzin:  string; // "₺62,00" or "-"
  motorin: string; // "₺71,10" or "-"
  lpg:     string; // "₺30,49" or "-" (TL per LITRE)
  tarih:   string; // "20.03.2026"
}

interface ProvincePrices {
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
  const { provinces, lpgNationalAvg, lpgIsLive, lastUpdate } = await loadData();
  const fetchedAt = new Date().toISOString();

  const lpg       = lpgNationalAvg;
  const lpgIsStatic = !lpgIsLive;
  const lpgSource = lpgIsLive
    ? "Petrol Ofisi / marka ortalaması (scrape-petrol.vercel.app)"
    : LPG_SOURCE_NOTE;

  if (!city.trim()) {
    const avg = nationalAverage(provinces);
    return {
      ...avg,
      lpg, lpgIsStatic, electric: null,
      source: SOURCE_LABEL, lpgSource,
      fetchedAt, opetLastUpdate: lastUpdate,
      matchedProvince: "Türkiye (ulusal ortalama)",
      isNationalAverage: true,
    };
  }

  const match = findProvince(provinces, city);

  if (match) {
    return {
      gasoline: match.gasoline,
      diesel:   match.diesel,
      lpg, lpgIsStatic, electric: null,
      source: SOURCE_LABEL, lpgSource,
      fetchedAt, opetLastUpdate: lastUpdate,
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
    lpg, lpgIsStatic, electric: null,
    source: SOURCE_LABEL, lpgSource,
    fetchedAt, opetLastUpdate: lastUpdate,
    matchedProvince: `Türkiye (ulusal ortalama — "${city}" il eşleşmedi)`,
    isNationalAverage: true,
  };
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadData(): Promise<{
  provinces:     ProvincePrices[];
  lpgNationalAvg: number;
  lpgIsLive:     boolean;
  lastUpdate:    string;
}> {
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
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const [provincesRes, brandsRes] = await Promise.all([
      fetch(SCRAPE_PROVINCES_URL, { ...fetchOpts, signal: controller.signal }),
      fetch(SCRAPE_BRANDS_URL,    { ...fetchOpts, signal: controller.signal }),
    ]);

    clearTimeout(timeout);

    if (!provincesRes.ok) {
      throw new Error(`HTTP ${provincesRes.status} from ${SCRAPE_PROVINCES_URL}`);
    }

    const provinceData = await provincesRes.json() as { results: ScrapedProvince[] };
    const provinces = (provinceData.results ?? [])
      .map(parseProvince)
      .filter((p): p is ProvincePrices => p !== null);

    if (!provinces.length) {
      throw new Error("Province list empty after parsing");
    }

    // LPG from brand-level data
    let lpgNationalAvg = LPG_STATIC_REF;
    let lpgIsLive = false;
    let lastUpdate = "";

    if (brandsRes.ok) {
      const brandData = await brandsRes.json() as { results: ScrapedBrand[] };
      const brands = brandData.results ?? [];
      const { lpg, date } = extractLpgFromBrands(brands);
      if (lpg !== null) {
        lpgNationalAvg = lpg;
        lpgIsLive = true;
      }
      lastUpdate = date;
    }

    console.log(
      "[fetchFuelPrices] OK — provinces:", provinces.length,
      "| lpg:", lpgNationalAvg, "(live:", lpgIsLive + ")",
      "| lastUpdate:", lastUpdate,
      "| sample:", JSON.stringify(provinces[0]),
    );

    return { provinces, lpgNationalAvg, lpgIsLive, lastUpdate };

  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error
      ? `${err.name}: ${err.message}`
      : String(err);
    console.error("[fetchFuelPrices] FETCH FAILED:", msg);
    throw new Error(`Yakıt verisi alınamadı: ${msg}`);
  }
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseProvince(p: ScrapedProvince): ProvincePrices | null {
  const gasoline = parseFloat(p.vMaxKursunsuz?.withTax ?? "");
  const diesel   = parseFloat(p.vMaxDiesel?.withTax    ?? "");
  if (isNaN(gasoline) || isNaN(diesel) || gasoline <= 0 || diesel <= 0) return null;

  return {
    provinceName:         p.name,
    gasoline,
    diesel,
    matchedGasolineLabel: "Benzin 95 (Petrol Ofisi vMax Kurşunsuz)",
    matchedDieselLabel:   "Motorin (Petrol Ofisi vMax Diesel)",
  };
}

/** Parse brand-level price string: "₺30,49" → 30.49; "-" → null */
function parseBrandPrice(s: string): number | null {
  if (!s || s === "-") return null;
  const n = parseFloat(s.replace(/[₺\s]/g, "").replace(",", "."));
  return isNaN(n) || n <= 0 ? null : n;
}

/** Parse "DD.MM.YYYY" date string used in brand data */
function parseTrDate(s: string): Date {
  const [d, m, y] = s.split(".");
  return new Date(`${y}-${m}-${d}T00:00:00Z`);
}

/**
 * Extract LPG national average (TL/L) from brand-level data.
 * Filters to brands updated within the last MAX_AGE_DAYS days.
 */
function extractLpgFromBrands(brands: ScrapedBrand[]): { lpg: number | null; date: string } {
  const now     = Date.now();
  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  const recentLpgPrices = brands
    .filter(b => {
      if (!b.tarih) return false;
      const age = now - parseTrDate(b.tarih).getTime();
      return age >= 0 && age <= maxAgeMs;
    })
    .map(b => parseBrandPrice(b.lpg))
    .filter((v): v is number => v !== null && v >= 20 && v <= 60); // sanity range for LPG TL/L

  const lpg = recentLpgPrices.length > 0
    ? Math.round(recentLpgPrices.reduce((a, b) => a + b, 0) / recentLpgPrices.length * 100) / 100
    : null;

  // Most recent tarih across all brands
  const lastUpdate = brands
    .map(b => b.tarih ?? "")
    .filter(Boolean)
    .sort((a, z) => parseTrDate(z).getTime() - parseTrDate(a).getTime())[0] ?? "";

  return { lpg, date: lastUpdate };
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
  const avg = (vals: number[]) =>
    Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) / 100;
  return {
    gasoline: avg(provinces.map(p => p.gasoline)),
    diesel:   avg(provinces.map(p => p.diesel)),
    matchedGasolineLabel: "Benzin 95 — ulusal ortalama (Petrol Ofisi)",
    matchedDieselLabel:   "Motorin — ulusal ortalama (Petrol Ofisi)",
  };
}
