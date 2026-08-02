import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { o as num } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Trash2, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-UkYpHW8V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		description: "",
		sort_order: "0"
	});
	const { data, isLoading } = useQuery({
		queryKey: ["categories-page"],
		queryFn: async () => {
			const [{ data: cats }, { data: products }] = await Promise.all([supabase.from("categories").select("*").order("sort_order"), supabase.from("products").select("id,category_id")]);
			const counts = /* @__PURE__ */ new Map();
			for (const p of products ?? []) {
				if (!p.category_id) continue;
				counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
			}
			return {
				cats: cats ?? [],
				counts
			};
		}
	});
	const save = async () => {
		if (!form.name.trim()) return toast.error("Category name is required");
		const { error } = await supabase.from("categories").insert({
			name: form.name.trim(),
			description: form.description.trim() || null,
			sort_order: Number(form.sort_order) || 0
		});
		if (error) return toast.error(error.message);
		toast.success("Category created");
		setForm({
			name: "",
			description: "",
			sort_order: "0"
		});
		setOpen(false);
		qc.invalidateQueries({ queryKey: ["categories-page"] });
	};
	const remove = async (id, count) => {
		if (count > 0) return toast.error("Move or delete the products in this category first");
		const { error } = await supabase.from("categories").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Category removed");
		qc.invalidateQueries({ queryKey: ["categories-page"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Categories",
		subtitle: "Group the menu so cashiers find drinks instantly",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-4" }), " New category"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add category" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cat-name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cat-name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cat-desc",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cat-desc",
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cat-sort",
								children: "Sort order"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cat-sort",
								type: "number",
								value: form.sort_order,
								onChange: (e) => setForm({
									...form,
									sort_order: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void save(),
					children: "Save category"
				}) })
			] })]
		})
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-center text-sm text-muted-foreground",
		children: "Loading categories…"
	}) : (data?.cats.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No categories",
		description: "Create categories like Beer, Spirits or Soft Drinks."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
		children: data.cats.map((c) => {
			const count = data.counts.get(c.id) ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold",
						children: c.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: c.description || "No description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs uppercase tracking-widest text-primary",
						children: [
							num(count),
							" product",
							count === 1 ? "" : "s"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": `Delete ${c.name}`,
					onClick: () => void remove(c.id, count),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
				})]
			}, c.id);
		})
	})] });
}
//#endregion
export { CategoriesPage as component };
