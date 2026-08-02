import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "administrator"
  | "manager"
  | "cashier"
  | "store_keeper"
  | "supervisor"
  | "owner";

export type Profile = {
  id: string;
  full_name: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  status: string;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  isManager: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (uid: string | undefined) => {
    if (!uid) {
      setProfile(null);
      setRoles([]);
      return;
    }
    try {
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid),
      ]);
      setProfile((p as Profile) ?? null);
      setRoles(((r ?? []) as { role: AppRole }[]).map((x) => x.role));
    } catch (error) {
      setProfile(null);
      setRoles([]);
    }
  };

  useEffect(() => {
    let active = true;

    // Auth state listener first — never awaits network work inside the callback.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      setLoading(false);
      if (!s) {
        setProfile(null);
        setRoles([]);
      } else {
        // Profile/roles hydrate in the background; the UI never blocks on them.
        setTimeout(() => {
          if (active) void load(s.user.id);
        }, 0);
      }
    });

    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setSession(data.session);
        setLoading(false);
        if (data.session?.user.id) void load(data.session.user.id);
      } catch {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      roles,
      isManager: roles.some((r) =>
        ["administrator", "owner", "manager"].includes(r),
      ),
      isAdmin: roles.some((r) => ["administrator", "owner"].includes(r)),
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refresh: async () => load(session?.user.id),
    }),
    [loading, session, profile, roles],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
