// ---------------------------------------------------------------------------
// UI-facing shapes, mapped from the real backend row shapes (src/types/api.ts)
// so components never touch backend field-naming quirks directly.
//
// Only mappers for verified data are kept here. Experts/partners, add-ons,
// testimonials and coupons from the previous redesign attempt are removed:
// none of them have a corresponding endpoint in OLD's shipped, working code.
// ---------------------------------------------------------------------------
import { resolveImageUrl } from "@/api/client";
import type { CategoryRow, ServiceRow, SubcatSectionItem } from "@/types/api";

export type UiCategory = {
  id: string; // cat_id — route param for /services/$category
  name: string;
  icon: string;
  accent: string;
};

export type UiTile = {
  id: string;
  catId: string;
  subcatId: string;
  title: string;
  image: string;
};

export type UiPackage = {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  strikePrice?: number;
  discountPercent: number;
  qty: string;
  ttken?: string;
  subcatId: string;
  catId: string;
};

const ICONS = [
  "Sparkles",
  "Scissors",
  "Flower2",
  "Brush",
  "Hand",
  "Droplets",
  "Feather",
  "Footprints",
  "Crown",
  "Sun",
  "Waves",
  "Gift",
];
// Tile tints are theme tokens defined in styles.css.
const ACCENTS = ["var(--tint-primary)", "var(--tint-highlight)", "var(--tint-blend)"];

function hashIndex(id: string, mod: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % mod;
}

/** Maps a raw home-data Catlist row (verified field: cat_id, cat_name only). */
export function toUiCategory(raw: CategoryRow): UiCategory {
  const id = String(raw.cat_id);
  return {
    id,
    name: raw.cat_name,
    icon: ICONS[hashIndex(id, ICONS.length)] ?? "Sparkles",
    accent: ACCENTS[hashIndex(id, ACCENTS.length)] ?? "var(--tint-primary)",
  };
}

/** Maps a raw Subcat_section item into a browsable tile (matches OLD's SubCategorySection.jsx). */
export function toUiTile(raw: SubcatSectionItem): UiTile {
  return {
    id: String(raw.subcat_id),
    catId: String(raw.cat_id),
    subcatId: String(raw.subcat_id),
    title: raw.title,
    image: resolveImageUrl(raw.img),
  };
}

/** Maps a raw get_service_by_name.php row into UI shape (matches OLD's PackageDetails.jsx / PackageDetail.jsx pricing logic exactly: finalPrice = price - price*discount/100). */
export function toUiPackage(raw: ServiceRow, subcatId: string, catId: string): UiPackage {
  const price = Number(raw.price) || 0;
  const discountPercent = Number(raw.discount) || 0;
  const finalPrice =
    discountPercent > 0 ? Math.round(price - (price * discountPercent) / 100) : Math.round(price);
  return {
    id: String(raw.id),
    name: raw.title,
    description: raw.sdesc,
    image: resolveImageUrl(raw.img),
    price: finalPrice,
    strikePrice: discountPercent > 0 ? Math.round(price) : undefined,
    discountPercent,
    qty: String(raw.mqty ?? ""),
    ttken: raw.ttken,
    subcatId,
    catId: String(raw.mid ?? catId),
  };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Generic, policy-neutral copy only — no invented cancellation/reschedule
// policy, membership program or coupon system, since none of those exist
// on the verified backend. Safe as static marketing content because it
// makes no claim about a specific feature or contract.
export const faqs = [
  {
    q: "How do I book a service?",
    a: "Browse a category, pick a package, then choose your address, date and time slot at checkout — most bookings take under a minute.",
  },
  {
    q: "What payment methods are supported?",
    a: "You can pay online via our secure payment partner, or choose Cash on Delivery at checkout.",
  },
  {
    q: "How do I verify my account?",
    a: "Sign in with your mobile number — we send a one-time code (OTP) to verify it, no password needed.",
  },
  {
    q: "Where can I see my bookings?",
    a: "Every confirmed booking, along with its service OTP and address, appears under My Bookings in your account.",
  },
];
