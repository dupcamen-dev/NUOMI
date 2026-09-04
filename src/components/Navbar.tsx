'use client';

import { useState, useEffect, RefObject } from 'react';
import { Menu, X } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  generatorRef: RefObject<HTMLDivElement | null>;
}

export default function Navbar({ generatorRef }: Props) {
  const { locale, setLocale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToGenerator = () => {
    setMobileOpen(false);
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#fafafa]/70 backdrop-blur-md border-b border-black/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-5 h-14 sm:h-[60px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="font-semibold text-[16px] tracking-[-0.02em] text-black">Nouri</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          <a href="#how-it-works" className="text-[13px] font-light text-neutral-500 hover:text-black transition-colors duration-300">
            {t('nav.how')}
          </a>
          <a href="/donate" className="text-[13px] font-light text-neutral-500 hover:text-black transition-colors duration-300">
            {t('footer.donate')}
          </a>
          <button
            onClick={scrollToGenerator}
            className="text-[13px] font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-neutral-800 transition-all duration-300 active:scale-[0.97]"
          >
            {t('nav.cta')}
          </button>
          <button
            onClick={() => setLocale(locale === 'uk' ? 'de' : 'uk')}
            className="text-[12px] font-medium px-2.5 py-1 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors text-neutral-400 hover:text-black"
          >
            {locale === 'uk' ? 'DE' : 'UA'}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLocale(locale === 'uk' ? 'de' : 'uk')}
            className="text-[11px] font-medium px-2 py-1 rounded-full border border-neutral-200 text-neutral-400"
          >
            {locale === 'uk' ? 'DE' : 'UA'}
          </button>
          <button
            className="p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#fafafa]/75 backdrop-blur-md border-b border-black/[0.04] px-4 pb-5 pt-3 space-y-1 animate-fade-in">
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-[14px] font-light text-neutral-500 py-3"
          >
            {t('nav.how')}
          </a>
          <a
            href="/donate"
            onClick={() => setMobileOpen(false)}
            className="block text-[14px] font-light text-neutral-500 py-3"
          >
            {t('footer.donate')}
          </a>
          <button
            onClick={scrollToGenerator}
            className="block w-full text-[14px] font-medium bg-black text-white px-5 py-3 rounded-full text-center mt-2"
          >
            {t('nav.cta')}
          </button>
        </div>
      )}
    </nav>
  );
}
