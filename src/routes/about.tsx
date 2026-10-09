import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TheGlamRide | GlamRide" },
      {
        name: "description",
        content:
          "We're rebuilding the salon experience around your home, your time and your comfort.",
      },
      { property: "og:title", content: "About TheGlamRide | GlamRide" },
      {
        property: "og:description",
        content:
          "We're rebuilding the salon experience around your home, your time and your comfort.",
      },
    ],
  }),
  component: Page,
});

const blocks: { h: string; p: string }[] = [
  {
    h: "Our story",
    p: "TheGlamRide began in 2024 when our founders spent four hours in salon queues for a 40-minute service. We rebuilt the entire experience around the customer: certified specialists, sealed premium products and prices that never change at your door.",
  },
  {
    h: "How we hire",
    p: "Every professional clears a police verification, an in-person skill audit with our lead artists and a hygiene certification. Experts must maintain a 4.7+ rating to stay on the platform.",
  },
  {
    h: "Our promise",
    p: "On-time arrival, transparent pricing, single-use products and a 48-hour service warranty on every ritual we deliver.",
  },
];

function Page() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">About TheGlamRide</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We're rebuilding the salon experience around your home, your time and your comfort.
          </p>
        </Section>
      </div>
      <Section className="max-w-3xl">
        <div className="space-y-8">
          {blocks.map((b) => (
            <div
              key={b.h}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <h2 className="text-xl font-semibold">{b.h}</h2>
              <p className="mt-3 text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
