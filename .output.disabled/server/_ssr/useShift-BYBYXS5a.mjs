import { t as supabase } from "./client-DalDhuxz.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Dg7UaUpz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useShift-BYBYXS5a.js
function useActiveShift() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["active-shift", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("shifts").select("*").eq("cashier_id", user.id).eq("status", "open").order("opened_at", { ascending: false }).limit(1).maybeSingle();
			if (error) throw error;
			return data ?? null;
		}
	});
}
//#endregion
export { useActiveShift as t };
