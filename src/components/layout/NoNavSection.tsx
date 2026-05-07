const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/otp-verification",
  "/new-password",
  "/accept-invite",
] as const;

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export const isDashboardRoute = (pathname: string) =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");

export const isAdminDashboardRoute = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

export const isStaffRoute = (pathname: string) =>
  pathname === "/staff" || pathname.startsWith("/staff/");

export const isPackaged = (pathname: string) =>
  pathname === "/package" || pathname.startsWith("/package/");

export const isAuthOrDashboardRoute = (pathname: string) =>
  isAuthRoute(pathname) ||
  isDashboardRoute(pathname) ||
  isAdminDashboardRoute(pathname) ||
  isStaffRoute(pathname) ||
  isPackaged(pathname);
