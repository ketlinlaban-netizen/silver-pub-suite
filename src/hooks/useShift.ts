import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Shift = {
  id: string;
  cashier_id: string;
  cashier_name: string;
  opened_at: string;
  opening_cash: number;
  opening_mpesa: number;
  status: string;
  notes: string | null;
};

export function useActiveShift() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["active-shift", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("cashier_id", user!.id)
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as Shift | null) ?? null;
    },
  });
}
