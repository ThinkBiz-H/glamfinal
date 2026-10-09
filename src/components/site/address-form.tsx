import { useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/app-store";
import { GeolocationDeniedError, requestCurrentPosition, reverseGeocode } from "@/lib/geolocation";

const addressTypes = ["Home", "Office", "Other"];

export function AddressForm({ onSaved }: { onSaved?: () => void }) {
  const { addAddress } = useApp();
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    houseno: "",
    landmark: "",
    address: "",
    city: "",
    pincode: "",
    type: "Home",
    lat_map: "",
    long_map: "",
  });

  // Real GPS + free reverse-geocoding (Nominatim) — the same approach OLD's
  // LocationPicker.jsx used. No Google Maps key required.
  const useLiveLocation = async () => {
    setLocating(true);
    try {
      const { lat, lng } = await requestCurrentPosition();
      const place = await reverseGeocode(lat, lng);
      setForm((prev) => ({
        ...prev,
        address: place?.address || prev.address,
        city: place?.city || prev.city,
        pincode: place?.pincode || prev.pincode,
        lat_map: String(lat),
        long_map: String(lng),
      }));
      if (!place) {
        toast.error("Got your location, but couldn't look up the address — please fill it in.");
      } else {
        toast.success("Location detected — check the details below");
      }
    } catch (err) {
      toast.error(
        err instanceof GeolocationDeniedError
          ? "Location permission was denied. You can still enter your address manually."
          : "Couldn't get your location. Please enter your address manually.",
      );
    } finally {
      setLocating(false);
    }
  };

  const submit = async () => {
    if (!form.houseno.trim()) {
      toast.error("Please enter House / Flat No.");
      return;
    }
    if (!form.landmark.trim()) {
      toast.error("Please enter a landmark.");
      return;
    }
    if (!form.address.trim()) {
      toast.error("Please add your address — use current location or type it in.");
      return;
    }
    setSaving(true);
    const res = await addAddress(form);
    setSaving(false);
    if (res.ok) {
      toast.success("Address saved");
      setForm({
        houseno: "",
        landmark: "",
        address: "",
        city: "",
        pincode: "",
        type: "Home",
        lat_map: "",
        long_map: "",
      });
      onSaved?.();
    } else {
      toast.error(res.message || "Unable to save address.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {addressTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${form.type === t ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={locating}
          onClick={useLiveLocation}
        >
          {locating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LocateFixed className="size-4" />
          )}
          Use current location
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="af-hno">House / flat no.</Label>
          <Input
            id="af-hno"
            value={form.houseno}
            onChange={(e) => setForm({ ...form, houseno: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="af-landmark">Landmark</Label>
          <Input
            id="af-landmark"
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="af-address">Address</Label>
          <Input
            id="af-address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Use current location, or type your address"
          />
        </div>
        <div>
          <Label htmlFor="af-city">City</Label>
          <Input
            id="af-city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="af-pin">Pincode</Label>
          <Input
            id="af-pin"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
        </div>
      </div>

      <Button className="w-full rounded-full" disabled={saving} onClick={submit}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save address"}
      </Button>
    </div>
  );
}
