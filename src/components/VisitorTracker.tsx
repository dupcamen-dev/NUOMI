'use client';

import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'nouri_vid';
const HEARTBEAT_MS = 60 * 1000;

function getVisitorId(): string {
  if (typeof window === 'undefined') return 'noscript';
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function fire(visitorId: string, type: 'view' | 'heartbeat') {
  const path = window.location.pathname;
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, path, type }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export default function VisitorTracker() {
  const lastPath = useRef<string>('');

  useEffect(() => {
    const id = getVisitorId();
    lastPath.current = window.location.pathname;
    fire(id, 'view');

    // Fire a "view" whenever the path changes (client-side navigation).
    const checkPath = () => {
      if (window.location.pathname !== lastPath.current) {
        lastPath.current = window.location.pathname;
        fire(id, 'view');
      }
    };
    const pathObserver = setInterval(checkPath, 1500);

    // Heartbeats only refresh the "active" window — never a new view.
    const heartbeat = setInterval(() => fire(id, 'heartbeat'), HEARTBEAT_MS);

    return () => {
      clearInterval(pathObserver);
      clearInterval(heartbeat);
    };
  }, []);

  return null;
}
