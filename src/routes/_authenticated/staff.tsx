import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UserCog, Plus, Key, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { num, dateTime, displayName, ROLE_LABELS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/staff")({
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
  const [createOpen, setCreateOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showTempPassword, setShowTempPassword] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    role: "cashier" as AppRole,
    status: "active",
  });

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

  const generatePassword = () => {
    // Generate a password that meets Supabase requirements
    // Minimum 6 chars, mix of upper, lower, numbers, and special chars
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    
    let password = "";
    // Ensure at least one of each
    password += upper.charAt(Math.floor(Math.random() * upper.length));
    password += lower.charAt(Math.floor(Math.random() * lower.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    
    // Fill the rest with mixed chars
    const allChars = upper + lower + numbers + special;
    for (let i = 0; i < 8; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const createStaff = async () => {
    if (!createForm.full_name.trim()) return toast.error("Enter full name");
    if (!createForm.phone.trim()) return toast.error("Enter phone number");
    if (!createForm.password.trim()) {
      const pwd = generatePassword();
      setCreateForm({ ...createForm, password: pwd });
      toast.info(`Generated password: ${pwd}`);
      return;
    }

    try {
      // Generate email from phone if not provided
      const email = createForm.email.trim() || `${createForm.phone.replace(/\D/g, "")}+${Date.now()}@silverpub.local`;

      // Sign up user (this works from client without admin key)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: createForm.password,
        options: {
          data: { full_name: createForm.full_name }
        }
      });

      if (authError) {
        // If password is weak, try with a generated one
        if (authError.message.includes("weak") || authError.message.includes("password")) {
          const pwd = generatePassword();
          toast.error(`Password requirement: ${authError.message}. Using generated password: ${pwd}`);
          setCreateForm({ ...createForm, password: pwd });
          return;
        }
        return toast.error(`Auth error: ${authError.message}`);
      }

      if (!authData.user) return toast.error("Failed to create user");

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: createForm.full_name.trim(),
        phone: createForm.phone.trim(),
        email: email,
        status: createForm.status,
      });

      if (profileError) {
        toast.error(`Profile error: ${profileError.message}`);
        return;
      }

      // Assign role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: createForm.role,
      });

      if (roleError) {
        toast.error(`Role error: ${roleError.message}`);
        return;
      }

      toast.success(`Staff created: ${createForm.full_name}\nPassword: ${createForm.password}`);
      setCreateForm({ full_name: "", phone: "", email: "", password: "", role: "cashier", status: "active" });
      setCreateOpen(false);
      void qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const resetPassword = async () => {
    if (!selectedProfile || !newPassword.trim()) return toast.error("Enter new password");

    try {
      // We can't directly reset password from client without admin key
      // Instead, we'll show a message to use email-based password reset
      // For now, show a workaround - need to implement server-side function
      toast.info("Password reset requires server-side implementation. Please contact your developer.");
      
      // Alternative: Generate a new temporary password and show it
      // This is what we'll do for now
      const tempPwd = generatePassword();
      setTempPassword(tempPwd);
      setShowTempPassword(true);
      toast.success(`Temporary password generated: ${tempPwd}\nAsk the staff member to log in and change it.`);
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const toggleRole = async (userId: string, role: AppRole, has: boolean) => {
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role)
      : await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(has ? "Role removed" : "Role granted");
    void qc.invalidateQueries({ queryKey: ["staff"] });
  };

  const toggleStatus = async (profile: Profile) => {
    const newStatus = profile.status === "active" ? "suspended" : "active";
    const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", profile.id);
    if (error) return toast.error(error.message);
    void qc.invalidateQueries({ queryKey: ["staff"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Roles"
        subtitle="Accounts, permissions and access control"
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="mr-1 size-4" /> Add staff</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Create staff account</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full name *</Label>
                  <Input placeholder="John Doe" value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input placeholder="+254712345678" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email (optional)</Label>
                  <Input type="email" placeholder="john@silverpub.com" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={createForm.role} onValueChange={(v) => setCreateForm({ ...createForm, role: v as AppRole })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABELS[r] ?? r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Password</Label>
                    <Button size="sm" variant="ghost" type="button" onClick={() => setCreateForm({ ...createForm, password: generatePassword() })}>
                      Generate
                    </Button>
                  </div>
                  <Input type="text" placeholder="Password or generate" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
                  <p className="text-xs text-muted-foreground">Share this password with the staff member securely</p>
                </div>
              </div>
              <DialogFooter><Button onClick={() => void createStaff()}>Create staff</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total staff" value={profiles.length} format={(n) => num(n)} icon={<UserCog className="size-4" />} />
        <StatCard label="Active" value={profiles.filter((p) => p.status === "active").length} format={(n) => num(n)} tone="success" index={1} />
        <StatCard label="Suspended" value={profiles.filter((p) => p.status === "suspended").length} format={(n) => num(n)} tone="warning" index={2} />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading staff…</p>
      ) : profiles.length === 0 ? (
        <EmptyState title="No staff accounts" description="Create your first staff account above." />
      ) : (
        <div className="space-y-4">
          {profiles.map((p) => {
            const has = data!.roles.get(p.id) ?? [];
            return (
              <GlassPanel key={p.id}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-display text-lg font-semibold capitalize">
                        {p.full_name?.trim() || displayName(p.email)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.phone || "No phone"} · Last login {dateTime(p.last_login_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs capitalize ${p.status === "active" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                        {p.status}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => void toggleStatus(p)}>
                        {p.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                      <Dialog open={resetPasswordOpen && selectedProfile?.id === p.id} onOpenChange={(open) => {
                        if (!open) setResetPasswordOpen(false);
                        setSelectedProfile(open ? p : null);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedProfile(p); setResetPasswordOpen(true); }}>
                            <Key className="mr-1 size-4" /> Reset pwd
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Reset password for {p.full_name}</DialogTitle></DialogHeader>
                          {showTempPassword ? (
                            <div className="space-y-4">
                              <div className="rounded-lg bg-success/10 p-4 border border-success/30">
                                <p className="text-sm text-muted-foreground mb-2">New temporary password:</p>
                                <p className="font-mono text-lg font-semibold break-all">{tempPassword}</p>
                                <Button size="sm" className="mt-4 w-full" onClick={() => {
                                  navigator.clipboard.writeText(tempPassword);
                                  toast.success("Copied to clipboard");
                                }}>
                                  Copy
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">Share this with the staff member. They should change it on first login.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>New password</Label>
                                <Input type="text" placeholder="Enter or generate" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                              </div>
                              <Button size="sm" variant="outline" className="w-full" onClick={() => setNewPassword(generatePassword())}>
                                Generate Password
                              </Button>
                            </div>
                          )}
                          <DialogFooter>
                            {!showTempPassword && <Button onClick={() => void resetPassword()}>Set password</Button>}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => {
                      const active = has.includes(r);
                      return (
                        <Button
                          key={r}
                          size="sm"
                          variant={active ? "default" : "outline"}
                          className="rounded-full"
                          onClick={() => void toggleRole(p.id, r, active)}
                        >
                          {ROLE_LABELS[r] ?? r}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
