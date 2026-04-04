import 'server-only';
import { env } from '@/lib/config/env';

export const isProd = env.NODE_ENV === 'production';

/**
 * In production, prefer __Host- prefixed cookies for host-only protection.
 * In local dev, prefixed cookies + Secure can be inconsistent on http://localhost.
 */
export const COOKIE = Object.freeze({
  access: isProd ? '__Host-access' : 'dev_access',
  refresh: isProd ? '__Host-refresh' : 'dev_refresh',
  session: isProd ? '__Host-session' : 'dev_session',
});

export function cookieBaseOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/' as const,
  };
}
