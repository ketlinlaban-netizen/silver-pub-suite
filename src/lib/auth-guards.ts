import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/** Fast local session check — avoids a network round-trip on every navigation. */
export async function requireSession() {
  const { data, error } = await supabase.auth.getSession();
  console.info("[auth] route guard session check", {
    hasSession: Boolean(data.session),
    error: error?.message ?? null,
  });
  if (error || !data.session) {
    console.warn("[auth] session not available for protected route", error?.message ?? null);
    throw redirect({ to: "/auth" });
  }
  return data.session;
}

export async function requireAdmin() {
  await requireSession();
}
