import type { Vehicle } from "@/types";

export const VEHICLES: Vehicle[] = [
  // ── TOYOTA ──────────────────────────────────────────────────────────────
  // Corolla — 2015–2025
  { make: "Toyota", model: "Corolla", year: 2025, variants: [
    { id: "corolla-25-15b",  label: "1.5 Benzin Multidrive S",fuelType: "gasoline", consumption: 7.5, transmission: "Otomatik" },
    { id: "corolla-25-18h",  label: "1.8 Hybrid e-CVT",       fuelType: "hybrid",   consumption: 4.3, transmission: "CVT" },
    { id: "corolla-25-20h",  label: "2.0 Hybrid e-CVT",       fuelType: "hybrid",   consumption: 5.1, transmission: "CVT" },
  ]},
  { make: "Toyota", model: "Corolla", year: 2024, variants: [
    { id: "corolla-24-15b",  label: "1.5 Benzin Multidrive S",fuelType: "gasoline", consumption: 7.5, transmission: "Otomatik" },
    { id: "corolla-24-18h",  label: "1.8 Hybrid e-CVT",       fuelType: "hybrid",   consumption: 4.3, transmission: "CVT" },
    { id: "corolla-24-20h",  label: "2.0 Hybrid e-CVT",       fuelType: "hybrid",   consumption: 5.1, transmission: "CVT" },
  ]},
  { make: "Toyota", model: "Corolla", year: 2023, variants: [
    { id: "corolla-23-18h",  label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.4 },
    { id: "corolla-23-20h",  label: "2.0 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 5.2 },
    { id: "corolla-23-12t",  label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 7.1 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2022, variants: [
    { id: "corolla-22-18h",  label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.4 },
    { id: "corolla-22-12t",  label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 7.2 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2021, variants: [
    { id: "corolla-21-18h",  label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.5 },
    { id: "corolla-21-12t",  label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 7.3 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2020, variants: [
    { id: "corolla-20-18h",  label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.5 },
    { id: "corolla-20-12t",  label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 7.4 },
    { id: "corolla-20-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2019, variants: [
    { id: "corolla-19-18h",  label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.5 },
    { id: "corolla-19-12t",  label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 7.5 },
    { id: "corolla-19-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2018, variants: [
    { id: "corolla-18-16v",  label: "1.6 Vision Benzin",     fuelType: "gasoline", consumption: 7.2 },
    { id: "corolla-18-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.4 },
    { id: "corolla-18-13v",  label: "1.33 VVT-i Benzin",     fuelType: "gasoline", consumption: 6.8 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2017, variants: [
    { id: "corolla-17-16v",  label: "1.6 Vision Benzin",     fuelType: "gasoline", consumption: 7.3 },
    { id: "corolla-17-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.4 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2016, variants: [
    { id: "corolla-16-16v",  label: "1.6 Vision Benzin",     fuelType: "gasoline", consumption: 7.3 },
    { id: "corolla-16-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "Toyota", model: "Corolla", year: 2015, variants: [
    { id: "corolla-15-16v",  label: "1.6 Vision Benzin",     fuelType: "gasoline", consumption: 7.4 },
    { id: "corolla-15-14d",  label: "1.4 D-4D Dizel",        fuelType: "diesel",   consumption: 5.5 },
  ]},

  // Yaris — 2015–2025
  { make: "Toyota", model: "Yaris", year: 2025, variants: [
    { id: "yaris-25-15h",    label: "1.5 Hybrid e-CVT",       fuelType: "hybrid",   consumption: 3.7, transmission: "CVT" },
    { id: "yaris-25-10t",    label: "1.0 VVT-i Benzin",       fuelType: "gasoline", consumption: 5.4, transmission: "Manuel" },
  ]},
  { make: "Toyota", model: "Yaris", year: 2024, variants: [
    { id: "yaris-24-15h",    label: "1.5 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 3.8 },
    { id: "yaris-24-10t",    label: "1.0 VVT-i Benzin",      fuelType: "gasoline", consumption: 5.5 },
  ]},
  { make: "Toyota", model: "Yaris", year: 2022, variants: [
    { id: "yaris-22-15h",    label: "1.5 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 3.9 },
    { id: "yaris-22-10t",    label: "1.0 VVT-i Benzin",      fuelType: "gasoline", consumption: 5.6 },
  ]},
  { make: "Toyota", model: "Yaris", year: 2020, variants: [
    { id: "yaris-20-15h",    label: "1.5 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.1 },
    { id: "yaris-20-10t",    label: "1.0 VVT-i Benzin",      fuelType: "gasoline", consumption: 5.6 },
  ]},
  { make: "Toyota", model: "Yaris", year: 2018, variants: [
    { id: "yaris-18-15h",    label: "1.5 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.3 },
    { id: "yaris-18-10",     label: "1.0 VVT-i Benzin",      fuelType: "gasoline", consumption: 5.6 },
  ]},
  { make: "Toyota", model: "Yaris", year: 2015, variants: [
    { id: "yaris-15-15h",    label: "1.5 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.5 },
    { id: "yaris-15-10",     label: "1.0 VVT-i Benzin",      fuelType: "gasoline", consumption: 5.7 },
  ]},

  // Yaris Cross
  { make: "Toyota", model: "Yaris Cross", year: 2024, variants: [
    { id: "yariscross-24-15h", label: "1.5 Hybrid e-CVT",    fuelType: "hybrid",   consumption: 4.6 },
  ]},
  { make: "Toyota", model: "Yaris Cross", year: 2022, variants: [
    { id: "yariscross-22-15h", label: "1.5 Hybrid e-CVT",    fuelType: "hybrid",   consumption: 4.7 },
    { id: "yariscross-22-15t", label: "1.5 Benzin Manuel",   fuelType: "gasoline", consumption: 6.5 },
  ]},
  { make: "Toyota", model: "Yaris Cross", year: 2021, variants: [
    { id: "yariscross-21-15h", label: "1.5 Hybrid e-CVT",    fuelType: "hybrid",   consumption: 4.7 },
    { id: "yariscross-21-15t", label: "1.5 Benzin Manuel",   fuelType: "gasoline", consumption: 6.6 },
  ]},

  // RAV4
  { make: "Toyota", model: "RAV4", year: 2024, variants: [
    { id: "rav4-24-25h",     label: "2.5 Hybrid AWD-i",      fuelType: "hybrid",   consumption: 6.0 },
    { id: "rav4-24-20",      label: "2.0 Benzin CVT",        fuelType: "gasoline", consumption: 8.5 },
  ]},
  { make: "Toyota", model: "RAV4", year: 2023, variants: [
    { id: "rav4-23-25h",     label: "2.5 Hybrid AWD-i",      fuelType: "hybrid",   consumption: 6.0 },
    { id: "rav4-23-20",      label: "2.0 Benzin CVT",        fuelType: "gasoline", consumption: 8.5 },
  ]},
  { make: "Toyota", model: "RAV4", year: 2021, variants: [
    { id: "rav4-21-25h",     label: "2.5 Hybrid AWD-i",      fuelType: "hybrid",   consumption: 6.2 },
    { id: "rav4-21-20",      label: "2.0 Benzin CVT",        fuelType: "gasoline", consumption: 8.8 },
  ]},
  { make: "Toyota", model: "RAV4", year: 2019, variants: [
    { id: "rav4-19-25h",     label: "2.5 Hybrid AWD-i",      fuelType: "hybrid",   consumption: 6.4 },
    { id: "rav4-19-20",      label: "2.0 Benzin CVT",        fuelType: "gasoline", consumption: 9.0 },
  ]},

  // bZ4X
  { make: "Toyota", model: "bZ4X", year: 2024, variants: [
    { id: "bz4x-24-fwd",     label: "71.4 kWh FWD",          fuelType: "electric", consumption: 17.5 },
    { id: "bz4x-24-awd",     label: "71.4 kWh AWD",          fuelType: "electric", consumption: 19.5 },
  ]},
  { make: "Toyota", model: "bZ4X", year: 2023, variants: [
    { id: "bz4x-23-fwd",     label: "71.4 kWh FWD",          fuelType: "electric", consumption: 18.0 },
    { id: "bz4x-23-awd",     label: "71.4 kWh AWD",          fuelType: "electric", consumption: 20.0 },
  ]},

  // Prius
  { make: "Toyota", model: "Prius", year: 2024, variants: [
    { id: "prius-24-20h",    label: "2.0 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.4 },
    { id: "prius-24-phev",   label: "2.0 Plug-in Hybrid",    fuelType: "hybrid",   consumption: 1.0 },
  ]},
  { make: "Toyota", model: "Prius", year: 2022, variants: [
    { id: "prius-22-18h",    label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.5 },
  ]},
  { make: "Toyota", model: "Prius", year: 2020, variants: [
    { id: "prius-20-18h",    label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 4.6 },
  ]},

  // C-HR
  { make: "Toyota", model: "C-HR", year: 2024, variants: [
    { id: "chr-24-20h",      label: "2.0 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 5.8 },
    { id: "chr-24-20phev",   label: "2.0 Plug-in Hybrid",    fuelType: "hybrid",   consumption: 1.0 },
  ]},
  { make: "Toyota", model: "C-HR", year: 2022, variants: [
    { id: "chr-22-18h",      label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 5.9 },
  ]},
  { make: "Toyota", model: "C-HR", year: 2020, variants: [
    { id: "chr-20-12t",      label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 8.5 },
    { id: "chr-20-18h",      label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 6.0 },
  ]},
  { make: "Toyota", model: "C-HR", year: 2018, variants: [
    { id: "chr-18-12t",      label: "1.2T Benzin Manuel",    fuelType: "gasoline", consumption: 8.6 },
    { id: "chr-18-18h",      label: "1.8 Hybrid e-CVT",      fuelType: "hybrid",   consumption: 6.2 },
  ]},

  // ── VOLKSWAGEN ──────────────────────────────────────────────────────────
  // Golf — 2015–2025
  { make: "Volkswagen", model: "Golf", year: 2025, variants: [
    { id: "golf-25-10t",     label: "1.0 TSI 110 hp Manuel",  fuelType: "gasoline", consumption: 5.3, transmission: "Manuel" },
    { id: "golf-25-15t",     label: "1.5 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 5.7, transmission: "DSG" },
    { id: "golf-25-20tdi",   label: "2.0 TDI 150 hp DSG",     fuelType: "diesel",   consumption: 4.7, transmission: "DSG" },
    { id: "golf-25-14gte",   label: "1.4 GTE Plug-in Hybrid", fuelType: "hybrid",   consumption: 1.5, transmission: "DSG" },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2024, variants: [
    { id: "golf-24-10t",     label: "1.0 TSI 110 hp Manuel", fuelType: "gasoline", consumption: 5.4 },
    { id: "golf-24-15t",     label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 5.8 },
    { id: "golf-24-20tdi",   label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 4.8 },
    { id: "golf-24-14gte",   label: "1.4 GTE Plug-in Hybrid",fuelType: "hybrid",   consumption: 1.5 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2022, variants: [
    { id: "golf-22-10t",     label: "1.0 TSI 110 hp Manuel", fuelType: "gasoline", consumption: 5.5 },
    { id: "golf-22-15t",     label: "1.5 TSI 130 hp DSG",    fuelType: "gasoline", consumption: 6.0 },
    { id: "golf-22-20tdi",   label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2021, variants: [
    { id: "golf-21-10t",     label: "1.0 TSI 110 hp Manuel", fuelType: "gasoline", consumption: 5.6 },
    { id: "golf-21-15t",     label: "1.5 TSI 130 hp DSG",    fuelType: "gasoline", consumption: 6.1 },
    { id: "golf-21-20tdi",   label: "2.0 TDI 115 hp Manuel", fuelType: "diesel",   consumption: 5.0 },
    { id: "golf-21-14gte",   label: "1.4 GTE Plug-in Hybrid",fuelType: "hybrid",   consumption: 1.5 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2020, variants: [
    { id: "golf-20-15t",     label: "1.5 TSI 130 hp DSG",    fuelType: "gasoline", consumption: 6.2 },
    { id: "golf-20-20tdi",   label: "2.0 TDI 115 hp Manuel", fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2019, variants: [
    { id: "golf-19-10t",     label: "1.0 TSI 115 hp Manuel", fuelType: "gasoline", consumption: 5.7 },
    { id: "golf-19-15t",     label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 6.3 },
    { id: "golf-19-16tdi",   label: "1.6 TDI 115 hp Manuel", fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2018, variants: [
    { id: "golf-18-10t",     label: "1.0 TSI 115 hp Manuel", fuelType: "gasoline", consumption: 5.8 },
    { id: "golf-18-14t",     label: "1.4 TSI 125 hp Manuel", fuelType: "gasoline", consumption: 6.2 },
    { id: "golf-18-16tdi",   label: "1.6 TDI 115 hp Manuel", fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2017, variants: [
    { id: "golf-17-14t",     label: "1.4 TSI 125 hp Manuel", fuelType: "gasoline", consumption: 6.3 },
    { id: "golf-17-16tdi",   label: "1.6 TDI 110 hp Manuel", fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2016, variants: [
    { id: "golf-16-14t",     label: "1.4 TSI 125 hp Manuel", fuelType: "gasoline", consumption: 6.3 },
    { id: "golf-16-16tdi",   label: "1.6 TDI 110 hp Manuel", fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Volkswagen", model: "Golf", year: 2015, variants: [
    { id: "golf-15-14t",     label: "1.4 TSI 125 hp Manuel", fuelType: "gasoline", consumption: 6.4 },
    { id: "golf-15-16tdi",   label: "1.6 TDI 110 hp Manuel", fuelType: "diesel",   consumption: 5.2 },
  ]},

  // Polo — 2018–2024
  { make: "Volkswagen", model: "Polo", year: 2024, variants: [
    { id: "polo-24-10t80",   label: "1.0 TSI 80 hp Manuel",  fuelType: "gasoline", consumption: 5.0 },
    { id: "polo-24-10t95",   label: "1.0 TSI 95 hp DSG",     fuelType: "gasoline", consumption: 5.3 },
  ]},
  { make: "Volkswagen", model: "Polo", year: 2022, variants: [
    { id: "polo-22-10t80",   label: "1.0 TSI 80 hp Manuel",  fuelType: "gasoline", consumption: 5.1 },
    { id: "polo-22-10t95",   label: "1.0 TSI 95 hp DSG",     fuelType: "gasoline", consumption: 5.4 },
  ]},
  { make: "Volkswagen", model: "Polo", year: 2020, variants: [
    { id: "polo-20-10t",     label: "1.0 TSI 95 hp Manuel",  fuelType: "gasoline", consumption: 5.5 },
    { id: "polo-20-16tdi",   label: "1.6 TDI 95 hp Manuel",  fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Volkswagen", model: "Polo", year: 2018, variants: [
    { id: "polo-18-10t",     label: "1.0 TSI 95 hp Manuel",  fuelType: "gasoline", consumption: 5.6 },
    { id: "polo-18-16tdi",   label: "1.6 TDI 95 hp Manuel",  fuelType: "diesel",   consumption: 4.6 },
  ]},

  // Passat — 2015–2024
  { make: "Volkswagen", model: "Passat", year: 2024, variants: [
    { id: "passat-24-15t",   label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 6.5 },
    { id: "passat-24-20tdi", label: "2.0 TDI 200 hp DSG",    fuelType: "diesel",   consumption: 5.2 },
  ]},
  { make: "Volkswagen", model: "Passat", year: 2022, variants: [
    { id: "passat-22-15t",   label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 6.6 },
    { id: "passat-22-20tdi", label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.4 },
    { id: "passat-22-phev",  label: "1.4 GTE Plug-in Hybrid",fuelType: "hybrid",   consumption: 1.7 },
  ]},
  { make: "Volkswagen", model: "Passat", year: 2020, variants: [
    { id: "passat-20-15t",   label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 6.8 },
    { id: "passat-20-20tdi", label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "Volkswagen", model: "Passat", year: 2018, variants: [
    { id: "passat-18-14t",   label: "1.4 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.0 },
    { id: "passat-18-20tdi", label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "Volkswagen", model: "Passat", year: 2016, variants: [
    { id: "passat-16-14t",   label: "1.4 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.1 },
    { id: "passat-16-20tdi", label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "Volkswagen", model: "Passat", year: 2015, variants: [
    { id: "passat-15-14t",   label: "1.4 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.2 },
    { id: "passat-15-20tdi", label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.7 },
  ]},

  // ID.4
  { make: "Volkswagen", model: "ID.4", year: 2024, variants: [
    { id: "id4-24-std",      label: "52 kWh Standard Range", fuelType: "electric", consumption: 15.8 },
    { id: "id4-24-pro",      label: "77 kWh Pro Performance",fuelType: "electric", consumption: 16.4 },
  ]},
  { make: "Volkswagen", model: "ID.4", year: 2022, variants: [
    { id: "id4-22-std",      label: "52 kWh Standard Range", fuelType: "electric", consumption: 16.2 },
    { id: "id4-22-pro",      label: "77 kWh Pro Performance",fuelType: "electric", consumption: 17.0 },
  ]},
  { make: "Volkswagen", model: "ID.4", year: 2021, variants: [
    { id: "id4-21-pro",      label: "77 kWh Pro Performance",fuelType: "electric", consumption: 17.5 },
  ]},

  // T-Roc
  { make: "Volkswagen", model: "T-Roc", year: 2024, variants: [
    { id: "troc-24-10t",     label: "1.0 TSI 115 hp Manuel", fuelType: "gasoline", consumption: 6.4 },
    { id: "troc-24-15t",     label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.0 },
  ]},
  { make: "Volkswagen", model: "T-Roc", year: 2022, variants: [
    { id: "troc-22-10t",     label: "1.0 TSI 115 hp Manuel", fuelType: "gasoline", consumption: 6.5 },
    { id: "troc-22-20tdi",   label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.3 },
  ]},
  { make: "Volkswagen", model: "T-Roc", year: 2020, variants: [
    { id: "troc-20-15t",     label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.2 },
    { id: "troc-20-20tdi",   label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.4 },
  ]},
  { make: "Volkswagen", model: "T-Roc", year: 2018, variants: [
    { id: "troc-18-15t",     label: "1.5 TSI 150 hp DSG",    fuelType: "gasoline", consumption: 7.3 },
    { id: "troc-18-20tdi",   label: "2.0 TDI 150 hp DSG",    fuelType: "diesel",   consumption: 5.5 },
  ]},

  // ── RENAULT ─────────────────────────────────────────────────────────────
  // Clio — 2015–2025
  { make: "Renault", model: "Clio", year: 2025, variants: [
    { id: "clio-25-10t90",   label: "1.0 TCe 90 hp CVT",      fuelType: "gasoline", consumption: 5.5, transmission: "CVT" },
    { id: "clio-25-10t65",   label: "1.0 TCe 65 hp Manuel",   fuelType: "gasoline", consumption: 5.4, transmission: "Manuel" },
    { id: "clio-25-15h",     label: "1.6 E-Tech Full Hybrid",  fuelType: "hybrid",   consumption: 4.5, transmission: "Otomatik" },
  ]},
  { make: "Renault", model: "Clio", year: 2024, variants: [
    { id: "clio-24-10t65",   label: "1.0 TCe 65 hp Manuel",  fuelType: "gasoline", consumption: 5.5 },
    { id: "clio-24-10t90",   label: "1.0 TCe 90 hp CVT",     fuelType: "gasoline", consumption: 5.8 },
    { id: "clio-24-15h",     label: "1.6 E-Tech Full Hybrid", fuelType: "hybrid",   consumption: 4.6 },
  ]},
  { make: "Renault", model: "Clio", year: 2022, variants: [
    { id: "clio-22-10t",     label: "1.0 TCe 90 hp Manuel",  fuelType: "gasoline", consumption: 5.7 },
    { id: "clio-22-15h",     label: "1.6 E-Tech Full Hybrid", fuelType: "hybrid",   consumption: 4.8 },
  ]},
  { make: "Renault", model: "Clio", year: 2021, variants: [
    { id: "clio-21-10t",     label: "1.0 TCe 90 hp Manuel",  fuelType: "gasoline", consumption: 5.7 },
    { id: "clio-21-15d",     label: "1.5 dCi 85 hp Manuel",  fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Renault", model: "Clio", year: 2020, variants: [
    { id: "clio-20-10t",     label: "1.0 SCe 65 hp Manuel",  fuelType: "gasoline", consumption: 5.9 },
    { id: "clio-20-15d",     label: "1.5 dCi 85 hp Manuel",  fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Renault", model: "Clio", year: 2019, variants: [
    { id: "clio-19-09t",     label: "0.9 TCe 90 hp Manuel",  fuelType: "gasoline", consumption: 5.6 },
    { id: "clio-19-15d",     label: "1.5 dCi 90 hp Manuel",  fuelType: "diesel",   consumption: 4.3 },
  ]},
  { make: "Renault", model: "Clio", year: 2017, variants: [
    { id: "clio-17-09t",     label: "0.9 TCe 90 hp Manuel",  fuelType: "gasoline", consumption: 5.7 },
    { id: "clio-17-15d",     label: "1.5 dCi 90 hp Manuel",  fuelType: "diesel",   consumption: 4.3 },
  ]},
  { make: "Renault", model: "Clio", year: 2015, variants: [
    { id: "clio-15-09t",     label: "0.9 TCe 90 hp Manuel",  fuelType: "gasoline", consumption: 5.8 },
    { id: "clio-15-15d",     label: "1.5 dCi 90 hp Manuel",  fuelType: "diesel",   consumption: 4.4 },
  ]},

  // Megane — 2015–2024
  { make: "Renault", model: "Megane", year: 2024, variants: [
    { id: "megane-24-13t",   label: "1.3 TCe 140 hp EDC",    fuelType: "gasoline", consumption: 6.7 },
    { id: "megane-24-15dci", label: "1.5 dCi 115 hp EDC",    fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Renault", model: "Megane", year: 2023, variants: [
    { id: "megane-23-13t",   label: "1.3 TCe 140 hp EDC",    fuelType: "gasoline", consumption: 6.8 },
    { id: "megane-23-15dci", label: "1.5 dCi 115 hp EDC",    fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Renault", model: "Megane", year: 2021, variants: [
    { id: "megane-21-13t",   label: "1.3 TCe 140 hp EDC",    fuelType: "gasoline", consumption: 6.9 },
    { id: "megane-21-15dci", label: "1.5 dCi 115 hp EDC",    fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Renault", model: "Megane", year: 2019, variants: [
    { id: "megane-19-13t",   label: "1.3 TCe 115 hp Manuel", fuelType: "gasoline", consumption: 7.0 },
    { id: "megane-19-15dci", label: "1.5 dCi 90 hp Manuel",  fuelType: "diesel",   consumption: 4.7 },
  ]},
  { make: "Renault", model: "Megane", year: 2017, variants: [
    { id: "megane-17-13t",   label: "1.3 TCe 115 hp Manuel", fuelType: "gasoline", consumption: 7.1 },
    { id: "megane-17-15dci", label: "1.5 dCi 90 hp Manuel",  fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Renault", model: "Megane", year: 2015, variants: [
    { id: "megane-15-12t",   label: "1.2 TCe 130 hp EDC",    fuelType: "gasoline", consumption: 7.2 },
    { id: "megane-15-15dci", label: "1.5 dCi 110 hp EDC",    fuelType: "diesel",   consumption: 4.8 },
  ]},

  // Megane E-Tech
  { make: "Renault", model: "Megane E-Tech", year: 2024, variants: [
    { id: "megane-e-24-40",  label: "40 kWh 130 hp",         fuelType: "electric", consumption: 16.1 },
    { id: "megane-e-24-60",  label: "60 kWh 220 hp",         fuelType: "electric", consumption: 16.8 },
  ]},
  { make: "Renault", model: "Megane E-Tech", year: 2022, variants: [
    { id: "megane-e-22-60",  label: "60 kWh 220 hp",         fuelType: "electric", consumption: 17.0 },
  ]},

  // Zoe
  { make: "Renault", model: "Zoe", year: 2023, variants: [
    { id: "zoe-23-r135",     label: "52 kWh R135",           fuelType: "electric", consumption: 17.2 },
  ]},
  { make: "Renault", model: "Zoe", year: 2020, variants: [
    { id: "zoe-20-r135",     label: "52 kWh R135",           fuelType: "electric", consumption: 17.5 },
  ]},
  { make: "Renault", model: "Zoe", year: 2018, variants: [
    { id: "zoe-18-r90",      label: "41 kWh R90",            fuelType: "electric", consumption: 14.8 },
  ]},

  // ── BMW ─────────────────────────────────────────────────────────────────
  // 3 Serisi — 2015–2024
  { make: "BMW", model: "3 Serisi", year: 2024, variants: [
    { id: "bmw3-24-320i",    label: "320i 184 hp Otomatik",  fuelType: "gasoline", consumption: 6.5 },
    { id: "bmw3-24-330i",    label: "330i 258 hp Otomatik",  fuelType: "gasoline", consumption: 7.0 },
    { id: "bmw3-24-320d",    label: "320d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.0 },
    { id: "bmw3-24-330e",    label: "330e Plug-in Hybrid",   fuelType: "hybrid",   consumption: 2.1 },
  ]},
  { make: "BMW", model: "3 Serisi", year: 2022, variants: [
    { id: "bmw3-22-320i",    label: "320i 184 hp Otomatik",  fuelType: "gasoline", consumption: 6.7 },
    { id: "bmw3-22-320d",    label: "320d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.1 },
    { id: "bmw3-22-330e",    label: "330e Plug-in Hybrid",   fuelType: "hybrid",   consumption: 2.2 },
  ]},
  { make: "BMW", model: "3 Serisi", year: 2020, variants: [
    { id: "bmw3-20-320i",    label: "320i 184 hp Otomatik",  fuelType: "gasoline", consumption: 6.9 },
    { id: "bmw3-20-320d",    label: "320d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.2 },
  ]},
  { make: "BMW", model: "3 Serisi", year: 2018, variants: [
    { id: "bmw3-18-320i",    label: "320i 184 hp Otomatik",  fuelType: "gasoline", consumption: 7.0 },
    { id: "bmw3-18-320d",    label: "320d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.3 },
  ]},
  { make: "BMW", model: "3 Serisi", year: 2016, variants: [
    { id: "bmw3-16-318i",    label: "318i 136 hp Otomatik",  fuelType: "gasoline", consumption: 6.8 },
    { id: "bmw3-16-320d",    label: "320d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.4 },
  ]},
  { make: "BMW", model: "3 Serisi", year: 2015, variants: [
    { id: "bmw3-15-318i",    label: "318i 136 hp Otomatik",  fuelType: "gasoline", consumption: 6.9 },
    { id: "bmw3-15-320d",    label: "320d 184 hp Otomatik",  fuelType: "diesel",   consumption: 5.5 },
  ]},

  // 5 Serisi
  { make: "BMW", model: "5 Serisi", year: 2024, variants: [
    { id: "bmw5-24-520i",    label: "520i 184 hp Otomatik",  fuelType: "gasoline", consumption: 7.0 },
    { id: "bmw5-24-530i",    label: "530i 252 hp Otomatik",  fuelType: "gasoline", consumption: 7.8 },
    { id: "bmw5-24-520d",    label: "520d 197 hp Otomatik",  fuelType: "diesel",   consumption: 5.3 },
  ]},
  { make: "BMW", model: "5 Serisi", year: 2022, variants: [
    { id: "bmw5-22-520i",    label: "520i 184 hp Otomatik",  fuelType: "gasoline", consumption: 7.2 },
    { id: "bmw5-22-520d",    label: "520d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "BMW", model: "5 Serisi", year: 2020, variants: [
    { id: "bmw5-20-520i",    label: "520i 184 hp Otomatik",  fuelType: "gasoline", consumption: 7.4 },
    { id: "bmw5-20-520d",    label: "520d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "BMW", model: "5 Serisi", year: 2018, variants: [
    { id: "bmw5-18-520i",    label: "520i 184 hp Otomatik",  fuelType: "gasoline", consumption: 7.5 },
    { id: "bmw5-18-520d",    label: "520d 190 hp Otomatik",  fuelType: "diesel",   consumption: 5.7 },
  ]},

  // iX3
  { make: "BMW", model: "iX3", year: 2024, variants: [
    { id: "bmwix3-24",       label: "80 kWh M Sport",        fuelType: "electric", consumption: 17.8 },
  ]},
  { make: "BMW", model: "iX3", year: 2022, variants: [
    { id: "bmwix3-22",       label: "80 kWh M Sport",        fuelType: "electric", consumption: 18.5 },
  ]},

  // ── MERCEDES ────────────────────────────────────────────────────────────
  // A Serisi — 2018–2024
  { make: "Mercedes", model: "A Serisi", year: 2024, variants: [
    { id: "mba-24-a180",     label: "A 180 136 hp DCT",      fuelType: "gasoline", consumption: 6.1 },
    { id: "mba-24-a200",     label: "A 200 163 hp DCT",      fuelType: "gasoline", consumption: 6.4 },
    { id: "mba-24-a180d",    label: "A 180d 116 hp DCT",     fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Mercedes", model: "A Serisi", year: 2022, variants: [
    { id: "mba-22-a180",     label: "A 180 136 hp DCT",      fuelType: "gasoline", consumption: 6.2 },
    { id: "mba-22-a180d",    label: "A 180d 116 hp DCT",     fuelType: "diesel",   consumption: 4.6 },
  ]},
  { make: "Mercedes", model: "A Serisi", year: 2020, variants: [
    { id: "mba-20-a180",     label: "A 180 136 hp DCT",      fuelType: "gasoline", consumption: 6.3 },
    { id: "mba-20-a180d",    label: "A 180d 116 hp DCT",     fuelType: "diesel",   consumption: 4.7 },
  ]},
  { make: "Mercedes", model: "A Serisi", year: 2018, variants: [
    { id: "mba-18-a180",     label: "A 180 122 hp Manuel",   fuelType: "gasoline", consumption: 6.4 },
    { id: "mba-18-a180d",    label: "A 180d 109 hp Manuel",  fuelType: "diesel",   consumption: 4.7 },
  ]},

  // C Serisi — 2015–2024
  { make: "Mercedes", model: "C Serisi", year: 2024, variants: [
    { id: "mbc-24-c200",     label: "C 200 204 hp Otomatik", fuelType: "gasoline", consumption: 7.2 },
    { id: "mbc-24-c220d",    label: "C 220d 197 hp Otomatik",fuelType: "diesel",   consumption: 5.4 },
    { id: "mbc-24-c300e",    label: "C 300e Plug-in Hybrid", fuelType: "hybrid",   consumption: 1.8 },
  ]},
  { make: "Mercedes", model: "C Serisi", year: 2022, variants: [
    { id: "mbc-22-c200",     label: "C 200 204 hp Otomatik", fuelType: "gasoline", consumption: 7.3 },
    { id: "mbc-22-c220d",    label: "C 220d 197 hp Otomatik",fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "Mercedes", model: "C Serisi", year: 2020, variants: [
    { id: "mbc-20-c200",     label: "C 200 184 hp Otomatik", fuelType: "gasoline", consumption: 7.5 },
    { id: "mbc-20-c220d",    label: "C 220d 194 hp Otomatik",fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "Mercedes", model: "C Serisi", year: 2018, variants: [
    { id: "mbc-18-c180",     label: "C 180 156 hp Otomatik", fuelType: "gasoline", consumption: 7.2 },
    { id: "mbc-18-c220d",    label: "C 220d 170 hp Otomatik",fuelType: "diesel",   consumption: 5.6 },
  ]},
  { make: "Mercedes", model: "C Serisi", year: 2015, variants: [
    { id: "mbc-15-c180",     label: "C 180 156 hp Otomatik", fuelType: "gasoline", consumption: 7.4 },
    { id: "mbc-15-c220d",    label: "C 220 BlueTEC Otomatik",fuelType: "diesel",   consumption: 5.6 },
  ]},

  // EQA
  { make: "Mercedes", model: "EQA", year: 2024, variants: [
    { id: "mbeqa-24-250",    label: "EQA 250+ 66.5 kWh",     fuelType: "electric", consumption: 16.9 },
  ]},
  { make: "Mercedes", model: "EQA", year: 2022, variants: [
    { id: "mbeqa-22-250",    label: "EQA 250 66.5 kWh",      fuelType: "electric", consumption: 17.7 },
  ]},

  // ── FORD ────────────────────────────────────────────────────────────────
  // Focus — 2015–2024
  { make: "Ford", model: "Focus", year: 2024, variants: [
    { id: "focus-24-10t",    label: "1.0 EcoBoost 125 hp Manuel", fuelType: "gasoline", consumption: 6.0 },
    { id: "focus-24-15t",    label: "1.5 EcoBoost 182 hp Otomatik", fuelType: "gasoline", consumption: 7.1 },
    { id: "focus-24-15d",    label: "1.5 EcoBlue 120 hp Manuel",  fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Ford", model: "Focus", year: 2022, variants: [
    { id: "focus-22-10t",    label: "1.0 EcoBoost 125 hp Manuel", fuelType: "gasoline", consumption: 6.1 },
    { id: "focus-22-15d",    label: "1.5 EcoBlue 120 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Ford", model: "Focus", year: 2020, variants: [
    { id: "focus-20-10t",    label: "1.0 EcoBoost 100 hp Manuel", fuelType: "gasoline", consumption: 6.3 },
    { id: "focus-20-15d",    label: "1.5 EcoBlue 120 hp Manuel",  fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Ford", model: "Focus", year: 2018, variants: [
    { id: "focus-18-10t",    label: "1.0 EcoBoost 125 hp Manuel", fuelType: "gasoline", consumption: 6.5 },
    { id: "focus-18-15d",    label: "1.5 TDCi 120 hp Manuel",     fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Ford", model: "Focus", year: 2016, variants: [
    { id: "focus-16-10t",    label: "1.0 EcoBoost 125 hp Manuel", fuelType: "gasoline", consumption: 6.5 },
    { id: "focus-16-15d",    label: "1.5 TDCi 120 hp Manuel",     fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Ford", model: "Focus", year: 2015, variants: [
    { id: "focus-15-10t",    label: "1.0 EcoBoost 100 hp Manuel", fuelType: "gasoline", consumption: 6.6 },
    { id: "focus-15-16d",    label: "1.6 TDCi 115 hp Manuel",     fuelType: "diesel",   consumption: 5.3 },
  ]},

  // Fiesta — 2015–2023
  { make: "Ford", model: "Fiesta", year: 2023, variants: [
    { id: "fiesta-23-10t",   label: "1.0 EcoBoost 95 hp Manuel",  fuelType: "gasoline", consumption: 5.5 },
    { id: "fiesta-23-10t125",label: "1.0 EcoBoost 125 hp Otomatik",fuelType: "gasoline",consumption: 5.8 },
  ]},
  { make: "Ford", model: "Fiesta", year: 2021, variants: [
    { id: "fiesta-21-10t",   label: "1.0 EcoBoost 95 hp Manuel",  fuelType: "gasoline", consumption: 5.6 },
    { id: "fiesta-21-15d",   label: "1.5 TDCi 85 hp Manuel",      fuelType: "diesel",   consumption: 4.3 },
  ]},
  { make: "Ford", model: "Fiesta", year: 2019, variants: [
    { id: "fiesta-19-10t",   label: "1.0 EcoBoost 100 hp Manuel", fuelType: "gasoline", consumption: 5.6 },
    { id: "fiesta-19-15d",   label: "1.5 TDCi 85 hp Manuel",      fuelType: "diesel",   consumption: 4.4 },
  ]},
  { make: "Ford", model: "Fiesta", year: 2017, variants: [
    { id: "fiesta-17-10t",   label: "1.0 EcoBoost 100 hp Manuel", fuelType: "gasoline", consumption: 5.7 },
    { id: "fiesta-17-15d",   label: "1.5 TDCi 75 hp Manuel",      fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Ford", model: "Fiesta", year: 2015, variants: [
    { id: "fiesta-15-10t",   label: "1.0 EcoBoost 100 hp Manuel", fuelType: "gasoline", consumption: 5.8 },
    { id: "fiesta-15-15d",   label: "1.5 TDCi 75 hp Manuel",      fuelType: "diesel",   consumption: 4.5 },
  ]},

  // Kuga — 2019–2024
  { make: "Ford", model: "Kuga", year: 2024, variants: [
    { id: "kuga-24-25phev",  label: "2.5 PHEV 225 hp CVT",   fuelType: "hybrid",   consumption: 1.7 },
    { id: "kuga-24-15t",     label: "1.5 EcoBoost 150 hp Manuel", fuelType: "gasoline", consumption: 7.8 },
    { id: "kuga-24-20d",     label: "2.0 EcoBlue 150 hp Otomatik", fuelType: "diesel", consumption: 5.5 },
  ]},
  { make: "Ford", model: "Kuga", year: 2022, variants: [
    { id: "kuga-22-25phev",  label: "2.5 PHEV 225 hp CVT",   fuelType: "hybrid",   consumption: 1.8 },
    { id: "kuga-22-15t",     label: "1.5 EcoBoost 150 hp Manuel", fuelType: "gasoline", consumption: 8.0 },
    { id: "kuga-22-20d",     label: "2.0 EcoBlue 150 hp Otomatik", fuelType: "diesel", consumption: 5.6 },
  ]},
  { make: "Ford", model: "Kuga", year: 2020, variants: [
    { id: "kuga-20-15t",     label: "1.5 EcoBoost 150 hp Manuel", fuelType: "gasoline", consumption: 8.2 },
    { id: "kuga-20-20d",     label: "2.0 EcoBlue 150 hp Otomatik", fuelType: "diesel", consumption: 5.7 },
  ]},

  // Mustang Mach-E
  { make: "Ford", model: "Mustang Mach-E", year: 2024, variants: [
    { id: "mache-24-std",    label: "Standard Range RWD",    fuelType: "electric", consumption: 17.3 },
    { id: "mache-24-ext",    label: "Extended Range AWD",    fuelType: "electric", consumption: 19.4 },
  ]},
  { make: "Ford", model: "Mustang Mach-E", year: 2022, variants: [
    { id: "mache-22-std",    label: "Standard Range RWD",    fuelType: "electric", consumption: 17.8 },
    { id: "mache-22-ext",    label: "Extended Range AWD",    fuelType: "electric", consumption: 20.0 },
  ]},

  // ── HYUNDAI ─────────────────────────────────────────────────────────────
  // i20 — 2015–2025
  { make: "Hyundai", model: "i20", year: 2025, variants: [
    { id: "i20-25-10t",      label: "1.0 T-GDi 100 hp iMT",   fuelType: "gasoline", consumption: 5.4, transmission: "Manuel" },
    { id: "i20-25-12",       label: "1.2 MPI 84 hp Manuel",    fuelType: "gasoline", consumption: 5.7, transmission: "Manuel" },
  ]},
  { make: "Hyundai", model: "i20", year: 2024, variants: [
    { id: "i20-24-10t",      label: "1.0 T-GDi 100 hp iMT",  fuelType: "gasoline", consumption: 5.5 },
    { id: "i20-24-12",       label: "1.2 MPI 84 hp Manuel",   fuelType: "gasoline", consumption: 5.8 },
  ]},
  { make: "Hyundai", model: "i20", year: 2022, variants: [
    { id: "i20-22-10t",      label: "1.0 T-GDi 100 hp iMT",  fuelType: "gasoline", consumption: 5.6 },
    { id: "i20-22-12",       label: "1.2 MPI 84 hp Manuel",   fuelType: "gasoline", consumption: 5.9 },
  ]},
  { make: "Hyundai", model: "i20", year: 2020, variants: [
    { id: "i20-20-10t",      label: "1.0 T-GDi 100 hp iMT",  fuelType: "gasoline", consumption: 5.7 },
    { id: "i20-20-12",       label: "1.2 MPI 75 hp Manuel",   fuelType: "gasoline", consumption: 6.0 },
  ]},
  { make: "Hyundai", model: "i20", year: 2017, variants: [
    { id: "i20-17-12",       label: "1.2 MPI 75 hp Manuel",   fuelType: "gasoline", consumption: 6.0 },
    { id: "i20-17-14d",      label: "1.4 CRDi 75 hp Manuel",  fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Hyundai", model: "i20", year: 2015, variants: [
    { id: "i20-15-12",       label: "1.2 MPI 75 hp Manuel",   fuelType: "gasoline", consumption: 6.1 },
    { id: "i20-15-14d",      label: "1.4 CRDi 75 hp Manuel",  fuelType: "diesel",   consumption: 4.6 },
  ]},

  // i30 — 2015–2024
  { make: "Hyundai", model: "i30", year: 2024, variants: [
    { id: "i30-24-10t",      label: "1.0 T-GDi 120 hp iMT",  fuelType: "gasoline", consumption: 5.9 },
    { id: "i30-24-16d",      label: "1.6 CRDi 136 hp DCT",   fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Hyundai", model: "i30", year: 2022, variants: [
    { id: "i30-22-10t",      label: "1.0 T-GDi 120 hp iMT",  fuelType: "gasoline", consumption: 6.0 },
    { id: "i30-22-16d",      label: "1.6 CRDi 136 hp DCT",   fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Hyundai", model: "i30", year: 2020, variants: [
    { id: "i30-20-10t",      label: "1.0 T-GDi 120 hp iMT",  fuelType: "gasoline", consumption: 6.1 },
    { id: "i30-20-16d",      label: "1.6 CRDi 110 hp Manuel",fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Hyundai", model: "i30", year: 2018, variants: [
    { id: "i30-18-14t",      label: "1.4 T-GDi 140 hp DCT",  fuelType: "gasoline", consumption: 6.5 },
    { id: "i30-18-16d",      label: "1.6 CRDi 110 hp Manuel",fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Hyundai", model: "i30", year: 2016, variants: [
    { id: "i30-16-12t",      label: "1.2 T-GDi 120 hp Manuel",fuelType: "gasoline", consumption: 6.3 },
    { id: "i30-16-16d",      label: "1.6 CRDi 110 hp Manuel",fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Hyundai", model: "i30", year: 2015, variants: [
    { id: "i30-15-16",       label: "1.6 GDi 135 hp Manuel", fuelType: "gasoline", consumption: 7.0 },
    { id: "i30-15-16d",      label: "1.6 CRDi 110 hp Manuel",fuelType: "diesel",   consumption: 5.2 },
  ]},

  // Tucson — 2015–2024
  { make: "Hyundai", model: "Tucson", year: 2024, variants: [
    { id: "tucson-24-16t",   label: "1.6 T-GDi 150 hp DCT",  fuelType: "gasoline", consumption: 8.2 },
    { id: "tucson-24-16h",   label: "1.6 T-GDi HEV 230 hp",  fuelType: "hybrid",   consumption: 6.1 },
    { id: "tucson-24-16phev",label: "1.6 T-GDi PHEV 265 hp", fuelType: "hybrid",   consumption: 1.6 },
  ]},
  { make: "Hyundai", model: "Tucson", year: 2022, variants: [
    { id: "tucson-22-16t",   label: "1.6 T-GDi 150 hp DCT",  fuelType: "gasoline", consumption: 8.3 },
    { id: "tucson-22-16h",   label: "1.6 T-GDi HEV 230 hp",  fuelType: "hybrid",   consumption: 6.2 },
  ]},
  { make: "Hyundai", model: "Tucson", year: 2020, variants: [
    { id: "tucson-20-16t",   label: "1.6 T-GDi 177 hp DCT",  fuelType: "gasoline", consumption: 8.6 },
    { id: "tucson-20-20d",   label: "2.0 CRDi 185 hp Otomatik",fuelType: "diesel", consumption: 6.0 },
  ]},
  { make: "Hyundai", model: "Tucson", year: 2018, variants: [
    { id: "tucson-18-16t",   label: "1.6 T-GDi 177 hp DCT",  fuelType: "gasoline", consumption: 8.7 },
    { id: "tucson-18-20d",   label: "2.0 CRDi 136 hp Manuel",fuelType: "diesel",   consumption: 5.9 },
  ]},
  { make: "Hyundai", model: "Tucson", year: 2015, variants: [
    { id: "tucson-15-20",    label: "2.0 GDi 155 hp Manuel",  fuelType: "gasoline", consumption: 9.5 },
    { id: "tucson-15-20d",   label: "2.0 CRDi 136 hp Manuel",fuelType: "diesel",   consumption: 6.0 },
  ]},

  // IONIQ 6
  { make: "Hyundai", model: "IONIQ 6", year: 2024, variants: [
    { id: "ioniq6-24-53",    label: "53 kWh Standard RWD",    fuelType: "electric", consumption: 13.5 },
    { id: "ioniq6-24-77rwd", label: "77.4 kWh Long Range RWD",fuelType: "electric", consumption: 14.3 },
    { id: "ioniq6-24-77awd", label: "77.4 kWh Long Range AWD",fuelType: "electric", consumption: 16.9 },
  ]},
  { make: "Hyundai", model: "IONIQ 6", year: 2023, variants: [
    { id: "ioniq6-23-77rwd", label: "77.4 kWh Long Range RWD",fuelType: "electric", consumption: 14.5 },
    { id: "ioniq6-23-77awd", label: "77.4 kWh Long Range AWD",fuelType: "electric", consumption: 17.0 },
  ]},

  // ── KIA ─────────────────────────────────────────────────────────────────
  // Ceed — 2015–2024
  { make: "Kia", model: "Ceed", year: 2024, variants: [
    { id: "ceed-24-10t",     label: "1.0 T-GDi 120 hp iMT",  fuelType: "gasoline", consumption: 5.9 },
    { id: "ceed-24-16d",     label: "1.6 CRDi 136 hp DCT",   fuelType: "diesel",   consumption: 4.7 },
  ]},
  { make: "Kia", model: "Ceed", year: 2022, variants: [
    { id: "ceed-22-10t",     label: "1.0 T-GDi 120 hp iMT",  fuelType: "gasoline", consumption: 6.0 },
    { id: "ceed-22-16d",     label: "1.6 CRDi 136 hp DCT",   fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Kia", model: "Ceed", year: 2020, variants: [
    { id: "ceed-20-10t",     label: "1.0 T-GDi 120 hp Manuel",fuelType: "gasoline", consumption: 6.1 },
    { id: "ceed-20-16d",     label: "1.6 CRDi 115 hp Manuel",fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Kia", model: "Ceed", year: 2018, variants: [
    { id: "ceed-18-10t",     label: "1.0 T-GDi 120 hp Manuel",fuelType: "gasoline", consumption: 6.2 },
    { id: "ceed-18-16d",     label: "1.6 CRDi 115 hp Manuel",fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Kia", model: "Ceed", year: 2015, variants: [
    { id: "ceed-15-16",      label: "1.6 GDi 135 hp Manuel", fuelType: "gasoline", consumption: 7.0 },
    { id: "ceed-15-16d",     label: "1.6 CRDi 110 hp Manuel",fuelType: "diesel",   consumption: 5.2 },
  ]},

  // Sportage — 2015–2024
  { make: "Kia", model: "Sportage", year: 2024, variants: [
    { id: "sportage-24-16t", label: "1.6 T-GDi 150 hp DCT",  fuelType: "gasoline", consumption: 7.8 },
    { id: "sportage-24-16h", label: "1.6 T-GDi HEV 230 hp",  fuelType: "hybrid",   consumption: 6.0 },
    { id: "sportage-24-16phev",label:"1.6 T-GDi PHEV 265 hp",fuelType: "hybrid",   consumption: 1.5 },
  ]},
  { make: "Kia", model: "Sportage", year: 2022, variants: [
    { id: "sportage-22-16t", label: "1.6 T-GDi 150 hp DCT",  fuelType: "gasoline", consumption: 8.0 },
    { id: "sportage-22-16h", label: "1.6 T-GDi HEV 230 hp",  fuelType: "hybrid",   consumption: 6.1 },
  ]},
  { make: "Kia", model: "Sportage", year: 2020, variants: [
    { id: "sportage-20-16t", label: "1.6 T-GDi 177 hp DCT",  fuelType: "gasoline", consumption: 8.5 },
    { id: "sportage-20-20d", label: "2.0 CRDi 185 hp Otomatik",fuelType: "diesel", consumption: 6.0 },
  ]},
  { make: "Kia", model: "Sportage", year: 2018, variants: [
    { id: "sportage-18-16t", label: "1.6 T-GDi 177 hp DCT",  fuelType: "gasoline", consumption: 8.7 },
    { id: "sportage-18-20d", label: "2.0 CRDi 136 hp Manuel",fuelType: "diesel",   consumption: 6.0 },
  ]},
  { make: "Kia", model: "Sportage", year: 2015, variants: [
    { id: "sportage-15-20",  label: "2.0 GDi 163 hp Otomatik",fuelType: "gasoline", consumption: 9.5 },
    { id: "sportage-15-20d", label: "2.0 CRDi 136 hp Manuel",fuelType: "diesel",   consumption: 6.1 },
  ]},

  // EV6
  { make: "Kia", model: "EV6", year: 2024, variants: [
    { id: "ev6-24-58",       label: "58 kWh Standard RWD",    fuelType: "electric", consumption: 15.2 },
    { id: "ev6-24-77rwd",    label: "77.4 kWh Long Range RWD",fuelType: "electric", consumption: 16.0 },
    { id: "ev6-24-77awd",    label: "77.4 kWh Long Range AWD GT-Line",fuelType: "electric", consumption: 17.9 },
  ]},
  { make: "Kia", model: "EV6", year: 2022, variants: [
    { id: "ev6-22-58",       label: "58 kWh Standard RWD",    fuelType: "electric", consumption: 15.5 },
    { id: "ev6-22-77rwd",    label: "77.4 kWh Long Range RWD",fuelType: "electric", consumption: 16.5 },
  ]},
  { make: "Kia", model: "EV6", year: 2021, variants: [
    { id: "ev6-21-77rwd",    label: "77.4 kWh Long Range RWD",fuelType: "electric", consumption: 16.7 },
  ]},

  // ── FIAT ────────────────────────────────────────────────────────────────
  // Egea — 2016–2025 (very popular in Turkey)
  { make: "Fiat", model: "Egea", year: 2025, variants: [
    { id: "egea-25-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.4, transmission: "Manuel" },
    { id: "egea-25-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.3, transmission: "Manuel" },
    { id: "egea-25-10t",     label: "1.0 Firefly 100 hp Manuel",  fuelType: "gasoline", consumption: 5.5, transmission: "Manuel" },
  ]},
  { make: "Fiat", model: "Egea", year: 2024, variants: [
    { id: "egea-24-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.5 },
    { id: "egea-24-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.4 },
    { id: "egea-24-10t",     label: "1.0 Firefly 100 hp Manuel",  fuelType: "gasoline", consumption: 5.6 },
  ]},
  { make: "Fiat", model: "Egea", year: 2022, variants: [
    { id: "egea-22-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.6 },
    { id: "egea-22-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.5 },
    { id: "egea-22-10t",     label: "1.0 Firefly 100 hp Manuel",  fuelType: "gasoline", consumption: 5.7 },
  ]},
  { make: "Fiat", model: "Egea", year: 2020, variants: [
    { id: "egea-20-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.7 },
    { id: "egea-20-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.6 },
  ]},
  { make: "Fiat", model: "Egea", year: 2018, variants: [
    { id: "egea-18-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.7 },
    { id: "egea-18-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.7 },
  ]},
  { make: "Fiat", model: "Egea", year: 2016, variants: [
    { id: "egea-16-13",      label: "1.3 Multijet 95 hp Manuel",  fuelType: "diesel",   consumption: 4.8 },
    { id: "egea-16-14t",     label: "1.4 T-Jet 120 hp Manuel",    fuelType: "gasoline", consumption: 6.8 },
    { id: "egea-16-16",      label: "1.6 E-Torq 110 hp Manuel",   fuelType: "gasoline", consumption: 7.5 },
  ]},

  // 500
  { make: "Fiat", model: "500", year: 2024, variants: [
    { id: "500-24-10",       label: "1.0 BSG Hybrid 70 hp",   fuelType: "hybrid",   consumption: 4.8 },
    { id: "500-24-e",        label: "42 kWh Electric",        fuelType: "electric", consumption: 14.1 },
  ]},
  { make: "Fiat", model: "500", year: 2022, variants: [
    { id: "500-22-10",       label: "1.0 BSG Hybrid 70 hp",   fuelType: "hybrid",   consumption: 4.9 },
    { id: "500-22-e",        label: "42 kWh Electric",        fuelType: "electric", consumption: 14.5 },
  ]},
  { make: "Fiat", model: "500", year: 2019, variants: [
    { id: "500-19-12",       label: "1.2 69 hp Manuel",       fuelType: "gasoline", consumption: 5.8 },
    { id: "500-19-09t",      label: "0.9 TwinAir 85 hp",      fuelType: "gasoline", consumption: 4.9 },
  ]},
  { make: "Fiat", model: "500", year: 2016, variants: [
    { id: "500-16-12",       label: "1.2 69 hp Manuel",       fuelType: "gasoline", consumption: 5.9 },
    { id: "500-16-09t",      label: "0.9 TwinAir 85 hp",      fuelType: "gasoline", consumption: 5.0 },
  ]},

  // ── PEUGEOT ─────────────────────────────────────────────────────────────
  // 208 — 2015–2024
  { make: "Peugeot", model: "208", year: 2024, variants: [
    { id: "208-24-10",       label: "1.0 PureTech 75 hp Manuel",  fuelType: "gasoline", consumption: 4.9 },
    { id: "208-24-12",       label: "1.2 PureTech 100 hp EAT8",  fuelType: "gasoline", consumption: 5.5 },
    { id: "208-24-e",        label: "50 kWh e-208",               fuelType: "electric", consumption: 14.6 },
  ]},
  { make: "Peugeot", model: "208", year: 2022, variants: [
    { id: "208-22-12",       label: "1.2 PureTech 100 hp EAT8",  fuelType: "gasoline", consumption: 5.6 },
    { id: "208-22-e",        label: "50 kWh e-208",               fuelType: "electric", consumption: 15.1 },
  ]},
  { make: "Peugeot", model: "208", year: 2020, variants: [
    { id: "208-20-12",       label: "1.2 PureTech 100 hp EAT8",  fuelType: "gasoline", consumption: 5.7 },
    { id: "208-20-15d",      label: "1.5 BlueHDi 100 hp Manuel", fuelType: "diesel",   consumption: 4.3 },
  ]},
  { make: "Peugeot", model: "208", year: 2018, variants: [
    { id: "208-18-12",       label: "1.2 PureTech 82 hp Manuel", fuelType: "gasoline", consumption: 5.6 },
    { id: "208-18-15d",      label: "1.5 BlueHDi 100 hp Manuel", fuelType: "diesel",   consumption: 4.4 },
  ]},
  { make: "Peugeot", model: "208", year: 2015, variants: [
    { id: "208-15-12",       label: "1.2 PureTech 82 hp Manuel", fuelType: "gasoline", consumption: 5.7 },
    { id: "208-15-16d",      label: "1.6 BlueHDi 100 hp Manuel", fuelType: "diesel",   consumption: 4.5 },
  ]},

  // 308 — 2015–2024
  { make: "Peugeot", model: "308", year: 2024, variants: [
    { id: "308-24-12t",      label: "1.2 PureTech 130 hp EAT8",fuelType: "gasoline", consumption: 6.3 },
    { id: "308-24-15d",      label: "1.5 BlueHDi 130 hp EAT8", fuelType: "diesel",   consumption: 4.9 },
    { id: "308-24-phev",     label: "1.6 Plug-in Hybrid 225 hp",fuelType: "hybrid",   consumption: 1.4 },
  ]},
  { make: "Peugeot", model: "308", year: 2022, variants: [
    { id: "308-22-12t",      label: "1.2 PureTech 130 hp EAT8",fuelType: "gasoline", consumption: 6.4 },
    { id: "308-22-15d",      label: "1.5 BlueHDi 130 hp EAT8", fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Peugeot", model: "308", year: 2020, variants: [
    { id: "308-20-12t",      label: "1.2 PureTech 130 hp EAT8",fuelType: "gasoline", consumption: 6.5 },
    { id: "308-20-15d",      label: "1.5 BlueHDi 130 hp EAT8", fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Peugeot", model: "308", year: 2018, variants: [
    { id: "308-18-12t",      label: "1.2 PureTech 130 hp EAT6",fuelType: "gasoline", consumption: 6.7 },
    { id: "308-18-15d",      label: "1.5 BlueHDi 130 hp EAT6", fuelType: "diesel",   consumption: 5.2 },
  ]},
  { make: "Peugeot", model: "308", year: 2015, variants: [
    { id: "308-15-12t",      label: "1.2 PureTech 110 hp Manuel",fuelType: "gasoline", consumption: 6.8 },
    { id: "308-15-16d",      label: "1.6 BlueHDi 120 hp Manuel", fuelType: "diesel",   consumption: 5.2 },
  ]},

  // ── DACIA ───────────────────────────────────────────────────────────────
  // Sandero — 2015–2024
  { make: "Dacia", model: "Sandero", year: 2024, variants: [
    { id: "sandero-24-10t",  label: "1.0 TCe 90 hp CVT",      fuelType: "gasoline", consumption: 5.6 },
    { id: "sandero-24-10t65",label: "1.0 SCe 65 hp Manuel",   fuelType: "gasoline", consumption: 5.9 },
  ]},
  { make: "Dacia", model: "Sandero", year: 2022, variants: [
    { id: "sandero-22-10t",  label: "1.0 TCe 90 hp CVT",      fuelType: "gasoline", consumption: 5.7 },
    { id: "sandero-22-10t65",label: "1.0 SCe 65 hp Manuel",   fuelType: "gasoline", consumption: 6.0 },
  ]},
  { make: "Dacia", model: "Sandero", year: 2020, variants: [
    { id: "sandero-20-09t",  label: "0.9 TCe 90 hp Manuel",   fuelType: "gasoline", consumption: 5.9 },
    { id: "sandero-20-15d",  label: "1.5 dCi 90 hp Manuel",   fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Dacia", model: "Sandero", year: 2018, variants: [
    { id: "sandero-18-09t",  label: "0.9 TCe 90 hp Manuel",   fuelType: "gasoline", consumption: 6.0 },
    { id: "sandero-18-15d",  label: "1.5 dCi 90 hp Manuel",   fuelType: "diesel",   consumption: 4.5 },
  ]},
  { make: "Dacia", model: "Sandero", year: 2015, variants: [
    { id: "sandero-15-09t",  label: "0.9 TCe 90 hp Manuel",   fuelType: "gasoline", consumption: 6.2 },
    { id: "sandero-15-15d",  label: "1.5 dCi 90 hp Manuel",   fuelType: "diesel",   consumption: 4.6 },
  ]},

  // Duster — 2015–2024
  { make: "Dacia", model: "Duster", year: 2024, variants: [
    { id: "duster-24-10t130",label: "1.0 TCe 130 hp CVT",     fuelType: "gasoline", consumption: 6.9 },
    { id: "duster-24-15d",   label: "1.5 Blue dCi 115 hp Manuel",fuelType: "diesel", consumption: 5.2 },
  ]},
  { make: "Dacia", model: "Duster", year: 2022, variants: [
    { id: "duster-22-10t",   label: "1.0 TCe 100 hp Manuel",  fuelType: "gasoline", consumption: 7.2 },
    { id: "duster-22-15d",   label: "1.5 Blue dCi 115 hp Manuel",fuelType: "diesel", consumption: 5.3 },
  ]},
  { make: "Dacia", model: "Duster", year: 2020, variants: [
    { id: "duster-20-10t",   label: "1.0 TCe 100 hp Manuel",  fuelType: "gasoline", consumption: 7.4 },
    { id: "duster-20-15d",   label: "1.5 dCi 115 hp Manuel",  fuelType: "diesel",   consumption: 5.3 },
  ]},
  { make: "Dacia", model: "Duster", year: 2017, variants: [
    { id: "duster-17-12t",   label: "1.2 TCe 125 hp Manuel",  fuelType: "gasoline", consumption: 7.8 },
    { id: "duster-17-15d",   label: "1.5 dCi 110 hp Manuel",  fuelType: "diesel",   consumption: 5.5 },
  ]},
  { make: "Dacia", model: "Duster", year: 2015, variants: [
    { id: "duster-15-16",    label: "1.6 SCe 114 hp Manuel",  fuelType: "gasoline", consumption: 8.5 },
    { id: "duster-15-15d",   label: "1.5 dCi 110 hp Manuel",  fuelType: "diesel",   consumption: 5.6 },
  ]},

  // ── SKODA ───────────────────────────────────────────────────────────────
  // Fabia — 2015–2024
  { make: "Skoda", model: "Fabia", year: 2024, variants: [
    { id: "fabia-24-10t95",  label: "1.0 TSI 95 hp Manuel",   fuelType: "gasoline", consumption: 4.8 },
    { id: "fabia-24-10t110", label: "1.0 TSI 110 hp DSG",     fuelType: "gasoline", consumption: 5.2 },
  ]},
  { make: "Skoda", model: "Fabia", year: 2022, variants: [
    { id: "fabia-22-10t95",  label: "1.0 TSI 95 hp Manuel",   fuelType: "gasoline", consumption: 4.9 },
    { id: "fabia-22-10t110", label: "1.0 TSI 110 hp DSG",     fuelType: "gasoline", consumption: 5.3 },
  ]},
  { make: "Skoda", model: "Fabia", year: 2020, variants: [
    { id: "fabia-20-10t95",  label: "1.0 TSI 95 hp Manuel",   fuelType: "gasoline", consumption: 5.0 },
    { id: "fabia-20-14t150", label: "1.4 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.0 },
  ]},
  { make: "Skoda", model: "Fabia", year: 2018, variants: [
    { id: "fabia-18-10t95",  label: "1.0 TSI 95 hp Manuel",   fuelType: "gasoline", consumption: 5.1 },
    { id: "fabia-18-14t150", label: "1.4 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.1 },
  ]},
  { make: "Skoda", model: "Fabia", year: 2015, variants: [
    { id: "fabia-15-10t",    label: "1.0 MPI 75 hp Manuel",   fuelType: "gasoline", consumption: 5.3 },
    { id: "fabia-15-16d",    label: "1.6 TDI 90 hp Manuel",   fuelType: "diesel",   consumption: 4.2 },
  ]},

  // Octavia — 2015–2024
  { make: "Skoda", model: "Octavia", year: 2024, variants: [
    { id: "octavia-24-15t",  label: "1.5 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.0 },
    { id: "octavia-24-20tdi",label: "2.0 TDI 150 hp DSG",     fuelType: "diesel",   consumption: 4.7 },
    { id: "octavia-24-14gte",label: "1.4 iV Plug-in Hybrid",  fuelType: "hybrid",   consumption: 1.6 },
  ]},
  { make: "Skoda", model: "Octavia", year: 2022, variants: [
    { id: "octavia-22-15t",  label: "1.5 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.1 },
    { id: "octavia-22-20tdi",label: "2.0 TDI 150 hp DSG",     fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Skoda", model: "Octavia", year: 2020, variants: [
    { id: "octavia-20-15t",  label: "1.5 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.2 },
    { id: "octavia-20-20tdi",label: "2.0 TDI 115 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Skoda", model: "Octavia", year: 2018, variants: [
    { id: "octavia-18-14t",  label: "1.4 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.5 },
    { id: "octavia-18-20tdi",label: "2.0 TDI 150 hp DSG",     fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Skoda", model: "Octavia", year: 2016, variants: [
    { id: "octavia-16-14t",  label: "1.4 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.5 },
    { id: "octavia-16-16tdi",label: "1.6 TDI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.8 },
  ]},
  { make: "Skoda", model: "Octavia", year: 2015, variants: [
    { id: "octavia-15-14t",  label: "1.4 TSI 150 hp DSG",     fuelType: "gasoline", consumption: 6.6 },
    { id: "octavia-15-16tdi",label: "1.6 TDI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},

  // ── TOGG ────────────────────────────────────────────────────────────────
  { make: "Togg", model: "T10X", year: 2024, variants: [
    { id: "t10x-24-rwd",     label: "88 kWh RWD 200 hp",      fuelType: "electric", consumption: 16.4 },
    { id: "t10x-24-awd",     label: "88 kWh AWD 400 hp",      fuelType: "electric", consumption: 18.9 },
  ]},
  { make: "Togg", model: "T10X", year: 2023, variants: [
    { id: "t10x-23-rwd",     label: "88 kWh RWD 200 hp",      fuelType: "electric", consumption: 16.6 },
    { id: "t10x-23-awd",     label: "88 kWh AWD 400 hp",      fuelType: "electric", consumption: 19.2 },
  ]},
  { make: "Togg", model: "T10F", year: 2024, variants: [
    { id: "t10f-24-rwd",     label: "53 kWh RWD 200 hp",      fuelType: "electric", consumption: 15.0 },
  ]},
  { make: "Togg", model: "T10F", year: 2023, variants: [
    { id: "t10f-23-rwd",     label: "53 kWh RWD 200 hp",      fuelType: "electric", consumption: 15.2 },
  ]},

  // ── HONDA ───────────────────────────────────────────────────────────────
  // Civic — 2015–2024
  { make: "Honda", model: "Civic", year: 2024, variants: [
    { id: "civic-24-15t",    label: "1.5 VTEC Turbo 182 hp CVT",  fuelType: "gasoline", consumption: 7.2 },
    { id: "civic-24-20h",    label: "2.0 e:HEV Hybrid CVT",       fuelType: "hybrid",   consumption: 5.1 },
  ]},
  { make: "Honda", model: "Civic", year: 2022, variants: [
    { id: "civic-22-15t",    label: "1.5 VTEC Turbo 182 hp CVT",  fuelType: "gasoline", consumption: 7.3 },
  ]},
  { make: "Honda", model: "Civic", year: 2020, variants: [
    { id: "civic-20-15t",    label: "1.5 VTEC Turbo 182 hp CVT",  fuelType: "gasoline", consumption: 7.5 },
    { id: "civic-20-16d",    label: "1.6 i-DTEC 120 hp Manuel",   fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Honda", model: "Civic", year: 2018, variants: [
    { id: "civic-18-15t",    label: "1.5 VTEC Turbo 182 hp CVT",  fuelType: "gasoline", consumption: 7.6 },
    { id: "civic-18-16d",    label: "1.6 i-DTEC 120 hp Manuel",   fuelType: "diesel",   consumption: 5.1 },
  ]},
  { make: "Honda", model: "Civic", year: 2016, variants: [
    { id: "civic-16-15t",    label: "1.5 VTEC Turbo 182 hp CVT",  fuelType: "gasoline", consumption: 7.8 },
    { id: "civic-16-16d",    label: "1.6 i-DTEC 120 hp Manuel",   fuelType: "diesel",   consumption: 5.2 },
  ]},
  { make: "Honda", model: "Civic", year: 2015, variants: [
    { id: "civic-15-18",     label: "1.8 i-VTEC 142 hp Manuel",   fuelType: "gasoline", consumption: 8.0 },
    { id: "civic-15-16d",    label: "1.6 i-DTEC 120 hp Manuel",   fuelType: "diesel",   consumption: 5.2 },
  ]},

  // ── NISSAN ──────────────────────────────────────────────────────────────
  // Qashqai — 2015–2024
  { make: "Nissan", model: "Qashqai", year: 2024, variants: [
    { id: "qashqai-24-13t",  label: "1.3 DIG-T 158 hp Mild Hybrid", fuelType: "gasoline", consumption: 7.6 },
    { id: "qashqai-24-15eh", label: "1.5 e-Power 190 hp",           fuelType: "hybrid",   consumption: 6.0 },
  ]},
  { make: "Nissan", model: "Qashqai", year: 2022, variants: [
    { id: "qashqai-22-13t",  label: "1.3 DIG-T 158 hp Mild Hybrid", fuelType: "gasoline", consumption: 7.8 },
    { id: "qashqai-22-15eh", label: "1.5 e-Power 190 hp",           fuelType: "hybrid",   consumption: 6.2 },
  ]},
  { make: "Nissan", model: "Qashqai", year: 2020, variants: [
    { id: "qashqai-20-13t",  label: "1.3 DIG-T 160 hp DCT",  fuelType: "gasoline", consumption: 8.0 },
    { id: "qashqai-20-15d",  label: "1.5 dCi 115 hp Manuel", fuelType: "diesel",   consumption: 5.3 },
  ]},
  { make: "Nissan", model: "Qashqai", year: 2018, variants: [
    { id: "qashqai-18-12t",  label: "1.2 DIG-T 115 hp Manuel",fuelType: "gasoline", consumption: 7.8 },
    { id: "qashqai-18-15d",  label: "1.5 dCi 110 hp Manuel", fuelType: "diesel",   consumption: 5.4 },
  ]},
  { make: "Nissan", model: "Qashqai", year: 2015, variants: [
    { id: "qashqai-15-16",   label: "1.6 DIG-T 163 hp Manuel",fuelType: "gasoline", consumption: 8.1 },
    { id: "qashqai-15-16d",  label: "1.6 dCi 130 hp Manuel", fuelType: "diesel",   consumption: 5.5 },
  ]},

  // Leaf
  { make: "Nissan", model: "Leaf", year: 2024, variants: [
    { id: "leaf-24-40",      label: "40 kWh 150 hp",          fuelType: "electric", consumption: 17.2 },
    { id: "leaf-24-62",      label: "62 kWh 217 hp e+",       fuelType: "electric", consumption: 18.0 },
  ]},
  { make: "Nissan", model: "Leaf", year: 2022, variants: [
    { id: "leaf-22-40",      label: "40 kWh 150 hp",          fuelType: "electric", consumption: 17.5 },
    { id: "leaf-22-62",      label: "62 kWh 217 hp e+",       fuelType: "electric", consumption: 18.4 },
  ]},
  { make: "Nissan", model: "Leaf", year: 2019, variants: [
    { id: "leaf-19-40",      label: "40 kWh 150 hp",          fuelType: "electric", consumption: 17.8 },
  ]},

  // ── OPEL ────────────────────────────────────────────────────────────────
  // Astra — 2015–2024
  { make: "Opel", model: "Astra", year: 2024, variants: [
    { id: "astra-24-10t",    label: "1.0 Turbo 105 hp Manuel", fuelType: "gasoline", consumption: 5.9 },
    { id: "astra-24-15t",    label: "1.5 Turbo 130 hp Otomatik",fuelType: "gasoline",consumption: 6.6 },
    { id: "astra-24-16d",    label: "1.6 CDTI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.8 },
    { id: "astra-24-phev",   label: "1.6 Plug-in Hybrid 225 hp",fuelType: "hybrid",  consumption: 1.5 },
  ]},
  { make: "Opel", model: "Astra", year: 2022, variants: [
    { id: "astra-22-10t",    label: "1.0 Turbo 105 hp Manuel", fuelType: "gasoline", consumption: 6.0 },
    { id: "astra-22-16d",    label: "1.6 CDTI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Opel", model: "Astra", year: 2020, variants: [
    { id: "astra-20-10t",    label: "1.0 Turbo 105 hp Manuel", fuelType: "gasoline", consumption: 6.1 },
    { id: "astra-20-15d",    label: "1.5 CDTI 122 hp Otomatik",fuelType: "diesel",   consumption: 5.0 },
  ]},
  { make: "Opel", model: "Astra", year: 2018, variants: [
    { id: "astra-18-10t",    label: "1.0 Turbo 105 hp Manuel", fuelType: "gasoline", consumption: 6.2 },
    { id: "astra-18-16d",    label: "1.6 CDTI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},
  { make: "Opel", model: "Astra", year: 2015, variants: [
    { id: "astra-15-14t",    label: "1.4 Turbo 140 hp Manuel", fuelType: "gasoline", consumption: 6.3 },
    { id: "astra-15-16d",    label: "1.6 CDTI 110 hp Manuel",  fuelType: "diesel",   consumption: 4.9 },
  ]},

  // Corsa — 2015–2024
  { make: "Opel", model: "Corsa", year: 2024, variants: [
    { id: "corsa-24-10t",    label: "1.0 Turbo 100 hp Manuel", fuelType: "gasoline", consumption: 5.5 },
    { id: "corsa-24-12t",    label: "1.2 Turbo 130 hp Otomatik",fuelType: "gasoline",consumption: 5.8 },
    { id: "corsa-24-e",      label: "50 kWh Corsa-e",          fuelType: "electric", consumption: 14.6 },
  ]},
  { make: "Opel", model: "Corsa", year: 2022, variants: [
    { id: "corsa-22-10t",    label: "1.0 Turbo 100 hp Manuel", fuelType: "gasoline", consumption: 5.6 },
    { id: "corsa-22-e",      label: "50 kWh Corsa-e",          fuelType: "electric", consumption: 15.1 },
  ]},
  { make: "Opel", model: "Corsa", year: 2020, variants: [
    { id: "corsa-20-10t",    label: "1.0 Turbo 100 hp Manuel", fuelType: "gasoline", consumption: 5.7 },
  ]},
  { make: "Opel", model: "Corsa", year: 2018, variants: [
    { id: "corsa-18-10t",    label: "1.0 Turbo 90 hp Manuel",  fuelType: "gasoline", consumption: 5.6 },
    { id: "corsa-18-14d",    label: "1.4 CDTi 95 hp Manuel",   fuelType: "diesel",   consumption: 4.3 },
  ]},
  { make: "Opel", model: "Corsa", year: 2015, variants: [
    { id: "corsa-15-10t",    label: "1.0 Turbo 90 hp Manuel",  fuelType: "gasoline", consumption: 5.7 },
    { id: "corsa-15-13d",    label: "1.3 CDTi 75 hp Manuel",   fuelType: "diesel",   consumption: 4.2 },
  ]},

  // Tesla (popular in Turkey)
  { make: "Tesla", model: "Model 3", year: 2024, variants: [
    { id: "m3-24-rwd",       label: "Standard Range RWD",      fuelType: "electric", consumption: 14.2 },
    { id: "m3-24-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 15.1 },
    { id: "m3-24-perf",      label: "Performance AWD",         fuelType: "electric", consumption: 16.4 },
  ]},
  { make: "Tesla", model: "Model 3", year: 2023, variants: [
    { id: "m3-23-rwd",       label: "Standard Range RWD",      fuelType: "electric", consumption: 14.5 },
    { id: "m3-23-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 15.4 },
  ]},
  { make: "Tesla", model: "Model 3", year: 2021, variants: [
    { id: "m3-21-rwd",       label: "Standard Range Plus RWD", fuelType: "electric", consumption: 14.8 },
    { id: "m3-21-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 15.8 },
  ]},
  { make: "Tesla", model: "Model Y", year: 2024, variants: [
    { id: "my-24-rwd",       label: "Standard Range RWD",      fuelType: "electric", consumption: 15.5 },
    { id: "my-24-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 16.3 },
  ]},
  { make: "Tesla", model: "Model Y", year: 2023, variants: [
    { id: "my-23-rwd",       label: "Standard Range RWD",      fuelType: "electric", consumption: 15.8 },
    { id: "my-23-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 16.7 },
  ]},
  { make: "Tesla", model: "Model Y", year: 2022, variants: [
    { id: "my-22-lrawd",     label: "Long Range AWD",          fuelType: "electric", consumption: 17.0 },
    { id: "my-22-perf",      label: "Performance AWD",         fuelType: "electric", consumption: 18.0 },
  ]},
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
