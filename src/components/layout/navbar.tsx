import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, User, MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { useApp } from "@/store/app-store";
import { useHomeData } from "@/hooks/use-catalog";
import { getLocationLabel, useCurrentLocation } from "@/hooks/use-current-location";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

// Focus ring tuned for the brown bar (the Button default offsets against the cream page).
const onDarkFocus = "focus-visible:ring-white/70 focus-visible:ring-offset-black";
const iconButton = cn("text-white hover:bg-white/10 hover:text-white", onDarkFocus);

export function Navbar() {
  const { cartCount, user, addresses } = useApp();
  const { categories } = useHomeData();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const primaryAddress = addresses[0];
  const currentLocation = useCurrentLocation();
  const locationLabel = getLocationLabel(
    currentLocation,
    primaryAddress ? `${primaryAddress.type} · ${primaryAddress.pincode}` : "Add your address",
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black shadow-[0_6px_24px_-12px_rgb(0_0_0/0.6)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:h-18 sm:px-8">
        <Link to="/" className={cn("flex shrink-0 items-center gap-3 rounded-lg", onDarkFocus)}>
          <img src="/logo.png" alt="TheGlamRide" className="h-12 w-auto object-contain sm:h-16" />

          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xl font-bold tracking-wide text-white">TheGlamRide</span>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white",
                pathname.startsWith(n.to) && "bg-white/15 text-white",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span
            title={locationLabel}
            aria-live="polite"
            className="mr-1 hidden max-w-72 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white xl:inline-flex"
          >
            {currentLocation.loading ? (
              <Loader2 className="size-3.5 shrink-0 animate-spin text-white" />
            ) : (
              <MapPin className="size-3.5 shrink-0 text-white" />
            )}
            <span className="truncate">{locationLabel}</span>
          </span>

          <Button asChild variant="ghost" size="icon" className={iconButton}>
            <Link to="/search" aria-label="Search services">
              <Search className="size-5" />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className={cn("relative", iconButton)}>
            <Link to="/checkout" aria-label="Your booking bag">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-[#29e5da] text-[10px] font-bold text-black ring-2 ring-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          <Button
            asChild
            className={cn(
              "hidden bg-[#357ee5] text-white hover:bg-[#2563eb] sm:inline-flex",
              onDarkFocus,
            )}
          >
            <Link to={user ? "/dashboard" : "/login"}>
              <User className="size-4" />
              {user ? (user.name?.split(" ")[0] ?? "Account") : "Sign in"}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("lg:hidden", iconButton)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86vw] max-w-sm overflow-y-auto border-white/10 bg-black text-white [&>button]:text-white/80 [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
            >
              <SheetHeader>
                <SheetTitle>
                  <img src="/logo.png" alt="TheGlamRide" className="h-10 w-auto object-contain" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-8">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white",
                      pathname.startsWith(n.to) && "bg-white/15 text-white",
                    )}
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to={user ? "/dashboard" : "/login"}
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#357ee5] px-3 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2563eb]"
                >
                  <User className="size-4" />
                  {user ? "My dashboard" : "Sign in"}
                </Link>

                <p className="mt-6 mb-2 px-3 text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  Categories
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to="/services/$category"
                    params={{ category: c.id }}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
