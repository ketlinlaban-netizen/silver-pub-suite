import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Clock3, CheckCircle2, XCircle, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useActiveShift } from "@/hooks/useShift";
import { PageHeader, GlassPanel, StatCard, EmptyState } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { money, dateTime } from "@/lib/format";
import { logAudit } from "@/lib/pos";

export const Route = createFileRoute("/_authenticated/shifts")({
  head: () => ({
    meta: [
      { title: "Shift Management — Silver Pub POS" },
      {
        name: "description",
        content:
          "Open and close cashier shifts with cash and M-Pesa floats, variance calculation and manager approval.",
      },
      { property: "og:title", content: "Shift Management — Silver Pub POS" },
      {
        property: "og:description",
        content: "Full cashier accountability: floats, expected cash, variance and approvals.",
      },
    ],
  }),
  component: ShiftsPage,
});

type ShiftRow = {
  id: string;
  cashier_id: string;
  cashier_name: string;
  opened_at: string;
  closed_at: string | null;
  opening_cash: number;
  opening_mpesa: number;
  closing_cash_counted: number | null;
  expected_cash: number | null;
  variance: number | null;
  cash_sales: number;
  mpesa_sales: number;
  refunds: number;
  expenses_total: number;
  dispensing_balance: number;
  outstanding_bills: number;
  total_sales: number;
  status: string;
  notes: string | null;
};

function ShiftsPage() {
  const { user, profile, isManager } = useAuth();
  const qc = useQueryClient();
  const { data: active } = useActiveShift();
  const [openDialog, setOpenDialog] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  const { data: shifts } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("shifts")
        .select("*")
        .order("opened_at", { ascending: false })
        .limit(50);
      return (data ?? []) as ShiftRow[];
    },
  });

  const approve = async (id: string, approved: boolean) => {
    await supabase
      .from("shifts")
      .update({ status: approved ? "approved" : "rejected", approved_by: user?.id })
      .eq("id", id);
    await logAudit(approved ? "shift.approved" : "shift.rejected", "shifts", id);
    toast.success(approved ? "Shift approved" : "Shift rejected");
    void qc.invalidateQueries();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Management"
        subtitle="Cashiers must open a shift before selling. Closing reconciles every till movement."
        actions={
          active ? (
            <Button onClick={() => setCloseDialog(true)} variant="destructive" className="rounded-xl">
              Close current shift
            </Button>
          ) : (
            <Button onClick={() => setOpenDialog(true)} className="rounded-xl">
              <PlayCircle className="mr-2 size-4" /> Open shift
            </Button>
          )
        }
      />

      {active && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard index={0} label="Shift status" value={1} format={() => "OPEN"} icon={<Clock3 className="size-5" />} tone="success" hint={dateTime(active.opened_at)} />
          <StatCard index={1} label="Opening cash" value={Number(active.opening_cash)} format={money} />
          <StatCard index={2} label="Opening M-Pesa float" value={Number(active.opening_mpesa)} format={money} tone="info" />
          <StatCard index={3} label="Cashier" value={0} format={() => active.cashier_name} tone="gold" />
        </div>
      )}

      <GlassPanel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Cashier</th>
                <th className="p-4">Opened</th>
                <th className="p-4">Closed</th>
                <th className="p-4 text-right">Total sales</th>
                <th className="p-4 text-right">Expected cash</th>
                <th className="p-4 text-right">Counted</th>
                <th className="p-4 text-right">Variance</th>
                <th className="p-4">Status</th>
                {isManager && <th className="p-4 text-right">Approval</th>}
              </tr>
            </thead>
            <tbody>
              {(shifts ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4 font-medium">{s.cashier_name}</td>
                  <td className="p-4 text-muted-foreground">{dateTime(s.opened_at)}</td>
                  <td className="p-4 text-muted-foreground">{s.closed_at ? dateTime(s.closed_at) : "—"}</td>
                  <td className="p-4 text-right tabular-nums">{money(s.total_sales)}</td>
                  <td className="p-4 text-right tabular-nums">{s.expected_cash != null ? money(s.expected_cash) : "—"}</td>
                  <td className="p-4 text-right tabular-nums">{s.closing_cash_counted != null ? money(s.closing_cash_counted) : "—"}</td>
                  <td
                    className={`p-4 text-right font-semibold tabular-nums ${
                      (s.variance ?? 0) < 0 ? "text-destructive" : (s.variance ?? 0) > 0 ? "text-warning" : ""
                    }`}
                  >
                    {s.variance != null ? money(s.variance) : "—"}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={
                        s.status === "open"
                          ? "border-success/50 text-success"
                          : s.status === "approved"
                            ? "border-primary/50 text-primary"
                            : s.status === "rejected"
                              ? "border-destructive/50 text-destructive"
                              : "border-warning/50 text-warning"
                      }
                    >
                      {s.status.replace("_", " ")}
                    </Badge>
                  </td>
                  {isManager && (
                    <td className="p-4 text-right">
                      {s.status === "pending_approval" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => approve(s.id, true)}>
                            <CheckCircle2 className="mr-1 size-4 text-success" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => approve(s.id, false)}>
                            <XCircle className="mr-1 size-4 text-destructive" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(shifts ?? []).length === 0 && (
          <EmptyState title="No shifts yet" description="Open your first shift to begin trading." />
        )}
      </GlassPanel>

      <OpenShiftDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        cashierId={user?.id ?? ""}
        cashierName={profile?.full_name || profile?.email || "Cashier"}
        onDone={() => void qc.invalidateQueries()}
      />
      {active && (
        <CloseShiftDialog
          open={closeDialog}
          onOpenChange={setCloseDialog}
          shiftId={active.id}
          openingCash={Number(active.opening_cash)}
          openingMpesa={Number(active.opening_mpesa)}
          onDone={() => void qc.invalidateQueries()}
        />
      )}
    </div>
  );
}

function OpenShiftDialog({
  open,
  onOpenChange,
  cashierId,
  cashierName,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cashierId: string;
  cashierName: string;
  onDone: () => void;
}) {
  const [cash, setCash] = useState("");
  const [mpesa, setMpesa] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.from("shifts").insert({
      cashier_id: cashierId,
      cashier_name: cashierName,
      opening_cash: Number(cash) || 0,
      opening_mpesa: Number(mpesa) || 0,
      notes: notes.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    await logAudit("shift.opened", "shifts");
    toast.success("Shift opened — you can now sell");
    onOpenChange(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Shift</DialogTitle>
          <DialogDescription>
            {cashierName} · {new Date().toLocaleString("en-KE")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Opening cash (KES)</Label>
            <Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>Opening M-Pesa float (KES)</Label>
            <Input type="number" value={mpesa} onChange={(e) => setMpesa(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={300} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            Open shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CloseShiftDialog({
  open,
  onOpenChange,
  shiftId,
  openingCash,
  openingMpesa,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  shiftId: string;
  openingCash: number;
  openingMpesa: number;
  onDone: () => void;
}) {
  const [counted, setCounted] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: summary } = useQuery({
    queryKey: ["shift-summary", shiftId, open],
    enabled: open,
    queryFn: async () => {
      const [sales, expenses, disp, tabs] = await Promise.all([
        supabase.from("sales").select("total,cash_amount,mpesa_amount,status").eq("shift_id", shiftId),
        supabase.from("expenses").select("amount").eq("shift_id", shiftId),
        supabase.from("dispensing_sessions").select("outstanding").eq("shift_id", shiftId),
        supabase.from("tabs").select("balance").eq("shift_id", shiftId).eq("status", "open"),
      ]);
      const s = (sales.data ?? []) as { total: number; cash_amount: number; mpesa_amount: number; status: string }[];
      const sum = (n: number[]) => n.reduce((a, b) => a + Number(b || 0), 0);
      return {
        cashSales: sum(s.map((x) => x.cash_amount)),
        mpesaSales: sum(s.map((x) => x.mpesa_amount)),
        totalSales: sum(s.filter((x) => x.status !== "void").map((x) => x.total)),
        refunds: sum(s.filter((x) => x.status === "refunded").map((x) => x.total)),
        expenses: sum(((expenses.data ?? []) as { amount: number }[]).map((x) => x.amount)),
        dispensing: sum(((disp.data ?? []) as { outstanding: number }[]).map((x) => x.outstanding)),
        outstanding: sum(((tabs.data ?? []) as { balance: number }[]).map((x) => x.balance)),
      };
    },
  });

  const expected = summary ? openingCash + summary.cashSales - summary.expenses - summary.refunds : 0;
  const variance = (Number(counted) || 0) - expected;

  const submit = async () => {
    if (!summary) return;
    setBusy(true);
    const { error } = await supabase
      .from("shifts")
      .update({
        closed_at: new Date().toISOString(),
        closing_cash_counted: Number(counted) || 0,
        expected_cash: expected,
        variance,
        cash_sales: summary.cashSales,
        mpesa_sales: summary.mpesaSales,
        refunds: summary.refunds,
        expenses_total: summary.expenses,
        dispensing_balance: summary.dispensing,
        outstanding_bills: summary.outstanding,
        total_sales: summary.totalSales,
        status: "pending_approval",
      })
      .eq("id", shiftId);
    setBusy(false);
    if (error) return toast.error(error.message);
    await logAudit("shift.closed", "shifts", shiftId, { variance });
    toast.success("Shift submitted for manager approval");
    onOpenChange(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Close Shift</DialogTitle>
          <DialogDescription>Reconcile the till before handing over.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 rounded-xl bg-secondary/40 p-4 text-sm">
          <Line label="Opening cash" value={money(openingCash)} />
          <Line label="Opening M-Pesa float" value={money(openingMpesa)} />
          <Line label="Cash sales" value={money(summary?.cashSales ?? 0)} />
          <Line label="M-Pesa sales" value={money(summary?.mpesaSales ?? 0)} />
          <Line label="Refunds" value={money(summary?.refunds ?? 0)} />
          <Line label="Expenses" value={money(summary?.expenses ?? 0)} />
          <Line label="Dispensing balance" value={money(summary?.dispensing ?? 0)} danger={(summary?.dispensing ?? 0) > 0} />
          <Line label="Outstanding bills" value={money(summary?.outstanding ?? 0)} danger={(summary?.outstanding ?? 0) > 0} />
          <Line label="Total sales" value={money(summary?.totalSales ?? 0)} />
          <div className="mt-2 border-t border-border pt-2">
            <Line label="Expected cash in drawer" value={money(expected)} bold />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Actual cash counted</Label>
          <Input type="number" value={counted} onChange={(e) => setCounted(e.target.value)} className="h-12 text-lg" />
          <p className={`text-sm font-semibold ${variance < 0 ? "text-destructive" : variance > 0 ? "text-warning" : "text-success"}`}>
            Variance: {money(variance)}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !summary}>
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Line({
  label,
  value,
  bold,
  danger,
}: {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-primary" : ""} ${danger ? "text-destructive" : ""}`}>
        {value}
      </span>
    </div>
  );
}
