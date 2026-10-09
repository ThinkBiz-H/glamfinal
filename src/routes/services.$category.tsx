import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Section, EmptyState, TileCard, TileCardSkeleton } from "@/components/site/primitives";
import { useCategorySection, useHomeData } from "@/hooks/use-catalog";

export const Route = createFileRoute("/services/$category")({
  component: CategoryPage,
});

function CategoryPage() {
  const { category: categoryId } = Route.useParams();
  const { categories } = useHomeData();
  // Matches OLD's ServiceDetails.jsx exactly: the section shown is whichever
  // Subcat_section's first item's cat_id equals this category id — not a
  // dedicated per-category endpoint (none exists).
  const { tiles, isLoading } = useCategorySection(categoryId);
  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? "Services";

  return (
    <div>
      <div className="bg-hero">
        <Section className="py-10 sm:py-14">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{categoryName}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{categoryName}</h1>
        </Section>
      </div>

      <Section>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <TileCardSkeleton key={i} />
            ))}
          </div>
        ) : tiles.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            body="This category doesn't have any listings right now — check back soon."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {tiles.map((tile, i) => (
              <TileCard key={tile.id} tile={tile} index={i} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
