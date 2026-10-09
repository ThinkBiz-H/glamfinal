import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { MediaImage } from "@/components/site/media";
import { resolveImageUrl } from "@/api/client";
import { useHomeData } from "@/hooks/use-catalog";
import { getLocationLabel, useCurrentLocation } from "@/hooks/use-current-location";
import { useApp } from "@/store/app-store";
import heroImg from "@/assets/hero-glam.jpg";

const assurances = [
  "Verified Professionals",
  "Premium Products",
  "Safe & Hygienic",
  "Instant Booking",
];

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export function HomeHero() {
  const { banners, categories, subcatSections, isLoading } = useHomeData();
  const { user, addresses } = useApp();
  const primaryAddress = addresses[0];
  const currentLocation = useCurrentLocation();
  const locationLabel = getLocationLabel(
    currentLocation,
    primaryAddress ? `${primaryAddress.type} · ${primaryAddress.pincode}` : "Add your address",
  );

  const slides: HeroSlide[] = useMemo(() => {
    const fromApi = banners
      .filter((b) => b.img)
      .map((b) => ({ id: b.id, src: resolveImageUrl(b.img), alt: b.cat_name || "GlamRide" }));
    return fromApi.length ? fromApi : [{ id: "fallback", src: heroImg, alt: "GlamRide" }];
  }, [banners]);

  // Catlist rows carry no image, so each category borrows the first
  // subcategory tile image the home feed already returns for it.
  const categoryImages = useMemo(() => {
    const map = new Map<string, string>();
    for (const section of subcatSections) {
      for (const item of section.subcat_data) {
        const catId = String(item.cat_id);
        if (item.img && !map.has(catId)) map.set(catId, resolveImageUrl(item.img));
      }
    }
    return map;
  }, [subcatSections]);

  return (
    <div className="bg-background">
      {/* ---- Banner hero ---- */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-neutral-900 lg:min-h-[550px]">
        <HeroSlider slides={slides} />

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-8 lg:pb-24">
          <div className="pointer-events-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              ✨ India's Trusted Beauty Platform
            </span>

            <h1 className="mt-4 text-[28px] leading-[1.15] font-bold text-balance text-white sm:text-5xl lg:text-6xl">
              Beauty &amp; Salon Services <span className="text-highlight">At Your Doorstep</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              Book salon, spa, makeup, hair, facial, waxing &amp; grooming services at home.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
              <Button asChild size="lg" className="h-11 px-6 text-base sm:h-12 sm:px-7">
                <Link to="/services">
                  Book Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-white/40 bg-white/10 px-6 text-base text-white shadow-none backdrop-blur-sm hover:border-white/60 hover:bg-white/20 hover:text-white sm:h-12 sm:px-7"
              >
                <a href="#featured-categories">Explore Services</a>
              </Button>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-x-6">
              {assurances.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/90 sm:text-sm"
                >
                  <CircleCheck className="size-4 shrink-0 text-highlight" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Floating location + search card ---- */}
      <div className="relative z-20 mx-auto -mt-6 max-w-5xl px-4 sm:px-8 lg:-mt-14">
        <div className="grid gap-2 rounded-2xl border border-border bg-card p-2 shadow-lift sm:p-3 md:grid-cols-[minmax(0,320px)_1fr]">
          <Link
            to={user ? "/dashboard/addresses" : "/login"}
            title={locationLabel}
            className="group flex h-14 min-w-0 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-accent md:border-r md:border-border md:rounded-r-none"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-primary">
              {currentLocation.loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MapPin className="size-4" />
              )}
            </span>
            <span className="min-w-0 flex-1" aria-live="polite">
              <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Location
              </span>
              <span className="block truncate text-sm font-semibold">{locationLabel}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
          </Link>

          <Link
            to="/search"
            aria-label="Search services"
            className="flex h-14 min-w-0 items-center gap-3 rounded-xl border border-input bg-background pr-1.5 pl-4 text-muted-foreground transition-colors hover:border-primary/40 md:border-0 md:bg-transparent"
          >
            <Search className="size-5 shrink-0" />
            <span className="flex-1 truncate text-sm">
              Search for "facial", "bridal", "massage"…
            </span>
            <span className="hidden h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 sm:inline-flex">
              Search
            </span>
          </Link>
        </div>

        {/* ---- Featured categories ---- */}
        <div id="featured-categories" className="mt-6 scroll-mt-28">
          {isLoading ? (
            <div className={`flex gap-3 overflow-x-auto pb-2 ${hideScrollbar}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-28 shrink-0 rounded-xl border border-border bg-white p-2 sm:w-32"
                >
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="mx-auto mt-2 h-3.5 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(128px,1fr))] sm:overflow-visible sm:px-0 ${hideScrollbar}`}
            >
              {categories.map((c) => {
                const img = categoryImages.get(c.id);
                return (
                  <Link
                    key={c.id}
                    to="/services/$category"
                    params={{ category: c.id }}
                    className="hover-lift group w-28 shrink-0 snap-start rounded-xl border border-border bg-white p-2 shadow-soft sm:w-auto"
                  >
                    <MediaImage
                      variant="square"
                      src={img}
                      alt=""
                      zoomOnHover
                      className="rounded-lg"
                      fallback={
                        <span
                          className="absolute inset-0 grid place-items-center text-primary"
                          style={{ backgroundColor: c.accent }}
                        >
                          <Sparkles className="size-6" />
                        </span>
                      }
                    />
                    <span className="mt-2 block truncate px-0.5 text-center text-xs font-semibold transition-colors group-hover:text-primary sm:text-sm">
                      {c.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
