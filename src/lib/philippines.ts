/**
 * Philippines location data — sourced live from the PSGC API
 * (https://psgc.gitlab.io/api/). Cities/municipalities and barangays
 * are fetched on demand and cached in memory for the session.
 */
const PSGC_BASE = 'https://psgc.gitlab.io/api';

export interface PsgcCity {
  /** PSGC code, used to look up barangays. */
  code: string;
  /** Bare municipality / city name (e.g. "Manila"). */
  name: string;
  /** Province name when available (e.g. "Metro Manila"). */
  provinceName: string;
  /** Display label used by the UI dropdown — e.g. "Manila, Metro Manila". */
  label: string;
}

let citiesPromise: Promise<PsgcCity[]> | null = null;
const barangayCache = new Map<string, Promise<string[]>>();

/** Fetch and cache the full list of PH cities/municipalities (~1,600). */
export function fetchPhCities(): Promise<PsgcCity[]> {
  if (citiesPromise) return citiesPromise;
  citiesPromise = (async () => {
    const [provincesRes, citiesRes] = await Promise.all([
      fetch(`${PSGC_BASE}/provinces/`),
      fetch(`${PSGC_BASE}/cities-municipalities/`),
    ]);
    if (!provincesRes.ok || !citiesRes.ok) {
      throw new Error('Failed to load Philippine location data.');
    }
    const provinces: Array<{ code: string; name: string }> = await provincesRes.json();
    const cities: Array<{ code: string; name: string; provinceCode: string | false }> =
      await citiesRes.json();
    const provMap = new Map(provinces.map((p) => [p.code, p.name]));
    // NCR cities lack a province; tag them with "Metro Manila" for clarity.
    const list: PsgcCity[] = cities.map((c) => {
      const provinceName = c.provinceCode ? provMap.get(c.provinceCode) ?? '' : 'Metro Manila';
      return {
        code: c.code,
        name: c.name,
        provinceName,
        label: provinceName ? `${c.name}, ${provinceName}` : c.name,
      };
    });
    list.sort((a, b) => a.label.localeCompare(b.label));
    return list;
  })();
  return citiesPromise;
}

/** Fetch and cache the barangays for a given city/municipality code. */
export function fetchPhBarangays(cityCode: string): Promise<string[]> {
  const cached = barangayCache.get(cityCode);
  if (cached) return cached;
  const p = (async () => {
    const res = await fetch(`${PSGC_BASE}/cities-municipalities/${cityCode}/barangays/`);
    if (!res.ok) throw new Error('Failed to load barangays.');
    const data: Array<{ name: string }> = await res.json();
    const names = data.map((b) => b.name).sort((a, b) => a.localeCompare(b));
    return names;
  })();
  barangayCache.set(cityCode, p);
  return p;
}
