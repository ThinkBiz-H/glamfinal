import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Search, Loader2 } from "lucide-react";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveImageUrl } from "@/api/client";
import { useHomeData } from "@/hooks/use-catalog";
import { useCurrentLocation, type CurrentLocation } from "@/hooks/use-current-location";
import heroImg from "@/assets/hero-glam.jpg";

function shortAddress(loc: CurrentLocation): string | null {
  const seen = new Set<string>();

  const parts = [loc.area, loc.city, loc.state].filter((p): p is string => {
    const key = p?.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return parts.length ? parts.join(", ") : loc.address;
}

function locationText(loc: CurrentLocation) {
  if (loc.loading) return "Detecting location...";

  const address = shortAddress(loc);

  if (address) return address;

  return "Select Location";
}

export function HomeHero() {
  const { banners, isLoading } = useHomeData();

  const currentLocation = useCurrentLocation();

  const address = locationText(currentLocation);

  const slides: HeroSlide[] = useMemo(() => {
    const apiSlides = banners
      .filter((b) => b.img)
      .map((b) => ({
        id: b.id,
        src: resolveImageUrl(b.img),
        alt: b.cat_name || "Banner",
      }));

    return apiSlides.length
      ? apiSlides
      : [
          {
            id: "fallback",
            src: heroImg,
            alt: "Hero",
          },
        ];
  }, [banners]);

  return (
    <section aria-label="Hero Banner" className="relative w-full">
      {/* Mobile (<768px): card sits above the banner and the banner takes its natural
          height, so the whole image shows. Tablet/desktop keep the fixed-height overlay layout. */}
      <div className="relative flex flex-col md:block md:h-[700px] md:overflow-hidden lg:h-[950px]">
        {isLoading ? (
          <Skeleton className="aspect-video w-full rounded-none md:aspect-auto md:h-full" />
        ) : (
          <HeroSlider slides={slides} className="h-full w-full" />
        )}

        {/* Readability overlays: darker behind the floating card and the slide dots, clear in the middle. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-56 bg-linear-to-b from-black/40 via-black/15 to-transparent md:block lg:h-72"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-linear-to-t from-black/30 to-transparent md:h-32 md:from-black/35 lg:h-44"
        />

        {/* Floating Top-Center Glass Search Card (max-w-3xl) */}
        <div className="relative z-30 order-first mx-auto my-3 w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all sm:w-[calc(100%-4rem)] sm:rounded-3xl sm:p-4.5 md:absolute md:top-6 md:left-1/2 md:my-0 md:-translate-x-1/2 lg:top-8">
          {/* Current GPS Location & Full Address */}
          <div className="mb-3 flex items-center gap-2.5 px-1 sm:px-2">
            <div className="relative grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/5 shrink-0">
              {currentLocation.loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-black" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                </>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-black/70 uppercase">
                  Current GPS Location
                </span>
                <span className="inline-block rounded-full bg-emerald-100 px-1.5 py-px text-[9px] font-semibold text-emerald-800">
                  Live
                </span>
              </div>
              <p
                className="truncate text-xs sm:text-sm font-semibold text-black"
                title={currentLocation.address || address}
              >
                {currentLocation.address || address}
              </p>
            </div>
          </div>

          {/* White Search Box with Black Icons/Text -> /search */}
          <Link
            to="/search"
            aria-label="Search beauty services"
            className="group flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-black/10 bg-white px-3.5 sm:px-5 py-3 sm:py-3.5 shadow-sm transition-all hover:border-black/30 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-black shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate text-xs sm:text-sm font-semibold text-neutral-800 group-hover:text-black">
                Search Facial, Haircut, Waxing, Makeup, Spa...
              </span>
            </div>

            <span className="shrink-0 flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-black px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
              <span>Search</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
