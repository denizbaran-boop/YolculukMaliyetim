"use client";

import { useState, useEffect } from "react";
import type { VehicleVariant } from "@/types";
import { getMakes, getModels, getYears, getVariants } from "@/data/vehicles";

interface Props {
  onVariantChange: (variant: VehicleVariant | null) => void;
}

export default function VehicleSelector({ onVariantChange }: Props) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [variantId, setVariantId] = useState("");

  const makes = getMakes();
  const models = make ? getModels(make) : [];
  const years = make && model ? getYears(make, model) : [];
  const variants = make && model && year ? getVariants(make, model, Number(year)) : [];

  // Reset downstream on upstream change
  useEffect(() => {
    setModel("");
    setYear("");
    setVariantId("");
    onVariantChange(null);
  }, [make]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setYear("");
    setVariantId("");
    onVariantChange(null);
  }, [model]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setVariantId("");
    onVariantChange(null);
  }, [year]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const found = variants.find((v) => v.id === variantId) ?? null;
    onVariantChange(found);
  }, [variantId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Make + Model */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Marka</label>
          <select
            className="input-base"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          >
            <option value="">Seçiniz…</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Model</label>
          <select
            className="input-base"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
          >
            <option value="">Seçiniz…</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Year + Variant */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Yıl</label>
          <select
            className="input-base"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={!model}
          >
            <option value="">Seçiniz…</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Motor / Varyant</label>
          <select
            className="input-base"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            disabled={!year || variants.length === 0}
          >
            <option value="">Seçiniz…</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Variant info badge */}
      {variantId && variants.find((v) => v.id === variantId) && (
        <VariantBadge variant={variants.find((v) => v.id === variantId)!} />
      )}
    </div>
  );
}

function VariantBadge({ variant }: { variant: VehicleVariant }) {
  const fuelLabels: Record<VehicleVariant["fuelType"], string> = {
    gasoline: "Benzin",
    diesel: "Dizel",
    hybrid: "Hibrit",
    electric: "Elektrik",
    lpg: "LPG",
  };

  const fuelColors: Record<VehicleVariant["fuelType"], string> = {
    gasoline: "#fb923c",
    diesel: "#60a5fa",
    hybrid: "#34d399",
    electric: "#a78bfa",
    lpg: "#f472b6",
  };

  const unit = variant.fuelType === "electric" ? "kWh/100km" : "L/100km";

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm fade-in"
      style={{
        background: "rgba(168, 85, 247, 0.08)",
        border: "1px solid rgba(168, 85, 247, 0.2)",
      }}
    >
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{
          background: `${fuelColors[variant.fuelType]}22`,
          color: fuelColors[variant.fuelType],
          border: `1px solid ${fuelColors[variant.fuelType]}44`,
        }}
      >
        {fuelLabels[variant.fuelType]}
      </span>
      <span style={{ color: "var(--text-secondary)" }}>
        Tüketim:{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          {variant.consumption} {unit}
        </strong>
      </span>
    </div>
  );
}
