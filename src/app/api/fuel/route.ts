import { NextRequest, NextResponse } from "next/server";
import { getPricesForCity, validateFuelPrices, TURKEY_AVERAGE } from "@/data/fuelPrices";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "";

  if (!city.trim()) {
    // No city provided — return Turkey average
    return NextResponse.json({
      ...TURKEY_AVERAGE,
      city: "Türkiye",
      updatedAt: new Date().toISOString(),
      isFallback: true,
    });
  }

  const prices = getPricesForCity(city);

  // Validate the prices are realistic
  if (!validateFuelPrices(prices)) {
    return NextResponse.json(
      { error: "Geçersiz yakıt fiyatı verisi" },
      { status: 422 }
    );
  }

  return NextResponse.json(prices);
}
