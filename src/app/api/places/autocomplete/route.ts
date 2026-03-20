/**
 * /api/places/autocomplete — proxies Google Places Autocomplete API
 *
 * Query params:
 *   input: string  — user's search text (min 2 chars)
 *
 * Returns:
 *   { predictions: Array<{ placeId, description, mainText, secondaryText }> }
 *
 * Required env var: GOOGLE_MAPS_API_KEY
 * Required Google API: Places API (New Autocomplete)
 */
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("[places/autocomplete] GOOGLE_MAPS_API_KEY not set");
    return NextResponse.json({ error: "Harita servisi yapılandırılmamış" }, { status: 500 });
  }

  let predictions: Array<{ placeId: string; description: string; mainText: string; secondaryText: string }> = [];
  let newApiRaw: unknown = null;
  let legacyApiRaw: unknown = null;
  let newApiErrorText: string | null = null;
  let legacyApiErrorText: string | null = null;
  try {
    const newApiRes = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat.mainText,suggestions.placePrediction.structuredFormat.secondaryText",
      },
      body: JSON.stringify({
        input,
        languageCode: "tr",
        regionCode: "TR",
        includedRegionCodes: ["TR"],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (newApiRes.ok) {
      const newData = await newApiRes.json() as {
        suggestions?: Array<{
          placePrediction?: {
            placeId?: string;
            text?: { text?: string };
            structuredFormat?: {
              mainText?: { text?: string };
              secondaryText?: { text?: string };
            };
          };
        }>;
      };
      newApiRaw = newData;
      predictions = (newData.suggestions ?? [])
        .map((s) => s.placePrediction)
        .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
        .map((p) => ({
          placeId: p.placeId as string,
          description: p.text?.text ?? "",
          mainText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
          secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
        }));
    } else {
      const newApiError = await newApiRes.text();
      newApiErrorText = newApiError;
      console.warn("[places/autocomplete] New API failed, falling back to legacy", newApiRes.status, newApiError);

      const legacyUrl = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      legacyUrl.searchParams.set("input", input);
      legacyUrl.searchParams.set("key", apiKey);
      legacyUrl.searchParams.set("language", "tr");
      legacyUrl.searchParams.set("components", "country:tr");
      legacyUrl.searchParams.set("types", "geocode");

      const legacyRes = await fetch(legacyUrl.toString(), { signal: AbortSignal.timeout(5000) });
      if (!legacyRes.ok) {
        console.error("[places/autocomplete] legacy HTTP", legacyRes.status);
        return NextResponse.json({ error: "Konum önerileri alınamadı" }, { status: 502 });
      }

      const legacyData = await legacyRes.json() as {
        status?: string;
        error_message?: string;
        predictions?: Array<{
          place_id: string;
          description: string;
          structured_formatting?: { main_text?: string; secondary_text?: string };
        }>;
      };
      legacyApiRaw = legacyData;
      const apiStatus = legacyData.status ?? "UNKNOWN_ERROR";
      if (apiStatus !== "OK" && apiStatus !== "ZERO_RESULTS") {
        legacyApiErrorText = legacyData.error_message ?? null;
        console.error("[places/autocomplete] legacy API status", apiStatus, legacyData.error_message ?? "");
        return NextResponse.json({ error: "Konum önerileri alınamadı" }, { status: 502 });
      }

      predictions = (legacyData.predictions ?? []).map((p) => ({
        placeId: p.place_id,
        description: p.description,
        mainText: p.structured_formatting?.main_text ?? p.description,
        secondaryText: p.structured_formatting?.secondary_text ?? "",
      }));
    }
  } catch (err) {
    console.error("[places/autocomplete] fetch failed:", err);
    return NextResponse.json({ error: "Places API erişilemedi" }, { status: 502 });
  }

  if (predictions.length === 0) {
    console.warn("[places/autocomplete] empty predictions", {
      input,
      newApiErrorText,
      legacyApiErrorText,
      newApiRaw,
      legacyApiRaw,
    });
  }

  return NextResponse.json({ predictions }, {
    headers: { "Cache-Control": "no-store" },
  });
}
