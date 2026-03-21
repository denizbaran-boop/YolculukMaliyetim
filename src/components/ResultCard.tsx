"use client";

import type { CalculationResult, VehicleVariant } from "@/types";
import { formatTL, formatDuration, fuelUnitLabel } from "@/lib/calculator";

interface Props {
  result: CalculationResult | null;
  variant: VehicleVariant | null;
  peopleCount: number;
  /** Total toll/bridge cost in TRY (0 if no tolls detected). */
  tollCost?: number;
}

export default function ResultCard({ result, variant, peopleCount, tollCost = 0 }: Props) {
  const hasResult = result && variant && isFinite(result.totalCost) && result.totalCost > 0;

  if (!hasResult) {
    return (
      <div
        className="glass-card p-6 flex flex-col items-center justify-center gap-3 text-center"
        style={{ minHeight: 180 }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(168,85,247,0.12)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Araç ve yolculuk bilgilerini girerek
          <br />
          maliyet hesaplamasını başlatın
        </p>
      </div>
    );
  }

  const unit = fuelUnitLabel(variant.fuelType);
  const hasToll = tollCost > 0;
  const displayTotal = result.totalCost + tollCost;
  const displayPerPerson = displayTotal / Math.max(1, peopleCount);
  const showPerPerson = peopleCount > 1;

  return (
    <div className="glass-card result-glow p-6 fade-in flex flex-col gap-5">
      {/* Hero: fuel cost + toll cost side by side when toll applies */}
      {hasToll ? (
        <div className="text-center">
          <div className="flex items-end justify-center gap-3 flex-wrap">
            {/* Fuel — big purple */}
            <div className="flex flex-col items-center">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Yakıt
              </p>
              <p
                className="font-bold leading-none"
                style={{
                  fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
                  background: "linear-gradient(135deg, #c084fc, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {formatTL(result.totalCost)}
              </p>
            </div>

            {/* Plus separator */}
            <p
              className="font-bold pb-1"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#4ade80" }}
            >
              +
            </p>

            {/* Toll — green */}
            <div className="flex flex-col items-center fade-in">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#4ade80", opacity: 0.8 }}
              >
                Otoyol / Köprü
              </p>
              <p
                className="font-bold leading-none"
                style={{
                  fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)",
                  color: "#22c55e",
                }}
              >
                {formatTL(tollCost)}
              </p>
            </div>
          </div>

          {/* Total summary */}
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            Toplam: {formatTL(displayTotal)}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Toplam Maliyet
          </p>
          <p
            className="font-bold leading-none"
            style={{
              fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
              background: "linear-gradient(135deg, #c084fc, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatTL(displayTotal)}
          </p>
        </div>
      )}

      <hr className="divider" style={{ margin: "0" }} />

      {/* Per-person */}
      {showPerPerson && (
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Kişi başı ({peopleCount} kişi)
          </span>
          <span className="text-lg font-bold" style={{ color: "#c084fc" }}>
            {formatTL(displayPerPerson)}
          </span>
        </div>
      )}

      {/* Cost breakdown rows — only when toll applies */}
      {hasToll && (
        <>
          <div className="flex items-center justify-between fade-in">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              ⛽ Yakıt Maliyeti
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatTL(result.totalCost)}
            </span>
          </div>

          <div className="flex items-start justify-between fade-in">
            <div>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                🛣 Otoyol / Köprü Ücreti
              </span>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)", opacity: 0.65 }}>
                Tahmini otoyol ve köprü ücreti
              </p>
            </div>
            <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
              {formatTL(tollCost)}
            </span>
          </div>
        </>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatPill
          icon="⛽"
          label={`Yakıt (${unit})`}
          value={`${result.fuelUsed} ${unit}`}
        />
        <StatPill
          icon="⏱"
          label="Tahmini süre"
          value={formatDuration(result.duration)}
        />
        <StatPill
          icon="🚀"
          label="Ort. hız"
          value={`${result.avgSpeed} km/h`}
        />
        <StatPill
          icon="📊"
          label="Düz. tüketim"
          value={`${result.adjustedConsumption} ${unit}/100km`}
        />
      </div>

      {/* Speed adjustment note */}
      {result.adjustedConsumption !== variant.consumption && (
        <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
          Hız bazlı düzeltme uygulandı (baz: {variant.consumption} {unit}/100km)
        </p>
      )}
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 px-3 py-2.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {icon} {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}
