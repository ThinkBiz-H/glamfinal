import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  MapPin,
  User,
  LifeBuoy,
  LayoutGrid,
  Wallet,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/site/primitives";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

type NavItem = {
  to:
    | "/dashboard"
    | "/dashboard/bookings"
    | "/dashboard/addresses"
    | "/dashboard/wallet"
    | "/dashboard/refer"
    | "/dashboard/profile"
    | "/dashboard/support";
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/refer", label: "Refer & earn", icon: Gift },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <nav className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-soft lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:p-2">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <Outlet />
      </div>
    </Section>
  );
}
