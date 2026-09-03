'use client';

import { useI18n } from '@/lib/I18nContext';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function MealCountSelector({ value, onChange }: Props) {
  const { t } = useI18n();
  const options = [3, 4, 5];

  return (
    <div>
      <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
        {t('gen.meals')}
      </label>
      <div className="flex gap-2">
        {options.map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 h-11 sm:h-12 rounded-full text-[15px] font-medium transition-all duration-300 ${
              value === n
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
