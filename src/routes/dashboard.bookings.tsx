import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MapPin, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/primitives";
import { MediaImage } from "@/components/site/media";
import { resolveImageUrl } from "@/api/client";
import { inr } from "@/data/catalog";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings | GlamRide" },
      { name: "description", content: "Review every GlamRide appointment you've made." },
      { property: "og:title", content: "My Bookings | GlamRide" },
      { property: "og:description", content: "Track your at-home beauty appointments." },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const { bookings, bookingsLoading } = useApp();

  if (bookingsLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading your bookings…
      </div>
    );
  }

  if (bookings.length === 0)
    return (
      <EmptyState
        title="No bookings yet"
        body="Once you book a service it'll show up here, with your visit OTP and address."
        action={
          <Button asChild>
            <Link to="/services">Browse services</Link>
          </Button>
        }
      />
    );

  return (
    <div>
      <h1 className="text-3xl font-semibold">My bookings</h1>
      <div className="mt-8 space-y-5">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="font-semibold">Booking #{b.id}</p>
                <p className="text-sm text-muted-foreground">{b.booking_date_time}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">
                {b.payment_status}
              </span>
            </div>

            {b.services && b.services.length > 0 && (
              <div className="mt-4 space-y-3">
                {b.services.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                    <MediaImage
                      variant="thumb"
                      src={s.img ? resolveImageUrl(s.img) : null}
                      alt={s.title}
                      className="size-16 shrink-0 bg-card"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{s.title}</p>
                      {s.subTitle && <p className="text-xs text-muted-foreground">{s.subTitle}</p>}
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {inr(Number(s.price))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total paid</span>
              <span className="text-lg font-semibold">{inr(Number(b.final_amount || 0))}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{b.user_address}</span>
            </div>

            {b.otp && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <KeyRound className="size-3.5" /> Visit OTP: {b.otp}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
