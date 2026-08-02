import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as GlassPanel, r as PageHeader, t as EmptyState } from "./premium-D4AjSDM1.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as displayName, n as dateTime, r as daysAgo } from "./format-CUq4cxR5.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-DsCo1Ihh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["audit"],
		queryFn: async () => {
			const { data } = await supabase.from("audit_logs").select("id,actor_name,action,entity,entity_id,created_at").gte("created_at", daysAgo(29).toISOString()).order("created_at", { ascending: false }).limit(300);
			return data ?? [];
		}
	});
	const logs = (data ?? []).filter((l) => l.action.toLowerCase().includes(q.toLowerCase()) || (l.entity ?? "").toLowerCase().includes(q.toLowerCase()) || displayName(l.actor_name).toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Audit Logs",
		subtitle: "Accountability trail for the last 30 days"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		placeholder: "Filter by action, module or staff",
		value: q,
		onChange: (e) => setQ(e.target.value),
		className: "mb-4 max-w-sm"
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-center text-sm text-muted-foreground",
		children: "Loading audit trail…"
	}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No activity logged",
		description: "Sensitive actions will be recorded here."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-4",
						children: "When"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-4",
						children: "Staff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-4",
						children: "Action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2",
						children: "Module"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-4 text-muted-foreground",
						children: dateTime(l.created_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-4 capitalize",
						children: displayName(l.actor_name)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-4 font-medium",
						children: l.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 capitalize text-muted-foreground",
						children: l.entity || "—"
					})
				]
			}, l.id)) })]
		})
	})] })] });
}
//#endregion
export { AuditPage as component };
