import { NextRequest } from 'next/server';
import { store } from '@/lib/analytics';

const ACTIVE_TTL = 60 * 15; // 15 minutes

export async function POST(req: NextRequest) {
  let body: { visitorId?: string; path?: string } = {};
  try {
    body = await req.json();
  } catch {
    // ignore malformed body
  }

  const visitorId = body.visitorId || req.headers.get('x-forwarded-for') || Date.now().toString();
  const path = body.path || '/';

  try {
    await Promise.all([
      store.incrTotalViews(),
      store.incrPage(path),
      store.addUniqueVisitor(visitorId),
      store.setActive(visitorId, ACTIVE_TTL),
    ]);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('track failed', e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
