import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as GlassPanel, r as PageHeader } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as Save } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CwNbP8E9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const qc = useQueryClient();
	const { isManager } = useAuth();
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data, isLoading } = useQuery({
		queryKey: ["business-settings"],
		queryFn: async () => {
			const { data } = await supabase.from("business_settings").select("*").limit(1).maybeSingle();
			return data ?? null;
		}
	});
	(0, import_react.useEffect)(() => {
		if (data) setForm(data);
	}, [data]);
	const save = async () => {
		if (!isManager) return toast.error("Only managers can change settings");
		setSaving(true);
		const payload = {
			business_name: form.business_name || "Silver Pub",
			phone: form.phone || null,
			email: form.email || null,
			address: form.address || null,
			till_number: form.till_number || null,
			currency: form.currency || "KES",
			tax_rate: Number(form.tax_rate ?? 0),
			receipt_footer: form.receipt_footer || null,
			receipt_width: form.receipt_width || "80mm",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error } = data?.id ? await supabase.from("business_settings").update(payload).eq("id", data.id) : await supabase.from("business_settings").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Settings saved");
		qc.invalidateQueries({ queryKey: ["business-settings"] });
	};
	const field = (key, label, type = "text") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: `f-${key}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: `f-${key}`,
			type,
			value: form[key] ?? "",
			onChange: (e) => setForm({
				...form,
				[key]: e.target.value
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Settings",
		subtitle: "Business identity, receipts and tax configuration",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "rounded-full",
			onClick: () => void save(),
			disabled: saving || !isManager,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 size-4" }), " Save changes"]
		})
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-center text-sm text-muted-foreground",
		children: "Loading settings…"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 xl:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 font-display text-lg font-semibold",
			children: "Business profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				field("business_name", "Business name"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [field("phone", "Phone"), field("email", "Email")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "f-address",
						children: "Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "f-address",
						value: form.address ?? "",
						onChange: (e) => setForm({
							...form,
							address: e.target.value
						})
					})]
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 font-display text-lg font-semibold",
			children: "Payments & receipts"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [field("till_number", "M-Pesa till / paybill"), field("tax_rate", "Tax rate (%)", "number")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [field("currency", "Currency code"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Receipt width" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.receipt_width ?? "80mm",
							onValueChange: (v) => setForm({
								...form,
								receipt_width: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "58mm",
								children: "58mm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "80mm",
								children: "80mm"
							})] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "f-footer",
						children: "Receipt footer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "f-footer",
						value: form.receipt_footer ?? "",
						onChange: (e) => setForm({
							...form,
							receipt_footer: e.target.value
						})
					})]
				})
			]
		})] })]
	})] });
}
//#endregion
export { SettingsPage as component };
