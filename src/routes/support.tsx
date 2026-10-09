import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support centre | GlamRide" },
      { name: "description", content: "Guides, policies and a direct line to our care team." },
      { property: "og:title", content: "Support centre | GlamRide" },
      {
        property: "og:description",
        content: "Guides, policies and a direct line to our care team.",
      },
    ],
  }),
  component: Page,
});

const blocks: { h: string; p: string }[] = [
  {
    h: "Manage a booking",
    p: "Open Dashboard > Bookings to reschedule, cancel or rebook any appointment in two taps.",
  },
  {
    h: "Refunds & wallet",
    p: "Refunds land in your GlamRide wallet instantly and can be withdrawn to your bank account at any time.",
  },
  {
    h: "Report an issue",
    p: "Raise a ticket from Dashboard > Support or call 98710 92518. Most issues are resolved the same day.",
  },
];

function Page() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Support centre</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Guides, policies and a direct line to our care team.
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
