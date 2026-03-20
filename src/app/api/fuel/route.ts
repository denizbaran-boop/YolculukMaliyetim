/**
 * /api/fuel — live fuel prices for Turkey
 *
 * Deployment strategy:
 *   runtime = 'edge'       → runs at Cloudflare PoP nearest to user.
 *                             For Turkish users this is Istanbul → can reach api.opet.com.tr.
 *   preferredRegion = 'fra1' → if Next.js forces Node.js (e.g. on cache miss that
 *                              can't run at edge), use Frankfurt as the region.
 *
 * Response includes debug fields (liveFetchSucceeded, fallbackReason, matchedProvince…)
 * so the exact runtime path is always visible in DevTools → Network.
 */
export const runtime         = "edge";
export const preferredRegion = "fra1";

import { NextRequest, NextResponse } from "next/server";
import { validateFuelPrices, TURKEY_AVERAGE, FUEL_PRODUCT_MAP } from "@/data/fuelPrices";
import { fetchFuelPricesForCity, normalizeTurkish }             from "@/lib/fetchFuelPrices";
import type { FuelPrices }                                       from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedCity  = searchParams.get("city")?.trim() ?? "";
  const normalizedCity = normalizeTurkish(requestedCity);

  // ── 1. Attempt live Opet JSON API ─────────────────────────────────────────
  let live      = null;
  let liveOk    = false;
  let failReason: string | null = null;

  try {
    live  = await fetchFuelPricesForCity(requestedCity);
    liveOk = true;
  } catch (err) {
    // fetchFuelPricesForCity throws with a descriptive message (includes HTTP status,
    // AbortError on timeout, etc.) — capture it verbatim for the debug response.
    failReason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[fuel/route] live fetch failed:", failReason);
  }

  // ── 2. Validate live data ─────────────────────────────────────────────────
  if (live && liveOk) {
    const candidate: Partial<FuelPrices> = {
      gasoline: live.gasoline,
      diesel:   live.diesel,
      lpg:      live.lpg,
    };
    if (!validateFuelPrices(candidate)) {
      failReason = `Doğrulama başarısız: benzin=${live.gasoline} motorin=${live.diesel} lpg=${live.lpg}`;
      console.error("[fuel/route] validation failed:", candidate);
      liveOk = false;
      live   = null;
    }
  }

  // ── 3. Build success response ──────────────────────────────────────────────
  if (live && liveOk) {
    const prices: FuelPrices = {
      city:       requestedCity || "Türkiye",
      updatedAt:  live.fetchedAt,
      gasoline:   live.gasoline,
      diesel:     live.diesel,
      lpg:        live.lpg,
      electric:   live.electric ?? TURKEY_AVERAGE.electric,
      isFallback: false,
      source:     live.source,
    };

    console.log("[fuel/route] live OK", {
      requestedCity, normalizedCity,
      matchedProvince:   live.matchedProvince,
      isNationalAverage: live.isNationalAverage,
      gasoline: live.gasoline, diesel: live.diesel, lpg: live.lpg,
      opetLastUpdate:    live.opetLastUpdate,
      productMap:        FUEL_PRODUCT_MAP,
    });

    return NextResponse.json(
      {
        ...prices,
        // ── debug fields ────────────────────────────────────────────────────
        requestedCity,
        normalizedCity,
        liveFetchSucceeded: true,
        fallbackReason:     null,
        matchedProvince:    live.matchedProvince,
        isNationalAverage:  live.isNationalAverage,
        opetLastUpdate:     live.opetLastUpdate,
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
      },
      {
        // Let Vercel's CDN cache this response 15 min per city
        headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" },
      }
    );
  }

  // ── 4. Static fallback ────────────────────────────────────────────────────
  console.warn("[fuel/route] static fallback —", failReason);

  const updatedAt = new Date().toISOString();
  const prices: FuelPrices = {
    ...TURKEY_AVERAGE,
    city:       requestedCity || "Türkiye",
    updatedAt,
    isFallback: true,
    source:     "Statik referans (Mart 2026) — canlı veri alınamadı",
  };

  return NextResponse.json({
    ...prices,
    requestedCity,
    normalizedCity,
    liveFetchSucceeded: false,
    fallbackReason:     failReason,
    matchedProvince:    null,
    isNationalAverage:  null,
    opetLastUpdate:     null,
    matchedLabels:  { gasoline: "Statik referans", diesel: "Statik referans", lpg: "Statik referans" },
    parsedValues:   { gasoline: TURKEY_AVERAGE.gasoline, diesel: TURKEY_AVERAGE.diesel, lpg: TURKEY_AVERAGE.lpg, electric: TURKEY_AVERAGE.electric },
  });
}
