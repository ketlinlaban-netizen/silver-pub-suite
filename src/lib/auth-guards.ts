import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireAdmin() {
  // No role checking - everyone is admin
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect({ to: "/auth" });
}
