import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-fade";

export type HeroSlide = {
  id: string | number;
  src: string;
  alt: string;
};

const arrowClass =
  "pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur transition hover:scale-105";

export function HeroSlider({ slides, className }: { slides: HeroSlide[]; className?: string }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);

  if (!slides.length) return null;

  const multiple = slides.length > 1;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-black",
        // Mobile: height follows the banner's own aspect ratio — no crop, no bars.
        "max-md:h-auto max-md:bg-transparent",
        className,
      )}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={multiple}
        speed={700}
        autoplay={
          multiple
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        onSwiper={setSwiper}
        onSlideChange={(s) => setActive(s.realIndex)}
        className="h-full w-full max-md:h-auto"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={slide.id}
            className="flex items-center justify-center bg-black max-md:bg-transparent"
          >
            {/* Mobile only: banners render at their natural height, so this blurred copy is
                normally hidden behind them. It only shows if banners differ in shape (a shorter
                one sits on a soft fill instead of black). Same URL, no extra download; hidden ≥md. */}
            <img
              src={slide.src}
              alt=""
              aria-hidden
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl brightness-75 saturate-125 select-none md:hidden"
            />
            <img
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
              className="
                block
                h-full
                w-full

                object-contain
                md:object-cover

                object-center

                select-none
                transition-all
                duration-700

                max-md:relative
                max-md:h-auto
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {multiple && (
        <>
          <button
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous slide"
            className={cn(
              arrowClass,
              "hidden md:grid absolute left-5 top-1/2 z-20 -translate-y-1/2",
            )}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => swiper?.slideNext()}
            aria-label="Next slide"
            className={cn(
              arrowClass,
              "hidden md:grid absolute right-5 top-1/2 z-20 -translate-y-1/2",
            )}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-5 md:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => swiper?.slideToLoop(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  active === i ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
