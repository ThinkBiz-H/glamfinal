import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/support")({
  head: () => ({
    meta: [
      { title: "Help & Support | GlamRide" },
      {
        name: "description",
        content: "Reach the GlamRide support team about a booking, refund or expert.",
      },
      { property: "og:title", content: "Help & Support | GlamRide" },
      { property: "og:description", content: "Reach the GlamRide support team directly." },
    ],
  }),
  component: Support,
});

// The backend has no support-ticket endpoint (confirmed absent — see
// migration notes), so this composes a real email via mailto: instead of
// pretending to submit a ticket to a system that doesn't exist.
function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:infotheglamride@gmail.com?subject=${encodeURIComponent(subject || "Support request")}&body=${encodeURIComponent(message)}`;

  return (
    <div>
      <h1 className="text-3xl font-semibold">Help & support</h1>
      <p className="mt-2 text-muted-foreground">
        Reach us directly — a live ticketing system isn't connected yet.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <a
          href="mailto:infotheglamride@gmail.com"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 transition-colors hover:border-primary/40 hover:bg-accent"
        >
          <Mail className="size-4 text-primary" /> infotheglamride@gmail.com
        </a>
      </div>

      <form
        className="mt-8 max-w-lg space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = mailtoHref;
        }}
      >
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-12"
          />
        </div>
        <div>
          <Label htmlFor="msg">How can we help?</Label>
          <Textarea
            id="msg"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button type="submit">Open in email</Button>
      </form>
    </div>
  );
}
