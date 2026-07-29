import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { money, num, shortDate, daysAgo, displayName } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Silver Pub POS" },
      { name: "description", content: "Sales, profit, product and cashier reports for any period." },
      { property: "og:title", content: "Reports — Silver Pub POS" },
      { property: "og:description", content: "Analyse revenue, margins and staff performance across the bar." },
    ],
  }),
  component: ReportsPage,
});

type Sale = {
  total: number;
  profit: number;
  cash_amount: number;
  mpesa_amount: number;
  cashier_name: string | null;
  created_at: string;
};

const RANGES = [
  { label: "7 days", days: 6 },
  { label: "30 days", days: 29 },
  { label: "90 days", days: 89 },
];

function ReportsPage() {
  const [range, setRange] = useState(29);

  const { data, isLoading } = useQuery({
    queryKey: ["reports", range],
    queryFn: async () => {
      const since = daysAgo(range).toISOString();
      const [{ data: sales }, { data: items }, { data: expenses }] = await Promise.all([
        supabase
          .from("sales")
          .select("total,profit,cash_amount,mpesa_amount,cashier_name,created_at")
          .gte("created_at", since)
          .eq("status", "paid"),
        supabase
          .from("sale_items")
          .select("product_name,quantity,line_total")
          .gte("created_at", since),
        supabase.from("expenses").select("amount").gte("created_at", since),
      ]);
      return {
        sales: (sales ?? []) as Sale[],
        items: (items ?? []) as { product_name: string; quantity: number; line_total: number }[],
        expenses: (expenses ?? []) as { amount: number }[],
      };
    },
  });

  const sales = data?.sales ?? [];
  const revenue = sales.reduce((a, s) => a + Number(s.total), 0);
  const profit = sales.reduce((a, s) => a + Number(s.profit), 0);
  const cash = sales.reduce((a, s) => a + Number(s.cash_amount), 0);
  const mpesa = sales.reduce((a, s) => a + Number(s.mpesa_amount), 0);
  const expenses = (data?.expenses ?? []).reduce((a, e) => a + Number(e.amount), 0);

  const byDay = new Map<string, { day: string; revenue: number; profit: number }>();
  for (let i = range; i >= 0; i--) {
    const d = daysAgo(i);
    byDay.set(d.toDateString(), { day: shortDate(d), revenue: 0, profit: 0 });
  }
  for (const s of sales) {
    const key = new Date(s.created_at).toDateString();
    const row = byDay.get(key);
    if (row) {
      row.revenue += Number(s.total);
      row.profit += Number(s.profit);
    }
  }

  const byProduct = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const it of data?.items ?? []) {
    const row = byProduct.get(it.product_name) ?? { name: it.product_name, qty: 0, revenue: 0 };
    row.qty += Number(it.quantity);
    row.revenue += Number(it.line_total);
    byProduct.set(it.product_name, row);
  }
  const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const byCashier = new Map<string, { name: string; revenue: number; count: number }>();
  for (const s of sales) {
    const name = displayName(s.cashier_name);
    const row = byCashier.get(name) ?? { name, revenue: 0, count: 0 };
    row.revenue += Number(s.total);
    row.count += 1;
    byCashier.set(name, row);
  }
  const cashiers = [...byCashier.values()].sort((a, b) => b.revenue - a.revenue);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Revenue, margin and performance analytics"
        actions={
          <div className="hide-print flex items-center gap-2">
            {RANGES.map((r) => (
              <Button
                key={r.days}
                size="sm"
                variant={range === r.days ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setRange(r.days)}
              >
                {r.label}
              </Button>
            ))}
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => window.print()}>
              <Printer className="mr-1 size-4" /> Print
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Revenue" value={revenue} format={money} icon={<BarChart3 className="size-4" />} />
        <StatCard label="Gross profit" value={profit} format={money} tone="success" index={1} />
        <StatCard label="Expenses" value={expenses} format={money} tone="destructive" index={2} />
        <StatCard label="Cash collected" value={cash} format={money} tone="info" index={3} />
        <StatCard label="M-Pesa collected" value={mpesa} format={money} tone="warning" index={4} />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Building reports…</p>
      ) : sales.length === 0 ? (
        <EmptyState title="No sales in this period" description="Reports populate as the bar rings up sales." />
      ) : (
        <div className="space-y-6">
          <GlassPanel>
            <p className="mb-4 font-display text-lg font-semibold">Revenue vs profit</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...byDay.values()]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="currentColor" />
                  <YAxis tick={{ fontSize: 11 }} stroke="currentColor" />
                  <Tooltip
                    formatter={(v: number) => money(v)}
                    contentStyle={{ background: "hsl(0 0% 8%)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <div className="grid gap-6 xl:grid-cols-2">
            <GlassPanel>
              <p className="mb-4 font-display text-lg font-semibold">Top products</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} stroke="currentColor" />
                    <Tooltip
                      formatter={(v: number) => money(v)}
                      contentStyle={{ background: "hsl(0 0% 8%)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <p className="mb-4 font-display text-lg font-semibold">Cashier performance</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">Cashier</th>
                    <th className="py-2 pr-4 text-right">Receipts</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {cashiers.map((c) => (
                    <tr key={c.name} className="border-b border-border/50">
                      <td className="py-2.5 pr-4">{c.name}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{num(c.count)}</td>
                      <td className="py-2.5 text-right tabular-nums">{money(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassPanel>
          </div>
        </div>
      )}
    </div>
  );
}
