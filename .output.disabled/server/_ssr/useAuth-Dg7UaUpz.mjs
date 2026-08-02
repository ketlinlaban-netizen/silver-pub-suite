import { a as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DalDhuxz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-Dg7UaUpz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async (uid) => {
		if (!uid) {
			setProfile(null);
			setRoles([]);
			return;
		}
		const [{ data: p }, { data: r }] = await Promise.all([supabase.from("profiles").select("*").eq("id", uid).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", uid)]);
		setProfile(p ?? null);
		setRoles((r ?? []).map((x) => x.role));
	};
	(0, import_react.useEffect)(() => {
		let active = true;
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			if (!active) return;
			setSession(s);
			if (!s) {
				setProfile(null);
				setRoles([]);
			} else setTimeout(() => void load(s.user.id), 0);
		});
		supabase.auth.getSession().then(async ({ data }) => {
			if (!active) return;
			setSession(data.session);
			await load(data.session?.user.id);
			setLoading(false);
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		loading,
		session,
		user: session?.user ?? null,
		profile,
		roles,
		isManager: roles.some((r) => [
			"administrator",
			"owner",
			"manager"
		].includes(r)),
		isAdmin: roles.some((r) => ["administrator", "owner"].includes(r)),
		signOut: async () => {
			await supabase.auth.signOut();
		},
		refresh: async () => load(session?.user.id)
	}), [
		loading,
		session,
		profile,
		roles
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
