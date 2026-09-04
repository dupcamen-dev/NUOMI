// Centralized (server-side) analytics store.
//
// Primary backend: Upstash Redis (Vercel Marketplace integration).
// Reads env UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
// When not configured, falls back to an in-memory store (single instance,
// useful for local dev / demo). Production should use Upstash so stats are
// shared across all serverless instances.

type RedisResult = string | number | null | (string | null)[] | Record<string, unknown> | null;

const redis = {
  async command(args: (string | number)[]): Promise<RedisResult> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('UPSTASH_REDIS not configured');
    }
    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store',
    });
    const data: { result?: RedisResult; error?: string } = await res.json();
    if (data.error) throw new Error(data.error);
    return data.result ?? null;
  },
};

// ---- In-memory fallback (single instance, non-persistent) ----
const mem = new Map<string, string | number | Set<string> | null>();

function memGet(key: string): string | number | null {
  const v = mem.get(key);
  if (typeof v === 'string' || typeof v === 'number') return v;
  return null;
}

function memSet(key: string, value: string | number) {
  mem.set(key, value);
}

function memIncr(key: string, by = 1): number {
  const cur = typeof mem.get(key) === 'number' ? (mem.get(key) as number) : 0;
  mem.set(key, cur + by);
  return cur + by;
}

const memSets = new Map<string, Set<string>>();
function memSadd(key: string, value: string): number {
  let set = memSets.get(key);
  if (!set) {
    set = new Set();
    memSets.set(key, set);
  }
  set.add(value);
  return set.size;
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

function usingRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function createStore(): Store {
  const useRedis = usingRedis();

  return {
    ping: () => useRedis,

    async incrTotalViews() {
      if (useRedis) return (await redis.command(['INCR', 'nouri:views:total'])) as number;
      return memIncr('views:total');
    },

    async setActive(visitorId, ttlSeconds) {
      const key = `nouri:active:${visitorId}`;
      if (useRedis) {
        await redis.command(['SET', key, '1', 'EX', String(ttlSeconds), 'NX']);
      } else {
        memSet(key, 1);
        setTimeout(() => {
          if (mem.get(key) === 1) mem.delete(key);
        }, ttlSeconds * 1000);
      }
    },

    async addUniqueVisitor(visitorId) {
      if (useRedis) {
        const v = (await redis.command(['SADD', 'nouri:visitors', visitorId])) as number;
        return v;
      }
      return memSadd('visitors', visitorId);
    },

    async incrPage(path) {
      const key = `nouri:page:${encodeURIComponent(path)}`;
      if (useRedis) return (await redis.command(['INCR', key])) as number;
      return memIncr(`page:${path}`);
    },

    async isActive(visitorId) {
      const key = `nouri:active:${visitorId}`;
      if (useRedis) {
        const v = await redis.command(['EXISTS', key]);
        return (v as number) > 0;
      }
      return memGet(key) === 1;
    },

    async activeCount() {
      if (useRedis) {
        const keys = await redis.command(['KEYS', 'nouri:active:*']);
        const k = keys as string[] | null;
        return Array.isArray(k) ? k.length : 0;
      }
      return [...mem.keys()].filter(k => k.startsWith('nouri:active:') && mem.get(k) === 1).length;
    },

    async totalViews() {
      if (useRedis) {
        const v = await redis.command(['GET', 'nouri:views:total']);
        return Number(v || 0);
      }
      return Number(memGet('views:total') || 0);
    },

    async uniqueVisitors() {
      if (useRedis) {
        const v = await redis.command(['SCARD', 'nouri:visitors']);
        return Number(v || 0);
      }
      return (memSets.get('visitors')?.size) || (mem.get('visitors') as number) || 0;
    },

    async pageCounts() {
      const out: Record<string, number> = {};
      if (useRedis) {
        const keys = await redis.command(['KEYS', 'nouri:page:*']);
        const k = (keys as string[] | null) || [];
        for (const key of k) {
          const rawPath = key.replace(/^nouri:page:/, '');
          const path = decodeURIComponent(rawPath);
          const v = await redis.command(['GET', key]);
          out[path] = Number(v || 0);
        }
        return out;
      }
      [...mem.keys()].filter(k => k.startsWith('page:')).forEach(k => {
        out[k.replace(/^page:/, '')] = (mem.get(k) as number) || 0;
      });
      return out;
    },
  };
}

export const store = createStore();
export const STORE_CONFIGURED = usingRedis();
