import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, n as dateTime } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as CirclePlay, L as CircleCheck, M as Clock3, P as CircleX } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as useActiveShift } from "./useShift-BYBYXS5a.mjs";
import { o as logAudit, t as Badge } from "./pos-7koGGnit.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shifts-ExbzPfRv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShiftsPage() {
	const { user, profile, isManager } = useAuth();
	const qc = useQueryClient();
	const { data: active } = useActiveShift();
	const [openDialog, setOpenDialog] = (0, import_react.useState)(false);
	const [closeDialog, setCloseDialog] = (0, import_react.useState)(false);
	const { data: shifts } = useQuery({
		queryKey: ["shifts"],
		queryFn: async () => {
			const { data } = await supabase.from("shifts").select("*").order("opened_at", { ascending: false }).limit(50);
			return data ?? [];
		}
	});
	const approve = async (id, approved) => {
		await supabase.from("shifts").update({
			status: approved ? "approved" : "rejected",
			approved_by: user?.id
		}).eq("id", id);
		await logAudit(approved ? "shift.approved" : "shift.rejected", "shifts", id);
		toast.success(approved ? "Shift approved" : "Shift rejected");
		qc.invalidateQueries();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Shift Management",
				subtitle: "Cashiers must open a shift before selling. Closing reconciles every till movement.",
				actions: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setCloseDialog(true),
					variant: "destructive",
					className: "rounded-xl",
					children: "Close current shift"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenDialog(true),
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-2 size-4" }), " Open shift"]
				})
			}),
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 0,
						label: "Shift status",
						value: 1,
						format: () => "OPEN",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-5" }),
						tone: "success",
						hint: dateTime(active.opened_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 1,
						label: "Opening cash",
						value: Number(active.opening_cash),
						format: money
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 2,
						label: "Opening M-Pesa float",
						value: Number(active.opening_mpesa),
						format: money,
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						index: 3,
						label: "Cashier",
						value: 0,
						format: () => active.cashier_name,
						tone: "gold"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[900px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Cashier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Opened"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Closed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Total sales"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Expected cash"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Counted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Variance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Status"
								}),
								isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 text-right",
									children: "Approval"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (shifts ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 font-medium",
									children: s.cashier_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-muted-foreground",
									children: dateTime(s.opened_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-muted-foreground",
									children: s.closed_at ? dateTime(s.closed_at) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right tabular-nums",
									children: money(s.total_sales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right tabular-nums",
									children: s.expected_cash != null ? money(s.expected_cash) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right tabular-nums",
									children: s.closing_cash_counted != null ? money(s.closing_cash_counted) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `p-4 text-right font-semibold tabular-nums ${(s.variance ?? 0) < 0 ? "text-destructive" : (s.variance ?? 0) > 0 ? "text-warning" : ""}`,
									children: s.variance != null ? money(s.variance) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: s.status === "open" ? "border-success/50 text-success" : s.status === "approved" ? "border-primary/50 text-primary" : s.status === "rejected" ? "border-destructive/50 text-destructive" : "border-warning/50 text-warning",
										children: s.status.replace("_", " ")
									})
								}),
								isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right",
									children: s.status === "pending_approval" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => approve(s.id, true),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 size-4 text-success" }), " Approve"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => approve(s.id, false),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 size-4 text-destructive" }), " Reject"]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "—"
									})
								})
							]
						}, s.id)) })]
					})
				}), (shifts ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No shifts yet",
					description: "Open your first shift to begin trading."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenShiftDialog, {
				open: openDialog,
				onOpenChange: setOpenDialog,
				cashierId: user?.id ?? "",
				cashierName: profile?.full_name || profile?.email || "Cashier",
				onDone: () => void qc.invalidateQueries()
			}),
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseShiftDialog, {
				open: closeDialog,
				onOpenChange: setCloseDialog,
				shiftId: active.id,
				openingCash: Number(active.opening_cash),
				openingMpesa: Number(active.opening_mpesa),
				onDone: () => void qc.invalidateQueries()
			})
		]
	});
}
function OpenShiftDialog({ open, onOpenChange, cashierId, cashierName, onDone }) {
	const [cash, setCash] = (0, import_react.useState)("");
	const [mpesa, setMpesa] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		setBusy(true);
		const { error } = await supabase.from("shifts").insert({
			cashier_id: cashierId,
			cashier_name: cashierName,
			opening_cash: Number(cash) || 0,
			opening_mpesa: Number(mpesa) || 0,
			notes: notes.trim() || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		await logAudit("shift.opened", "shifts");
		toast.success("Shift opened — you can now sell");
		onOpenChange(false);
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Open Shift" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				cashierName,
				" · ",
				(/* @__PURE__ */ new Date()).toLocaleString("en-KE")
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Opening cash (KES)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: cash,
							onChange: (e) => setCash(e.target.value),
							className: "h-12"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Opening M-Pesa float (KES)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: mpesa,
							onChange: (e) => setMpesa(e.target.value),
							className: "h-12"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 2,
							maxLength: 300
						})]
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
				children: "Open shift"
			})] })
		] })
	});
}
function CloseShiftDialog({ open, onOpenChange, shiftId, openingCash, openingMpesa, onDone }) {
	const [counted, setCounted] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: summary } = useQuery({
		queryKey: [
			"shift-summary",
			shiftId,
			open
		],
		enabled: open,
		queryFn: async () => {
			const [sales, expenses, disp, tabs] = await Promise.all([
				supabase.from("sales").select("total,cash_amount,mpesa_amount,status").eq("shift_id", shiftId),
				supabase.from("expenses").select("amount").eq("shift_id", shiftId),
				supabase.from("dispensing_sessions").select("outstanding").eq("shift_id", shiftId),
				supabase.from("tabs").select("balance").eq("shift_id", shiftId).eq("status", "open")
			]);
			const s = sales.data ?? [];
			const sum = (n) => n.reduce((a, b) => a + Number(b || 0), 0);
			return {
				cashSales: sum(s.map((x) => x.cash_amount)),
				mpesaSales: sum(s.map((x) => x.mpesa_amount)),
				totalSales: sum(s.filter((x) => x.status !== "void").map((x) => x.total)),
				refunds: sum(s.filter((x) => x.status === "refunded").map((x) => x.total)),
				expenses: sum((expenses.data ?? []).map((x) => x.amount)),
				dispensing: sum((disp.data ?? []).map((x) => x.outstanding)),
				outstanding: sum((tabs.data ?? []).map((x) => x.balance))
			};
		}
	});
	const expected = summary ? openingCash + summary.cashSales - summary.expenses - summary.refunds : 0;
	const variance = (Number(counted) || 0) - expected;
	const submit = async () => {
		if (!summary) return;
		setBusy(true);
		const { error } = await supabase.from("shifts").update({
			closed_at: (/* @__PURE__ */ new Date()).toISOString(),
			closing_cash_counted: Number(counted) || 0,
			expected_cash: expected,
			variance,
			cash_sales: summary.cashSales,
			mpesa_sales: summary.mpesaSales,
			refunds: summary.refunds,
			expenses_total: summary.expenses,
			dispensing_balance: summary.dispensing,
			outstanding_bills: summary.outstanding,
			total_sales: summary.totalSales,
			status: "pending_approval"
		}).eq("id", shiftId);
		setBusy(false);
		if (error) return toast.error(error.message);
		await logAudit("shift.closed", "shifts", shiftId, { variance });
		toast.success("Shift submitted for manager approval");
		onOpenChange(false);
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Close Shift" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Reconcile the till before handing over." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 rounded-xl bg-secondary/40 p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Opening cash",
							value: money(openingCash)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Opening M-Pesa float",
							value: money(openingMpesa)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Cash sales",
							value: money(summary?.cashSales ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "M-Pesa sales",
							value: money(summary?.mpesaSales ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Refunds",
							value: money(summary?.refunds ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Expenses",
							value: money(summary?.expenses ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Dispensing balance",
							value: money(summary?.dispensing ?? 0),
							danger: (summary?.dispensing ?? 0) > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Outstanding bills",
							value: money(summary?.outstanding ?? 0),
							danger: (summary?.outstanding ?? 0) > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							label: "Total sales",
							value: money(summary?.totalSales ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 border-t border-border pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								label: "Expected cash in drawer",
								value: money(expected),
								bold: true
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Actual cash counted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: counted,
							onChange: (e) => setCounted(e.target.value),
							className: "h-12 text-lg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `text-sm font-semibold ${variance < 0 ? "text-destructive" : variance > 0 ? "text-warning" : "text-success"}`,
							children: ["Variance: ", money(variance)]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: busy || !summary,
					children: "Submit for approval"
				})] })
			]
		})
	});
}
function Line({ label, value, bold, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `tabular-nums ${bold ? "font-bold text-primary" : ""} ${danger ? "text-destructive" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { ShiftsPage as component };
