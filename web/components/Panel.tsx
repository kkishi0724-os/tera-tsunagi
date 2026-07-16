import type { ReactNode } from "react";

// パネル（見出しに色マーク＋任意の右アクション）。DESIGN_SYSTEM.md 5章。
export function Panel({
  title,
  markColor = "var(--matcha)",
  action,
  children,
}: {
  title: string;
  markColor?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line-soft bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-line px-[18px] py-4">
        <span className="h-5 w-[7px] rounded-[2px]" style={{ background: markColor }} />
        <span className="font-serif text-[17.5px]">{title}</span>
        {action && <span className="ml-auto">{action}</span>}
      </div>
      {children}
    </div>
  );
}
