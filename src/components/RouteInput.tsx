"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationText: string;
  durationMinutes: number;
}

interface Props {
  peopleCount: string;
  onPeopleCountChange: (v: string) => void;
  onRouteChange: (result: RouteInfo | null) => void;
}

export default function RouteInput({ peopleCount, onPeopleCountChange, onRouteChange }: Props) {
  const [originQuery, setOriginQuery]         = useState("");
  const [destQuery,   setDestQuery]           = useState("");
  const [originSuggs, setOriginSuggs]         = useState<PlacePrediction[]>([]);
  const [destSuggs,   setDestSuggs]           = useState<PlacePrediction[]>([]);
  const [originPlace, setOriginPlace]         = useState<PlacePrediction | null>(null);
  const [destPlace,   setDestPlace]           = useState<PlacePrediction | null>(null);
  const [showOriginDD, setShowOriginDD]       = useState(false);
  const [showDestDD,   setShowDestDD]         = useState(false);
  const [routeResult,  setRouteResult]        = useState<RouteInfo | null>(null);
  const [loadingRoute, setLoadingRoute]       = useState(false);
  const [routeError,   setRouteError]         = useState<string | null>(null);
  const [loadingOrigin, setLoadingOrigin]     = useState(false);
  const [loadingDest,   setLoadingDest]       = useState(false);

  const originBoxRef = useRef<HTMLDivElement>(null);
  const destBoxRef   = useRef<HTMLDivElement>(null);
  const onRouteChangeRef = useRef(onRouteChange);
  const originRequestId = useRef(0);
  const destRequestId = useRef(0);
  onRouteChangeRef.current = onRouteChange;

  // ── Autocomplete: origin ────────────────────────────────────────────────────
  useEffect(() => {
    if (originPlace) return;
    if (originQuery.length < 2) { setOriginSuggs([]); return; }
    setLoadingOrigin(true);
    const currentId = ++originRequestId.current;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(originQuery)}`);
        if (!res.ok) throw new Error("autocomplete failed");
        const data = await res.json();
        if (originRequestId.current !== currentId) return;
        setOriginSuggs(data.predictions ?? []);
        setShowOriginDD(true);
      } catch { /* silent */ }
      finally  {
        if (originRequestId.current === currentId) {
          setLoadingOrigin(false);
        }
      }
    }, 300);
    return () => clearTimeout(t);
  }, [originQuery, originPlace]);

  // ── Autocomplete: destination ───────────────────────────────────────────────
  useEffect(() => {
    if (destPlace) return;
    if (destQuery.length < 2) { setDestSuggs([]); return; }
    setLoadingDest(true);
    const currentId = ++destRequestId.current;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(destQuery)}`);
        if (!res.ok) throw new Error("autocomplete failed");
        const data = await res.json();
        if (destRequestId.current !== currentId) return;
        setDestSuggs(data.predictions ?? []);
        setShowDestDD(true);
      } catch { /* silent */ }
      finally  {
        if (destRequestId.current === currentId) {
          setLoadingDest(false);
        }
      }
    }, 300);
    return () => clearTimeout(t);
  }, [destQuery, destPlace]);

  // ── Route fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!originPlace || !destPlace) {
      setRouteResult(null);
      onRouteChangeRef.current(null);
      return;
    }
    let cancelled = false;
    setLoadingRoute(true);
    setRouteError(null);

    fetch(
      `/api/route?originPlaceId=${encodeURIComponent(originPlace.placeId)}` +
      `&destinationPlaceId=${encodeURIComponent(destPlace.placeId)}`
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data.error ?? "route failed");
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setRouteError("Güzergah hesaplanamadı. Lütfen tekrar deneyin.");
          setRouteResult(null);
          onRouteChangeRef.current(null);
        } else {
          const info: RouteInfo = {
            distanceKm:    data.distanceKm,
            durationText:  data.durationText,
            durationMinutes: data.durationMinutes,
          };
          setRouteResult(info);
          onRouteChangeRef.current(info);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setRouteError("Güzergah bilgisi alınamadı.");
        setRouteResult(null);
        onRouteChangeRef.current(null);
      })
      .finally(() => { if (!cancelled) setLoadingRoute(false); });

    return () => { cancelled = true; };
  }, [originPlace, destPlace]);

  // ── Close dropdowns on outside click ───────────────────────────────────────
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (originBoxRef.current && !originBoxRef.current.contains(e.target as Node))
        setShowOriginDD(false);
      if (destBoxRef.current && !destBoxRef.current.contains(e.target as Node))
        setShowDestDD(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function selectOrigin(p: PlacePrediction) {
    setOriginPlace(p);
    setOriginQuery(p.description);
    setOriginSuggs([]);
    setShowOriginDD(false);
  }

  function selectDest(p: PlacePrediction) {
    setDestPlace(p);
    setDestQuery(p.description);
    setDestSuggs([]);
    setShowDestDD(false);
  }

  function clearOrigin() {
    setOriginPlace(null);
    setOriginQuery("");
    setOriginSuggs([]);
    resetRoute();
  }

  function clearDest() {
    setDestPlace(null);
    setDestQuery("");
    setDestSuggs([]);
    resetRoute();
  }

  function resetRoute() {
    setRouteResult(null);
    setRouteError(null);
    onRouteChangeRef.current(null);
  }

  function swapPlaces() {
    const tmpPlace = originPlace;
    const tmpQuery = originQuery;
    setOriginPlace(destPlace);
    setOriginQuery(destQuery);
    setDestPlace(tmpPlace);
    setDestQuery(tmpQuery);
    resetRoute();
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Origin */}
      <div ref={originBoxRef}>
        <label className="label">Nereden</label>
        <div className="relative">
          <div className="relative">
            <span style={iconStyle("#a855f7")}>
              <PinStartIcon />
            </span>
            <input
              type="text"
              className="input-base"
              style={{ paddingLeft: 38, paddingRight: originPlace ? 36 : 16 }}
              placeholder="Başlangıç noktası ara…"
              value={originQuery}
              onChange={(e) => {
                if (originPlace) clearOrigin();
                setOriginQuery(e.target.value);
              }}
              onFocus={() => { if (originSuggs.length > 0) setShowOriginDD(true); }}
            />
            {loadingOrigin && <SpinnerOverlay />}
            {originPlace && <ClearButton onClick={clearOrigin} />}
          </div>
          {showOriginDD && originSuggs.length > 0 && (
            <SuggestionDropdown predictions={originSuggs} onSelect={selectOrigin} />
          )}
        </div>
      </div>

      {/* Swap */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          title="Değiştir"
          onClick={swapPlaces}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(168,85,247,0.12)",
            border: "1px solid rgba(168,85,247,0.25)",
            color: "#a855f7",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.22)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.12)")}
        >
          <SwapIcon />
        </button>
      </div>

      {/* Destination */}
      <div ref={destBoxRef}>
        <label className="label">Nereye</label>
        <div className="relative">
          <div className="relative">
            <span style={iconStyle("#7c3aed")}>
              <PinEndIcon />
            </span>
            <input
              type="text"
              className="input-base"
              style={{ paddingLeft: 38, paddingRight: destPlace ? 36 : 16 }}
              placeholder="Varış noktası ara…"
              value={destQuery}
              onChange={(e) => {
                if (destPlace) clearDest();
                setDestQuery(e.target.value);
              }}
              onFocus={() => { if (destSuggs.length > 0) setShowDestDD(true); }}
            />
            {loadingDest && <SpinnerOverlay />}
            {destPlace && <ClearButton onClick={clearDest} />}
          </div>
          {showDestDD && destSuggs.length > 0 && (
            <SuggestionDropdown predictions={destSuggs} onSelect={selectDest} />
          )}
        </div>
      </div>

      {/* Route state */}
      {loadingRoute && (
        <div className="flex items-center justify-center gap-2 py-2" style={{ color: "var(--text-secondary)" }}>
          <svg className="route-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="text-sm">Güzergah hesaplanıyor…</span>
        </div>
      )}

      {routeError && !loadingRoute && (
        <p className="text-sm text-center" style={{ color: "#f87171" }}>{routeError}</p>
      )}

      {routeResult && !loadingRoute && (
        <RouteResultBanner result={routeResult} />
      )}

      {/* People count */}
      <div>
        <label className="label">Kişi Sayısı</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const active = peopleCount === String(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPeopleCountChange(String(n))}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  active
                    ? { background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", boxShadow: "0 2px 12px rgba(124,58,237,0.4)", border: "1px solid transparent" }
                    : { background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SuggestionDropdown({
  predictions,
  onSelect,
}: {
  predictions: PlacePrediction[];
  onSelect: (p: PlacePrediction) => void;
}) {
  return (
    <div
      style={{
        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
        background: "#13132b",
        border: "1px solid rgba(168,85,247,0.3)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {predictions.map((p, i) => (
        <button
          key={p.placeId}
          type="button"
          onMouseDown={() => onSelect(p)}
          style={{
            display: "block", width: "100%", padding: "10px 14px",
            textAlign: "left", background: "none", border: "none", cursor: "pointer",
            borderBottom: i < predictions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{p.mainText}</div>
          {p.secondaryText && (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{p.secondaryText}</div>
          )}
        </button>
      ))}
    </div>
  );
}

function RouteResultBanner({ result }: { result: RouteInfo }) {
  return (
    <div
      className="fade-in flex gap-0 rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(168,85,247,0.25)", background: "rgba(124,58,237,0.1)" }}
    >
      {[
        { label: "Mesafe", value: `${result.distanceKm} km` },
        { label: "Süre",   value: result.durationText },
        { label: "Kaynak", value: "Google Maps" },
      ].map(({ label, value }, i, arr) => (
        <div
          key={label}
          className="flex-1 flex flex-col items-center gap-0.5 py-3"
          style={{
            borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
          <span
            className="text-sm font-bold"
            style={{ color: i < 2 ? "#c084fc" : "var(--text-secondary)", fontSize: i === 2 ? "11px" : undefined }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        color: "var(--text-secondary)", display: "flex", alignItems: "center",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function SpinnerOverlay() {
  return (
    <span
      style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        color: "var(--text-secondary)", display: "flex", alignItems: "center",
      }}
    >
      <svg className="route-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    </span>
  );
}

function iconStyle(color: string): CSSProperties {
  return {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    color, display: "flex", alignItems: "center", pointerEvents: "none",
  };
}

function PinStartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2a8 8 0 010 16c-4 0-8-3.58-8-8a8 8 0 018-8z" />
    </svg>
  );
}

function PinEndIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}
