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
import { g as Search, r as Users, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-eLzS_0To.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		notes: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data, isLoading } = useQuery({
		queryKey: ["customers"],
		queryFn: async () => {
			const [{ data: customers }, { data: tabs }] = await Promise.all([supabase.from("customers").select("*").order("created_at", { ascending: false }), supabase.from("tabs").select("customer_id,balance,status")]);
			const balances = /* @__PURE__ */ new Map();
			for (const t of tabs ?? []) {
				if (t.status !== "open" || !t.customer_id) continue;
				balances.set(t.customer_id, (balances.get(t.customer_id) ?? 0) + Number(t.balance ?? 0));
			}
			return {
				customers: customers ?? [],
				balances
			};
		}
	});
	const customers = data?.customers ?? [];
	const filtered = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || (c.phone ?? "").toLowerCase().includes(q.toLowerCase()));
	const outstanding = [...data?.balances.values() ?? []].reduce((a, b) => a + b, 0);
	const save = async () => {
		if (!form.name.trim()) return toast.error("Customer name is required");
		setSaving(true);
		const { error } = await supabase.from("customers").insert({
			name: form.name.trim(),
			phone: form.phone.trim() || null,
			email: form.email.trim() || null,
			notes: form.notes.trim() || null
		});
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Customer added");
		setForm({
			name: "",
			phone: "",
			email: "",
			notes: ""
		});
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["customers"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Customers",
			subtitle: "Regulars, contacts and outstanding running bills",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " New customer"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add customer" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "c-name",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "c-name",
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "c-phone",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "c-phone",
										value: form.phone,
										onChange: (e) => setForm({
											...form,
											phone: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "c-email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "c-email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "c-notes",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "c-notes",
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
						disabled: saving,
						children: "Save customer"
					}) })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Customers",
				value: customers.length,
				format: (n) => num(n),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Outstanding bills",
				value: outstanding,
				format: money,
				tone: "warning",
				index: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search by name or phone",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading customers…"
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No customers yet",
			description: "Add your regulars to track running bills."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Phone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-4",
							children: "Added"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Open balance"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 font-medium",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: c.phone || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: c.email || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: dateTime(c.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums text-warning",
							children: money(data?.balances.get(c.id) ?? 0)
						})
					]
				}, c.id)) })]
			})
		})] })
	] });
}
//#endregion
export { CustomersPage as component };
