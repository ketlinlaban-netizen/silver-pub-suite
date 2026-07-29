import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Star,
  Barcode,
  CreditCard,
  Banknote,
  Smartphone,
  Split,
  ReceiptText,
  Printer,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useActiveShift } from "@/hooks/useShift";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cartTotals, createSale, lineTotal, type CartLine } from "@/lib/pos";
import { money } from "@/lib/format";
import { Receipt, printReceipt, type ReceiptData } from "@/components/receipt/Receipt";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/pos")({
  head: () => ({
    meta: [
      { title: "Cashier POS — Silver Pub" },
      {
        name: "description",
        content:
          "Touch-optimised bar checkout: instant search, favourites, split payment, running tabs and automatic receipts.",
      },
      { property: "og:title", content: "Cashier POS — Silver Pub" },
      {
        property: "og:description",
        content: "Complete a bar sale in seconds with cash, M-Pesa or split payment.",
      },
    ],
  }),
  component: POSPage,
});

type Product = {
  id: string;
  name: string;
  image_url: string | null;
  barcode: string | null;
  sku: string | null;
  category_id: string | null;
  cost_price: number;
  selling_price: number;
  tax_rate: number;
  stock_quantity: number;
  is_favorite: boolean;
  status: string;
};

function POSPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const { data: shift, isLoading: shiftLoading } = useActiveShift();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pos-data"],
    queryFn: async () => {
      const [products, categories, tabs, settings] = await Promise.all([
        supabase.from("products").select("*").eq("status", "active").order("name"),
        supabase.from("categories").select("id,name").order("sort_order"),
        supabase.from("tabs").select("id,customer_name,balance,table_number").eq("status", "open"),
        supabase.from("business_settings").select("*").limit(1).maybeSingle(),
      ]);
      return {
        products: (products.data ?? []) as Product[],
        categories: (categories.data ?? []) as { id: string; name: string }[],
        tabs: (tabs.data ?? []) as {
          id: string;
          customer_name: string;
          balance: number;
          table_number: string | null;
        }[],
        settings: settings.data as ReceiptData["business"],
      };
    },
  });

  const filtered = useMemo(() => {
    const list = data?.products ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((p) => {
      const matchCat = category === "all" || p.category_id === category;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        (p.barcode ?? "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [data, search, category]);

  const totals = cartTotals(lines, extraDiscount);

  const addProduct = (p: Product) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          unitPrice: Number(p.selling_price),
          costPrice: Number(p.cost_price),
          taxRate: Number(p.tax_rate),
          quantity: 1,
          discount: 0,
        },
      ];
    });
  };

  const onBarcodeEnter = (value: string) => {
    const hit = (data?.products ?? []).find(
      (p) => p.barcode === value.trim() || p.sku === value.trim(),
    );
    if (hit) {
      addProduct(hit);
      setSearch("");
      toast.success(`${hit.name} added`);
    }
  };

  const setQty = (id: string, delta: number) =>
    setLines((prev) =>
      prev
        .map((l) => (l.productId === id ? { ...l, quantity: Math.max(0, l.quantity + delta) } : l))
        .filter((l) => l.quantity > 0),
    );

  const clearCart = () => {
    setLines([]);
    setExtraDiscount(0);
  };

  if (shiftLoading || isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <Skeleton className="h-[70vh] rounded-2xl" />
        <Skeleton className="h-[70vh] rounded-2xl" />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="glass-card mx-auto mt-10 max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-destructive/40 text-destructive">
          <Lock className="size-6" />
        </div>
        <h2 className="font-display text-2xl font-semibold">No open shift</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You cannot sell until you open a shift with your opening cash float and M-Pesa float.
        </p>
        <Link to="/shifts">
          <Button className="mt-6 rounded-xl">Open a shift</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <section className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onBarcodeEnter(search);
                }}
                placeholder="Search or scan barcode…"
                className="h-12 rounded-xl pl-9 text-base"
              />
            </div>
            <Badge variant="outline" className="h-9 gap-2 rounded-full px-3">
              <Barcode className="size-4" /> Scanner ready
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <CatChip active={category === "all"} onClick={() => setCategory("all")} label="All" />
            <CatChip
              active={category === "fav"}
              onClick={() => setCategory("fav")}
              label="★ Favourites"
            />
            {(data?.categories ?? []).map((c) => (
              <CatChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
                label={c.name}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {(category === "fav" ? filtered.filter((p) => p.is_favorite) : filtered).map((p) => (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => addProduct(p)}
              className="glass-card lift group overflow-hidden p-0 text-left"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/60">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid size-full place-items-center font-display text-3xl text-muted-foreground/40">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {p.is_favorite && (
                  <Star className="absolute right-2 top-2 size-4 fill-primary text-primary" />
                )}
                {p.stock_quantity <= 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-destructive/80 py-1 text-center text-[10px] font-bold uppercase tracking-wider">
                    Out of stock
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{money(p.selling_price)}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {Number(p.stock_quantity)} left
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="glass-card col-span-full grid place-items-center p-12 text-center text-sm text-muted-foreground">
              No products match. Add products under Products.
            </div>
          )}
        </div>
      </section>

      <aside className="glass-card sticky top-20 flex h-fit max-h-[calc(100vh-6rem)] flex-col p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Current Order</h2>
          <Button variant="ghost" size="sm" onClick={clearCart} disabled={!lines.length}>
            <Trash2 className="mr-1 size-4" /> Clear
          </Button>
        </div>

        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div
                key={l.productId}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="rounded-xl bg-secondary/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{l.name}</p>
                  <p className="text-sm font-bold tabular-nums text-primary">
                    {money(lineTotal(l))}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button size="icon" variant="outline" className="size-8 rounded-lg" onClick={() => setQty(l.productId, -1)}>
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                  <Button size="icon" variant="outline" className="size-8 rounded-lg" onClick={() => setQty(l.productId, 1)}>
                    <Plus className="size-3.5" />
                  </Button>
                  <span className="ml-auto text-xs text-muted-foreground">@ {money(l.unitPrice)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {lines.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Tap products to build the order.
            </p>
          )}
        </div>

        <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
          <Row label="Subtotal" value={money(totals.subtotal)} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Discount</span>
            <Input
              type="number"
              min={0}
              value={extraDiscount || ""}
              onChange={(e) => setExtraDiscount(Math.max(0, Number(e.target.value) || 0))}
              className="h-8 w-28 rounded-lg text-right"
              placeholder="0"
            />
          </div>
          <Row label="Tax" value={money(totals.tax)} />
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-base font-semibold">Total</span>
            <span className="font-display text-2xl font-bold text-primary tabular-nums">
              {money(totals.total)}
            </span>
          </div>
          <Button
            className="mt-2 h-14 w-full rounded-xl text-base font-semibold"
            disabled={!lines.length}
            onClick={() => setCheckoutOpen(true)}
          >
            <CreditCard className="mr-2 size-5" /> Charge {money(totals.total)}
          </Button>
        </div>
      </aside>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        totals={totals}
        lines={lines}
        tabs={data?.tabs ?? []}
        settings={data?.settings ?? null}
        cashierId={user?.id ?? ""}
        cashierName={profile?.full_name ?? profile?.email ?? "Cashier"}
        shiftId={shift.id}
        onDone={(r) => {
          setReceipt(r);
          clearCart();
          setCheckoutOpen(false);
          void qc.invalidateQueries();
        }}
      />

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
            <DialogDescription>Sale completed successfully.</DialogDescription>
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

function CatChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function CheckoutDialog({
  open,
  onOpenChange,
  totals,
  lines,
  tabs,
  settings,
  cashierId,
  cashierName,
  shiftId,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  totals: ReturnType<typeof cartTotals>;
  lines: CartLine[];
  tabs: { id: string; customer_name: string; balance: number; table_number: string | null }[];
  settings: ReceiptData["business"];
  cashierId: string;
  cashierName: string;
  shiftId: string;
  onDone: (r: ReceiptData) => void;
}) {
  const [mode, setMode] = useState<"cash" | "mpesa" | "split" | "tab">("cash");
  const [cash, setCash] = useState("");
  const [mpesa, setMpesa] = useState("");
  const [tabId, setTabId] = useState<string>("");
  const [newTabName, setNewTabName] = useState("");
  const [tabPhone, setTabPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [waiter, setWaiter] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const cashAmt = Number(cash) || 0;
  const mpesaAmt = Number(mpesa) || 0;

  const submit = async () => {
    setBusy(true);
    try {
      if (mode === "tab") {
        let targetTab = tabId;
        if (!targetTab) {
          const name = newTabName.trim();
          if (!name) {
            toast.error("Customer name is required for a running bill");
            setBusy(false);
            return;
          }
          const { data: created, error } = await supabase
            .from("tabs")
            .insert({
              customer_name: name,
              customer_phone: tabPhone.trim() || null,
              table_number: tableNumber.trim() || null,
              waiter: waiter.trim() || null,
              opened_by: cashierId,
              shift_id: shiftId,
            })
            .select("id")
            .single();
          if (error) throw error;
          targetTab = created.id;
        }

        const { data: tabRow } = await supabase
          .from("tabs")
          .select("*")
          .eq("id", targetTab)
          .single();

        const prevBalance = Number(tabRow?.balance ?? 0);

        const { sale } = await createSale({
          lines,
          extraDiscount: totals.discount - lines.reduce((s, l) => s + l.discount, 0),
          method: "credit",
          cashAmount: 0,
          mpesaAmount: 0,
          shiftId,
          cashierId,
          cashierName,
          tabId: targetTab,
          customerName: tabRow?.customer_name ?? null,
          notes,
          status: "open",
        });

        const newTotal = Number(tabRow?.total_amount ?? 0) + totals.total;
        await supabase
          .from("tabs")
          .update({
            total_amount: newTotal,
            balance: newTotal - Number(tabRow?.paid_amount ?? 0),
          })
          .eq("id", targetTab);

        onDone({
          business: settings,
          receiptNumber: sale.receipt_number,
          date: sale.created_at,
          cashier: cashierName,
          customer: tabRow?.customer_name,
          tableNumber: tabRow?.table_number,
          items: lines.map((l) => ({
            name: l.name,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            total: lineTotal(l),
          })),
          subtotal: totals.subtotal,
          discount: totals.discount,
          tax: totals.tax,
          total: totals.total,
          previousBalance: prevBalance,
          outstanding: newTotal - Number(tabRow?.paid_amount ?? 0),
          method: "RUNNING BILL",
          status: "DUE",
        });
        toast.success("Added to running bill");
        return;
      }

      const c = mode === "cash" ? totals.total : mode === "split" ? cashAmt : 0;
      const m = mode === "mpesa" ? totals.total : mode === "split" ? mpesaAmt : 0;
      if (mode === "split" && c + m < totals.total - 0.01) {
        toast.error("Split payment does not cover the total");
        setBusy(false);
        return;
      }

      const { sale } = await createSale({
        lines,
        extraDiscount: totals.discount - lines.reduce((s, l) => s + l.discount, 0),
        method: mode,
        cashAmount: mode === "cash" ? Math.max(cashAmt, totals.total) : c,
        mpesaAmount: m,
        shiftId,
        cashierId,
        cashierName,
        notes,
      });

      onDone({
        business: settings,
        receiptNumber: sale.receipt_number,
        date: sale.created_at,
        cashier: cashierName,
        items: lines.map((l) => ({
          name: l.name,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          total: lineTotal(l),
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        amountReceived: Number(sale.amount_received),
        changeDue: Number(sale.change_due),
        method: mode,
        status: "PAID",
      });
      toast.success("Payment recorded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Amount due <span className="font-semibold text-primary">{money(totals.total)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2">
          <ModeBtn active={mode === "cash"} onClick={() => setMode("cash")} icon={<Banknote className="size-4" />} label="Cash" />
          <ModeBtn active={mode === "mpesa"} onClick={() => setMode("mpesa")} icon={<Smartphone className="size-4" />} label="M-Pesa" />
          <ModeBtn active={mode === "split"} onClick={() => setMode("split")} icon={<Split className="size-4" />} label="Split" />
          <ModeBtn active={mode === "tab"} onClick={() => setMode("tab")} icon={<ReceiptText className="size-4" />} label="Tab" />
        </div>

        {mode === "cash" && (
          <div className="space-y-2">
            <Label>Cash received</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder={String(totals.total)}
              className="h-12 text-lg"
            />
            {cashAmt > totals.total && (
              <p className="text-sm text-success">Change: {money(cashAmt - totals.total)}</p>
            )}
          </div>
        )}

        {mode === "mpesa" && (
          <p className="rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
            Customer pays <span className="font-semibold text-foreground">{money(totals.total)}</span>{" "}
            to the till. Confirm the M-Pesa message before completing.
          </p>
        )}

        {mode === "split" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Cash</Label>
              <Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>M-Pesa</Label>
              <Input type="number" value={mpesa} onChange={(e) => setMpesa(e.target.value)} className="h-12" />
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">
              Covered: {money(cashAmt + mpesaAmt)} of {money(totals.total)}
            </p>
          </div>
        )}

        {mode === "tab" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Add to existing bill</Label>
              <Select value={tabId} onValueChange={setTabId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an open tab (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.customer_name}
                      {t.table_number ? ` · T${t.table_number}` : ""} — {money(t.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!tabId && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Customer name *</Label>
                  <Input value={newTabName} onChange={(e) => setNewTabName(e.target.value)} maxLength={80} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={tabPhone} onChange={(e) => setTabPhone(e.target.value)} maxLength={20} />
                </div>
                <div className="space-y-2">
                  <Label>Table</Label>
                  <Input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} maxLength={10} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Waiter</Label>
                  <Input value={waiter} onChange={(e) => setWaiter(e.target.value)} maxLength={60} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Order note</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={2} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy} className="min-w-40">
            {busy ? "Processing…" : mode === "tab" ? "Add to bill" : `Complete ${money(totals.total)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-all",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
