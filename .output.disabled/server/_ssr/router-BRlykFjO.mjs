import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as AuthProvider } from "./useAuth-Dg7UaUpz.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BRlykFjO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-OzUkQCkg.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl font-bold gold-text",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Silver Pub POS & Bar Management" },
			{
				name: "description",
				content: "Cloud POS and bar management for pubs: fast checkout, running tabs, dispensing reconciliation and shift control."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$18 = () => import("./routes-C7V83QrJ.mjs");
var Route$18 = createFileRoute("/")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Silver Pub POS — Enterprise Bar Management" },
		{
			name: "description",
			content: "Silver Pub POS: lightning-fast cashier workflows, running tabs, dispensing reconciliation, inventory and executive analytics for bars."
		},
		{
			property: "og:title",
			content: "Silver Pub POS — Enterprise Bar Management"
		},
		{
			property: "og:description",
			content: "Cloud point of sale built for pubs, bars and lounges — tabs, shifts, dispensing and reporting in one premium suite."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./route-jyXKUMuv.mjs");
var Route$17 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./auth-D3ETirl5.mjs");
objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(6, "Password must be at least 6 characters").max(72)
});
var Route$16 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Staff Sign In — Silver Pub POS" },
		{
			name: "description",
			content: "Secure staff sign in for the Silver Pub POS and bar management system."
		},
		{
			property: "og:title",
			content: "Staff Sign In — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Accounts are created by the administrator. Sign in to open your shift."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./audit-DsCo1Ihh.mjs");
var Route$15 = createFileRoute("/_authenticated/audit")({
	head: () => ({ meta: [
		{ title: "Audit Logs — Silver Pub POS" },
		{
			name: "description",
			content: "Full audit trail of staff actions across the POS and stock modules."
		},
		{
			property: "og:title",
			content: "Audit Logs — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Who did what, when — voids, edits, refunds and approvals."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./categories-UkYpHW8V.mjs");
var Route$14 = createFileRoute("/_authenticated/categories")({
	head: () => ({ meta: [
		{ title: "Categories — Silver Pub POS" },
		{
			name: "description",
			content: "Organise the bar menu into categories for faster cashier workflows."
		},
		{
			property: "og:title",
			content: "Categories — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Create and manage product categories for the POS grid."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./customers-eLzS_0To.mjs");
var Route$13 = createFileRoute("/_authenticated/customers")({
	head: () => ({ meta: [
		{ title: "Customers — Silver Pub POS" },
		{
			name: "description",
			content: "Customer directory with running bill balances for the pub."
		},
		{
			property: "og:title",
			content: "Customers — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Manage regulars, contacts and outstanding tab balances."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./dashboard-Eg-6Gr3k.mjs");
var Route$12 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Executive Dashboard — Silver Pub POS" },
		{
			name: "description",
			content: "Live sales, profit, inventory value and cashier performance for your bar, updated in real time."
		},
		{
			property: "og:title",
			content: "Executive Dashboard — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Real-time KPIs, sales trends and category performance for pub operations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./dispensing-a_uLz7ht.mjs");
var Route$11 = createFileRoute("/_authenticated/dispensing")({
	head: () => ({ meta: [
		{ title: "Dispensing — Silver Pub POS" },
		{
			name: "description",
			content: "Reconcile draught and spirit dispensing units against collected revenue."
		},
		{
			property: "og:title",
			content: "Dispensing — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Track dispensed volume, expected revenue and outstanding balances."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./expenses-UWJtYkAg.mjs");
var Route$10 = createFileRoute("/_authenticated/expenses")({
	head: () => ({ meta: [
		{ title: "Expenses — Silver Pub POS" },
		{
			name: "description",
			content: "Record and review bar operating expenses by category and shift."
		},
		{
			property: "og:title",
			content: "Expenses — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Petty cash, utilities and supplies tracked against every shift."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./inventory-BdXxmn35.mjs");
var Route$9 = createFileRoute("/_authenticated/inventory")({
	head: () => ({ meta: [
		{ title: "Inventory — Silver Pub POS" },
		{
			name: "description",
			content: "Live stock levels, valuation and every inventory movement in the bar."
		},
		{
			property: "og:title",
			content: "Inventory — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Track receipts, sales, adjustments and low-stock alerts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./pos-BRQGVIk6.mjs");
var Route$8 = createFileRoute("/_authenticated/pos")({
	head: () => ({ meta: [
		{ title: "Cashier POS — Silver Pub" },
		{
			name: "description",
			content: "Touch-optimised bar checkout: instant search, favourites, split payment, running tabs and automatic receipts."
		},
		{
			property: "og:title",
			content: "Cashier POS — Silver Pub"
		},
		{
			property: "og:description",
			content: "Complete a bar sale in seconds with cash, M-Pesa or split payment."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./products-Til8LI5h.mjs");
var Route$7 = createFileRoute("/_authenticated/products")({
	head: () => ({ meta: [
		{ title: "Products & Stock — Silver Pub POS" },
		{
			name: "description",
			content: "Manage the bar catalogue: pricing, margins, barcodes, stock levels, low-stock alerts and stock-in receipts."
		},
		{
			property: "og:title",
			content: "Products & Stock — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Full catalogue and inventory control for the bar with live stock valuation."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./purchases-B2GEKeJ5.mjs");
var Route$6 = createFileRoute("/_authenticated/purchases")({
	head: () => ({ meta: [
		{ title: "Purchases — Silver Pub POS" },
		{
			name: "description",
			content: "Purchase orders and supplier invoices with payment status."
		},
		{
			property: "og:title",
			content: "Purchases — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Record deliveries, invoices and outstanding supplier balances."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./reports-CyxRnBf2.mjs");
var Route$5 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [
		{ title: "Reports — Silver Pub POS" },
		{
			name: "description",
			content: "Sales, profit, product and cashier reports for any period."
		},
		{
			property: "og:title",
			content: "Reports — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Analyse revenue, margins and staff performance across the bar."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./settings-CwNbP8E9.mjs");
var Route$4 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Silver Pub POS" },
		{
			name: "description",
			content: "Business details, receipt branding, tax rate and till configuration."
		},
		{
			property: "og:title",
			content: "Settings — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Configure the pub profile, receipts and payment till."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./shifts-ExbzPfRv.mjs");
var Route$3 = createFileRoute("/_authenticated/shifts")({
	head: () => ({ meta: [
		{ title: "Shift Management — Silver Pub POS" },
		{
			name: "description",
			content: "Open and close cashier shifts with cash and M-Pesa floats, variance calculation and manager approval."
		},
		{
			property: "og:title",
			content: "Shift Management — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Full cashier accountability: floats, expected cash, variance and approvals."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./staff-DG1HK5hZ.mjs");
var Route$2 = createFileRoute("/_authenticated/staff")({
	head: () => ({ meta: [
		{ title: "Staff & Roles — Silver Pub POS" },
		{
			name: "description",
			content: "Manage bar staff accounts and role-based permissions."
		},
		{
			property: "og:title",
			content: "Staff & Roles — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Assign cashier, supervisor and manager roles to your team."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./suppliers-M6rab4Y9.mjs");
var Route$1 = createFileRoute("/_authenticated/suppliers")({
	head: () => ({ meta: [
		{ title: "Suppliers — Silver Pub POS" },
		{
			name: "description",
			content: "Supplier directory with contacts and outstanding balances."
		},
		{
			property: "og:title",
			content: "Suppliers — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Track who supplies the bar and what you still owe them."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./tabs-kTnrxw74.mjs");
var Route = createFileRoute("/_authenticated/tabs")({
	head: () => ({ meta: [
		{ title: "Running Bills — Silver Pub POS" },
		{
			name: "description",
			content: "Manage long-running customer tabs: add orders, take partial payments, print interim statements and settle bills."
		},
		{
			property: "og:title",
			content: "Running Bills — Silver Pub POS"
		},
		{
			property: "og:description",
			content: "Customer tab system with running balances and complete audit history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRoute = Route$17.update({
	id: "/_authenticated",
	getParentRoute: () => Route$19
});
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAuditRoute: Route$15.update({
		id: "/audit",
		path: "/audit",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCategoriesRoute: Route$14.update({
		id: "/categories",
		path: "/categories",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCustomersRoute: Route$13.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute: Route$12.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDispensingRoute: Route$11.update({
		id: "/dispensing",
		path: "/dispensing",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedExpensesRoute: Route$10.update({
		id: "/expenses",
		path: "/expenses",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedInventoryRoute: Route$9.update({
		id: "/inventory",
		path: "/inventory",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedPosRoute: Route$8.update({
		id: "/pos",
		path: "/pos",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedProductsRoute: Route$7.update({
		id: "/products",
		path: "/products",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedPurchasesRoute: Route$6.update({
		id: "/purchases",
		path: "/purchases",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedReportsRoute: Route$5.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedSettingsRoute: Route$4.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedShiftsRoute: Route$3.update({
		id: "/shifts",
		path: "/shifts",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedStaffRoute: Route$2.update({
		id: "/staff",
		path: "/staff",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedSuppliersRoute: Route$1.update({
		id: "/suppliers",
		path: "/suppliers",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedTabsRoute: Route.update({
		id: "/tabs",
		path: "/tabs",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
