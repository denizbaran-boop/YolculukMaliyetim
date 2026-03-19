import { NextRequest, NextResponse } from "next/server";
import {
  getPricesForCity,
  validateFuelPrices,
  TURKEY_AVERAGE,
  FUEL_PRODUCT_MAP,
} from "@/data/fuelPrices";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "";

  if (!city.trim()) {
    // No city provided — return Turkey average
    const updatedAt = new Date().toISOString();

    console.log("[fuel/route] No city provided — using Turkey average", {
      sourceCity:     "turkey_average",
      sourceType:     "static_average",
      parsedGasoline: TURKEY_AVERAGE.gasoline,
      parsedDiesel:   TURKEY_AVERAGE.diesel,
      parsedLPG:      TURKEY_AVERAGE.lpg,
      productMap:     FUEL_PRODUCT_MAP,
      updatedAt,
    });

    return NextResponse.json({
      ...TURKEY_AVERAGE,
      city:       "Türkiye",
      updatedAt,
      isFallback: true,
    });
  }

  const { prices, debug } = getPricesForCity(city);

  // Log the full diagnostic trace on the server
  console.log("[fuel/route] Price lookup", {
    selectedCity:   debug.selectedCity,
    sourceCity:     debug.sourceCity,
    sourceType:     debug.sourceType,
    parsedGasoline: debug.parsedGasoline,
    parsedDiesel:   debug.parsedDiesel,
    parsedLPG:      debug.parsedLPG,
    productMap:     FUEL_PRODUCT_MAP,
    updatedAt:      debug.updatedAt,
  });

  // Validate: reject prices that fail range checks or the diesel > gasoline invariant
  if (!validateFuelPrices(prices)) {
    console.error("[fuel/route] Price validation failed — rejecting", prices);
    return NextResponse.json(
      { error: "Geçersiz yakıt fiyatı verisi" },
      { status: 422 }
    );
  }

  return NextResponse.json(prices);
}
