import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/config/env';

export type SessionUser = {
  id: string;
  email: string;
  full_name: string;
  isAdmin: boolean;
};

export type SessionPayload = {
  user: SessionUser;
};

const secretKey = new TextEncoder().encode(env.AUTH_SESSION_SECRET);

export async function signSession(payload: SessionPayload, ttlSeconds: number): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
    .sign(secretKey);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
