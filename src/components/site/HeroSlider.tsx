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
  "pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white";

export function HeroSlider({ slides, className }: { slides: HeroSlide[]; className?: string }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);

  if (!slides.length) return null;

  const multiple = slides.length > 1;

  return (
    <div className={cn("group relative h-full w-full overflow-hidden", className)}>
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
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {multiple && (
        <>
          <button
            onClick={() => swiper?.slidePrev()}
            className={cn(
              arrowClass,
              "absolute left-4 top-1/2 z-20 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            )}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => swiper?.slideNext()}
            className={cn(
              arrowClass,
              "absolute right-4 top-1/2 z-20 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            )}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => swiper?.slideToLoop(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
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
