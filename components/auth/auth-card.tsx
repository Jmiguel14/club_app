export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/90 p-8 shadow-[0_0_60px_-12px_var(--glow)] backdrop-blur-md">
      <div className="mb-8 text-center">
        <h1 className="[font-family:var(--font-display)] text-4xl tracking-[0.2em] text-[var(--accent)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
