import 'server-only';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  BACKEND_BASE_URL: required('BACKEND_BASE_URL'),
  BACKEND_LOGIN_PATH: required('BACKEND_LOGIN_PATH'), // e.g. "/auth/login"
  BACKEND_REFRESH_PATH: required('BACKEND_REFRESH_PATH'), // e.g. "/auth/refresh"
  AUTH_SESSION_SECRET: required('AUTH_SESSION_SECRET'), // 32+ random bytes, base64 or long string
});
