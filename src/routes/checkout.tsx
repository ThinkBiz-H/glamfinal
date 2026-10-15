import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Plus,
  Minus,
  Trash2,
  CalendarDays,
  Clock,
  Banknote,
  Smartphone,
  Loader2,
  Home,
  Briefcase,
  ShoppingBag,
  Tag,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, EmptyState } from "@/components/site/primitives";
import { MediaImage } from "@/components/site/media";
import { AddressForm } from "@/components/site/address-form";
import { inr } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { resolveImageUrl } from "@/api/client";
import { findRazorpayGateway, loadRazorpayScript, openRazorpayCheckout } from "@/api/payment";
import { usePaymentGateways } from "@/hooks/use-booking";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | GlamRide" },
      {
        name: "description",
        content: "Choose your address, date, time and payment method to confirm your booking.",
      },
    ],
  }),
  component: Checkout,
});

// Verified: OLD's DateTime.jsx isSlotExpired() — a slot on today's date that
// has already passed is disabled, not hidden.
function isSlotExpired(date: string, slot: string): boolean {
  if (!date || !slot) return false;
  const today = new Date();
  const selectedDay = parseInt(date.match(/\d+/)?.[0] ?? "", 10);
  if (selectedDay !== today.getDate()) return false;

  const [time, period] = slot.split(" ");
  if (!time) return false;
  const [hourStr, minuteStr] = time.split(":");
  let hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (period?.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period?.toLowerCase() === "am" && hour === 12) hour = 0;

  const slotTime = new Date();
  slotTime.setHours(hour, minute, 0, 0);
  return slotTime <= today;
}

function iconFor(type: string) {
  const t = (type || "").toLowerCase();
  if (t === "home") return Home;
  if (t === "office") return Briefcase;
  return MapPin;
}

function Checkout() {
  const navigate = useNavigate();
  const {
    user,
    cart,
    cartLoading,
    cartSubtotal,
    setQty,
    removeFromCart,
    addresses,
    addressesLoading,
    getTimeSlots,
    placeBooking,
  } = useApp();
  const { gateways } = usePaymentGateways();

  const [addressId, setAddressId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [slotsLoading, setSlotsLoading] = useState(true);
  const [days, setDays] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [method, setMethod] = useState<"1" | "2">("1");
  const [placing, setPlacing] = useState(false);

  // Responsive coupon support
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null,
  );

  useEffect(() => {
    if (!addressId && addresses[0]) setAddressId(String(addresses[0].id));
  }, [addresses, addressId]);

  // Load time slots for the active category context — verified:
  // OLD's DateTime.jsx / timeService.getTimeSlots(uid, cid).
  useEffect(() => {
    let cancelled = false;
    if (!user || cart.length === 0) {
      setSlotsLoading(false);
      return;
    }
    setSlotsLoading(true);
    getTimeSlots().then((res) => {
      if (cancelled) return;
      setDays(res.days);
      setSlots(res.slots);
      if (res.days[0]) setSelectedDate(res.days[0]);
      setSlotsLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart.length]);

  useEffect(() => {
    if (!selectedDate || slots.length === 0) return;
    const firstAvailable = slots.find((s) => !isSlotExpired(selectedDate, s)) ?? "";
    setSelectedTime(firstAvailable);
  }, [selectedDate, slots]);

  const convenienceFee = 100;
  const gst = Number((cartSubtotal * 0.18).toFixed(2));
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, Math.round(cartSubtotal + convenienceFee + gst - couponDiscount));

  const selectedAddress = useMemo(
    () => addresses.find((a) => String(a.id) === addressId),
    [addresses, addressId],
  );

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (clean === "GLAMFIRST" || clean === "GLAM150" || clean === "SAVE150") {
      setAppliedCoupon({ code: clean, discount: 150 });
      setCouponCode("");
      toast.success(`Coupon ${clean} applied! You saved ₹150`);
    } else if (clean === "LUXURY" || clean === "GLAM10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon({ code: clean, discount });
      setCouponCode("");
      toast.success(`Coupon ${clean} applied! You saved ${inr(discount)}`);
    } else {
      toast.error("Invalid coupon code. Try 'GLAMFIRST'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  if (!user) {
    return (
      <Section className="px-4 py-12">
        <EmptyState
          title="Sign in to check out"
          body="Create an account or sign in to confirm your booking."
          action={
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  if (!cartLoading && cart.length === 0) {
    return (
      <Section className="px-4 py-12">
        <EmptyState
          title="Your bag is empty"
          body="Add a service to your booking to continue."
          action={
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/services">Browse services</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select or add an address");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    setPlacing(true);
    try {
      if (method === "2") {
        // Cash on delivery — verified: OLD's Payment.jsx cash flow.
        const res = await placeBooking({
          address: selectedAddress,
          date: selectedDate,
          time: selectedTime,
          paymentStatus: "Cash",
        });
        if (!res.ok) {
          toast.error(res.message || "Booking failed");
          setPlacing(false);
          return;
        }
        navigate({
          to: "/booking-success",
          search: { bookingId: String(res.bookingId ?? ""), otp: String(res.otp ?? "") },
        });
        return;
      }

      // Online — verified: OLD's Payment.jsx Razorpay flow.
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Unable to load payment gateway");
        setPlacing(false);
        return;
      }
      const gateway = findRazorpayGateway(gateways) ?? gateways[0];
      if (!gateway) {
        toast.error("Payment gateway not found");
        setPlacing(false);
        return;
      }
      openRazorpayCheckout({
        gateway,
        amount: total,
        name: user.name,
        email: user.email,
        contact: user.mobile,
        onSuccess: async (paymentId) => {
          const res = await placeBooking({
            address: selectedAddress,
            date: selectedDate,
            time: selectedTime,
            paymentStatus: "Online",
            transactionId: paymentId,
          });
          setPlacing(false);
          if (!res.ok) {
            toast.error(res.message || "Booking failed");
            return;
          }
          navigate({
            to: "/booking-success",
            search: { bookingId: String(res.bookingId ?? ""), otp: String(res.otp ?? "") },
          });
        },
        onFailed: (description) => {
          setPlacing(false);
          toast.error(description);
        },
      });
    } catch {
      toast.error("Something went wrong");
      setPlacing(false);
    }
  };

  return (
    <Section className="w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-36 lg:pb-16 overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
          Confirm Your Booking
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Select address, schedule slot, and confirm payment details.
        </p>
      </div>

      {/* Responsive Two-Column on Desktop (lg), Clean Single-Column Stack on Mobile/Tablet */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Address -> Items -> Delivery (Date & Time)  */}
        {/* ========================================================= */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8 min-w-0 w-full">
          {/* ---- 1. Address Section ---- */}
          <section
            aria-label="Service Address"
            className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
                <MapPin className="size-4 sm:size-5 text-primary" />
                <span>Service Address</span>
              </h2>

              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                    <Plus className="size-3.5 mr-1" /> Add New
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-lg px-4 pb-8">
                    <DrawerHeader>
                      <DrawerTitle>Add New Address</DrawerTitle>
                    </DrawerHeader>
                    <AddressForm onSaved={() => setDrawerOpen(false)} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            {addressesLoading ? (
              <Skeleton className="h-20 w-full rounded-2xl" />
            ) : addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center">
                <p className="text-xs sm:text-sm text-neutral-500 mb-3">
                  No saved address found. Add your address to proceed.
                </p>
                <Button onClick={() => setDrawerOpen(true)} className="rounded-xl text-xs">
                  <Plus className="size-3.5 mr-1" /> Add Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => {
                  const Icon = iconFor(a.type);
                  const selected = String(a.id) === addressId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAddressId(String(a.id))}
                      className={`flex w-full min-w-0 items-start gap-3 rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                          : "border-neutral-200/80 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                          selected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-neutral-900">
                            {a.type}
                          </span>
                          {a.landmark && (
                            <span className="text-xs text-neutral-500 font-medium truncate">
                              • {a.landmark}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-600 break-words leading-relaxed">
                          {[a.hno, a.address].filter(Boolean).join(", ")}
                        </p>
                        {a.pincode && (
                          <span className="mt-1 inline-block text-[11px] font-semibold text-neutral-500">
                            PIN: {a.pincode}
                          </span>
                        )}
                      </div>

                      <div className="shrink-0 mt-0.5">
                        <span
                          className={`grid size-5 place-items-center rounded-full border ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {selected && <span className="size-2 rounded-full bg-white" />}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* ---- 2. Items Section (Services in Booking) ---- */}
          <section
            aria-label="Selected Services"
            className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
                <ShoppingBag className="size-4 sm:size-5 text-primary" />
                <span>Services Booked ({cart.length})</span>
              </h2>

              <Link
                to="/services"
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                + Add More
              </Link>
            </div>

            {cartLoading ? (
              <Skeleton className="h-28 w-full rounded-2xl" />
            ) : (
              <ul className="divide-y divide-neutral-100">
                {cart.map((line) => (
                  <li
                    key={line.productId}
                    className="flex items-center gap-3 sm:gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <MediaImage
                      variant="thumb"
                      src={line.image ? resolveImageUrl(line.image) : null}
                      alt={line.title}
                      className="size-14 sm:size-16 shrink-0 rounded-xl overflow-hidden bg-neutral-50"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-bold text-neutral-900">
                        {line.title}
                      </p>
                      <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-primary">
                        {inr(line.price)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 shrink-0 rounded-xl border border-neutral-200 bg-neutral-50/80 p-1">
                      <button
                        type="button"
                        onClick={() => setQty(line.productId, line.qty - 1)}
                        className="grid size-6 sm:size-7 place-items-center rounded-lg bg-white text-neutral-800 shadow-xs hover:bg-neutral-100 focus-visible:outline-none"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs sm:text-sm font-bold text-neutral-900">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.productId, line.qty + 1)}
                        className="grid size-6 sm:size-7 place-items-center rounded-lg bg-white text-neutral-800 shadow-xs hover:bg-neutral-100 focus-visible:outline-none"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(line.productId)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors shrink-0"
                      aria-label={`Remove ${line.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ---- 3. Delivery Section (Date & Time Scheduling) ---- */}
          <section
            aria-label="Appointment Schedule"
            className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft"
          >
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
                <CalendarDays className="size-4 sm:size-5 text-primary" />
                <span>Select Appointment Date</span>
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Choose your preferred date for the expert's home visit.
              </p>
            </div>

            {slotsLoading ? (
              <Skeleton className="h-12 w-full rounded-xl" />
            ) : days.length === 0 ? (
              <p className="text-xs sm:text-sm text-neutral-500">No dates available right now.</p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {days.map((d) => {
                  const isSelected = selectedDate === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`shrink-0 rounded-xl sm:rounded-2xl border px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 mb-3">
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Select Time Slot</span>
              </h3>
            </div>

            {slotsLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : slots.length === 0 ? (
              <p className="text-xs sm:text-sm text-neutral-500">No time slots available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
                {slots.map((s) => {
                  const disabled = isSlotExpired(selectedDate, s);
                  const isSelected = selectedTime === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedTime(s)}
                      className={`rounded-xl border py-2.5 px-2 text-xs sm:text-sm font-semibold text-center truncate transition-all ${
                        disabled
                          ? "border-neutral-100 bg-neutral-50 text-neutral-400 line-through cursor-not-allowed opacity-50"
                          : isSelected
                            ? "border-primary bg-primary text-white shadow-sm"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Order Summary -> Coupon -> Payment -> Place */}
        {/* ========================================================= */}
        <aside className="space-y-6 lg:col-span-5 xl:col-span-4 min-w-0 w-full lg:sticky lg:top-24">
          {/* ---- 4. Order Summary ---- */}
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Order Summary</h2>

            <dl className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600">
                <dt>Service Total</dt>
                <dd className="font-semibold text-neutral-900">{inr(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between text-neutral-600">
                <dt>Convenience Fee</dt>
                <dd className="font-semibold text-neutral-900">{inr(convenienceFee)}</dd>
              </div>
              <div className="flex justify-between text-neutral-600">
                <dt>GST (18%)</dt>
                <dd className="font-semibold text-neutral-900">{inr(gst)}</dd>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <dt className="flex items-center gap-1">
                    <Tag className="size-3.5" /> Coupon ({appliedCoupon.code})
                  </dt>
                  <dd>-{inr(appliedCoupon.discount)}</dd>
                </div>
              )}

              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base sm:text-lg font-extrabold text-neutral-900">
                <dt>Total Amount</dt>
                <dd className="text-primary">{inr(total)}</dd>
              </div>
            </dl>
          </div>

          {/* ---- 5. Coupon Section ---- */}
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft">
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2 mb-3">
              <Tag className="size-4 text-primary" />
              <span>Coupons & Offers</span>
            </h2>

            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-900 truncate">
                      {appliedCoupon.code} Applied
                    </p>
                    <p className="text-[11px] text-emerald-700">You saved {inr(appliedCoupon.discount)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-red-600 hover:underline shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="h-10 w-full min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-xs sm:text-sm uppercase tracking-wider text-neutral-900 placeholder:text-neutral-400 placeholder:normal-case focus:border-primary focus:bg-white focus:outline-none"
                  />
                  <Button type="submit" size="sm" className="h-10 rounded-xl px-4 text-xs font-bold shrink-0">
                    Apply
                  </Button>
                </form>

                {/* Quick Suggestion Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon({ code: "GLAMFIRST", discount: 150 });
                    toast.success("Coupon GLAMFIRST applied! You saved ₹150");
                  }}
                  className="mt-2.5 flex items-center gap-1.5 text-[11px] text-primary hover:underline font-semibold"
                >
                  <span>✨ Tap to apply <strong>GLAMFIRST</strong> for flat ₹150 OFF</span>
                </button>
              </div>
            )}
          </div>

          {/* ---- 6. Payment Method Section ---- */}
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-soft">
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 mb-3">
              Payment Method
            </h2>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setMethod("1")}
                className={`flex w-full items-center justify-between rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${
                  method === "1"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                      method === "1" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <Smartphone className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      Pay Online (UPI, Cards)
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">Fast & 100% Secure Checkout</p>
                  </div>
                </div>

                <span
                  className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                    method === "1" ? "border-primary bg-primary text-white" : "border-neutral-300"
                  }`}
                >
                  {method === "1" && <span className="size-1.5 rounded-full bg-white" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("2")}
                className={`flex w-full items-center justify-between rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${
                  method === "2"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                      method === "2" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <Banknote className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      Cash on Delivery
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">Pay after service completion</p>
                  </div>
                </div>

                <span
                  className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                    method === "2" ? "border-primary bg-primary text-white" : "border-neutral-300"
                  }`}
                >
                  {method === "2" && <span className="size-1.5 rounded-full bg-white" />}
                </span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
              <span>Safe & encrypted payment gateway</span>
            </div>
          </div>

          {/* ---- 7. Place Order Button (Desktop) ---- */}
          <div className="hidden lg:block">
            <Button
              size="lg"
              className="h-13 w-full rounded-2xl text-base font-bold shadow-lift bg-primary hover:bg-primary/95 text-white transition-all hover:scale-[1.01]"
              disabled={placing || cart.length === 0}
              onClick={handlePlaceOrder}
            >
              {placing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Confirming Booking...</span>
                </div>
              ) : (
                `Place Order • ${inr(total)}`
              )}
            </Button>
          </div>
        </aside>
      </div>

      {/* ========================================================= */}
      {/* STICKY BOTTOM BAR ON MOBILE (lg:hidden) WITH SAFE AREA     */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-6px_24px_rgba(0,0,0,0.12)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Total to Pay
            </span>
            <span className="text-xl font-extrabold text-neutral-900 leading-tight">
              {inr(total)}
            </span>
          </div>

          <Button
            size="lg"
            className="h-12 flex-1 rounded-xl text-sm sm:text-base font-bold shadow-md bg-primary hover:bg-primary/95 text-white"
            disabled={placing || cart.length === 0}
            onClick={handlePlaceOrder}
          >
            {placing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              `Place Order`
            )}
          </Button>
        </div>
      </div>
    </Section>
  );
}
