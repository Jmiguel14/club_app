import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { getApiBaseUrl } from "@/lib/env";
import { useAuthStore } from "@/store/auth-store";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Do not attach Bearer token (login, signup, etc.). */
    skipAuth?: boolean;
  }
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status < 500,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.skipAuth) return config;
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export function normalizeAuthHeader(
  header: string | null | undefined,
): string | null {
  if (!header) return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m ? m[1]!.trim() : header.trim();
}

export function authTokenFromResponse(res: AxiosResponse): string | null {
  const h = res.headers;
  const fromGet =
    typeof h.get === "function" ? h.get("authorization") : undefined;
  const fromRecord =
    (h as Record<string, unknown>)["authorization"] ??
    (h as Record<string, unknown>)["Authorization"];
  const raw =
    (typeof fromGet === "string" ? fromGet : undefined) ??
    (typeof fromRecord === "string" ? fromRecord : undefined);
  return normalizeAuthHeader(raw ?? null);
}
