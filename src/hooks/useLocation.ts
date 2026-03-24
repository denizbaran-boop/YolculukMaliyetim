"use client";

import { useState, useEffect, useCallback } from "react";
import type { FuelPrices } from "@/types";

interface LocationState {
  city: string | null;
  fuelPrices: FuelPrices | null;
  loading: boolean;
  error: string | null;
}

/**
 * Resolves browser geolocation → reverse geocodes to city name →
 * fetches fuel prices for that city via /api/fuel.
 *
 * Falls back to Turkey average if anything fails.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    city: null,
    fuelPrices: null,
    loading: true,
    error: null,
  });

  const fetchFuelPrices = useCallback(async (city: string) => {
    const res = await fetch(`/api/fuel?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error("Yakıt fiyatları alınamadı");
    return (await res.json()) as FuelPrices;
  }, []);

  const detect = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    // 1. Try browser geolocation
    if (!navigator.geolocation) {
      const prices = await fetchFuelPrices("").catch(() => null);
      setState({ city: null, fuelPrices: prices, loading: false, error: "Konum desteklenmiyor" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // 2. Reverse geocode with Nominatim (OpenStreetMap, no key required)
          const { latitude, longitude } = pos.coords;
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`,
            { headers: { "User-Agent": "yolculukmaliyetim.com/1.0" } }
          );
          const geoData = await geoRes.json();
          // Use province-level name so the fuel API can match a region.
          // In Turkey, Nominatim returns the province under address.province
          // (e.g. "İstanbul" for Şile, Kadıköy, etc.) — NOT address.state.
          // address.city / address.town are district-level and won't match.
          const city: string =
            geoData?.address?.province ||
            geoData?.address?.state ||
            geoData?.address?.city ||
            geoData?.address?.town ||
            geoData?.address?.county ||
            "";

          // 3. Fetch fuel prices for city
          const prices = await fetchFuelPrices(city);
          setState({ city, fuelPrices: prices, loading: false, error: null });
        } catch {
          // Geocoding failed — use Turkey average
          const prices = await fetchFuelPrices("").catch(() => null);
          setState({ city: null, fuelPrices: prices, loading: false, error: "Konum bilgisi alınamadı" });
        }
      },
      async () => {
        // User denied or timed out
        const prices = await fetchFuelPrices("").catch(() => null);
        setState({ city: null, fuelPrices: prices, loading: false, error: "Konum izni verilmedi" });
      },
      { timeout: 8000 }
    );
  }, [fetchFuelPrices]);

  useEffect(() => {
    detect();
  }, [detect]);

  return { ...state, retry: detect };
}
