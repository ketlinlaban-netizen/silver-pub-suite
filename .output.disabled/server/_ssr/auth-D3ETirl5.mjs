import { a as __toESM } from "../_runtime.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { O as Lock, k as LoaderCircle, m as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D3ETirl5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(6, "Password must be at least 6 characters").max(72)
});
function AuthPage() {
	const navigate = useNavigate();
	const { session } = useAuth();
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	(0, import_react.useEffect)(() => {
		if (session) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [session, navigate]);
	const onSubmit = async (values) => {
		setSubmitting(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password
		});
		setSubmitting(false);
		if (error) {
			toast.error(error.message || "Sign in failed");
			return;
		}
		toast.success("Welcome back");
		navigate({
			to: "/dashboard",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-24 top-1/3 size-[420px] rounded-full bg-primary/10 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-2xl gold-surface font-display text-lg font-bold",
						children: "SP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold gold-text",
						children: "SILVER PUB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.22em] text-muted-foreground",
						children: "POS & Bar Management"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-4xl font-semibold leading-tight",
							children: [
								"Run the bar at ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gold-text",
									children: "full speed"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted-foreground",
							children: "Rapid checkout, running customer tabs, dispensing reconciliation, shift accountability and executive analytics — in one premium cloud system built for Kenyan hospitality."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-3",
							children: [
								"Sub-10 second checkout on touch terminals",
								"Live running bills with full audit history",
								"Shift variance & dispensing reconciliation"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), t]
							}, t))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Silver Pub. Cloud-based. Always in sync."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 18
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .45,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "glass-card w-full max-w-md p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-primary/30 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold",
								children: "Staff Sign In"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Accounts are issued by the administrator. There is no public sign-up."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: form.handleSubmit(onSubmit),
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Work email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										autoComplete: "username",
										placeholder: "cashier@silverpub.co.ke",
										...form.register("email")
									}),
									form.formState.errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: form.formState.errors.email.message
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: "current-password",
										placeholder: "••••••••",
										...form.register("password")
									}),
									form.formState.errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: form.formState.errors.password.message
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "h-11 w-full rounded-xl",
								disabled: submitting,
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Sign in"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: "Forgot your password? Ask an administrator to reset it for you."
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
