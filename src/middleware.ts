import { NextRequest, NextResponse } from "next/server";
import { COOKIE, isProd } from "@/lib/auth/cookies";

type UserRole = "admin" | "super_admin" | "staff";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/dashboard",
  super_admin: "/admin/dashboard",
  staff: "/staff/dashboard",
};

function isProtectedPath(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/") ||
    pathname === "/staff/dashboard" ||
    pathname.startsWith("/staff/dashboard/")
  );
}
function isProtectedPathPlan(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname.startsWith("/admin/dashboard/")
    // pathname === "/staff/dashboard" ||
    // pathname.startsWith("/staff/dashboard/")
  );
}

function getRequiredRole(pathname: string): UserRole | null {
  if (
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/")
  ) {
    return "super_admin";
  }

  if (
    pathname === "/staff/dashboard" ||
    pathname.startsWith("/staff/dashboard/")
  ) {
    return "staff";
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "admin";
  }

  return null;
}

function base64UrlDecode(input: string): string {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
}

function getJwtExpMsEdge(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const json = JSON.parse(base64UrlDecode(payload)) as { exp?: number };
    return json.exp ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

function parseSessionUser(
  sessionCookie?: string
): { role?: string; plan_type?: string | null } | null {
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie) as {
      role?: string;
      plan_type?: string | null;
    };
  } catch {
    return null;
  }
}

function getSafeRole(role?: string): UserRole | null {
  if (role === "admin" || role === "super_admin" || role === "staff") {
    return role;
  }

  return null;
}

function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(COOKIE.access);
  res.cookies.delete(COOKIE.refresh);
  res.cookies.delete(COOKIE.session);
}

async function refreshAccessToken(refreshToken: string) {
  const backendBase = process.env.BACKEND_BASE_URL;
  const refreshPath = process.env.BACKEND_REFRESH_PATH;

  if (!backendBase || !refreshPath) {
    return null;
  }

  const r = await fetch(`${backendBase}${refreshPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!r.ok) return null;

  const data = (await r.json()) as {
    message?: string;
    data?: {
      access?: string;
      refresh?: string;
    };
  };

  if (!data?.data?.access) return null;

  return {
    access: data.data.access,
    refresh: data.data.refresh,
  };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname) && pathname !== "/login") {
    return NextResponse.next();
  }

  const access = req.cookies.get(COOKIE.access)?.value;
  const refresh = req.cookies.get(COOKIE.refresh)?.value;
  const sessionCookie = req.cookies.get(COOKIE.session)?.value;

  const sessionUser = parseSessionUser(sessionCookie);
  const userRole = getSafeRole(sessionUser?.role);
const planType = sessionUser?.plan_type;


  const requiredRole = getRequiredRole(pathname);

  // Authenticated user visiting /login -> send to own dashboard
  if (pathname === "/login" && (access || refresh) && userRole) {
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[userRole];
    return NextResponse.redirect(url);
  }

  // Not authenticated -> login
  if (!access && !refresh && isProtectedPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Missing or invalid role while trying to access protected area
  if (isProtectedPath(pathname) && !userRole) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    const res = NextResponse.redirect(url);
    clearAuthCookies(res);
    return res;
  }

  if (isProtectedPathPlan(pathname) && userRole && (!planType || planType === null)) {
  const url = req.nextUrl.clone();
  url.pathname = "/package/plans";
  return NextResponse.redirect(url);
}

  // Role-based protection
  if (requiredRole && userRole && requiredRole !== userRole) {
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[userRole];
    return NextResponse.redirect(url);
  }

  const expMs = access ? getJwtExpMsEdge(access) : null;
  const isExpiring = !expMs ? false : expMs - Date.now() < 60_000;

  if ((!access && refresh) || (access && refresh && isExpiring)) {
    const refreshed = await refreshAccessToken(refresh);

    if (!refreshed && isProtectedPath(pathname)) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      clearAuthCookies(res);
      return res;
    }

    if (refreshed?.access) {
      const requiredRoleAfterRefresh = getRequiredRole(pathname);

      if (
        requiredRoleAfterRefresh &&
        userRole &&
        requiredRoleAfterRefresh !== userRole
      ) {
        const res = NextResponse.redirect(
          new URL(ROLE_HOME[userRole], req.url),
        );

        res.cookies.set({
          name: COOKIE.access,
          value: refreshed.access,
          httpOnly: true,
          secure: isProd,
          sameSite: "strict",
          path: "/",
        });

        if (refreshed.refresh) {
          res.cookies.set({
            name: COOKIE.refresh,
            value: refreshed.refresh,
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
          });
        }

        return res;
      }

      const res = NextResponse.next();

      res.cookies.set({
        name: COOKIE.access,
        value: refreshed.access,
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
      });

      if (refreshed.refresh) {
        res.cookies.set({
          name: COOKIE.refresh,
          value: refreshed.refresh,
          httpOnly: true,
          secure: isProd,
          sameSite: "strict",
          path: "/",
        });
      }

      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/staff/dashboard/:path*",
    "/login",
  ],
};
