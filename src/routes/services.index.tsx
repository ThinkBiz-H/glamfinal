import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Scissors,
  Flower2,
  Brush,
  Hand,
  Droplets,
  Feather,
  Footprints,
  Crown,
  Sun,
  Waves,
  Gift,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "@/components/site/primitives";
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

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Scissors,
  Flower2,
  Brush,
  Hand,
  Droplets,
  Feather,
  Footprints,
  Crown,
  Sun,
  Waves,
  Gift,
};

function ServicesIndex() {
  const { categories, isLoading } = useHomeData();

  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Browse services</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Pick a category to see what's available near you.
          </p>
        </Section>
      </div>

      <Section>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">No categories are available right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => {
              const Icon = ICONS[c.icon] ?? Sparkles;
              return (
                <Reveal key={c.id} delay={Math.min(i * 0.04, 0.3)}>
                  <Link
                    to="/services/$category"
                    params={{ category: c.id }}
                    className="hover-lift flex h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-border p-5 text-center shadow-soft"
                    style={{ backgroundColor: c.accent }}
                  >
                    <Icon className="size-7" />
                    <span className="text-sm font-semibold">{c.name}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </Section>

      <Section className="pt-0">
        <SectionHeading title="Not sure where to start?" subtitle="Search across every category." />
        <Link
          to="/search"
          className="hover-lift inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium shadow-soft"
        >
          Search services
        </Link>
      </Section>
    </div>
  );
}
