import { a as __toESM } from "../_runtime.mjs";
import { r as performance_default } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/premium-D4AjSDM1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: subtitle
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		})]
	});
}
function GlassPanel({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("glass-card p-5", className),
		children
	});
}
function useCountUp(value, duration = 900) {
	const [display, setDisplay] = (0, import_react.useState)(0);
	const from = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const start = performance_default.now();
		const initial = from.current;
		let frame = 0;
		const tick = (now) => {
			const p = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - p, 3);
			setDisplay(initial + (value - initial) * eased);
			if (p < 1) frame = requestAnimationFrame(tick);
			else from.current = value;
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [value, duration]);
	return display;
}
function StatCard({ label, value, format, icon, hint, tone = "gold", index = 0 }) {
	const animated = useCountUp(value);
	const toneClass = {
		gold: "text-primary",
		success: "text-success",
		info: "text-info",
		warning: "text-warning",
		destructive: "text-destructive"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: index * .05,
			duration: .4,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: "glass-card lift p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
					children: label
				}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("opacity-80", toneClass),
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-3 font-display text-2xl font-semibold tabular-nums", toneClass),
				children: format(animated)
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card grid place-items-center px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg font-semibold",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-sm text-sm text-muted-foreground",
			children: description
		})]
	});
}
//#endregion
export { StatCard as i, GlassPanel as n, PageHeader as r, EmptyState as t };
