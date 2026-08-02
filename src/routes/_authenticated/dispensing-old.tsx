import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Beer, Plus, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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

export const Route = createFileRoute("/_authenticated/dispensing-old")({
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

type Unit = { id: string; name: string; product_id: string | null; is_active: boolean; price_per_unit?: number };
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
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openSessionOpen, setOpenSessionOpen] = useState(false);
  const [closeSessionOpen, setCloseSessionOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [form, setForm] = useState({ name: "", product_id: "", price_per_unit: "" });
  const [openForm, setOpenForm] = useState({ quantity: "", value: "" });
  const [closeForm, setCloseForm] = useState({ collected: "", returned: "" });

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
  const unitPrice = (id: string) => units.find((u) => u.id === id)?.price_per_unit ?? 0;

  const addUnit = async () => {
    if (!form.name.trim()) return toast.error("Give the dispensing unit a name");
    if (!form.price_per_unit.trim()) return toast.error("Set the price per unit");
    const { error } = await supabase.from("dispensing_units").insert({
      name: form.name.trim(),
      product_id: form.product_id || null,
      price_per_unit: Number(form.price_per_unit),
    });
    if (error) return toast.error(error.message);
    toast.success("Dispensing unit added");
    setForm({ name: "", product_id: "", price_per_unit: "" });
    setAddOpen(false);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const editUnit = async () => {
    if (!selectedUnit) return;
    if (!form.price_per_unit.trim()) return toast.error("Set the price per unit");
    const { error } = await supabase
      .from("dispensing_units")
      .update({ price_per_unit: Number(form.price_per_unit), name: form.name })
      .eq("id", selectedUnit.id);
    if (error) return toast.error(error.message);
    toast.success("Unit updated");
    setEditOpen(false);
    setSelectedUnit(null);
    setForm({ name: "", product_id: "", price_per_unit: "" });
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const openSession = async () => {
    if (!selectedUnit) return;
    if (!openForm.quantity.trim()) return toast.error("Enter opening quantity");
    const qty = Number(openForm.quantity);
    const price = selectedUnit.price_per_unit ?? 0;
    const revenue = qty * price;
    
    const { error } = await supabase.from("dispensing_sessions").insert({
      unit_id: selectedUnit.id,
      opening_quantity: qty,
      opening_revenue: revenue,
      price_per_unit_snapshot: price,
      expected_revenue: revenue,
      dispensed_quantity: 0,
      returned_quantity: 0,
      collected_revenue: 0,
      outstanding: revenue,
      is_closed: false,
    });
    if (error) return toast.error(error.message);
    toast.success(`Dispensing session opened for ${selectedUnit.name}`);
    setOpenSessionOpen(false);
    setSelectedUnit(null);
    setOpenForm({ quantity: "", value: "" });
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const closeSession = async () => {
    if (!selectedSession) return;
    if (!closeForm.collected.trim()) return toast.error("Enter collected amount");
    
    const collected = Number(closeForm.collected);
    const returned = Number(closeForm.returned || 0);
    const dispensed = selectedSession.opening_quantity - returned;
    const expected = dispensed * (selectedSession.expected_revenue / (selectedSession.opening_quantity || 1));
    const outstanding = expected - collected;

    const { error } = await supabase
      .from("dispensing_sessions")
      .update({
        returned_quantity: returned,
        dispensed_quantity: dispensed,
        collected_revenue: collected,
        expected_revenue: expected,
        outstanding: outstanding,
        is_closed: true,
      })
      .eq("id", selectedSession.id);
    if (error) return toast.error(error.message);
    toast.success("Dispensing session closed");
    setCloseSessionOpen(false);
    setSelectedSession(null);
    setCloseForm({ collected: "", returned: "" });
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
          isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
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
                    <Label>Price per unit (KES)</Label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={form.price_per_unit}
                      onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Linked product</Label>
                    <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose product (optional)" />
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
                  <Button onClick={() => void addUnit()}>Save unit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
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
