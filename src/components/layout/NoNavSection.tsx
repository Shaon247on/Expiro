const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/otp-verification",
  "/new-password",
] as const;

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));