import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as money, o as num } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Truck, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suppliers-M6rab4Y9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	company_name: "",
	contact_person: "",
	phone: "",
	email: "",
	address: "",
	products_supplied: ""
};
function SuppliersPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const { data, isLoading } = useQuery({
		queryKey: ["suppliers"],
		queryFn: async () => {
			const { data } = await supabase.from("suppliers").select("*").order("company_name");
			return data ?? [];
		}
	});
	const suppliers = data ?? [];
	const owed = suppliers.reduce((a, s) => a + Number(s.outstanding_balance ?? 0), 0);
	const save = async () => {
		if (!form.company_name.trim()) return toast.error("Company name is required");
		const { error } = await supabase.from("suppliers").insert({
			company_name: form.company_name.trim(),
			contact_person: form.contact_person.trim() || null,
			phone: form.phone.trim() || null,
			email: form.email.trim() || null,
			address: form.address.trim() || null,
			products_supplied: form.products_supplied.trim() || null
		});
		if (error) return toast.error(error.message);
		toast.success("Supplier added");
		setForm(EMPTY);
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["suppliers"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Suppliers",
			subtitle: "Contacts, delivery partners and payables",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " New supplier"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add supplier" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "s-company",
									children: "Company name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "s-company",
									value: form.company_name,
									onChange: (e) => setForm({
										...form,
										company_name: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "s-contact",
										children: "Contact person"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "s-contact",
										value: form.contact_person,
										onChange: (e) => setForm({
											...form,
											contact_person: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "s-phone",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "s-phone",
										value: form.phone,
										onChange: (e) => setForm({
											...form,
											phone: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "s-email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "s-email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "s-products",
									children: "Products supplied"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "s-products",
									value: form.products_supplied,
									onChange: (e) => setForm({
										...form,
										products_supplied: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						children: "Save supplier"
					}) })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Suppliers",
				value: suppliers.length,
				format: (n) => num(n),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Total payable",
				value: owed,
				format: money,
				tone: "warning",
				index: 1
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading suppliers…"
		}) : suppliers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No suppliers yet",
			description: "Add the distributors that stock your bar."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold",
					children: s.company_name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: s.contact_person || "No contact person"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-1 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.phone || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate",
						children: s.products_supplied || "Products not specified"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm font-semibold text-warning",
					children: ["Balance: ", money(s.outstanding_balance)]
				})
			] }, s.id))
		})
	] });
}
//#endregion
export { SuppliersPage as component };
