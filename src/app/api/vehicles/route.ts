import { NextRequest, NextResponse } from "next/server";
import { VEHICLES, getMakes, getModels, getYears, getVariants } from "@/data/vehicles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  // Return variants for a specific make+model+year
  if (make && model && year) {
    const variants = getVariants(make, model, parseInt(year));
    return NextResponse.json({ variants });
  }

  // Return years for a specific make+model
  if (make && model) {
    const years = getYears(make, model);
    return NextResponse.json({ years });
  }

  // Return models for a specific make
  if (make) {
    const models = getModels(make);
    return NextResponse.json({ models });
  }

  // Return all makes
  const makes = getMakes();
  return NextResponse.json({ makes, total: VEHICLES.length });
}
