/**
 * fetchFuelPrices.ts
 *
 * Fetches live fuel prices from Opet's public fuel-prices page
 * (https://www.opet.com.tr/akaryakit-fiyatlari).
 *
 * Why Opet?
 *  - Explicitly mentioned as a preferred source by project requirements
 *  - Turkey's second-largest fuel retailer; prices are publicly listed for customers
 *  - The page is server-rendered (SSR) for SEO — prices are in initial HTML
 *  - EPDK publishes PDF/complex tables; Opet is far easier to parse reliably
 *
 * Caching: module-level in-memory cache with 15-minute TTL.
 * In serverless environments each cold-start begins with an empty cache
 * (cache miss → fetch → fill); warm invocations reuse the cached entry.
 *
 * Fallback chain:
 *  1. Fresh live data  (isFallback: false)
 *  2. Stale but valid last-known data  (isFallback: false, note stale)
 *  3. null  →  caller must use static reference prices  (isFallback: true)
 */

const SOURCE_URL   = "https://www.opet.com.tr/akaryakit-fiyatlari";
const SOURCE_LABEL = "Opet İstanbul Avrupa";
const CACHE_TTL_MS = 15 * 60 * 1_000; // 15 minutes

// ── Types ────────────────────────────────────────────────────────────────────

export interface LiveFuelData {
  gasoline:  number;
  diesel:    number;
  lpg:       number;
  electric:  number | null;
  source:    string;
  fetchedAt: string; // ISO timestamp of the actual fetch
}

interface CacheEntry {
  data:     LiveFuelData;
  cachedAt: number; // Date.now() when stored
}

// ── Module-level cache ────────────────────────────────────────────────────────

let _cache:     CacheEntry | null = null; // current entry (may be stale)
let _lastValid: LiveFuelData | null = null; // last successful fetch — survives TTL expiry

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns live fuel prices, cached for up to 15 minutes.
 *
 * Returns `null` only when the source has never been reached AND no
 * in-process last-valid data exists. In that case the caller should
 * fall back to static reference prices.
 */
export async function fetchFuelPrices(): Promise<LiveFuelData | null> {
  const now = Date.now();

  // Cache hit
  if (_cache && now - _cache.cachedAt < CACHE_TTL_MS) {
    const ageMin = ((now - _cache.cachedAt) / 60_000).toFixed(1);
    console.log(`[fetchFuelPrices] Cache hit — age ${ageMin} min, source: ${SOURCE_URL}`);
    return _cache.data;
  }

  console.log("[fetchFuelPrices] Cache miss — fetching from", SOURCE_URL);

  try {
    const res = await fetch(SOURCE_URL, {
      // Bypass Next.js fetch cache — we own the cache here
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8",
        Referer:         "https://www.opet.com.tr/",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const html = await res.text();

    // Short preview for debugging
    console.log(
      "[fetchFuelPrices] Raw HTML preview (first 1000 chars):\n",
      html.slice(0, 1_000)
    );

    const parsed = parseFuelPrices(html);

    if (!parsed) {
      throw new Error("Could not parse fuel prices from Opet HTML");
    }

    console.log("[fetchFuelPrices] Parsed prices:", parsed);

    const data: LiveFuelData = {
      gasoline:  parsed.gasoline,
      diesel:    parsed.diesel,
      lpg:       parsed.lpg,
      electric:  parsed.electric,
      source:    SOURCE_LABEL,
      fetchedAt: new Date().toISOString(),
    };

    _cache     = { data, cachedAt: now };
    _lastValid = data;

    return data;
  } catch (err) {
    console.error("[fetchFuelPrices] Fetch/parse error:", err);

    if (_lastValid) {
      console.log(
        "[fetchFuelPrices] Returning last valid data from",
        _lastValid.fetchedAt
      );
      return _lastValid;
    }

    return null;
  }
}

// ── HTML parsing ─────────────────────────────────────────────────────────────

interface RawPrices {
  gasoline: number;
  diesel:   number;
  lpg:      number;
  electric: number | null;
}

/**
 * Extracts fuel prices from Opet's HTML page.
 *
 * Strategy:
 *  1. First try JSON embedded in a <script> tag (fastest, most reliable).
 *  2. Fall back to keyword-proximity scanning in plain HTML text.
 *
 * Matching is name-based (NOT index-based) so layout changes don't silently
 * return wrong fuel types.
 *
 * Turkish decimal format: "62,02" or "62.02" — both are normalised.
 */
function parseFuelPrices(html: string): RawPrices | null {
  // ── Strategy 1: JSON in script tags ─────────────────────────────────────
  const jsonResult = tryParseFromJson(html);
  if (jsonResult) {
    console.log("[parseFuelPrices] Parsed via JSON strategy");
    return jsonResult;
  }

  // ── Strategy 2: Keyword proximity scan ─────────────────────────────────
  const htmlResult = tryParseFromHtml(html);
  if (htmlResult) {
    console.log("[parseFuelPrices] Parsed via HTML keyword strategy");
    return htmlResult;
  }

  console.warn("[parseFuelPrices] All parsing strategies failed");
  return null;
}

// ── Strategy 1: JSON ─────────────────────────────────────────────────────────

function tryParseFromJson(html: string): RawPrices | null {
  // Look for JSON arrays/objects inside <script> tags that contain price data
  const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);

  for (const m of scriptMatches) {
    const body = m[1];
    if (!body || body.length < 20) continue;

    // Look for JSON that mentions Turkish fuel keywords
    if (
      !body.includes("Motorin") &&
      !body.includes("Benzin") &&
      !body.includes("motorin") &&
      !body.includes("benzin")
    ) continue;

    try {
      // Try to find a JSON array or object with price fields
      const arrayMatch = body.match(/\[[\s\S]*?\]/);
      if (arrayMatch) {
        const arr = JSON.parse(arrayMatch[0]) as unknown[];
        const result = extractPricesFromJsonArray(arr);
        if (result) return result;
      }

      const objMatch = body.match(/\{[\s\S]*?\}/);
      if (objMatch) {
        const obj = JSON.parse(objMatch[0]) as Record<string, unknown>;
        const result = extractPricesFromJsonObject(obj);
        if (result) return result;
      }
    } catch {
      // not valid JSON — continue
    }
  }

  return null;
}

function extractPricesFromJsonArray(arr: unknown[]): RawPrices | null {
  let gasoline: number | null = null;
  let diesel:   number | null = null;
  let lpg:      number | null = null;
  let electric: number | null = null;

  for (const item of arr) {
    if (typeof item !== "object" || item === null) continue;
    const obj = item as Record<string, unknown>;

    const name  = String(obj.name ?? obj.ad ?? obj.urun ?? obj.fuelType ?? obj.type ?? "");
    const price = toNumber(obj.price ?? obj.fiyat ?? obj.deger ?? obj.value);

    if (price === null) continue;

    if (matchesGasoline(name)) gasoline = price;
    else if (matchesDiesel(name))   diesel   = price;
    else if (matchesLpg(name))      lpg      = price;
    else if (matchesElectric(name)) electric = price;
  }

  if (gasoline === null || diesel === null || lpg === null) return null;
  return { gasoline, diesel, lpg, electric };
}

function extractPricesFromJsonObject(obj: Record<string, unknown>): RawPrices | null {
  // Handle flat objects with explicit key names
  const gasoline = toNumber(
    obj.benzin ?? obj.gasoline ?? obj.super95 ?? obj["Benzin 95"] ?? obj["Süper 95"]
  );
  const diesel = toNumber(
    obj.motorin ?? obj.diesel ?? obj["Euro Dizel"] ?? obj["Motorin"]
  );
  const lpg = toNumber(
    obj.otogaz ?? obj.lpg ?? obj["Otogaz"] ?? obj["Otogaz LPG"]
  );
  const electric = toNumber(obj.elektrik ?? obj.electric ?? obj["Elektrik"]);

  if (gasoline === null || diesel === null || lpg === null) return null;
  return { gasoline, diesel, lpg, electric };
}

// ── Strategy 2: HTML keyword proximity ───────────────────────────────────────

function tryParseFromHtml(html: string): RawPrices | null {
  // Decode HTML entities so we don't miss names like "S&uuml;per"
  const decoded = decodeHtmlEntities(html);

  const gasoline = findPriceNearKeywords(decoded, [
    "Süper 95", "Super 95", "Benzin 95", "Kurşunsuz 95",
    "Kursunsuz 95", "95 Oktan", "95 oktan",
  ]);

  const diesel = findPriceNearKeywords(decoded, [
    "Euro Dizel", "Euro Motorin", "Motorin", "Dizel",
  ]);

  const lpg = findPriceNearKeywords(decoded, [
    "Otogaz LPG", "Otogaz", "LPG",
  ]);

  const electric = findPriceNearKeywords(decoded, [
    "Elektrik", "Şarj", "kWh",
  ]);

  console.log("[tryParseFromHtml] Raw:", { gasoline, diesel, lpg, electric });

  if (gasoline === null || diesel === null || lpg === null) return null;
  return { gasoline, diesel, lpg, electric };
}

/**
 * Finds the first occurrence of any keyword in the HTML text and extracts
 * the nearest decimal-looking number within 300 characters of it.
 *
 * Numbers must be in a plausible price range (filtered by `isPlausiblePrice`).
 */
function findPriceNearKeywords(text: string, keywords: string[]): number | null {
  for (const kw of keywords) {
    let searchFrom = 0;

    while (true) {
      const idx = text.indexOf(kw, searchFrom);
      if (idx === -1) break;

      // Scan a window around the keyword — both before and after
      const windowStart = Math.max(0, idx - 100);
      const windowEnd   = Math.min(text.length, idx + kw.length + 300);
      const slice       = text.slice(windowStart, windowEnd);

      // Match Turkish/European decimal numbers: "62,02" or "62.02" or "32,10"
      // Must start with 2-3 digits followed by optional comma/dot + 2 digits
      const priceRegex = /\b(\d{2,3}[,.]?\d{0,2})\b/g;
      let match: RegExpExecArray | null;

      while ((match = priceRegex.exec(slice)) !== null) {
        const raw   = match[1].replace(",", ".");
        const value = parseFloat(raw);
        if (!isNaN(value) && isPlausiblePrice(value)) {
          return value;
        }
      }

      searchFrom = idx + 1;
    }
  }

  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Minimal HTML entity decoder (covers the most common cases in Turkish pages) */
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&uuml;/g,  "ü").replace(/&Uuml;/g,  "Ü")
    .replace(/&ouml;/g,  "ö").replace(/&Ouml;/g,  "Ö")
    .replace(/&ccedil;/g,"ç").replace(/&Ccedil;/g,"Ç")
    .replace(/&scedil;/g,"ş").replace(/&Scedil;/g,"Ş")
    .replace(/&iuml;/g,  "ı").replace(/&Iuml;/g,  "İ")
    .replace(/&gbreve;/g,"ğ").replace(/&Gbreve;/g,"Ğ")
    .replace(/&amp;/g,   "&")
    .replace(/&lt;/g,    "<")
    .replace(/&gt;/g,    ">")
    .replace(/&nbsp;/g,  " ");
}

/** Converts an unknown value to a number or null */
function toNumber(val: unknown): number | null {
  if (typeof val === "number") return isNaN(val) ? null : val;
  if (typeof val === "string") {
    const n = parseFloat(val.replace(",", "."));
    return isNaN(n) ? null : n;
  }
  return null;
}

/**
 * Rejects numbers that can't plausibly be a Turkish fuel price.
 * Anchored to known 2026 ranges; adjust if prices drift far outside them.
 */
function isPlausiblePrice(value: number): boolean {
  // Gasoline/Diesel: 45–150 TL/L
  // LPG: 20–80 TL/L
  // Electric: 5–30 TL/kWh
  // Combined gate: anything 20–150
  return value >= 20 && value <= 150;
}

/** Fuel-name matchers (case-insensitive, trimmed) */
function matchesGasoline(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("süper") || n.includes("super") ||
         n.includes("benzin") || n.includes("kurşunsuz") || n.includes("kursunsuz");
}
function matchesDiesel(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("motorin") || n.includes("dizel") || n.includes("diesel");
}
function matchesLpg(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("otogaz") || n.includes("lpg");
}
function matchesElectric(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("elektrik") || n.includes("electric") || n.includes("kwh");
}
