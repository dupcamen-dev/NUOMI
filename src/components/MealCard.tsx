'use client';

import { Meal } from '@/lib/types';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  meal: Meal;
  mealTypeLabel: string;
  missingIngredients: string[];
  onClick: () => void;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

export default function MealCard({ meal, mealTypeLabel, missingIngredients, onClick }: Props) {
  const { t } = useI18n();

  const proteinLabel = t('detail.protein');
  const fatLabel = t('detail.fat');
  const carbsLabel = t('detail.carbs');

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-black/[0.05] rounded-[18px] sm:rounded-[24px] p-4 sm:p-6 transition-all duration-300 hover:border-black/[0.1] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between mb-2.5 sm:mb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-neutral-400 font-medium">
            {mealTypeLabel}
          </span>
          <h4 className="text-[15px] sm:text-[17px] font-medium mt-1 tracking-[-0.01em]">{meal.recipe.name}</h4>
        </div>
        <span className="text-base sm:text-lg mt-1 opacity-70">{MEAL_ICONS[meal.recipe.meal_type] || '🍽'}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] text-neutral-400 font-light">
        <span className="font-medium text-[#0a0a0a]">{meal.actual_calories} kcal</span>
        <span className="w-px h-4 bg-black/[0.06]" />
        <span>{proteinLabel} {meal.actual_protein}г</span>
        <span>{fatLabel} {meal.actual_fat}г</span>
        <span>{carbsLabel} {meal.actual_carbs}г</span>
      </div>
      {missingIngredients.length > 0 && (
        <div className="mt-3 sm:mt-4 px-3.5 sm:px-4 py-2 bg-amber-50/60 border border-amber-100 rounded-xl">
          <span className="text-[11px] sm:text-[12px] text-amber-700 font-light">
            {t('missing.prefix')} <span className="font-medium">{missingIngredients.join(', ')}</span>
          </span>
        </div>
      )}
    </button>
  );
}
