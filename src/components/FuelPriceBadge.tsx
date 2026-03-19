"use client";

import type { FuelPrices } from "@/types";

interface Props {
  prices: FuelPrices | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FuelPriceBadge({ prices, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        Konum tespit ediliyor…
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "#f87171" }}>
        <span>Fiyat bilgisi alınamadı</span>
        <button onClick={onRetry} className="underline text-purple-400 hover:text-purple-300">
          Tekrar dene
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {/* Location label */}
      <div className="flex items-center gap-1.5">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#a855f7" }}
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {prices.city} için güncel fiyatlar
        </span>
      </div>

      {/* Prices */}
      <div className="flex gap-2 flex-wrap">
        <PricePill label="Benzin" value={prices.gasoline} unit="₺/L" />
        <PricePill label="Dizel" value={prices.diesel} unit="₺/L" />
        <PricePill label="LPG" value={prices.lpg} unit="₺/L" />
        <PricePill label="Elektrik" value={prices.electric} unit="₺/kWh" />
      </div>

      {/* Timestamp + fallback warning */}
      <div
        className="w-full flex items-center gap-2 text-xs mt-0.5"
        style={{ color: "var(--text-secondary)" }}
      >
        <span>Son güncelleme: {formatTime(prices.updatedAt)}</span>
        {prices.isFallback && (
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "rgba(251, 191, 36, 0.15)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.3)",
            }}
          >
            Veriler güncel olmayabilir
          </span>
        )}
        {error && !prices.isFallback && (
          <button onClick={onRetry} className="underline text-purple-400 hover:text-purple-300">
            Konumu güncelle
          </button>
        )}
      </div>
    </div>
  );
}

function PricePill({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: "rgba(168, 85, 247, 0.12)",
        border: "1px solid rgba(168, 85, 247, 0.25)",
        color: "#d8b4fe",
      }}
    >
      <span style={{ color: "var(--text-secondary)" }}>{label}:</span>
      {value.toFixed(2)} {unit}
    </span>
  );
}
