// 申込のステータスピル。status は applications.status に対応（DESIGN.md）。
type Status = "new" | "wait" | "ok" | "off";

const statusClass: Record<Status, string> = {
  new: "bg-shu-bg text-shu-ink",
  wait: "bg-wait-bg text-wait",
  ok: "bg-ok-bg text-ok",
  off: "bg-off-bg text-off",
};

export function StatusPill({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusClass[status]}`}
    >
      {label}
    </span>
  );
}
