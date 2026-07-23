"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { StatTile } from "@/components/StatTile";
import { Panel } from "@/components/Panel";

// 寺院ダッシュボード。prototype/temple-owner-dashboard.html を移植（移植第2号・状態を持つ管理画面の見本）。
type Status = "new" | "wait" | "ok" | "off";
const STATUS_LABEL: Record<Status, string> = { new: "新着", wait: "調整中", ok: "承認済み", off: "辞退" };

type App = {
  id: string; em: string; title: string; org: string; status: Status;
  place: string; when: string; count: string; note: string;
  resolved?: string; // 解決済みメッセージ（承認/辞退でロック）
};

const INITIAL_APPS: App[] = [
  { id: "yoga", em: "🧘", title: "朝の寺ヨガ教室", org: "みどりヨガスタジオ・田村 佳奈 さん", status: "new",
    place: "本堂", when: "8/3(日) 7:00–8:30", count: "15名",
    note: "静かな朝の本堂で呼吸を整えるヨガを。マットは持参、音楽なし・声かけのみで進行します。" },
  { id: "wagashi", em: "🍡", title: "和菓子づくりワークショップ", org: "季なごみ工房・清水 誠 さん", status: "new",
    place: "客殿（和室）", when: "8/10(日) 13:00–15:30", count: "12名",
    note: "季節の上生菓子を親子で手づくり。火は使わず、後片付けまで責任を持って行います。" },
  { id: "marche", em: "🛍️", title: "境内あさひマルシェ", org: "まちの縁側プロジェクト・学生団体 ENGAWA", status: "new",
    place: "境内", when: "9/7(日) 10:00–15:00", count: "8ブース",
    note: "地元の農家・手仕事の作り手が集う小さな市。音響は控えめ、拡声器は使用しません。" },
  { id: "shakyo", em: "🖌️", title: "夜の写経と対話の会", org: "こころ塾・大橋 真理 さん", status: "wait",
    place: "本堂", when: "8/23(土) 18:00–20:00", count: "20名",
    note: "日程を1週間ずらせないか相談中。運営スタッフが間に入って調整しています。" },
];

const INITIAL_SPACES = [
  { th: "⛩️", name: "本堂", desc: "最大30名・平日終日／土日午前・音量控えめ", on: true },
  { th: "🌿", name: "庭園", desc: "最大40名・晴天時のみ・写真撮影可", on: true },
  { th: "🍵", name: "客殿（和室）", desc: "最大16名・冷暖房あり・茶道具貸出可", on: true },
  { th: "🏯", name: "境内広場", desc: "最大200名・屋外・電源あり・要相談", on: true },
];

export default function TempleDashboard() {
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const [spaces, setSpaces] = useState(INITIAL_SPACES);
  const [tab, setTab] = useState<"apps" | "spaces">("apps");
  const [toasts, setToasts] = useState<{ id: number; msg: string; warn?: boolean }[]>([]);

  const newCount = useMemo(() => apps.filter((a) => a.status === "new").length, [apps]);
  const waitCount = useMemo(() => apps.filter((a) => a.status === "wait").length, [apps]);

  function toast(msg: string, warn?: boolean) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, warn }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }
  function update(id: string, patch: Partial<App>) {
    setApps((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function approve(a: App) {
    update(a.id, { status: "ok", resolved: `「${a.title}」を承認しました。企画者へ通知し、カレンダーに登録されます。` });
    toast(`「${a.title}」を承認しました`);
  }
  function decline(a: App) {
    update(a.id, { status: "off", resolved: "この申込を辞退しました。企画者へ丁重にお伝えします。" });
    toast("申込を辞退しました", true);
  }
  function toggleSpace(i: number) {
    setSpaces((s) => s.map((sp, idx) => (idx === i ? { ...sp, on: !sp.on } : sp)));
    const sp = spaces[i];
    toast(`${sp.name}${sp.on ? " を非公開にしました" : " を掲載しました"}`, sp.on);
  }

  return (
    <>
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-[22px] py-3">
          <a href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[11px] bg-gradient-to-br from-shu to-shu-ink font-serif text-2xl text-on-shu">寺</div>
            <div>
              <div className="font-serif text-[21px] leading-none tracking-[0.04em]">テラつなぎ</div>
              <div className="text-[12px] tracking-[0.12em] text-sumi-faint">SPACE MATCHING</div>
            </div>
          </a>
          <div className="ml-auto flex items-center gap-2.5">
            <button className="relative grid h-11 w-11 place-items-center rounded-[11px] border border-line bg-card text-[19px] text-sumi-soft hover:border-matcha" onClick={() => toast("お知らせ一覧（プロトタイプ）")} aria-label="お知らせ">
              🔔<span className="absolute right-2 top-[7px] h-[9px] w-[9px] rounded-full border-2 border-card bg-shu" />
            </button>
            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="grid h-[42px] w-[42px] place-items-center rounded-full bg-gradient-to-br from-matcha to-matcha-ink font-serif text-[18px] text-on-accent">妙</div>
              <div className="hidden sm:block">
                <div className="text-sm leading-tight">妙覚寺</div>
                <div className="text-xs text-sumi-faint">ご住職</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-[22px] pb-20">
        {/* greeting + CTA */}
        <div className="my-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-serif text-[30px] tracking-[0.02em]">おかえりなさいませ、ご住職</h1>
            <div className="mt-1 text-[15px] text-sumi-soft">
              2026年7月15日（火）・新しい申込が <b>{newCount}件</b> 届いています
            </div>
          </div>
          <a
            href="/temple/new"
            className="inline-flex items-center gap-2.5 rounded-[13px] bg-gradient-to-br from-shu to-shu-ink px-6 py-[15px] text-[17px] font-semibold tracking-wide text-on-shu shadow-lg transition hover:-translate-y-px hover:brightness-105"
          >
            <span className="-mt-0.5 text-[22px] leading-none">＋</span>新しい空き枠を掲載する
          </a>
        </div>

        {/* stat tiles */}
        <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          <StatTile label="掲載中スペース" value={spaces.filter((s) => s.on).length} unit="件" stripe="matcha" trend="本堂・庭園・客殿・和室" />
          <StatTile label="新着の申込" value={newCount} unit="件" stripe="shu" trend="要ご確認" />
          <StatTile label="調整中" value={waitCount} unit="件" stripe="wait" trend="日程を相談中" />
          <StatTile label="今月の成立イベント" value={6} unit="件" stripe="kincha" trend="先月比 ＋2件" />
        </div>

        <div className="grid items-start gap-[22px] lg:grid-cols-[1.55fr_1fr]">
          {/* LEFT: tabs */}
          <div className="overflow-hidden rounded-[14px] border border-line-soft bg-card shadow-sm">
            <div className="flex gap-1 border-b border-line px-5 pt-3.5">
              {([["apps", "新着の申込", newCount], ["spaces", "掲載中スペース", spaces.length]] as const).map(([key, label, cnt]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  aria-selected={tab === key}
                  className={`relative -mb-px flex items-center gap-2 rounded-t-[10px] px-4 pb-3.5 pt-[11px] text-[15.5px] ${
                    tab === key ? "font-semibold text-sumi after:absolute after:inset-x-3 after:-bottom-px after:h-[3px] after:rounded after:bg-shu" : "text-sumi-soft hover:bg-card-2 hover:text-sumi"
                  }`}
                >
                  {label}
                  <span className={`inline-grid h-[22px] min-w-[22px] place-items-center rounded-[11px] px-[7px] text-[12.5px] font-semibold tabular ${tab === key ? "bg-shu-bg text-shu-ink" : "bg-washi-2 text-sumi-faint"}`}>{cnt}</span>
                </button>
              ))}
            </div>

            {/* tab: apps */}
            {tab === "apps" && (
              <div className="px-5 pb-5 pt-1.5">
                {apps.map((a) => (
                  <div key={a.id} className={`mt-3.5 rounded-[13px] border border-line-soft bg-card-2 p-[17px] transition hover:border-line hover:shadow-sm ${a.resolved ? "opacity-60" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[12px] bg-matcha-bg text-[23px]">{a.em}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif text-[18.5px] leading-snug">{a.title}</div>
                        <div className="mt-0.5 text-[13.5px] text-sumi-soft">{a.org}</div>
                      </div>
                      <StatusPill status={a.status} label={STATUS_LABEL[a.status]} />
                    </div>
                    <div className="mb-1 mt-3 flex flex-wrap gap-x-[18px] gap-y-2 pl-[58px] text-sm text-sumi-soft max-[560px]:pl-0">
                      <span className="flex items-center gap-[7px]"><span className="text-[15px] text-matcha-ink">📍</span>希望スペース：<b className="font-semibold text-sumi">{a.place}</b></span>
                      <span className="flex items-center gap-[7px]"><span className="text-[15px] text-matcha-ink">🗓</span>希望日時：<b className="font-semibold text-sumi tabular">{a.when}</b></span>
                      <span className="flex items-center gap-[7px]"><span className="text-[15px] text-matcha-ink">👥</span>定員：<b className="font-semibold text-sumi">{a.count}</b></span>
                    </div>
                    <div className="mt-1.5 pl-[58px] text-sm leading-relaxed text-sumi-soft max-[560px]:pl-0">{a.note}</div>
                    {a.resolved ? (
                      <div className="mt-3 flex items-center gap-2 pl-[58px] text-sm text-sumi-soft max-[560px]:pl-0">✅ {a.resolved}</div>
                    ) : (
                      <div className="mt-3.5 flex flex-wrap gap-2.5 pl-[58px] max-[560px]:pl-0">
                        <button className="inline-flex items-center gap-2 rounded-[10px] bg-matcha px-[18px] py-[11px] text-[15px] font-semibold text-on-accent hover:brightness-105" onClick={() => approve(a)}>✓ {a.status === "wait" ? "この内容で承認" : "承認する"}</button>
                        <a href="/temple/messages" className="inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-[11px] text-[15px] font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">💬 {a.status === "wait" ? "相談を続ける" : "詳細を相談"}</a>
                        {a.status !== "wait" && (
                          <button className="rounded-[10px] px-3 py-[11px] text-[15px] font-semibold text-sumi-faint hover:text-off" onClick={() => decline(a)}>辞退</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* tab: spaces */}
            {tab === "spaces" && (
              <div className="px-5 pb-5 pt-1.5">
                {spaces.map((sp, i) => (
                  <div key={sp.name} className="flex items-center gap-3.5 border-b border-line-soft py-[15px] last:border-0">
                    <div className="grid h-[52px] w-[52px] flex-none place-items-center rounded-[12px] border border-line-soft bg-washi-2 text-[25px]">{sp.th}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[16.5px] font-semibold">{sp.name}</div>
                      <div className="mt-0.5 text-[13.5px] text-sumi-soft">{sp.desc}</div>
                    </div>
                    <div className="w-[62px] text-right text-[12.5px]" style={{ color: sp.on ? "var(--sumi-faint)" : "var(--off)" }}>{sp.on ? "掲載中" : "非公開"}</div>
                    <button
                      onClick={() => toggleSpace(i)}
                      aria-pressed={sp.on}
                      aria-label={`${sp.name}の掲載`}
                      className="relative h-[30px] w-[52px] flex-none rounded-2xl transition-colors"
                      style={{ background: sp.on ? "var(--matcha)" : "var(--line)" }}
                    >
                      <span className="absolute top-[3px] h-6 w-6 rounded-full bg-white shadow transition-transform" style={{ left: "3px", transform: sp.on ? "translateX(22px)" : "none" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: calendar + support */}
          <div className="flex flex-col gap-[22px]">
            <Panel title="予定カレンダー">
              <div className="p-5">
                <CalendarCard />
                <div className="mt-3.5 flex flex-wrap gap-4 text-[12.5px] text-sumi-soft">
                  <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[3px] bg-matcha" />成立イベント</span>
                  <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[3px] bg-shu" />本日・要確認</span>
                </div>
              </div>
            </Panel>

            <Panel title="運営サポート" markColor="var(--kincha)">
              <div className="p-5">
                <p className="mb-3.5 text-[14.5px] leading-relaxed text-sumi-soft">
                  掲載や申込のご対応でお困りの際は、テラつなぎの担当者が裏側でサポートいたします。お気軽にご相談ください。
                </p>
                <button className="w-full rounded-[10px] border-[1.5px] border-line bg-card px-4 py-[11px] text-[15px] font-semibold text-sumi hover:border-matcha hover:text-matcha-ink" onClick={() => toast("担当者につなぎます（プロトタイプ）")}>
                  📞 担当者に相談する
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* toasts */}
      <div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2.5" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 rounded-[12px] bg-sumi px-5 py-3 text-[15px] text-washi shadow-lg">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-sm text-white ${t.warn ? "bg-wait" : "bg-matcha"}`}>{t.warn ? "!" : "✓"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* 予定カレンダー（2026年7月） */
function CalendarCard() {
  const events: Record<number, { t: string; shu?: boolean }> = {
    6: { t: "椅子坐禅会" }, 12: { t: "寺子屋こども教室" }, 15: { t: "本日", shu: true },
    20: { t: "夏の写経会" }, 27: { t: "夕涼み茶会" },
  };
  const dows = ["日", "月", "火", "水", "木", "金", "土"];
  const firstDow = new Date(2026, 6, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];

  return (
    <div>
      <div className="flex items-center justify-between px-0.5 pb-3.5">
        <div className="font-serif text-[17px]">2026年 7月</div>
      </div>
      <div className="grid grid-cols-7 gap-[5px]">
        {dows.map((d, i) => (
          <div key={d} className={`pb-1.5 pt-0.5 text-center text-xs ${i === 0 ? "text-off" : i === 6 ? "text-matcha-ink" : "text-sumi-faint"}`}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`p${i}`} className="invisible aspect-square" />;
          const ev = events[d];
          const today = d === 15;
          return (
            <div key={d} className={`aspect-square rounded-[9px] border p-[5px] text-[13.5px] tabular ${ev ? "border-line-soft bg-card-2" : "border-transparent"} ${today ? "!border-shu" : ""}`}>
              <span className={today ? "font-bold text-shu-ink" : ""}>{d}</span>
              {ev && (
                <div className={`mt-[3px] truncate rounded-[5px] px-1 py-0.5 text-[10.5px] leading-tight ${ev.shu ? "bg-shu-bg text-shu-ink" : "bg-matcha-bg text-matcha-ink"}`}>{ev.t}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
