import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";
import { CategoryCard } from "@/components/site/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeData } from "@/hooks/use-catalog";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "All Beauty & Salon Services At Home | GlamRide" },
      {
        name: "description",
        content: "Browse at-home beauty service categories — hair, facial, makeup, spa and more.",
      },
      { property: "og:title", content: "All Beauty & Salon Services At Home | GlamRide" },
      {
        property: "og:description",
        content: "Hair, facial, makeup, spa and grooming rituals booked in a few taps.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { categories, isLoading } = useHomeData();

  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            GlamRide Catalogue
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Browse All Services
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Pick a service category to discover vetted experts, transparent pricing, and instant slots near you.
          </p>
        </Section>
      </div>

      <Section>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft"
              >
                <Skeleton className="aspect-16/10 w-full rounded-t-2xl rounded-b-none" />
                <div className="p-3.5 sm:p-4 lg:p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-2">
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">No categories are available right now.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category, i) => (
              <CategoryCard key={category.id} category={category} index={i} />
            ))}
          </div>
        )}
      </Section>

      <Section className="pt-0">
        <SectionHeading title="Not sure where to start?" subtitle="Search across every service & ritual." />
        <Link
          to="/search"
          className="hover-lift inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold shadow-soft hover:border-primary/40"
        >
          Search services
        </Link>
      </Section>
    </div>
  );
}
