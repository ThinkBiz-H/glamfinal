import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/site/media";

import "swiper/css";

export type HeroSlide = { id: string | number; src: string; alt: string };

const arrowClass =
  "grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none";

/**
 * Full-bleed background slider for the home hero: autoplaying slides, a dark
 * gradient overlay, and prev/next + dot controls. Fills its positioned parent.
 */
export function HeroSlider({ slides, className }: { slides: HeroSlide[]; className?: string }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const multiple = slides.length > 1;

  if (!slides.length) return null;

  return (
    <div className={cn("absolute inset-0", className)}>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={multiple}
        speed={900}
        autoplay={
          multiple ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false
        }
        onSwiper={setSwiper}
        onSlideChange={(s) => setActive(s.realIndex)}
        className="h-full w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.id}>
            <MediaImage
              variant="banner"
              src={s.src}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dark gradient overlay keeps the hero copy legible on any banner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-black/85 via-black/60 to-black/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-40 bg-linear-to-t from-black/60 to-transparent"
      />

      {multiple && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 lg:bottom-20">
          <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-8 lg:justify-end">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => swiper?.slidePrev()}
                className={cn(arrowClass, "hidden sm:grid")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    onClick={() => swiper?.slideToLoop(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
                      i === active ? "w-7 bg-highlight" : "w-2 bg-white/50 hover:bg-white/80",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => swiper?.slideNext()}
                className={cn(arrowClass, "hidden sm:grid")}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
