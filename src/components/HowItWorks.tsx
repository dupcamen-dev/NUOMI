'use client';

import { useI18n } from '@/lib/I18nContext';

export default function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    { num: '01', title: t('how.1'), desc: t('how.1desc') },
    { num: '02', title: t('how.2'), desc: t('how.2desc') },
    { num: '03', title: t('how.3'), desc: t('how.3desc') },
  ];

  return (
    <section id="how-it-works" className="px-4 sm:px-5 py-16 sm:py-24">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-medium text-center tracking-[-0.02em] mb-12 sm:mb-16">
          {t('how.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
          {steps.map(step => (
            <div key={step.num} className="text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto md:mx-auto rounded-full border border-black/[0.05] flex items-center justify-center mb-4 sm:mb-5">
                <span className="text-[13px] font-light text-neutral-400 tracking-[0.15em]">{step.num}</span>
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-medium mb-1.5">{step.title}</h3>
              <p className="text-[13px] sm:text-[14px] text-neutral-400 font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
