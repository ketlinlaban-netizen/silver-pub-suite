import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/** Fast local session check — avoids a network round-trip on every navigation. */
export async function requireSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw redirect({ to: "/auth" });
  return data.session;
}

export async function requireAdmin() {
  await requireSession();
}
