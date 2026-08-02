import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as money, n as dateTime } from "./format-CUq4cxR5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Receipt-CIBIi_WA.js
var import_jsx_runtime = require_jsx_runtime();
function Receipt({ data }) {
	const b = data.business;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "receipt-print-area",
		className: "mx-auto w-full max-w-[320px] rounded-xl bg-white p-4 font-mono text-[12px] leading-tight text-black",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-black tracking-wider",
						children: b?.business_name ?? "SILVER PUB"
					}),
					b?.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: b.address }),
					b?.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Tel: ", b.phone] }),
					b?.till_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold",
						children: ["Till: ", b.till_number]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Receipt",
				value: data.receiptNumber,
				bold: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Date",
				value: dateTime(data.date)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Cashier",
				value: data.cashier
			}),
			data.customer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Customer",
				value: data.customer
			}),
			data.tableNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Table",
				value: data.tableNumber
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
			data.items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold uppercase",
					children: it.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						it.quantity,
						" x ",
						money(it.unitPrice)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: money(it.total)
					})]
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Subtotal",
				value: money(data.subtotal)
			}),
			data.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Discount",
				value: `- ${money(data.discount)}`
			}),
			data.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Tax",
				value: money(data.tax)
			}),
			typeof data.previousBalance === "number" && data.previousBalance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Previous balance",
				value: money(data.previousBalance)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-1 border-y-2 border-black py-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-base font-black",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(data.total) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Payment",
				value: data.method.toUpperCase()
			}),
			typeof data.paid === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Paid",
				value: money(data.paid)
			}),
			typeof data.amountReceived === "number" && data.amountReceived > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Received",
				value: money(data.amountReceived)
			}),
			typeof data.changeDue === "number" && data.changeDue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Change",
				value: money(data.changeDue),
				bold: true
			}),
			typeof data.outstanding === "number" && data.outstanding > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "BALANCE DUE",
				value: money(data.outstanding),
				bold: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xl font-black tracking-[0.3em]",
				children: data.status
			}),
			data.copyLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] font-bold uppercase",
				children: data.copyLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center",
				children: b?.receipt_footer ?? "Thank you!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-[10px]",
				children: "Powered by Silver Pub POS"
			})
		]
	});
}
function Row({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${bold ? "font-black" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
function Divider() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 border-t border-dashed border-black" });
}
function printReceipt() {
	if (typeof window === "undefined") return;
	const node = document.getElementById("receipt-print-area");
	if (!node) return;
	const win = window.open("", "_blank", "width=420,height=640");
	if (!win) return;
	win.document.write(`<html><head><title>Receipt</title>
    <style>
      @page { margin: 4mm; }
      body { font-family: ui-monospace, monospace; font-size: 12px; color:#000; }
      .r { width: 100%; max-width: 300px; margin: 0 auto; }
      .flex { display:flex; justify-content:space-between; }
      .b { font-weight: 900; }
      .c { text-align:center; }
      .dash { border-top: 1px dashed #000; margin: 4px 0; }
    </style></head><body>${node.outerHTML}</body></html>`);
	win.document.close();
	win.focus();
	setTimeout(() => {
		win.print();
		win.close();
	}, 250);
}
//#endregion
export { printReceipt as n, Receipt as t };
