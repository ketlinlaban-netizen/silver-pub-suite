import { a as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7V83QrJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Splash() {
	const { loading, session } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		navigate({
			to: session ? "/dashboard" : "/auth",
			replace: true
		});
	}, [
		loading,
		session,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-16 place-items-center rounded-3xl gold-surface font-display text-2xl font-bold",
					children: "SP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-3xl font-semibold gold-text",
					children: "SILVER PUB"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground",
					children: "POS & Bar Management"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/2 animate-pulse rounded-full bg-primary" })
				})
			]
		})
	});
}
//#endregion
export { Splash as component };
