"use client";

interface ReceiptMetaFieldsProps {
  number: string;
  date: string;
  buyerName: string;
  numberFormat: string;
  onNumberChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onBuyerNameChange: (value: string) => void;
}

export function ReceiptMetaFields({
  number,
  date,
  buyerName,
  numberFormat,
  onNumberChange,
  onDateChange,
  onBuyerNameChange,
}: ReceiptMetaFieldsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-4">
      <h2 className="text-sm font-semibold text-foreground/80">
        Detail Kwitansi
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground/70">
            Nomor kwitansi
          </span>
          <input
            type="text"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
          <span className="text-[11px] text-foreground/40">
            Format: {numberFormat} (ubah di Pengaturan)
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground/70">
            Tanggal
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/70">
          Nama pembeli (opsional)
        </span>
        <input
          type="text"
          value={buyerName}
          onChange={(e) => onBuyerNameChange(e.target.value)}
          className="rounded-lg border border-foreground/15 px-3 py-2 text-sm outline-none focus:border-foreground/40"
        />
      </label>
    </section>
  );
}
