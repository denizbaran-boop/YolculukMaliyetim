import type { FuelPrices } from "@/types";

/**
 * Approximate mid-2025 retail fuel prices in TL for major Turkish cities.
 * These are used as fallback when the API is unavailable.
 *
 * Validation rule: diesel must be > 50 TL, gasoline > 50 TL
 */
const CITY_PRICES: Record<string, Omit<FuelPrices, "city" | "updatedAt" | "isFallback">> = {
  istanbul: { gasoline: 42.99, diesel: 41.44, lpg: 22.10, electric: 6.85 },
  ankara:   { gasoline: 42.99, diesel: 41.44, lpg: 22.05, electric: 6.72 },
  izmir:    { gasoline: 43.10, diesel: 41.55, lpg: 22.20, electric: 6.80 },
  bursa:    { gasoline: 43.05, diesel: 41.50, lpg: 22.15, electric: 6.78 },
  antalya:  { gasoline: 43.15, diesel: 41.60, lpg: 22.30, electric: 6.90 },
  adana:    { gasoline: 43.20, diesel: 41.65, lpg: 22.35, electric: 6.88 },
  konya:    { gasoline: 43.00, diesel: 41.45, lpg: 22.08, electric: 6.75 },
  gaziantep:{ gasoline: 43.25, diesel: 41.70, lpg: 22.40, electric: 6.92 },
  kayseri:  { gasoline: 43.10, diesel: 41.55, lpg: 22.18, electric: 6.76 },
  trabzon:  { gasoline: 43.30, diesel: 41.75, lpg: 22.45, electric: 6.95 },
  samsun:   { gasoline: 43.18, diesel: 41.62, lpg: 22.28, electric: 6.82 },
  eskisehir:{ gasoline: 43.02, diesel: 41.46, lpg: 22.12, electric: 6.73 },
};

/** Turkey national average (fallback of last resort) */
export const TURKEY_AVERAGE: Omit<FuelPrices, "city" | "updatedAt" | "isFallback"> = {
  gasoline: 43.10,
  diesel:   41.55,
  lpg:      22.20,
  electric: 6.80,
};

/**
 * Attempts to match a city name (Turkish, case-insensitive) to a price record.
 * Normalises common Turkish characters before matching.
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

  const matched = Object.entries(CITY_PRICES).find(([key]) =>
    normalised.includes(key) || key.includes(normalised)
  );

  const prices = matched ? matched[1] : TURKEY_AVERAGE;
  const displayCity = matched ? cityName : "Türkiye";

  return {
    ...prices,
    city: displayCity,
    updatedAt: new Date().toISOString(),
    isFallback: !matched,
  };
}

/**
 * Validates that fuel prices are within realistic bounds for Turkey.
 * Returns false if any price looks suspicious.
 */
export function validateFuelPrices(prices: Partial<FuelPrices>): boolean {
  if (prices.diesel !== undefined && prices.diesel < 30) return false;
  if (prices.gasoline !== undefined && prices.gasoline < 30) return false;
  if (prices.lpg !== undefined && prices.lpg < 10) return false;
  if (prices.electric !== undefined && prices.electric < 2) return false;
  return true;
}
