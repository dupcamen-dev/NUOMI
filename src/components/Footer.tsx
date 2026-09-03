'use client';

import { useI18n } from '@/lib/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="px-4 sm:px-5 py-10 sm:py-14 border-t border-black/[0.04]">
      <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] sm:text-[14px] font-medium tracking-[-0.01em]">Nouri</span>
          <span className="text-[11px] sm:text-[12px] text-neutral-400 font-light">· {t('footer.motto')}</span>
        </div>
        <div className="flex items-center gap-5 sm:gap-6 text-[11px] sm:text-[12px] text-neutral-400 font-light">
          <a href="https://millionpixels.dev" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Designed &amp; Built by Million Pixels</a>
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
          <a href="#" className="hover:text-black transition-colors">Terms</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
