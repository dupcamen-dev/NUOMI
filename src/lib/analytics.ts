// Centralized (server-side) analytics store.
//
// Primary backend: PostgreSQL (Neon via Vercel Postgres). Reads DATABASE_URL.
// When DATABASE_URL is not configured, falls back to an in-memory store
// (single instance, useful for local dev). Production should use Postgres so
// stats are shared across all serverless instances.

import postgres from 'postgres';

// ---- In-memory fallback (single instance, non-persistent) ----
const mem = new Map<string, string | number | Set<string> | null>();
const memSets = new Map<string, Set<string>>();

function memGet(key: string): string | number | null {
  const v = mem.get(key);
  if (typeof v === 'string' || typeof v === 'number') return v;
  return null;
}

function memIncr(key: string, by = 1): number {
  const cur = typeof mem.get(key) === 'number' ? (mem.get(key) as number) : 0;
  mem.set(key, cur + by);
  return cur + by;
}

// ---- PostgreSQL backend ----

function usingPg(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let sql: ReturnType<typeof postgres> | null = null;
let pgReady: Promise<boolean> | null = null;

function getSql() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL as string, {
      max: 1,
      connect_timeout: 10,
      idle_timeout: 20,
    });
  }
  return sql;
}

async function ensureSchema() {
  if (!pgReady) {
    pgReady = (async () => {
      const db = getSql();
      try {
        await db`CREATE TABLE IF NOT EXISTS counters (
          key TEXT PRIMARY KEY,
          value BIGINT NOT NULL DEFAULT 0
        )`;
        await db`CREATE TABLE IF NOT EXISTS visitors (
          visitor_id TEXT PRIMARY KEY
        )`;
        await db`CREATE TABLE IF NOT EXISTS page_views (
          path TEXT PRIMARY KEY,
          count BIGINT NOT NULL DEFAULT 0
        )`;
        await db`CREATE TABLE IF NOT EXISTS active_visitors (
          visitor_id TEXT PRIMARY KEY,
          last_seen BIGINT NOT NULL
        )`;
        await db`CREATE TABLE IF NOT EXISTS daily_views (
          day TEXT NOT NULL,
          path TEXT NOT NULL,
          views BIGINT NOT NULL DEFAULT 0,
          PRIMARY KEY (day, path)
        )`;
        await db`CREATE TABLE IF NOT EXISTS daily_visitors (
          day TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          PRIMARY KEY (day, visitor_id)
        )`;
        return true;
      } catch (e) {
        console.error('analytics: schema init failed', e);
        return false;
      }
    })();
  }
  return pgReady;
}

async function incrCounter(key: string, by = 1): Promise<number> {
  const db = getSql();
  const rows = await db`
    INSERT INTO counters (key, value) VALUES (${key}, ${by})
    ON CONFLICT (key) DO UPDATE SET value = counters.value + ${by}
    RETURNING value
  `;
  return Number(rows[0]?.value || 0);
}

async function incrPage(pathKey: string, by = 1): Promise<number> {
  const db = getSql();
  const rows = await db`
    INSERT INTO page_views (path, count) VALUES (${pathKey}, ${by})
    ON CONFLICT (path) DO UPDATE SET count = page_views.count + ${by}
    RETURNING count
  `;
  return Number(rows[0]?.count || 0);
}

async function recordDailyView(day: string, pathKey: string, by = 1): Promise<void> {
  const db = getSql();
  await db`
    INSERT INTO daily_views (day, path, views) VALUES (${day}, ${pathKey}, ${by})
    ON CONFLICT (day, path) DO UPDATE SET views = daily_views.views + ${by}
  `;
}

async function recordDailyVisitor(day: string, visitorId: string): Promise<void> {
  const db = getSql();
  await db`
    INSERT INTO daily_visitors (day, visitor_id) VALUES (${day}, ${visitorId})
    ON CONFLICT (day, visitor_id) DO NOTHING
  `;
}

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---- Unified API used by route handlers ----

export type Store = {
  ping: () => boolean;
  incrTotalViews: () => Promise<number>;
  setActive: (visitorId: string, ttlSeconds: number) => Promise<void>;
  addUniqueVisitor: (visitorId: string) => Promise<number>;
  incrPage: (path: string) => Promise<number>;
  isActive: (visitorId: string) => Promise<boolean>;
  activeCount: () => Promise<number>;
  totalViews: () => Promise<number>;
  uniqueVisitors: () => Promise<number>;
  pageCounts: () => Promise<Record<string, number>>;
  recordDaily: (path: string, visitorId: string) => Promise<void>;
  dailySeries: (days: number) => Promise<{ day: string; views: number; unique: number }[]>;
};

export function createStore(): Store {
  const usePg = usingPg();

  return {
    ping: () => usePg,

    async incrTotalViews() {
      if (usePg) {
        await ensureSchema();
        return incrCounter('views:total');
      }
      return memIncr('views:total');
    },

    async setActive(visitorId, ttlSeconds) {
      const now = Date.now();
      if (usePg) {
        await ensureSchema();
        const db = getSql();
        await db`
          INSERT INTO active_visitors (visitor_id, last_seen) VALUES (${visitorId}, ${now})
          ON CONFLICT (visitor_id) DO UPDATE SET last_seen = ${now}
        `.catch(() => {});
        return;
      }
      mem.set(`active:${visitorId}`, 1);
      setTimeout(() => {
        if (mem.get(`active:${visitorId}`) === 1) mem.delete(`active:${visitorId}`);
      }, ttlSeconds * 1000);
    },

    async addUniqueVisitor(visitorId) {
      if (usePg) {
        await ensureSchema();
        const db = getSql();
        await db`
          INSERT INTO visitors (visitor_id) VALUES (${visitorId})
          ON CONFLICT (visitor_id) DO NOTHING
        `.catch(() => {});
        const rows = await db`SELECT COUNT(*)::int AS c FROM visitors`;
        return Number(rows[0]?.c || 0);
      }
      let set = memSets.get('visitors');
      if (!set) {
        set = new Set();
        memSets.set('visitors', set);
      }
      set.add(visitorId);
      return set.size;
    },

    async incrPage(path) {
      const pathKey = `page:${encodeURIComponent(path)}`;
      if (usePg) {
        await ensureSchema();
        return incrPage(pathKey);
      }
      return memIncr(pathKey);
    },

    async isActive(visitorId) {
      const now = Date.now();
      if (usePg) {
        await ensureSchema();
        const db = getSql();
        const rows = await db`
          SELECT 1 FROM active_visitors
          WHERE visitor_id = ${visitorId} AND last_seen > ${now - 1000 * 60 * 15}
        `.catch(() => []);
        return (rows as unknown[]).length > 0;
      }
      return mem.get(`active:${visitorId}`) === 1;
    },

    async activeCount() {
      const now = Date.now();
      const cutoff = now - 1000 * 60 * 15;
      if (usePg) {
        await ensureSchema();
        const db = getSql();
        const rows = await db`
          SELECT COUNT(*)::int AS c FROM active_visitors WHERE last_seen > ${cutoff}
        `.catch(() => []);
        return Number((rows as { c?: unknown }[])[0]?.c || 0);
      }
      return [...mem.keys()].filter(k => k.startsWith('active:') && mem.get(k) === 1).length;
    },

    async totalViews() {
      if (usePg) {
        try {
          await ensureSchema();
          const db = getSql();
          const rows = await db`SELECT value FROM counters WHERE key = 'views:total'`;
          return Number(rows[0]?.value || 0);
        } catch {
          return 0;
        }
      }
      return Number(memGet('views:total') || 0);
    },

    async uniqueVisitors() {
      if (usePg) {
        try {
          await ensureSchema();
          const db = getSql();
          const rows = await db`SELECT COUNT(*)::int AS c FROM visitors`;
          return Number(rows[0]?.c || 0);
        } catch {
          return 0;
        }
      }
      return memSets.get('visitors')?.size || 0;
    },

    async pageCounts() {
      const out: Record<string, number> = {};
      if (usePg) {
        try {
          await ensureSchema();
          const db = getSql();
          const rows = await db`SELECT path, count FROM page_views`;
          for (const row of rows as { path?: string; count?: unknown }[]) {
            const p = row.path ? row.path.replace(/^page:/, '') : '';
            if (p) {
              try {
                out[decodeURIComponent(p)] = Number(row.count || 0);
              } catch {
                out[p] = Number(row.count || 0);
              }
            }
          }
          return out;
        } catch {
          return out;
        }
      }
      [...mem.keys()].filter(k => k.startsWith('page:')).forEach(k => {
        out[k.replace(/^page:/, '')] = Number(mem.get(k) || 0);
      });
      return out;
    },

    async recordDaily(path, visitorId) {
      const day = dayKey(new Date());
      if (usePg) {
        await ensureSchema();
        await Promise.all([
          recordDailyView(day, path),
          recordDailyVisitor(day, visitorId),
        ]).catch(() => {});
        return;
      }
      const viewsKey = `dview:${day}`;
      memIncr(viewsKey);
      let set = memSets.get(`duniq:${day}`);
      if (!set) {
        set = new Set();
        memSets.set(`duniq:${day}`, set);
      }
      set.add(visitorId);
    },

    async dailySeries(days) {
      const out: { day: string; views: number; unique: number }[] = [];
      const now = new Date();
      if (usePg) {
        try {
          await ensureSchema();
          const db = getSql();
          const start = new Date(now);
          start.setDate(start.getDate() - (days - 1));
          const startDay = dayKey(start);
          const viewsRows = await db`
            SELECT day, SUM(views)::int AS views FROM daily_views
            WHERE day >= ${startDay} GROUP BY day ORDER BY day
          `;
          const uniqueRows = await db`
            SELECT day, COUNT(*)::int AS unique FROM daily_visitors
            WHERE day >= ${startDay} GROUP BY day ORDER BY day
          `;
          const viewsMap: Record<string, number> = {};
          const uniqueMap: Record<string, number> = {};
          for (const r of viewsRows as { day?: string; views?: unknown }[]) {
            if (r.day) viewsMap[r.day] = Number(r.views || 0);
          }
          for (const r of uniqueRows as { day?: string; unique?: unknown }[]) {
            if (r.day) uniqueMap[r.day] = Number(r.unique || 0);
          }
          for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const key = dayKey(d);
            out.push({ day: key, views: viewsMap[key] || 0, unique: uniqueMap[key] || 0 });
          }
          return out;
        } catch {
          return out;
        }
      }
      for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - (days - 1 - i));
        const key = dayKey(d);
        out.push({
          day: key,
          views: Number(memGet(`dview:${key}`) || 0),
          unique: memSets.get(`duniq:${key}`)?.size || 0,
        });
      }
      return out;
    },
  };
}

export const store = createStore();
export const STORE_CONFIGURED = usingPg();
