import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/site/primitives";
import { faqs } from "@/data/catalog";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | GlamRide" },
      {
        name: "description",
        content: "Answers on booking, payment methods and account sign-in at GlamRide.",
      },
      { property: "og:title", content: "Frequently Asked Questions | GlamRide" },
      {
        property: "og:description",
        content: "Everything you need to know before booking a ritual at home.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div>
      <div className="bg-hero">
        <Section className="py-12 sm:py-16">
          <h1 className="text-4xl font-semibold sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Still stuck? Our care team replies within two hours.
          </p>
        </Section>
      </div>
      <Section className="max-w-3xl">
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`i${i}`}
              className="mb-3 rounded-2xl border border-border bg-card px-5 shadow-soft"
            >
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </div>
  );
}
