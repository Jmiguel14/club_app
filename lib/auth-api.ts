import { isAxiosError } from "axios";

import { api, authTokenFromResponse } from "@/lib/api/client";
import type { AuthUser } from "@/lib/types/auth";

type AuthSuccessBody = {
  message?: string;
  user: AuthUser;
};

type ErrorBody = {
  errors?: string[];
  error?: string;
};

export class AuthApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function errorsFromBody(body: unknown, fallback: string): string[] {
  if (!body || typeof body !== "object") return [fallback];
  const b = body as ErrorBody;
  if (Array.isArray(b.errors) && b.errors.length) return b.errors.map(String);
  if (b.error) return [String(b.error)];
  return [fallback];
}

export function toAuthApiError(
  err: unknown,
  fallback: string,
): AuthApiError {
  if (err instanceof AuthApiError) return err;
  if (isAxiosError(err)) {
    const status = err.response?.status ?? 0;
    const msg = errorsFromBody(err.response?.data, fallback)[0] ?? fallback;
    return new AuthApiError(
      msg,
      status,
      errorsFromBody(err.response?.data, fallback),
    );
  }
  if (err instanceof Error) return new AuthApiError(err.message, 0, [err.message]);
  return new AuthApiError(fallback, 0, [fallback]);
}

export async function signup(params: {
  email: string;
  password: string;
  passwordConfirmation: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await api.post<AuthSuccessBody>(
    "/signup",
    {
      user: {
        email: params.email,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
      },
    },
    { skipAuth: true },
  );

  const token = authTokenFromResponse(res);
  const body = res.data;

  if (res.status < 200 || res.status >= 300) {
    const errors = errorsFromBody(body, "Could not create account");
    throw new AuthApiError(errors[0] ?? "Sign up failed", res.status, errors);
  }

  if (!token || !body?.user) {
    throw new AuthApiError("Missing token or user in response", res.status);
  }

  return { token, user: body.user };
}

export async function login(params: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await api.post<AuthSuccessBody>(
    "/login",
    {
      user: {
        email: params.email,
        password: params.password,
      },
    },
    { skipAuth: true },
  );

  const token = authTokenFromResponse(res);
  const body = res.data;

  if (res.status < 200 || res.status >= 300) {
    const errors = errorsFromBody(body, "Invalid email or password");
    throw new AuthApiError(errors[0] ?? "Login failed", res.status, errors);
  }

  if (!token || !body?.user) {
    throw new AuthApiError("Missing token or user in response", res.status);
  }

  return { token, user: body.user };
}

export async function logout(): Promise<void> {
  await api.delete("/logout");
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await api.get<{ user: AuthUser }>("/me");
  if (res.status < 200 || res.status >= 300 || !res.data?.user) {
    const errors = errorsFromBody(res.data, "Could not load profile");
    throw new AuthApiError(errors[0] ?? "Profile error", res.status, errors);
  }
  return res.data.user;
}
