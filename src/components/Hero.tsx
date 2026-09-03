'use client';

import { useI18n } from '@/lib/I18nContext';

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="pt-32 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-4 sm:px-5 relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,1400px)] h-[min(80vw,900px)] opacity-[0.045] bg-grid animate-grid-drift" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(120vw,1600px)] h-[400px] -z-10 opacity-[0.35] bg-glow animate-glow" />
      </div>
      <div className="max-w-[1140px] mx-auto text-center">
        <h1 className="text-[36px] sm:text-[48px] md:text-[72px] font-medium leading-[1.05] tracking-[-0.03em] mb-5 sm:mb-6 animate-fade-in-up text-[#0a0a0a]">
          {t('hero.title').split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-neutral-400 text-[15px] sm:text-[17px] md:text-[18px] leading-relaxed max-w-[480px] mx-auto font-light animate-fade-in stagger-2">
          {t('hero.subtitle')}
        </p>
      </div>
    </section>
  );
}