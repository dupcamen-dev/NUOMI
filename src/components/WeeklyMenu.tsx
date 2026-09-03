'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { WeeklyMenu as WeeklyMenuType, UserProduct } from '@/lib/types';
import DaySelector from './DaySelector';
import MealCard from './MealCard';
import MealDetails from './MealDetails';
import ShoppingList from './ShoppingList';
import { PANTRY_STAPLES } from '@/lib/algorithm';
import { downloadMenuPDF } from '@/lib/generatePDF';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  menu: WeeklyMenuType;
  dailyCalories: number;
  userProducts: UserProduct[];
}

export default function WeeklyMenu({ menu, dailyCalories, userProducts }: Props) {
  const { t } = useI18n();
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);

  const day = menu.days[activeDay];
  const avgCalories = Math.round(menu.days.reduce((s, d) => s + d.total_calories, 0) / 7);
  const avgProtein = Math.round(menu.days.reduce((s, d) => s + d.total_protein, 0) / 7);

  const userProductNames = new Set(userProducts.map(p => p.product.name));

  const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: t('meal.breakfast'),
    lunch: t('meal.lunch'),
    snack: t('meal.snack'),
    dinner: t('meal.dinner'),
  };

  return (
    <section id="results" className="px-4 sm:px-5 py-10 sm:py-16">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium tracking-[-0.02em]">{t('res.title')}</h2>
          <p className="text-neutral-400 text-[13px] sm:text-[14px] mt-2 font-light">
            {t('res.subtitle', { cal: dailyCalories })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8 sm:mb-10 animate-fade-in stagger-1">
          <div className="text-center">
            <div className="text-[20px] sm:text-[22px] font-medium tracking-[-0.02em]">{avgCalories}</div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">{t('res.avgCal')}</div>
          </div>
          <div className="w-px h-10 bg-black/[0.06]" />
          <div className="text-center">
            <div className="text-[20px] sm:text-[22px] font-medium tracking-[-0.02em]">{avgProtein}г</div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">{t('res.avgProtein')}</div>
          </div>
        </div>

        <div className="flex justify-center mb-8 sm:mb-10 animate-fade-in stagger-2">
          <DaySelector
            days={menu.days.map(d => d.day)}
            active={activeDay}
            onChange={setActiveDay}
          />
        </div>

        <div className="mb-2 animate-fade-in">
          <h3 className="text-[14px] sm:text-[15px] font-medium text-neutral-400 mb-3 sm:mb-4">{day.day}</h3>
          <div className="space-y-2.5 sm:space-y-3">
            {day.meals.map((meal, i) => {
              const missingIngredients = meal.recipe.ingredients.filter(
                ing => !userProductNames.has(ing.product_name) && !PANTRY_STAPLES.has(ing.product_name)
              );
              return (
                <MealCard
                  key={i}
                  meal={meal}
                  mealTypeLabel={MEAL_TYPE_LABELS[meal.recipe.meal_type] || meal.recipe.meal_type}
                  missingIngredients={missingIngredients.map(i => i.product_name)}
                  onClick={() => setSelectedMeal(i)}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center py-4 text-[12px] sm:text-[13px] text-neutral-400 font-light animate-fade-in">
          {t('res.together')} {day.total_calories} kcal
        </div>

        {selectedMeal !== null && day.meals[selectedMeal] && (
          <MealDetails
            meal={day.meals[selectedMeal]}
            userProductNames={userProductNames}
            onClose={() => setSelectedMeal(null)}
          />
        )}

        {menu.shopping_list.length > 0 && (
          <>
            <div className="border-t border-black/[0.05] my-8" />
            <ShoppingList items={menu.shopping_list} />
          </>
        )}

        <div className="flex justify-center mt-8 sm:mt-10 animate-fade-in">
          <button
            onClick={() => downloadMenuPDF(menu, dailyCalories, userProducts)}
            className="flex items-center gap-2 text-[13px] sm:text-[14px] font-light text-neutral-500 hover:text-black transition-colors group"
          >
            <Download size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-y-0.5" />
            {t('res.download')}
          </button>
        </div>

        <div className="text-center mt-6 text-[10px] sm:text-[11px] text-neutral-300 font-light">
          {t('res.disclaimer')}
        </div>
      </div>
    </section>
  );
}
