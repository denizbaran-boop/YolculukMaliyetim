"use client";

import type { CalculationResult, VehicleVariant } from "@/types";
import { formatTL, formatDuration, fuelUnitLabel } from "@/lib/calculator";

interface Props {
  result: CalculationResult | null;
  variant: VehicleVariant | null;
  peopleCount: number;
}

export default function ResultCard({ result, variant, peopleCount }: Props) {
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
  const showPerPerson = peopleCount > 1;

  return (
    <div className="glass-card result-glow p-6 fade-in flex flex-col gap-5">
      {/* Total cost — hero number */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
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
          {formatTL(result.totalCost)}
        </p>
      </div>

      <hr className="divider" style={{ margin: "0" }} />

      {/* Per-person */}
      {showPerPerson && (
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Kişi başı ({peopleCount} kişi)
          </span>
          <span className="text-lg font-bold" style={{ color: "#c084fc" }}>
            {formatTL(result.costPerPerson)}
          </span>
        </div>
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
