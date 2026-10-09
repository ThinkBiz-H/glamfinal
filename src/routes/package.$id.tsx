import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ChevronLeft, Check, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Section, EmptyState } from "@/components/site/primitives";
import { MediaImage } from "@/components/site/media";
import { Skeleton } from "@/components/ui/skeleton";
import { inr } from "@/data/catalog";
import { usePackagesForSubcategory } from "@/hooks/use-catalog";
import { useApp } from "@/store/app-store";

const searchSchema = z.object({
  subcatId: z.string().optional(),
  cid: z.string().optional(),
});

export const Route = createFileRoute("/package/$id")({
  validateSearch: searchSchema,
  component: PackageDetailPage,
});

function PackageDetailPage() {
  const { id } = Route.useParams();
  const { subcatId, cid } = Route.useSearch();
  const navigate = useNavigate();
  const { user, cart, addToCart, setActiveCid } = useApp();
  const [adding, setAdding] = useState(false);

  // There is no get-service-by-id endpoint that's actually wired into the
  // real app (get_service_detail.php is defined but never called anywhere
  // in OLD's shipped code) — so, same as the package list, this re-fetches
  // the subcategory's package list and looks the item up by id.
  const { packages, isLoading } = usePackagesForSubcategory(subcatId, cid);
  const pkg = packages.find((p) => p.id === id);

  useEffect(() => {
    if (cid) setActiveCid(cid);
  }, [cid, setActiveCid]);

  const inCart = cart.some((c) => c.productId === id);

  if (isLoading) {
    return (
      <Section>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </Section>
    );
  }

  if (!pkg) {
    return (
      <Section>
        <EmptyState
          title="Package not found"
          body="This package may no longer be available."
          action={
            <Button asChild>
              <Link to="/services">Browse services</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please sign in to book a service");
      navigate({ to: "/login" });
      return;
    }
    setAdding(true);
    await addToCart({ productId: pkg.id, title: pkg.name, price: pkg.price, image: pkg.image });
    setAdding(false);
    toast.success(`${pkg.name} added to your booking`);
  };

  return (
    <Section>
      <Link
        to="/packages/$subcatId"
        params={{ subcatId: subcatId ?? "" }}
        search={{ cid }}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:grid lg:grid-cols-12">
        <div className="lg:col-span-5">
          <MediaImage
            variant="detail"
            src={pkg.image}
            alt={pkg.name}
            loading="eager"
            className="lg:aspect-auto lg:h-full lg:min-h-80"
          />
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{pkg.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {pkg.discountPercent > 0 && (
                <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">
                  {pkg.discountPercent}% OFF
                </span>
              )}
              {pkg.ttken && <span className="text-sm text-muted-foreground">{pkg.ttken}</span>}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-semibold">{inr(pkg.price)}</span>
              {pkg.strikePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {inr(pkg.strikePrice)}
                </span>
              )}
            </div>

            {pkg.description && (
              <div
                className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground"
                // Verified: OLD's PackageDetail.jsx renders this same field
                // (service.sdesc) with dangerouslySetInnerHTML — the backend
                // returns pre-formatted HTML for this description.
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            )}
          </div>

          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            disabled={adding}
            variant={inCart ? "secondary" : "default"}
            onClick={handleAdd}
          >
            {adding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : inCart ? (
              <Check className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {inCart ? "Added — add another" : "Add to booking"}
          </Button>
        </div>
      </div>
    </Section>
  );
}
