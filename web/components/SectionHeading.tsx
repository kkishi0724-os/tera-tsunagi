import type { ReactNode } from "react";

// セクション見出し（eyebrow＋明朝タイトル＋リード）。DESIGN_SYSTEM.md の型スケール準拠。
export function SectionHeading({
  tag,
  title,
  lead,
  center = false,
}: {
  tag: string;
  title: ReactNode;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-kincha">{tag}</div>
      <h2 className="mt-2.5 font-serif text-[clamp(26px,3.6vw,34px)] leading-snug tracking-wide">{title}</h2>
      {lead && (
        <p className={`mt-2 text-[15.5px] leading-relaxed text-sumi-soft ${center ? "mx-auto max-w-[40em]" : "max-w-[40em]"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
