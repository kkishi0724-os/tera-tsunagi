import type { ReactNode } from "react";

// メッセージ吹き出し。self=自分(右・抹茶) / other=相手(左・中立) / ops=運営(全幅・金茶帯)。
// v3方針：やりとりは基本 self↔other の1対1、ops は閲覧・トラブル時のみ登場。
type Role = "self" | "other" | "ops";

export function MessageBubble({
  role, name, roleTag, time, avatar, children,
}: {
  role: Role; name?: string; roleTag?: string; time?: string; avatar?: string; children: ReactNode;
}) {
  if (role === "ops") {
    return (
      <div className="rounded-xl border border-kincha/40 bg-kincha-bg px-4 py-3">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-kincha text-sm text-white">✿</span>
          <span className="text-[13px] font-bold text-kincha">テラつなぎ運営</span>
          {roleTag && <span className="text-[11px] text-sumi-faint">{roleTag}</span>}
        </div>
        <div className="text-[14.5px] leading-relaxed text-sumi-soft">{children}</div>
        {time && <div className="mt-1.5 text-[11.5px] text-sumi-faint">{time}</div>}
      </div>
    );
  }

  const self = role === "self";
  return (
    <div className={`flex max-w-[82%] gap-2.5 ${self ? "ml-auto flex-row-reverse" : ""}`}>
      <div className={`grid h-10 w-10 flex-none place-items-center rounded-full font-serif text-[17px] text-[#f4f1e6] ${self ? "bg-gradient-to-br from-matcha to-matcha-ink" : "bg-gradient-to-br from-[#8a7f6a] to-[#6f6553]"}`}>{avatar}</div>
      <div>
        <div className={`mb-1 flex items-center gap-2 text-[12.5px] text-sumi-faint ${self ? "flex-row-reverse" : ""}`}>
          {name}
          {roleTag && <span className={`rounded-[10px] px-1.5 py-px text-[11px] font-semibold ${self ? "bg-matcha text-[#f4f1e6]" : "bg-washi-2 text-sumi-soft"}`}>{roleTag}</span>}
        </div>
        <div className={`px-[15px] py-3 text-[15px] leading-relaxed ${self ? "rounded-2xl rounded-tr-[5px] bg-matcha-bg text-sumi" : "rounded-2xl rounded-tl-[5px] border border-line-soft bg-card"}`}>{children}</div>
        {time && <div className={`mt-1.5 text-[11.5px] text-sumi-faint ${self ? "text-right" : ""}`}>{time}</div>}
      </div>
    </div>
  );
}
