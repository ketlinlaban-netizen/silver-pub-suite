import { t as supabase } from "./client-DalDhuxz.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as StatCard, n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { i as displayName, n as dateTime, o as num, t as ROLE_LABELS } from "./format-CUq4cxR5.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as UserCog } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-DG1HK5hZ.js
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"administrator",
	"owner",
	"manager",
	"supervisor",
	"cashier",
	"store_keeper"
];
function StaffPage() {
	const qc = useQueryClient();
	const { isManager } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["staff"],
		queryFn: async () => {
			const [{ data: profiles }, { data: roles }] = await Promise.all([supabase.from("profiles").select("id,full_name,email,phone,status,last_login_at"), supabase.from("user_roles").select("user_id,role")]);
			const map = /* @__PURE__ */ new Map();
			for (const r of roles ?? []) map.set(r.user_id, [...map.get(r.user_id) ?? [], r.role]);
			return {
				profiles: profiles ?? [],
				roles: map
			};
		}
	});
	const profiles = data?.profiles ?? [];
	const toggleRole = async (userId, role, has) => {
		if (!isManager) return toast.error("Only managers can change roles");
		const { error } = has ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role) : await supabase.from("user_roles").insert({
			user_id: userId,
			role
		});
		if (error) return toast.error(error.message);
		toast.success(has ? "Role removed" : "Role granted");
		qc.invalidateQueries({ queryKey: ["staff"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Staff & Roles",
			subtitle: "Accounts, permissions and access control"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Staff accounts",
				value: profiles.length,
				format: (n) => num(n),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Active",
				value: profiles.filter((p) => p.status === "active").length,
				format: (n) => num(n),
				tone: "success",
				index: 1
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading staff…"
		}) : profiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No staff accounts",
			description: "Accounts are created by the administrator."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: profiles.map((p) => {
				const has = data.roles.get(p.id) ?? [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold capitalize",
						children: p.full_name?.trim() || displayName(p.email)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.phone || "No phone",
							" · Last login ",
							dateTime(p.last_login_at)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-border px-3 py-1 text-xs capitalize text-muted-foreground",
						children: p.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: ROLES.map((r) => {
						const active = has.includes(r);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: active ? "default" : "outline",
							className: "rounded-full",
							disabled: !isManager,
							onClick: () => void toggleRole(p.id, r, active),
							children: ROLE_LABELS[r] ?? r
						}, r);
					})
				})] }, p.id);
			})
		})
	] });
}
//#endregion
export { StaffPage as component };
