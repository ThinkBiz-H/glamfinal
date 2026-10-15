import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gift, Clock, Check, Plus, Sparkles, Loader2, Star, Tag } from "lucide-react";
import * as homeApi from "@/api/home";
import { toUiPackage, inr, type UiPackage } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Strip HTML tags for safe display of package highlights
function parseHighlights(htmlDesc?: string): string[] {
  if (!htmlDesc) return [];
  const items = htmlDesc
    .replace(/<[^>]*>/g, " ")
    .split(/[•·\n\r]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && !s.toLowerCase().includes("removes dirt"));
  return items.slice(0, 3);
}

export function BeautyPackages() {
  const { cart, addToCart, user } = useApp();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch package services from sid 55 (Make your Package / Festival Package Offers)
  const { data, isLoading } = useQuery({
    queryKey: ["beauty-packages", "55"],
    queryFn: () => homeApi.getServiceBySubCategory("55"),
    staleTime: 5 * 60 * 1000,
  });

  const rawServices = data?.services ?? [];
  const packages: UiPackage[] = rawServices
    .slice(0, 4)
    .map((row) => toUiPackage(row, "55", "9"));

  const handleBook = async (pkg: UiPackage) => {
    if (!user) {
      toast.info("Please sign in to book your package");
    }
    try {
      setAddingId(pkg.id);
      await addToCart({
        productId: pkg.id,
        title: pkg.name,
        price: pkg.price,
        image: pkg.image,
      });
      toast.success(`${pkg.name} added to your booking!`);
    } catch {
      toast.error("Could not add package to bag");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section aria-label="Beauty Packages" className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-700 uppercase mb-2">
            <Gift className="size-3.5 text-amber-600" />
            <span>Curated Combos & Rituals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            Luxury Beauty Packages
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
            Save up to 60% with all-in-one head-to-toe beauty packages designed for complete radiance.
          </p>
        </div>

        <Link
          to="/packages/$subcatId"
          params={{ subcatId: "55" }}
          search={{ cid: "9", title: "All Beauty Packages" }}
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline group"
        >
          View all packages
          <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-soft"
            >
              <Skeleton className="h-48 w-full rounded-2xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-neutral-100">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500 text-sm">Packages are refreshing. Check back shortly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {packages.map((pkg, idx) => {
            const inCart = cart.some((c) => String(c.productId) === String(pkg.id));
            const isAdding = addingId === pkg.id;
            const savings = pkg.strikePrice ? pkg.strikePrice - pkg.price : 0;
            const highlights = parseHighlights(pkg.description);

            return (
              <article
                key={pkg.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lift"
              >
                <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black shadow-md">
                      <Tag className="size-3" />
                      {pkg.discountPercent > 0 ? `${pkg.discountPercent}% OFF` : "Best Value"}
                    </span>
                    {idx === 0 && (
                      <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
                        ⭐ Most Popular
                      </span>
                    )}
                  </div>

                  {pkg.ttken && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <Clock className="size-3.5 text-amber-400" />
                      <span>{pkg.ttken}</span>
                    </div>
                  )}

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Highlights list */}
                  <div className="mb-6 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Package Inclusions:
                    </p>
                    {highlights.length > 0 ? (
                      <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700">
                        {highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="size-2.5" />
                            </span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2">
                        Complete multi-treatment ritual including organic waxing, facial cleanup, and relaxation.
                      </p>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-neutral-100 pt-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-neutral-900">
                          {inr(pkg.price)}
                        </span>
                        {pkg.strikePrice && (
                          <span className="text-sm text-neutral-400 line-through">
                            {inr(pkg.strikePrice)}
                          </span>
                        )}
                      </div>
                      {savings > 0 && (
                        <p className="text-xs font-semibold text-emerald-600">
                          You save {inr(savings)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl border-neutral-200 text-xs font-semibold hover:bg-neutral-50"
                      >
                        <Link
                          to="/package/$id"
                          params={{ id: pkg.id }}
                          search={{ subcatId: pkg.subcatId, cid: pkg.catId }}
                        >
                          Details
                        </Link>
                      </Button>

                      <Button
                        onClick={() => handleBook(pkg)}
                        disabled={isAdding}
                        className={cn(
                          "rounded-xl px-4 py-2 font-semibold shadow-sm transition-all",
                          inCart
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-black text-white hover:bg-neutral-800",
                        )}
                      >
                        {isAdding ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : inCart ? (
                          <>
                            <Check className="size-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="size-4" />
                            <span>Book Package</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
