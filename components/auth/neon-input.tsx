export function NeonInput({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-widest text-[var(--muted)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/25 disabled:opacity-50"
      />
    </div>
  );
}
