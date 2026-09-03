'use client';

import { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';

interface Props {
  onApply: (calories: number) => void;
  onClose: () => void;
}

export default function CalorieCalculator({ onApply, onClose }: Props) {
  const { t } = useI18n();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState(1.375);
  const [goal, setGoal] = useState(0);

  const ACTIVITY_LEVELS = [
    { value: 1.2, label: t('calc.low'), desc: t('calc.lowDesc') },
    { value: 1.375, label: t('calc.mid'), desc: t('calc.midDesc') },
    { value: 1.55, label: t('calc.high'), desc: t('calc.highDesc') },
  ];

  const GOALS = [
    { value: -0.2, label: t('calc.lose'), desc: t('calc.loseDesc') },
    { value: 0, label: t('calc.maintain'), desc: t('calc.maintainDesc') },
    { value: 0.15, label: t('calc.gain'), desc: t('calc.gainDesc') },
  ];

  const calculate = (): number => {
    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = bmr * activity;
    return Math.round(tdee + tdee * goal);
  };

  const maintenance = Math.round(
    gender === 'male'
      ? (10 * weight + 6.25 * height - 5 * age + 5) * activity
      : (10 * weight + 6.25 * height - 5 * age - 161) * activity
  );

  const result = calculate();
  const goalObj = GOALS.find(g => g.value === goal)!;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-[420px] md:rounded-[24px] rounded-t-[24px] p-5 sm:p-7 md:p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-50"
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          <Calculator size={16} strokeWidth={1.5} className="text-neutral-400" />
          <h3 className="text-[17px] sm:text-[18px] font-medium tracking-[-0.02em]">{t('calc.title')}</h3>
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
            {t('calc.goal')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-2xl text-center transition-all duration-300 ${
                  goal === g.value
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
                }`}
              >
                <div className="text-[11px] sm:text-[12px] font-medium">{g.label}</div>
                <div className={`text-[9px] sm:text-[10px] mt-0.5 font-light ${goal === g.value ? 'text-white/50' : 'text-neutral-400'}`}>
                  {g.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
            {t('calc.gender')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                gender === 'male'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
              }`}
            >
              {t('calc.male')}
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                gender === 'female'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
              }`}
            >
              {t('calc.female')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div>
            <label className="block text-[10px] sm:text-[11px] font-medium text-neutral-400 mb-1.5">{t('calc.age')}</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full text-center text-[14px] sm:text-[15px] font-medium py-2.5 px-2 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-[11px] font-medium text-neutral-400 mb-1.5">{t('calc.height')}</label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="w-full text-center text-[14px] sm:text-[15px] font-medium py-2.5 px-2 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-[11px] font-medium text-neutral-400 mb-1.5">{t('calc.weight')}</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              className="w-full text-center text-[14px] sm:text-[15px] font-medium py-2.5 px-2 border border-black/[0.06] rounded-2xl outline-none focus:border-black/20 bg-white transition-all duration-300"
            />
          </div>
        </div>

        <div className="mb-5 sm:mb-6">
          <label className="block text-[11px] sm:text-[12px] font-medium text-neutral-400 mb-2 tracking-[0.08em] uppercase">
            {t('calc.activity')}
          </label>
          <div className="space-y-1.5">
            {ACTIVITY_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => setActivity(level.value)}
                className={`w-full text-left py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-2xl transition-all duration-300 ${
                  activity === level.value
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-transparent text-[#0a0a0a] border border-black/[0.06] hover:border-black/[0.15]'
                }`}
              >
                <span className="text-[13px] sm:text-[14px] font-medium">{level.label}</span>
                <span className={`text-[11px] sm:text-[12px] ml-2 font-light ${activity === level.value ? 'text-white/50' : 'text-neutral-400'}`}>
                  {level.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#fafafa] rounded-2xl p-3.5 sm:p-4 text-center mb-3 sm:mb-4">
          {goal !== 0 && (
            <div className="text-[11px] sm:text-[12px] text-neutral-400 mb-1 font-light">
              {t('calc.maintain')}: {maintenance} kcal · {goalObj.label}: {goal > 0 ? '+' : ''}{Math.round(maintenance * goal)} kcal
            </div>
          )}
          <div className="text-[12px] sm:text-[13px] text-neutral-400 mb-1 font-light">{t('calc.result')}</div>
          <div className="text-[24px] sm:text-[28px] font-medium tracking-[-0.02em]">{result} kcal</div>
        </div>

        <button
          onClick={() => { onApply(result); onClose(); }}
          className="w-full py-3 bg-[#0a0a0a] text-white text-[14px] sm:text-[15px] font-medium rounded-full hover:bg-black transition-all duration-300 active:scale-[0.98]"
        >
          {t('calc.apply')} {result} kcal
        </button>
      </div>
    </div>
  );
}
