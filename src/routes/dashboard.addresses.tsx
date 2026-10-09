import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Loader2, Plus, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/primitives";
import { AddressForm } from "@/components/site/address-form";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/addresses")({
  head: () => ({
    meta: [
      { title: "Saved Addresses | GlamRide" },
      {
        name: "description",
        content: "Manage the homes and offices where your expert comes to you.",
      },
      { property: "og:title", content: "Saved Addresses | GlamRide" },
      { property: "og:description", content: "Manage where your experts arrive." },
    ],
  }),
  component: Addresses,
});

function iconFor(type: string) {
  const t = (type || "").toLowerCase();
  if (t === "home") return Home;
  if (t === "office") return Briefcase;
  return MapPin;
}

function Addresses() {
  const { addresses, addressesLoading } = useApp();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Saved addresses</h1>
        <Button variant="outline" onClick={() => setShowForm((s) => !s)}>
          <Plus className="size-4" /> Add address
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">
        Each address type (Home, Office, Other) keeps one saved location — saving again updates it.
      </p>

      {showForm && (
        <div className="mt-6 max-w-lg rounded-3xl border border-dashed border-border p-5">
          <AddressForm onSaved={() => setShowForm(false)} />
        </div>
      )}

      {addressesLoading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={MapPin}
            title="No addresses yet"
            body="Add an address so we know where to send your expert."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => {
            const Icon = iconFor(a.type);
            return (
              <div key={a.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="flex items-center gap-2 font-semibold">
                  <Icon className="size-4 text-primary" /> {a.type}
                  {a.landmark ? ` — ${a.landmark}` : ""}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {[a.hno, a.address].filter(Boolean).join(", ")}
                  {a.pincode ? ` — ${a.pincode}` : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
