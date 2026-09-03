'use client';

import { Meal } from '@/lib/types';
import { useI18n } from '@/lib/I18nContext';
import { RECIPE_IMAGES } from '@/lib/recipeImages';
import { useState } from 'react';

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
  const [imgError, setImgError] = useState(false);

  const proteinLabel = t('detail.protein');
  const fatLabel = t('detail.fat');
  const carbsLabel = t('detail.carbs');
  const image = RECIPE_IMAGES[meal.recipe.id];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-black/[0.05] rounded-[18px] sm:rounded-[24px] overflow-hidden transition-all duration-300 hover:border-black/[0.1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] active:scale-[0.99] group"
    >
      {image && !imgError && (
        <div className="relative h-28 sm:h-36 overflow-hidden bg-neutral-100">
          <img
            src={image}
            alt={meal.recipe.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-neutral-600 font-medium">
            {mealTypeLabel}
          </span>
        </div>
      )}
      <div className="p-4 sm:p-5">
        {(!image || imgError) && (
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-neutral-400 font-medium">
              {mealTypeLabel}
            </span>
            <span className="text-base sm:text-lg opacity-70">{MEAL_ICONS[meal.recipe.meal_type] || '🍽'}</span>
          </div>
        )}
        <h4 className="text-[15px] sm:text-[17px] font-medium tracking-[-0.01em]">{meal.recipe.name}</h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4 mt-2 text-[11px] sm:text-[12px] text-neutral-400 font-light">
          <span className="font-medium text-[#0a0a0a]">{meal.actual_calories} kcal</span>
          <span className="w-px h-4 bg-black/[0.06]" />
          <span>{proteinLabel} {meal.actual_protein}г</span>
          <span>{fatLabel} {meal.actual_fat}г</span>
          <span>{carbsLabel} {meal.actual_carbs}г</span>
        </div>
        {missingIngredients.length > 0 && (
          <div className="mt-3 px-3.5 py-2 bg-amber-50/60 border border-amber-100 rounded-xl">
            <span className="text-[11px] sm:text-[12px] text-amber-700 font-light">
              {t('missing.prefix')} <span className="font-medium">{missingIngredients.join(', ')}</span>
            </span>
          </div>
        )}
      </div>
    </button>
  );
}