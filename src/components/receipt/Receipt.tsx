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
          <p className="font-bold uppercase">{it.name}</p>
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
      <p className="mt-1 text-center text-[10px]">Powered by Silver Pub POS</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-black" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
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
