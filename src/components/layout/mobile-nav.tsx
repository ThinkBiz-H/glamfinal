import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingBag, CalendarCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

const items: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/services", label: "Services", icon: LayoutGrid },
  { to: "/checkout", label: "Bag", icon: ShoppingBag },
  { to: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/dashboard", label: "Profile", icon: User, exact: true },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount } = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 surface-glass border-t border-border/70 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_rgb(31_41_55/0.08)] lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map((i) => {
          const active = i.exact ? pathname === i.to : pathname.startsWith(i.to);
          return (
            <li key={i.label} className="flex-1">
              <Link
                to={i.to as "/"}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-200",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
                <i.icon className="size-5" />
                {i.label === "Bag" && cartCount > 0 && (
                  <span className="absolute top-1 right-[22%] grid size-4 place-items-center rounded-full bg-highlight text-[9px] font-bold text-highlight-foreground">
                    {cartCount}
                  </span>
                )}
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
