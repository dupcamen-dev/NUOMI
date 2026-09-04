'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/I18nContext';

export default function InfoLayout({ children }: { children: ReactNode }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <header className="px-4 sm:px-5 h-14 sm:h-[60px] border-b border-black/[0.04] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[760px] mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-semibold text-[16px] tracking-[-0.02em] text-black">Nouri</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[12px] sm:text-[13px] font-light text-neutral-500 hover:text-black transition-colors"
            >
              {t('nav.back')}
            </Link>
            <button
              onClick={() => setLocale(locale === 'uk' ? 'de' : 'uk')}
              className="text-[12px] font-medium px-2.5 py-1 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors text-neutral-400 hover:text-black"
            >
              {locale === 'uk' ? 'DE' : 'UA'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-5 py-10 sm:py-14">
        <div className="max-w-[760px] mx-auto">{children}</div>
      </main>

      <footer className="px-4 sm:px-5 py-8 border-t border-black/[0.04]">
        <div className="max-w-[760px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium tracking-[-0.01em]">Nouri</span>
            <span className="text-[11px] text-neutral-400 font-light">· {t('footer.motto')}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 text-[11px] sm:text-[12px] text-neutral-400 font-light">
            <Link href="/privacy" className="hover:text-black transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-black transition-colors">{t('footer.terms')}</Link>
            <Link href="/contact" className="hover:text-black transition-colors">{t('footer.contact')}</Link>
            <Link href="/donate" className="hover:text-black transition-colors">{t('footer.donate')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
