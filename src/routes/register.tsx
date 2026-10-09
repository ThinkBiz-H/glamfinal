import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/primitives";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account | GlamRide" },
      { name: "description", content: "Join GlamRide and book your first at-home service." },
      { property: "og:title", content: "Create your account | GlamRide" },
      { property: "og:description", content: "Join GlamRide and book your first at-home service." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { checkMobile, registerUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referCode, setReferCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Enter your full name");
    if (mobile.length !== 10) return toast.error("Enter a valid 10-digit mobile number");
    if (!email.trim()) return toast.error("Enter your email");
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    // Verified: OLD's Register.jsx checks mobile availability before
    // registering (tcapi/s_mobile_check.php returns Result "false" if the
    // number is already registered).
    const check = await checkMobile(mobile);
    if (!check.ok) {
      toast.error(check.message || "This mobile number is already registered.");
      setLoading(false);
      return;
    }

    const res = await registerUser({
      name,
      email,
      mobile,
      password,
      ...(referCode ? { refercode: referCode } : {}),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.message || "Couldn't create your account.");
      return;
    }
    toast.success(res.message || "Account created — please sign in");
    navigate({ to: "/login" });
  };

  return (
    <Section className="max-w-md">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join GlamRide and book your first at-home service.
        </p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile number</Label>
            <Input
              id="mobile"
              maxLength={10}
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="refer">Referral code (optional)</Label>
            <Input
              id="refer"
              value={referCode}
              onChange={(e) => setReferCode(e.target.value)}
              className="h-12"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </Section>
  );
}
