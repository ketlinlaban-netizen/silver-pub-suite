import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { money, num, dateTime, displayName } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/sales")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Sales Ledger — Silver Pub POS" },
      { name: "description", content: "Every product sold with date, time, price, customer and shift totals." },
      { property: "og:title", content: "Sales Ledger — Silver Pub POS" },
      { property: "og:description", content: "Search sales by date or product and reconcile each shift." },
    ],
  }),
  component: SalesPage,
});

type SaleRef = {
  id: string;
  receipt_number: string;
  customer_name: string | null;
  cashier_name: string | null;
  tab_id: string | null;
  method: string;
  status: string;
  shift_id: string | null;
  created_at: string;
};

type Row = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
  created_at: string;
  sale: SaleRef;
};

/** Most recent Sunday 17:00 local (start of the pub week's evening trade). */
function lastSundayEvening() {
  const d = new Date();
  d.setHours(17, 0, 0, 0);
  const back = (d.getDay() + 7) % 7; // days since Sunday
  d.setDate(d.getDate() - back);
  if (d.getTime() > Date.now()) d.setDate(d.getDate() - 7);
  return d;
}

const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

function SalesPage() {
  const [from, setFrom] = useState(() => toLocalInput(lastSundayEvening()));
  const [to, setTo] = useState(() => toLocalInput(new Date(Date.now() + 60 * 60 * 1000)));
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["sales-ledger", from, to],
    queryFn: async () => {
      const fromIso = new Date(from).toISOString();
      const toIso = new Date(to).toISOString();

      const [itemsRes, shiftsRes] = await Promise.all([
        supabase
          .from("sale_items")
          .select(
            "id,product_name,quantity,unit_price,discount,line_total,created_at,sales!inner(id,receipt_number,customer_name,cashier_name,tab_id,method,status,shift_id,created_at)",
          )
          .gte("created_at", fromIso)
          .lte("created_at", toIso)
          .order("created_at", { ascending: false }),
        supabase
          .from("shifts")
          .select("id,cashier_name,opened_at,closed_at,status")
          .gte("opened_at", new Date(new Date(from).getTime() - 24 * 3600_000).toISOString())
          .order("opened_at", { ascending: false }),
      ]);

      const rows = ((itemsRes.data ?? []) as unknown as (Omit<Row, "sale"> & { sales: SaleRef })[])
        .map((r) => ({ ...r, sale: r.sales }))
        .filter((r) => r.sale && r.sale.status !== "void");

      return {
        rows: rows as Row[],
        shifts: (shiftsRes.data ?? []) as {
          id: string;
          cashier_name: string;
          opened_at: string;
          closed_at: string | null;
          status: string;
        }[],
      };
    },
  });

  const rows = data?.rows ?? [];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        r.product_name.toLowerCase().includes(term) ||
        (r.sale.customer_name ?? "").toLowerCase().includes(term) ||
        r.sale.receipt_number.toLowerCase().includes(term) ||
        displayName(r.sale.cashier_name).toLowerCase().includes(term) ||
        new Date(r.created_at).toLocaleDateString("en-KE").includes(term),
    );
  }, [rows, q]);

  const totals = useMemo(() => {
    const revenue = filtered.reduce((a, r) => a + Number(r.line_total), 0);
    const qty = filtered.reduce((a, r) => a + Number(r.quantity), 0);
    const tabRevenue = filtered.reduce((a, r) => a + (r.sale.tab_id ? Number(r.line_total) : 0), 0);
    const receipts = new Set(filtered.map((r) => r.sale.id)).size;
    return { revenue, qty, tabRevenue, receipts };
  }, [filtered]);

  // Per-shift breakdown (uses the sale header once per receipt, not per line)
  const byShift = useMemo(() => {
    const seen = new Set<string>();
    const map = new Map<
      string,
      { key: string; cashier: string; opened: string | null; receipts: number; revenue: number; tab: number }
    >();
    for (const r of filtered) {
      if (seen.has(r.sale.id)) continue;
      seen.add(r.sale.id);
      const key = r.sale.shift_id ?? "unassigned";
      const shift = data?.shifts.find((s) => s.id === key);
      const row =
        map.get(key) ??
        ({
          key,
          cashier: displayName(shift?.cashier_name ?? r.sale.cashier_name),
          opened: shift?.opened_at ?? null,
          receipts: 0,
          revenue: 0,
          tab: 0,
        } as const as {
          key: string;
          cashier: string;
          opened: string | null;
          receipts: number;
          revenue: number;
          tab: number;
        });
      row.receipts += 1;
      map.set(key, row);
    }
    // revenue per receipt from its line items
    const perSale = new Map<string, { shift: string; total: number; tab: boolean }>();
    for (const r of filtered) {
      const key = r.sale.shift_id ?? "unassigned";
      const cur = perSale.get(r.sale.id) ?? { shift: key, total: 0, tab: !!r.sale.tab_id };
      cur.total += Number(r.line_total);
      perSale.set(r.sale.id, cur);
    }
    for (const s of perSale.values()) {
      const row = map.get(s.shift);
      if (!row) continue;
      row.revenue += s.total;
      if (s.tab) row.tab += s.total;
    }
    return [...map.values()].sort((a, b) => (b.opened ?? "").localeCompare(a.opened ?? ""));
  }, [filtered, data?.shifts]);

  return (
    <div>
      <PageHeader
        title="Sales Ledger"
        subtitle="Every product sold — date, time, price, customer and shift"
        actions={
          <Button size="sm" variant="outline" className="hide-print rounded-full" onClick={() => window.print()}>
            <Printer className="mr-1 size-4" /> Print
          </Button>
        }
      />

      <GlassPanel className="hide-print mb-6">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            From
            <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1" />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            To
            <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1" />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground md:col-span-2">
            Search product, customer, receipt or cashier
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Tusker or Katelo" className="pl-9" />
            </div>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setFrom(toLocalInput(lastSundayEvening()));
              setTo(toLocalInput(new Date(Date.now() + 3600_000)));
            }}
          >
            Sunday evening → now
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              const d = new Date();
              d.setHours(0, 0, 0, 0);
              setFrom(toLocalInput(d));
              setTo(toLocalInput(new Date(Date.now() + 3600_000)));
            }}
          >
            Today
          </Button>
        </div>
      </GlassPanel>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales value" value={totals.revenue} format={money} />
        <StatCard label="Receipts" value={totals.receipts} format={(v: number) => num(v)} tone="info" index={1} />
        <StatCard label="Items sold" value={totals.qty} format={(v: number) => num(v)} tone="success" index={2} />
        <StatCard label="On running bills" value={totals.tabRevenue} format={money} tone="warning" index={3} />
      </div>

      {byShift.length > 0 && (
        <GlassPanel className="mb-6">
          <p className="mb-4 font-display text-lg font-semibold">Sales per shift</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4">Shift opened</th>
                <th className="py-2 pr-4">Cashier</th>
                <th className="py-2 pr-4 text-right">Receipts</th>
                <th className="py-2 pr-4 text-right">On bills</th>
                <th className="py-2 text-right">Sales</th>
              </tr>
            </thead>
            <tbody>
              {byShift.map((s) => (
                <tr key={s.key} className="border-b border-border/50">
                  <td className="py-2.5 pr-4">{s.opened ? dateTime(s.opened) : "Unassigned"}</td>
                  <td className="py-2.5 pr-4">{s.cashier}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{num(s.receipts)}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{money(s.tab)}</td>
                  <td className="py-2.5 text-right tabular-nums font-semibold">{money(s.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
      )}

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading sales…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No sales found" description="Adjust the date range or search term." />
      ) : (
        <GlassPanel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Date &amp; time</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4 text-right">Qty</th>
                  <th className="py-2 pr-4 text-right">Unit price</th>
                  <th className="py-2 pr-4 text-right">Line total</th>
                  <th className="py-2 pr-4">Customer / bill</th>
                  <th className="py-2 pr-4">Receipt</th>
                  <th className="py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="whitespace-nowrap py-2.5 pr-4">{dateTime(r.created_at)}</td>
                    <td className="py-2.5 pr-4 font-medium">{r.product_name}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{num(r.quantity, 2)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{money(r.unit_price)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums font-semibold">{money(r.line_total)}</td>
                    <td className="py-2.5 pr-4">
                      {r.sale.tab_id ? (
                        <span>
                          {r.sale.customer_name ?? "Bill"}{" "}
                          <Badge variant="outline" className="ml-1 border-warning/50 text-warning">
                            TAB
                          </Badge>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Walk-in</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{r.sale.receipt_number}</td>
                    <td className="py-2.5">
                      <Badge
                        variant="outline"
                        className={
                          r.sale.status === "paid" ? "border-success/50 text-success" : "border-warning/50 text-warning"
                        }
                      >
                        {r.sale.method.toUpperCase()} · {r.sale.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
