'use client';

import { Plus } from 'lucide-react';
import ProductInput from './ProductInput';
import ProductList from './ProductList';
import CalorieInput from './CalorieInput';
import MealCountSelector from './MealCountSelector';
import { Product, UserProduct, GeneratorState } from '@/lib/types';
import { useState } from 'react';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  onGenerate: (state: GeneratorState) => void;
}

export default function MealGenerator({ onGenerate }: Props) {
  const { t } = useI18n();
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [dailyCalories, setDailyCalories] = useState(2200);
  const [mealCount, setMealCount] = useState(4);
  const [people, setPeople] = useState<1 | 2>(1);
  const [calories2, setCalories2] = useState(1900);

  const setPeopleSafe = (p: 1 | 2) => {
    setPeople(p);
  };

  const addProduct = (product: Product) => {
    if (products.find(p => p.product.id === product.id)) return;
    setProducts(prev => [...prev, { product, quantity: 100, unit: product.default_unit }]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.product.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setProducts(prev =>
      prev.map(p => (p.product.id === id ? { ...p, quantity } : p))
    );
  };

  const updateUnit = (id: string, unit: string) => {
    setProducts(prev =>
      prev.map(p => (p.product.id === id ? { ...p, unit: unit as any } : p))
    );
  };

  const handleGenerate = () => {
    if (products.length === 0) return;
    onGenerate({
      products,
      dailyCalories,
      mealCount,
      people,
      calories2: people === 2 ? calories2 : undefined,
    });
  };

  return (
    <section id="generator" className="px-4 sm:px-5 pb-14 sm:pb-20">
      <div className="max-w-[580px] mx-auto">
        <div className="bg-white border border-black/[0.06] rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 md:p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] sm:text-[19px] font-medium tracking-[-0.02em] mb-1">{t('gen.title')}</h2>
          <p className="text-[13px] sm:text-[14px] text-neutral-400 font-light mb-1">
            {t('gen.desc')}
          </p>
          <p className="text-[11px] sm:text-[12px] text-neutral-300 font-light mb-5 sm:mb-6">
            {t('gen.hint')}
          </p>

          <ProductInput onSelect={addProduct} />

          <div className="mt-4">
            <ProductList
              products={products}
              onRemove={removeProduct}
              onUpdateQuantity={updateQuantity}
              onUpdateUnit={updateUnit}
            />
          </div>

          {products.length > 0 && (
            <button
              onClick={() => {}}
              className="mt-3 text-[12px] sm:text-[13px] text-neutral-400 font-light hover:text-black transition-colors flex items-center gap-1"
            >
              <Plus size={13} strokeWidth={1.5} />
              {t('gen.addProduct')}
            </button>
          )}

          <div className="border-t border-black/[0.05] my-5 sm:my-6" />

          <div className="mb-5 sm:mb-6">
            <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
              {t('gen.people')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPeopleSafe(1)}
                className={`flex-1 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                  people === 1
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
                }`}
              >
                {t('gen.onePerson')}
              </button>
              <button
                onClick={() => setPeopleSafe(2)}
                className={`flex-1 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                  people === 2
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
                }`}
              >
                {t('gen.twoPeople')}
              </button>
            </div>
            {people === 2 && (
              <p className="text-[11px] sm:text-[12px] text-neutral-300 font-light mt-2">
                {t('gen.twoHint')}
              </p>
            )}
          </div>

          <CalorieInput value={dailyCalories} onChange={setDailyCalories} />

          {people === 2 && (
            <div className="mt-5">
              <CalorieInput
                value={calories2}
                onChange={setCalories2}
                labelKey="gen.calories2"
              />
            </div>
          )}

          <div className="mt-5">
            <MealCountSelector value={mealCount} onChange={setMealCount} />
          </div>

          <button
            onClick={handleGenerate}
            disabled={products.length === 0}
            className="w-full mt-6 sm:mt-8 py-3.5 bg-[#0a0a0a] text-white text-[14px] sm:text-[15px] font-medium rounded-full hover:bg-black transition-all duration-300 active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {t('gen.generate')}
          </button>
        </div>
      </div>
    </section>
  );
}
