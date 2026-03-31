"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { ui } from "@/lib/i18n/ui";
import { useAuthStore } from "@/store/auth-store";

const nav = [
  { href: "/dashboard", label: ui.nav.controlRoom },
  { href: "/dashboard/apartments", label: ui.nav.roster },
  { href: "/dashboard/products", label: ui.nav.catalog },
  { href: "/dashboard/invoices", label: ui.nav.tabs },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useAuthHydration();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-violet-500/20" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-white/10 bg-black/25 px-4 py-4 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-2">
          <Link
            href="/dashboard"
            className="shrink-0 [font-family:var(--font-display)] text-xl tracking-[0.18em] text-[var(--accent)] transition-opacity hover:opacity-90"
          >
            {ui.nav.brand}
          </Link>
          <div className="flex flex-wrap gap-6">
            {nav.map(({ href, label }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/"
            className="ml-auto text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            {ui.nav.home}
          </Link>
        </nav>
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</div>
    </div>
  );
}
