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
 * Required Google API: Places API (legacy autocomplete endpoint)
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

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "tr");
  url.searchParams.set("components", "country:tr");
  url.searchParams.set("types", "geocode");

  let data: Record<string, unknown>;
  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      console.error("[places/autocomplete] HTTP", res.status);
      return NextResponse.json({ error: "Places API hatası" }, { status: 502 });
    }
    data = await res.json() as Record<string, unknown>;
  } catch (err) {
    console.error("[places/autocomplete] fetch failed:", err);
    return NextResponse.json({ error: "Places API erişilemedi" }, { status: 502 });
  }

  type RawPrediction = {
    place_id: string;
    description: string;
    structured_formatting?: { main_text?: string; secondary_text?: string };
  };

  const apiStatus = typeof data.status === "string" ? data.status : "UNKNOWN_ERROR";
  if (apiStatus !== "OK" && apiStatus !== "ZERO_RESULTS") {
    console.error("[places/autocomplete] API status", apiStatus, data.error_message ?? "");
    return NextResponse.json({ error: "Konum önerileri alınamadı" }, { status: 502 });
  }

  const predictions = ((data.predictions ?? []) as RawPrediction[]).map((p) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text ?? p.description,
    secondaryText: p.structured_formatting?.secondary_text ?? "",
  }));

  return NextResponse.json({ predictions }, {
    headers: { "Cache-Control": "no-store" },
  });
}
