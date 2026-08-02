import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { a as money, i as displayName, o as num, r as daysAgo, s as shortDate } from "./format-CUq4cxR5.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { V as ChartColumn, b as Printer } from "../_libs/lucide-react.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-CyxRnBf2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RANGES = [
	{
		label: "7 days",
		days: 6
	},
	{
		label: "30 days",
		days: 29
	},
	{
		label: "90 days",
		days: 89
	}
];
function ReportsPage() {
	const [range, setRange] = (0, import_react.useState)(29);
	const { data, isLoading } = useQuery({
		queryKey: ["reports", range],
		queryFn: async () => {
			const since = daysAgo(range).toISOString();
			const [{ data: sales }, { data: items }, { data: expenses }] = await Promise.all([
				supabase.from("sales").select("total,profit,cash_amount,mpesa_amount,cashier_name,created_at").gte("created_at", since).eq("status", "paid"),
				supabase.from("sale_items").select("product_name,quantity,line_total").gte("created_at", since),
				supabase.from("expenses").select("amount").gte("created_at", since)
			]);
			return {
				sales: sales ?? [],
				items: items ?? [],
				expenses: expenses ?? []
			};
		}
	});
	const sales = data?.sales ?? [];
	const revenue = sales.reduce((a, s) => a + Number(s.total), 0);
	const profit = sales.reduce((a, s) => a + Number(s.profit), 0);
	const cash = sales.reduce((a, s) => a + Number(s.cash_amount), 0);
	const mpesa = sales.reduce((a, s) => a + Number(s.mpesa_amount), 0);
	const expenses = (data?.expenses ?? []).reduce((a, e) => a + Number(e.amount), 0);
	const byDay = /* @__PURE__ */ new Map();
	for (let i = range; i >= 0; i--) {
		const d = daysAgo(i);
		byDay.set(d.toDateString(), {
			day: shortDate(d),
			revenue: 0,
			profit: 0
		});
	}
	for (const s of sales) {
		const key = new Date(s.created_at).toDateString();
		const row = byDay.get(key);
		if (row) {
			row.revenue += Number(s.total);
			row.profit += Number(s.profit);
		}
	}
	const byProduct = /* @__PURE__ */ new Map();
	for (const it of data?.items ?? []) {
		const row = byProduct.get(it.product_name) ?? {
			name: it.product_name,
			qty: 0,
			revenue: 0
		};
		row.qty += Number(it.quantity);
		row.revenue += Number(it.line_total);
		byProduct.set(it.product_name, row);
	}
	const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
	const byCashier = /* @__PURE__ */ new Map();
	for (const s of sales) {
		const name = displayName(s.cashier_name);
		const row = byCashier.get(name) ?? {
			name,
			revenue: 0,
			count: 0
		};
		row.revenue += Number(s.total);
		row.count += 1;
		byCashier.set(name, row);
	}
	const cashiers = [...byCashier.values()].sort((a, b) => b.revenue - a.revenue);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			subtitle: "Revenue, margin and performance analytics",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hide-print flex items-center gap-2",
				children: [RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: range === r.days ? "default" : "outline",
					className: "rounded-full",
					onClick: () => setRange(r.days),
					children: r.label
				}, r.days)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					className: "rounded-full",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1 size-4" }), " Print"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Revenue",
					value: revenue,
					format: money,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Gross profit",
					value: profit,
					format: money,
					tone: "success",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Expenses",
					value: expenses,
					format: money,
					tone: "destructive",
					index: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Cash collected",
					value: cash,
					format: money,
					tone: "info",
					index: 3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "M-Pesa collected",
					value: mpesa,
					format: money,
					tone: "warning",
					index: 4
				})
			]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Building reports…"
		}) : sales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No sales in this period",
			description: "Reports populate as the bar rings up sales."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 font-display text-lg font-semibold",
				children: "Revenue vs profit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: [...byDay.values()],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "rgba(255,255,255,0.06)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tick: { fontSize: 11 },
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (v) => money(v),
								contentStyle: {
									background: "hsl(0 0% 8%)",
									border: "1px solid rgba(255,255,255,0.1)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "revenue",
								stroke: "var(--color-primary)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "profit",
								stroke: "var(--color-success)",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Top products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: topProducts,
							layout: "vertical",
							margin: { left: 20 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 11 },
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									width: 110,
									tick: { fontSize: 11 },
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => money(v),
									contentStyle: {
										background: "hsl(0 0% 8%)",
										border: "1px solid rgba(255,255,255,0.1)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revenue",
									fill: "var(--color-primary)",
									radius: [
										0,
										6,
										6,
										0
									]
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Cashier performance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Cashier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4 text-right",
								children: "Receipts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 text-right",
								children: "Revenue"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: cashiers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 text-right tabular-nums",
								children: num(c.count)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 text-right tabular-nums",
								children: money(c.revenue)
							})
						]
					}, c.name)) })]
				})] })]
			})]
		})
	] });
}
//#endregion
export { ReportsPage as component };
