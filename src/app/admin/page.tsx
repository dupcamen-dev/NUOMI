'use client';

import { useState, useCallback, useEffect } from 'react';
import { Lock, RefreshCw, LogOut, Users, Eye, BarChart3, Database } from 'lucide-react';

type Daily = { day: string; views: number; unique: number };

type Stats = {
  activeVisitors: number;
  totalViews: number;
  uniqueVisitors: number;
  pages: Record<string, number>;
  daily: Daily[];
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [storage, setStorage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError(false);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword('');
      await loadStats();
    } else {
      setError(true);
    }
  };

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        setStorage(data.storage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed === true) {
      loadStats();
      const interval = setInterval(loadStats, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setStats(null);
  };

  const pagesSorted = stats ? Object.entries(stats.pages).sort((a, b) => b[1] - a[1]) : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      {authed === null && (
        <div className="w-full max-w-[380px] bg-white border border-black/[0.06] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} strokeWidth={1.5} className="text-neutral-400" />
            <span className="text-[15px] font-medium tracking-[-0.01em]">Nouri Admin</span>
          </div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') login(); }}
            className="w-full text-center text-[16px] py-2.5 px-3 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300"
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p className="text-[12px] text-red-500 font-light mt-2">Невірний пароль</p>
          )}
          <button
            onClick={login}
            className="w-full mt-4 py-3 bg-[#0a0a0a] text-white text-[14px] font-medium rounded-full hover:bg-black transition-all duration-300 active:scale-[0.98]"
          >
            Увійти
          </button>
        </div>
      )}

      {authed === false && (
        <div className="w-full max-w-[380px] bg-white border border-black/[0.06] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} strokeWidth={1.5} className="text-neutral-400" />
            <span className="text-[15px] font-medium tracking-[-0.01em]">Nouri Admin</span>
          </div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') login(); }}
            className="w-full text-center text-[16px] py-2.5 px-3 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300"
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p className="text-[12px] text-red-500 font-light mt-2">Невірний пароль</p>
          )}
          <button
            onClick={login}
            className="w-full mt-4 py-3 bg-[#0a0a0a] text-white text-[14px] font-medium rounded-full hover:bg-black transition-all duration-300 active:scale-[0.98]"
          >
            Увійти
          </button>
        </div>
      )}

      {authed === true && stats && (
        <div className="w-full max-w-[720px] py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} strokeWidth={1.5} className="text-neutral-400" />
              <h1 className="text-[20px] font-medium tracking-[-0.01em]">Nouri Admin</h1>
              <span className="text-[11px] text-neutral-400 bg-[#f0f0f0] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Database size={10} strokeWidth={2} />
                {storage}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-black transition-colors"
            >
              <LogOut size={13} strokeWidth={1.5} />
              Вийти
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-black/[0.05] rounded-[20px] p-4 text-center">
              <Users size={18} strokeWidth={1.5} className="text-neutral-400 mx-auto mb-2" />
              <div className="text-[24px] font-medium tracking-[-0.02em]">{stats.activeVisitors}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Активні зараз</div>
            </div>
            <div className="bg-white border border-black/[0.05] rounded-[20px] p-4 text-center">
              <Eye size={18} strokeWidth={1.5} className="text-neutral-400 mx-auto mb-2" />
              <div className="text-[24px] font-medium tracking-[-0.02em]">{stats.totalViews}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Переглядів</div>
            </div>
            <div className="bg-white border border-black/[0.05] rounded-[20px] p-4 text-center">
              <Users size={18} strokeWidth={1.5} className="text-neutral-400 mx-auto mb-2" />
              <div className="text-[24px] font-medium tracking-[-0.02em]">{stats.uniqueVisitors}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Унікальних</div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.05] rounded-[20px] p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-medium tracking-[-0.01em]">Відвідування по датах</h2>
              <span className="text-[11px] text-neutral-400">останні 30 днів</span>
            </div>
            {stats.daily.length === 0 || stats.daily.every(d => d.views === 0) ? (
              <p className="text-[13px] text-neutral-400 font-light">Ще немає даних</p>
            ) : (
              <div className="flex items-end gap-[3px] h-[140px]">
                {stats.daily.map(d => {
                  const max = Math.max(...stats.daily.map(x => x.views), 1);
                  const h = Math.round((d.views / max) * 100);
                  const today = d.day;
                  const isToday = today === stats.daily[stats.daily.length - 1]?.day;
                  return (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col justify-end items-center group relative"
                      title={`${d.day}: ${d.views} переглядів, ${d.unique} унікальних`}
                    >
                      <div
                        className={`w-full rounded-t-[3px] transition-all ${isToday ? 'bg-[#111]' : 'bg-neutral-300 group-hover:bg-neutral-500'}`}
                        style={{ height: `${Math.max(h, 3)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-black/[0.05] rounded-[20px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-medium tracking-[-0.01em]">Відвідування по сторінках</h2>
              <button
                onClick={loadStats}
                className="text-[12px] text-neutral-400 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={12} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
                Оновити
              </button>
            </div>
            {pagesSorted.length === 0 ? (
              <p className="text-[13px] text-neutral-400 font-light">Ще немає даних</p>
            ) : (
              <div className="space-y-2">
                {pagesSorted.map(([path, count]) => (
                  <div key={path} className="flex items-center justify-between text-[13px] py-1.5 border-b border-black/[0.03] last:border-0">
                    <span className="font-mono text-neutral-600">{path}</span>
                    <span className="text-neutral-400 font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
