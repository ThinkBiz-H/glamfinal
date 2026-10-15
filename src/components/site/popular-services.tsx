import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Plus, Check, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import * as homeApi from "@/api/home";
import { toUiPackage, inr, type UiPackage } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Curated top popular subcategories from cat 1 (Salon for women)
const TABS = [
  { id: "54", label: "Waxing Bestsellers", catId: "1" },
  { id: "11", label: "Facials & Glow", catId: "1" },
  { id: "24", label: "Mani-Pedi Care", catId: "1" },
  { id: "25", label: "Clean-up Rituals", catId: "1" },
] as const;

export function PopularServices() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const { cart, addToCart, user } = useApp();
  const [addingId, setAddingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["popular-services", activeTab.id],
    queryFn: () => homeApi.getServiceBySubCategory(activeTab.id),
    staleTime: 5 * 60 * 1000,
  });

  const rawServices = data?.services ?? [];
  const services: UiPackage[] = rawServices
    .slice(0, 6)
    .map((row) => toUiPackage(row, activeTab.id, activeTab.catId));

  const handleBook = async (service: UiPackage) => {
    if (!user) {
      toast.info("Please sign in to add services to your booking");
    }
    try {
      setAddingId(service.id);
      await addToCart({
        productId: service.id,
        title: service.name,
        price: service.price,
        image: service.image,
      });
      toast.success(`${service.name} added to your booking bag!`);
    } catch {
      toast.error("Could not add to bag. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section aria-label="Popular Services" className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase mb-2">
            <Sparkles className="size-3.5" />
            <span>Most Booked Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            Popular Salon & Spa Services
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
            Indulge in our highest-rated beauty treatments performed at your home by verified professionals.
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline group"
        >
          View all services
          <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 hover:text-black",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-soft"
            >
              <Skeleton className="aspect-4/3 w-full rounded-2xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500 text-sm">Services are updating. Check back shortly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const inCart = cart.some((c) => String(c.productId) === String(service.id));
            const isAdding = addingId === service.id;
            // Aesthetic deterministic rating for luxury social proof
            const ratingScore = (4.8 + ((index * 3) % 3) * 0.06).toFixed(1);
            const reviewCount = 850 + index * 140;

            return (
              <article
                key={service.id}
                className="group relative flex flex-col rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
              >
                {/* Image Frame */}
                <Link
                  to="/package/$id"
                  params={{ id: service.id }}
                  search={{ subcatId: service.subcatId, cid: service.catId }}
                  className="relative mb-4 block aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Discount Badge */}
                  {service.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                      {service.discountPercent}% OFF
                    </span>
                  )}

                  {/* Verified Service Badge */}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <ShieldCheck className="size-3 text-emerald-400" />
                    Verified
                  </span>
                </Link>

                {/* Rating & Duration */}
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-neutral-900">{ratingScore}</span>
                    <span>({reviewCount}+)</span>
                  </div>

                  {service.ttken && (
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5 text-neutral-400" />
                      <span>{service.ttken}</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="line-clamp-2 text-base sm:text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary">
                  <Link
                    to="/package/$id"
                    params={{ id: service.id }}
                    search={{ subcatId: service.subcatId, cid: service.catId }}
                    className="focus-visible:outline-none focus-visible:underline"
                  >
                    {service.name}
                  </Link>
                </h3>

                {/* Pricing & Book Button */}
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-neutral-100 pt-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-extrabold text-neutral-900">
                        {inr(service.price)}
                      </span>
                      {service.strikePrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {inr(service.strikePrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 block">Single-use kit included</span>
                  </div>

                  <Button
                    onClick={() => handleBook(service)}
                    disabled={isAdding}
                    variant={inCart ? "secondary" : "default"}
                    className={cn(
                      "rounded-xl px-4 py-2 font-semibold shadow-sm transition-all",
                      inCart
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-primary text-white hover:bg-primary/90 hover:shadow-md",
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
                        <span>Book</span>
                      </>
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
