import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { money, dateTime, num } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Silver Pub POS" },
      { name: "description", content: "Customer directory with running bill balances for the pub." },
      { property: "og:title", content: "Customers — Silver Pub POS" },
      { property: "og:description", content: "Manage regulars, contacts and outstanding tab balances." },
    ],
  }),
  component: CustomersPage,
});

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

function CustomersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const [{ data: customers }, { data: tabs }] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("tabs").select("customer_id,balance,status"),
      ]);
      const balances = new Map<string, number>();
      for (const t of (tabs ?? []) as { customer_id: string | null; balance: number; status: string }[]) {
        if (t.status !== "open" || !t.customer_id) continue;
        balances.set(t.customer_id, (balances.get(t.customer_id) ?? 0) + Number(t.balance ?? 0));
      }
      return { customers: (customers ?? []) as Customer[], balances };
    },
  });

  const customers = data?.customers ?? [];
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      (c.phone ?? "").toLowerCase().includes(q.toLowerCase()),
  );
  const outstanding = [...(data?.balances.values() ?? [])].reduce((a, b) => a + b, 0);

  const save = async () => {
    if (!form.name.trim()) return toast.error("Customer name is required");
    setSaving(true);
    const { error } = await supabase.from("customers").insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Customer added");
    setForm({ name: "", phone: "", email: "", notes: "" });
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["customers"] });
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Regulars, contacts and outstanding running bills"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> New customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input
                    id="c-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="c-phone">Phone</Label>
                    <Input
                      id="c-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-email">Email</Label>
                    <Input
                      id="c-email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-notes">Notes</Label>
                  <Textarea
                    id="c-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()} disabled={saving}>
                  Save customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Customers" value={customers.length} format={(n) => num(n)} icon={<Users className="size-4" />} />
        <StatCard
          label="Outstanding bills"
          value={outstanding}
          format={money}
          tone="warning"
          index={1}
        />
      </div>

      <GlassPanel>
        <div className="mb-4 flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading customers…</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="No customers yet" description="Add your regulars to track running bills." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Added</th>
                  <th className="py-2 text-right">Open balance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium">{c.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.phone || "—"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.email || "—"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{dateTime(c.created_at)}</td>
                    <td className="py-3 text-right tabular-nums text-warning">
                      {money(data?.balances.get(c.id) ?? 0)}
                    </td>
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
