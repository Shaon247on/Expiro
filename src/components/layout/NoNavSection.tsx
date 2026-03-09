const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/otp-verification",
  "/new-password",
] as const;

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

export const isDashboardRoute = (pathname: string) =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");
export const isAdminDashboardRoute = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

export const isAuthOrDashboardRoute = (pathname: string) =>
  isAuthRoute(pathname) || isDashboardRoute(pathname) || isAdminDashboardRoute;
