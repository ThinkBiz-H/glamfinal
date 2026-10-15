import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { type UiCategory } from "@/data/catalog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuickCategoriesProps {
  categories: UiCategory[];
  isLoading: boolean;
}

export function QuickCategories({ categories, isLoading }: QuickCategoriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-4 sm:mb-6 flex items-end justify-between px-1">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            Quick Categories
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
            What are you looking for today?
          </h2>
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex w-28 sm:w-32 md:w-36 shrink-0 flex-col items-center rounded-2xl sm:rounded-3xl border border-border bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl mb-3" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Categories carousel"
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/services/$category"
              params={{ category: c.id }}
              className="group flex w-28 sm:w-32 md:w-36 shrink-0 flex-col items-center justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-3.5 sm:p-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative mb-2.5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-2xl bg-neutral-50/80 p-2 transition-transform duration-300 group-hover:scale-108">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span
                    className="grid h-full w-full place-items-center rounded-xl text-xl"
                    style={{ backgroundColor: c.accent }}
                  >
                    <Sparkles className="h-6 w-6 text-primary" />
                  </span>
                )}
              </div>

              <span className="line-clamp-2 text-xs sm:text-sm font-semibold text-neutral-800 transition-colors group-hover:text-primary leading-snug">
                {c.name}
              </span>

              {c.subtitle && (
                <span className="mt-1 line-clamp-1 text-[10px] font-medium text-neutral-500">
                  {c.subtitle}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
