"use client";

interface NumericTextFieldProps {
  label?: string;
  value: string;
  onChange: (digitsOnly: string) => void;
  placeholder?: string;
  prefix?: string;
  className?: string;
  "aria-label"?: string;
}

/** Input angka digit-only (untuk qty, harga, nilai diskon, persen PPN). */
export function NumericTextField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  className,
  "aria-label": ariaLabel,
}: NumericTextFieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label ? (
        <span className="text-xs font-medium text-foreground/70">{label}</span>
      ) : null}
      <div className="flex items-center gap-1 rounded-lg border border-foreground/15 px-3 py-2 focus-within:border-foreground/40">
        {prefix ? (
          <span className="text-sm text-foreground/50">{prefix}</span>
        ) : null}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          className="w-full bg-transparent text-right text-sm outline-none"
        />
      </div>
    </label>
  );
}
