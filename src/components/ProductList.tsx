'use client';

import { X } from 'lucide-react';
import { UserProduct } from '@/lib/types';
import { useI18n } from '@/lib/I18nContext';
import { productName } from '@/lib/recipeTranslations';

interface Props {
  products: UserProduct[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateUnit: (id: string, unit: string) => void;
}

const UNITS = ['г', 'кг', 'шт', 'мл'];

export default function ProductList({ products, onRemove, onUpdateQuantity, onUpdateUnit }: Props) {
  const { locale } = useI18n();
  if (products.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {products.map((up, i) => (
        <div
          key={up.product.id}
          className={`flex items-center gap-2 py-2.5 px-3 bg-[#fafafa] border border-black/[0.04] rounded-xl animate-fade-in transition-colors hover:border-black/[0.08] stagger-${Math.min(i + 1, 7)}`}
        >
          <span className="text-[13px] sm:text-[14px] font-medium flex-1 min-w-0 truncate text-[#0a0a0a]">
            {productName(up.product.name, locale)}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              type="number"
              value={up.quantity}
              onChange={e => onUpdateQuantity(up.product.id, Number(e.target.value))}
              className="w-14 text-center text-[13px] py-1.5 px-1.5 border border-black/[0.06] rounded-lg outline-none focus:border-black/20 bg-white transition-colors font-medium"
              min={0}
            />
            <select
              value={up.unit}
              onChange={e => onUpdateUnit(up.product.id, e.target.value)}
              className="text-[12px] py-1.5 px-1.5 border border-black/[0.06] rounded-lg outline-none focus:border-black/20 bg-white text-neutral-400 transition-colors appearance-none cursor-pointer font-light"
            >
              {UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <button
              onClick={() => onRemove(up.product.id)}
              className="p-1 text-neutral-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
            >
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
