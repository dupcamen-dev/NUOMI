'use client';

import InfoLayout from '@/components/InfoLayout';
import { useI18n } from '@/lib/I18nContext';

export default function TermsPage() {
  const { t } = useI18n();

  const sections = [
    { title: t('terms.s1'), body: t('terms.s1d') },
    { title: t('terms.s2'), body: t('terms.s2d') },
    { title: t('terms.s3'), body: t('terms.s3d') },
    { title: t('terms.s4'), body: t('terms.s4d') },
  ];

  return (
    <InfoLayout>
      <div className="animate-fade-in">
        <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-medium tracking-[-0.02em] mb-2">{t('terms.title')}</h1>
        <p className="text-[12px] text-neutral-400 font-light mb-6">{t('legal.lastUpdated')}</p>
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-neutral-600 font-light mb-8">{t('terms.intro')}</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[15px] sm:text-[16px] font-medium tracking-[-0.01em] mb-2">{s.title}</h2>
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-neutral-500 font-light">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-black/[0.05] text-[13px] sm:text-[14px] text-neutral-500 font-light">
          {t('terms.contact')}{' '}
          <a
            href="https://t.me/NothingUA"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-800 hover:text-black underline underline-offset-4 decoration-neutral-200 hover:decoration-black transition-colors"
          >
            @NothingUA
          </a>
        </div>
      </div>
    </InfoLayout>
  );
}
