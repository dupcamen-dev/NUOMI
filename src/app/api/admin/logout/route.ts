import { NextRequest } from 'next/server';
import { clearAdminSession } from '@/lib/adminAuth';

export async function POST(_req: NextRequest) {
  const res = Response.json({ ok: true });
  await clearAdminSession(res);
  return res;
}
