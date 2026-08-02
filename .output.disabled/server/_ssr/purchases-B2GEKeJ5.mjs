import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, n as dateTime, o as num } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { N as ClipboardList, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases-B2GEKeJ5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PurchasesPage() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		supplier_id: "",
		invoice_number: "",
		total: "",
		paid_amount: "",
		status: "received"
	});
	const { data, isLoading } = useQuery({
		queryKey: ["purchases"],
		queryFn: async () => {
			const [{ data: purchases }, { data: suppliers }] = await Promise.all([supabase.from("purchases").select("*").order("created_at", { ascending: false }).limit(200), supabase.from("suppliers").select("id,company_name").order("company_name")]);
			return {
				purchases: purchases ?? [],
				suppliers: suppliers ?? []
			};
		}
	});
	const purchases = data?.purchases ?? [];
	const supplierName = (id) => data?.suppliers.find((s) => s.id === id)?.company_name ?? "Unassigned";
	const spend = purchases.reduce((a, p) => a + Number(p.total), 0);
	const owed = purchases.reduce((a, p) => a + Number(p.balance), 0);
	const save = async () => {
		const total = Number(form.total);
		const paid = Number(form.paid_amount || 0);
		if (!total || total <= 0) return toast.error("Enter the invoice total");
		const balance = Math.max(0, total - paid);
		const { error } = await supabase.from("purchases").insert({
			reference: `PO-${Date.now().toString().slice(-8)}`,
			supplier_id: form.supplier_id || null,
			invoice_number: form.invoice_number.trim() || null,
			total,
			paid_amount: paid,
			balance,
			status: form.status,
			payment_status: balance === 0 ? "paid" : paid > 0 ? "partial" : "unpaid",
			created_by: user?.id ?? null
		});
		if (error) return toast.error(error.message);
		toast.success("Purchase recorded");
		setForm({
			supplier_id: "",
			invoice_number: "",
			total: "",
			paid_amount: "",
			status: "received"
		});
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["purchases"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Purchases",
			subtitle: "Deliveries, invoices and supplier payables",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " New purchase"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record purchase" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.supplier_id,
									onValueChange: (v) => setForm({
										...form,
										supplier_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose supplier" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (data?.suppliers ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.id,
										children: s.company_name
									}, s.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "p-inv",
										children: "Invoice number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "p-inv",
										value: form.invoice_number,
										onChange: (e) => setForm({
											...form,
											invoice_number: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status,
										onValueChange: (v) => setForm({
											...form,
											status: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "draft",
												children: "Draft"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "received",
												children: "Received"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "cancelled",
												children: "Cancelled"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "p-total",
										children: "Invoice total (KES)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "p-total",
										type: "number",
										value: form.total,
										onChange: (e) => setForm({
											...form,
											total: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "p-paid",
										children: "Amount paid (KES)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "p-paid",
										type: "number",
										value: form.paid_amount,
										onChange: (e) => setForm({
											...form,
											paid_amount: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Stock received per product is captured on the Products page via “Stock in”."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: "Save purchase"
					}) })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Purchase orders",
					value: purchases.length,
					format: (n) => num(n),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total spend",
					value: spend,
					format: money,
					tone: "info",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Outstanding",
					value: owed,
					format: money,
					tone: "warning",
					index: 2
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassPanel, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading purchases…"
		}) : purchases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No purchases yet",
			description: "Record supplier deliveries and invoices here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Reference"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Supplier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Invoice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4 text-right",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Balance"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: purchases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 font-medium",
							children: p.reference || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4",
							children: supplierName(p.supplier_id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: p.invoice_number || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: dateTime(p.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 capitalize text-muted-foreground",
							children: p.payment_status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-right tabular-nums",
							children: money(p.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums text-warning",
							children: money(p.balance)
						})
					]
				}, p.id)) })]
			})
		}) })
	] });
}
//#endregion
export { PurchasesPage as component };
