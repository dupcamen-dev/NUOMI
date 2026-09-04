import { NextRequest } from 'next/server';
import { getAdminPassword, setAdminSession } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  let password = '';
  try {
    const body = await req.json();
    password = String(body.password || '');
  } catch {
    // empty
  }

  if (password === getAdminPassword()) {
    const res = Response.json({ ok: true });
    await setAdminSession(res);
    return res;
  }

  return Response.json({ ok: false, error: 'invalid' }, { status: 401 });
}
