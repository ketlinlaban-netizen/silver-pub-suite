import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, n as dateTime } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as Printer, g as Search, n as Wallet, y as ReceiptText } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as useActiveShift } from "./useShift-BYBYXS5a.mjs";
import { o as logAudit, t as Badge } from "./pos-7koGGnit.mjs";
import { n as printReceipt, t as Receipt } from "./Receipt-CIBIi_WA.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-kTnrxw74.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function TabsPage() {
	const { user, profile } = useAuth();
	const { data: shift } = useActiveShift();
	const qc = useQueryClient();
	const [status, setStatus] = (0, import_react.useState)("open");
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const { data } = useQuery({
		queryKey: ["tabs", status],
		refetchInterval: 2e4,
		queryFn: async () => {
			const [tabs, settings] = await Promise.all([supabase.from("tabs").select("*").eq("status", status).order("created_at", { ascending: false }), supabase.from("business_settings").select("*").limit(1).maybeSingle()]);
			return {
				tabs: tabs.data ?? [],
				settings: settings.data
			};
		}
	});
	const tabs = (data?.tabs ?? []).filter((t) => !search.trim() ? true : `${t.customer_name} ${t.table_number ?? ""} ${t.customer_phone ?? ""}`.toLowerCase().includes(search.toLowerCase()));
	const totalOutstanding = tabs.reduce((s, t) => s + Number(t.balance), 0);
	const openStatement = async (tab) => {
		const { data: items } = await supabase.from("sale_items").select("product_name,quantity,unit_price,line_total,sale_id,sales!inner(tab_id)").eq("sales.tab_id", tab.id);
		setSelected(tab);
		setReceipt({
			business: data?.settings ?? null,
			receiptNumber: `TAB-${tab.id.slice(0, 8).toUpperCase()}`,
			date: (/* @__PURE__ */ new Date()).toISOString(),
			cashier: profile?.full_name || "Cashier",
			customer: tab.customer_name,
			tableNumber: tab.table_number,
			items: (items ?? []).map((i) => ({
				name: i.product_name,
				quantity: Number(i.quantity),
				unitPrice: Number(i.unit_price),
				total: Number(i.line_total)
			})),
			subtotal: Number(tab.total_amount),
			discount: 0,
			tax: 0,
			total: Number(tab.total_amount),
			paid: Number(tab.paid_amount),
			outstanding: Number(tab.balance),
			method: "RUNNING BILL",
			status: Number(tab.balance) <= 0 ? "PAID" : "DUE",
			copyLabel: Number(tab.balance) > 0 ? "INTERIM STATEMENT" : void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Running Bills",
				subtitle: "Long-running customer tabs with live balances and full history",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search customer or table",
						className: "w-64 rounded-xl pl-9"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 0,
						label: "Open tabs",
						value: tabs.length,
						format: (n) => String(Math.round(n)),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 1,
						label: "Outstanding balance",
						value: totalOutstanding,
						format: money,
						tone: totalOutstanding > 0 ? "destructive" : "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 2,
						label: "Billed value",
						value: tabs.reduce((s, t) => s + Number(t.total_amount), 0),
						format: money,
						tone: "info"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: status,
				onValueChange: (v) => setStatus(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "open",
					children: "Open"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "paid",
					children: "Archived / Paid"
				})] })
			}),
			tabs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No running bills",
				description: "Start a tab from the POS by choosing the Tab payment mode."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card lift flex flex-col p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-semibold",
								children: t.customer_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [t.table_number ? `Table ${t.table_number}` : "No table", t.waiter ? ` · ${t.waiter}` : ""]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: t.status === "open" ? "border-warning/50 text-warning" : "border-success/50 text-success",
								children: t.status.toUpperCase()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Billed",
									value: money(t.total_amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Paid",
									value: money(t.paid_amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-border pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Balance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-display text-lg font-bold tabular-nums ${Number(t.balance) > 0 ? "text-destructive" : "text-success"}`,
										children: money(t.balance)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[11px] text-muted-foreground",
							children: ["Opened ", dateTime(t.created_at)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "flex-1",
								onClick: () => void openStatement(t),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1 size-4" }), " Statement"]
							}), t.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "flex-1",
								onClick: () => {
									setSelected(t);
									setPayOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mr-1 size-4" }), " Pay"]
							})]
						})
					]
				}, t.id))
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				open: payOpen,
				onOpenChange: setPayOpen,
				tab: selected,
				shiftId: shift?.id ?? null,
				userId: user?.id ?? null,
				onDone: () => void qc.invalidateQueries()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!receipt,
				onOpenChange: (o) => !o && setReceipt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Customer Statement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Previous items, payments and amount due." })] }),
						receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { data: receipt }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setReceipt(null),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: printReceipt,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), " Print"]
						})] })
					]
				})
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: value
		})]
	});
}
function PaymentDialog({ open, onOpenChange, tab, shiftId, userId, onDone }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		const amt = Number(amount) || 0;
		if (amt <= 0) return toast.error("Enter a payment amount");
		setBusy(true);
		try {
			await supabase.from("tab_payments").insert({
				tab_id: tab.id,
				amount: amt,
				method,
				shift_id: shiftId,
				received_by: userId
			});
			const paid = Number(tab.paid_amount) + amt;
			const balance = Number(tab.total_amount) - paid;
			await supabase.from("tabs").update({
				paid_amount: paid,
				balance,
				status: balance <= .009 ? "paid" : "open",
				closed_at: balance <= .009 ? (/* @__PURE__ */ new Date()).toISOString() : null
			}).eq("id", tab.id);
			if (balance <= .009) await supabase.from("sales").update({ status: "paid" }).eq("tab_id", tab.id);
			await logAudit("tab.payment", "tabs", tab.id, {
				amount: amt,
				method
			});
			toast.success(balance <= .009 ? "Bill fully settled" : `Balance now ${money(balance)}`);
			onOpenChange(false);
			setAmount("");
			onDone();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Payment failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Receive Payment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				tab.customer_name,
				" · balance ",
				money(tab.balance)
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "h-12 text-lg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: method,
							onValueChange: (v) => setMethod(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cash",
								children: "Cash"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "mpesa",
								children: "M-Pesa Till"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => setAmount(String(tab.balance)),
						children: [
							"Pay full balance (",
							money(tab.balance),
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy,
				children: "Record payment"
			})] })
		] })
	});
}
//#endregion
export { TabsPage as component };
