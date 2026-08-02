import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, n as dateTime, o as num, r as daysAgo } from "./format-CUq4cxR5.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { H as Boxes, o as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-BdXxmn35.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["inventory"],
		refetchInterval: 6e4,
		queryFn: async () => {
			const [{ data: products }, { data: movements }] = await Promise.all([supabase.from("products").select("id,name,unit,stock_quantity,min_stock,cost_price,selling_price").order("name"), supabase.from("inventory_movements").select("id,product_name,type,quantity,balance_after,reference,created_at").gte("created_at", daysAgo(13).toISOString()).order("created_at", { ascending: false }).limit(200)]);
			return {
				products: products ?? [],
				movements: movements ?? []
			};
		}
	});
	const products = data?.products ?? [];
	const value = products.reduce((a, p) => a + Number(p.stock_quantity) * Number(p.cost_price), 0);
	const retail = products.reduce((a, p) => a + Number(p.stock_quantity) * Number(p.selling_price), 0);
	const low = products.filter((p) => Number(p.stock_quantity) <= Number(p.min_stock));
	const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Inventory",
			subtitle: "Stock on hand, valuation and movement history"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Stock value (cost)",
					value,
					format: money,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Retail value",
					value: retail,
					format: money,
					tone: "success",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "SKUs",
					value: products.length,
					format: (n) => num(n),
					tone: "info",
					index: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Low stock",
					value: low.length,
					format: (n) => num(n),
					tone: "destructive",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
					index: 3
				})
			]
		}),
		low.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
			className: "mb-6 border-destructive/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm font-semibold text-destructive",
				children: "Reorder alerts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: low.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full border border-destructive/40 px-3 py-1 text-xs",
					children: [
						p.name,
						" — ",
						num(p.stock_quantity, 1),
						" ",
						p.unit || "pcs"
					]
				}, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold",
					children: "Stock on hand"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search product",
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "max-w-[200px]"
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "Loading stock…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No products",
				description: "Add products to start tracking stock."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[520px] overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-card/80 backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4 text-right",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right",
									children: "Value"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 text-right tabular-nums " + (Number(p.stock_quantity) <= Number(p.min_stock) ? "text-destructive" : ""),
								children: num(p.stock_quantity, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 text-right tabular-nums text-muted-foreground",
								children: money(Number(p.stock_quantity) * Number(p.cost_price))
							})
						]
					}, p.id)) })]
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 font-display text-lg font-semibold",
				children: "Recent movements"
			}), (data?.movements.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No movements yet",
				description: "Stock receipts and sales will appear here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[520px] overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-card/80 backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right",
									children: "Qty"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.movements.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 text-muted-foreground",
								children: dateTime(m.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4",
								children: m.product_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 capitalize text-muted-foreground",
								children: m.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 text-right tabular-nums " + (Number(m.quantity) < 0 ? "text-destructive" : "text-success"),
								children: num(m.quantity, 1)
							})
						]
					}, m.id)) })]
				})
			})] })]
		})
	] });
}
//#endregion
export { InventoryPage as component };
