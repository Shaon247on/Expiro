import "server-only";

import axios, { type AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { env } from "@/lib/config/env";
import { COOKIE } from "@/lib/auth/cookies";

export async function createBackendClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE.access)?.value;

  const client = axios.create({
    baseURL: env.BACKEND_BASE_URL,
    timeout: 20000,
    headers: {
      Accept: "application/json",
    },
  });

  if (accessToken) {
    client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return client;
}