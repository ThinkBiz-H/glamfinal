import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us | GlamRide" },
      {
        name: "description",
        content: "Talk to a human, quickly. We answer every message within two hours.",
      },
      { property: "og:title", content: "Contact us | GlamRide" },
      {
        property: "og:description",
        content: "Talk to a human, quickly. We answer every message within two hours.",
      },
    ],
  }),
  component: Page,
});

const blocks: { h: string; p: string }[] = [
  { h: "Customer care", p: "98710 92518 — open 7am to 11pm, all days including holidays." },
  {
    h: "Email",
    p: "infotheglamride@gmail.com for bookings, refunds and feedback. Partnerships: partners@glamride.app.",
  },
  {
    h: "Studio address",
    p: "Numberdar House, 44B/9, Shani Bazar Rd, Kishangarh Village, Vasant Kunj, New Delhi, Delhi 110070.",
  },
];

function Page() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Talk to a human, quickly. We answer every message within two hours.
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
