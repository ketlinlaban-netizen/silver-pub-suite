import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Star, PackagePlus, Pencil, AlertTriangle, Boxes } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
import { money } from "@/lib/format";
import { logAudit, recordStockMovement } from "@/lib/pos";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({
    meta: [
      { title: "Products & Stock — Silver Pub POS" },
      {
        name: "description",
        content:
          "Manage the bar catalogue: pricing, margins, barcodes, stock levels, low-stock alerts and stock-in receipts.",
      },
      { property: "og:title", content: "Products & Stock — Silver Pub POS" },
      {
        property: "og:description",
        content: "Full catalogue and inventory control for the bar with live stock valuation.",
      },
    ],
  }),
  component: ProductsPage,
});

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  barcode: string | null;
  sku: string | null;
  brand: string | null;
  category_id: string | null;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  is_favorite: boolean;
  status: string;
};

const blank = {
  name: "",
  barcode: "",
  sku: "",
  brand: "",
  category_id: "",
  cost_price: "",
  selling_price: "",
  stock_quantity: "",
  min_stock: "",
  max_stock: "",
  unit: "pc",
  is_favorite: false,
};

function ProductsPage() {
  const { user, isManager } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [stockFor, setStockFor] = useState<Product | null>(null);

  const { data } = useQuery({
    queryKey: ["catalogue"],
    queryFn: async () => {
      const [p, c] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("categories").select("id,name").order("sort_order"),
      ]);
      return { products: (p.data ?? []) as Product[], categories: (c.data ?? []) as Category[] };
    },
  });

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesCat = category === "all" || p.category_id === category;
        const q = search.trim().toLowerCase();
        const matchesQ =
          !q || `${p.name} ${p.brand ?? ""} ${p.sku ?? ""} ${p.barcode ?? ""}`.toLowerCase().includes(q);
        return matchesCat && matchesQ;
      }),
    [products, category, search],
  );

  const stockValue = products.reduce((s, p) => s + Number(p.cost_price) * Number(p.stock_quantity), 0);
  const lowStock = products.filter((p) => Number(p.stock_quantity) <= Number(p.min_stock));

  const toggleFavorite = async (p: Product) => {
    await supabase.from("products").update({ is_favorite: !p.is_favorite }).eq("id", p.id);
    void qc.invalidateQueries({ queryKey: ["catalogue"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Stock"
        subtitle="Catalogue, pricing, margins and live inventory levels"
        actions={
          isManager && (
            <Button
              className="rounded-xl"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" /> New product
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard index={0} label="Active products" value={products.length} format={(n) => String(Math.round(n))} icon={<Boxes className="size-5" />} />
        <StatCard index={1} label="Stock value (cost)" value={stockValue} format={money} tone="gold" />
        <StatCard
          index={2}
          label="Low stock alerts"
          value={lowStock.length}
          format={(n) => String(Math.round(n))}
          tone={lowStock.length ? "destructive" : "success"}
          icon={<AlertTriangle className="size-5" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brand, SKU or barcode"
            className="rounded-xl pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-52 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <GlassPanel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Cost</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Margin</th>
                <th className="p-4 text-right">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const margin = Number(p.selling_price) - Number(p.cost_price);
                const pct = Number(p.selling_price) > 0 ? (margin / Number(p.selling_price)) * 100 : 0;
                const low = Number(p.stock_quantity) <= Number(p.min_stock);
                return (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => void toggleFavorite(p)} aria-label="Toggle favorite">
                          <Star className={`size-4 ${p.is_favorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        </button>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.brand ? `${p.brand} · ` : ""}
                            {p.sku || p.barcode || p.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {categories.find((c) => c.id === p.category_id)?.name ?? "—"}
                    </td>
                    <td className="p-4 text-right tabular-nums">{money(p.cost_price)}</td>
                    <td className="p-4 text-right font-semibold tabular-nums">{money(p.selling_price)}</td>
                    <td className="p-4 text-right tabular-nums text-success">
                      {money(margin)} <span className="text-xs text-muted-foreground">({pct.toFixed(0)}%)</span>
                    </td>
                    <td className="p-4 text-right">
                      <Badge
                        variant="outline"
                        className={low ? "border-destructive/50 text-destructive" : "border-success/40 text-success"}
                      >
                        {Number(p.stock_quantity)} {p.unit}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setStockFor(p)}>
                          <PackagePlus className="mr-1 size-4" /> Stock in
                        </Button>
                        {isManager && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditing(p);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState title="No products found" description="Add your first product to start selling." />
        )}
      </GlassPanel>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        onDone={() => void qc.invalidateQueries({ queryKey: ["catalogue"] })}
      />

      {stockFor && (
        <StockInDialog
          product={stockFor}
          userId={user?.id ?? null}
          onClose={() => setStockFor(null)}
          onDone={() => void qc.invalidateQueries({ queryKey: ["catalogue"] })}
        />
      )}
    </div>
  );
}

function ProductForm({
  open,
  onOpenChange,
  product,
  categories,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product: Product | null;
  categories: Category[];
  onDone: () => void;
}) {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState("");

  const identity = `${product?.id ?? "new"}-${open}`;
  if (identity !== key) {
    setKey(identity);
    setForm(
      product
        ? {
            name: product.name,
            barcode: product.barcode ?? "",
            sku: product.sku ?? "",
            brand: product.brand ?? "",
            category_id: product.category_id ?? "",
            cost_price: String(product.cost_price),
            selling_price: String(product.selling_price),
            stock_quantity: String(product.stock_quantity),
            min_stock: String(product.min_stock),
            max_stock: String(product.max_stock),
            unit: product.unit,
            is_favorite: product.is_favorite,
          }
        : blank,
    );
  }

  const set = (k: keyof typeof blank, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Product name is required");
    setBusy(true);
    const payload = {
      name: form.name.trim().slice(0, 120),
      barcode: form.barcode.trim() || null,
      sku: form.sku.trim() || null,
      brand: form.brand.trim() || null,
      category_id: form.category_id || null,
      cost_price: Number(form.cost_price) || 0,
      selling_price: Number(form.selling_price) || 0,
      stock_quantity: Number(form.stock_quantity) || 0,
      min_stock: Number(form.min_stock) || 0,
      max_stock: Number(form.max_stock) || 0,
      unit: form.unit || "pc",
      is_favorite: form.is_favorite,
    };
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    await logAudit(product ? "product.updated" : "product.created", "products", product?.id, payload);
    toast.success(product ? "Product updated" : "Product created");
    onOpenChange(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>Pricing drives margin reporting, so keep cost prices accurate.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={120} />
          </Field>
          <Field label="Brand">
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} maxLength={80} />
          </Field>
          <Field label="Category">
            <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="SKU">
            <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} maxLength={40} />
          </Field>
          <Field label="Barcode">
            <Input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} maxLength={40} />
          </Field>
          <Field label="Cost price (KES)">
            <Input type="number" value={form.cost_price} onChange={(e) => set("cost_price", e.target.value)} />
          </Field>
          <Field label="Selling price (KES)">
            <Input type="number" value={form.selling_price} onChange={(e) => set("selling_price", e.target.value)} />
          </Field>
          <Field label="Stock quantity">
            <Input
              type="number"
              value={form.stock_quantity}
              onChange={(e) => set("stock_quantity", e.target.value)}
              disabled={!!product}
            />
          </Field>
          <Field label="Unit">
            <Input value={form.unit} onChange={(e) => set("unit", e.target.value)} maxLength={12} />
          </Field>
          <Field label="Minimum stock (alert)">
            <Input type="number" value={form.min_stock} onChange={(e) => set("min_stock", e.target.value)} />
          </Field>
          <Field label="Maximum stock">
            <Input type="number" value={form.max_stock} onChange={(e) => set("max_stock", e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {product ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StockInDialog({
  product,
  userId,
  onClose,
  onDone,
}: {
  product: Product;
  userId: string | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [qty, setQty] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const q = Number(qty) || 0;
    if (q === 0) return toast.error("Enter a quantity");
    setBusy(true);
    const newQty = Number(product.stock_quantity) + q;
    const { error } = await supabase.from("products").update({ stock_quantity: newQty }).eq("id", product.id);
    if (!error) {
      await recordStockMovement({
        productId: product.id,
        productName: product.name,
        type: q > 0 ? "purchase" : "adjustment",
        quantity: q,
        balanceAfter: newQty,
        userId,
        note: "Manual stock adjustment",
      });
      await logAudit("stock.adjusted", "products", product.id, { quantity: q });
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${product.name} stock is now ${newQty} ${product.unit}`);
    onClose();
    onDone();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock in — {product.name}</DialogTitle>
          <DialogDescription>
            Current stock: {Number(product.stock_quantity)} {product.unit}. Use a negative value for wastage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="h-12 text-lg" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
