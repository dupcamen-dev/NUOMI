'use client';

import InfoLayout from '@/components/InfoLayout';
import { useI18n } from '@/lib/I18nContext';

export default function PrivacyPage() {
  const { t } = useI18n();

  const sections = [
    { title: t('privacy.s1'), body: t('privacy.s1d') },
    { title: t('privacy.s2'), body: t('privacy.s2d') },
    { title: t('privacy.s3'), body: t('privacy.s3d') },
    { title: t('privacy.s4'), body: t('privacy.s4d') },
    { title: t('privacy.s5'), body: t('privacy.s5d') },
  ];

  return (
    <InfoLayout>
      <div className="animate-fade-in">
        <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-medium tracking-[-0.02em] mb-2">{t('privacy.title')}</h1>
        <p className="text-[12px] text-neutral-400 font-light mb-6">{t('legal.lastUpdated')}</p>
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-neutral-600 font-light mb-8">{t('privacy.intro')}</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[15px] sm:text-[16px] font-medium tracking-[-0.01em] mb-2">{s.title}</h2>
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-neutral-500 font-light">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-black/[0.05] text-[13px] sm:text-[14px] text-neutral-500 font-light">
          {t('privacy.contact')}{' '}
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
