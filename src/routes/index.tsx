import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading, TileCard } from "@/components/site/primitives";
import { HomeHero } from "@/components/site/home-hero";
import { QuickCategories } from "@/components/site/quick-categories";
import { PopularServices } from "@/components/site/popular-services";
import { BeautyPackages } from "@/components/site/beauty-packages";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { CustomerReviews } from "@/components/site/customer-reviews";
import { DownloadApp } from "@/components/site/download-app";
import { resolveImageUrl } from "@/api/client";
import { useHomeData } from "@/hooks/use-catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlamRide — Luxury Salon & Spa Services at Home" },
      {
        name: "description",
        content:
          "Book verified at-home beauty professionals for facials, waxing, manicure, pedicure, hair styling, and spa rituals. 100% sealed mono-dose products and transparent pricing.",
      },
      { property: "og:title", content: "GlamRide — Luxury Salon & Spa Services at Home" },
      {
        property: "og:description",
        content:
          "India's premier at-home beauty service. Five-star salon rituals delivered in the comfort of your home.",
      },
      { property: "og:type", content: "website" },
      { name: "keywords", content: "salon at home, beauty parlour at home, home spa, waxing at home, facial at home, bridal makeup at home" },
    ],
  }),
  component: Home,
});

function Home() {
  const { categories, subcatSections, isLoading } = useHomeData();

  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 overflow-x-hidden">
      {/* 1. Full-width Hero */}
      <HomeHero />

      {/* 2. Quick Categories */}
      <Section className="py-0 sm:py-0">
        <QuickCategories categories={categories} isLoading={isLoading} />
      </Section>

      {/* 3. Popular Services */}
      <Section className="py-0 sm:py-0">
        <PopularServices />
      </Section>

      {/* 4. Beauty Packages */}
      <Section className="py-0 sm:py-0">
        <BeautyPackages />
      </Section>

      {/* Subcategory Highlights (Curated catalogue categories) */}
      {subcatSections.slice(0, 2).map((section, i) => (
        <Section key={`${section.cat_name}-${i}`} className="py-0 sm:py-0">
          <SectionHeading
            eyebrow="Explore More"
            title={section.cat_name}
            subtitle={section.cat_subtitle || "Curated salon & spa rituals tailored for you."}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {section.subcat_data.slice(0, 4).map((item, idx) => (
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

      {/* 5. Why Choose GlamRide */}
      <Section className="py-0 sm:py-0">
        <WhyChooseUs />
      </Section>

      {/* 6. Customer Reviews */}
      <Section className="py-0 sm:py-0">
        <CustomerReviews />
      </Section>

      {/* 7. Download App Section */}
      <Section className="py-0 sm:py-0 mb-4 sm:mb-8">
        <DownloadApp />
      </Section>
    </div>
  );
}
