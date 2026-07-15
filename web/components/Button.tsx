import type { ReactNode } from "react";

// デザインシステムのボタン variant（DESIGN_SYSTEM.md 参照）。
// 見た目は prototype の各ボタンから移植。ここでは代表 3 種を実装。
type Variant = "primary" | "shu" | "outline";

const variantClass: Record<Variant, string> = {
  primary: "bg-gradient-to-br from-matcha to-matcha-deep text-on-accent hover:brightness-105",
  shu: "bg-gradient-to-br from-shu to-shu-ink text-on-shu hover:brightness-105",
  outline: "bg-card border-[1.5px] border-line text-sumi hover:border-matcha hover:text-matcha-ink",
};

export function Button({
  variant = "primary",
  children,
}: {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold shadow-sm transition ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
}
