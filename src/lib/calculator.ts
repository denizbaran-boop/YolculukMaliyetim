import type { VehicleVariant, FuelPrices, TripInput, CalculationResult } from "@/types";

/**
 * Adjusts base fuel consumption based on average speed.
 *
 * < 30 km/h  → +20% (city crawl / traffic)
 * 30–60      → +10% (urban driving)
 * 60–100     → base (optimal motorway)
 * 100–130    → +10% (fast motorway)
 * > 130      → +20% (high speed)
 */
export function adjustConsumption(baseConsumption: number, avgSpeed: number): number {
  let factor = 1.0;
  if (avgSpeed < 30) factor = 1.2;
  else if (avgSpeed < 60) factor = 1.1;
  else if (avgSpeed <= 100) factor = 1.0;
  else if (avgSpeed <= 130) factor = 1.1;
  else factor = 1.2;

  return baseConsumption * factor;
}

/**
 * Returns the fuel price for a given fuel type from a FuelPrices object.
 * Hybrid vehicles use gasoline price.
 */
export function getFuelPrice(fuelType: VehicleVariant["fuelType"], prices: FuelPrices): number {
  switch (fuelType) {
    case "gasoline":
      return prices.gasoline;
    case "diesel":
      return prices.diesel;
    case "electric":
      return prices.electric;
    case "lpg":
      return prices.lpg;
    case "hybrid":
      // Hybrid: mostly gasoline
      return prices.gasoline;
  }
}

/**
 * Core trip cost calculation.
 */
export function calculate(
  variant: VehicleVariant,
  trip: TripInput,
  prices: FuelPrices
): CalculationResult {
  // Derive avgSpeed and duration depending on mode
  let avgSpeed: number;
  let duration: number; // minutes

  if (trip.mode === "duration") {
    const durationMinutes = trip.duration ?? 60;
    const durationHours = durationMinutes / 60;
    avgSpeed = durationHours > 0 ? trip.distance / durationHours : 0;
    duration = durationMinutes;
  } else {
    avgSpeed = trip.avgSpeed ?? 90;
    const durationHours = avgSpeed > 0 ? trip.distance / avgSpeed : 0;
    duration = durationHours * 60;
  }

  // Adjust consumption for speed
  const adjustedConsumption = adjustConsumption(variant.consumption, avgSpeed);

  // Calculate fuel used
  const fuelUsed = (trip.distance * adjustedConsumption) / 100;

  // Get price per unit
  const pricePerUnit = getFuelPrice(variant.fuelType, prices);

  // Total cost
  const totalCost = fuelUsed * pricePerUnit;

  // Cost per person
  const people = Math.max(1, trip.peopleCount);
  const costPerPerson = totalCost / people;

  return {
    fuelUsed: Math.round(fuelUsed * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerPerson: Math.round(costPerPerson * 100) / 100,
    avgSpeed: Math.round(avgSpeed * 10) / 10,
    duration: Math.round(duration),
    adjustedConsumption: Math.round(adjustedConsumption * 100) / 100,
  };
}

/** Format minutes to a human-readable string (e.g. "2 saat 35 dk") */
export function formatDuration(minutes: number): string {
  if (!isFinite(minutes) || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} saat`;
  return `${h} saat ${m} dk`;
}

/** Format TL currency */
export function formatTL(amount: number): string {
  if (!isFinite(amount)) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Fuel unit label */
export function fuelUnitLabel(fuelType: VehicleVariant["fuelType"]): string {
  return fuelType === "electric" ? "kWh" : "L";
}
