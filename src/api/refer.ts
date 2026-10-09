import { tcapi, isSuccess } from "./client";
import type { ReferDataRawResponse } from "@/types/api";

/** POST tcapi/getdata.php { uid } — verified: OLD/authService.getReferData */
export async function getReferData(uid: string) {
  const { data } = await tcapi.post<ReferDataRawResponse>("getdata.php", { uid });
  const ok = isSuccess(data);
  return {
    ok,
    code: data.code ?? "",
    signupcredit: data.signupcredit ?? "0",
    refercredit: data.refercredit ?? "0",
  };
}
