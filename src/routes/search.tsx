import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Section, TileCard, TileCardSkeleton, EmptyState } from "@/components/site/primitives";
import { toUiTile } from "@/data/catalog";
import { useHomeData } from "@/hooks/use-catalog";

// The backend has no service-search endpoint anywhere (the only
// keyword-search-shaped endpoint, s_child_search.php, is unrouted/unused in
// OLD and its response shape was never verified in use). Rather than invent
// one, this filters the categories and subcategory tiles already returned
// by s_home_data.php, which is genuinely searchable without a dedicated
// endpoint — the same data Navbar.jsx's live search used in OLD.
export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Beauty Services | GlamRide" },
      {
        name: "description",
        content: "Search facials, hair, makeup, spa and grooming categories available at home.",
      },
      { property: "og:title", content: "Search Beauty Services | GlamRide" },
      { property: "og:description", content: "Find the category or service you want in seconds." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const { categories, subcatSections, isLoading } = useHomeData();

  const tiles = useMemo(
    () => subcatSections.flatMap((s) => s.subcat_data.map(toUiTile)),
    [subcatSections],
  );

  const keyword = q.trim().toLowerCase();
  const matchedCategories = keyword
    ? categories.filter((c) => c.name.toLowerCase().includes(keyword))
    : [];
  const matchedTiles = keyword ? tiles.filter((t) => t.title.toLowerCase().includes(keyword)) : [];
  const hasResults = matchedCategories.length > 0 || matchedTiles.length > 0;

  return (
    <Section>
      <h1 className="text-3xl font-semibold sm:text-4xl">Search</h1>
      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try 'facial', 'bridal', 'massage'"
          className="h-14 rounded-2xl pl-11 text-base shadow-soft"
        />
      </div>

      {!keyword ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Start typing to search across our categories and services.
        </p>
      ) : isLoading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TileCardSkeleton key={i} />
          ))}
        </div>
      ) : hasResults ? (
        <div className="mt-10 space-y-10">
          {matchedCategories.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((c) => (
                  <Link
                    key={c.id}
                    to="/services/$category"
                    params={{ category: c.id }}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {matchedTiles.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Services</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedTiles.map((t, i) => (
                  <TileCard key={t.id} tile={t} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={SearchIcon}
            title="No matches"
            body="Try a different keyword or browse by category."
          />
        </div>
      )}
    </Section>
  );
}
