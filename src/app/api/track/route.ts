import { NextRequest } from 'next/server';
import { store } from '@/lib/analytics';

const ACTIVE_TTL = 60 * 15; // 15 minutes

export async function POST(req: NextRequest) {
  let body: { visitorId?: string; path?: string; type?: string } = {};
  try {
    body = await req.json();
  } catch {
    // ignore malformed body
  }

  const visitorId = body.visitorId || req.headers.get('x-forwarded-for') || Date.now().toString();
  const path = body.path || '/';
  const isView = body.type !== 'heartbeat';

  try {
    const ops: Promise<unknown>[] = [];

    // Heartbeats keep the visitor "active" but never count as a new page view.
    ops.push(store.setActive(visitorId, ACTIVE_TTL));

    if (isView) {
      ops.push(store.incrTotalViews());
      ops.push(store.incrPage(path));
      ops.push(store.addUniqueVisitor(visitorId));
      ops.push(store.recordDaily(path, visitorId));
    }

    await Promise.all(ops);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('track failed', e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
