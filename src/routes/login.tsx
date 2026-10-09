import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/primitives";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | GlamRide" },
      {
        name: "description",
        content: "Sign in with your mobile number — we'll send you a one-time code.",
      },
      { property: "og:title", content: "Sign in | GlamRide" },
      {
        property: "og:description",
        content: "Sign in with your mobile number — we'll send you a one-time code.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { sendOtp, verifyOtp } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submitMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    const res = await sendOtp(mobile);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.message || "Couldn't send OTP. Please try again.");
      return;
    }
    toast.success(res.message || "OTP sent");
    setStep("otp");
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    const res = await verifyOtp(mobile, otp);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.message || "Invalid OTP. Please try again.");
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };

  const resend = async () => {
    const res = await sendOtp(mobile);
    toast[res.ok ? "success" : "error"](
      res.message || (res.ok ? "OTP sent" : "Couldn't resend OTP"),
    );
  };

  return (
    <Section className="max-w-md">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "mobile"
            ? "Enter your mobile number — we'll text you a one-time code."
            : `Enter the 4-digit code sent to +91 ${mobile}`}
        </p>

        {step === "mobile" ? (
          <form className="mt-6 space-y-4" onSubmit={submitMobile}>
            <div>
              <Label htmlFor="mobile">Mobile number</Label>
              <Input
                id="mobile"
                type="tel"
                maxLength={10}
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="h-12"
                placeholder="10-digit mobile number"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submitOtp}>
            <button
              type="button"
              onClick={() => setStep("mobile")}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Change number
            </button>
            <div>
              <Label htmlFor="otp">One-time code</Label>
              <Input
                id="otp"
                maxLength={4}
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-12 text-center text-lg tracking-[0.5em]"
                placeholder="••••"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify & continue"}
            </Button>
            <button
              type="button"
              onClick={resend}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Didn't get it? Resend OTP
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-semibold text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Section>
  );
}
