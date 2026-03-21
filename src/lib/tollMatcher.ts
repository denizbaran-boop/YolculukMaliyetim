/**
 * Toll route matcher.
 *
 * Given a RouteInfo object, determines which toll records from src/data/tolls.ts
 * apply to the route using two complementary strategies:
 *
 *   1. Keyword corridor matching — checks place-name strings (originName /
 *      destinationName) against each toll record's corridor keyword lists.
 *   2. Geographic zone matching — checks whether origin/destination coordinates
 *      fall within a toll record's defined bounding-box zones.
 *
 * This module contains NO tariff values. All prices live in src/data/tolls.ts.
 */

import { TOLL_RECORDS } from "@/data/tolls";
import type { TollRecord, GeoZone } from "@/data/tolls";
import type { RouteInfo } from "@/components/RouteInput";

// ── Text normalisation ────────────────────────────────────────────────────────

/**
 * Normalises a string for case-insensitive, accent-insensitive keyword matching.
 * Handles Turkish-specific characters (İ, ı, ğ, ş, ç, ö, ü) explicitly because
 * JavaScript's built-in locale handling can be inconsistent across runtimes.
 */
function normalizeText(s: string): string {
  return s
    // Replace capital İ before toLowerCase() to avoid the "i̇" combining-dot issue
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

/** Returns true if any of the given keywords appears in the normalised text. */
function hasKeyword(text: string, keywords: string[]): boolean {
  const norm = normalizeText(text);
  return keywords.some((kw) => norm.includes(normalizeText(kw)));
}

// ── Geographic zone helper ────────────────────────────────────────────────────

/** Returns true if the coordinate falls within the bounding box. */
function isInGeoZone(lat: number, lng: number, zone: GeoZone): boolean {
  return (
    lat >= zone.latMin &&
    lat <= zone.latMax &&
    lng >= zone.lngMin &&
    lng <= zone.lngMax
  );
}

// ── Core matching logic ───────────────────────────────────────────────────────

/**
 * Returns every TollRecord that is triggered by the given route.
 *
 * Detection order:
 *   1. Minimum distance filter (skip if route is shorter than the toll's threshold).
 *   2. Keyword corridor matching on originName / destinationName.
 *   3. Geographic zone matching on origin / destination lat-lng.
 *
 * Each record is included at most once regardless of how many corridors match.
 */
export function matchTolls(routeInfo: RouteInfo): TollRecord[] {
  const matched: TollRecord[] = [];

  for (const toll of TOLL_RECORDS) {
    const minDist = toll.minDistanceKm ?? 0;
    if (routeInfo.distanceKm < minDist) continue;

    let detected = false;

    // ── Strategy 1: keyword corridor matching ──────────────────────────────
    if (
      !detected &&
      toll.corridors &&
      routeInfo.originName &&
      routeInfo.destinationName
    ) {
      for (const corridor of toll.corridors) {
        const origInA = hasKeyword(routeInfo.originName, corridor.sideA);
        const destInB = hasKeyword(routeInfo.destinationName, corridor.sideB);
        const origInB = hasKeyword(routeInfo.originName, corridor.sideB);
        const destInA = hasKeyword(routeInfo.destinationName, corridor.sideA);

        if ((origInA && destInB) || (origInB && destInA)) {
          detected = true;
          break;
        }
      }
    }

    // ── Strategy 2: geographic zone matching ──────────────────────────────
    if (!detected && toll.geoZones && routeInfo.origin && routeInfo.destination) {
      const { a, b } = toll.geoZones;

      const originInA = isInGeoZone(routeInfo.origin.lat, routeInfo.origin.lng, a);
      const originInB = isInGeoZone(routeInfo.origin.lat, routeInfo.origin.lng, b);
      const destInA   = isInGeoZone(routeInfo.destination.lat, routeInfo.destination.lng, a);
      const destInB   = isInGeoZone(routeInfo.destination.lat, routeInfo.destination.lng, b);

      if ((originInA && destInB) || (originInB && destInA)) {
        detected = true;
      }
    }

    if (detected) {
      matched.push(toll);
    }
  }

  return matched;
}
