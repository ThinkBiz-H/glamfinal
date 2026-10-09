import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inr } from "@/data/catalog";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Your GlamRide Dashboard" },
      {
        name: "description",
        content: "See upcoming appointments, wallet balance and saved addresses in one calm view.",
      },
      { property: "og:title", content: "Your GlamRide Dashboard" },
      {
        property: "og:description",
        content: "Upcoming appointments, wallet and addresses in one place.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { user, bookings, bookingsLoading, addresses, walletBalance } = useApp();
  const latest = bookings[0];
  const spent = bookings.reduce((t, b) => t + Number(b.final_amount || 0), 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Hello{user?.name ? `, ${user.name.split(" ")[0]}` : " there"}
      </h1>
      <p className="mt-2 text-muted-foreground">Here's everything happening with your bookings.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total bookings", value: String(bookings.length) },
          { label: "Lifetime spend", value: inr(spent) },
          { label: "Saved addresses", value: String(addresses.length) },
          { label: "Wallet balance", value: inr(Number(walletBalance)) },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h2 className="text-xl font-semibold">Latest booking</h2>
        {bookingsLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </div>
        ) : latest ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {latest.booking_date_time} · {inr(Number(latest.final_amount || 0))}
            </p>
            <Button asChild className="mt-5">
              <Link to="/dashboard/bookings">View all bookings</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              No appointments yet — browse our services to get started.
            </p>
            <Button asChild className="mt-5">
              <Link to="/services">Browse services</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
