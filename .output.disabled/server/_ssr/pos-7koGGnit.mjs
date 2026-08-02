import "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var lineTotal = (l) => l.unitPrice * l.quantity - l.discount;
var cartTotals = (lines, extraDiscount = 0) => {
	const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
	const discount = lines.reduce((s, l) => s + l.discount, 0) + extraDiscount;
	const cost = lines.reduce((s, l) => s + l.costPrice * l.quantity, 0);
	const tax = lines.reduce((s, l) => s + (l.unitPrice * l.quantity - l.discount) * l.taxRate / 100, 0);
	const total = Math.max(0, subtotal - discount + tax);
	return {
		subtotal,
		discount,
		tax,
		total,
		cost,
		profit: total - tax - cost
	};
};
async function logAudit(action, entity, entityId, details) {
	const { data } = await supabase.auth.getUser();
	const uid = data.user?.id;
	let actorName = null;
	if (uid) {
		const { data: p } = await supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle();
		actorName = p?.full_name ?? null;
	}
	await supabase.from("audit_logs").insert({
		actor_id: uid ?? null,
		actor_name: actorName,
		action,
		entity,
		entity_id: entityId ?? null,
		details: details ?? null
	});
}
async function applyStockMovement(opts) {
	const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", opts.productId).maybeSingle();
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
		created_by: auth.user?.id ?? null
	});
	return next;
}
async function createSale(input) {
	const t = cartTotals(input.lines, input.extraDiscount);
	const received = input.cashAmount + input.mpesaAmount;
	const { data: sale, error } = await supabase.from("sales").insert({
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
		notes: input.notes ?? null
	}).select("*").single();
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
		note: l.note ?? null
	}));
	const { error: itemErr } = await supabase.from("sale_items").insert(items);
	if (itemErr) throw itemErr;
	for (const l of input.lines) await applyStockMovement({
		productId: l.productId,
		productName: l.name,
		delta: -l.quantity,
		type: "sale",
		reference: sale.receipt_number
	});
	await logAudit("sale.created", "sales", sale.id, {
		receipt: sale.receipt_number,
		total: t.total
	});
	return {
		sale,
		items,
		totals: t
	};
}
//#endregion
export { lineTotal as a, createSale as i, applyStockMovement as n, logAudit as o, cartTotals as r, Badge as t };
