import { NextRequest } from 'next/server';
import { isAdminAuthed } from '@/lib/adminAuth';
import { store, STORE_CONFIGURED } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  const authed = await isAdminAuthed();
  if (!authed) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const active = await store.activeCount();
  const totalViews = await store.totalViews();
  const uniqueVisitors = await store.uniqueVisitors();
  const pages = await store.pageCounts();
  const daily = await store.dailySeries(30);

  return Response.json({
    ok: true,
    storage: STORE_CONFIGURED ? 'postgres' : 'memory',
    stats: {
      activeVisitors: active,
      totalViews,
      uniqueVisitors,
      pages,
      daily,
    },
  });
}
