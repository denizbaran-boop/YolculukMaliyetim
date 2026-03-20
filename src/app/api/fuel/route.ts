import { NextRequest, NextResponse } from "next/server";
import {
  validateFuelPrices,
  TURKEY_AVERAGE,
  FUEL_PRODUCT_MAP,
} from "@/data/fuelPrices";
import { fetchFuelPrices } from "@/lib/fetchFuelPrices";
import type { FuelPrices } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim() ?? "";

  // ── 1. Attempt live fetch (with in-memory 15-min cache) ─────────────────
  const live = await fetchFuelPrices();

  if (live) {
    const prices: FuelPrices = {
      city:      city || "Türkiye",
      updatedAt: live.fetchedAt,
      gasoline:  live.gasoline,
      diesel:    live.diesel,
      lpg:       live.lpg,
      // Opet doesn't publish EV charging prices; keep a reference value
      electric:  live.electric ?? TURKEY_AVERAGE.electric,
      isFallback: false,
      source:    live.source,
    };

    console.log("[fuel/route] Live price lookup", {
      city:           prices.city,
      parsedGasoline: prices.gasoline,
      parsedDiesel:   prices.diesel,
      parsedLPG:      prices.lpg,
      source:         prices.source,
      fetchedAt:      prices.updatedAt,
      productMap:     FUEL_PRODUCT_MAP,
    });

    // Validate plausibility + diesel > gasoline invariant
    if (!validateFuelPrices(prices)) {
      console.error(
        "[fuel/route] Live prices failed validation — falling back to static",
        { gasoline: prices.gasoline, diesel: prices.diesel, lpg: prices.lpg }
      );
      return staticFallback(city);
    }

    return NextResponse.json(prices);
  }

  // ── 2. Live fetch unavailable — use static reference prices ──────────────
  console.warn("[fuel/route] Live data unavailable — using static fallback");
  return staticFallback(city);
}

// ── Static fallback ───────────────────────────────────────────────────────────

function staticFallback(city: string): NextResponse {
  const updatedAt = new Date().toISOString();
  const prices: FuelPrices = {
    ...TURKEY_AVERAGE,
    city:      city || "Türkiye",
    updatedAt,
    isFallback: true,
    source:    "Statik referans verisi (Mart 2026)",
  };

  console.log("[fuel/route] Static fallback", {
    city:           prices.city,
    parsedGasoline: TURKEY_AVERAGE.gasoline,
    parsedDiesel:   TURKEY_AVERAGE.diesel,
    parsedLPG:      TURKEY_AVERAGE.lpg,
    productMap:     FUEL_PRODUCT_MAP,
    updatedAt,
  });

  return NextResponse.json(prices);
}
