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
  sessionExpired: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

let authLogCounter = 0;

function logAuth(event: string, details: any = {}) {
  authLogCounter++;
  const timestamp = new Date().toISOString();
  console.log(
    `[AUTH:${authLogCounter}] ${timestamp} ${event}`,
    Object.keys(details).length > 0 ? details : ""
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lastValidProfile, setLastValidProfile] = useState<Profile | null>(null);
  const [lastValidRoles, setLastValidRoles] = useState<AppRole[]>([]);

  const load = async (uid: string | undefined) => {
    if (!uid) {
      logAuth("PROFILE_LOAD_SKIPPED", { reason: "no uid" });
      setProfile(null);
      setRoles([]);
      return;
    }

    logAuth("PROFILE_LOAD_START", { uid });
    let attempts = 0;
    let lastError: any = null;

    while (attempts < 3) {
      try {
        const [{ data: p, error: pError }, { data: r, error: rError }] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
          supabase.from("user_roles").select("role").eq("user_id", uid),
        ]);

        // Handle profile errors
        if (pError) {
          if (pError.code === "PGRST116" || pError.code === "42883") {
            // Not found or missing table - use last valid profile
            logAuth("PROFILE_NOT_FOUND", { code: pError.code });
            setProfile(lastValidProfile);
          } else if (pError.code === "PGRST401" || pError.code === "401") {
            throw pError; // Auth error - retry
          } else {
            throw pError;
          }
        } else {
          const newProfile = (p as Profile) ?? null;
          setProfile(newProfile);
          if (newProfile) {
            setLastValidProfile(newProfile);
            logAuth("PROFILE_LOADED", { id: newProfile.id, name: newProfile.full_name });
          }
        }

        // Handle roles errors
        if (rError) {
          if (rError.code === "PGRST401" || rError.code === "401") {
            throw rError; // Auth error - retry
          }
          logAuth("ROLES_LOAD_ERROR", { code: rError.code });
          setRoles(lastValidRoles);
        } else {
          const newRoles = ((r ?? []) as { role: AppRole }[]).map((x) => x.role);
          setRoles(newRoles);
          setLastValidRoles(newRoles);
          logAuth("ROLES_LOADED", { roles: newRoles });
        }

        setAuthError(null);
        return; // Success
      } catch (error) {
        lastError = error;
        attempts++;

        const statusCode = (error as any)?.status;
        const errorCode = (error as any)?.code;

        logAuth("PROFILE_LOAD_ERROR", {
          attempt: attempts,
          status: statusCode,
          code: errorCode,
          message: (error as any)?.message,
        });

        // Only retry on auth/rate limit errors
        if (statusCode !== 401 && statusCode !== 429 && errorCode !== "PGRST401") {
          throw error; // Don't retry other errors
        }

        if (attempts < 3) {
          // Exponential backoff: 500ms, 1500ms, 4500ms
          const delay = Math.pow(3, attempts) * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // After all retries, preserve last valid state but mark error
    logAuth("PROFILE_LOAD_FAILED", { reason: "max retries", error: (lastError as any)?.message });
    setProfile(lastValidProfile);
    setRoles(lastValidRoles);
    
    if (lastError) {
      setAuthError((lastError as any)?.message || "Authentication error");
    }
  };

  useEffect(() => {
    let active = true;

    logAuth("AUTH_INIT_START");

    // Auth state listener — never awaits network work inside the callback
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;

      logAuth("AUTH_STATE_CHANGE", { event: _event, hasSession: !!s });

      setSession(s);

      if (!s) {
        logAuth("SESSION_CLEARED");
        setProfile(null);
        setRoles([]);
        setSessionExpired(true);
      } else {
        setSessionExpired(false);
        // Profile/roles hydrate in the background
        setTimeout(() => {
          if (active) void load(s.user.id);
        }, 0);
      }
    });

    // Initial session check
    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;

        logAuth("SESSION_RETRIEVED", { hasSession: !!data.session });
        setSession(data.session);

        if (data.session?.user.id) {
          void load(data.session.user.id);
        }
      } catch (error) {
        logAuth("SESSION_RETRIEVE_ERROR", { message: (error as any)?.message });
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
      logAuth("AUTH_CLEANUP");
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
        ["administrator", "owner", "manager"].includes(r)
      ),
      isAdmin: roles.some((r) => ["administrator", "owner"].includes(r)),
      sessionExpired,
      authError,
      signOut: async () => {
        logAuth("SIGNOUT_START");
        try {
          await supabase.auth.signOut();
          logAuth("SIGNOUT_SUCCESS");
        } catch (error) {
          logAuth("SIGNOUT_ERROR", { message: (error as any)?.message });
        }
      },
      refresh: async () => {
        logAuth("MANUAL_REFRESH");
        void load(session?.user.id);
      },
    }),
    [loading, session, profile, roles, sessionExpired, authError]
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
