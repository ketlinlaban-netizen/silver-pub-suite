import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Printer, Wallet, ReceiptText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useActiveShift } from "@/hooks/useShift";
import { PageHeader, GlassPanel, StatCard, EmptyState } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { money, dateTime } from "@/lib/format";
import { logAudit } from "@/lib/pos";
import { Receipt, printReceipt, type ReceiptData } from "@/components/receipt/Receipt";

export const Route = createFileRoute("/_authenticated/tabs")({
  head: () => ({
    meta: [
      { title: "Running Bills — Silver Pub POS" },
      {
        name: "description",
        content:
          "Manage long-running customer tabs: add orders, take partial payments, print interim statements and settle bills.",
      },
      { property: "og:title", content: "Running Bills — Silver Pub POS" },
      {
        property: "og:description",
        content: "Customer tab system with running balances and complete audit history.",
      },
    ],
  }),
  component: TabsPage,
});

type TabRow = {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  table_number: string | null;
  waiter: string | null;
  status: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  created_at: string;
  closed_at: string | null;
};

function TabsPage() {
  const { user, profile } = useAuth();
  const { data: shift } = useActiveShift();
  const qc = useQueryClient();
  const [status, setStatus] = useState<"open" | "paid">("open");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TabRow | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const { data } = useQuery({
    queryKey: ["tabs", status],
    refetchInterval: 20_000,
    queryFn: async () => {
      const [tabs, settings] = await Promise.all([
        supabase.from("tabs").select("*").eq("status", status).order("created_at", { ascending: false }),
        supabase.from("business_settings").select("*").limit(1).maybeSingle(),
      ]);
      return {
        tabs: (tabs.data ?? []) as TabRow[],
        settings: settings.data as ReceiptData["business"],
      };
    },
  });

  const tabs = (data?.tabs ?? []).filter((t) =>
    !search.trim()
      ? true
      : `${t.customer_name} ${t.table_number ?? ""} ${t.customer_phone ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
  );

  const totalOutstanding = tabs.reduce((s, t) => s + Number(t.balance), 0);

  const openStatement = async (tab: TabRow) => {
    const { data: items } = await supabase
      .from("sale_items")
      .select("product_name,quantity,unit_price,line_total,sale_id,sales!inner(tab_id)")
      .eq("sales.tab_id", tab.id);

    setSelected(tab);
    setReceipt({
      business: data?.settings ?? null,
      receiptNumber: `TAB-${tab.id.slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      cashier: profile?.full_name || "Cashier",
      customer: tab.customer_name,
      tableNumber: tab.table_number,
      items: ((items ?? []) as { product_name: string; quantity: number; unit_price: number; line_total: number }[]).map(
        (i) => ({
          name: i.product_name,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unit_price),
          total: Number(i.line_total),
        }),
      ),
      subtotal: Number(tab.total_amount),
      discount: 0,
      tax: 0,
      total: Number(tab.total_amount),
      paid: Number(tab.paid_amount),
      outstanding: Number(tab.balance),
      method: "RUNNING BILL",
      status: Number(tab.balance) <= 0 ? "PAID" : "DUE",
      copyLabel: Number(tab.balance) > 0 ? "INTERIM STATEMENT" : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Running Bills"
        subtitle="Long-running customer tabs with live balances and full history"
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer or table"
              className="w-64 rounded-xl pl-9"
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard index={0} label="Open tabs" value={tabs.length} format={(n) => String(Math.round(n))} icon={<ReceiptText className="size-5" />} />
        <StatCard index={1} label="Outstanding balance" value={totalOutstanding} format={money} tone={totalOutstanding > 0 ? "destructive" : "success"} />
        <StatCard index={2} label="Billed value" value={tabs.reduce((s, t) => s + Number(t.total_amount), 0)} format={money} tone="info" />
      </div>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="paid">Archived / Paid</TabsTrigger>
        </TabsList>
      </Tabs>

      {tabs.length === 0 ? (
        <EmptyState
          title="No running bills"
          description="Start a tab from the POS by choosing the Tab payment mode."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tabs.map((t) => (
            <div key={t.id} className="glass-card lift flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">{t.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.table_number ? `Table ${t.table_number}` : "No table"}
                    {t.waiter ? ` · ${t.waiter}` : ""}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={t.status === "open" ? "border-warning/50 text-warning" : "border-success/50 text-success"}
                >
                  {t.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <Row label="Billed" value={money(t.total_amount)} />
                <Row label="Paid" value={money(t.paid_amount)} />
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Balance</span>
                  <span className={`font-display text-lg font-bold tabular-nums ${Number(t.balance) > 0 ? "text-destructive" : "text-success"}`}>
                    {money(t.balance)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">Opened {dateTime(t.created_at)}</p>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => void openStatement(t)}>
                  <Printer className="mr-1 size-4" /> Statement
                </Button>
                {t.status === "open" && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelected(t);
                      setPayOpen(true);
                    }}
                  >
                    <Wallet className="mr-1 size-4" /> Pay
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <PaymentDialog
          open={payOpen}
          onOpenChange={setPayOpen}
          tab={selected}
          shiftId={shift?.id ?? null}
          userId={user?.id ?? null}
          onDone={() => void qc.invalidateQueries()}
        />
      )}

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Customer Statement</DialogTitle>
            <DialogDescription>Previous items, payments and amount due.</DialogDescription>
          </DialogHeader>
          {receipt && <Receipt data={receipt} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)}>
              Close
            </Button>
            <Button onClick={printReceipt}>
              <Printer className="mr-2 size-4" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PaymentDialog({
  open,
  onOpenChange,
  tab,
  shiftId,
  userId,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tab: TabRow;
  shiftId: string | null;
  userId: string | null;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "mpesa">("cash");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const amt = Number(amount) || 0;
    if (amt <= 0) return toast.error("Enter a payment amount");
    setBusy(true);
    try {
      await supabase.from("tab_payments").insert({
        tab_id: tab.id,
        amount: amt,
        method,
        shift_id: shiftId,
        received_by: userId,
      });
      const paid = Number(tab.paid_amount) + amt;
      const balance = Number(tab.total_amount) - paid;
      await supabase
        .from("tabs")
        .update({
          paid_amount: paid,
          balance,
          status: balance <= 0.009 ? "paid" : "open",
          closed_at: balance <= 0.009 ? new Date().toISOString() : null,
        })
        .eq("id", tab.id);

      if (balance <= 0.009) {
        await supabase.from("sales").update({ status: "paid" }).eq("tab_id", tab.id);
      }

      await logAudit("tab.payment", "tabs", tab.id, { amount: amt, method });
      toast.success(balance <= 0.009 ? "Bill fully settled" : `Balance now ${money(balance)}`);
      onOpenChange(false);
      setAmount("");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive Payment</DialogTitle>
          <DialogDescription>
            {tab.customer_name} · balance {money(tab.balance)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-12 text-lg" />
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as "cash" | "mpesa")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mpesa">M-Pesa Till</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setAmount(String(tab.balance))}>
            Pay full balance ({money(tab.balance)})
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            Record payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
