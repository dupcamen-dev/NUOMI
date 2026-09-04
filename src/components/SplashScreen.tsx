'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in');

  useEffect(() => {
    const show = setTimeout(() => setPhase('out'), 1600);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (phase !== 'out') return;
    const gone = setTimeout(onDone, 500);
    return () => clearTimeout(gone);
  }, [phase, onDone]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center bg-[var(--color-background)] ${
        phase === 'out' ? 'splash-exit' : 'splash-enter'
      }`}
      onAnimationEnd={() => { if (phase === 'out') setPhase('done'); }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="splash-brand select-none text-[28px] sm:text-[32px] font-medium tracking-[-0.04em] text-[var(--color-foreground)]">
          nouri
        </span>
        <span className="splash-line block h-[1.5px] rounded-full bg-[var(--color-foreground)] opacity-20" />
      </div>
    </div>
  );
}
