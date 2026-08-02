import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { requireAdmin } from "@/lib/auth-guards";
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
import { money, dateTime, startOfToday, daysAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/expenses")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Expenses — Silver Pub POS" },
      { name: "description", content: "Record and review bar operating expenses by category and shift." },
      { property: "og:title", content: "Expenses — Silver Pub POS" },
      { property: "og:description", content: "Petty cash, utilities and supplies tracked against every shift." },
    ],
  }),
  component: ExpensesPage,
});

type Expense = {
  id: string;
  title: string;
  category: string | null;
  amount: number;
  method: "cash" | "mpesa" | "split" | "credit";
  notes: string | null;
  created_at: string;
};

const CATEGORIES = ["Utilities", "Salaries", "Supplies", "Repairs", "Transport", "Licences", "Other"];

function ExpensesPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Supplies",
    amount: "",
    method: "cash" as Expense["method"],
    notes: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .gte("created_at", daysAgo(29).toISOString())
        .order("created_at", { ascending: false });
      return (data ?? []) as Expense[];
    },
  });

  const expenses = data ?? [];
  const today = startOfToday().getTime();
  const todayTotal = expenses
    .filter((e) => new Date(e.created_at).getTime() >= today)
    .reduce((a, e) => a + Number(e.amount), 0);
  const monthTotal = expenses.reduce((a, e) => a + Number(e.amount), 0);

  const save = async () => {
    const amount = Number(form.amount);
    if (!form.title.trim()) return toast.error("Describe the expense");
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    const { error } = await supabase.from("expenses").insert({
      title: form.title.trim(),
      category: form.category,
      amount,
      method: form.method,
      notes: form.notes.trim() || null,
      recorded_by: user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Expense recorded");
    setForm({ title: "", category: "Supplies", amount: "", method: "cash", notes: "" });
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["expenses"] });
  };

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Operating costs recorded against the bar"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> Record expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="e-title">Description</Label>
                  <Input
                    id="e-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Paid via</Label>
                    <Select
                      value={form.method}
                      onValueChange={(v) => setForm({ ...form, method: v as Expense["method"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-amount">Amount (KES)</Label>
                  <Input
                    id="e-amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-notes">Notes</Label>
                  <Input
                    id="e-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()}>Save expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Today" value={todayTotal} format={money} tone="warning" icon={<Wallet className="size-4" />} />
        <StatCard label="Last 30 days" value={monthTotal} format={money} tone="destructive" index={1} />
      </div>

      <GlassPanel>
        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading expenses…</p>
        ) : expenses.length === 0 ? (
          <EmptyState title="No expenses recorded" description="Log petty cash and operating costs here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-muted-foreground">{dateTime(e.created_at)}</td>
                    <td className="py-3 pr-4 font-medium">{e.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{e.category || "—"}</td>
                    <td className="py-3 pr-4 uppercase text-muted-foreground">{e.method}</td>
                    <td className="py-3 text-right tabular-nums">{money(e.amount)}</td>
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
