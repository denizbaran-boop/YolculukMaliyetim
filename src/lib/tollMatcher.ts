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

import { TOLL_RECORDS, TOLL_ROUTES } from "@/data/tolls";
import type { TollRecord, TollRoute, GeoZone } from "@/data/tolls";
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

// ── Full corridor matching (priority over segments) ───────────────────────────

/**
 * Returns the first TollRoute whose from/to keywords match the given route,
 * or null if no corridor applies.
 *
 * Matching is bidirectional: origin∈from & dest∈to  OR  origin∈to & dest∈from.
 * When a corridor matches, the caller should use its price directly and skip
 * segment summation entirely.
 */
export function matchCorridor(routeInfo: RouteInfo): TollRoute | null {
  const { originName, destinationName, distanceKm } = routeInfo;

  if (!originName || !destinationName) return null;

  for (const route of TOLL_ROUTES) {
    const minDist = route.minDistanceKm ?? 0;

    if (distanceKm < minDist) {
      console.log(
        `[TollMatcher] Corridor ${route.id}: skipped ` +
        `(distance ${distanceKm} km < threshold ${minDist} km)`
      );
      continue;
    }

    const fwd =
      hasKeyword(originName, route.from) && hasKeyword(destinationName, route.to);
    const rev =
      hasKeyword(originName, route.to) && hasKeyword(destinationName, route.from);

    if (fwd || rev) {
      const dir = fwd
        ? `"${originName}" → "${destinationName}"`
        : `"${destinationName}" → "${originName}" (reverse)`;
      console.log(
        `[TollMatcher] ✓ Corridor match: ${route.id} — "${route.name}" — ₺${route.prices.class1} (class1)`
      );
      console.log(`[TollMatcher]   via: ${dir}`);
      return route;
    }
  }

  console.log(`[TollMatcher] No corridor match — falling back to segment calculation`);
  return null;
}

// ── Segment matching logic ────────────────────────────────────────────────────

/**
 * Returns every TollRecord that is triggered by the given route.
 *
 * Detection order:
 *   1. Minimum distance filter (skip if route is shorter than the toll's threshold).
 *   2. Keyword corridor matching on originName / destinationName.
 *   3. Geographic zone matching on origin / destination lat-lng.
 *
 * Each record is included at most once regardless of how many corridors match.
 *
 * Debug output is written to the browser/server console so you can verify
 * which segments were detected and why. Look for [TollMatcher] in the console.
 */
export function matchTolls(routeInfo: RouteInfo): TollRecord[] {
  const matched: TollRecord[] = [];
  const skipped: Array<{ id: string; reason: string }> = [];

  console.log(
    `[TollMatcher] ── Route: "${routeInfo.originName ?? "?"}" → "${routeInfo.destinationName ?? "?"}" ` +
    `(${routeInfo.distanceKm} km) ──`
  );
  console.log(
    `[TollMatcher]    Origin  coords: ${routeInfo.origin ? `${routeInfo.origin.lat.toFixed(4)}, ${routeInfo.origin.lng.toFixed(4)}` : "n/a"}`
  );
  console.log(
    `[TollMatcher]    Dest    coords: ${routeInfo.destination ? `${routeInfo.destination.lat.toFixed(4)}, ${routeInfo.destination.lng.toFixed(4)}` : "n/a"}`
  );

  for (const toll of TOLL_RECORDS) {
    const minDist = toll.minDistanceKm ?? 0;

    if (routeInfo.distanceKm < minDist) {
      skipped.push({ id: toll.id, reason: `distance ${routeInfo.distanceKm} km < threshold ${minDist} km` });
      continue;
    }

    let detected = false;
    let detectedVia = "";

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

        if (origInA && destInB) {
          detected = true;
          detectedVia = `keyword corridor (origin "${routeInfo.originName}" ∈ sideA, dest "${routeInfo.destinationName}" ∈ sideB)`;
          break;
        }
        if (origInB && destInA) {
          detected = true;
          detectedVia = `keyword corridor (origin "${routeInfo.originName}" ∈ sideB, dest "${routeInfo.destinationName}" ∈ sideA — reverse)`;
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

      if (originInA && destInB) {
        detected = true;
        detectedVia = `geo zone (origin in zone-A, dest in zone-B)`;
      } else if (originInB && destInA) {
        detected = true;
        detectedVia = `geo zone (origin in zone-B, dest in zone-A — reverse)`;
      }

      if (!detected) {
        console.log(
          `[TollMatcher]    ${toll.id}: geo zone miss — ` +
          `origin(inA=${originInA}, inB=${originInB}), dest(inA=${destInA}, inB=${destInB})`
        );
      }
    }

    if (detected) {
      matched.push(toll);
      console.log(
        `[TollMatcher] ✓  ${toll.id} — "${toll.name}" — ₺${toll.prices.class1} (class1)` +
        `\n              via: ${detectedVia}`
      );
    } else {
      skipped.push({ id: toll.id, reason: "no corridor or geo zone matched" });
    }
  }

  if (skipped.length > 0) {
    console.log(
      `[TollMatcher] ✗  Skipped: ` +
      skipped.map((s) => `${s.id} (${s.reason})`).join(" | ")
    );
  }

  const total = matched.reduce((s, t) => s + t.prices.class1, 0);
  console.log(
    `[TollMatcher] ── Total class1: ₺${total} (${matched.length} segment${matched.length !== 1 ? "s" : ""}: ` +
    `${matched.map((t) => t.id).join(" + ") || "none"}) ──`
  );

  return matched;
}
