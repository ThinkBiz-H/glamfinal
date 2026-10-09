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
  const total = Math.round(cartSubtotal + convenienceFee + gst);

  const selectedAddress = useMemo(
    () => addresses.find((a) => String(a.id) === addressId),
    [addresses, addressId],
  );

  if (!user) {
    return (
      <Section>
        <EmptyState
          title="Sign in to check out"
          body="Create an account or sign in to confirm your booking."
          action={
            <Button asChild size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  if (!cartLoading && cart.length === 0) {
    return (
      <Section>
        <EmptyState
          title="Your bag is empty"
          body="Add a service to your booking to continue."
          action={
            <Button asChild size="lg">
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
    <Section>
      <h1 className="text-3xl font-semibold sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-6">
          {/* ---- Address ---- */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Address</h2>
            {addressesLoading ? (
              <Skeleton className="mt-4 h-16 rounded-2xl" />
            ) : addresses.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Add an address so we know where to send your expert.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {addresses.map((a) => {
                  const Icon = iconFor(a.type);
                  const selected = String(a.id) === addressId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAddressId(String(a.id))}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${selected ? "border-primary bg-accent ring-1 ring-primary/30" : "border-border hover:border-primary/40"}`}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold">{a.type}</span>
                        {a.landmark ? ` — ${a.landmark}` : ""}
                        <br />
                        <span className="text-muted-foreground">
                          {[a.hno, a.address].filter(Boolean).join(", ")}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <Plus className="size-4" /> Add new address
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-lg px-4 pb-8">
                  <DrawerHeader>
                    <DrawerTitle>Add address</DrawerTitle>
                  </DrawerHeader>
                  <AddressForm onSaved={() => setDrawerOpen(false)} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* ---- Date & time ---- */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CalendarDays className="size-5 text-primary" /> Date
            </h2>
            {slotsLoading ? (
              <Skeleton className="mt-4 h-12 w-full rounded-xl" />
            ) : days.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No dates available right now.</p>
            ) : (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-medium ${selectedDate === d ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}

            <h2 className="mt-6 flex items-center gap-2 text-lg font-semibold">
              <Clock className="size-5 text-primary" /> Time
            </h2>
            {slotsLoading ? (
              <Skeleton className="mt-4 h-24 w-full rounded-xl" />
            ) : slots.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No time slots available.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((s) => {
                  const disabled = isSlotExpired(selectedDate, s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedTime(s)}
                      className={`rounded-xl border py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${selectedTime === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---- Payment method ---- */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Payment method</h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setMethod("1")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${method === "1" ? "border-primary bg-accent ring-1 ring-primary/30" : "border-border hover:border-primary/40"}`}
              >
                <Smartphone className="size-5 text-primary" />
                <span className="font-medium">Pay online</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("2")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${method === "2" ? "border-primary bg-accent ring-1 ring-primary/30" : "border-border hover:border-primary/40"}`}
              >
                <Banknote className="size-5 text-primary" />
                <span className="font-medium">Cash on delivery</span>
              </button>
            </div>
          </div>
        </div>

        {/* ---- Order summary ---- */}
        <aside className="rounded-3xl border border-border bg-card p-6 shadow-lift lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold">Order summary</h2>
          {cartLoading ? (
            <Skeleton className="mt-4 h-40 rounded-2xl" />
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((line) => (
                <li key={line.productId} className="flex items-center gap-3">
                  <MediaImage
                    variant="thumb"
                    src={line.image ? resolveImageUrl(line.image) : null}
                    alt={line.title}
                    className="size-14 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.title}</p>
                    <p className="text-sm text-muted-foreground">{inr(line.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQty(line.productId, line.qty - 1)}
                      className="grid size-7 place-items-center rounded-full border border-border"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(line.productId, line.qty + 1)}
                      className="grid size-7 place-items-center rounded-full border border-border"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.productId)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Service total</dt>
              <dd>{inr(cartSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Convenience fee</dt>
              <dd>{inr(convenienceFee)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GST (18%)</dt>
              <dd>{inr(gst)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{inr(total)}</dd>
            </div>
          </dl>

          <Button
            size="lg"
            className="mt-6 h-12 w-full text-base"
            disabled={placing || cart.length === 0}
            onClick={handlePlaceOrder}
          >
            {placing ? <Loader2 className="size-4 animate-spin" /> : `Pay ${inr(total)} & confirm`}
          </Button>
        </aside>
      </div>
    </Section>
  );
}
