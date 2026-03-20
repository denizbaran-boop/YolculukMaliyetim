/**
 * fetchFuelPrices.ts
 *
 * Fetches live fuel prices from Opet's **internal JSON API**:
 *   https://api.opet.com.tr/api/fuelprices/allprices
 *
 * Discovered from inspecting FuelPrice.js (the React component served at
 * opet.com.tr/akaryakit-fiyatlari). The page is a client-rendered SPA —
 * HTML scraping of that page yields nothing useful. This JSON endpoint is
 * what the component actually calls, and it returns structured data for all
 * 81 Turkish provinces with no auth required.
 *
 * ── Products returned by the API ────────────────────────────────────────────
 *   A100  "Kurşunsuz Benzin 95"  ← gasoline
 *   A121  "Motorin UltraForce"   ← diesel (UltraForce, preferred)
 *   A128  "Motorin EcoForce"     ← diesel (EcoForce, fallback)
 *   A110  "Gazyağı"              (kerosene — ignored)
 *   A201  "Kalorifer Yakıtı"     (heating oil — ignored)
 *   A212  "Fuel Oil"             (ignored)
 *   A218  "Yüksek Kükürtlü Fuel Oil" (ignored)
 *
 *   ⚠ LPG / Otogaz is NOT sold by Opet → not in the API.
 *     We use a static reference value for LPG (clearly labelled).
 *
 * ── City → province matching ─────────────────────────────────────────────────
 *   - allprices returns one entry per province (MERKEZ district)
 *   - We match the incoming city name against province names (normalised)
 *   - If no match (e.g. "Biga" → district of Çanakkale, not a province name),
 *     we return the national average of all 81 provinces
 *   - All prices are labelled with matchedProvince so callers know what was used
 *
 * ── Caching ──────────────────────────────────────────────────────────────────
 *   Module-level in-memory cache, 15-minute TTL.
 *   On Vercel serverless each cold-start begins empty (cache-miss → fetch → fill).
 *   Last-valid data is retained across TTL expiries.
 */

// ── Opet API endpoints ────────────────────────────────────────────────────────
const API_BASE         = "https://api.opet.com.tr/api";
const ALL_PRICES_URL   = `${API_BASE}/fuelprices/allprices`;
const LAST_UPDATE_URL  = `${API_BASE}/fuelprices/lastupdate`;
const SOURCE_LABEL     = "Opet (api.opet.com.tr)";

// LPG is not in Opet API — static reference value (March 2026, EPDK max price band)
const LPG_STATIC_REF  = 32.15;
const LPG_SOURCE_NOTE = "Statik referans (LPG Opet API'sinde yok)";

const CACHE_TTL_MS = 15 * 60 * 1_000;

// ── Types ─────────────────────────────────────────────────────────────────────

interface OpetPriceEntry {
  id:               string;
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

/** What we extract from the API for one province */
interface ProvincePrices {
  provinceCode: number;
  provinceName: string;  // uppercase, Turkish, e.g. "ÇANAKKALE"
  gasoline:     number;  // A100 Kurşunsuz Benzin 95
  diesel:       number;  // A121 UltraForce, or A128 EcoForce
  matchedGasolineLabel: string;
  matchedDieselLabel:   string;
}

export interface LiveFuelData {
  gasoline:  number;
  diesel:    number;
  lpg:       number;         // static reference; lpgIsStatic: true
  lpgIsStatic: boolean;
  electric:  number | null;
  source:    string;
  lpgSource: string;
  fetchedAt:       string;   // ISO — when we fetched from Opet
  opetLastUpdate:  string;   // date string from Opet lastupdate endpoint
  matchedProvince: string;   // province name used, or "Türkiye (ulusal ortalama)"
  matchedGasolineLabel: string;
  matchedDieselLabel:   string;
  isNationalAverage: boolean;
}

interface CacheEntry {
  provinces: ProvincePrices[];
  opetLastUpdate: string;
  cachedAt:   number;
}

// ── Module-level state ────────────────────────────────────────────────────────

let _cache:     CacheEntry   | null = null;
let _lastValid: CacheEntry   | null = null;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns live fuel prices for the given city (province), cached for 15 min.
 * Pass an empty string for the national average.
 *
 * Returns null only if the API has never been reached and no cached data exists.
 */
export async function fetchFuelPricesForCity(city: string): Promise<LiveFuelData | null> {
  const provinces = await getProvinceCache();

  if (!provinces) return null;

  const { provinces: pList, opetLastUpdate } = provinces;
  const fetchedAt = new Date().toISOString();

  if (!city.trim()) {
    const avg = nationalAverage(pList);
    return {
      ...avg,
      lpg:        LPG_STATIC_REF,
      lpgIsStatic: true,
      electric:   null,
      source:     SOURCE_LABEL,
      lpgSource:  LPG_SOURCE_NOTE,
      fetchedAt,
      opetLastUpdate,
      matchedProvince:       "Türkiye (ulusal ortalama)",
      isNationalAverage:     true,
    };
  }

  const match = findProvince(pList, city);

  if (match) {
    return {
      gasoline:  match.gasoline,
      diesel:    match.diesel,
      lpg:       LPG_STATIC_REF,
      lpgIsStatic: true,
      electric:  null,
      source:    SOURCE_LABEL,
      lpgSource: LPG_SOURCE_NOTE,
      fetchedAt,
      opetLastUpdate,
      matchedProvince:       match.provinceName,
      matchedGasolineLabel:  match.matchedGasolineLabel,
      matchedDieselLabel:    match.matchedDieselLabel,
      isNationalAverage:     false,
    };
  }

  // City is a district or unrecognised — return national average
  const avg = nationalAverage(pList);
  return {
    ...avg,
    lpg:        LPG_STATIC_REF,
    lpgIsStatic: true,
    electric:   null,
    source:     SOURCE_LABEL,
    lpgSource:  LPG_SOURCE_NOTE,
    fetchedAt,
    opetLastUpdate,
    matchedProvince:   `Türkiye (ulusal ortalama — "${city}" il eşleşmedi)`,
    isNationalAverage: true,
  };
}

// ── Province cache ────────────────────────────────────────────────────────────

async function getProvinceCache(): Promise<CacheEntry | null> {
  const now = Date.now();

  if (_cache && now - _cache.cachedAt < CACHE_TTL_MS) {
    const age = ((now - _cache.cachedAt) / 60_000).toFixed(1);
    console.log(`[fetchFuelPrices] Cache hit — ${age} min old`);
    return _cache;
  }

  console.log("[fetchFuelPrices] Cache miss — fetching", ALL_PRICES_URL);

  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:          "application/json, */*",
      "Accept-Language": "tr-TR,tr;q=0.9",
      Referer:         "https://www.opet.com.tr/akaryakit-fiyatlari",
      Origin:          "https://www.opet.com.tr",
    };

    // Fetch both endpoints in parallel
    const [pricesRes, updateRes] = await Promise.all([
      fetch(ALL_PRICES_URL, { cache: "no-store", headers }),
      fetch(LAST_UPDATE_URL, { cache: "no-store", headers }),
    ]);

    if (!pricesRes.ok) {
      throw new Error(`allprices HTTP ${pricesRes.status}`);
    }

    const rawData: OpetProvinceEntry[] = await pricesRes.json();
    let opetLastUpdate = "";
    if (updateRes.ok) {
      const upd = await updateRes.json() as { lastUpdateDate?: string };
      opetLastUpdate = upd.lastUpdateDate ?? "";
    }

    // Log a short preview of raw response for debugging
    console.log(
      "[fetchFuelPrices] API returned", rawData.length, "entries.",
      "First entry:", JSON.stringify(rawData[0])
    );
    console.log("[fetchFuelPrices] opetLastUpdate:", opetLastUpdate);

    const provinces = rawData.map(parseProvinceEntry).filter((p): p is ProvincePrices => p !== null);

    console.log(
      "[fetchFuelPrices] Parsed", provinces.length, "provinces.",
      "Sample (index 0):", JSON.stringify(provinces[0])
    );

    const entry: CacheEntry = { provinces, opetLastUpdate, cachedAt: now };
    _cache     = entry;
    _lastValid = entry;
    return entry;

  } catch (err) {
    console.error("[fetchFuelPrices] Fetch error:", err);
    if (_lastValid) {
      console.log("[fetchFuelPrices] Using last-valid data from", new Date(_lastValid.cachedAt).toISOString());
      return _lastValid;
    }
    return null;
  }
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseProvinceEntry(entry: OpetProvinceEntry): ProvincePrices | null {
  const gasEntry = entry.prices.find(p => p.productCode === "A100");
  const dieselEntry =
    entry.prices.find(p => p.productCode === "A121") ??   // UltraForce preferred
    entry.prices.find(p => p.productCode === "A128");      // EcoForce fallback

  if (!gasEntry || !dieselEntry) {
    console.warn(
      "[parseProvinceEntry] Missing A100/A121/A128 in",
      entry.provinceName, entry.districtName
    );
    return null;
  }

  return {
    provinceCode: entry.provinceCode,
    provinceName: entry.provinceName,
    gasoline:     gasEntry.amount,
    diesel:       dieselEntry.amount,
    matchedGasolineLabel: gasEntry.productName,    // "Kurşunsuz Benzin 95"
    matchedDieselLabel:   dieselEntry.productName, // "Motorin UltraForce"
  };
}

// ── City matching ─────────────────────────────────────────────────────────────

/** Normalises Turkish characters for comparison */
export function normalizeTurkish(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

function findProvince(provinces: ProvincePrices[], city: string): ProvincePrices | null {
  const normalizedCity = normalizeTurkish(city.trim());

  // Exact match first
  const exact = provinces.find(
    p => normalizeTurkish(p.provinceName) === normalizedCity
  );
  if (exact) return exact;

  // Partial match (city contains province name or vice versa)
  const partial = provinces.find(p => {
    const np = normalizeTurkish(p.provinceName);
    return normalizedCity.includes(np) || np.includes(normalizedCity);
  });
  return partial ?? null;
}

// ── National average ──────────────────────────────────────────────────────────

function nationalAverage(provinces: ProvincePrices[]): {
  gasoline: number;
  diesel:   number;
  matchedGasolineLabel: string;
  matchedDieselLabel:   string;
} {
  if (provinces.length === 0) {
    return {
      gasoline: 0, diesel: 0,
      matchedGasolineLabel: "", matchedDieselLabel: "",
    };
  }
  const avgGas  = provinces.reduce((s, p) => s + p.gasoline, 0) / provinces.length;
  const avgDizel = provinces.reduce((s, p) => s + p.diesel,  0) / provinces.length;
  return {
    gasoline: Math.round(avgGas   * 100) / 100,
    diesel:   Math.round(avgDizel * 100) / 100,
    matchedGasolineLabel: "Kurşunsuz Benzin 95 (ulusal ortalama)",
    matchedDieselLabel:   "Motorin UltraForce (ulusal ortalama)",
  };
}
