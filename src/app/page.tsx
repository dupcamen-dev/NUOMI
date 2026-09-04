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
import SplashScreen from '@/components/SplashScreen';
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
  const [splashDone, setSplashDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeeklyMenuType | null>(null);
  const [lastState, setLastState] = useState<GeneratorState | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);

  const scrollToOutput = () => {
    requestAnimationFrame(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleGenerate = useCallback((state: GeneratorState) => {
    setLastState(state);
    setResult(null);
    setLoading(true);
    scrollToOutput();
  }, []);

  const handleLoadingDone = useCallback(() => {
    if (lastState) {
      const menu = generateWeeklyMenu(lastState);
      setResult(menu);
      setLoading(false);
      // Scroll after the result is rendered
      setTimeout(scrollToOutput, 150);
    }
  }, [lastState]);

  return (
    <main className="flex-1">
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Navbar generatorRef={generatorRef} />
      <Hero />
      <div ref={generatorRef}>
        <MealGenerator onGenerate={handleGenerate} />
      </div>

      <div ref={outputRef} className="scroll-mt-20">
        {loading && <LoadingState onDone={handleLoadingDone} />}

        {result && lastState && (
          <WeeklyMenu
            menu={result}
            dailyCalories={lastState.dailyCalories}
            userProducts={lastState.products}
            people={lastState.people || 1}
            calories2={lastState.calories2}
          />
        )}
      </div>

      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  );
}