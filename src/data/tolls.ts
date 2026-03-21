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
 *   - KGM Güzergah Sorgula: https://www.kgm.gov.tr/Sayfalar/KGM/SiteTr/UlasimMaliyeti/Ulasim.aspx
 *   - HGS / OGS: hgs.com.tr, ogsgecis.com.tr
 *
 * Last manual update: 2025-03
 *
 * ── O-7 CORRIDOR ARCHITECTURE NOTE ──────────────────────────────────────────
 *  The Gebze-Orhangazi-İzmir Otoyolu (O-7) has TWO independently billed segments:
 *
 *  [Gebze] ──toll─── [Osmangazi Köprüsü] ──toll─── [Orhangazi] ──toll─── [İzmir]
 *                         id: osmangazi                     id: goi_izmir_section
 *                           ₺208 class1                          ₺185 class1
 *
 *  Total Gebze → İzmir (full O-7):  ₺208 + ₺185 = ₺393  (class1, HGS/OGS)
 *  Verified approximately against KGM Güzergah Sorgula (2024/Q4).
 *
 *  Routes that only use the bridge (e.g. İstanbul → Bursa) pay only ₺208.
 *  Routes that continue to İzmir/Manisa pay both segments.
 * ─────────────────────────────────────────────────────────────────────────────
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
  /** Alternative names / road identifiers (for future keyword expansion) */
  aliases: string[];
  prices: TollPrices;
  /** Optional note shown in logs or future admin UI */
  note?: string;
  /**
   * Keyword corridors for place-name based detection.
   * The toll fires when origin matches sideA and destination matches sideB (or reverse).
   * Multiple corridors are OR-combined.
   */
  corridors?: TollCorridor[];
  /**
   * Coordinate zone pair for geo-based detection.
   * The toll fires when origin is in zone `a` and destination is in zone `b`, or vice versa.
   * Used for intra-city crossings where place-name matching alone is unreliable.
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
 * Prices are approximate; verify against official KGM sources before production use.
 * To add a new toll: append a new TollRecord object to this array.
 * To change a price: edit the `prices` field of the relevant record ONLY.
 */
export const TOLL_RECORDS: TollRecord[] = [

  // ── Osmangazi Köprüsü ────────────────────────────────────────────────────
  //
  // This record covers the BRIDGE ONLY (fixed crossing fee).
  // The O-7 highway sections before/after the bridge are separate — see goi_izmir_section.
  // Corridor: anything on the Gebze/İstanbul/Kocaeli side ↔ Bursa/Yalova/Orhangazi side.
  // Routes that continue to İzmir will ALSO match goi_izmir_section below.
  {
    id: "osmangazi",
    name: "Osmangazi Köprüsü",
    aliases: ["Osmangazi Köprüsü"],
    prices: { class1: 208, class2: 312, class3: 520 },
    note: "Yalnızca köprü geçiş ücreti. O-7 otoyol bölümleri ayrıca hesaplanır. Tarife: kgm.gov.tr",
    corridors: [
      {
        sideA: [
          "İstanbul", "Kocaeli", "Gebze", "İzmit",
          "Darıca", "Dilovası", "Körfez",
        ],
        sideB: [
          "Bursa", "Orhangazi", "Mudanya", "Karamürsel",
          "Yalova", "Gemlik",
          // İzmir/Manisa/Balıkesir are included here too — the bridge IS crossed
          // on the way. goi_izmir_section fires separately for the highway beyond.
          "İzmir", "Manisa", "Balıkesir", "Bandırma",
          "Çanakkale", "Edremit", "Bergama",
        ],
      },
    ],
    minDistanceKm: 40,
  },

  // ── O-7 İzmir Bölümü (Köprü Sonrası Otoyol) ──────────────────────────────
  //
  // Covers the O-7 highway toll gates AFTER the Osmangazi bridge, from
  // Orhangazi junction through to the İzmir exits.
  //
  // Approximate total for the Orhangazi → İzmir section: ₺185 (class1 HGS, 2024/Q4).
  // Combined with the Osmangazi bridge (₺208), full Gebze → İzmir = ₺393.
  //
  // This record fires for any route whose FINAL destination is in the İzmir
  // metro / Aegean zone AND whose origin is on the Marmara/İstanbul side.
  // It intentionally does NOT fire for routes that stop at Bursa/Orhangazi/Yalova
  // (those only cross the bridge, not the full İzmir corridor).
  {
    id: "goi_izmir_section",
    name: "O-7 Otoyolu (Orhangazi–İzmir Bölümü)",
    aliases: ["Gebze-Orhangazi-İzmir Otoyolu", "O-7 İzmir"],
    prices: { class1: 185, class2: 278, class3: 463 },
    note:
      "Osmangazi Köprüsü ücretine ek olarak uygulanan O-7 otoyol geçiş ücretidir. " +
      "Orhangazi kavşağından İzmir'e kadar olan bölümü kapsar. Tarife: kgm.gov.tr",
    corridors: [
      {
        // Origin side: anywhere that feeds into the O-7 from the Marmara/İstanbul side
        sideA: [
          "İstanbul", "Kocaeli", "Gebze", "İzmit", "Darıca", "Dilovası",
          "Bursa", "Orhangazi", "Yalova", "Karamürsel", "Gemlik", "Mudanya",
        ],
        // Destination side: İzmir metro area and nearby Aegean provinces
        // NOTE: Balıkesir is NOT included — traffic to Balıkesir exits the O-7
        // before the main İzmir toll sections.
        sideB: [
          "İzmir", "Manisa", "Denizli", "Aydın",
          "Bergama", "Çeşme", "Kuşadası", "Bodrum", "Muğla",
        ],
      },
    ],
    // Only charge for routes long enough to actually reach the İzmir corridor.
    // Orhangazi → İzmir is ~290 km; İstanbul → İzmir is ~600 km.
    minDistanceKm: 200,
  },

  // ── 1915 Çanakkale Köprüsü ───────────────────────────────────────────────
  {
    id: "canakkale1915",
    name: "1915 Çanakkale Köprüsü",
    aliases: ["1915 Çanakkale Köprüsü", "Çanakkale Boğazı Köprüsü"],
    prices: { class1: 310, class2: 465, class3: 775 },
    note: "OGS Sınıf 1/2/3. Tarife: kgm.gov.tr",
    corridors: [
      {
        // European Turkey → Çanakkale Anadolu side (crossing the Strait)
        sideA: ["Tekirdağ", "Malkara", "Edirne", "Gelibolu", "Lüleburgaz", "Silivri"],
        sideB: ["Çanakkale", "Biga", "Ezine", "Lapseki", "Truva"],
      },
    ],
    minDistanceKm: 80,
  },

  // ── İstanbul Boğaz Geçişi ────────────────────────────────────────────────
  //
  // Represents a SINGLE crossing of the Bosphorus (any bridge or tunnel).
  // Which structure is used depends on the GPS route; we cannot determine this
  // without step-by-step route data. One crossing is charged per route.
  //
  // Detection strategy:
  //   A) Geo zone: fires for intra-Istanbul trips when coordinates clearly
  //      distinguish European from Asian side.
  //   B) Keyword corridor: fires when origin is "İstanbul" and destination is
  //      a known Anadolu city — catches long-distance routes (e.g. İstanbul →
  //      İzmir, Ankara) where İzmir's lng ~27.1 falls outside the geo zone b.
  //
  // Known limitation: keyword corridor fires for ALL "İstanbul" origins
  // including Asian-side districts (Kadıköy, Üsküdar). This slightly
  // over-charges routes starting from the Asian side. Accurate per-district
  // detection requires step-by-step route data (future improvement).
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
      "YSS (3. Köprü) tarifesi baz alınmıştır (2025). " +
      "Boğaziçi/FSM ~55 TL, Avrasya Tüneli ~123 TL. " +
      "Kullanılan yapı güzergâha göre değişir; tek geçiş ücreti uygulanır.",
    corridors: [
      {
        // Keyword corridor B: long-distance routes from "İstanbul" to Anadolu cities.
        // Catches the İstanbul → İzmir / Ankara case where geo-zone b does not
        // reach İzmir (which is at lng ~27.1, west of the Bosphorus meridian).
        sideA: ["İstanbul"],
        sideB: [
          // Nearby Anadolu destinations
          "Kocaeli", "Gebze", "İzmit", "Sakarya", "Adapazarı",
          // Western Anadolu
          "Bursa", "İzmir", "Manisa", "Denizli", "Aydın", "Balıkesir", "Bandırma",
          // Central Anadolu
          "Ankara", "Eskişehir", "Konya", "Kayseri",
          // Southern Turkey
          "Antalya", "Muğla", "Mersin", "Adana",
          // Eastern / Black Sea
          "Samsun", "Trabzon", "Rize", "Erzurum",
        ],
      },
    ],
    // Geo-zone: catches intra-city Bosphorus trips (e.g. Beşiktaş ↔ Kadıköy)
    // where the coordinate clearly identifies European vs. Asian side.
    geoZones: {
      // Avrupa yakası
      a: { latMin: 40.85, latMax: 41.35, lngMin: 27.9, lngMax: 29.05 },
      // Anadolu yakası + Kocaeli entrance zone
      b: { latMin: 40.75, latMax: 41.35, lngMin: 29.05, lngMax: 30.2 },
    },
    // Skip the bridge charge for very short trips (e.g. same-city searches)
    minDistanceKm: 20,
  },
];
