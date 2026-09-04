'use client';

import { useState } from 'react';
import { Copy, Check, Coffee, AlertTriangle } from 'lucide-react';
import InfoLayout from '@/components/InfoLayout';
import { useI18n } from '@/lib/I18nContext';

const USDT_ADDRESS = 'THL3bPd57VdxC5LrHK6N8sh9KGANLo3V2H';

export default function DonatePage() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(USDT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <InfoLayout>
      <div className="animate-fade-in">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex w-14 h-14 rounded-full bg-[#0a0a0a] text-white items-center justify-center mb-5">
            <Coffee size={24} strokeWidth={1.5} />
          </div>
          <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-medium tracking-[-0.02em] mb-2">{t('donate.title')}</h1>
          <p className="text-[14px] sm:text-[15px] text-neutral-500 font-light">{t('donate.subtitle')}</p>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] sm:text-[12px] font-medium text-neutral-400 uppercase tracking-[0.08em] mb-3">
            {t('donate.crypto')} · {t('donate.usdtLabel')}
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-[13px] sm:text-[14px] py-1.5">
              <span className="text-neutral-400 font-light">{t('donate.network')}</span>
              <span className="font-medium">{t('donate.trc20')}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-light shrink-0">{t('donate.address')}</span>
              <div className="text-right">
                <div className="font-mono text-[12px] sm:text-[13px] leading-relaxed break-all text-neutral-800 font-medium">{USDT_ADDRESS}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3.5 bg-[#0a0a0a] text-white text-[14px] font-medium rounded-full hover:bg-black transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
            {copied ? t('donate.copied') : t('donate.copy')}
          </button>

          <div className="mt-5 flex items-start gap-2.5 text-[12px] sm:text-[13px] text-amber-700 font-light bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-3">
            <AlertTriangle size={15} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <span>{t('donate.warning')}</span>
          </div>
        </div>

        <p className="text-center mt-6 text-[13px] text-neutral-400 font-light">{t('donate.thanks')}</p>
      </div>
    </InfoLayout>
  );
}
