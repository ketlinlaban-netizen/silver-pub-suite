import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BusinessSettings = {
  id: string;
  business_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  till_number: string | null;
  currency: string | null;
  tax_rate: number | null;
  receipt_footer: string | null;
  receipt_width: string | null;
};

/**
 * Shared business settings query. Always refetched on mount / focus so receipts
 * immediately reflect changes saved in Settings.
 */
export function useBusinessSettings() {
  const query = useQuery({
    queryKey: ["business-settings"],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data } = await supabase
        .from("business_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return (data ?? null) as BusinessSettings | null;
    },
  });

  return {
    settings: query.data ?? null,
    receiptWidth: query.data?.receipt_width ?? "80mm",
  };
}
