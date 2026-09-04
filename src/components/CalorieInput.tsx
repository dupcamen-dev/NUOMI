'use client';

import { useState } from 'react';
import CalorieCalculator from './CalorieCalculator';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  value: number;
  onChange: (v: number) => void;
  labelKey?: string;
}

export default function CalorieInput({ value, onChange, labelKey }: Props) {
  const { t } = useI18n();
  const [showCalculator, setShowCalculator] = useState(false);

  const label = labelKey ? t(labelKey) : t('gen.calories');

  return (
    <>
      <div>
        <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-24 text-center text-[18px] sm:text-[20px] font-medium py-2.5 px-3 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300 tracking-[-0.02em]"
            min={1000}
            max={5000}
            step={50}
          />
          <span className="text-[13px] sm:text-[14px] text-neutral-400 font-light">{t('gen.kcal')}</span>
          <button
            onClick={() => setShowCalculator(true)}
            className="text-[12px] sm:text-[13px] text-neutral-400 ml-auto font-light hover:text-black transition-colors underline underline-offset-4 decoration-neutral-200 hover:decoration-black"
          >
            {t('gen.calcHint')}
          </button>
        </div>
      </div>

      {showCalculator && (
        <CalorieCalculator
          onApply={onChange}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </>
  );
}
