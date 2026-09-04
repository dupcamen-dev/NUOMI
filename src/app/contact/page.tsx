'use client';

import { Send } from 'lucide-react';
import InfoLayout from '@/components/InfoLayout';
import { useI18n } from '@/lib/I18nContext';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <InfoLayout>
      <div className="animate-fade-in">
        <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-medium tracking-[-0.02em] mb-3">{t('contact.title')}</h1>
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-neutral-600 font-light mb-8">{t('contact.desc')}</p>

        <a
          href="https://t.me/NothingUA"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white border border-black/[0.06] rounded-[20px] p-5 hover:border-black/[0.15] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#0a0a0a] text-white flex items-center justify-center shrink-0">
            <Send size={18} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[12px] text-neutral-400 font-light uppercase tracking-wider mb-0.5">{t('contact.telegram')}</div>
            <div className="text-[17px] font-medium tracking-[-0.01em] text-black">@NothingUA</div>
          </div>
          <span className="ml-auto text-[11px] text-neutral-300 font-light group-hover:text-black transition-colors">↗</span>
        </a>
      </div>
    </InfoLayout>
  );
}
