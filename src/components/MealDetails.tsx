'use client';

import { Meal } from '@/lib/types';
import { X, Clock } from 'lucide-react';
import { DRY_WEIGHT_PRODUCTS, PANTRY_STAPLES } from '@/lib/algorithm';
import { useI18n } from '@/lib/I18nContext';
import { recipeName } from '@/lib/recipeTranslations';

interface Props {
  meal: Meal;
  userProductNames: Set<string>;
  onClose: () => void;
}

export default function MealDetails({ meal, userProductNames, onClose }: Props) {
  const { t, locale } = useI18n();
  const dishName = recipeName(meal.recipe.id, locale, meal.recipe.name);

  const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: t('meal.breakfast'),
    lunch: t('meal.lunch'),
    snack: t('meal.snack'),
    dinner: t('meal.dinner'),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-[480px] md:rounded-[24px] rounded-t-[24px] p-5 sm:p-7 md:p-8 max-h-[85vh] overflow-y-auto animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-50"
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="mb-5 sm:mb-6">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-neutral-400 font-medium">
            {MEAL_TYPE_LABELS[meal.recipe.meal_type] || meal.recipe.meal_type}
          </span>
          <h3 className="text-[19px] sm:text-[22px] font-medium tracking-[-0.02em] pr-10 mt-1">{dishName}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] sm:text-[12px] text-neutral-400 font-light">
            <Clock size={12} strokeWidth={1.5} />
            <span>{meal.recipe.prep_time} {t('detail.time')}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {[
            { label: t('detail.calories'), value: `${meal.actual_calories}`, unit: 'kcal' },
            { label: t('detail.protein'), value: `${meal.actual_protein}`, unit: 'г' },
            { label: t('detail.fat'), value: `${meal.actual_fat}`, unit: 'г' },
            { label: t('detail.carbs'), value: `${meal.actual_carbs}`, unit: 'г' },
          ].map(n => (
            <div key={n.label} className="text-center py-3 px-2 bg-[#fafafa] rounded-2xl">
              <div className="text-[14px] sm:text-[16px] font-medium tracking-[-0.01em]">{n.value}</div>
              <div className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{n.unit}</div>
              <div className="text-[9px] sm:text-[10px] text-neutral-400 font-light mt-0.5">{n.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 sm:mb-6">
          <h4 className="text-[11px] sm:text-[12px] font-medium text-neutral-400 tracking-[0.08em] uppercase mb-3">
            {t('detail.ingredients')}
          </h4>
          <div className="space-y-1.5 sm:space-y-2">
            {meal.recipe.ingredients.map((ing, i) => {
              const isOwned = userProductNames.has(ing.product_name) || PANTRY_STAPLES.has(ing.product_name);
              return (
                <div
                  key={i}
                  className={`flex justify-between text-[13px] sm:text-[14px] py-1.5 px-3 rounded-xl ${
                    isOwned ? 'bg-[#fafafa] border border-black/[0.03]' : 'bg-amber-50/60 border border-amber-100'
                  }`}
                >
                  <span className="font-light">
                    {ing.product_name}
                    {DRY_WEIGHT_PRODUCTS.has(ing.product_name) && (
                      <span className="text-[10px] sm:text-[11px] text-neutral-400 ml-1">{t('detail.dry')}</span>
                    )}
                  </span>
                  <span className={isOwned ? 'text-neutral-400 font-light' : 'text-amber-700 font-medium'}>
                    {ing.quantity} {ing.unit}
                    {!isOwned && ` ${t('detail.buy')}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] sm:text-[12px] font-medium text-neutral-400 tracking-[0.08em] uppercase mb-3">
            {t('detail.cooking')}
          </h4>
          <p className="text-[13px] sm:text-[14px] leading-relaxed text-neutral-500 font-light">
            {meal.recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
}
