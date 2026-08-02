import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState } from "@/components/ui/premium";
import { Input } from "@/components/ui/input";
import { dateTime, displayName, daysAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/audit")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Audit Logs — Silver Pub POS" },
      { name: "description", content: "Full audit trail of staff actions across the POS and stock modules." },
      { property: "og:title", content: "Audit Logs — Silver Pub POS" },
      { property: "og:description", content: "Who did what, when — voids, edits, refunds and approvals." },
    ],
  }),
  component: AuditPage,
});

type Log = {
  id: string;
  actor_name: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  created_at: string;
};

function AuditPage() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("id,actor_name,action,entity,entity_id,created_at")
        .gte("created_at", daysAgo(29).toISOString())
        .order("created_at", { ascending: false });
      return (data ?? []) as Log[];
    },
  });

  const logs = (data ?? []).filter(
    (l) =>
      l.action.toLowerCase().includes(q.toLowerCase()) ||
      (l.entity ?? "").toLowerCase().includes(q.toLowerCase()) ||
      displayName(l.actor_name).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Accountability trail for the last 30 days" />

      <GlassPanel>
        <Input
          placeholder="Filter by action, module or staff"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mb-4 max-w-sm"
        />
        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading audit trail…</p>
        ) : logs.length === 0 ? (
          <EmptyState title="No activity logged" description="Sensitive actions will be recorded here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Staff</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2">Module</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-muted-foreground">{dateTime(l.created_at)}</td>
                    <td className="py-3 pr-4 capitalize">{displayName(l.actor_name)}</td>
                    <td className="py-3 pr-4 font-medium">{l.action}</td>
                    <td className="py-3 capitalize text-muted-foreground">{l.entity || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
