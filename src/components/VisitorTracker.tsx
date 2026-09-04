'use client';

import { useEffect } from 'react';

const VID_KEY = 'nouri_vid';
const VIEWED_KEY = 'nouri_viewed';
const HEARTBEAT_MS = 60 * 1000;

function getVisitorId(): string {
  if (typeof window === 'undefined') return 'noscript';
  let id = localStorage.getItem(VID_KEY);
  if (!id) {
    id = (crypto as Crypto | undefined)?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
    try {
      localStorage.setItem(VID_KEY, id);
    } catch {
      // storage blocked (e.g. private mode) — fall back to per-session id
    }
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

// Counts exactly ONE view per browser tab/session. Re-visits, refreshes and
// in-page navigation within the same tab do NOT add new "views" — only the
// heartbeat keeps the visitor marked as active.
export default function VisitorTracker() {
  useEffect(() => {
    const id = getVisitorId();

    let alreadyViewed = false;
    try {
      alreadyViewed = sessionStorage.getItem(VIEWED_KEY) === '1';
    } catch {
      // storage blocked — treat as not viewed so we still count once
    }

    if (!alreadyViewed) {
      try {
        sessionStorage.setItem(VIEWED_KEY, '1');
      } catch {
        // ignore
      }
      fire(id, 'view');
    } else {
      fire(id, 'heartbeat');
    }

    const heartbeat = setInterval(() => fire(id, 'heartbeat'), HEARTBEAT_MS);
    return () => {
      clearInterval(heartbeat);
    };
  }, []);

  return null;
}
