import { money, dateTime } from "@/lib/format";

export type ReceiptData = {
  business: {
    business_name: string;
    phone: string | null;
    address: string | null;
    till_number: string | null;
    receipt_footer: string | null;
  } | null;
  receiptNumber: string;
  date: string;
  cashier: string;
  customer?: string | null;
  tableNumber?: string | null;
  items: { name: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  previousBalance?: number;
  paid?: number;
  amountReceived?: number;
  changeDue?: number;
  outstanding?: number;
  method: string;
  status: "PAID" | "DUE" | "STATEMENT";
  copyLabel?: string;
};

export function Receipt({ data }: { data: ReceiptData }) {
  const b = data.business;
  return (
    <div
      id="receipt-print-area"
      className="mx-auto w-full max-w-[320px] rounded-xl bg-white p-4 font-mono text-[12px] leading-tight text-black"
    >
      <div className="text-center">
        <p className="text-lg font-black tracking-wider">{b?.business_name ?? "SILVER PUB"}</p>
        {b?.address && <p>{b.address}</p>}
        {b?.phone && <p>Tel: {b.phone}</p>}
        {b?.till_number && <p className="font-bold">Till: {b.till_number}</p>}
      </div>

      <Divider />
      <Row label="Receipt" value={data.receiptNumber} bold />
      <Row label="Date" value={dateTime(data.date)} />
      <Row label="Cashier" value={data.cashier} />
      {data.customer && <Row label="Customer" value={data.customer} />}
      {data.tableNumber && <Row label="Table" value={data.tableNumber} />}
      <Divider />

      {data.items.map((it, i) => (
        <div key={i} className="mb-1">
          <p className="font-bold uppercase break-words">{it.name}</p>
          <div className="flex justify-between">
            <span>
              {it.quantity} x {money(it.unitPrice)}
            </span>
            <span className="font-bold">{money(it.total)}</span>
          </div>
        </div>
      ))}

      <Divider />
      <Row label="Subtotal" value={money(data.subtotal)} />
      {data.discount > 0 && <Row label="Discount" value={`- ${money(data.discount)}`} />}
      {data.tax > 0 && <Row label="Tax" value={money(data.tax)} />}
      {typeof data.previousBalance === "number" && data.previousBalance > 0 && (
        <Row label="Previous balance" value={money(data.previousBalance)} />
      )}
      <div className="my-1 border-y-2 border-black py-1">
        <div className="flex justify-between text-base font-black">
          <span>TOTAL</span>
          <span>{money(data.total)}</span>
        </div>
      </div>
      <Row label="Payment" value={data.method.toUpperCase()} />
      {typeof data.paid === "number" && <Row label="Paid" value={money(data.paid)} />}
      {typeof data.amountReceived === "number" && data.amountReceived > 0 && (
        <Row label="Received" value={money(data.amountReceived)} />
      )}
      {typeof data.changeDue === "number" && data.changeDue > 0 && (
        <Row label="Change" value={money(data.changeDue)} bold />
      )}
      {typeof data.outstanding === "number" && data.outstanding > 0 && (
        <Row label="BALANCE DUE" value={money(data.outstanding)} bold />
      )}

      <Divider />
      <p className="text-center text-xl font-black tracking-[0.3em]">{data.status}</p>
      {data.copyLabel && (
        <p className="text-center text-[10px] font-bold uppercase">{data.copyLabel}</p>
      )}
      <p className="mt-2 text-center">{b?.receipt_footer ?? "Thank you!"}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-black" : ""}`}>
      <span className="break-words">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-1 border-t border-dashed border-black" />;
}

export function printReceipt() {
  if (typeof window === "undefined") return;
  const node = document.getElementById("receipt-print-area");
  if (!node) return;
  
  // 80mm thermal printer dimensions: ~384px at 48dpi = ~280-300px in CSS
  const win = window.open("", "_blank", "width=350,height=600");
  if (!win) return;
  
  const html = node.outerHTML;
  
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt</title>
  <style>
    @page {
      margin: 0;
      size: 80mm auto;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: white;
      }
      .no-print {
        display: none;
      }
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #000;
      background: white;
      margin: 0;
      padding: 4mm;
      width: 80mm;
      box-sizing: border-box;
    }
    #receipt-print-area {
      width: 100%;
      font-weight: 600;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    p {
      margin: 4px 0;
      font-weight: 600;
    }
    .text-center {
      text-align: center;
    }
    .text-lg {
      font-size: 16px;
      font-weight: 900;
    }
    .font-black {
      font-weight: 900;
    }
    .font-bold {
      font-weight: 700;
    }
    .tracking-wider {
      letter-spacing: 0.05em;
    }
    .tracking-\\[0.3em\\] {
      letter-spacing: 0.3em;
    }
    .border-t {
      border-top: 1px solid #000;
    }
    .border-dashed {
      border-style: dashed;
    }
    .border-black {
      border-color: #000;
    }
    .border-y-2 {
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
    }
    .my-1 {
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .py-1 {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .mt-1 {
      margin-top: 4px;
    }
    .mt-2 {
      margin-top: 8px;
    }
    .mb-1 {
      margin-bottom: 4px;
    }
    .flex {
      display: flex;
      justify-content: space-between;
    }
    .uppercase {
      text-transform: uppercase;
    }
    .break-words {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    div {
      margin: 0;
    }
  </style>
</head>
<body>${html}</body>
</html>`);
  
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 300);
}
