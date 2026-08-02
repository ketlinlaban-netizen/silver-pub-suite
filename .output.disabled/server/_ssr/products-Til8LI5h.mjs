import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as Boxes, S as Pencil, g as Search, o as TriangleAlert, u as Star, w as PackagePlus, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as applyStockMovement, o as logAudit, t as Badge } from "./pos-7koGGnit.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-Til8LI5h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = {
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
	is_favorite: false
};
function ProductsPage() {
	const { user, isManager } = useAuth();
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [stockFor, setStockFor] = (0, import_react.useState)(null);
	const { data } = useQuery({
		queryKey: ["catalogue"],
		queryFn: async () => {
			const [p, c] = await Promise.all([supabase.from("products").select("*").order("name"), supabase.from("categories").select("id,name").order("sort_order")]);
			return {
				products: p.data ?? [],
				categories: c.data ?? []
			};
		}
	});
	const products = data?.products ?? [];
	const categories = data?.categories ?? [];
	const filtered = (0, import_react.useMemo)(() => products.filter((p) => {
		const matchesCat = category === "all" || p.category_id === category;
		const q = search.trim().toLowerCase();
		const matchesQ = !q || `${p.name} ${p.brand ?? ""} ${p.sku ?? ""} ${p.barcode ?? ""}`.toLowerCase().includes(q);
		return matchesCat && matchesQ;
	}), [
		products,
		category,
		search
	]);
	const stockValue = products.reduce((s, p) => s + Number(p.cost_price) * Number(p.stock_quantity), 0);
	const lowStock = products.filter((p) => Number(p.stock_quantity) <= Number(p.min_stock));
	const toggleFavorite = async (p) => {
		await supabase.from("products").update({ is_favorite: !p.is_favorite }).eq("id", p.id);
		qc.invalidateQueries({ queryKey: ["catalogue"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Products & Stock",
				subtitle: "Catalogue, pricing, margins and live inventory levels",
				actions: isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-xl",
					onClick: () => {
						setEditing(null);
						setFormOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), " New product"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 0,
						label: "Active products",
						value: products.length,
						format: (n) => String(Math.round(n)),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 1,
						label: "Stock value (cost)",
						value: stockValue,
						format: money,
						tone: "gold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 2,
						label: "Low stock alerts",
						value: lowStock.length,
						format: (n) => String(Math.round(n)),
						tone: lowStock.length ? "destructive" : "success",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search name, brand, SKU or barcode",
						className: "rounded-xl pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: category,
					onValueChange: setCategory,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-52 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All categories"
					}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.id,
						children: c.name
					}, c.id))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[980px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Margin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((p) => {
							const margin = Number(p.selling_price) - Number(p.cost_price);
							const pct = Number(p.selling_price) > 0 ? margin / Number(p.selling_price) * 100 : 0;
							const low = Number(p.stock_quantity) <= Number(p.min_stock);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => void toggleFavorite(p),
												"aria-label": "Toggle favorite",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${p.is_favorite ? "fill-primary text-primary" : "text-muted-foreground"}` })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [p.brand ? `${p.brand} · ` : "", p.sku || p.barcode || p.unit]
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-muted-foreground",
										children: categories.find((c) => c.id === p.category_id)?.name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-right tabular-nums",
										children: money(p.cost_price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-right font-semibold tabular-nums",
										children: money(p.selling_price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4 text-right tabular-nums text-success",
										children: [
											money(margin),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"(",
													pct.toFixed(0),
													"%)"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: low ? "border-destructive/50 text-destructive" : "border-success/40 text-success",
											children: [
												Number(p.stock_quantity),
												" ",
												p.unit
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setStockFor(p),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "mr-1 size-4" }), " Stock in"]
											}), isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setEditing(p);
													setFormOpen(true);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
											})]
										})
									})
								]
							}, p.id);
						}) })]
					})
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No products found",
					description: "Add your first product to start selling."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				open: formOpen,
				onOpenChange: setFormOpen,
				product: editing,
				categories,
				onDone: () => void qc.invalidateQueries({ queryKey: ["catalogue"] })
			}),
			stockFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockInDialog, {
				product: stockFor,
				userId: user?.id ?? null,
				onClose: () => setStockFor(null),
				onDone: () => void qc.invalidateQueries({ queryKey: ["catalogue"] })
			})
		]
	});
}
function ProductForm({ open, onOpenChange, product, categories, onDone }) {
	const [form, setForm] = (0, import_react.useState)(blank);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [key, setKey] = (0, import_react.useState)("");
	const identity = `${product?.id ?? "new"}-${open}`;
	if (identity !== key) {
		setKey(identity);
		setForm(product ? {
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
			is_favorite: product.is_favorite
		} : blank);
	}
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
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
			is_favorite: form.is_favorite
		};
		const { error } = product ? await supabase.from("products").update(payload).eq("id", product.id) : await supabase.from("products").insert(payload);
		setBusy(false);
		if (error) return toast.error(error.message);
		await logAudit(product ? "product.updated" : "product.created", "products", product?.id, payload);
		toast.success(product ? "Product updated" : "Product created");
		onOpenChange(false);
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-2xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: product ? "Edit product" : "New product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Pricing drives margin reporting, so keep cost prices accurate." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (e) => set("name", e.target.value),
								maxLength: 120
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.brand,
								onChange: (e) => set("brand", e.target.value),
								maxLength: 80
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.category_id,
								onValueChange: (v) => set("category_id", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select category" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "SKU",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.sku,
								onChange: (e) => set("sku", e.target.value),
								maxLength: 40
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Barcode",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.barcode,
								onChange: (e) => set("barcode", e.target.value),
								maxLength: 40
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cost price (KES)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.cost_price,
								onChange: (e) => set("cost_price", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Selling price (KES)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.selling_price,
								onChange: (e) => set("selling_price", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Stock quantity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.stock_quantity,
								onChange: (e) => set("stock_quantity", e.target.value),
								disabled: !!product
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Unit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.unit,
								onChange: (e) => set("unit", e.target.value),
								maxLength: 12
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Minimum stock (alert)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.min_stock,
								onChange: (e) => set("min_stock", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Maximum stock",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.max_stock,
								onChange: (e) => set("max_stock", e.target.value)
							})
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
					children: product ? "Save changes" : "Create product"
				})] })
			]
		})
	});
}
function StockInDialog({ product, userId, onClose, onDone }) {
	const [qty, setQty] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		const q = Number(qty) || 0;
		if (q === 0) return toast.error("Enter a quantity");
		setBusy(true);
		try {
			const newQty = await applyStockMovement({
				productId: product.id,
				productName: product.name,
				delta: q,
				type: q > 0 ? "receive" : "adjustment",
				notes: "Manual stock adjustment"
			});
			await logAudit("stock.adjusted", "products", product.id, { quantity: q });
			toast.success(`${product.name} stock is now ${newQty} ${product.unit}`);
			onClose();
			onDone();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Stock update failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Stock in — ", product.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Current stock: ",
				Number(product.stock_quantity),
				" ",
				product.unit,
				". Use a negative value for wastage."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: qty,
					onChange: (e) => setQty(e.target.value),
					className: "h-12 text-lg"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy,
				children: "Apply"
			})] })
		] })
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-2 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { ProductsPage as component };
