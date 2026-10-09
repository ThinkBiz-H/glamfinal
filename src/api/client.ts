import axios from "axios";

// Both prefixes are real and are both hit by OLD's shipped, working code:
//   pcapi/ -> OTP auth, cart, booking creation, booking history
//   tcapi/ -> home feed, address, profile, timeslot, payment gateway, wallet, referral
// (verified in OLD/webapp/src/services/*.js — see types/api.ts header for detail).
const BASE_URL = import.meta.env.VITE_API_URL || "https://theglamride.com/gram_ride/";

export const pcapi = axios.create({
  baseURL: BASE_URL + "pcapi/",
  timeout: 20000,
});

export const tcapi = axios.create({
  baseURL: BASE_URL + "tcapi/",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

const IMAGE_BASE_URL = "https://theglamride.com/gram_ride//";

/** Prepend the image host OLD used, unless the value is already absolute. */
export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  return IMAGE_BASE_URL + path.replace(/^\/+/, "");
}

/**
 * The backend's "did this succeed" field is inconsistently cased across
 * endpoints, and OLD's own source checks different subsets of these in
 * different files (e.g. Register.jsx checks Result and result; Payment.jsx
 * checks a bare truthy `result`; Refer/Wallet check Result, result===true,
 * AND ResponseCode==="200"). This checks the full union of every variant
 * actually seen in OLD, so behavior never regresses versus production for
 * any one endpoint.
 */
export function isSuccess(raw: Record<string, unknown> | null | undefined): boolean {
  if (!raw) return false;
  return (
    raw.Result === "true" ||
    raw.result === "true" ||
    raw.result === true ||
    raw.ResponseCode === "200" ||
    raw.success === true
  );
}

/** Same dual-casing story for the human-readable message field. */
export function pickMessage(raw: Record<string, unknown> | null | undefined): string {
  if (!raw) return "";
  return (
    (raw.ResponseMsg as string) || (raw.responseMsg as string) || (raw.message as string) || ""
  );
}

/** Resolve a usable user id from the raw user record the backend returns — OLD reads `id`, falling back to `uid`, falling back to `UserLogin.id` depending on the page. */
export function resolveUserId(
  user: { id?: string; uid?: string; UserLogin?: { id?: string } } | null | undefined,
): string {
  return String(user?.id ?? user?.uid ?? user?.UserLogin?.id ?? "");
}

/** Extract a friendly error message from a thrown Axios/network error. */
export function apiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    return pickMessage(data) || err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
