'use client';

import { Refrigerator } from 'lucide-react';

interface LeftoverItem {
  product_name: string;
  quantity: number;
  unit: string;
}

interface Props {
  items: LeftoverItem[];
}

export default function Leftovers({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Refrigerator size={18} className="text-[var(--color-muted)]" />
        <h3 className="text-[18px] font-semibold">Що залишиться</h3>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 bg-[var(--color-background)] rounded-xl text-[14px]"
            >
              <span className="font-medium truncate mr-2">{item.product_name}</span>
              <span className="text-[var(--color-muted)] flex-shrink-0">{item.quantity} {item.unit}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-[13px] font-medium text-[var(--color-accent)] hover:underline">
          Скласти наступний тиждень із залишків →
        </button>
      </div>
    </div>
  );
}
