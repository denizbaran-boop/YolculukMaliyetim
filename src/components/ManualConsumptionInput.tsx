"use client";

import { useState, useEffect } from "react";
import type { VehicleVariant } from "@/types";

interface Props {
  onVariantChange: (variant: VehicleVariant | null) => void;
}

type ManualFuelType = "gasoline" | "diesel" | "electric";

const FUEL_OPTIONS: { value: ManualFuelType; label: string; unit: string; color: string }[] = [
  { value: "gasoline", label: "Benzin",   unit: "L/100km",   color: "#fb923c" },
  { value: "diesel",   label: "Dizel",    unit: "L/100km",   color: "#60a5fa" },
  { value: "electric", label: "Elektrik", unit: "kWh/100km", color: "#a78bfa" },
];

// Warn if above these values (still allow calculation)
const WARN_THRESHOLD: Record<ManualFuelType, number> = {
  gasoline: 25,
  diesel:   25,
  electric: 40,
};

// Hard max — reject above these
const MAX_THRESHOLD: Record<ManualFuelType, number> = {
  gasoline: 40,
  diesel:   40,
  electric: 60,
};

export default function ManualConsumptionInput({ onVariantChange }: Props) {
  const [fuelType, setFuelType] = useState<ManualFuelType | "">("");
  const [rawValue, setRawValue] = useState("");

  const selectedFuel = FUEL_OPTIONS.find((f) => f.value === fuelType) ?? null;
  const consumption = parseFloat(rawValue);

  // Validation
  const isEmpty = rawValue.trim() === "";
  const isInvalid = !isEmpty && (isNaN(consumption) || consumption <= 0);
  const isOverMax = !isEmpty && !isNaN(consumption) && fuelType !== ""
    ? consumption > MAX_THRESHOLD[fuelType]
    : false;
  const isWarning = !isEmpty && !isNaN(consumption) && fuelType !== "" && !isOverMax
    ? consumption > WARN_THRESHOLD[fuelType]
    : false;
  const isValid = !isEmpty && !isNaN(consumption) && consumption > 0 && !isOverMax;

  // Emit a synthetic VehicleVariant whenever inputs are valid
  useEffect(() => {
    if (!fuelType || !isValid) {
      onVariantChange(null);
      return;
    }

    const unit = fuelType === "electric" ? "kWh/100km" : "L/100km";
    onVariantChange({
      id:          "manual",
      label:       `Manuel — ${consumption} ${unit}`,
      fuelType,
      consumption,
    });
  }, [fuelType, rawValue, isValid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset consumption when fuel type changes
  const handleFuelTypeChange = (next: ManualFuelType) => {
    setFuelType(next);
    setRawValue("");
    onVariantChange(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Yakıt Türü */}
      <div>
        <label className="label">Yakıt Türü</label>
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          {FUEL_OPTIONS.map((opt) => {
            const active = fuelType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleFuelTypeChange(opt.value)}
                className="px-2 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                style={{
                  background: active
                    ? `${opt.color}22`
                    : "rgba(255,255,255,0.04)",
                  border: active
                    ? `1.5px solid ${opt.color}66`
                    : "1.5px solid rgba(255,255,255,0.08)",
                  color: active ? opt.color : "var(--text-secondary)",
                  boxShadow: active ? `0 0 12px ${opt.color}22` : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tüketim Input */}
      <div>
        <label className="label">Ortalama Tüketim</label>
        <div className="relative mt-1">
          <input
            type="number"
            inputMode="decimal"
            min="0.1"
            step="0.1"
            placeholder={fuelType === "electric" ? "ör. 17.2" : "ör. 6.5"}
            disabled={!fuelType}
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
            className="input-base pr-24"
            style={{
              borderColor:
                isOverMax || isInvalid
                  ? "rgba(248, 113, 113, 0.6)"
                  : isWarning
                  ? "rgba(251, 191, 36, 0.6)"
                  : undefined,
              opacity: !fuelType ? 0.5 : 1,
            }}
          />
          {/* Unit badge */}
          {selectedFuel && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-lg pointer-events-none"
              style={{
                background: `${selectedFuel.color}18`,
                color: selectedFuel.color,
                border: `1px solid ${selectedFuel.color}33`,
              }}
            >
              {selectedFuel.unit}
            </span>
          )}
        </div>

        {/* Validation messages */}
        {!fuelType && (
          <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
            Önce yakıt türünü seçin.
          </p>
        )}
        {isInvalid && (
          <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
            Geçerli bir tüketim değeri girin (0&apos;dan büyük olmalı).
          </p>
        )}
        {isOverMax && fuelType !== "" && (
          <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
            Değer çok yüksek (maks. {MAX_THRESHOLD[fuelType]}{" "}
            {fuelType === "electric" ? "kWh/100km" : "L/100km"}). Lütfen kontrol edin.
          </p>
        )}
        {isWarning && fuelType !== "" && (
          <p className="text-xs mt-1.5" style={{ color: "#fbbf24" }}>
            Yüksek tüketim değeri — gerçek aracınızla örtüştüğünden emin olun.
          </p>
        )}
      </div>

      {/* Active badge — mirrors VehicleSelector's VariantBadge */}
      {isValid && selectedFuel && (
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
              background: `${selectedFuel.color}22`,
              color: selectedFuel.color,
              border: `1px solid ${selectedFuel.color}44`,
            }}
          >
            {selectedFuel.label}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            Tüketim:{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {consumption} {selectedFuel.unit}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}
