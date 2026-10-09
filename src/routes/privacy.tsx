import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | GlamRide" },
      {
        name: "description",
        content: "What we collect, why we collect it, and the control you have over it.",
      },
      { property: "og:title", content: "Privacy policy | GlamRide" },
      {
        property: "og:description",
        content: "What we collect, why we collect it, and the control you have over it.",
      },
    ],
  }),
  component: Page,
});

const blocks: { h: string; p: string }[] = [
  {
    h: "Information we collect",
    p: "Your name, contact details, service addresses and booking history. Payment details are processed by our PCI-compliant partners and never stored on our servers.",
  },
  {
    h: "How we use it",
    p: "To assign the right expert, route them to your address, process payments and improve our service quality. We never sell your data to third parties.",
  },
  {
    h: "Your controls",
    p: "You can export or delete your account data at any time from Settings, or by writing to privacy@glamride.app.",
  },
];

function Page() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Privacy policy</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            What we collect, why we collect it, and the control you have over it.
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
