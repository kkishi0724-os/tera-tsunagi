"use client";

// ＋/− の大きなタップ領域で数値を増減（シニア配慮）。DESIGN_SYSTEM.md 5章。
export function Stepper({
  value,
  onChange,
  step = 5,
  min = 0,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  unit?: string;
}) {
  return (
    <div className="inline-flex items-center">
      <div className="inline-flex items-center overflow-hidden rounded-xl border-[1.5px] border-line">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          aria-label="減らす"
          className="grid h-[46px] w-[46px] place-items-center bg-card font-serif text-[22px] text-matcha-ink hover:bg-matcha-bg"
        >
          −
        </button>
        <span className="grid h-[46px] min-w-[66px] place-items-center border-x-[1.5px] border-line text-lg font-semibold tabular">
          {value}
        </span>
        <button
          onClick={() => onChange(value + step)}
          aria-label="増やす"
          className="grid h-[46px] w-[46px] place-items-center bg-card font-serif text-[22px] text-matcha-ink hover:bg-matcha-bg"
        >
          ＋
        </button>
      </div>
      {unit && <span className="ml-2.5 text-[14px] text-sumi-soft">{unit}</span>}
    </div>
  );
}
