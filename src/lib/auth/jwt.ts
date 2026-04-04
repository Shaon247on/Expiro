import 'server-only';

type JwtPayload = {
  exp?: number;
  iat?: number;
  [k: string]: unknown;
};

function base64UrlDecodeToString(input: string): string {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    return JSON.parse(base64UrlDecodeToString(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getJwtExpMs(token: string): number | null {
  const p = decodeJwtPayload(token);
  if (!p?.exp) return null;
  return p.exp * 1000;
}
