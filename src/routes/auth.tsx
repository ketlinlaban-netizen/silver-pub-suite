import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Sign In — Silver Pub POS" },
      {
        name: "description",
        content: "Secure staff sign in for the Silver Pub POS and bar management system.",
      },
      { property: "og:title", content: "Staff Sign In — Silver Pub POS" },
      {
        property: "og:description",
        content: "Accounts are created by the administrator. Sign in to open your shift.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (session) void navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Sign in failed");
      return;
    }
    toast.success("Welcome back");
    void navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div className="pointer-events-none absolute -left-24 top-1/3 size-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl gold-surface font-display text-lg font-bold">
            SP
          </div>
          <div>
            <p className="font-display text-xl font-semibold gold-text">SILVER PUB</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              POS &amp; Bar Management
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Run the bar at <span className="gold-text">full speed</span>.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Rapid checkout, running customer tabs, dispensing reconciliation, shift
            accountability and executive analytics — in one premium cloud system built for
            Kenyan hospitality.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Sub-10 second checkout on touch terminals",
              "Live running bills with full audit history",
              "Shift variance & dispensing reconciliation",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Silver Pub. Cloud-based. Always in sync.
        </p>
      </div>

      <div className="grid place-items-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card w-full max-w-md p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-primary/30 text-primary">
              <Lock className="size-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Staff Sign In</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Accounts are issued by the administrator. There is no public sign-up.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="cashier@silverpub.co.ke"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Forgot your password? Ask an administrator to reset it for you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
