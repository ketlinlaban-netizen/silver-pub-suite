import { t as supabase } from "./client-DalDhuxz.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader } from "./premium-D4AjSDM1.mjs";
import { a as money, c as startOfToday, i as displayName, l as timeOnly, o as num, r as daysAgo } from "./format-CUq4cxR5.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { G as Banknote, H as Boxes, I as CircleDollarSign, U as Beer, f as Smartphone, n as Wallet, s as TrendingUp, y as ReceiptText } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Eg-6Gr3k.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		refetchInterval: 3e4,
		queryFn: async () => {
			const since = daysAgo(29).toISOString();
			const [sales, items, products, expenses, tabs, purchases] = await Promise.all([
				supabase.from("sales").select("id,total,profit,cash_amount,mpesa_amount,cashier_name,created_at").gte("created_at", since).eq("status", "paid"),
				supabase.from("sale_items").select("product_name,quantity,line_total,created_at").gte("created_at", since),
				supabase.from("products").select("id,name,stock_quantity,cost_price,min_stock"),
				supabase.from("expenses").select("amount,created_at").gte("created_at", since),
				supabase.from("tabs").select("id,balance,status").eq("status", "open"),
				supabase.from("purchases").select("total,created_at").gte("created_at", since)
			]);
			return {
				sales: sales.data ?? [],
				items: items.data ?? [],
				products: products.data ?? [],
				expenses: expenses.data ?? [],
				openTabs: tabs.data ?? [],
				purchases: purchases.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Executive Dashboard",
				subtitle: "Loading live business metrics…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-2xl" })
		]
	});
	const today = startOfToday().getTime();
	const week = daysAgo(6).getTime();
	const inRange = (d, from) => new Date(d).getTime() >= from;
	const todaySales = data.sales.filter((s) => inRange(s.created_at, today));
	const weekSales = data.sales.filter((s) => inRange(s.created_at, week));
	const sum = (arr) => arr.reduce((a, b) => a + Number(b || 0), 0);
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
	const byDay = /* @__PURE__ */ new Map();
	for (let i = 29; i >= 0; i--) {
		const d = daysAgo(i);
		const key = d.toISOString().slice(0, 10);
		byDay.set(key, {
			day: d.toLocaleDateString("en-KE", {
				day: "2-digit",
				month: "short"
			}),
			sales: 0,
			profit: 0
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
	const hourly = Array.from({ length: 24 }, (_, h) => ({
		hour: `${h}:00`,
		sales: 0
	}));
	for (const s of todaySales) hourly[new Date(s.created_at).getHours()].sales += Number(s.total);
	const productMap = /* @__PURE__ */ new Map();
	const qtyMap = /* @__PURE__ */ new Map();
	for (const it of data.items) {
		productMap.set(it.product_name, (productMap.get(it.product_name) ?? 0) + Number(it.line_total));
		qtyMap.set(it.product_name, (qtyMap.get(it.product_name) ?? 0) + Number(it.quantity));
	}
	const best = [...productMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({
		name,
		value
	}));
	const slow = data.products.map((p) => ({
		name: p.name,
		sold: qtyMap.get(p.name) ?? 0,
		stock: p.stock_quantity
	})).sort((a, b) => a.sold - b.sold).slice(0, 6);
	const cashierMap = /* @__PURE__ */ new Map();
	for (const s of data.sales) cashierMap.set(displayName(s.cashier_name), (cashierMap.get(displayName(s.cashier_name)) ?? 0) + Number(s.total));
	const topCashiers = [...cashierMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const lowStock = data.products.filter((p) => p.stock_quantity <= p.min_stock);
	const pieColors = [
		"var(--chart-1)",
		"var(--chart-2)",
		"var(--chart-3)",
		"var(--chart-4)",
		"var(--chart-5)",
		"var(--muted-foreground)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Executive Dashboard",
				subtitle: "Live performance across sales, profit, stock and cashiers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 0,
						label: "Today's Sales",
						value: totalToday,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollarSign, { className: "size-5" }),
						hint: `${todaySales.length} receipts`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 1,
						label: "This Week",
						value: totalWeek,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" }),
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 2,
						label: "Last 30 Days",
						value: totalMonth,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" }),
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 3,
						label: "Gross Profit (30d)",
						value: grossProfit,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" }),
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 4,
						label: "Cash Today",
						value: cashToday,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-5" }),
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 5,
						label: "M-Pesa Today",
						value: mpesaToday,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5" }),
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 6,
						label: "Outstanding Bills",
						value: outstanding,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "size-5" }),
						tone: outstanding > 0 ? "destructive" : "success",
						hint: `${data.openTabs.length} open tabs`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 7,
						label: "Net Profit (30d)",
						value: netProfit,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" }),
						tone: netProfit >= 0 ? "success" : "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 8,
						label: "Inventory Value",
						value: inventoryValue,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-5" }),
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 9,
						label: "Purchases (30d)",
						value: purchaseValue,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-5" }),
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 10,
						label: "Expenses (30d)",
						value: expensesTotal,
						format: money,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" }),
						tone: "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 11,
						label: "Low Stock Items",
						value: lowStock.length,
						format: (n) => num(n),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beer, { className: "size-5" }),
						tone: lowStock.length ? "destructive" : "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-display text-lg font-semibold",
						children: "Revenue & Profit Trend"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gSales",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--chart-1)",
											stopOpacity: .55
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--chart-1)",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gProfit",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--chart-2)",
											stopOpacity: .45
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--chart-2)",
											stopOpacity: 0
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										stroke: "var(--muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										interval: 4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										width: 60
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: 12,
											color: "var(--popover-foreground)"
										},
										formatter: (v) => money(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "sales",
										stroke: "var(--chart-1)",
										fill: "url(#gSales)",
										strokeWidth: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "profit",
										stroke: "var(--chart-2)",
										fill: "url(#gProfit)",
										strokeWidth: 2
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-display text-lg font-semibold",
						children: "Best Sellers (30d)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: best,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 55,
								outerRadius: 95,
								paddingAngle: 3,
								children: best.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: pieColors[i % pieColors.length],
									stroke: "transparent"
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--popover)",
									border: "1px solid var(--border)",
									borderRadius: 12
								},
								formatter: (v) => money(v)
							})] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: best.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2 rounded-full",
									style: { background: pieColors[i % pieColors.length] }
								}), b.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted-foreground",
								children: money(b.value)
							})]
						}, b.name))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-display text-lg font-semibold",
						children: "Sales by Hour (Today)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: hourly,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "hour",
										stroke: "var(--muted-foreground)",
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										interval: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										width: 60
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--accent)" },
										contentStyle: {
											background: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: 12
										},
										formatter: (v) => money(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										fill: "var(--chart-1)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-display text-lg font-semibold",
						children: "Top Cashiers (30d)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [topCashiers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No sales recorded yet."
						}), topCashiers.map(([name, value], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-8 place-items-center rounded-full border border-primary/40 text-xs font-semibold text-primary",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate text-sm",
									children: name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(value)
								})
							]
						}, name))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 mt-8 font-display text-lg font-semibold",
						children: "Slow Movers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: slow.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-muted-foreground",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-xs",
								children: [num(s.sold), " sold"]
							})]
						}, s.name))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 font-display text-lg font-semibold",
				children: "Latest Receipts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [data.sales.slice(-8).reverse().map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: timeOnly(s.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate px-3",
							children: displayName(s.cashier_name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tabular-nums text-primary",
							children: money(s.total)
						})
					]
				}, s.id)), data.sales.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No sales yet — open a shift and start selling."
				})]
			})] })
		]
	});
}
//#endregion
export { Dashboard as component };
