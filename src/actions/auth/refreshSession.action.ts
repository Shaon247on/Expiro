"use server";

import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";
import { createBackendClient } from "@/lib/http/backend.client";

export async function refreshSessionAction() {
  try {
    const api = await createBackendClient();

    const { data } = await api.get("/api/profile/");

    const user = data?.data;

    if (!user) return;

    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE.session)?.value;

    if (!session) return;

    const parsed = JSON.parse(session);

    // ✅ Update session with latest plan info
    const updatedSession = {
      ...parsed,
      plan_type: user.plan_type,
      started_at: user.started_at,
      expires_at: user.expires_at,
    };

    cookieStore.set({
      name: COOKIE.session,
      value: JSON.stringify(updatedSession),
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
  } catch {
    // silent fail (non-blocking)
  }
}