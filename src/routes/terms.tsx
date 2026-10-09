import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service | GlamRide" },
      {
        name: "description",
        content: "The ground rules for booking beauty services through GlamRide.",
      },
      { property: "og:title", content: "Terms of service | GlamRide" },
      {
        property: "og:description",
        content: "The ground rules for booking beauty services through GlamRide.",
      },
    ],
  }),
  component: Page,
});

const blocks: { h: string; p: string }[] = [
  {
    h: "Bookings",
    p: "A booking is confirmed once a slot is reserved. Reschedule free up to 2 hours before your appointment; later changes may attract a partial fee.",
  },
  {
    h: "Cancellations & refunds",
    p: "Cancellations made more than 2 hours before the slot are refunded to your GlamRide wallet instantly, or to your original payment method within 5 working days.",
  },
  {
    h: "Service warranty",
    p: "Report any issue within 48 hours of the service and we will redo the ritual or refund it, at your choice.",
  },
];

function Page() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Terms of service</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The ground rules for booking beauty services through GlamRide.
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
