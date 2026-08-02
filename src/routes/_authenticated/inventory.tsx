import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Boxes, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Input } from "@/components/ui/input";
import { money, num, dateTime, daysAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/inventory")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Inventory — Silver Pub POS" },
      { name: "description", content: "Live stock levels, valuation and every inventory movement in the bar." },
      { property: "og:title", content: "Inventory — Silver Pub POS" },
      { property: "og:description", content: "Track receipts, sales, adjustments and low-stock alerts." },
    ],
  }),
  component: InventoryPage,
});

type Product = {
  id: string;
  name: string;
  unit: string | null;
  stock_quantity: number;
  min_stock: number;
  cost_price: number;
  selling_price: number;
};

type Movement = {
  id: string;
  product_name: string;
  type: string;
  quantity: number;
  balance_after: number;
  reference: string | null;
  created_at: string;
};

function InventoryPage() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    refetchInterval: 60_000,
    queryFn: async () => {
      const [{ data: products }, { data: movements }] = await Promise.all([
        supabase.from("products").select("id,name,unit,stock_quantity,min_stock,cost_price,selling_price").order("name"),
        supabase
          .from("inventory_movements")
          .select("id,product_name,type,quantity,balance_after,reference,created_at")
          .gte("created_at", daysAgo(13).toISOString())
          .order("created_at", { ascending: false }),
      ]);
      return {
        products: (products ?? []) as Product[],
        movements: (movements ?? []) as Movement[],
      };
    },
  });

  const products = data?.products ?? [];
  const value = products.reduce((a, p) => a + Number(p.stock_quantity) * Number(p.cost_price), 0);
  const retail = products.reduce((a, p) => a + Number(p.stock_quantity) * Number(p.selling_price), 0);
  const low = products.filter((p) => Number(p.stock_quantity) <= Number(p.min_stock));
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock on hand, valuation and movement history" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stock value (cost)" value={value} format={money} icon={<Boxes className="size-4" />} />
        <StatCard label="Retail value" value={retail} format={money} tone="success" index={1} />
        <StatCard label="SKUs" value={products.length} format={(n) => num(n)} tone="info" index={2} />
        <StatCard
          label="Low stock"
          value={low.length}
          format={(n) => num(n)}
          tone="destructive"
          icon={<TriangleAlert className="size-4" />}
          index={3}
        />
      </div>

      {low.length > 0 && (
        <GlassPanel className="mb-6 border-destructive/30">
          <p className="mb-3 text-sm font-semibold text-destructive">Reorder alerts</p>
          <div className="flex flex-wrap gap-2">
            {low.map((p) => (
              <span key={p.id} className="rounded-full border border-destructive/40 px-3 py-1 text-xs">
                {p.name} — {num(p.stock_quantity, 1)} {p.unit || "pcs"}
              </span>
            ))}
          </div>
        </GlassPanel>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold">Stock on hand</p>
            <Input
              placeholder="Search product"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-[200px]"
            />
          </div>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Loading stock…</p>
          ) : filtered.length === 0 ? (
            <EmptyState title="No products" description="Add products to start tracking stock." />
          ) : (
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card/80 backdrop-blur">
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4 text-right">Qty</th>
                    <th className="py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="py-2.5 pr-4">{p.name}</td>
                      <td
                        className={
                          "py-2.5 pr-4 text-right tabular-nums " +
                          (Number(p.stock_quantity) <= Number(p.min_stock) ? "text-destructive" : "")
                        }
                      >
                        {num(p.stock_quantity, 1)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                        {money(Number(p.stock_quantity) * Number(p.cost_price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>

        <GlassPanel>
          <p className="mb-4 font-display text-lg font-semibold">Recent movements</p>
          {(data?.movements.length ?? 0) === 0 ? (
            <EmptyState title="No movements yet" description="Stock receipts and sales will appear here." />
          ) : (
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card/80 backdrop-blur">
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">When</th>
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {data!.movements.map((m) => (
                    <tr key={m.id} className="border-b border-border/50">
                      <td className="py-2.5 pr-4 text-muted-foreground">{dateTime(m.created_at)}</td>
                      <td className="py-2.5 pr-4">{m.product_name}</td>
                      <td className="py-2.5 pr-4 capitalize text-muted-foreground">{m.type}</td>
                      <td
                        className={
                          "py-2.5 text-right tabular-nums " +
                          (Number(m.quantity) < 0 ? "text-destructive" : "text-success")
                        }
                      >
                        {num(m.quantity, 1)}
                      </td>
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
