/**
 * Toll & bridge tariff data for Turkey.
 *
 * Architecture contract:
 *   - This file is the SINGLE source of truth for all tariff values.
 *   - Business logic (route matching, cost summation) lives in:
 *       src/lib/tollMatcher.ts   — detection
 *       src/lib/tollCalculator.ts — summation
 *   - To update prices: edit ONLY this file.
 *   - Future integrations (official API, CMS, remote JSON) should replace this
 *     file's export without touching any other file in the codebase.
 *
 * Official sources for price verification:
 *   - KGM (Karayolları Genel Müdürlüğü): kgm.gov.tr
 *   - HGS / OGS: hgs.com.tr, ogsgecis.com.tr
 *
 * Last manual update: 2025-03
 */

/** OGS/HGS vehicle classification */
export type VehicleClass = "class1" | "class2" | "class3";

/** Prices in TRY, keyed by vehicle class */
export interface TollPrices {
  /** Otomobil / Motosiklet (OGS Sınıf 1) */
  class1: number;
  /** Minibüs / Kamyonet (OGS Sınıf 2) */
  class2?: number;
  /** Otobüs / Kamyon (OGS Sınıf 3+) */
  class3?: number;
}

/**
 * A rectangular geographic bounding box.
 * Used to check whether an origin/destination coordinate lies within a zone.
 */
export interface GeoZone {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

/**
 * A keyword-based corridor definition.
 * The toll is triggered when the route goes from a place matching sideA keywords
 * to a place matching sideB keywords, or vice versa.
 * Matching is case-insensitive and Turkish-accent-normalised.
 */
export interface TollCorridor {
  /** Place-name keywords for one side of the toll point */
  sideA: string[];
  /** Place-name keywords for the other side */
  sideB: string[];
}

export interface TollRecord {
  /** Unique identifier — used for deduplication */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Alternative names / road identifiers */
  aliases: string[];
  prices: TollPrices;
  /** Optional note displayed in the UI or used for debugging */
  note?: string;
  /**
   * Keyword corridors for place-name based detection.
   * The toll fires when the route origin matches sideA and destination matches sideB
   * (or the reverse). Multiple corridors are OR-combined.
   */
  corridors?: TollCorridor[];
  /**
   * Coordinate zone pair for geo-based detection.
   * The toll fires when origin is in zone `a` and destination is in zone `b`, or vice versa.
   * Used for intra-city crossings where place-name matching is unreliable.
   */
  geoZones?: {
    a: GeoZone;
    b: GeoZone;
  };
  /**
   * Minimum route distance (km) required before this toll can be charged.
   * Prevents false positives for very short local trips.
   */
  minDistanceKm?: number;
}

/**
 * All known toll records.
 *
 * Prices are approximate; verify against official sources before production use.
 * To add a new toll: append a new TollRecord object to this array.
 * To change a price: edit the `prices` field of the relevant record only.
 */
export const TOLL_RECORDS: TollRecord[] = [
  // ── Osmangazi Köprüsü (Gebze-Orhangazi-İzmir, O-7) ───────────────────────
  {
    id: "osmangazi",
    name: "Osmangazi Köprüsü",
    aliases: [
      "Osmangazi Köprüsü",
      "Gebze-Orhangazi-İzmir Otoyolu",
      "O-7",
    ],
    prices: { class1: 208, class2: 312, class3: 520 },
    note: "OGS Sınıf 1/2/3. Tarifeler: kgm.gov.tr",
    corridors: [
      {
        // Routes from İstanbul/Kocaeli side → Bursa/Yalova/İzmir side (or reverse)
        sideA: [
          "İstanbul", "Kocaeli", "Gebze", "İzmit",
          "Darıca", "Dilovası", "Körfez",
        ],
        sideB: [
          "Bursa", "Orhangazi", "Mudanya", "Karamürsel",
          "Yalova", "İzmir", "Manisa", "Balıkesir", "Bandırma",
        ],
      },
    ],
    minDistanceKm: 40,
  },

  // ── 1915 Çanakkale Köprüsü ───────────────────────────────────────────────
  {
    id: "canakkale1915",
    name: "1915 Çanakkale Köprüsü",
    aliases: ["1915 Çanakkale Köprüsü", "Çanakkale Boğazı Köprüsü"],
    prices: { class1: 310, class2: 465, class3: 775 },
    note: "OGS Sınıf 1/2/3. Tarifeler: kgm.gov.tr",
    corridors: [
      {
        // European Turkey (Tekirdağ/Edirne side) → Çanakkale city side
        sideA: ["Tekirdağ", "Malkara", "Edirne", "Gelibolu", "Lüleburgaz", "Silivri"],
        sideB: ["Çanakkale", "Biga", "Ezine", "Lapseki", "Truva"],
      },
    ],
    minDistanceKm: 80,
  },

  // ── İstanbul Boğaz Geçişi (bridges + tunnel) ─────────────────────────────
  // A single record represents any single Bosphorus crossing.
  // Which bridge/tunnel is used depends on the GPS route and cannot be determined
  // without step-by-step route data. One crossing is charged per route.
  {
    id: "istanbul_bogaz",
    name: "İstanbul Boğaz Geçişi",
    aliases: [
      "Boğaziçi Köprüsü",
      "Fatih Sultan Mehmet Köprüsü",
      "Yavuz Sultan Selim Köprüsü",
      "Avrasya Tüneli",
    ],
    prices: { class1: 103, class2: 155, class3: 258 },
    note:
      "YSS (3. Köprü) tarifesi baz alınmıştır. " +
      "Boğaziçi/FSM ~55 TL, Avrasya Tüneli ~123 TL. " +
      "Kullanılan yapı güzergâha göre değişir; tek geçiş ücreti uygulanır.",
    // Coordinate zones: cross from European Istanbul to Asian Istanbul (or vice versa)
    geoZones: {
      // Avrupa yakası
      a: { latMin: 40.85, latMax: 41.35, lngMin: 27.9, lngMax: 29.05 },
      // Anadolu yakası + Kocaeli giriş kuşağı
      b: { latMin: 40.75, latMax: 41.35, lngMin: 29.05, lngMax: 30.2 },
    },
    minDistanceKm: 5,
  },
];
