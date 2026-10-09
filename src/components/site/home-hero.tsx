import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, MapPin, Search, Loader2 } from "lucide-react";
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
    <section
      aria-label="Hero Banner"
      className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]"
    >
      <div className="relative h-[320px] sm:h-[420px] md:h-[560px] lg:h-[700px] overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : (
          <HeroSlider slides={slides} className="h-full w-full rounded-none" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Search Card */}
        {/* Search Card */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 z-30 w-[92%] max-w-2xl -translate-x-1/2">
          {/* LOCATION - NO BACKGROUND */}
          <button className="mb-3 flex w-full items-center gap-3 text-left">
            <div className="grid h-10 w-10 place-items-center">
              {currentLocation.loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <MapPin className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] uppercase tracking-wider text-black/60">Current Location</p>

              <p className="truncate text-sm font-semibold text-black">{address}</p>
            </div>

            <ChevronDown className="h-5 w-5 text-black" />
          </button>

          {/* SEARCH BOX - GLASS */}
          <Link
            to="/search"
            className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl transition-all hover:bg-gray-50"
          >
            <Search className="h-5 w-5 text-black" />

            <span className="text-sm font-medium text-black">
              Search Facial, Haircut, Makeup...
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
