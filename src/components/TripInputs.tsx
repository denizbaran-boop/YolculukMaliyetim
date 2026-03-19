"use client";

import type { TripMode } from "@/types";

interface Props {
  distance: string;
  mode: TripMode;
  durationHours: string;
  durationMinutes: string;
  avgSpeed: string;
  peopleCount: string;
  onDistanceChange: (v: string) => void;
  onModeChange: (m: TripMode) => void;
  onDurationHoursChange: (v: string) => void;
  onDurationMinutesChange: (v: string) => void;
  onAvgSpeedChange: (v: string) => void;
  onPeopleCountChange: (v: string) => void;
}

export default function TripInputs({
  distance,
  mode,
  durationHours,
  durationMinutes,
  avgSpeed,
  peopleCount,
  onDistanceChange,
  onModeChange,
  onDurationHoursChange,
  onDurationMinutesChange,
  onAvgSpeedChange,
  onPeopleCountChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Distance */}
      <div>
        <label className="label">Mesafe</label>
        <div className="relative">
          <input
            type="number"
            className="input-base pr-14"
            placeholder="örn. 350"
            min="1"
            max="10000"
            value={distance}
            onChange={(e) => onDistanceChange(e.target.value)}
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            km
          </span>
        </div>
      </div>

      {/* Mode toggle */}
      <div>
        <label className="label">Hesaplama Modu</label>
        <div className="toggle-pill">
          <button
            className={mode === "duration" ? "active" : ""}
            onClick={() => onModeChange("duration")}
            type="button"
          >
            Süre ile
          </button>
          <button
            className={mode === "speed" ? "active" : ""}
            onClick={() => onModeChange("speed")}
            type="button"
          >
            Hız ile
          </button>
        </div>
      </div>

      {/* Duration or Speed input */}
      {mode === "duration" ? (
        <div className="fade-in">
          <label className="label">Yolculuk Süresi</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                className="input-base pr-16"
                placeholder="0"
                min="0"
                max="240"
                value={durationHours}
                onChange={(e) => onDurationHoursChange(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                saat
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                className="input-base pr-10"
                placeholder="0"
                min="0"
                max="59"
                value={durationMinutes}
                onChange={(e) => onDurationMinutesChange(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                dk
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <label className="label">Ortalama Hız</label>
          <div className="relative">
            <input
              type="number"
              className="input-base pr-18"
              placeholder="örn. 90"
              min="1"
              max="250"
              value={avgSpeed}
              onChange={(e) => onAvgSpeedChange(e.target.value)}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              km/h
            </span>
          </div>
        </div>
      )}

      {/* People count */}
      <div>
        <label className="label">Kişi Sayısı</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPeopleCountChange(String(n))}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                peopleCount === String(n)
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      color: "white",
                      boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
                      border: "1px solid transparent",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-secondary)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
