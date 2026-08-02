import { useCallback } from "react";

// Track refresh token attempts to prevent loops
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 5;
const REFRESH_RESET_TIME = 60000; // Reset counter after 1 minute

setInterval(() => {
  if (refreshAttempts > 0) {
    console.log("[RATE_LIMIT] Resetting refresh attempts counter");
    refreshAttempts = 0;
  }
}, REFRESH_RESET_TIME);

export function useSupabaseWithRetry() {
  const logRetry = useCallback((context: string, attempt: number, error: any) => {
    const status = error?.status || error?.response?.status;
    const message = error?.message || String(error);
    console.warn(
      `[SUPABASE_RETRY:${context}] Attempt ${attempt}: Status ${status} - ${message}`
    );
  }, []);

  const checkRateLimit = useCallback(() => {
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.error(
        `[RATE_LIMIT] Too many refresh attempts (${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}). Backing off.`
      );
      return true;
    }
    refreshAttempts++;
    return false;
  }, []);

  return { logRetry, checkRateLimit, refreshAttempts: () => refreshAttempts };
}
