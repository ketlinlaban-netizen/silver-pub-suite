import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, ClipboardList } from "lucide-react";
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
import { money, dateTime, num } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases — Silver Pub POS" },
      { name: "description", content: "Purchase orders and supplier invoices with payment status." },
      { property: "og:title", content: "Purchases — Silver Pub POS" },
      { property: "og:description", content: "Record deliveries, invoices and outstanding supplier balances." },
    ],
  }),
  component: PurchasesPage,
});

type Purchase = {
  id: string;
  reference: string | null;
  supplier_id: string | null;
  invoice_number: string | null;
  total: number;
  paid_amount: number;
  balance: number;
  status: "draft" | "received" | "cancelled";
  payment_status: "unpaid" | "partial" | "paid";
  created_at: string;
};

function PurchasesPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    supplier_id: "",
    invoice_number: "",
    total: "",
    paid_amount: "",
    status: "received" as Purchase["status"],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const [{ data: purchases }, { data: suppliers }] = await Promise.all([
        supabase.from("purchases").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("suppliers").select("id,company_name").order("company_name"),
      ]);
      return {
        purchases: (purchases ?? []) as Purchase[],
        suppliers: (suppliers ?? []) as { id: string; company_name: string }[],
      };
    },
  });

  const purchases = data?.purchases ?? [];
  const supplierName = (id: string | null) =>
    data?.suppliers.find((s) => s.id === id)?.company_name ?? "Unassigned";
  const spend = purchases.reduce((a, p) => a + Number(p.total), 0);
  const owed = purchases.reduce((a, p) => a + Number(p.balance), 0);

  const save = async () => {
    const total = Number(form.total);
    const paid = Number(form.paid_amount || 0);
    if (!total || total <= 0) return toast.error("Enter the invoice total");
    const balance = Math.max(0, total - paid);
    const { error } = await supabase.from("purchases").insert({
      reference: `PO-${Date.now().toString().slice(-8)}`,
      supplier_id: form.supplier_id || null,
      invoice_number: form.invoice_number.trim() || null,
      total,
      paid_amount: paid,
      balance,
      status: form.status,
      payment_status: balance === 0 ? "paid" : paid > 0 ? "partial" : "unpaid",
      created_by: user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Purchase recorded");
    setForm({ supplier_id: "", invoice_number: "", total: "", paid_amount: "", status: "received" });
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["purchases"] });
  };

  return (
    <div>
      <PageHeader
        title="Purchases"
        subtitle="Deliveries, invoices and supplier payables"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> New purchase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record purchase</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select value={form.supplier_id} onValueChange={(v) => setForm({ ...form, supplier_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {(data?.suppliers ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-inv">Invoice number</Label>
                    <Input
                      id="p-inv"
                      value={form.invoice_number}
                      onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v as Purchase["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-total">Invoice total (KES)</Label>
                    <Input
                      id="p-total"
                      type="number"
                      value={form.total}
                      onChange={(e) => setForm({ ...form, total: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-paid">Amount paid (KES)</Label>
                    <Input
                      id="p-paid"
                      type="number"
                      value={form.paid_amount}
                      onChange={(e) => setForm({ ...form, paid_amount: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stock received per product is captured on the Products page via “Stock in”.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()}>Save purchase</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Purchase orders" value={purchases.length} format={(n) => num(n)} icon={<ClipboardList className="size-4" />} />
        <StatCard label="Total spend" value={spend} format={money} tone="info" index={1} />
        <StatCard label="Outstanding" value={owed} format={money} tone="warning" index={2} />
      </div>

      <GlassPanel>
        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading purchases…</p>
        ) : purchases.length === 0 ? (
          <EmptyState title="No purchases yet" description="Record supplier deliveries and invoices here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Supplier</th>
                  <th className="py-2 pr-4">Invoice</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Payment</th>
                  <th className="py-2 pr-4 text-right">Total</th>
                  <th className="py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium">{p.reference || "—"}</td>
                    <td className="py-3 pr-4">{supplierName(p.supplier_id)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.invoice_number || "—"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{dateTime(p.created_at)}</td>
                    <td className="py-3 pr-4 capitalize text-muted-foreground">{p.payment_status}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{money(p.total)}</td>
                    <td className="py-3 text-right tabular-nums text-warning">{money(p.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
