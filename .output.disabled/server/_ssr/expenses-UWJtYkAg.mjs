import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, c as startOfToday, n as dateTime, r as daysAgo } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Wallet, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-UWJtYkAg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Utilities",
	"Salaries",
	"Supplies",
	"Repairs",
	"Transport",
	"Licences",
	"Other"
];
function ExpensesPage() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		category: "Supplies",
		amount: "",
		method: "cash",
		notes: ""
	});
	const { data, isLoading } = useQuery({
		queryKey: ["expenses"],
		queryFn: async () => {
			const { data } = await supabase.from("expenses").select("*").gte("created_at", daysAgo(29).toISOString()).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const expenses = data ?? [];
	const today = startOfToday().getTime();
	const todayTotal = expenses.filter((e) => new Date(e.created_at).getTime() >= today).reduce((a, e) => a + Number(e.amount), 0);
	const monthTotal = expenses.reduce((a, e) => a + Number(e.amount), 0);
	const save = async () => {
		const amount = Number(form.amount);
		if (!form.title.trim()) return toast.error("Describe the expense");
		if (!amount || amount <= 0) return toast.error("Enter a valid amount");
		const { error } = await supabase.from("expenses").insert({
			title: form.title.trim(),
			category: form.category,
			amount,
			method: form.method,
			notes: form.notes.trim() || null,
			recorded_by: user?.id ?? null
		});
		if (error) return toast.error(error.message);
		toast.success("Expense recorded");
		setForm({
			title: "",
			category: "Supplies",
			amount: "",
			method: "cash",
			notes: ""
		});
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["expenses"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Expenses",
			subtitle: "Operating costs recorded against the bar",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " Record expense"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record expense" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "e-title",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "e-title",
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.category,
										onValueChange: (v) => setForm({
											...form,
											category: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c,
											children: c
										}, c)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Paid via" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.method,
										onValueChange: (v) => setForm({
											...form,
											method: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "cash",
												children: "Cash"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "mpesa",
												children: "M-Pesa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "credit",
												children: "Credit"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "e-amount",
									children: "Amount (KES)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "e-amount",
									type: "number",
									value: form.amount,
									onChange: (e) => setForm({
										...form,
										amount: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "e-notes",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "e-notes",
									value: form.notes,
									onChange: (e) => setForm({
										...form,
										notes: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: "Save expense"
					}) })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Today",
				value: todayTotal,
				format: money,
				tone: "warning",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Last 30 days",
				value: monthTotal,
				format: money,
				tone: "destructive",
				index: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassPanel, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading expenses…"
		}) : expenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No expenses recorded",
			description: "Log petty cash and operating costs here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Method"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Amount"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: expenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: dateTime(e.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 font-medium",
							children: e.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: e.category || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 uppercase text-muted-foreground",
							children: e.method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums",
							children: money(e.amount)
						})
					]
				}, e.id)) })]
			})
		}) })
	] });
}
//#endregion
export { ExpensesPage as component };
