import type { ReactNode } from "react";

// 統計タイル（左にセマンティック帯＋明朝の大数値）。DESIGN_SYSTEM.md 5章。
// stripe はトークン名（matcha / shu / wait / kincha 等）。
export function StatTile({
  label,
  value,
  unit,
  stripe = "matcha",
  trend,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  stripe?: string;
  trend?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-line-soft bg-card p-4 shadow-sm">
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: `var(--${stripe})` }} />
      <div className="text-[13.5px] text-sumi-soft">{label}</div>
      <div className="mt-1.5 font-serif text-[32px] leading-tight tabular">
        {value}
        {unit && <small className="ml-0.5 font-sans text-[15px] text-sumi-faint">{unit}</small>}
      </div>
      {trend && <div className="mt-0.5 text-[12.5px] text-sumi-faint">{trend}</div>}
    </div>
  );
}
