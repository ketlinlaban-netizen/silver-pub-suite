import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Smartphone,
  ReceiptText,
  TrendingUp,
  Boxes,
  Wallet,
  CircleDollarSign,
  Beer,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, StatCard, GlassPanel } from "@/components/ui/premium";
import { money, num, daysAgo, startOfToday, timeOnly } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Silver Pub POS" },
      {
        name: "description",
        content:
          "Live sales, profit, inventory value and cashier performance for your bar, updated in real time.",
      },
      { property: "og:title", content: "Executive Dashboard — Silver Pub POS" },
      {
        property: "og:description",
        content: "Real-time KPIs, sales trends and category performance for pub operations.",
      },
    ],
  }),
  component: Dashboard,
});

type SaleRow = {
  id: string;
  total: number;
  profit: number;
  cash_amount: number;
  mpesa_amount: number;
  cashier_name: string | null;
  created_at: string;
};

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    refetchInterval: 30_000,
    queryFn: async () => {
      const since = daysAgo(29).toISOString();
      const [sales, items, products, expenses, tabs, purchases] = await Promise.all([
        supabase
          .from("sales")
          .select("id,total,profit,cash_amount,mpesa_amount,cashier_name,created_at")
          .gte("created_at", since)
          .eq("status", "paid"),
        supabase
          .from("sale_items")
          .select("product_name,quantity,line_total,created_at")
          .gte("created_at", since),
        supabase.from("products").select("id,name,stock_quantity,cost_price,min_stock"),
        supabase.from("expenses").select("amount,created_at").gte("created_at", since),
        supabase.from("tabs").select("id,balance,status").eq("status", "open"),
        supabase.from("purchases").select("total,created_at").gte("created_at", since),
      ]);
      return {
        sales: (sales.data ?? []) as SaleRow[],
        items: (items.data ?? []) as {
          product_name: string;
          quantity: number;
          line_total: number;
          created_at: string;
        }[],
        products: (products.data ?? []) as {
          id: string;
          name: string;
          stock_quantity: number;
          cost_price: number;
          min_stock: number;
        }[],
        expenses: (expenses.data ?? []) as { amount: number; created_at: string }[],
        openTabs: (tabs.data ?? []) as { id: string; balance: number }[],
        purchases: (purchases.data ?? []) as { total: number }[],
      };
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Executive Dashboard" subtitle="Loading live business metrics…" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const today = startOfToday().getTime();
  const week = daysAgo(6).getTime();
  const inRange = (d: string, from: number) => new Date(d).getTime() >= from;

  const todaySales = data.sales.filter((s) => inRange(s.created_at, today));
  const weekSales = data.sales.filter((s) => inRange(s.created_at, week));

  const sum = (arr: number[]) => arr.reduce((a, b) => a + Number(b || 0), 0);

  const totalToday = sum(todaySales.map((s) => s.total));
  const totalWeek = sum(weekSales.map((s) => s.total));
  const totalMonth = sum(data.sales.map((s) => s.total));
  const cashToday = sum(todaySales.map((s) => s.cash_amount));
  const mpesaToday = sum(todaySales.map((s) => s.mpesa_amount));
  const grossProfit = sum(data.sales.map((s) => s.profit));
  const expensesTotal = sum(data.expenses.map((e) => e.amount));
  const netProfit = grossProfit - expensesTotal;
  const inventoryValue = sum(data.products.map((p) => p.stock_quantity * p.cost_price));
  const purchaseValue = sum(data.purchases.map((p) => p.total));
  const outstanding = sum(data.openTabs.map((t) => t.balance));

  const byDay = new Map<string, { day: string; sales: number; profit: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, {
      day: d.toLocaleDateString("en-KE", { day: "2-digit", month: "short" }),
      sales: 0,
      profit: 0,
    });
  }
  for (const s of data.sales) {
    const key = new Date(s.created_at).toISOString().slice(0, 10);
    const row = byDay.get(key);
    if (row) {
      row.sales += Number(s.total);
      row.profit += Number(s.profit);
    }
  }
  const trend = [...byDay.values()];

  const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, sales: 0 }));
  for (const s of todaySales) hourly[new Date(s.created_at).getHours()].sales += Number(s.total);

  const productMap = new Map<string, number>();
  const qtyMap = new Map<string, number>();
  for (const it of data.items) {
    productMap.set(it.product_name, (productMap.get(it.product_name) ?? 0) + Number(it.line_total));
    qtyMap.set(it.product_name, (qtyMap.get(it.product_name) ?? 0) + Number(it.quantity));
  }
  const best = [...productMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const slow = data.products
    .map((p) => ({ name: p.name, sold: qtyMap.get(p.name) ?? 0, stock: p.stock_quantity }))
    .sort((a, b) => a.sold - b.sold)
    .slice(0, 6);

  const cashierMap = new Map<string, number>();
  for (const s of data.sales)
    cashierMap.set(s.cashier_name ?? "—", (cashierMap.get(s.cashier_name ?? "—") ?? 0) + Number(s.total));
  const topCashiers = [...cashierMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const lowStock = data.products.filter((p) => p.stock_quantity <= p.min_stock);

  const pieColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--muted-foreground)",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Live performance across sales, profit, stock and cashiers"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Today's Sales" value={totalToday} format={money} icon={<CircleDollarSign className="size-5" />} hint={`${todaySales.length} receipts`} />
        <StatCard index={1} label="This Week" value={totalWeek} format={money} icon={<TrendingUp className="size-5" />} tone="info" />
        <StatCard index={2} label="Last 30 Days" value={totalMonth} format={money} icon={<TrendingUp className="size-5" />} tone="info" />
        <StatCard index={3} label="Gross Profit (30d)" value={grossProfit} format={money} icon={<TrendingUp className="size-5" />} tone="success" />
        <StatCard index={4} label="Cash Today" value={cashToday} format={money} icon={<Banknote className="size-5" />} tone="success" />
        <StatCard index={5} label="M-Pesa Today" value={mpesaToday} format={money} icon={<Smartphone className="size-5" />} tone="info" />
        <StatCard index={6} label="Outstanding Bills" value={outstanding} format={money} icon={<ReceiptText className="size-5" />} tone={outstanding > 0 ? "destructive" : "success"} hint={`${data.openTabs.length} open tabs`} />
        <StatCard index={7} label="Net Profit (30d)" value={netProfit} format={money} icon={<Wallet className="size-5" />} tone={netProfit >= 0 ? "success" : "destructive"} />
        <StatCard index={8} label="Inventory Value" value={inventoryValue} format={money} icon={<Boxes className="size-5" />} tone="warning" />
        <StatCard index={9} label="Purchases (30d)" value={purchaseValue} format={money} icon={<Boxes className="size-5" />} tone="warning" />
        <StatCard index={10} label="Expenses (30d)" value={expensesTotal} format={money} icon={<Wallet className="size-5" />} tone="destructive" />
        <StatCard index={11} label="Low Stock Items" value={lowStock.length} format={(n) => num(n)} icon={<Beer className="size-5" />} tone={lowStock.length ? "destructive" : "success"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassPanel className="xl:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Revenue &amp; Profit Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(v: number) => money(v)}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--chart-1)" fill="url(#gSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="var(--chart-2)" fill="url(#gProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="mb-4 font-display text-lg font-semibold">Best Sellers (30d)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={best} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {best.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
            {best.map((b, i) => (
              <div key={b.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 truncate">
                  <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                  {b.name}
                </span>
                <span className="tabular-nums text-muted-foreground">{money(b.value)}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassPanel className="xl:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Sales by Hour (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                  formatter={(v: number) => money(v)}
                />
                <Bar dataKey="sales" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="mb-4 font-display text-lg font-semibold">Top Cashiers (30d)</h3>
          <div className="space-y-3">
            {topCashiers.length === 0 && (
              <p className="text-sm text-muted-foreground">No sales recorded yet.</p>
            )}
            {topCashiers.map(([name, value], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm">{name}</span>
                <span className="text-sm font-semibold tabular-nums">{money(value)}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-8 font-display text-lg font-semibold">Slow Movers</h3>
          <div className="space-y-2">
            {slow.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="truncate text-muted-foreground">{s.name}</span>
                <span className="tabular-nums text-xs">{num(s.sold)} sold</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <h3 className="mb-4 font-display text-lg font-semibold">Latest Receipts</h3>
        <div className="space-y-2">
          {data.sales.slice(-8).reverse().map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">{timeOnly(s.created_at)}</span>
              <span className="truncate px-3">{s.cashier_name ?? "—"}</span>
              <span className="font-semibold tabular-nums text-primary">{money(s.total)}</span>
            </div>
          ))}
          {data.sales.length === 0 && (
            <p className="text-sm text-muted-foreground">No sales yet — open a shift and start selling.</p>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
