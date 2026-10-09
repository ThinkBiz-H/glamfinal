import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/primitives";

const searchSchema = z.object({
  bookingId: z.string().optional(),
  otp: z.string().optional(),
});

export const Route = createFileRoute("/booking-success")({
  validateSearch: searchSchema,
  component: BookingSuccess,
});

function BookingSuccess() {
  const { bookingId, otp } = Route.useSearch();

  return (
    <Section className="max-w-lg text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-10" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold">Booking confirmed</h1>
      <p className="mt-2 text-muted-foreground">
        Your appointment is booked. We'll see you at the scheduled time.
      </p>

      {bookingId && (
        <p className="mt-6 text-sm text-muted-foreground">
          Booking reference <span className="font-semibold text-foreground">#{bookingId}</span>
        </p>
      )}

      {otp && (
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
          <KeyRound className="size-4 text-primary" /> Visit OTP: {otp}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/dashboard/bookings">View my bookings</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </Section>
  );
}
