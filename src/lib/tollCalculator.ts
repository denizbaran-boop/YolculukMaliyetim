/**
 * Toll cost calculator.
 *
 * This is the single entry point that UI / page components call to obtain the
 * total toll cost for a route. It delegates:
 *   - Detection → src/lib/tollMatcher.ts
 *   - Tariff data → src/data/tolls.ts
 *
 * Neither this file nor the caller needs to know which tolls exist or what
 * their prices are. Swapping the data source (API, CMS, remote JSON) only
 * requires changes in src/data/tolls.ts and, optionally, the matching logic.
 */

import type { VehicleClass } from "@/data/tolls";
import { matchTolls } from "@/lib/tollMatcher";
import type { RouteInfo } from "@/components/RouteInput";

/**
 * Calculates the total toll / bridge cost for a given route.
 *
 * @param routeInfo     Route returned by the Google Routes API proxy.
 *                      Must include originName and destinationName for keyword
 *                      matching, and origin/destination lat-lng for geo matching.
 * @param vehicleClass  OGS vehicle class (default: "class1" — standard car).
 * @returns             Total toll cost in TRY, rounded to 2 decimal places.
 *                      Returns 0 if no tolls are detected or routeInfo is null.
 */
export function calculateTollCost(
  routeInfo: RouteInfo | null,
  vehicleClass: VehicleClass = "class1"
): number {
  if (!routeInfo) return 0;

  const matched = matchTolls(routeInfo);

  const total = matched.reduce((sum, toll) => {
    // Fall back to class1 price if the requested class is not defined
    const price = toll.prices[vehicleClass] ?? toll.prices.class1;
    return sum + price;
  }, 0);

  return Math.round(total * 100) / 100;
}

/**
 * Returns the list of toll names detected for a route.
 * Useful for displaying which specific tolls were included in the estimate.
 */
export function matchedTollNames(routeInfo: RouteInfo | null): string[] {
  if (!routeInfo) return [];
  return matchTolls(routeInfo).map((t) => t.name);
}
