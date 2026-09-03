'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import { useI18n } from '@/lib/I18nContext';
import { productName } from '@/lib/recipeTranslations';

interface Props {
  onSelect: (product: Product) => void;
}

export default function ProductInput({ onSelect }: Props) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const r = searchProducts(query, locale);
      setResults(r);
      setOpen(r.length > 0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && results.length > 0 && setOpen(true)}
          placeholder={t('gen.search')}
          className="w-full pl-10 pr-4 py-3 text-[14px] sm:text-[15px] bg-[#fafafa] border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all duration-300 placeholder:text-neutral-300 font-light"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-fade-in max-h-56 overflow-y-auto">
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => {
                onSelect(p);
                setQuery('');
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-[13px] sm:text-[14px] hover:bg-[#fafafa] transition-colors flex items-center justify-between group border-b border-black/[0.03] last:border-0"
            >
              <div>
                <span className="font-medium text-[#0a0a0a]">{productName(p.name, locale)}</span>
                <span className="text-neutral-300 text-[12px] ml-2 font-light">
                  {p.calories_per_100g} kcal/100{p.default_unit}
                </span>
              </div>
              <span className="text-neutral-400 text-[11px] font-light opacity-0 group-hover:opacity-100 transition-opacity">
                {t('gen.add')}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
