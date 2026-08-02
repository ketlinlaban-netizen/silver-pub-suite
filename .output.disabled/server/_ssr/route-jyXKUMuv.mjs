import { a as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as displayName } from "./format-CUq4cxR5.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LayoutDashboard, C as Package, D as LogOut, E as Menu, H as Boxes, M as Clock3, N as ClipboardList, U as Beer, V as ChartColumn, _ as ScrollText, a as Truck, h as Settings, i as UserCog, l as Tags, n as Wallet, p as ShoppingCart, r as Users, t as X, y as ReceiptText } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-jyXKUMuv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		group: "Operations",
		items: [
			{
				to: "/dashboard",
				label: "Dashboard",
				icon: LayoutDashboard
			},
			{
				to: "/pos",
				label: "Cashier POS",
				icon: ShoppingCart
			},
			{
				to: "/tabs",
				label: "Running Bills",
				icon: ReceiptText
			},
			{
				to: "/customers",
				label: "Customers",
				icon: Users
			},
			{
				to: "/shifts",
				label: "Shifts",
				icon: Clock3
			},
			{
				to: "/dispensing",
				label: "Dispensing",
				icon: Beer
			}
		]
	},
	{
		group: "Stock",
		items: [
			{
				to: "/products",
				label: "Products",
				icon: Package
			},
			{
				to: "/categories",
				label: "Categories",
				icon: Tags
			},
			{
				to: "/inventory",
				label: "Inventory",
				icon: Boxes
			},
			{
				to: "/purchases",
				label: "Purchases",
				icon: ClipboardList
			},
			{
				to: "/suppliers",
				label: "Suppliers",
				icon: Truck
			}
		]
	},
	{
		group: "Business",
		items: [
			{
				to: "/expenses",
				label: "Expenses",
				icon: Wallet
			},
			{
				to: "/reports",
				label: "Reports",
				icon: ChartColumn
			},
			{
				to: "/staff",
				label: "Staff & Roles",
				icon: UserCog,
				managerOnly: true
			},
			{
				to: "/audit",
				label: "Audit Logs",
				icon: ScrollText
			},
			{
				to: "/settings",
				label: "Settings",
				icon: Settings
			}
		]
	}
];
function AppShell({ children }) {
	const { profile, roles, signOut, isManager } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const staffName = profile?.full_name?.trim() || displayName(profile?.email);
	const initials = staffName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "SP";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen lg:grid lg:grid-cols-[272px_1fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("hide-print fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-6 py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-11 place-items-center rounded-2xl gold-surface font-display text-lg font-bold",
								children: "SP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold gold-text",
									children: "SILVER PUB"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
									children: "POS & Bar Suite"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ml-auto lg:hidden",
								onClick: () => setOpen(false),
								"aria-label": "Close menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-6 overflow-y-auto px-4 pb-6",
						children: NAV.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
							children: section.group
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: section.items.filter((i) => !i.managerOnly || isManager).map((item) => {
								const active = path.startsWith(item.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: cn("size-[18px] transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-primary") }), item.label]
								}, item.to);
							})
						})] }, section.group))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-sidebar-border p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 shrink-0 place-items-center rounded-full border border-primary/40 text-sm font-semibold text-primary",
									children: initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold capitalize",
										children: staffName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs capitalize text-muted-foreground",
										children: roles[0]?.replace("_", " ") || "staff"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => void signOut(),
									"aria-label": "Sign out",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
								})
							]
						})
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/60 lg:hidden",
				onClick: () => setOpen(false),
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "hide-print sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-KE", {
								weekday: "long",
								day: "numeric",
								month: "long",
								year: "numeric"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pos",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-1 size-4" }), " Open POS"]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 lg:px-8",
					children
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
