import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE } from '@/lib/auth/cookies';
import { verifySession, type SessionPayload } from '@/lib/auth/session';

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE.session)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!session.user.isAdmin) redirect('/dashboard');
  return session;
}
