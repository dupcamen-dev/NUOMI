'use client';

import { useState, useCallback, useRef } from 'react';
import { I18nProvider } from '@/lib/I18nContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MealGenerator from '@/components/MealGenerator';
import LoadingState from '@/components/LoadingState';
import WeeklyMenu from '@/components/WeeklyMenu';
import HowItWorks from '@/components/HowItWorks';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { GeneratorState, WeeklyMenu as WeeklyMenuType } from '@/lib/types';
import { generateWeeklyMenu } from '@/lib/algorithm';

export default function Home() {
  return (
    <I18nProvider>
      <HomeContent />
    </I18nProvider>
  );
}

function HomeContent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeeklyMenuType | null>(null);
  const [lastState, setLastState] = useState<GeneratorState | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback((state: GeneratorState) => {
    setLastState(state);
    setResult(null);
    setLoading(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const handleLoadingDone = useCallback(() => {
    if (lastState) {
      const menu = generateWeeklyMenu(lastState);
      setResult(menu);
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [lastState]);

  return (
    <main className="flex-1">
      <Navbar generatorRef={generatorRef} />
      <Hero />
      <div ref={generatorRef}>
        <MealGenerator onGenerate={handleGenerate} />
      </div>

      {loading && <LoadingState onDone={handleLoadingDone} />}

      {result && lastState && (
        <div ref={resultsRef}>
          <WeeklyMenu menu={result} dailyCalories={lastState.dailyCalories} userProducts={lastState.products} />
        </div>
      )}

      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  );
}
