import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, n as dateTime, o as num } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { U as Beer, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dispensing-a_uLz7ht.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DispensingPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		product_id: ""
	});
	const { data, isLoading } = useQuery({
		queryKey: ["dispensing"],
		queryFn: async () => {
			const [{ data: units }, { data: sessions }, { data: products }] = await Promise.all([
				supabase.from("dispensing_units").select("*").order("name"),
				supabase.from("dispensing_sessions").select("*").order("created_at", { ascending: false }).limit(50),
				supabase.from("products").select("id,name").order("name")
			]);
			return {
				units: units ?? [],
				sessions: sessions ?? [],
				products: products ?? []
			};
		}
	});
	const units = data?.units ?? [];
	const sessions = data?.sessions ?? [];
	const outstanding = sessions.filter((s) => !s.is_closed).reduce((a, s) => a + Number(s.outstanding), 0);
	const expected = sessions.filter((s) => !s.is_closed).reduce((a, s) => a + Number(s.expected_revenue), 0);
	const unitName = (id) => units.find((u) => u.id === id)?.name ?? "Unit";
	const save = async () => {
		if (!form.name.trim()) return toast.error("Give the dispensing unit a name");
		const { error } = await supabase.from("dispensing_units").insert({
			name: form.name.trim(),
			product_id: form.product_id || null
		});
		if (error) return toast.error(error.message);
		toast.success("Dispensing unit added");
		setForm({
			name: "",
			product_id: ""
		});
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["dispensing"] });
	};
	const toggle = async (u) => {
		const { error } = await supabase.from("dispensing_units").update({ is_active: !u.is_active }).eq("id", u.id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["dispensing"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dispensing",
			subtitle: "Draught taps and spirit dispensers reconciled against revenue",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " New unit"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add dispensing unit" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "d-name",
								children: "Unit name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "d-name",
								placeholder: "Tap 1 — Tusker Draught",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Linked product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.product_id,
								onValueChange: (v) => setForm({
									...form,
									product_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose product" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (data?.products ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: p.name
								}, p.id)) })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: "Save unit"
					}) })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active units",
					value: units.filter((u) => u.is_active).length,
					format: (n) => num(n),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beer, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Expected revenue (open)",
					value: expected,
					format: money,
					tone: "info",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Outstanding",
					value: outstanding,
					format: money,
					tone: "warning",
					index: 2
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 font-display text-lg font-semibold",
				children: "Dispensing units"
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Loading units…"
			}) : units.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No units configured",
				description: "Add taps or dispensers to reconcile volume."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border/60 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: u.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: u.is_active ? "Active" : "Disabled"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => void toggle(u),
						children: u.is_active ? "Disable" : "Enable"
					})]
				}, u.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 font-display text-lg font-semibold",
				children: "Recent sessions"
			}), sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No sessions yet",
				description: "Sessions are created when a shift opens a unit."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Unit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Opened"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4 text-right",
								children: "Dispensed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 text-right",
								children: "Outstanding"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4",
								children: unitName(s.unit_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 text-muted-foreground",
								children: dateTime(s.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-4 text-right tabular-nums",
								children: num(s.dispensed_quantity, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 text-right tabular-nums text-warning",
								children: money(s.outstanding)
							})
						]
					}, s.id)) })]
				})
			})] })]
		})
	] });
}
//#endregion
export { DispensingPage as component };
