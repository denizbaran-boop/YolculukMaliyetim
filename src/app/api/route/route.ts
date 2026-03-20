/**
 * /api/route — proxies Google Routes API (computeRoutes)
 *
 * Query params:
 *   originPlaceId:      string  — Google Place ID for origin
 *   destinationPlaceId: string  — Google Place ID for destination
 *
 * Returns:
 *   { distanceKm, durationText, durationMinutes, polyline, source, fetchedAt }
 *
 * Required env var: GOOGLE_MAPS_API_KEY
 * Required Google APIs: Routes API
 */
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const ROUTE_TTL_MS = 10 * 60 * 1000;

type CachedRoute = {
  expiresAt: number;
  payload: {
    distanceKm: number;
    durationText: string;
    durationMinutes: number;
    polyline: string | null;
    origin: { lat: number; lng: number } | null;
    destination: { lat: number; lng: number } | null;
    source: string;
    fetchedAt: string;
  };
};

const routeCache = new Map<string, CachedRoute>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const originPlaceId      = searchParams.get("originPlaceId")?.trim();
  const destinationPlaceId = searchParams.get("destinationPlaceId")?.trim();

  if (!originPlaceId || !destinationPlaceId) {
    return NextResponse.json(
      { error: "originPlaceId ve destinationPlaceId zorunludur" },
      { status: 400 }
    );
  }
  if (originPlaceId === destinationPlaceId) {
    return NextResponse.json(
      { error: "Başlangıç ve varış noktası farklı olmalıdır" },
      { status: 400 }
    );
  }
  const cacheKey = `${originPlaceId}::${destinationPlaceId}`;
  const now = Date.now();
  const cached = routeCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.payload, {
      headers: {
        "Cache-Control": "private, max-age=0, must-revalidate",
        "X-Route-Cache": "HIT",
      },
    });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("[route/route] GOOGLE_MAPS_API_KEY not set");
    return NextResponse.json({ error: "Harita servisi yapılandırılmamış" }, { status: 500 });
  }

  const body = {
    origin:      { placeId: originPlaceId },
    destination: { placeId: destinationPlaceId },
    travelMode:            "DRIVE",
    routingPreference:     "TRAFFIC_UNAWARE",
    computeAlternativeRoutes: false,
    languageCode: "tr-TR",
    units:        "METRIC",
  };

  let data: Record<string, unknown>;
  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type":       "application/json",
        "X-Goog-Api-Key":     apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.startLocation.latLng,routes.legs.endLocation.latLng",
      },
      body:   JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[route/route] Routes API HTTP", res.status, errText);
      return NextResponse.json({ error: "Güzergah hesaplanamadı" }, { status: 502 });
    }
    data = await res.json() as Record<string, unknown>;
  } catch (err) {
    console.error("[route/route] fetch failed:", err);
    return NextResponse.json({ error: "Güzergah servisi erişilemedi" }, { status: 502 });
  }

  type RouteEntry = {
    distanceMeters?: number;
    duration?: string;
    polyline?: { encodedPolyline?: string };
    legs?: Array<{
      startLocation?: { latLng?: { latitude?: number; longitude?: number } };
      endLocation?: { latLng?: { latitude?: number; longitude?: number } };
    }>;
  };

  const routes = (data.routes ?? []) as RouteEntry[];
  const route  = routes[0];

  if (!route) {
    return NextResponse.json({ error: "Güzergah bulunamadı" }, { status: 404 });
  }

  const distanceMeters  = route.distanceMeters ?? 0;
  const distanceKm      = Math.round((distanceMeters / 1000) * 10) / 10;

  // duration arrives as "NNNs" (seconds)
  const durationSeconds = Math.max(
    0,
    Math.round(parseFloat((route.duration ?? "0s").replace("s", "")) || 0)
  );
  const durationMinutes = Math.round(durationSeconds / 60);
  const h = Math.floor(durationMinutes / 60);
  const m = durationMinutes % 60;
  const durationText = h > 0
    ? (m > 0 ? `${h} saat ${m} dk` : `${h} saat`)
    : `${m} dk`;

  const firstLeg = route.legs?.[0];
  const originLat = firstLeg?.startLocation?.latLng?.latitude;
  const originLng = firstLeg?.startLocation?.latLng?.longitude;
  const destinationLat = firstLeg?.endLocation?.latLng?.latitude;
  const destinationLng = firstLeg?.endLocation?.latLng?.longitude;

  const payload = {
    distanceKm,
    durationText,
    durationMinutes,
    polyline: route.polyline?.encodedPolyline ?? null,
    origin:
      typeof originLat === "number" && typeof originLng === "number"
        ? { lat: originLat, lng: originLng }
        : null,
    destination:
      typeof destinationLat === "number" && typeof destinationLng === "number"
        ? { lat: destinationLat, lng: destinationLng }
        : null,
    source: "Google Routes API",
    fetchedAt: new Date().toISOString(),
  };

  routeCache.set(cacheKey, { expiresAt: now + ROUTE_TTL_MS, payload });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Route-Cache": "MISS",
    },
  });
}
