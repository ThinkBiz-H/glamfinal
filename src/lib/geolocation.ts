/**
 * s_address_user.php rejects the entire request with a generic error if
 * `lat_map` or `long_map` is an empty string — both are required, even
 * though there's no map picker in this UI. Rather than send a fake
 * coordinate, this asks the browser for the user's real current position
 * in the background (no visible UI) and falls back to "0"/"0" only if
 * permission is denied, unavailable, or it times out — which still
 * satisfies the backend's non-empty check.
 */
export function getBestEffortCoords(timeoutMs = 4000): Promise<{ lat: string; lng: string }> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ lat: "0", lng: "0" });
      return;
    }
    const timer = setTimeout(() => resolve({ lat: "0", lng: "0" }), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({ lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) });
      },
      () => {
        clearTimeout(timer);
        resolve({ lat: "0", lng: "0" });
      },
      { timeout: timeoutMs, maximumAge: 5 * 60 * 1000 },
    );
  });
}

export class GeolocationDeniedError extends Error {}
export class GeolocationUnavailableError extends Error {}

/**
 * Explicit, user-initiated "use my current location" request — unlike
 * getBestEffortCoords() above, this surfaces a real error to the caller
 * instead of silently falling back, so the UI can tell the person their
 * permission was denied rather than pretending it worked.
 */
export function requestCurrentPosition(timeoutMs = 10000): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new GeolocationUnavailableError("Location isn't available in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new GeolocationDeniedError("Location permission was denied."));
        } else {
          reject(new GeolocationUnavailableError("Couldn't determine your location."));
        }
      },
      { timeout: timeoutMs, maximumAge: 60 * 1000, enableHighAccuracy: true },
    );
  });
}

/** Individual address components, "" when Nominatim doesn't provide one. */
export interface AddressParts {
  road: string;
  suburb: string;
  locality: string;
  city: string;
  district: string;
  state: string;
}

export interface ReverseGeocodeResult {
  address: string;
  city: string;
  pincode: string;
  parts: AddressParts;
}

/**
 * Reverse-geocodes real GPS coordinates into a human-readable address via
 * OpenStreetMap's free Nominatim API (no key required) — the same service
 * OLD's frontend used for this. Returns null on any failure so callers can
 * fall back to manual entry rather than show a broken/partial address.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      display_name?: string;
      address?: {
        road?: string;
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
        neighbourhood?: string;
        quarter?: string;
        locality?: string;
        city_district?: string;
        state_district?: string;
        county?: string;
        state?: string;
        postcode?: string;
      };
    };
    const addr = data.address ?? {};
    const city = addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? "";
    const parts: AddressParts = {
      road: addr.road ?? "",
      suburb: addr.suburb ?? "",
      locality: addr.neighbourhood ?? addr.quarter ?? addr.locality ?? addr.city_district ?? "",
      city: addr.city ?? addr.town ?? addr.village ?? "",
      district: addr.state_district ?? addr.county ?? "",
      state: addr.state ?? "",
    };
    return { address: data.display_name ?? "", city, pincode: addr.postcode ?? "", parts };
  } catch {
    return null;
  }
}
