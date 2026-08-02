//#region node_modules/.nitro/vite/services/ssr/assets/format-CUq4cxR5.js
var KES = new Intl.NumberFormat("en-KE", {
	style: "currency",
	currency: "KES",
	maximumFractionDigits: 2
});
var money = (n) => KES.format(Number(n ?? 0));
var num = (n, digits = 0) => new Intl.NumberFormat("en-KE", {
	minimumFractionDigits: digits,
	maximumFractionDigits: digits
}).format(Number(n ?? 0));
var dateTime = (v) => v ? new Date(v).toLocaleString("en-KE", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
}) : "—";
var shortDate = (v) => v ? new Date(v).toLocaleDateString("en-KE", {
	day: "2-digit",
	month: "short"
}) : "—";
var timeOnly = (v) => v ? new Date(v).toLocaleTimeString("en-KE", {
	hour: "2-digit",
	minute: "2-digit"
}) : "—";
var startOfToday = () => {
	const d = /* @__PURE__ */ new Date();
	d.setHours(0, 0, 0, 0);
	return d;
};
var daysAgo = (n) => {
	const d = startOfToday();
	d.setDate(d.getDate() - n);
	return d;
};
var ROLE_LABELS = {
	administrator: "Administrator",
	manager: "Manager",
	cashier: "Cashier",
	store_keeper: "Store Keeper",
	supervisor: "Supervisor",
	owner: "Owner"
};
var displayName = (v) => {
	const s = (v ?? "").trim();
	if (!s) return "Staff";
	return s.includes("@") ? s.split("@")[0].replace(/[._-]+/g, " ") : s;
};
//#endregion
export { money as a, startOfToday as c, displayName as i, timeOnly as l, dateTime as n, num as o, daysAgo as r, shortDate as s, ROLE_LABELS as t };
