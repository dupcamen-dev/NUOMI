import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

// Simple admin auth. Password is read from env ADMIN_PASSWORD (default "nouri2026").
// Produces a signed session token stored in an HttpOnly cookie.

const SESSION_COOKIE = 'nouri_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.ADMIN_SECRET || 'nouri-admin-dev-secret-change-me';
}

function hmac(message: string, key: string): string {
  return createHmac('sha256', key).update(message).digest('hex');
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'nouri2026';
}

export function createSessionToken(): string {
  const payload = `${Date.now()}`;
  return `${payload}.${hmac(payload, secret()).slice(0, 48)}`;
}

export function verifySessionToken(token: string): boolean {
  const idx = token.lastIndexOf('.');
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = hmac(payload, secret()).slice(0, 48);
  if (sig !== expected) return false;
  const ts = parseInt(payload, 10);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < SESSION_TTL_SECONDS * 1000;
}

export async function setAdminSession(res: Response) {
  const token = createSessionToken();
  res.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`
  );
}

export async function clearAdminSession(res: Response) {
  res.headers.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export async function getAdminSessionToken(): Promise<string | null> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value || null;
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = await getAdminSessionToken();
  return token ? verifySessionToken(token) : false;
}
