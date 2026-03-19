import type { Vehicle } from "@/types";

export const VEHICLES: Vehicle[] = [
  // ── TOYOTA ──────────────────────────────────────────────
  {
    make: "Toyota",
    model: "Corolla",
    year: 2024,
    variants: [
      { id: "corolla-24-18h", label: "1.8 Hybrid e-CVT", fuelType: "hybrid", consumption: 4.3 },
      { id: "corolla-24-20h", label: "2.0 Hybrid e-CVT", fuelType: "hybrid", consumption: 5.1 },
      { id: "corolla-24-14t", label: "1.4 D-4D Diesel", fuelType: "diesel", consumption: 5.5 },
    ],
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    variants: [
      { id: "corolla-22-18h", label: "1.8 Hybrid e-CVT", fuelType: "hybrid", consumption: 4.4 },
      { id: "corolla-22-12t", label: "1.2T Benzin Manuel", fuelType: "gasoline", consumption: 7.2 },
    ],
  },
  {
    make: "Toyota",
    model: "Yaris",
    year: 2024,
    variants: [
      { id: "yaris-24-15h", label: "1.5 Hybrid e-CVT", fuelType: "hybrid", consumption: 3.8 },
      { id: "yaris-24-10t", label: "1.0 VVT-i Benzin", fuelType: "gasoline", consumption: 5.5 },
    ],
  },
  {
    make: "Toyota",
    model: "Yaris Cross",
    year: 2024,
    variants: [
      { id: "yariscross-24-15h", label: "1.5 Hybrid e-CVT", fuelType: "hybrid", consumption: 4.6 },
    ],
  },
  {
    make: "Toyota",
    model: "RAV4",
    year: 2023,
    variants: [
      { id: "rav4-23-25h", label: "2.5 Hybrid AWD-i", fuelType: "hybrid", consumption: 6.0 },
      { id: "rav4-23-20", label: "2.0 Benzin CVT", fuelType: "gasoline", consumption: 8.5 },
    ],
  },
  {
    make: "Toyota",
    model: "bZ4X",
    year: 2023,
    variants: [
      { id: "bz4x-23-fwd", label: "71.4 kWh FWD", fuelType: "electric", consumption: 18.0 },
      { id: "bz4x-23-awd", label: "71.4 kWh AWD", fuelType: "electric", consumption: 20.0 },
    ],
  },

  // ── VOLKSWAGEN ───────────────────────────────────────────
  {
    make: "Volkswagen",
    model: "Golf",
    year: 2024,
    variants: [
      { id: "golf-24-10t", label: "1.0 TSI 110 hp Manuel", fuelType: "gasoline", consumption: 5.4 },
      { id: "golf-24-15t", label: "1.5 TSI 150 hp DSG", fuelType: "gasoline", consumption: 5.8 },
      { id: "golf-24-20tdi", label: "2.0 TDI 150 hp DSG", fuelType: "diesel", consumption: 4.8 },
      { id: "golf-24-14gte", label: "1.4 GTE Plug-in Hybrid", fuelType: "hybrid", consumption: 1.5 },
    ],
  },
  {
    make: "Volkswagen",
    model: "Polo",
    year: 2024,
    variants: [
      { id: "polo-24-10t80", label: "1.0 TSI 80 hp Manuel", fuelType: "gasoline", consumption: 5.0 },
      { id: "polo-24-10t95", label: "1.0 TSI 95 hp DSG", fuelType: "gasoline", consumption: 5.3 },
    ],
  },
  {
    make: "Volkswagen",
    model: "Passat",
    year: 2024,
    variants: [
      { id: "passat-24-15t", label: "1.5 TSI 150 hp DSG", fuelType: "gasoline", consumption: 6.5 },
      { id: "passat-24-20tdi", label: "2.0 TDI 200 hp DSG", fuelType: "diesel", consumption: 5.2 },
    ],
  },
  {
    make: "Volkswagen",
    model: "ID.4",
    year: 2024,
    variants: [
      { id: "id4-24-std", label: "52 kWh Standard Range", fuelType: "electric", consumption: 15.8 },
      { id: "id4-24-pro", label: "77 kWh Pro Performance", fuelType: "electric", consumption: 16.4 },
    ],
  },

  // ── RENAULT ──────────────────────────────────────────────
  {
    make: "Renault",
    model: "Clio",
    year: 2024,
    variants: [
      { id: "clio-24-10t65", label: "1.0 TCe 65 hp Manuel", fuelType: "gasoline", consumption: 5.5 },
      { id: "clio-24-10t90", label: "1.0 TCe 90 hp CVT", fuelType: "gasoline", consumption: 5.8 },
      { id: "clio-24-15h", label: "1.6 E-Tech Full Hybrid", fuelType: "hybrid", consumption: 4.6 },
    ],
  },
  {
    make: "Renault",
    model: "Megane",
    year: 2023,
    variants: [
      { id: "megane-23-13t", label: "1.3 TCe 140 hp EDC", fuelType: "gasoline", consumption: 6.8 },
      { id: "megane-23-15dci", label: "1.5 dCi 115 hp EDC", fuelType: "diesel", consumption: 4.9 },
    ],
  },
  {
    make: "Renault",
    model: "Megane E-Tech",
    year: 2024,
    variants: [
      { id: "megane-e-24-40", label: "40 kWh 130 hp", fuelType: "electric", consumption: 16.1 },
      { id: "megane-e-24-60", label: "60 kWh 220 hp", fuelType: "electric", consumption: 16.8 },
    ],
  },
  {
    make: "Renault",
    model: "Zoe",
    year: 2023,
    variants: [
      { id: "zoe-23-r135", label: "52 kWh R135", fuelType: "electric", consumption: 17.2 },
    ],
  },

  // ── BMW ──────────────────────────────────────────────────
  {
    make: "BMW",
    model: "3 Serisi",
    year: 2024,
    variants: [
      { id: "bmw3-24-320i", label: "320i 184 hp Otomatik", fuelType: "gasoline", consumption: 6.5 },
      { id: "bmw3-24-330i", label: "330i 258 hp Otomatik", fuelType: "gasoline", consumption: 7.0 },
      { id: "bmw3-24-320d", label: "320d 190 hp Otomatik", fuelType: "diesel", consumption: 5.0 },
      { id: "bmw3-24-330e", label: "330e Plug-in Hybrid", fuelType: "hybrid", consumption: 2.1 },
    ],
  },
  {
    make: "BMW",
    model: "5 Serisi",
    year: 2024,
    variants: [
      { id: "bmw5-24-520i", label: "520i 184 hp Otomatik", fuelType: "gasoline", consumption: 7.0 },
      { id: "bmw5-24-530i", label: "530i 252 hp Otomatik", fuelType: "gasoline", consumption: 7.8 },
      { id: "bmw5-24-520d", label: "520d 197 hp Otomatik", fuelType: "diesel", consumption: 5.3 },
    ],
  },
  {
    make: "BMW",
    model: "iX3",
    year: 2024,
    variants: [
      { id: "bmwix3-24", label: "80 kWh M Sport", fuelType: "electric", consumption: 17.8 },
    ],
  },

  // ── MERCEDES ─────────────────────────────────────────────
  {
    make: "Mercedes",
    model: "A Serisi",
    year: 2024,
    variants: [
      { id: "mba-24-a180", label: "A 180 136 hp DCT", fuelType: "gasoline", consumption: 6.1 },
      { id: "mba-24-a200", label: "A 200 163 hp DCT", fuelType: "gasoline", consumption: 6.4 },
      { id: "mba-24-a180d", label: "A 180d 116 hp DCT", fuelType: "diesel", consumption: 4.5 },
    ],
  },
  {
    make: "Mercedes",
    model: "C Serisi",
    year: 2024,
    variants: [
      { id: "mbc-24-c200", label: "C 200 204 hp Otomatik", fuelType: "gasoline", consumption: 7.2 },
      { id: "mbc-24-c220d", label: "C 220d 197 hp Otomatik", fuelType: "diesel", consumption: 5.4 },
      { id: "mbc-24-c300e", label: "C 300e Plug-in Hybrid", fuelType: "hybrid", consumption: 1.8 },
    ],
  },
  {
    make: "Mercedes",
    model: "EQA",
    year: 2024,
    variants: [
      { id: "mbeqa-24-250", label: "EQA 250+ 66.5 kWh", fuelType: "electric", consumption: 16.9 },
    ],
  },

  // ── FORD ─────────────────────────────────────────────────
  {
    make: "Ford",
    model: "Focus",
    year: 2024,
    variants: [
      { id: "focus-24-10t", label: "1.0 EcoBoost 125 hp Manuel", fuelType: "gasoline", consumption: 6.0 },
      { id: "focus-24-15t", label: "1.5 EcoBoost 182 hp Otomatik", fuelType: "gasoline", consumption: 7.1 },
      { id: "focus-24-15d", label: "1.5 EcoBlue 120 hp Manuel", fuelType: "diesel", consumption: 4.8 },
    ],
  },
  {
    make: "Ford",
    model: "Fiesta",
    year: 2023,
    variants: [
      { id: "fiesta-23-10t", label: "1.0 EcoBoost 95 hp Manuel", fuelType: "gasoline", consumption: 5.5 },
      { id: "fiesta-23-10t125", label: "1.0 EcoBoost 125 hp Otomatik", fuelType: "gasoline", consumption: 5.8 },
    ],
  },
  {
    make: "Ford",
    model: "Kuga",
    year: 2024,
    variants: [
      { id: "kuga-24-25phev", label: "2.5 PHEV 225 hp CVT", fuelType: "hybrid", consumption: 1.7 },
      { id: "kuga-24-15t", label: "1.5 EcoBoost 150 hp Manuel", fuelType: "gasoline", consumption: 7.8 },
      { id: "kuga-24-20d", label: "2.0 EcoBlue 150 hp Otomatik", fuelType: "diesel", consumption: 5.5 },
    ],
  },
  {
    make: "Ford",
    model: "Mustang Mach-E",
    year: 2024,
    variants: [
      { id: "mache-24-std", label: "Standard Range RWD", fuelType: "electric", consumption: 17.3 },
      { id: "mache-24-ext", label: "Extended Range AWD", fuelType: "electric", consumption: 19.4 },
    ],
  },

  // ── HYUNDAI ──────────────────────────────────────────────
  {
    make: "Hyundai",
    model: "i20",
    year: 2024,
    variants: [
      { id: "i20-24-10t", label: "1.0 T-GDi 100 hp iMT", fuelType: "gasoline", consumption: 5.5 },
      { id: "i20-24-12", label: "1.2 MPI 84 hp Manuel", fuelType: "gasoline", consumption: 5.8 },
    ],
  },
  {
    make: "Hyundai",
    model: "i30",
    year: 2024,
    variants: [
      { id: "i30-24-10t", label: "1.0 T-GDi 120 hp iMT", fuelType: "gasoline", consumption: 5.9 },
      { id: "i30-24-16d", label: "1.6 CRDi 136 hp DCT", fuelType: "diesel", consumption: 4.8 },
    ],
  },
  {
    make: "Hyundai",
    model: "Tucson",
    year: 2024,
    variants: [
      { id: "tucson-24-16t", label: "1.6 T-GDi 150 hp DCT", fuelType: "gasoline", consumption: 8.2 },
      { id: "tucson-24-16h", label: "1.6 T-GDi HEV 230 hp", fuelType: "hybrid", consumption: 6.1 },
      { id: "tucson-24-16phev", label: "1.6 T-GDi PHEV 265 hp", fuelType: "hybrid", consumption: 1.6 },
    ],
  },
  {
    make: "Hyundai",
    model: "IONIQ 6",
    year: 2024,
    variants: [
      { id: "ioniq6-24-53", label: "53 kWh Standard RWD", fuelType: "electric", consumption: 13.5 },
      { id: "ioniq6-24-77rwd", label: "77.4 kWh Long Range RWD", fuelType: "electric", consumption: 14.3 },
      { id: "ioniq6-24-77awd", label: "77.4 kWh Long Range AWD", fuelType: "electric", consumption: 16.9 },
    ],
  },

  // ── KIA ──────────────────────────────────────────────────
  {
    make: "Kia",
    model: "Ceed",
    year: 2024,
    variants: [
      { id: "ceed-24-10t", label: "1.0 T-GDi 120 hp iMT", fuelType: "gasoline", consumption: 5.9 },
      { id: "ceed-24-16d", label: "1.6 CRDi 136 hp DCT", fuelType: "diesel", consumption: 4.7 },
    ],
  },
  {
    make: "Kia",
    model: "Sportage",
    year: 2024,
    variants: [
      { id: "sportage-24-16t", label: "1.6 T-GDi 150 hp DCT", fuelType: "gasoline", consumption: 7.8 },
      { id: "sportage-24-16h", label: "1.6 T-GDi HEV 230 hp", fuelType: "hybrid", consumption: 6.0 },
      { id: "sportage-24-16phev", label: "1.6 T-GDi PHEV 265 hp", fuelType: "hybrid", consumption: 1.5 },
    ],
  },
  {
    make: "Kia",
    model: "EV6",
    year: 2024,
    variants: [
      { id: "ev6-24-58", label: "58 kWh Standard RWD", fuelType: "electric", consumption: 15.2 },
      { id: "ev6-24-77rwd", label: "77.4 kWh Long Range RWD", fuelType: "electric", consumption: 16.0 },
      { id: "ev6-24-77awd", label: "77.4 kWh Long Range AWD GT-Line", fuelType: "electric", consumption: 17.9 },
    ],
  },

  // ── FIAT ─────────────────────────────────────────────────
  {
    make: "Fiat",
    model: "Egea",
    year: 2024,
    variants: [
      { id: "egea-24-13", label: "1.3 Multijet 95 hp Manuel", fuelType: "diesel", consumption: 4.5 },
      { id: "egea-24-14t", label: "1.4 T-Jet 120 hp Manuel", fuelType: "gasoline", consumption: 6.4 },
      { id: "egea-24-10t", label: "1.0 Firefly 100 hp Manuel", fuelType: "gasoline", consumption: 5.6 },
    ],
  },
  {
    make: "Fiat",
    model: "500",
    year: 2024,
    variants: [
      { id: "500-24-10", label: "1.0 BSG Hybrid 70 hp", fuelType: "hybrid", consumption: 4.8 },
      { id: "500-24-e", label: "42 kWh Electric", fuelType: "electric", consumption: 14.1 },
    ],
  },

  // ── PEUGEOT ──────────────────────────────────────────────
  {
    make: "Peugeot",
    model: "208",
    year: 2024,
    variants: [
      { id: "208-24-10", label: "1.0 PureTech 75 hp Manuel", fuelType: "gasoline", consumption: 4.9 },
      { id: "208-24-12", label: "1.2 PureTech 100 hp EAT8", fuelType: "gasoline", consumption: 5.5 },
      { id: "208-24-e", label: "50 kWh e-208", fuelType: "electric", consumption: 14.6 },
    ],
  },
  {
    make: "Peugeot",
    model: "308",
    year: 2024,
    variants: [
      { id: "308-24-12t", label: "1.2 PureTech 130 hp EAT8", fuelType: "gasoline", consumption: 6.3 },
      { id: "308-24-15d", label: "1.5 BlueHDi 130 hp EAT8", fuelType: "diesel", consumption: 4.9 },
      { id: "308-24-phev", label: "1.6 Plug-in Hybrid 225 hp", fuelType: "hybrid", consumption: 1.4 },
    ],
  },

  // ── DACIA ─────────────────────────────────────────────────
  {
    make: "Dacia",
    model: "Sandero",
    year: 2024,
    variants: [
      { id: "sandero-24-10t", label: "1.0 TCe 90 hp CVT", fuelType: "gasoline", consumption: 5.6 },
      { id: "sandero-24-10t65", label: "1.0 SCe 65 hp Manuel", fuelType: "gasoline", consumption: 5.9 },
    ],
  },
  {
    make: "Dacia",
    model: "Duster",
    year: 2024,
    variants: [
      { id: "duster-24-10t130", label: "1.0 TCe 130 hp CVT", fuelType: "gasoline", consumption: 6.9 },
      { id: "duster-24-15d", label: "1.5 Blue dCi 115 hp Manuel", fuelType: "diesel", consumption: 5.2 },
    ],
  },

  // ── SKODA ─────────────────────────────────────────────────
  {
    make: "Skoda",
    model: "Fabia",
    year: 2024,
    variants: [
      { id: "fabia-24-10t95", label: "1.0 TSI 95 hp Manuel", fuelType: "gasoline", consumption: 4.8 },
      { id: "fabia-24-10t110", label: "1.0 TSI 110 hp DSG", fuelType: "gasoline", consumption: 5.2 },
    ],
  },
  {
    make: "Skoda",
    model: "Octavia",
    year: 2024,
    variants: [
      { id: "octavia-24-15t", label: "1.5 TSI 150 hp DSG", fuelType: "gasoline", consumption: 6.0 },
      { id: "octavia-24-20tdi", label: "2.0 TDI 150 hp DSG", fuelType: "diesel", consumption: 4.7 },
      { id: "octavia-24-14gte", label: "1.4 iV Plug-in Hybrid", fuelType: "hybrid", consumption: 1.6 },
    ],
  },

  // ── TOGG ─────────────────────────────────────────────────
  {
    make: "Togg",
    model: "T10X",
    year: 2024,
    variants: [
      { id: "t10x-24-rwd", label: "88 kWh RWD 200 hp", fuelType: "electric", consumption: 16.4 },
      { id: "t10x-24-awd", label: "88 kWh AWD 400 hp", fuelType: "electric", consumption: 18.9 },
    ],
  },
  {
    make: "Togg",
    model: "T10F",
    year: 2024,
    variants: [
      { id: "t10f-24-rwd", label: "53 kWh RWD 200 hp", fuelType: "electric", consumption: 15.0 },
    ],
  },
];

/** Returns unique makes */
export function getMakes(): string[] {
  return [...new Set(VEHICLES.map((v) => v.make))].sort();
}

/** Returns models for a given make */
export function getModels(make: string): string[] {
  return [...new Set(VEHICLES.filter((v) => v.make === make).map((v) => v.model))].sort();
}

/** Returns years for a given make+model, descending */
export function getYears(make: string, model: string): number[] {
  return [
    ...new Set(
      VEHICLES.filter((v) => v.make === make && v.model === model).map((v) => v.year)
    ),
  ].sort((a, b) => b - a);
}

/** Returns variants for a given make+model+year */
export function getVariants(make: string, model: string, year: number) {
  return VEHICLES.find(
    (v) => v.make === make && v.model === model && v.year === year
  )?.variants ?? [];
}
