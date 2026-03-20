import type { FuelPrices } from "@/types";

/**
 * Static reference fuel prices for Turkey — used ONLY as a fallback when the
 * live Opet fetch fails AND no cached live data exists.
 *
 * Source basis: OPET pump prices observed ~March 2026.
 *   Benzin 95: ~62.02 ₺/L
 *   Motorin:   ~65.94 ₺/L
 *
 * ⚠ KEY RULE: In Turkey, diesel (motorin) is MORE EXPENSIVE than gasoline.
 *   diesel > gasoline is a required invariant. If violated, the data is wrong.
 *
 * Validation thresholds (reject values below these):
 *   diesel    ≥ 60 TL/L
 *   gasoline  ≥ 55 TL/L
 *   lpg       ≥ 25 TL/L
 *   electric  ≥  5 TL/kWh
 */

/** Product mapping — canonical names used for logging and display */
export const FUEL_PRODUCT_MAP = {
  gasoline: "Benzin 95",
  diesel:   "Motorin",
  lpg:      "Otogaz LPG",
  electric: "Elektrik (kWh)",
} as const;

/** Turkey national reference average — static fallback ONLY */
export const TURKEY_AVERAGE: Omit<FuelPrices, "city" | "updatedAt" | "isFallback" | "source"> = {
  gasoline: 62.08,
  diesel:   65.98,
  lpg:      32.15,
  electric: 8.85,
};

// ── Validation ────────────────────────────────────────────────────────────────

/** Per-field range validation */
export function validateFuelPrice(
  type: "gasoline" | "diesel" | "lpg" | "electric",
  value: number
): boolean {
  switch (type) {
    case "diesel":   return value >= 60;  // motorin is pricier
    case "gasoline": return value >= 55;
    case "lpg":      return value >= 25;
    case "electric": return value >= 5;
    default:         return true;
  }
}

/** Full set validation — also checks diesel > gasoline (Turkey invariant) */
export function validateFuelPrices(prices: Partial<FuelPrices>): boolean {
  if (prices.diesel    !== undefined && !validateFuelPrice("diesel",    prices.diesel))   return false;
  if (prices.gasoline  !== undefined && !validateFuelPrice("gasoline",  prices.gasoline)) return false;
  if (prices.lpg       !== undefined && !validateFuelPrice("lpg",       prices.lpg))      return false;
  if (prices.electric  !== undefined && !validateFuelPrice("electric",  prices.electric)) return false;

  // Structural invariant: diesel must be more expensive than gasoline in Turkey
  if (prices.diesel !== undefined && prices.gasoline !== undefined) {
    if (prices.diesel < prices.gasoline) return false;
  }

  return true;
}
