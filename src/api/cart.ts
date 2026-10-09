import { pcapi } from "./client";
import type { AddToCartPayload, AddToCartRawResponse, GetCartRawResponse } from "@/types/api";

/** GET pcapi/get_cart.php?user_id={uid} — verified: OLD/cartService.getCart */
export async function getCart(userId: string) {
  const { data } = await pcapi.get<GetCartRawResponse>(
    `get_cart.php?user_id=${encodeURIComponent(userId)}`,
  );
  return data;
}

/**
 * POST pcapi/add_to_cart.php (multipart/form-data) — verified: OLD/cartService.addToCartApi.
 * This is the ONLY cart mutation endpoint: it both adds and updates a line
 * (send the new absolute quantity), and removes it when quantity is 0.
 * There is no separate delete endpoint — do not invent one.
 */
export async function addToCartApi(payload: AddToCartPayload) {
  const formData = new FormData();
  formData.append("user_id", payload.user_id);
  formData.append("product_id", String(payload.product_id));
  formData.append("product_name", payload.product_name);
  formData.append("product_price", String(payload.product_price));
  formData.append("product_image", payload.product_image);
  formData.append("quantity", String(payload.quantity));

  const { data } = await pcapi.post<AddToCartRawResponse>("add_to_cart.php", formData);
  return data;
}
