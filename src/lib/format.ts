export const KES = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 2,
});

export const money = (n: number | null | undefined) => KES.format(Number(n ?? 0));

export const num = (n: number | null | undefined, digits = 0) =>
  new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(n ?? 0));

export const dateTime = (v: string | Date | null | undefined) =>
  v
    ? new Date(v).toLocaleString("en-KE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const shortDate = (v: string | Date | null | undefined) =>
  v ? new Date(v).toLocaleDateString("en-KE", { day: "2-digit", month: "short" }) : "—";

export const timeOnly = (v: string | Date | null | undefined) =>
  v ? new Date(v).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) : "—";

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const daysAgo = (n: number) => {
  const d = startOfToday();
  d.setDate(d.getDate() - n);
  return d;
};

export const ROLE_LABELS: Record<string, string> = {
  administrator: "Administrator",
  manager: "Manager",
  cashier: "Cashier",
  store_keeper: "Store Keeper",
  supervisor: "Supervisor",
  owner: "Owner",
};
