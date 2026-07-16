import Link from "next/link";
import type { ReactNode } from "react";

// デザインシステムのボタン（DESIGN_SYSTEM.md 参照）。
// href があれば <Link>、なければ <button> として描画。
type Variant = "primary" | "shu" | "outline" | "ghost";
type Size = "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "bg-gradient-to-br from-matcha to-matcha-deep text-on-accent shadow-sm hover:brightness-105",
  shu: "bg-gradient-to-br from-shu to-shu-ink text-on-shu shadow-sm hover:brightness-105",
  outline: "bg-card border-[1.5px] border-line text-sumi hover:border-matcha hover:text-matcha-ink",
  ghost: "bg-card border-[1.5px] border-line text-sumi-soft hover:border-matcha hover:text-matcha-ink",
};
const sizeClass: Record<Size, string> = {
  md: "px-5 py-3 text-[15px]",
  lg: "px-6 py-3.5 text-[16.5px]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition ${variantClass[variant]} ${sizeClass[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}
