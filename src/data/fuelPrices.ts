import type { FuelPrices } from "@/types";

/**
 * Reference fuel prices for Turkish cities — March 2026.
 *
 * Source basis: OPET pump prices observed ~March 2026.
 * Example: OPET Istanbul (Avrupa bölgesi)
 *   Benzin 95: ~62.02 ₺/L
 *   Motorin:   ~65.94 ₺/L
 *
 * ⚠ KEY RULE: In Turkey, diesel (motorin) is MORE EXPENSIVE than gasoline (benzin).
 *   diesel > gasoline is a required invariant. If this is violated, the data is wrong.
 *
 * All prices are static reference values (no live API).
 * isFallback is always true — UI will show "Veriler güncel olmayabilir".
 *
 * Validation thresholds (reject values below these):
 *   diesel    ≥ 60 TL/L  (motorin is the pricier fuel)
 *   gasoline  ≥ 55 TL/L
 *   lpg       ≥ 25 TL/L
 *   electric  ≥  5 TL/kWh
 */

/** Product mapping — canonical names ensure no mixing of fuel types */
export const FUEL_PRODUCT_MAP = {
  gasoline: "Benzin 95",
  diesel:   "Motorin",
  lpg:      "Otogaz LPG",
  electric: "Elektrik (kWh)",
} as const;

const CITY_PRICES: Record<string, Omit<FuelPrices, "city" | "updatedAt" | "isFallback">> = {
  //            benzin  motorin   lpg    elektrik
  istanbul:  { gasoline: 62.02, diesel: 65.94, lpg: 32.10, electric: 8.90 },
  ankara:    { gasoline: 62.05, diesel: 65.97, lpg: 32.05, electric: 8.75 },
  izmir:     { gasoline: 62.10, diesel: 66.02, lpg: 32.20, electric: 8.85 },
  bursa:     { gasoline: 62.08, diesel: 65.99, lpg: 32.15, electric: 8.80 },
  antalya:   { gasoline: 62.15, diesel: 66.07, lpg: 32.30, electric: 8.95 },
  adana:     { gasoline: 62.18, diesel: 66.10, lpg: 32.35, electric: 8.92 },
  konya:     { gasoline: 62.00, diesel: 65.92, lpg: 32.00, electric: 8.72 },
  gaziantep: { gasoline: 62.20, diesel: 66.12, lpg: 32.40, electric: 8.95 },
  kayseri:   { gasoline: 62.08, diesel: 66.00, lpg: 32.18, electric: 8.76 },
  trabzon:   { gasoline: 62.25, diesel: 66.17, lpg: 32.45, electric: 9.00 },
  samsun:    { gasoline: 62.12, diesel: 66.05, lpg: 32.28, electric: 8.82 },
  eskisehir: { gasoline: 62.02, diesel: 65.94, lpg: 32.08, electric: 8.73 },
  mersin:    { gasoline: 62.14, diesel: 66.06, lpg: 32.32, electric: 8.91 },
  diyarbakir:{ gasoline: 62.18, diesel: 66.10, lpg: 32.38, electric: 8.93 },
  kocaeli:   { gasoline: 62.04, diesel: 65.96, lpg: 32.12, electric: 8.78 },
  sakarya:   { gasoline: 62.02, diesel: 65.94, lpg: 32.10, electric: 8.77 },
  manisa:    { gasoline: 62.06, diesel: 65.98, lpg: 32.16, electric: 8.79 },
  balikesir: { gasoline: 62.04, diesel: 65.96, lpg: 32.14, electric: 8.76 },
};

/** Turkey national average — used when city is not in the list */
export const TURKEY_AVERAGE: Omit<FuelPrices, "city" | "updatedAt" | "isFallback"> = {
  gasoline: 62.08,
  diesel:   65.98,
  lpg:      32.15,
  electric: 8.85,
};

// ── Validation ──────────────────────────────────────────────────────────────

/** Per-field range validation */
export function validateFuelPrice(
  type: "gasoline" | "diesel" | "lpg" | "electric",
  value: number
): boolean {
  switch (type) {
    case "diesel":    return value >= 60;  // motorin is pricier
    case "gasoline":  return value >= 55;
    case "lpg":       return value >= 25;
    case "electric":  return value >= 5;
    default:          return true;
  }
}

/** Full set validation — also checks diesel > gasoline (Turkey invariant) */
export function validateFuelPrices(prices: Partial<FuelPrices>): boolean {
  if (prices.diesel    !== undefined && !validateFuelPrice("diesel",    prices.diesel))    return false;
  if (prices.gasoline  !== undefined && !validateFuelPrice("gasoline",  prices.gasoline))  return false;
  if (prices.lpg       !== undefined && !validateFuelPrice("lpg",       prices.lpg))       return false;
  if (prices.electric  !== undefined && !validateFuelPrice("electric",  prices.electric))  return false;

  // Structural invariant: diesel must be more expensive than gasoline in Turkey
  if (prices.diesel !== undefined && prices.gasoline !== undefined) {
    if (prices.diesel < prices.gasoline) return false;
  }

  return true;
}

// ── Lookup ───────────────────────────────────────────────────────────────────

/** Normalises Turkish characters for city matching */
function normaliseCity(name: string): string {
  return name
    .toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

export interface PriceDebug {
  selectedCity: string;      // city name passed by caller
  sourceCity:   string;      // city key matched in CITY_PRICES, or "turkey_average"
  sourceType:   "static_city" | "static_average";
  parsedGasoline: number;
  parsedDiesel:   number;
  parsedLPG:      number;
  updatedAt:      string;
}

export interface PriceResult {
  prices: FuelPrices;
  debug:  PriceDebug;
}

/**
 * Returns prices for a city plus a debug trace.
 * All returned prices are isFallback: true — there is no live price feed.
 */
export function getPricesForCity(cityName: string): PriceResult {
  const norm = normaliseCity(cityName);

  const matched = Object.entries(CITY_PRICES).find(
    ([key]) => norm.includes(key) || key.includes(norm)
  );

  const priceData  = matched ? matched[1] : TURKEY_AVERAGE;
  const sourceCity = matched ? matched[0] : "turkey_average";
  const displayCity = matched ? cityName : "Türkiye";
  const updatedAt  = new Date().toISOString();

  const prices: FuelPrices = {
    ...priceData,
    city:       displayCity,
    updatedAt,
    isFallback: true,   // always — no live API
  };

  const debug: PriceDebug = {
    selectedCity:   cityName,
    sourceCity,
    sourceType:     matched ? "static_city" : "static_average",
    parsedGasoline: priceData.gasoline,
    parsedDiesel:   priceData.diesel,
    parsedLPG:      priceData.lpg,
    updatedAt,
  };

  return { prices, debug };
}
