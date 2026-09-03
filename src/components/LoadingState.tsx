'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  onDone: () => void;
}

export default function LoadingState({ onDone }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);

  const STEPS = [
    t('load.1'),
    t('load.2'),
    t('load.3'),
    t('load.4'),
    t('load.5'),
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStep(i);
          if (i === STEPS.length - 1) {
            setTimeout(onDone, 600);
          }
        }, i === 0 ? 400 : 800 + i * 700)
      );
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [onDone]);

  return (
    <section className="px-4 sm:px-5 py-16 sm:py-28 flex items-center justify-center">
      <div className="max-w-[400px] w-full text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full border border-black/[0.04] flex items-center justify-center mb-8">
          <div className="w-2 h-2 rounded-full bg-[#0a0a0a] animate-pulse-dot" />
        </div>
        {STEPS.map((text, i) => (
          <div
            key={i}
            className={`text-[14px] sm:text-[15px] transition-all duration-500 ${
              i <= step
                ? i === step
                  ? 'text-[#0a0a0a] font-medium'
                  : 'text-neutral-400'
                : 'text-transparent'
            }`}
          >
            {text}
          </div>
        ))}
      </div>
    </section>
  );
}
