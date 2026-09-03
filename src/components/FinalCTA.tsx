'use client';

import { useI18n } from '@/lib/I18nContext';

export default function FinalCTA() {
  const { t } = useI18n();
  return (
    <section className="px-4 sm:px-5 py-20 sm:py-28">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-[26px] sm:text-[30px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.15] mb-4 sm:mb-5">
          {t('cta.title').split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h2>
        <p className="text-neutral-400 text-[14px] sm:text-[15px] font-light mb-8 sm:mb-10">
          {t('cta.subtitle')}
        </p>
        <a
          href="#generator"
          className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-[13px] sm:text-[14px] font-medium px-7 sm:px-8 py-3.5 rounded-full hover:bg-black transition-all duration-300 active:scale-[0.97]"
        >
          {t('cta.button')}
        </a>
      </div>
    </section>
  );
}
