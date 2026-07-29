import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Beer, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { money, num, dateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dispensing")({
  head: () => ({
    meta: [
      { title: "Dispensing — Silver Pub POS" },
      { name: "description", content: "Reconcile draught and spirit dispensing units against collected revenue." },
      { property: "og:title", content: "Dispensing — Silver Pub POS" },
      { property: "og:description", content: "Track dispensed volume, expected revenue and outstanding balances." },
    ],
  }),
  component: DispensingPage,
});

type Unit = { id: string; name: string; product_id: string | null; is_active: boolean };
type Session = {
  id: string;
  unit_id: string;
  opening_quantity: number;
  dispensed_quantity: number;
  returned_quantity: number;
  expected_revenue: number;
  collected_revenue: number;
  outstanding: number;
  is_closed: boolean;
  created_at: string;
};

function DispensingPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", product_id: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["dispensing"],
    queryFn: async () => {
      const [{ data: units }, { data: sessions }, { data: products }] = await Promise.all([
        supabase.from("dispensing_units").select("*").order("name"),
        supabase
          .from("dispensing_sessions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("products").select("id,name").order("name"),
      ]);
      return {
        units: (units ?? []) as Unit[],
        sessions: (sessions ?? []) as Session[],
        products: (products ?? []) as { id: string; name: string }[],
      };
    },
  });

  const units = data?.units ?? [];
  const sessions = data?.sessions ?? [];
  const outstanding = sessions.filter((s) => !s.is_closed).reduce((a, s) => a + Number(s.outstanding), 0);
  const expected = sessions.filter((s) => !s.is_closed).reduce((a, s) => a + Number(s.expected_revenue), 0);
  const unitName = (id: string) => units.find((u) => u.id === id)?.name ?? "Unit";

  const save = async () => {
    if (!form.name.trim()) return toast.error("Give the dispensing unit a name");
    const { error } = await supabase.from("dispensing_units").insert({
      name: form.name.trim(),
      product_id: form.product_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Dispensing unit added");
    setForm({ name: "", product_id: "" });
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const toggle = async (u: Unit) => {
    const { error } = await supabase
      .from("dispensing_units")
      .update({ is_active: !u.is_active })
      .eq("id", u.id);
    if (error) return toast.error(error.message);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  return (
    <div>
      <PageHeader
        title="Dispensing"
        subtitle="Draught taps and spirit dispensers reconciled against revenue"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> New unit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add dispensing unit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="d-name">Unit name</Label>
                  <Input
                    id="d-name"
                    placeholder="Tap 1 — Tusker Draught"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Linked product</Label>
                  <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose product" />
                    </SelectTrigger>
                    <SelectContent>
                      {(data?.products ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()}>Save unit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active units" value={units.filter((u) => u.is_active).length} format={(n) => num(n)} icon={<Beer className="size-4" />} />
        <StatCard label="Expected revenue (open)" value={expected} format={money} tone="info" index={1} />
        <StatCard label="Outstanding" value={outstanding} format={money} tone="warning" index={2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <p className="mb-4 font-display text-lg font-semibold">Dispensing units</p>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading units…</p>
          ) : units.length === 0 ? (
            <EmptyState title="No units configured" description="Add taps or dispensers to reconcile volume." />
          ) : (
            <div className="space-y-2">
              {units.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.is_active ? "Active" : "Disabled"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void toggle(u)}>
                    {u.is_active ? "Disable" : "Enable"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel>
          <p className="mb-4 font-display text-lg font-semibold">Recent sessions</p>
          {sessions.length === 0 ? (
            <EmptyState title="No sessions yet" description="Sessions are created when a shift opens a unit." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">Unit</th>
                    <th className="py-2 pr-4">Opened</th>
                    <th className="py-2 pr-4 text-right">Dispensed</th>
                    <th className="py-2 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="py-2.5 pr-4">{unitName(s.unit_id)}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{dateTime(s.created_at)}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{num(s.dispensed_quantity, 1)}</td>
                      <td className="py-2.5 text-right tabular-nums text-warning">{money(s.outstanding)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
