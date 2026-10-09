import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { z } from "zod";
import {
  Section,
  EmptyState,
  PackageCard,
  PackageCardSkeleton,
} from "@/components/site/primitives";
import { usePackagesForSubcategory } from "@/hooks/use-catalog";
import { useApp } from "@/store/app-store";
import { useEffect } from "react";

const searchSchema = z.object({
  cid: z.string().optional(),
  title: z.string().optional(),
});

export const Route = createFileRoute("/packages/$subcatId")({
  validateSearch: searchSchema,
  component: PackagesPage,
});

function PackagesPage() {
  const { subcatId } = Route.useParams();
  const { cid, title } = Route.useSearch();
  const { setActiveCid } = useApp();
  const { packages, isLoading } = usePackagesForSubcategory(subcatId, cid);

  // Mirrors OLD's localStorage("cid") side-effect on entering a
  // subcategory's package list (PackageDetails.jsx) — every downstream
  // step (cart, timeslot, checkout) reads this single category context.
  useEffect(() => {
    if (cid) setActiveCid(cid);
  }, [cid, setActiveCid]);

  return (
    <div>
      <div className="bg-hero">
        <Section className="py-10 sm:py-14">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{title || "Packages"}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title || "Packages"}</h1>
        </Section>
      </div>

      <Section>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <EmptyState
            title="No packages found"
            body="Nothing is listed here right now — check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
