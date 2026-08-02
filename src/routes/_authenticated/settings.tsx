import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Settings — Silver Pub POS" },
      { name: "description", content: "Business details, receipt branding, tax rate and till configuration." },
      { property: "og:title", content: "Settings — Silver Pub POS" },
      { property: "og:description", content: "Configure the pub profile, receipts and payment till." },
    ],
  }),
  component: SettingsPage,
});

type Settings = {
  id: string;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  till_number: string | null;
  currency: string | null;
  tax_rate: number | null;
  receipt_footer: string | null;
  receipt_width: string | null;
};

function SettingsPage() {
  const qc = useQueryClient();
  const { isManager, user } = useAuth();
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [pinForm, setPinForm] = useState({ current: "", new: "", confirm: "" });
  const [savingPin, setSavingPin] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["business-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("business_settings").select("*").limit(1).maybeSingle();
      return (data ?? null) as Settings | null;
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = async () => {
    if (!isManager) return toast.error("Only managers can change settings");
    setSaving(true);
    const payload = {
      business_name: form.business_name || "Silver Pub",
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      till_number: form.till_number || null,
      currency: form.currency || "KES",
      tax_rate: Number(form.tax_rate ?? 0),
      receipt_footer: form.receipt_footer || null,
      receipt_width: form.receipt_width || "80mm",
      updated_at: new Date().toISOString(),
    };
    const { error } = data?.id
      ? await supabase.from("business_settings").update(payload).eq("id", data.id)
      : await supabase.from("business_settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    void qc.invalidateQueries({ queryKey: ["business-settings"] });
  };

  const savePin = async () => {
    if (!user) return toast.error("You must be signed in");
    if (!pinForm.new.trim()) return toast.error("Enter new PIN");
    if (pinForm.new.length !== 4 || !/^\d+$/.test(pinForm.new))
      return toast.error("PIN must be exactly 4 digits");
    if (pinForm.new !== pinForm.confirm) return toast.error("PINs do not match");

    setSavingPin(true);
    try {
      const { error } = await supabase
        .from("admin_pins")
        .upsert(
          {
            user_id: user.id,
            pin: pinForm.new,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;
      toast.success("Admin PIN updated");
      setPinForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update PIN");
    } finally {
      setSavingPin(false);
    }
  };

  const field = (key: keyof Settings, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={`f-${key}`}>{label}</Label>
      <Input
        id={`f-${key}`}
        type={type}
        value={(form[key] as string | number | null) ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Business identity, receipts and tax configuration"
        actions={
          <Button className="rounded-full" onClick={() => void save()} disabled={saving || !isManager}>
            <Save className="mr-1 size-4" /> Save changes
          </Button>
        }
      />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading settings…</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <GlassPanel>
            <p className="mb-4 font-display text-lg font-semibold">Business profile</p>
            <div className="space-y-4">
              {field("business_name", "Business name")}
              <div className="grid gap-4 sm:grid-cols-2">
                {field("phone", "Phone")}
                {field("email", "Email")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-address">Address</Label>
                <Textarea
                  id="f-address"
                  value={form.address ?? ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <p className="mb-4 font-display text-lg font-semibold">Payments & receipts</p>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("till_number", "M-Pesa till / paybill")}
                {field("tax_rate", "Tax rate (%)", "number")}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("currency", "Currency code")}
                <div className="space-y-2">
                  <Label>Receipt width</Label>
                  <Select
                    value={form.receipt_width ?? "80mm"}
                    onValueChange={(v) => setForm({ ...form, receipt_width: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-footer">Receipt footer</Label>
                <Textarea
                  id="f-footer"
                  value={form.receipt_footer ?? ""}
                  onChange={(e) => setForm({ ...form, receipt_footer: e.target.value })}
                />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <p className="mb-4 font-display text-lg font-semibold">Admin PIN (4 digits)</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin-new">New PIN</Label>
                <Input
                  id="pin-new"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="0000"
                  value={pinForm.new}
                  onChange={(e) => setPinForm({ ...pinForm, new: e.target.value.replace(/\D/g, "") })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin-confirm">Confirm PIN</Label>
                <Input
                  id="pin-confirm"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="0000"
                  value={pinForm.confirm}
                  onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value.replace(/\D/g, "") })}
                />
              </div>
              <Button
                onClick={() => void savePin()}
                disabled={savingPin || !pinForm.new}
                className="w-full rounded-xl"
              >
                {savingPin ? "Updating..." : "Update PIN"}
              </Button>
              <p className="text-xs text-muted-foreground">
                You will need to re-enter this PIN after each admin login
              </p>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
