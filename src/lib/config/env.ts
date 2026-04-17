import "server-only";

export function getEnv() {
  const required = (name: string) => {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
  };

  return {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    BACKEND_BASE_URL: required("BACKEND_BASE_URL"),
    BACKEND_LOGIN_PATH: required("BACKEND_LOGIN_PATH"),
    BACKEND_REFRESH_PATH: required("BACKEND_REFRESH_PATH"),
    AUTH_SESSION_SECRET: required("AUTH_SESSION_SECRET"),
  };
}