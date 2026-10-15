import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import type { UiCategory } from "@/data/catalog";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: UiCategory;
  index?: number;
  className?: string;
}

export const CategoryCard = memo(function CategoryCard({
  category,
  index = 0,
  className,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <Link
        to="/services/$category"
        params={{ category: category.id }}
        aria-label={`Browse ${category.name} services`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/85 bg-white shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >
        {/* Large Top Image with 16:10 aspect ratio */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 rounded-t-2xl">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: category.accent }}
            >
              <Sparkles className="size-10 text-primary/70" />
            </div>
          )}

          {/* Subtle gradient vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Category Details below image */}
        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 lg:p-5">
          <div>
            <h3 className="line-clamp-1 text-sm sm:text-base lg:text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary leading-snug">
              {category.name}
            </h3>
            {category.subtitle && (
              <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                {category.subtitle}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2.5 text-xs font-semibold text-primary">
            <span>Explore</span>
            <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
