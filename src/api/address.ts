import { tcapi, isSuccess, pickMessage } from "./client";
import type {
  AddressListRawResponse,
  SaveAddressPayload,
  SaveAddressRawResponse,
} from "@/types/api";

/** POST tcapi/s_address_list.php { uid } — verified: OLD/authService.getAddressList */
export async function getAddressList(uid: string) {
  const { data } = await tcapi.post<AddressListRawResponse>("s_address_list.php", { uid });
  const list = data.AddressList ?? data.addressList ?? [];
  return { ok: isSuccess(data), message: pickMessage(data), list };
}

/**
 * POST tcapi/s_address_user.php — verified: OLD/authService.saveAddress.
 * aid: 0 creates a new address; a real id updates that address. There is
 * no delete endpoint on this backend — do not invent one.
 */
export async function saveAddress(payload: SaveAddressPayload) {
  const { data } = await tcapi.post<SaveAddressRawResponse>("s_address_user.php", payload);
  return { ok: isSuccess(data), message: pickMessage(data) };
}
