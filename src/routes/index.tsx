import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, SectionHeading, TileCard } from "@/components/site/primitives";
import { HomeHero } from "@/components/site/home-hero";
import { resolveImageUrl } from "@/api/client";
import { useHomeData } from "@/hooks/use-catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlamRide — Salon & Spa Services At Home" },
      {
        name: "description",
        content:
          "Book facials, hair, makeup, spa and grooming services at home with vetted professionals.",
      },
      { property: "og:title", content: "GlamRide — Salon & Spa Services At Home" },
      {
        property: "og:description",
        content: "Salon-grade beauty services delivered to your door.",
      },
    ],
  }),
  component: Home,
});

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified experts",
    desc: "Every professional is vetted before booking.",
  },
  { icon: Clock, title: "Flexible slots", desc: "Choose the date and time that works for you." },
  {
    icon: BadgeCheck,
    title: "Transparent pricing",
    desc: "The price you see is the price you pay.",
  },
];

function Home() {
  const { categories, subcatSections, isLoading } = useHomeData();

  return (
    <div>
      <HomeHero />

      {/* ---- Categories ---- */}
      <Section>
        <SectionHeading
          eyebrow="Categories"
          title="What are you in the mood for?"
          action={
            <Button asChild variant="outline">
              <Link to="/services">View all</Link>
            </Button>
          }
        />
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-24 shrink-0 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/services/$category"
                params={{ category: c.id }}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <span
                  className="grid size-20 place-items-center rounded-2xl border border-border text-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  style={{ backgroundColor: c.accent }}
                >
                  ✨
                </span>
                <span className="max-w-[92px] text-center text-xs font-medium">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* ---- Subcategory sections (curated rows from s_home_data.php) ---- */}
      {subcatSections.map((section, i) => (
        <Section key={`${section.cat_name}-${i}`} className="pt-0">
          <SectionHeading title={section.cat_name} subtitle={section.cat_subtitle} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {section.subcat_data.slice(0, 8).map((item, idx) => (
              <TileCard
                key={item.subcat_id}
                tile={{
                  id: String(item.subcat_id),
                  catId: String(item.cat_id),
                  subcatId: String(item.subcat_id),
                  title: item.title,
                  image: resolveImageUrl(item.img),
                }}
                index={idx}
              />
            ))}
          </div>
        </Section>
      ))}

      {/* ---- Trust points (generic, policy-neutral) ---- */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {trustPoints.map((t) => (
            <div key={t.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <t.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
