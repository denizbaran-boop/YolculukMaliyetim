"use client";

import { useState, useMemo } from "react";
import type { VehicleVariant, TripMode, CalculationResult } from "@/types";
import { calculate } from "@/lib/calculator";
import { useLocation } from "@/hooks/useLocation";
import VehicleSelector from "@/components/VehicleSelector";
import ManualConsumptionInput from "@/components/ManualConsumptionInput";
import TripInputs from "@/components/TripInputs";
import ResultCard from "@/components/ResultCard";
import FuelPriceBadge from "@/components/FuelPriceBadge";

type VehicleInputMode = "select" | "manual";

export default function HomePage() {
  // Vehicle input mode toggle
  const [vehicleInputMode, setVehicleInputMode] = useState<VehicleInputMode>("select");

  // Variant from VehicleSelector (mode: select)
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);

  // Variant from ManualConsumptionInput (mode: manual)
  const [manualVariant, setManualVariant] = useState<VehicleVariant | null>(null);

  // Active variant — depends on mode
  const variant = vehicleInputMode === "select" ? selectedVariant : manualVariant;

  // Trip
  const [distance, setDistance] = useState("");
  const [mode, setMode] = useState<TripMode>("speed");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [avgSpeed, setAvgSpeed] = useState("90");
  const [peopleCount, setPeopleCount] = useState("1");

  // Location + fuel
  const { fuelPrices, loading, error, retry } = useLocation();

  // Effective trip mode — manual vehicle input uses "manual" to skip speed adjustment
  const effectiveMode = vehicleInputMode === "manual" ? "manual" : mode;

  // Reactive calculation
  const result = useMemo<CalculationResult | null>(() => {
    if (!variant || !fuelPrices) return null;
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) return null;

    if (effectiveMode === "manual") {
      return calculate(
        variant,
        { distance: dist, mode: "manual", peopleCount: parseInt(peopleCount) || 1 },
        fuelPrices
      );
    }

    const totalMinutes =
      effectiveMode === "duration"
        ? (parseFloat(durationHours) || 0) * 60 + (parseFloat(durationMinutes) || 0)
        : undefined;

    const speed =
      effectiveMode === "speed" ? parseFloat(avgSpeed) || undefined : undefined;

    if (effectiveMode === "duration" && (!totalMinutes || totalMinutes <= 0)) return null;
    if (effectiveMode === "speed" && (!speed || speed <= 0)) return null;

    return calculate(
      variant,
      {
        distance: dist,
        mode: effectiveMode,
        duration: totalMinutes,
        avgSpeed: speed,
        peopleCount: parseInt(peopleCount) || 1,
      },
      fuelPrices
    );
  }, [variant, fuelPrices, distance, effectiveMode, durationHours, durationMinutes, avgSpeed, peopleCount]);

  // Switch modes — reset the variant for the inactive mode
  const handleModeSwitch = (next: VehicleInputMode) => {
    setVehicleInputMode(next);
    if (next === "select") setManualVariant(null);
    else setSelectedVariant(null);
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background gradient blobs */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: "30vw",
            height: "30vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative mx-auto px-4 py-8 md:py-14"
        style={{ maxWidth: 720, zIndex: 1 }}
      >
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="16" r="1" />
              </svg>
            </div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              yolculukmaliyetim.com
            </h1>
          </div>

          <h2
            className="font-extrabold leading-tight mb-2"
            style={{
              fontSize: "clamp(1.7rem, 5vw, 2.6rem)",
              background: "linear-gradient(135deg, #f1f0ff 0%, #c084fc 60%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Yolculuk Maliyet Hesaplayıcı
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Araç, güzergah ve güncel yakıt fiyatlarıyla gerçekçi maliyet tahmini
          </p>
        </header>

        {/* Fuel price badge */}
        <div className="glass-card px-5 py-4 mb-5">
          <FuelPriceBadge
            prices={fuelPrices}
            loading={loading}
            error={error}
            onRetry={retry}
          />
        </div>

        {/* Main calculator card */}
        <div className="glass-card p-6 md:p-8 mb-5">
          {/* Section: Vehicle */}
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 6v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              }
              title="Araç Seçimi"
            />
            {/* Mode toggle */}
            <VehicleInputModeToggle
              value={vehicleInputMode}
              onChange={handleModeSwitch}
            />
          </div>

          {vehicleInputMode === "select" ? (
            <VehicleSelector onVariantChange={setSelectedVariant} />
          ) : (
            <ManualConsumptionInput onVariantChange={setManualVariant} />
          )}

          <hr className="divider" />

          {/* Section: Trip */}
          <SectionHeader
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            }
            title="Yolculuk Bilgileri"
          />
          <TripInputs
            distance={distance}
            mode={effectiveMode}
            durationHours={durationHours}
            durationMinutes={durationMinutes}
            avgSpeed={avgSpeed}
            peopleCount={peopleCount}
            simplified={vehicleInputMode === "manual"}
            onDistanceChange={setDistance}
            onModeChange={setMode}
            onDurationHoursChange={setDurationHours}
            onDurationMinutesChange={setDurationMinutes}
            onAvgSpeedChange={setAvgSpeed}
            onPeopleCountChange={setPeopleCount}
          />
        </div>

        {/* Result card */}
        <ResultCard
          result={result}
          variant={variant}
          peopleCount={parseInt(peopleCount) || 1}
        />

        {/* SEO content section */}
        <section
          className="glass-card px-6 py-8 mt-5"
          style={{ color: "var(--text-secondary)" }}
        >
          <h1
            className="text-lg font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Yolculuk Maliyeti Nasıl Hesaplanır?
          </h1>
          <p className="text-sm leading-relaxed mb-3">
            <strong style={{ color: "var(--text-primary)" }}>Yolculuk maliyeti hesaplama</strong>,
            aracın yakıt tüketimi, gidilecek mesafe ve güncel yakıt fiyatlarının bir araya
            getirilmesiyle yapılır. Hesaplayıcımız, seçtiğiniz araç modelinin fabrika tüketim
            değerlerini ve konumunuza göre belirlenen akaryakıt fiyatlarını kullanarak size
            gerçekçi bir maliyet tahmini sunar.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            <strong style={{ color: "var(--text-primary)" }}>Yakıt maliyeti hesaplama</strong>{" "}
            için temel formül şudur: toplam mesafeyi 100&apos;e bölün, aracın 100 km tüketimiyle
            çarpın ve yakıt birim fiyatını uygulayın. Örneğin 300 km&apos;lik bir yolculukta,
            100 km&apos;de 7 litre benzin tüketen bir araçla ve 45 ₺/litre fiyatıyla toplam
            yakıt gideri yaklaşık 945 ₺ olur. Birden fazla kişiyle seyahat edildiğinde bu tutar
            kişi başına bölünebilir.
          </p>
          <p className="text-sm leading-relaxed">
            <strong style={{ color: "var(--text-primary)" }}>Km başına maliyet</strong>, uzun
            yolculukları karşılaştırmanın en pratik yoludur. Otoyol gibi yüksek hızlı
            güzergahlarda tüketim artabileceğinden, hesaplayıcı ortalama hız veya süre
            bilgisini de dikkate alarak daha isabetli sonuçlar üretir. Bu sayede şehirlerarası
            her yolculuktan önce bütçenizi kolayca planlayabilirsiniz.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs" style={{ color: "var(--text-secondary)" }}>
          Hesaplamalar tahminidir. Gerçek tüketim sürüş koşullarına göre değişebilir.
        </footer>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center justify-center w-7 h-7 rounded-lg"
        style={{
          background: "rgba(168,85,247,0.15)",
          color: "#a855f7",
        }}
      >
        {icon}
      </span>
      <h3
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-secondary)" }}
      >
        {title}
      </h3>
    </div>
  );
}

function VehicleInputModeToggle({
  value,
  onChange,
}: {
  value: VehicleInputMode;
  onChange: (v: VehicleInputMode) => void;
}) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {(
        [
          { key: "select", label: "Araçtan Seç" },
          { key: "manual", label: "Tüketim Gir" },
        ] as { key: VehicleInputMode; label: string }[]
      ).map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              background: active
                ? "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.4))"
                : "transparent",
              color: active ? "#e9d5ff" : "var(--text-secondary)",
              boxShadow: active ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
