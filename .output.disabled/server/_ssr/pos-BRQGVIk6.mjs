import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as Banknote, O as Lock, T as Minus, W as Barcode, b as Printer, c as Trash2, d as Split, f as Smartphone, g as Search, j as CreditCard, u as Star, x as Plus, y as ReceiptText } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as useActiveShift } from "./useShift-BYBYXS5a.mjs";
import { a as lineTotal, i as createSale, r as cartTotals, t as Badge } from "./pos-7koGGnit.mjs";
import { n as printReceipt, t as Receipt } from "./Receipt-CIBIi_WA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-BRQGVIk6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function POSPage() {
	const { user, profile } = useAuth();
	const qc = useQueryClient();
	const { data: shift, isLoading: shiftLoading } = useActiveShift();
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [extraDiscount, setExtraDiscount] = (0, import_react.useState)(0);
	const [checkoutOpen, setCheckoutOpen] = (0, import_react.useState)(false);
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: ["pos-data"],
		queryFn: async () => {
			const [products, categories, tabs, settings] = await Promise.all([
				supabase.from("products").select("*").eq("status", "active").order("name"),
				supabase.from("categories").select("id,name").order("sort_order"),
				supabase.from("tabs").select("id,customer_name,balance,table_number").eq("status", "open"),
				supabase.from("business_settings").select("*").limit(1).maybeSingle()
			]);
			return {
				products: products.data ?? [],
				categories: categories.data ?? [],
				tabs: tabs.data ?? [],
				settings: settings.data
			};
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const list = data?.products ?? [];
		const q = search.trim().toLowerCase();
		return list.filter((p) => {
			const matchCat = category === "all" || p.category_id === category;
			const matchQ = !q || p.name.toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q) || (p.barcode ?? "").toLowerCase().includes(q);
			return matchCat && matchQ;
		});
	}, [
		data,
		search,
		category
	]);
	const totals = cartTotals(lines, extraDiscount);
	const addProduct = (p) => {
		setLines((prev) => {
			const idx = prev.findIndex((l) => l.productId === p.id);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = {
					...next[idx],
					quantity: next[idx].quantity + 1
				};
				return next;
			}
			return [...prev, {
				productId: p.id,
				name: p.name,
				unitPrice: Number(p.selling_price),
				costPrice: Number(p.cost_price),
				taxRate: Number(p.tax_rate),
				quantity: 1,
				discount: 0
			}];
		});
	};
	const onBarcodeEnter = (value) => {
		const hit = (data?.products ?? []).find((p) => p.barcode === value.trim() || p.sku === value.trim());
		if (hit) {
			addProduct(hit);
			setSearch("");
			toast.success(`${hit.name} added`);
		}
	};
	const setQty = (id, delta) => setLines((prev) => prev.map((l) => l.productId === id ? {
		...l,
		quantity: Math.max(0, l.quantity + delta)
	} : l).filter((l) => l.quantity > 0));
	const clearCart = () => {
		setLines([]);
		setExtraDiscount(0);
	};
	if (shiftLoading || isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_400px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[70vh] rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[70vh] rounded-2xl" })]
	});
	if (!shift) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card mx-auto mt-10 max-w-lg p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-destructive/40 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold",
				children: "No open shift"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "You cannot sell until you open a shift with your opening cash float and M-Pesa float."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shifts",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 rounded-xl",
					children: "Open a shift"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-[1fr_420px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[240px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								autoFocus: true,
								value: search,
								onChange: (e) => setSearch(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") onBarcodeEnter(search);
								},
								placeholder: "Search or scan barcode…",
								className: "h-12 rounded-xl pl-9 text-base"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "h-9 gap-2 rounded-full px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "size-4" }), " Scanner ready"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatChip, {
								active: category === "all",
								onClick: () => setCategory("all"),
								label: "All"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatChip, {
								active: category === "fav",
								onClick: () => setCategory("fav"),
								label: "★ Favourites"
							}),
							(data?.categories ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatChip, {
								active: category === c.id,
								onClick: () => setCategory(c.id),
								label: c.name
							}, c.id))
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4",
					children: [(category === "fav" ? filtered.filter((p) => p.is_favorite) : filtered).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileTap: { scale: .96 },
						onClick: () => addProduct(p),
						className: "glass-card lift group overflow-hidden p-0 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3] w-full overflow-hidden bg-secondary/60",
							children: [
								p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image_url,
									alt: p.name,
									loading: "lazy",
									className: "size-full object-cover transition-transform duration-500 group-hover:scale-105"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-full place-items-center font-display text-3xl text-muted-foreground/40",
									children: p.name.slice(0, 2).toUpperCase()
								}),
								p.is_favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute right-2 top-2 size-4 fill-primary text-primary" }),
								p.stock_quantity <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-x-0 bottom-0 bg-destructive/80 py-1 text-center text-[10px] font-bold uppercase tracking-wider",
									children: "Out of stock"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-primary",
									children: money(p.selling_price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [Number(p.stock_quantity), " left"]
								})]
							})]
						})]
					}, p.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass-card col-span-full grid place-items-center p-12 text-center text-sm text-muted-foreground",
						children: "No products match. Add products under Products."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "glass-card sticky top-20 flex h-fit max-h-[calc(100vh-6rem)] flex-col p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Current Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: clearCart,
							disabled: !lines.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 size-4" }), " Clear"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex-1 space-y-2 overflow-y-auto pr-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							initial: false,
							children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								layout: true,
								initial: {
									opacity: 0,
									x: 12
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: {
									opacity: 0,
									x: -12
								},
								className: "rounded-xl bg-secondary/50 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: l.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold tabular-nums text-primary",
										children: money(lineTotal(l))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "outline",
											className: "size-8 rounded-lg",
											onClick: () => setQty(l.productId, -1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-8 text-center text-sm font-semibold tabular-nums",
											children: l.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "outline",
											className: "size-8 rounded-lg",
											onClick: () => setQty(l.productId, 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-auto text-xs text-muted-foreground",
											children: ["@ ", money(l.unitPrice)]
										})
									]
								})]
							}, l.productId))
						}), lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-10 text-center text-sm text-muted-foreground",
							children: "Tap products to build the order."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2 border-t border-border pt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: money(totals.subtotal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Discount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: extraDiscount || "",
									onChange: (e) => setExtraDiscount(Math.max(0, Number(e.target.value) || 0)),
									className: "h-8 w-28 rounded-lg text-right",
									placeholder: "0"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Tax",
								value: money(totals.tax)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-base font-semibold",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold text-primary tabular-nums",
									children: money(totals.total)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-2 h-14 w-full rounded-xl text-base font-semibold",
								disabled: !lines.length,
								onClick: () => setCheckoutOpen(true),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 size-5" }),
									" Charge ",
									money(totals.total)
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutDialog, {
				open: checkoutOpen,
				onOpenChange: setCheckoutOpen,
				totals,
				lines,
				tabs: data?.tabs ?? [],
				settings: data?.settings ?? null,
				cashierId: user?.id ?? "",
				cashierName: profile?.full_name ?? profile?.email ?? "Cashier",
				shiftId: shift.id,
				onDone: (r) => {
					setReceipt(r);
					clearCart();
					setCheckoutOpen(false);
					qc.invalidateQueries();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!receipt,
				onOpenChange: (o) => !o && setReceipt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Receipt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Sale completed successfully." })] }),
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
function CatChip({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all", active ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"),
		children: label
	});
}
function CheckoutDialog({ open, onOpenChange, totals, lines, tabs, settings, cashierId, cashierName, shiftId, onDone }) {
	const [mode, setMode] = (0, import_react.useState)("cash");
	const [cash, setCash] = (0, import_react.useState)("");
	const [mpesa, setMpesa] = (0, import_react.useState)("");
	const [tabId, setTabId] = (0, import_react.useState)("");
	const [newTabName, setNewTabName] = (0, import_react.useState)("");
	const [tabPhone, setTabPhone] = (0, import_react.useState)("");
	const [tableNumber, setTableNumber] = (0, import_react.useState)("");
	const [waiter, setWaiter] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
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
					const { data: created, error } = await supabase.from("tabs").insert({
						customer_name: name,
						customer_phone: tabPhone.trim() || null,
						table_number: tableNumber.trim() || null,
						waiter: waiter.trim() || null,
						opened_by: cashierId,
						shift_id: shiftId
					}).select("id").single();
					if (error) throw error;
					targetTab = created.id;
				}
				const { data: tabRow } = await supabase.from("tabs").select("*").eq("id", targetTab).single();
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
					status: "open"
				});
				const newTotal = Number(tabRow?.total_amount ?? 0) + totals.total;
				await supabase.from("tabs").update({
					total_amount: newTotal,
					balance: newTotal - Number(tabRow?.paid_amount ?? 0)
				}).eq("id", targetTab);
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
						total: lineTotal(l)
					})),
					subtotal: totals.subtotal,
					discount: totals.discount,
					tax: totals.tax,
					total: totals.total,
					previousBalance: prevBalance,
					outstanding: newTotal - Number(tabRow?.paid_amount ?? 0),
					method: "RUNNING BILL",
					status: "DUE"
				});
				toast.success("Added to running bill");
				return;
			}
			const c = mode === "cash" ? totals.total : mode === "split" ? cashAmt : 0;
			const m = mode === "mpesa" ? totals.total : mode === "split" ? mpesaAmt : 0;
			if (mode === "split" && c + m < totals.total - .01) {
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
				notes
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
					total: lineTotal(l)
				})),
				subtotal: totals.subtotal,
				discount: totals.discount,
				tax: totals.tax,
				total: totals.total,
				amountReceived: Number(sale.amount_received),
				changeDue: Number(sale.change_due),
				method: mode,
				status: "PAID"
			});
			toast.success("Payment recorded");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Checkout failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Complete Payment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Amount due ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-primary",
					children: money(totals.total)
				})] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							active: mode === "cash",
							onClick: () => setMode("cash"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-4" }),
							label: "Cash"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							active: mode === "mpesa",
							onClick: () => setMode("mpesa"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" }),
							label: "M-Pesa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							active: mode === "split",
							onClick: () => setMode("split"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Split, { className: "size-4" }),
							label: "Split"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							active: mode === "tab",
							onClick: () => setMode("tab"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "size-4" }),
							label: "Tab"
						})
					]
				}),
				mode === "cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cash received" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							inputMode: "decimal",
							value: cash,
							onChange: (e) => setCash(e.target.value),
							placeholder: String(totals.total),
							className: "h-12 text-lg"
						}),
						cashAmt > totals.total && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-success",
							children: ["Change: ", money(cashAmt - totals.total)]
						})
					]
				}),
				mode === "mpesa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground",
					children: [
						"Customer pays ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: money(totals.total)
						}),
						" ",
						"to the till. Confirm the M-Pesa message before completing."
					]
				}),
				mode === "split" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cash,
								onChange: (e) => setCash(e.target.value),
								className: "h-12"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "M-Pesa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: mpesa,
								onChange: (e) => setMpesa(e.target.value),
								className: "h-12"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "col-span-2 text-xs text-muted-foreground",
							children: [
								"Covered: ",
								money(cashAmt + mpesaAmt),
								" of ",
								money(totals.total)
							]
						})
					]
				}),
				mode === "tab" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Add to existing bill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: tabId,
							onValueChange: setTabId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select an open tab (optional)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: t.id,
								children: [
									t.customer_name,
									t.table_number ? ` · T${t.table_number}` : "",
									" — ",
									money(t.balance)
								]
							}, t.id)) })]
						})]
					}), !tabId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: newTabName,
									onChange: (e) => setNewTabName(e.target.value),
									maxLength: 80
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: tabPhone,
									onChange: (e) => setTabPhone(e.target.value),
									maxLength: 20
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Table" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: tableNumber,
									onChange: (e) => setTableNumber(e.target.value),
									maxLength: 10
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Waiter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: waiter,
									onChange: (e) => setWaiter(e.target.value),
									maxLength: 60
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Order note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						maxLength: 300,
						rows: 2
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: busy,
					className: "min-w-40",
					children: busy ? "Processing…" : mode === "tab" ? "Add to bill" : `Complete ${money(totals.total)}`
				})] })
			]
		})
	});
}
function ModeBtn({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: cn("flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-all", active ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"),
		children: [icon, label]
	});
}
//#endregion
export { POSPage as component };
