'use client';

import { ShoppingBag, Copy } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/I18nContext';
import { productName } from '@/lib/recipeTranslations';

interface ShoppingItem {
  product_name: string;
  quantity: number;
  unit: string;
}

interface Props {
  items: ShoppingItem[];
}

export default function ShoppingList({ items }: Props) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = items.map(i => `${productName(i.product_name, locale)} — ${i.quantity} ${i.unit}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={15} strokeWidth={1.5} className="text-neutral-400" />
          <h3 className="text-[15px] sm:text-[17px] font-medium tracking-[-0.01em]">{t('shop.title')}</h3>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 bg-[#fafafa] px-2 py-0.5 rounded-full font-medium">
            {items.length}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-light text-neutral-400 hover:text-black transition-colors"
        >
          <Copy size={12} strokeWidth={1.5} />
          {copied ? t('shop.copied') : t('shop.copy')}
        </button>
      </div>
      <div className="bg-white border border-black/[0.05] rounded-[18px] sm:rounded-[24px] py-2">
        <div className="divide-y divide-black/[0.04]">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 px-4 sm:px-6 text-[13px] sm:text-[14px] animate-fade-in"
            >
              <span className="font-light">{productName(item.product_name, locale)}</span>
              <span className="text-neutral-400 font-light">{item.quantity} {item.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
