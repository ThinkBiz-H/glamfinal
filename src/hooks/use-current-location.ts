import { useEffect, useState } from "react";
import {
  GeolocationDeniedError,
  requestCurrentPosition,
  reverseGeocode,
  type AddressParts,
} from "@/lib/geolocation";

const CACHE_KEY = "glamride:current-location:v2";
const LEGACY_CACHE_KEY = "glamride:current-location";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type LocationError = "permission-denied" | "unavailable" | "geocode-failed";

export type CurrentLocation = {
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: LocationError | null;
};

type Resolved = Omit<CurrentLocation, "loading">;
type CachedLocation = Omit<Resolved, "error"> & { savedAt: number };

const EMPTY: Resolved = {
  address: null,
  city: null,
  state: null,
  latitude: null,
  longitude: null,
  error: null,
};

function readCache(): Resolved | null {
  if (typeof window === "undefined") return null;
  try {
    localStorage.removeItem(LEGACY_CACHE_KEY);
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, ...location } = JSON.parse(raw) as CachedLocation;
    if (typeof savedAt !== "number" || Date.now() - savedAt > CACHE_TTL_MS || !location.address) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return { ...location, error: null };
  } catch {
    return null;
  }
}

function writeCache(location: Omit<Resolved, "error">) {
  try {
    const entry: CachedLocation = { ...location, savedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage blocked (private mode, quota) — the location still works for this session.
  }
}

/** Road → Suburb → Locality → City → District → State, skipping blanks and repeats. */
function formatAddress(parts: AddressParts): string | null {
  const ordered = [
    parts.road,
    parts.suburb,
    parts.locality,
    parts.city,
    parts.district,
    parts.state,
  ];
  const seen = new Set<string>();
  const unique = ordered.filter((p) => {
    const key = p.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.length ? unique.join(", ") : null;
}

// Navbar and hero both mount this hook; share one in-flight request so a
// first visit triggers a single permission prompt and a single Nominatim call.
let inflight: Promise<Resolved> | null = null;

function resolveLocation(): Promise<Resolved> {
  inflight ??= (async (): Promise<Resolved> => {
    try {
      const { lat, lng } = await requestCurrentPosition();
      const place = await reverseGeocode(lat, lng);
      const address = place ? formatAddress(place.parts) : null;
      const location = {
        address,
        city: place?.parts.city || null,
        state: place?.parts.state || null,
        latitude: lat,
        longitude: lng,
      };
      // Only cache a fully resolved address; a failed lookup is retried next load.
      if (address) writeCache(location);
      return { ...location, error: address ? null : "geocode-failed" };
    } catch (err) {
      return {
        ...EMPTY,
        error: err instanceof GeolocationDeniedError ? "permission-denied" : "unavailable",
      };
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/**
 * The visitor's current address via browser geolocation + Nominatim reverse
 * geocoding. A resolved address is cached in localStorage for 24 hours and
 * served from there without re-prompting. Denials are not cached: the live
 * permission state is read instead, so re-enabling location in the browser
 * takes effect immediately.
 */
export function useCurrentLocation(): CurrentLocation {
  const [location, setLocation] = useState<CurrentLocation>(() => {
    const cached = readCache();
    return cached ? { ...cached, loading: false } : { ...EMPTY, loading: true };
  });

  useEffect(() => {
    if (readCache()) return;

    let cancelled = false;
    let permission: PermissionStatus | null = null;

    const detect = () => {
      const cached = readCache();
      if (cached) {
        setLocation({ ...cached, loading: false });
        return;
      }
      setLocation((prev) => ({ ...prev, loading: true }));
      void resolveLocation().then((resolved) => {
        if (!cancelled) setLocation({ ...resolved, loading: false });
      });
    };

    const markDenied = () => setLocation({ ...EMPTY, loading: false, error: "permission-denied" });

    const onPermissionChange = () => {
      if (permission?.state === "denied") markDenied();
      else if (permission?.state === "granted") detect();
    };

    (async () => {
      try {
        permission = (await navigator.permissions?.query({ name: "geolocation" })) ?? null;
      } catch {
        permission = null; // Permissions API unsupported — just ask directly.
      }
      if (cancelled) return;
      permission?.addEventListener("change", onPermissionChange);
      if (permission?.state === "denied") markDenied();
      else detect();
    })();

    return () => {
      cancelled = true;
      permission?.removeEventListener("change", onPermissionChange);
    };
  }, []);

  return location;
}

/**
 * Display text for a location chip. `fallback` is shown only when location
 * couldn't be determined at all; once permission is granted the label is
 * always an address (or, if the lookup failed, the coordinates).
 */
export function getLocationLabel(location: CurrentLocation, fallback: string): string {
  if (location.loading) return "Detecting your location...";
  if (location.address) return location.address;
  if (location.error === "permission-denied") return "Enable location";
  if (location.latitude !== null && location.longitude !== null) {
    return `Near ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }
  return fallback;
}
