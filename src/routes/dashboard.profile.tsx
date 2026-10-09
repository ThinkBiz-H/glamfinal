import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Preferences | GlamRide" },
      { name: "description", content: "Update your name and password." },
      { property: "og:title", content: "Profile & Preferences | GlamRide" },
      { property: "og:description", content: "Keep your details up to date." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // The backend requires both name AND password on every profile update
    // (verified: tcapi/s_profile.php has no partial-update path).
    if (!name || !password) {
      toast.error("Enter your name and current password to save changes");
      return;
    }
    setSaving(true);
    const res = await updateProfile({ name, password });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.message || "Couldn't update your profile.");
      return;
    }
    setPassword("");
    toast.success("Profile updated");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form
        className="mt-8 max-w-lg space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
        onSubmit={submit}
      >
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
          <Label htmlFor="phone">Mobile</Label>
          <Input id="phone" value={user?.mobile ?? ""} disabled className="h-12" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled className="h-12" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Required to save any change"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              logout();
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
          >
            Sign out
          </Button>
        </div>
      </form>
    </div>
  );
}
