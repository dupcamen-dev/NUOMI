'use client';

import { useEffect } from 'react';

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

function fire(visitorId: string) {
  const path = window.location.pathname;
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, path }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export default function VisitorTracker() {
  useEffect(() => {
    const id = getVisitorId();
    fire(id);
    const interval = setInterval(() => fire(id), HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
