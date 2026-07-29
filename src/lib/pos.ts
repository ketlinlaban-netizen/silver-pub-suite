import { supabase } from "@/integrations/supabase/client";

export type CartLine = {
  productId: string;
  name: string;
  unitPrice: number;
  costPrice: number;
  taxRate: number;
  quantity: number;
  discount: number;
  note?: string;
};

export const lineTotal = (l: CartLine) => l.unitPrice * l.quantity - l.discount;

export const cartTotals = (lines: CartLine[], extraDiscount = 0) => {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const lineDiscounts = lines.reduce((s, l) => s + l.discount, 0);
  const discount = lineDiscounts + extraDiscount;
  const cost = lines.reduce((s, l) => s + l.costPrice * l.quantity, 0);
  const tax = lines.reduce(
    (s, l) => s + ((l.unitPrice * l.quantity - l.discount) * l.taxRate) / 100,
    0,
  );
  const total = Math.max(0, subtotal - discount + tax);
  return { subtotal, discount, tax, total, cost, profit: total - tax - cost };
};

export async function logAudit(
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>,
) {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  let actorName: string | null = null;
  if (uid) {
    const { data: p } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", uid)
      .maybeSingle();
    actorName = p?.full_name ?? null;
  }
  await supabase.from("audit_logs").insert({
    actor_id: uid ?? null,
    actor_name: actorName,
    action,
    entity,
    entity_id: entityId ?? null,
    details: (details ?? null) as never,
  });
}

export async function applyStockMovement(opts: {
  productId: string;
  productName: string;
  delta: number;
  type: "receive" | "sale" | "adjustment" | "transfer" | "damaged" | "expired" | "return" | "count";
  reference?: string;
  notes?: string;
}) {
  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", opts.productId)
    .maybeSingle();
  const current = Number(product?.stock_quantity ?? 0);
  const next = opts.type === "count" ? opts.delta : current + opts.delta;

  await supabase.from("products").update({ stock_quantity: next }).eq("id", opts.productId);
  const { data: auth } = await supabase.auth.getUser();
  await supabase.from("inventory_movements").insert({
    product_id: opts.productId,
    product_name: opts.productName,
    type: opts.type,
    quantity: opts.type === "count" ? opts.delta - current : opts.delta,
    balance_after: next,
    reference: opts.reference ?? null,
    notes: opts.notes ?? null,
    created_by: auth.user?.id ?? null,
  });
  return next;
}

export type SaleInput = {
  lines: CartLine[];
  extraDiscount: number;
  method: "cash" | "mpesa" | "split" | "credit";
  cashAmount: number;
  mpesaAmount: number;
  shiftId: string | null;
  cashierId: string;
  cashierName: string;
  tabId?: string | null;
  customerName?: string | null;
  notes?: string | null;
  status?: "paid" | "open";
};

export async function createSale(input: SaleInput) {
  const t = cartTotals(input.lines, input.extraDiscount);
  const received = input.cashAmount + input.mpesaAmount;

  const { data: sale, error } = await supabase
    .from("sales")
    .insert({
      shift_id: input.shiftId,
      cashier_id: input.cashierId,
      cashier_name: input.cashierName,
      tab_id: input.tabId ?? null,
      customer_name: input.customerName ?? null,
      subtotal: t.subtotal,
      discount: t.discount,
      tax: t.tax,
      total: t.total,
      cost_total: t.cost,
      profit: t.profit,
      cash_amount: input.cashAmount,
      mpesa_amount: input.mpesaAmount,
      amount_received: received,
      change_due: Math.max(0, received - t.total),
      method: input.method,
      status: input.status ?? "paid",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  const items = input.lines.map((l) => ({
    sale_id: sale.id,
    product_id: l.productId,
    product_name: l.name,
    quantity: l.quantity,
    unit_price: l.unitPrice,
    cost_price: l.costPrice,
    discount: l.discount,
    line_total: lineTotal(l),
    note: l.note ?? null,
  }));
  const { error: itemErr } = await supabase.from("sale_items").insert(items);
  if (itemErr) throw itemErr;

  for (const l of input.lines) {
    await applyStockMovement({
      productId: l.productId,
      productName: l.name,
      delta: -l.quantity,
      type: "sale",
      reference: sale.receipt_number,
    });
  }

  await logAudit("sale.created", "sales", sale.id, {
    receipt: sale.receipt_number,
    total: t.total,
  });

  return { sale, items, totals: t };
}
