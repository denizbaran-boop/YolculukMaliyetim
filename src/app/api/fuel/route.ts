import { NextRequest, NextResponse } from "next/server";
import {
  validateFuelPrices,
  TURKEY_AVERAGE,
  FUEL_PRODUCT_MAP,
} from "@/data/fuelPrices";
import { fetchFuelPricesForCity, normalizeTurkish } from "@/lib/fetchFuelPrices";
import type { FuelPrices } from "@/types";

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedCity   = searchParams.get("city")?.trim() ?? "";
  const normalizedCity  = normalizeTurkish(requestedCity);

  // ── 1. Attempt live Opet JSON API fetch ────────────────────────────────────
  let live = null;
  let liveFetchSucceeded = false;
  let fallbackReason: string | null = null;

  try {
    live = await fetchFuelPricesForCity(requestedCity);
    if (live) {
      liveFetchSucceeded = true;
    } else {
      fallbackReason = "Opet API erişilemedi ve önbellekte veri yok";
    }
  } catch (err) {
    fallbackReason = `Opet fetch hatası: ${String(err)}`;
    console.error("[fuel/route] fetchFuelPricesForCity threw:", err);
  }

  // ── 2. Validate live data ─────────────────────────────────────────────────
  if (live && liveFetchSucceeded) {
    const candidate: Partial<FuelPrices> = {
      gasoline: live.gasoline,
      diesel:   live.diesel,
      lpg:      live.lpg,
    };

    if (!validateFuelPrices(candidate)) {
      fallbackReason = `Canlı veri doğrulamadan geçmedi: benzin=${live.gasoline} motorin=${live.diesel} lpg=${live.lpg}`;
      console.error("[fuel/route] Live data failed validation:", candidate);
      liveFetchSucceeded = false;
      live = null;
    }
  }

  // ── 3. Build response ─────────────────────────────────────────────────────
  if (live && liveFetchSucceeded) {
    const prices: FuelPrices = {
      city:      requestedCity || "Türkiye",
      updatedAt: live.fetchedAt,
      gasoline:  live.gasoline,
      diesel:    live.diesel,
      lpg:       live.lpg,
      electric:  live.electric ?? TURKEY_AVERAGE.electric,
      isFallback: false,
      source:    live.source,
    };

    console.log("[fuel/route] Live data OK", {
      requestedCity,
      normalizedCity,
      matchedProvince:      live.matchedProvince,
      isNationalAverage:    live.isNationalAverage,
      gasoline:             live.gasoline,
      diesel:               live.diesel,
      lpg:                  live.lpg,
      matchedGasolineLabel: live.matchedGasolineLabel,
      matchedDieselLabel:   live.matchedDieselLabel,
      opetLastUpdate:       live.opetLastUpdate,
      fetchedAt:            live.fetchedAt,
      productMap:           FUEL_PRODUCT_MAP,
    });

    return NextResponse.json({
      // ── Standard FuelPrices fields ─────────────────────────────────────
      ...prices,

      // ── Debug / transparency fields ────────────────────────────────────
      requestedCity,
      normalizedCity,
      liveFetchSucceeded:   true,
      fallbackReason:       null,
      matchedProvince:      live.matchedProvince,
      isNationalAverage:    live.isNationalAverage,
      opetLastUpdate:       live.opetLastUpdate,
      matchedLabels: {
        gasoline: live.matchedGasolineLabel,
        diesel:   live.matchedDieselLabel,
        lpg:      live.lpgSource,
      },
      parsedValues: {
        gasoline: live.gasoline,
        diesel:   live.diesel,
        lpg:      live.lpg,
        electric: live.electric,
      },
    });
  }

  // ── 4. Static fallback ────────────────────────────────────────────────────
  console.warn("[fuel/route] Static fallback —", fallbackReason);

  const updatedAt = new Date().toISOString();
  const prices: FuelPrices = {
    ...TURKEY_AVERAGE,
    city:       requestedCity || "Türkiye",
    updatedAt,
    isFallback: true,
    source:     "Statik referans verisi (Mart 2026 — canlı veri alınamadı)",
  };

  console.log("[fuel/route] Returning static fallback", {
    requestedCity,
    normalizedCity,
    fallbackReason,
    gasoline: TURKEY_AVERAGE.gasoline,
    diesel:   TURKEY_AVERAGE.diesel,
    lpg:      TURKEY_AVERAGE.lpg,
    productMap: FUEL_PRODUCT_MAP,
    updatedAt,
  });

  return NextResponse.json({
    // ── Standard FuelPrices fields ──────────────────────────────────────
    ...prices,

    // ── Debug / transparency fields ─────────────────────────────────────
    requestedCity,
    normalizedCity,
    liveFetchSucceeded:  false,
    fallbackReason,
    matchedProvince:     null,
    isNationalAverage:   null,
    opetLastUpdate:      null,
    matchedLabels: {
      gasoline: "Statik referans",
      diesel:   "Statik referans",
      lpg:      "Statik referans",
    },
    parsedValues: {
      gasoline: TURKEY_AVERAGE.gasoline,
      diesel:   TURKEY_AVERAGE.diesel,
      lpg:      TURKEY_AVERAGE.lpg,
      electric: TURKEY_AVERAGE.electric,
    },
  });
}
