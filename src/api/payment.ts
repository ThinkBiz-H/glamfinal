import { tcapi } from "./client";
import type { PaymentGatewayRawResponse, PaymentGatewayRow } from "@/types/api";

/** POST tcapi/s_paymentgateway.php {} — verified: OLD/authService.getPaymentGateway */
export async function getPaymentGateways() {
  const { data } = await tcapi.post<PaymentGatewayRawResponse>(
    "s_paymentgateway.php",
    {},
    { headers: { "Content-Type": "application/json" } },
  );
  const ok = data.Result === "true";
  return { ok, gateways: ok ? (data.data ?? []) : [] };
}

/** Finds the Razorpay gateway row the same way OLD's Payment.jsx does — by name match, not a fixed id. */
export function findRazorpayGateway(gateways: PaymentGatewayRow[]): PaymentGatewayRow | undefined {
  return gateways.find(
    (item) =>
      item.title?.toLowerCase().includes("razor") || item.name?.toLowerCase().includes("razor"),
  );
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (response: unknown) => void) => void;
    };
  }
}

/** Dynamically loads the Razorpay checkout script once — verified: OLD/Payment.jsx loadRazorpay() */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface OpenRazorpayOptions {
  gateway: PaymentGatewayRow;
  amount: number; // rupees
  name?: string;
  email?: string;
  contact?: string;
  onSuccess: (paymentId: string) => void;
  onFailed?: (description: string) => void;
}

/** Opens the Razorpay checkout modal — verified: OLD/Payment.jsx openRazorpay()/handlePayment(). Caller must call loadRazorpayScript() first. */
export function openRazorpayCheckout(options: OpenRazorpayOptions) {
  if (!window.Razorpay) return;
  const { gateway } = options;
  const rzp = new window.Razorpay({
    key: gateway.attributes || gateway.mAttributes || gateway.payment_key,
    amount: Math.round(options.amount * 100),
    currency: "INR",
    name: "GlamRide",
    description: "Service Booking",
    prefill: {
      name: options.name || "",
      email: options.email || "",
      contact: options.contact || "",
    },
    theme: { color: "#E91E63" },
    handler: (response: { razorpay_payment_id: string }) => {
      options.onSuccess(response.razorpay_payment_id);
    },
  });
  rzp.on("payment.failed", (response: unknown) => {
    const description =
      (response as { error?: { description?: string } })?.error?.description || "Payment Failed";
    options.onFailed?.(description);
  });
  rzp.open();
}
