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
        <div className="absolute top-1 sm:top-6 md:top-2 left-1/2 z-30 w-[92%] max-w-2xl -translate-x-1/2">
          <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/20 backdrop-blur-2xl shadow-2xl">
            <div className="mx-5 h-px bg-white/20" />

            <Link to="/search" className="flex items-center gap-3 px-2 py-4">
              <Search className="h-5 w-5 text-black" />

              <span className="text-sm text-black/90">Search Facial, Haircut, Makeup...</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
