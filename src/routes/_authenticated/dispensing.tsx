import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Beer, Plus, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  
  // Admin dialogs
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  
  // Cashier dialogs
  const [openSessionOpen, setOpenSessionOpen] = useState(false);
  const [closeSessionOpen, setCloseSessionOpen] = useState(false);
  
  // Form states
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [addForm, setAddForm] = useState({ name: "", price: "", product_id: "" });
  const [editForm, setEditForm] = useState({ name: "", price: "" });
  const [openForm, setOpenForm] = useState({ quantity: "" });
  const [closeForm, setCloseForm] = useState({ collected: "", returned: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["dispensing"],
    queryFn: async () => {
      const [{ data: units }, { data: sessions }, { data: products }] = await Promise.all([
        supabase.from("dispensing_units").select("*").order("name"),
        supabase.from("dispensing_sessions").select("*").order("created_at", { ascending: false }),
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
  const openSessions = sessions.filter((s) => !s.is_closed);
  const outstanding = openSessions.reduce((a, s) => a + Number(s.outstanding), 0);
  const expected = openSessions.reduce((a, s) => a + Number(s.expected_revenue), 0);

  // ADMIN FUNCTIONS
  const addUnit = async () => {
    if (!addForm.name.trim()) return toast.error("Enter unit name");
    if (!addForm.price.trim()) return toast.error("Enter price per unit");
    const { error } = await supabase.from("dispensing_units").insert({
      name: addForm.name.trim(),
      price_per_unit: Number(addForm.price),
      product_id: addForm.product_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Dispensing can added");
    setAddForm({ name: "", price: "", product_id: "" });
    setAddUnitOpen(false);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const updateUnit = async () => {
    if (!selectedUnit || !editForm.name.trim()) return toast.error("Enter unit name");
    if (!editForm.price.trim()) return toast.error("Enter price per unit");
    const { error } = await supabase
      .from("dispensing_units")
      .update({ name: editForm.name.trim(), price_per_unit: Number(editForm.price) })
      .eq("id", selectedUnit.id);
    if (error) return toast.error(error.message);
    toast.success("Dispensing can updated");
    setEditUnitOpen(false);
    setSelectedUnit(null);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const toggleUnit = async (u: Unit) => {
    const { error } = await supabase.from("dispensing_units").update({ is_active: !u.is_active }).eq("id", u.id);
    if (error) return toast.error(error.message);
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  // CASHIER FUNCTIONS
  const openSession = async () => {
    if (!selectedUnit) return;
    if (!openForm.quantity.trim()) return toast.error("Enter opening units");
    const qty = Number(openForm.quantity);
    if (qty <= 0) return toast.error("Quantity must be greater than 0");
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
    toast.success(`Opened: ${selectedUnit.name}`);
    setOpenSessionOpen(false);
    setSelectedUnit(null);
    setOpenForm({ quantity: "" });
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  const closeSession = async () => {
    if (!selectedSession) return;
    if (!closeForm.collected.trim()) return toast.error("Enter collected amount");
    const collected = Number(closeForm.collected);
    const returned = Number(closeForm.returned || 0);
    if (returned > selectedSession.opening_quantity) return toast.error("Returned units exceed opening quantity");
    
    const dispensed = selectedSession.opening_quantity - returned;
    const priceSnapshot = selectedSession.expected_revenue / (selectedSession.opening_quantity || 1);
    const expected = dispensed * priceSnapshot;
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
    toast.success("Session closed");
    setCloseSessionOpen(false);
    setSelectedSession(null);
    setCloseForm({ collected: "", returned: "" });
    void qc.invalidateQueries({ queryKey: ["dispensing"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispensing"
        subtitle="Manage draught taps and spirit cans with reconciliation"
        actions={
          isAdmin && (
            <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full"><Plus className="mr-1 size-4" /> New can</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add dispensing can</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Can name</Label>
                    <Input placeholder="Tap 1 — Tusker" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per unit (KES)</Label>
                    <Input type="number" placeholder="150" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Linked product (optional)</Label>
                    <Select value={addForm.product_id} onValueChange={(v) => setAddForm({ ...addForm, product_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>{(data?.products ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button onClick={() => void addUnit()}>Add can</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active cans" value={units.filter((u) => u.is_active).length} format={(n) => num(n)} icon={<Beer className="size-4" />} />
        <StatCard label="Open sessions" value={openSessions.length} format={(n) => num(n)} tone="info" index={1} />
        <StatCard label="Expected revenue" value={expected} format={money} tone="warning" index={2} />
        <StatCard label="Outstanding" value={outstanding} format={money} tone="destructive" index={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ADMIN: Can Management */}
        {isAdmin && (
          <GlassPanel className="lg:col-span-1">
            <p className="mb-4 font-semibold">Dispensing Cans</p>
            {units.length === 0 ? (
              <EmptyState title="No cans" description="Add your first dispensing can above." />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {units.map((u) => (
                  <div key={u.id} className="flex items-center gap-2 rounded-lg border border-border/60 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{money(u.price_per_unit ?? 0)}/unit</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedUnit(u); setEditForm({ name: u.name, price: String(u.price_per_unit ?? 0) }); setEditUnitOpen(true); }}>Edit</Button>
                      <Button size="sm" variant={u.is_active ? "default" : "outline"} onClick={() => void toggleUnit(u)}>
                        {u.is_active ? "Active" : "Off"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        )}

        {/* CASHIER: Open Dispensing */}
        <GlassPanel className={isAdmin ? "lg:col-span-1" : "lg:col-span-2"}>
          <p className="mb-4 font-semibold">Open Dispensing</p>
          <Dialog open={openSessionOpen} onOpenChange={setOpenSessionOpen}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-lg" variant="outline">Open can...</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Open dispensing session</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select can</Label>
                  <Select value={selectedUnit?.id ?? ""} onValueChange={(id) => setSelectedUnit(units.find((u) => u.id === id) ?? null)}>
                    <SelectTrigger><SelectValue placeholder="Choose can" /></SelectTrigger>
                    <SelectContent>{units.filter((u) => u.is_active).map((u) => <SelectItem key={u.id} value={u.id}>{u.name} — {money(u.price_per_unit ?? 0)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Opening units</Label>
                  <Input type="number" placeholder="24" value={openForm.quantity} onChange={(e) => setOpenForm({ quantity: e.target.value })} />
                  {selectedUnit && openForm.quantity && <p className="text-xs text-muted-foreground">Expected: {money(Number(openForm.quantity) * (selectedUnit.price_per_unit ?? 0))}</p>}
                </div>
              </div>
              <DialogFooter><Button onClick={() => void openSession()}>Open session</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          {openSessions.length > 0 && (
            <div className="mt-4 space-y-2 text-sm">
              {openSessions.slice(0, 5).map((s) => {
                const unit = units.find((u) => u.id === s.unit_id);
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/50 p-2 text-xs">
                    <div>
                      <p className="font-medium">{unit?.name}</p>
                      <p className="text-muted-foreground">{s.opening_quantity} units @ {money(s.expected_revenue)}</p>
                    </div>
                    <Button size="sm" onClick={() => { setSelectedSession(s); setCloseSessionOpen(true); }}>Close</Button>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>

        {/* CASHIER: Recent Sessions */}
        <GlassPanel>
          <p className="mb-4 font-semibold">Recent Sessions</p>
          {sessions.length === 0 ? (
            <EmptyState title="No sessions" description="Sessions appear here when opened." />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sessions.slice(0, 10).map((s) => {
                const unit = units.find((u) => u.id === s.unit_id);
                return (
                  <Collapsible key={s.id}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm hover:bg-accent/50">
                        <div className="text-left">
                          <p className="font-medium">{unit?.name}</p>
                          <p className="text-xs text-muted-foreground">{dateTime(s.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${s.is_closed ? "text-foreground" : "text-warning"}`}>{money(s.outstanding)}</p>
                          <ChevronDown className="size-3 ml-auto mt-1" />
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-l-2 border-border/60 ml-3 mt-1 pl-3 text-xs space-y-1">
                      <div className="flex justify-between"><span>Opened:</span> <span>{s.opening_quantity} units</span></div>
                      <div className="flex justify-between"><span>Returned:</span> <span>{s.returned_quantity} units</span></div>
                      <div className="flex justify-between"><span>Dispensed:</span> <span>{s.dispensed_quantity} units</span></div>
                      <div className="flex justify-between font-semibold"><span>Expected:</span> <span>{money(s.expected_revenue)}</span></div>
                      <div className="flex justify-between"><span>Collected:</span> <span>{money(s.collected_revenue)}</span></div>
                      {!s.is_closed && <div className="flex justify-between text-warning"><span>Outstanding:</span> <span>{money(s.outstanding)}</span></div>}
                      <div className="flex justify-between"><span>Status:</span> <span>{s.is_closed ? "Closed" : "Open"}</span></div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Close Session Dialog */}
      <Dialog open={closeSessionOpen} onOpenChange={setCloseSessionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Close dispensing session</DialogTitle></DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-semibold">{units.find((u) => u.id === selectedSession.unit_id)?.name}</p>
                <p className="text-muted-foreground">Opened with {selectedSession.opening_quantity} units</p>
                <p className="text-muted-foreground">Expected: {money(selectedSession.expected_revenue)}</p>
              </div>
              <div className="space-y-2">
                <Label>Returned units (if any)</Label>
                <Input type="number" placeholder="0" value={closeForm.returned} onChange={(e) => setCloseForm({ ...closeForm, returned: e.target.value })} />
                <p className="text-xs text-muted-foreground">Dispensed will be: {selectedSession.opening_quantity - (Number(closeForm.returned) || 0)} units</p>
              </div>
              <div className="space-y-2">
                <Label>Collected amount (KES)</Label>
                <Input type="number" placeholder="3200" value={closeForm.collected} onChange={(e) => setCloseForm({ ...closeForm, collected: e.target.value })} />
                {closeForm.collected && (
                  <p className="text-xs text-muted-foreground">
                    Outstanding: {money(selectedSession.expected_revenue - Number(closeForm.collected))}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => void closeSession()}>Close session</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={editUnitOpen} onOpenChange={setEditUnitOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit dispensing can</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Can name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Price per unit (KES)</Label>
              <Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
            </div>
          </div>
          <DialogFooter><Button onClick={() => void updateUnit()}>Update</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
