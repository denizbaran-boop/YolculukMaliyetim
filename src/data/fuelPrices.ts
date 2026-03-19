import type { FuelPrices } from "@/types";

/**
 * Approximate March 2026 retail fuel prices in TL for major Turkish cities.
 * These are static reference values — NOT live data.
 *
 * Since there is no external live fuel-price API, all prices are marked
 * isFallback: true so the UI always shows "Veriler güncel olmayabilir".
 *
 * Validation thresholds (reject if below):
 *   diesel    < 50 TL/L
 *   gasoline  < 55 TL/L
 *   lpg       < 25 TL/L
 *   electric  < 5  TL/kWh
 */
const CITY_PRICES: Record<string, Omit<FuelPrices, "city" | "updatedAt" | "isFallback">> = {
  istanbul:  { gasoline: 68.55, diesel: 63.25, lpg: 32.10, electric: 8.90 },
  ankara:    { gasoline: 68.50, diesel: 63.20, lpg: 32.05, electric: 8.75 },
  izmir:     { gasoline: 68.65, diesel: 63.35, lpg: 32.20, electric: 8.85 },
  bursa:     { gasoline: 68.55, diesel: 63.25, lpg: 32.15, electric: 8.80 },
  antalya:   { gasoline: 68.70, diesel: 63.40, lpg: 32.30, electric: 8.95 },
  adana:     { gasoline: 68.75, diesel: 63.45, lpg: 32.35, electric: 8.92 },
  konya:     { gasoline: 68.45, diesel: 63.15, lpg: 32.00, electric: 8.72 },
  gaziantep: { gasoline: 68.80, diesel: 63.50, lpg: 32.40, electric: 8.95 },
  kayseri:   { gasoline: 68.60, diesel: 63.30, lpg: 32.18, electric: 8.76 },
  trabzon:   { gasoline: 68.85, diesel: 63.55, lpg: 32.45, electric: 9.00 },
  samsun:    { gasoline: 68.68, diesel: 63.38, lpg: 32.28, electric: 8.82 },
  eskisehir: { gasoline: 68.48, diesel: 63.18, lpg: 32.08, electric: 8.73 },
  mersin:    { gasoline: 68.72, diesel: 63.42, lpg: 32.32, electric: 8.91 },
  diyarbakir:{ gasoline: 68.78, diesel: 63.48, lpg: 32.38, electric: 8.93 },
  kocaeli:   { gasoline: 68.52, diesel: 63.22, lpg: 32.12, electric: 8.78 },
  sakarya:   { gasoline: 68.50, diesel: 63.20, lpg: 32.10, electric: 8.77 },
};

/** Turkey national average — used when city is not in the list */
export const TURKEY_AVERAGE: Omit<FuelPrices, "city" | "updatedAt" | "isFallback"> = {
  gasoline: 68.60,
  diesel:   63.30,
  lpg:      32.15,
  electric: 8.85,
};

/**
 * Validates that fuel prices are within realistic bounds for Turkey.
 * Rejects stale or obviously incorrect values before they reach the UI.
 */
export function validateFuelPrice(type: keyof typeof TURKEY_AVERAGE, value: number): boolean {
  switch (type) {
    case "diesel":    return value >= 50;
    case "gasoline":  return value >= 55;
    case "lpg":       return value >= 25;
    case "electric":  return value >= 5;
    default:          return true;
  }
}

export function validateFuelPrices(prices: Partial<FuelPrices>): boolean {
  if (prices.diesel    !== undefined && !validateFuelPrice("diesel",    prices.diesel))    return false;
  if (prices.gasoline  !== undefined && !validateFuelPrice("gasoline",  prices.gasoline))  return false;
  if (prices.lpg       !== undefined && !validateFuelPrice("lpg",       prices.lpg))       return false;
  if (prices.electric  !== undefined && !validateFuelPrice("electric",  prices.electric))  return false;
  return true;
}

/**
 * Normalises Turkish characters and matches a city name to a price record.
 * All returned prices carry isFallback: true because this is static reference data,
 * not a live API feed. The UI will show "Veriler güncel olmayabilir" accordingly.
 */
export function getPricesForCity(cityName: string): FuelPrices {
  const normalised = cityName
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");

  const matched = Object.entries(CITY_PRICES).find(
    ([key]) => normalised.includes(key) || key.includes(normalised)
  );

  const prices = matched ? matched[1] : TURKEY_AVERAGE;
  const displayCity = matched ? cityName : "Türkiye";

  // Always isFallback: true — we have no live price feed
  return {
    ...prices,
    city: displayCity,
    updatedAt: new Date().toISOString(),
    isFallback: true,
  };
}
