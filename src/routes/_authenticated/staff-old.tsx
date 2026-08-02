import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { num, dateTime, displayName, ROLE_LABELS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/staff-old")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Staff & Roles — Silver Pub POS" },
      { name: "description", content: "Manage bar staff accounts and role-based permissions." },
      { property: "og:title", content: "Staff & Roles — Silver Pub POS" },
      { property: "og:description", content: "Assign cashier, supervisor and manager roles to your team." },
    ],
  }),
  component: StaffPage,
});

const ROLES: AppRole[] = ["administrator", "owner", "manager", "supervisor", "cashier", "store_keeper"];

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  last_login_at: string | null;
};

function StaffPage() {
  const qc = useQueryClient();
  const { isManager } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,email,phone,status,last_login_at"),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      const map = new Map<string, AppRole[]>();
      for (const r of (roles ?? []) as { user_id: string; role: AppRole }[]) {
        map.set(r.user_id, [...(map.get(r.user_id) ?? []), r.role]);
      }
      return { profiles: (profiles ?? []) as Profile[], roles: map };
    },
  });

  const profiles = data?.profiles ?? [];

  const toggleRole = async (userId: string, role: AppRole, has: boolean) => {
    if (!isManager) return toast.error("Only managers can change roles");
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role)
      : await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(has ? "Role removed" : "Role granted");
    void qc.invalidateQueries({ queryKey: ["staff"] });
  };

  return (
    <div>
      <PageHeader title="Staff & Roles" subtitle="Accounts, permissions and access control" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Staff accounts" value={profiles.length} format={(n) => num(n)} icon={<UserCog className="size-4" />} />
        <StatCard
          label="Active"
          value={profiles.filter((p) => p.status === "active").length}
          format={(n) => num(n)}
          tone="success"
          index={1}
        />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading staff…</p>
      ) : profiles.length === 0 ? (
        <EmptyState title="No staff accounts" description="Accounts are created by the administrator." />
      ) : (
        <div className="space-y-4">
          {profiles.map((p) => {
            const has = data!.roles.get(p.id) ?? [];
            return (
              <GlassPanel key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold capitalize">
                      {p.full_name?.trim() || displayName(p.email)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.phone || "No phone"} · Last login {dateTime(p.last_login_at)}
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs capitalize text-muted-foreground">
                    {p.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const active = has.includes(r);
                    return (
                      <Button
                        key={r}
                        size="sm"
                        variant={active ? "default" : "outline"}
                        className="rounded-full"
                        disabled={!isManager}
                        onClick={() => void toggleRole(p.id, r, active)}
                      >
                        {ROLE_LABELS[r] ?? r}
                      </Button>
                    );
                  })}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
