import { useQuery } from "@tanstack/react-query";
import * as paymentApi from "@/api/payment";

/** tcapi/s_paymentgateway.php — verified: OLD/authService.getPaymentGateway */
export function usePaymentGateways() {
  const query = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: () => paymentApi.getPaymentGateways(),
  });
  return { ...query, gateways: query.data?.gateways ?? [] };
}
