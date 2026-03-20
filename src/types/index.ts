export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "lpg";

export interface VehicleVariant {
  id: string;
  label: string; // e.g. "1.8 Hybrid CVT"
  fuelType: FuelType;
  consumption: number; // L/100km for liquid fuels, kWh/100km for EV
  engineSize?: string;    // e.g. "1.8"
  transmission?: string;  // e.g. "Manuel", "Otomatik", "CVT", "DSG"
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  variants: VehicleVariant[];
}

export interface FuelPrices {
  city: string;
  updatedAt: string; // ISO timestamp
  gasoline: number; // TL per litre
  diesel: number;
  lpg: number;
  electric: number; // TL per kWh
  isFallback: boolean;
  source?: string;  // e.g. "Opet İstanbul Avrupa"
}

export type TripMode = "duration" | "speed" | "manual";

export interface TripInput {
  distance: number; // km
  mode: TripMode;
  duration?: number; // minutes total
  avgSpeed?: number; // km/h
  peopleCount: number;
}

export interface CalculationResult {
  fuelUsed: number; // litres or kWh
  totalCost: number; // TL
  costPerPerson: number; // TL
  avgSpeed: number; // km/h
  duration: number; // minutes
  adjustedConsumption: number; // L or kWh per 100km
}
