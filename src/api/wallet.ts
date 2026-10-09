import { tcapi, isSuccess } from "./client";
import type { WalletReportRawResponse } from "@/types/api";

/** POST tcapi/s_wallet_report.php { uid } — verified: OLD/authService.getWallet */
export async function getWalletReport(uid: string) {
  const { data } = await tcapi.post<WalletReportRawResponse>("s_wallet_report.php", { uid });
  const ok = isSuccess(data);
  return {
    ok,
    balance: data.wallet ?? "0",
    credittotal: data.credittotal ?? "0",
    debittotal: data.debittotal ?? "0",
    items: data.Walletitem ?? [],
  };
}
