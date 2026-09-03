'use client';

interface Props {
  days: string[];
  active: number;
  onChange: (i: number) => void;
}

const SHORT_DAYS_DE = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'];
const SHORT_DAYS_UK = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

export default function DaySelector({ days, active, onChange }: Props) {
  const SHORT_DAYS = days[0]?.includes('Monday') ? SHORT_DAYS_DE : SHORT_DAYS_UK;

  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
      {days.map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`flex-shrink-0 rounded-full text-[11px] sm:text-[12px] font-medium h-8 sm:h-9 px-3.5 transition-all duration-300 ${
            active === i
              ? 'bg-[#0a0a0a] text-white'
              : 'text-neutral-400 hover:text-black hover:bg-black/[0.03]'
          }`}
        >
          {SHORT_DAYS[i]}
        </button>
      ))}
    </div>
  );
}
