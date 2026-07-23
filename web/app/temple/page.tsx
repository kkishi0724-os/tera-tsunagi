"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { StatTile } from "@/components/StatTile";
import { Panel } from "@/components/Panel";

// お寺の統合ダッシュボード（v2 portal 画面B）。スペース貸出＋スキマバイトを1画面で一元管理。
type Status = "new" | "wait" | "ok" | "off";
const APP_LABEL: Record<Status, string> = { new: "新着", wait: "調整中", ok: "承認済み", off: "辞退" };
const GIG_LABEL: Record<Status, string> = { new: "応募", wait: "面談調整", ok: "採用", off: "見送り" };

type App = { id: string; em: string; title: string; org: string; status: Status; place: string; when: string; count: string; resolved?: string };
type GigApp = { id: string; em: string; name: string; school: string; gig: string; status: Status; msg: string; pay: string; resolved?: string };

const INITIAL_APPS: App[] = [
  { id: "yoga", em: "🧘", title: "朝の寺ヨガ教室", org: "みどりヨガスタジオ・田村 佳奈 さん", status: "new", place: "本堂", when: "8/3(日) 7:00–8:30", count: "15名" },
  { id: "wagashi", em: "🍡", title: "和菓子づくりワークショップ", org: "季なごみ工房・清水 誠 さん", status: "new", place: "客殿（和室）", when: "8/10(日) 13:00–15:30", count: "12名" },
  { id: "marche", em: "🛍️", title: "境内あさひマルシェ", org: "学生団体 ENGAWA", status: "new", place: "境内広場", when: "9/7(日) 10:00–15:00", count: "8ブース" },
  { id: "shakyo", em: "🖌️", title: "夜の写経と対話の会", org: "こころ塾・大橋 真理 さん", status: "wait", place: "本堂", when: "8/23(土) 18:00–20:00", count: "20名" },
];

const INITIAL_GIGAPPS: GigApp[] = [
  { id: "sato", em: "🧹", name: "佐藤 律", school: "関西大学 2年", gig: "境内の落ち葉清掃（9/6 8:00–11:00）", status: "new", msg: "朝が得意です。体力に自信あり", pay: "時給1,200円" },
  { id: "yamaguchi", em: "🏮", name: "山口 葵", school: "京都芸術大学 3年", gig: "秋祭りの設営・受付補助（9/23 9:00–16:00）", status: "new", msg: "イベント運営の経験があります", pay: "日給8,000円" },
  { id: "nakamura", em: "📷", name: "中村 大和", school: "同志社大学 1年", gig: "SNS投稿・写真撮影アシスト（平日応相談）", status: "wait", msg: "Instagram運用が得意です", pay: "1回3,000円" },
];

const INITIAL_SPACES = [
  { th: "⛩️", name: "本堂", desc: "最大30名・静か・平日終日/土日午前", on: true },
  { th: "🌿", name: "庭園", desc: "最大40名・屋外・撮影可", on: true },
  { th: "🍵", name: "客殿（和室）", desc: "最大16名・冷暖房あり", on: true },
  { th: "🏯", name: "境内広場", desc: "最大200名・屋外・電源あり", on: true },
];

const GIGS = [
  { em: "🧹", title: "境内の落ち葉清掃", meta: "9/6(土) 8:00–11:00 ・ 時給1,200円", need: 2, applied: 3 },
  { em: "🏮", title: "秋祭りの設営・受付補助", meta: "9/23(祝) 9:00–16:00 ・ 日給8,000円", need: 5, applied: 7 },
  { em: "📷", title: "SNS投稿・写真撮影アシスト", meta: "平日 応相談 ・ 1回3,000円", need: 1, applied: 2 },
  { em: "🍵", title: "法要の受付・お茶出し", meta: "8/28(木) 10:00–13:00 ・ 時給1,100円", need: 2, applied: 1 },
];

export default function TempleDashboard() {
  const [view, setView] = useState<"home" | "space" | "gig">("home");
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const [gigApps, setGigApps] = useState<GigApp[]>(INITIAL_GIGAPPS);
  const [spaces, setSpaces] = useState(INITIAL_SPACES);
  const [spaceTab, setSpaceTab] = useState<"apps" | "list">("apps");
  const [gigTab, setGigTab] = useState<"apps" | "list">("apps");
  const [toasts, setToasts] = useState<{ id: number; msg: string; warn?: boolean }[]>([]);

  const appNew = useMemo(() => apps.filter((a) => a.status === "new").length, [apps]);
  const gigNew = useMemo(() => gigApps.filter((g) => g.status === "new").length, [gigApps]);
  const waiting = useMemo(() => apps.filter((a) => a.status === "wait").length + gigApps.filter((g) => g.status === "wait").length, [apps, gigApps]);

  function toast(msg: string, warn?: boolean) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, warn }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }
  function approve(a: App) {
    setApps((l) => l.map((x) => (x.id === a.id ? { ...x, status: "ok", resolved: `「${a.title}」を承認しました。予定に登録されます。` } : x)));
    toast(`「${a.title}」を承認しました`);
  }
  function declineApp(a: App) {
    setApps((l) => l.map((x) => (x.id === a.id ? { ...x, status: "off", resolved: "この申込を辞退しました。丁重にお伝えします。" } : x)));
    toast("申込を辞退しました", true);
  }
  function toggleSpace(i: number) {
    setSpaces((s) => s.map((sp, idx) => (idx === i ? { ...sp, on: !sp.on } : sp)));
    toast(`${spaces[i].name}${spaces[i].on ? " を非公開にしました" : " を掲載しました"}`, spaces[i].on);
  }
  function adopt(g: GigApp) {
    setGigApps((l) => l.map((x) => (x.id === g.id ? { ...x, status: "ok", resolved: `${g.name} さんを採用しました。日時と持ち物を連絡します。` } : x)));
    toast(`${g.name} さんを採用しました`);
  }
  function gigWait(g: GigApp) {
    setGigApps((l) => l.map((x) => (x.id === g.id ? { ...x, status: "wait" } : x)));
    toast("面談の日程調整に進みます");
  }
  function gigDecline(g: GigApp) {
    setGigApps((l) => l.map((x) => (x.id === g.id ? { ...x, status: "off", resolved: "この応募は見送りました。丁重にお伝えします。" } : x)));
    toast("応募を見送りました", true);
  }

  const navItems = [
    { key: "home" as const, ic: "🏠", label: "ホーム", badge: 0 },
    { key: "space" as const, ic: "🏛️", label: "スペース貸出管理", badge: appNew },
    { key: "gig" as const, ic: "🧹", label: "スキマバイト管理", badge: gigNew },
  ];

  return (
    <div className="text-[17px]">
      <div className="mx-auto grid min-h-screen max-w-[1180px] md:grid-cols-[246px_1fr]">
        {/* SIDEBAR */}
        <aside className="flex flex-col gap-1.5 border-b border-line p-4 md:border-b-0 md:border-r">
          <a href="/" className="flex items-center gap-2.5 px-2 pb-3.5 pt-1.5">
            <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-gradient-to-br from-shu to-shu-ink font-serif text-lg text-on-shu">寺</div>
            <span className="font-serif text-lg tracking-[0.03em]">テラつなぎ</span>
          </a>
          <div className="mb-3 flex items-center gap-[11px] rounded-xl border border-line-soft bg-card-2 px-[13px] py-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-matcha to-matcha-ink font-serif text-[17px] text-on-accent">妙</div>
            <div><div className="text-[15px] font-semibold leading-tight">妙覚寺</div><div className="text-xs text-sumi-faint">ご住職</div></div>
          </div>
          <div className="px-2.5 pb-1.5 pt-2.5 text-[11.5px] uppercase tracking-[0.12em] text-sumi-faint">メニュー</div>
          {navItems.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              aria-current={view === n.key}
              className={`flex w-full items-center gap-3 rounded-[11px] px-[13px] py-[13px] text-left text-[15.5px] ${view === n.key ? "bg-matcha-bg font-bold text-matcha-ink" : "text-sumi-soft hover:bg-card-2 hover:text-sumi"}`}
            >
              <span className="w-6 text-center text-[19px]">{n.ic}</span>
              {n.label}
              {n.badge > 0 && <span className="ml-auto inline-grid h-[22px] min-w-[22px] place-items-center rounded-[11px] bg-shu px-1.5 text-xs font-bold text-on-shu">{n.badge}</span>}
            </button>
          ))}
          <div className="mt-auto hidden border-t border-line-soft pt-3 md:block">
            <button onClick={() => toast("お知らせ一覧（プロトタイプ）")} className="flex w-full items-center gap-3 rounded-[11px] px-[13px] py-[13px] text-left text-[15.5px] text-sumi-soft hover:bg-card-2"><span className="w-6 text-center text-[19px]">🔔</span>お知らせ</button>
            <button onClick={() => toast("運営に相談（プロトタイプ）")} className="flex w-full items-center gap-3 rounded-[11px] px-[13px] py-[13px] text-left text-[15.5px] text-sumi-soft hover:bg-card-2"><span className="w-6 text-center text-[19px]">💬</span>運営に相談</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="px-7 pb-16 pt-6 max-md:px-5">
          {/* ===== HOME ===== */}
          {view === "home" && (
            <>
              <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
                <div><h2 className="font-serif text-[26px] tracking-[0.02em]">おかえりなさいませ、ご住職</h2><div className="mt-1 text-[15px] text-sumi-soft">2026年7月15日（火）</div></div>
                <a href="/temple/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-shu to-shu-ink px-5 py-3 font-semibold text-on-shu shadow-sm hover:brightness-105"><span className="text-[20px] leading-none">＋</span>新しく募集・掲載する</a>
              </div>

              {/* 本日のお知らせ */}
              <div className="mb-[22px] grid gap-4 md:grid-cols-2">
                <button onClick={() => setView("space")} className="flex items-center gap-4 rounded-2xl border border-line-soft bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="grid h-[54px] w-[54px] flex-none place-items-center rounded-[14px] bg-matcha-bg text-[27px]">🏛️</div>
                  <div><div className="text-[14.5px] text-sumi-soft">新着のイベント企画申込</div><div className="mt-0.5 font-serif text-[30px] leading-none tabular">{appNew}<small className="ml-0.5 font-sans text-[15px] text-sumi-faint">件</small></div></div>
                  <div className="ml-auto text-[20px] text-sumi-faint">›</div>
                </button>
                <button onClick={() => setView("gig")} className="flex items-center gap-4 rounded-2xl border border-line-soft bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="grid h-[54px] w-[54px] flex-none place-items-center rounded-[14px] bg-shu-bg text-[27px]">🧹</div>
                  <div><div className="text-[14.5px] text-sumi-soft">新着のスキマバイト応募</div><div className="mt-0.5 font-serif text-[30px] leading-none tabular">{gigNew}<small className="ml-0.5 font-sans text-[15px] text-sumi-faint">件</small></div></div>
                  <div className="ml-auto text-[20px] text-sumi-faint">›</div>
                </button>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="掲載中スペース" value={spaces.filter((s) => s.on).length} unit="件" stripe="matcha" />
                <StatTile label="募集中バイト" value={GIGS.length} unit="件" stripe="shu" />
                <StatTile label="調整中の案件" value={waiting} unit="件" stripe="wait" />
                <StatTile label="今月の成立" value={9} unit="件" stripe="kincha" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Panel title="直近のスペース利用予定" action={<button onClick={() => setView("space")} className="text-[13px] text-matcha-ink">すべて ›</button>}>
                  <div className="p-2">
                    {[["3", "8月", "朝の寺ヨガ教室", "本堂 ・ みどりヨガスタジオ", "7:00–8:30"], ["10", "8月", "和菓子ワークショップ", "客殿 ・ 季なごみ工房", "13:00–15:30"], ["23", "8月", "夜の写経と対話の会", "本堂 ・ こころ塾", "18:00–20:00"]].map((r, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-[11px] p-3 hover:bg-card-2">
                        <div className="w-[52px] flex-none text-center"><div className="font-serif text-[19px] leading-none tabular">{r[0]}</div><div className="text-[11px] text-sumi-faint">{r[1]}</div></div>
                        <div className="min-w-0 flex-1"><div className="text-[15.5px] font-semibold">{r[2]}</div><div className="text-[13px] text-sumi-soft">{r[3]}</div></div>
                        <div className="whitespace-nowrap text-[13.5px] text-sumi-soft tabular">{r[4]}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="本日、お手伝いに来る学生" markColor="var(--shu)" action={<button onClick={() => setView("gig")} className="text-[13px] text-matcha-ink">すべて ›</button>}>
                  <div className="p-2">
                    {[["佐", "佐藤 律 さん", "境内の落ち葉清掃", "8:00〜"], ["山", "山口 葵 さん", "法要の受付・お茶出し", "10:00〜"], ["中", "中村 大和 さん", "SNS投稿・写真撮影", "14:00〜"]].map((r, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-[11px] p-3 hover:bg-card-2">
                        <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gradient-to-br from-[#8a7f6a] to-[#6f6553] font-serif text-base text-[#f4f1e6]">{r[0]}</div>
                        <div className="min-w-0 flex-1"><div className="text-[15.5px] font-semibold">{r[1]}</div><div className="text-[13px] text-sumi-soft">{r[2]}</div></div>
                        <span className="whitespace-nowrap rounded-xl bg-matcha-bg px-2.5 py-1 text-xs text-matcha-ink">{r[3]}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </>
          )}

          {/* ===== SPACE ===== */}
          {view === "space" && (
            <>
              <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
                <div><h2 className="font-serif text-[26px] tracking-[0.02em]">スペース貸出管理</h2><div className="mt-1 text-[15px] text-sumi-soft">空き枠の掲載と、届いたイベント企画の申込</div></div>
                <a href="/temple/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-shu to-shu-ink px-5 py-3 font-semibold text-on-shu shadow-sm hover:brightness-105"><span className="text-[20px] leading-none">＋</span>空き枠を掲載する</a>
              </div>
              <SubTabs tabs={[["apps", `届いた申込`, appNew], ["list", "掲載中スペース", spaces.length]]} active={spaceTab} onChange={(k) => setSpaceTab(k as "apps" | "list")} />
              {spaceTab === "apps" && (
                <div>
                  {apps.map((a) => (
                    <div key={a.id} className={`mt-3.5 rounded-[13px] border border-line-soft bg-card-2 p-[17px] ${a.resolved ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[12px] bg-matcha-bg text-[23px]">{a.em}</div>
                        <div className="min-w-0 flex-1"><div className="font-serif text-[18px]">{a.title}</div><div className="mt-0.5 text-[13.5px] text-sumi-soft">{a.org}</div></div>
                        <StatusPill status={a.status} label={APP_LABEL[a.status]} />
                      </div>
                      <div className="mb-0.5 mt-3 flex flex-wrap gap-x-4 gap-y-1.5 pl-[59px] text-sm text-sumi-soft max-md:pl-0">
                        <span className="flex items-center gap-1.5"><span className="text-matcha-ink">📍</span>{a.place}</span>
                        <span className="flex items-center gap-1.5 tabular"><span className="text-matcha-ink">🗓</span><b className="text-sumi">{a.when}</b></span>
                        <span className="flex items-center gap-1.5"><span className="text-matcha-ink">👥</span><b className="text-sumi">{a.count}</b></span>
                      </div>
                      {a.resolved ? (
                        <div className="mt-3 flex items-center gap-2 pl-[59px] text-sm text-sumi-soft max-md:pl-0">✅ {a.resolved}</div>
                      ) : (
                        <div className="mt-3.5 flex flex-wrap gap-2.5 pl-[59px] max-md:pl-0">
                          <button onClick={() => approve(a)} className="rounded-[10px] bg-matcha px-[18px] py-2.5 text-sm font-semibold text-on-accent hover:brightness-105">✓ 承認する</button>
                          <a href="/temple/messages" className="rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-2.5 text-sm font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">💬 詳細を相談</a>
                          <button onClick={() => declineApp(a)} className="rounded-[10px] px-3 py-2.5 text-sm font-semibold text-sumi-faint hover:text-off">辞退</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {spaceTab === "list" && (
                <div className="mt-2">
                  {spaces.map((sp, i) => (
                    <div key={sp.name} className="flex items-center gap-3.5 border-b border-line-soft py-[15px] last:border-0">
                      <div className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[12px] border border-line-soft bg-washi-2 text-2xl">{sp.th}</div>
                      <div className="min-w-0 flex-1"><div className="text-[16px] font-semibold">{sp.name}</div><div className="text-[13px] text-sumi-soft">{sp.desc}</div></div>
                      <span className="rounded-xl bg-matcha-bg px-2.5 py-1 text-xs text-matcha-ink" style={{ opacity: sp.on ? 1 : 0.4 }}>{sp.on ? "掲載中" : "非公開"}</span>
                      <button onClick={() => toggleSpace(i)} aria-pressed={sp.on} aria-label={`${sp.name}の掲載`} className="relative h-[29px] w-[50px] flex-none rounded-2xl" style={{ background: sp.on ? "var(--matcha)" : "var(--line)" }}>
                        <span className="absolute top-[3px] h-[23px] w-[23px] rounded-full bg-white shadow" style={{ left: "3px", transform: sp.on ? "translateX(21px)" : "none" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== GIG ===== */}
          {view === "gig" && (
            <>
              <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
                <div><h2 className="font-serif text-[26px] tracking-[0.02em]">スキマバイト管理</h2><div className="mt-1 text-[15px] text-sumi-soft">お手伝いの募集と、応募してきた学生のマッチング</div></div>
                <button onClick={() => toast("お手伝いの新規募集へ（プロトタイプ）")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-shu to-shu-ink px-5 py-3 font-semibold text-on-shu shadow-sm hover:brightness-105"><span className="text-[20px] leading-none">＋</span>お手伝いを募集する</button>
              </div>
              <SubTabs tabs={[["apps", "応募者", gigNew], ["list", "募集中の仕事", GIGS.length]]} active={gigTab} onChange={(k) => setGigTab(k as "apps" | "list")} />
              {gigTab === "apps" && (
                <div>
                  {gigApps.map((g) => (
                    <div key={g.id} className={`mt-3.5 rounded-[13px] border border-line-soft bg-card-2 p-[17px] ${g.resolved ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[12px] bg-shu-bg text-[23px]">{g.em}</div>
                        <div className="min-w-0 flex-1"><div className="font-serif text-[18px]">{g.name} <span className="font-sans text-[13px] text-sumi-faint">／ {g.school}</span></div><div className="mt-0.5 text-[13.5px] text-sumi-soft">応募先：{g.gig}</div></div>
                        <StatusPill status={g.status} label={GIG_LABEL[g.status]} />
                      </div>
                      <div className="mb-0.5 mt-3 flex flex-wrap gap-x-4 gap-y-1.5 pl-[59px] text-sm text-sumi-soft max-md:pl-0">
                        <span className="flex items-center gap-1.5"><span className="text-shu-ink">💬</span>「{g.msg}」</span>
                        <span className="flex items-center gap-1.5"><span className="text-shu-ink">💴</span><b className="text-sumi">{g.pay}</b></span>
                      </div>
                      {g.resolved ? (
                        <div className="mt-3 flex items-center gap-2 pl-[59px] text-sm text-sumi-soft max-md:pl-0">✅ {g.resolved}</div>
                      ) : (
                        <div className="mt-3.5 flex flex-wrap gap-2.5 pl-[59px] max-md:pl-0">
                          <button onClick={() => adopt(g)} className="rounded-[10px] bg-matcha px-[18px] py-2.5 text-sm font-semibold text-on-accent hover:brightness-105">✓ 採用する</button>
                          {g.status !== "wait" && <button onClick={() => gigWait(g)} className="rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-2.5 text-sm font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">🗓 面談を調整</button>}
                          <a href="/temple/messages" className="rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-2.5 text-sm font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">💬 連絡する</a>
                          <button onClick={() => gigDecline(g)} className="rounded-[10px] px-3 py-2.5 text-sm font-semibold text-sumi-faint hover:text-off">見送り</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {gigTab === "list" && (
                <div>
                  {GIGS.map((gig) => (
                    <div key={gig.title} className="mt-3.5 rounded-[13px] border border-line-soft bg-card-2 p-[17px]">
                      <div className="flex items-start gap-3">
                        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[12px] bg-shu-bg text-[23px]">{gig.em}</div>
                        <div className="min-w-0 flex-1"><div className="font-serif text-[18px]">{gig.title}</div><div className="mt-0.5 text-[13.5px] text-sumi-soft">{gig.meta}</div></div>
                        <span className="rounded-[20px] bg-matcha-bg px-[11px] py-1 text-[12.5px] font-semibold text-matcha-ink">募集中</span>
                      </div>
                      <div className="mb-0.5 mt-3 flex flex-wrap gap-x-4 pl-[59px] text-sm text-sumi-soft max-md:pl-0">
                        <span className="flex items-center gap-1.5"><span className="text-shu-ink">👥</span>募集 <b className="text-sumi">{gig.need}名</b></span>
                        <span className="flex items-center gap-1.5"><span className="text-shu-ink">✋</span>応募 <b className="text-sumi">{gig.applied}名</b></span>
                      </div>
                      <div className="mt-3.5 flex gap-2.5 pl-[59px] max-md:pl-0">
                        <button onClick={() => setGigTab("apps")} className="rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-2.5 text-sm font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">応募者を見る</button>
                        <button onClick={() => toast("募集を編集（プロトタイプ）")} className="rounded-[10px] border-[1.5px] border-line bg-card px-[18px] py-2.5 text-sm font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">編集</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* toasts */}
      <div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2.5" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 rounded-[12px] bg-sumi px-5 py-3 text-[15px] text-washi shadow-lg">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-sm text-white ${t.warn ? "bg-wait" : "bg-matcha"}`}>{t.warn ? "!" : "✓"}</span>{t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function SubTabs({ tabs, active, onChange }: { tabs: [string, string, number][]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-line">
      {tabs.map(([key, label, cnt]) => (
        <button key={key} onClick={() => onChange(key)} aria-selected={active === key} className={`relative -mb-px flex items-center gap-2 px-4 pb-3 pt-2.5 text-[15px] ${active === key ? "font-bold text-sumi after:absolute after:inset-x-3 after:-bottom-px after:h-[3px] after:rounded after:bg-shu" : "text-sumi-soft hover:text-sumi"}`}>
          {label}
          <span className={`inline-grid h-5 min-w-[20px] place-items-center rounded-[10px] px-1.5 text-xs font-bold tabular ${active === key ? "bg-shu-bg text-shu-ink" : "bg-washi-2 text-sumi-faint"}`}>{cnt}</span>
        </button>
      ))}
    </div>
  );
}
