import { createFileRoute } from "@tanstack/react-router";
import { Copy, Gift, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/refer")({
  head: () => ({
    meta: [
      { title: "Refer & Earn | GlamRide" },
      {
        name: "description",
        content: "Share your GlamRide code with friends and earn wallet credit when they book.",
      },
      { property: "og:title", content: "Refer & Earn | GlamRide" },
      { property: "og:description", content: "Share your code and earn wallet credit." },
    ],
  }),
  component: ReferPage,
});

function ReferPage() {
  const { referCode, signupCredit, referCredit, referLoading } = useApp();
  const shareText = referCode
    ? `Use my GlamRide code ${referCode} to get a discount on at-home beauty services!`
    : "";

  const share = async () => {
    if (!referCode) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "GlamRide", text: shareText });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      await copy();
    }
  };

  const copy = async () => {
    if (!referCode) return;
    try {
      await navigator.clipboard.writeText(referCode);
      toast.success("Code copied");
    } catch {
      toast.error("Couldn't copy — please copy it manually");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Refer & earn</h1>
      <p className="mt-2 text-muted-foreground">
        Share your code — you and your friend both earn wallet credit when they sign up.
      </p>

      <div className="mt-6 rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-lift">
        <p className="flex items-center gap-2 text-sm text-primary-foreground/85">
          <Gift className="size-4" /> Your referral code
        </p>
        {referLoading ? (
          <div className="mt-3">
            <Loader2 className="size-7 animate-spin" />
          </div>
        ) : referCode ? (
          <p className="mt-2 font-display text-4xl font-semibold tracking-widest">{referCode}</p>
        ) : (
          <p className="mt-2 text-primary-foreground/85">
            Your code will appear here once available.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={share} disabled={!referCode}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={copy}
            disabled={!referCode}
          >
            <Copy className="size-4" /> Copy code
          </Button>
        </div>
      </div>

      {!referLoading && (Number(signupCredit) > 0 || Number(referCredit) > 0) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">Your friend gets</p>
            <p className="mt-2 text-2xl font-semibold">₹{signupCredit}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">You get</p>
            <p className="mt-2 text-2xl font-semibold">₹{referCredit}</p>
          </div>
        </div>
      )}
    </div>
  );
}
