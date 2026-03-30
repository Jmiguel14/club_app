"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { NeonInput } from "@/components/auth/neon-input";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { useLoginMutation } from "@/hooks/use-login-mutation";
import { toAuthApiError } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useAuthHydration();
  const token = useAuthStore((s) => s.token);
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loading = loginMutation.isPending;

  useEffect(() => {
    if (!hydrated || !token) return;
    router.replace("/dashboard");
  }, [hydrated, token, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      const mapped = toAuthApiError(err, "Something went wrong. Try again.");
      setError(mapped.errors.join(" ") || mapped.message);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto h-32 max-w-md animate-pulse rounded-2xl bg-white/5" />
    );
  }

  if (token) {
    return null;
  }

  return (
    <AuthCard
      title="ENTER"
      subtitle="Nightclub management — staff sign in"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <NeonInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          disabled={loading}
        />
        <NeonInput
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          disabled={loading}
        />
        {error ? (
          <p
            className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] py-3.5 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_24px_-4px_var(--accent)] transition-opacity hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        New venue?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </p>
    </AuthCard>
  );
}
