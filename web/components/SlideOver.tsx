"use client";

import type { ReactNode } from "react";

// 右からのスライドオーバー＋スクリム（申込・応募フォームの器）。DESIGN_SYSTEM.md 5章。
export function SlideOver({
  open,
  onClose,
  title,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[61] flex w-[min(520px,100%)] flex-col bg-washi shadow-lg transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center gap-3 border-b border-line bg-card px-5 py-4">
          <span className="font-serif text-[19px]">{title}</span>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="ml-auto grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-line bg-card text-lg text-sumi-soft hover:border-off hover:text-off"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-line bg-card px-5 py-3.5">{footer}</div>}
      </aside>
    </>
  );
}
