// Dashboard data cache that preserves data across auth failures
let cachedDashboardData: any = null;
let cacheTimestamp: number = 0;

export function cacheDashboardData(data: any) {
  cachedDashboardData = data;
  cacheTimestamp = Date.now();
  console.log("[DASHBOARD_CACHE] Data cached at", new Date(cacheTimestamp).toISOString());
}

export function getCachedDashboardData() {
  if (!cachedDashboardData) return null;
  const age = Date.now() - cacheTimestamp;
  console.log("[DASHBOARD_CACHE] Retrieved cached data (age: " + age + "ms)");
  return cachedDashboardData;
}

export function clearDashboardCache() {
  cachedDashboardData = null;
  cacheTimestamp = 0;
  console.log("[DASHBOARD_CACHE] Cache cleared");
}
