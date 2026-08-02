import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, GlassPanel } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Account Settings — Silver Pub POS" },
      { name: "description", content: "Manage your account and change password." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { profile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword.trim()) {
      return toast.error("Enter current password");
    }
    if (!newPassword.trim()) {
      return toast.error("Enter new password");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      // First verify current password by attempting to refresh session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message || "Failed to update password");
        setLoading(false);
        return;
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your account and security"
      />

      <GlassPanel className="max-w-lg">
        <div className="mb-6 flex items-center gap-3">
          <Lock className="size-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </GlassPanel>
    </div>
  );
}
