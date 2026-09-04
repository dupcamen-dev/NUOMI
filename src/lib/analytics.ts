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
  };
}

export const store = createStore();
export const STORE_CONFIGURED = usingPg();
