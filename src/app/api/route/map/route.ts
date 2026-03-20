/**
 * /api/route/map — server-side proxy for Google Static Maps route preview
 *
 * Query params:
 *   polyline: string (required, encoded polyline)
 *   originLat, originLng, destinationLat, destinationLng: number (optional)
 */
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const polyline = searchParams.get("polyline")?.trim();
  const originLat = searchParams.get("originLat");
  const originLng = searchParams.get("originLng");
  const destinationLat = searchParams.get("destinationLat");
  const destinationLng = searchParams.get("destinationLng");

  if (!polyline) {
    return NextResponse.json({ error: "polyline zorunludur" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Harita servisi yapılandırılmamış" }, { status: 500 });
  }

  const staticUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");
  staticUrl.searchParams.set("size", "960x460");
  staticUrl.searchParams.set("scale", "2");
  staticUrl.searchParams.set("format", "png");
  staticUrl.searchParams.set("maptype", "roadmap");
  staticUrl.searchParams.set("key", apiKey);
  staticUrl.searchParams.append("path", `weight:5|color:0xA855F7FF|enc:${polyline}`);

  if (originLat && originLng) {
    staticUrl.searchParams.append(
      "markers",
      `size:mid|color:0x10B981|label:B|${originLat},${originLng}`
    );
  }
  if (destinationLat && destinationLng) {
    staticUrl.searchParams.append(
      "markers",
      `size:mid|color:0xEF4444|label:V|${destinationLat},${destinationLng}`
    );
  }

  staticUrl.searchParams.append("style", "feature:all|element:labels.text.fill|color:0xEDE9FE");
  staticUrl.searchParams.append("style", "feature:all|element:labels.text.stroke|color:0x111827");
  staticUrl.searchParams.append("style", "feature:all|element:geometry|color:0x0B1220");
  staticUrl.searchParams.append("style", "feature:road|element:geometry|color:0x1F2937");
  staticUrl.searchParams.append("style", "feature:water|element:geometry|color:0x111827");

  let mapResponse: Response;
  try {
    mapResponse = await fetch(staticUrl.toString(), { signal: AbortSignal.timeout(8000) });
  } catch (error) {
    console.error("[route/map] fetch failed", error);
    return NextResponse.json({ error: "Harita önizlemesi alınamadı" }, { status: 502 });
  }

  if (!mapResponse.ok) {
    const text = await mapResponse.text();
    console.error("[route/map] HTTP", mapResponse.status, text);
    return NextResponse.json({ error: "Harita önizlemesi alınamadı" }, { status: 502 });
  }

  const bytes = await mapResponse.arrayBuffer();
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=600, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
