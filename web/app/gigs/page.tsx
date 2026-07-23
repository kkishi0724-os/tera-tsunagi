"use client";

import { useEffect, useMemo, useState } from "react";
import { SlideOver } from "@/components/SlideOver";
import { getGigs, fetchGigs } from "@/lib/data";
import type { Gig } from "@/lib/types";

// お手伝い（スキマバイト）検索〜応募。v3方針で応募を簡素化（自己紹介の自由記述中心・必須最小）。
// 参加日など細部は応募後の直接やりとりで決める（SIMPLIFY_v3.md）。
// データはデータ層（lib/data）経由。初期はモックで即描画し、Supabase 設定済みならマウント後に差し替え（B3_DATA.md）。

const CAT_FILTERS = [["all", "すべて"], ["清掃", "清掃・庭仕事"], ["祭り", "祭り・イベント"], ["受付", "受付・法要"], ["SNS", "SNS・撮影"]] as const;
const WORK_FILTERS = [["all", "すべて"], ["単発", "単発"], ["土日", "土日"], ["平日", "平日"], ["早朝", "早朝"]] as const;

export default function GigsPage() {
  const [cat, setCat] = useState("all");
  const [work, setWork] = useState("all");
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Gig | null>(null);
  const [pr, setPr] = useState("");
  const [done, setDone] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>(getGigs());

  useEffect(() => {
    fetchGigs().then(setGigs).catch(() => {});
  }, []);

  const list = useMemo(
    () =>
      gigs.filter((g) => {
        if (cat !== "all" && g.cat !== cat) return false;
        if (work !== "all" && !g.work.includes(work)) return false;
        if (q) {
          const hay = (g.temple + g.title + g.when + g.tags.map((t) => t[0]).join("") + g.cat).toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [cat, work, q, gigs],
  );

  function openPanel(g: Gig) {
    setCurrent(g);
    setPr("");
  }
  const canSubmit = pr.trim() !== "";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-[22px] py-[11px]">
          <a href="/" className="flex items-center gap-[11px]">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-shu to-shu-ink font-serif text-xl text-on-shu">寺</div>
            <div>
              <div className="font-serif text-[19px] leading-none tracking-[0.04em]">テラつなぎ</div>
              <div className="text-[11px] tracking-[0.1em] text-sumi-faint">お寺でお手伝いを探す</div>
            </div>
          </a>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-shu to-shu-ink font-serif text-base text-on-shu">佐</div>
            <div className="hidden sm:block">
              <div className="text-[13px] leading-tight">佐藤 律</div>
              <div className="text-[11px] text-sumi-faint">学生・関西大学2年</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-[22px] pb-20">
        <div className="pb-5 pt-[30px]">
          <h1 className="font-serif text-[30px] tracking-[0.02em]">お寺で、はたらく。<span className="text-shu-ink">スキマ時間で貢献。</span></h1>
          <p className="mt-2 text-[15.5px] text-sumi-soft">境内清掃、お祭りの手伝い、受付、SNS投稿——。お寺専用の単発バイトを見つけて、その場で応募できます。</p>
          <div className="mt-5 flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-line bg-card py-1.5 pl-4 pr-1.5 shadow-sm">
            <span className="text-[19px] text-sumi-faint">🔍</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="キーワードで探す（例：清掃、受付、朝、土日、未経験）" className="flex-1 bg-transparent px-1 py-3 text-base outline-none" />
            <button className="rounded-[10px] bg-gradient-to-br from-shu to-shu-ink px-[22px] py-3 text-[15px] font-semibold text-on-shu">さがす</button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <FilterRow label="仕事の種類" value={cat} onChange={setCat} options={CAT_FILTERS} />
            <FilterRow label="働き方" value={work} onChange={setWork} options={WORK_FILTERS} />
          </div>
        </div>

        <div className="mb-3.5 mt-6 flex items-baseline gap-2.5">
          <span className="font-serif text-[19px]">募集中のお手伝い</span>
          <span className="text-sm text-sumi-faint tabular">{list.length}件</span>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && (
            <div className="col-span-full py-[50px] text-center text-sumi-faint">
              条件に合うお手伝いが見つかりませんでした。<br />フィルターやキーワードを変えてお試しください。
            </div>
          )}
          {list.map((g) => (
            <article key={g.id} className="flex flex-col overflow-hidden rounded-[14px] border border-line-soft bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="relative grid h-[104px] place-items-center bg-gradient-to-br from-shu-bg to-washi-2 text-[44px]">
                <span>{g.em}</span>
                <span className="absolute left-[11px] top-[11px] rounded-[14px] bg-card px-[11px] py-1 text-xs font-semibold text-shu-ink shadow-sm">{g.cat}</span>
                <span className="absolute bottom-[11px] right-[11px] rounded-[12px] bg-shu px-[12px] py-[5px] text-[13.5px] font-bold text-on-shu tabular">{g.pay}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="text-[12.5px] text-sumi-faint">{g.temple}</div>
                <div className="font-serif text-[18px] leading-snug">{g.title}</div>
                <div className="mt-2.5 flex items-center gap-[7px] text-[13.5px] text-sumi-soft tabular"><span className="text-shu-ink">🗓</span>{g.when}</div>
                <div className="mt-[11px] flex flex-1 flex-wrap content-start gap-1.5">
                  {g.tags.map(([t, hot]) => (
                    <span key={t} className={`rounded-xl px-[9px] py-[3px] text-[11.5px] ${hot ? "bg-matcha-bg text-matcha-ink" : "bg-washi-2 text-sumi-faint"}`}>{t}</span>
                  ))}
                </div>
                <div className="mt-3.5 flex items-center gap-2.5">
                  <span className="flex-1 text-[13px] text-sumi-soft">募集 {g.cap}名</span>
                  <button onClick={() => openPanel(g)} className="rounded-[10px] bg-shu px-[18px] py-2.5 text-[14.5px] font-semibold text-on-shu hover:brightness-105">応募する</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* apply slide-over（簡素版：必須は自己紹介のみ） */}
      <SlideOver
        open={current !== null}
        onClose={() => setCurrent(null)}
        title="このお手伝いに応募する"
        footer={
          <div className="flex items-center gap-3">
            <span className="flex-1 text-xs text-sumi-faint">応募すると、お寺と運営に届きます。日程など細かいことは、このあと直接やりとりで決められます。</span>
            <button
              disabled={!canSubmit}
              onClick={() => { setDone(true); setCurrent(null); }}
              className="rounded-xl bg-gradient-to-br from-shu to-shu-ink px-[26px] py-3 text-base font-semibold text-on-shu shadow-sm hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              応募する
            </button>
          </div>
        }
      >
        {current && (
          <>
            <div className="mb-[22px] rounded-xl border border-line-soft bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-shu-bg text-[25px]">{current.em}</div>
                <div>
                  <div className="text-xs text-sumi-faint">{current.temple}</div>
                  <div className="font-serif text-[17px]">{current.title}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line-soft pt-3 text-[13.5px] text-sumi-soft tabular">
                <span className="flex items-center gap-1.5"><span className="text-shu-ink">🗓</span><b className="text-sumi">{current.when}</b></span>
                <span className="flex items-center gap-1.5"><span className="text-shu-ink">💴</span><b className="text-sumi">{current.pay}</b></span>
                <span className="flex items-center gap-1.5"><span className="text-shu-ink">👥</span>募集{current.cap}名</span>
              </div>
            </div>

            <Field label="自己紹介・意気込み" required>
              <textarea value={pr} onChange={(e) => setPr(e.target.value)} placeholder="学年・経験・参加できそうな日・お寺で手伝いたい理由などを、ざっくり書いてください。（例：朝が得意で体力に自信あり。土日はだいたい参加できます）細かいことは、このあと直接やりとりで決められます。" className="min-h-[120px] w-full resize-y rounded-[10px] border-[1.5px] border-line bg-card px-[13px] py-3 text-base leading-relaxed outline-none focus:border-shu" />
            </Field>

            <div className="rounded-[11px] bg-shu-bg px-4 py-3 text-[13.5px] leading-relaxed text-shu-ink">
              💬 このあとのやりとりは、お寺と直接おこないます。<b>運営も内容を確認でき、トラブル時に対応します</b>のでご安心ください。
            </div>
          </>
        )}
      </SlideOver>

      {done && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-washi/80 p-[22px] backdrop-blur-sm">
          <div className="max-w-[440px] rounded-[18px] border border-line-soft bg-card p-9 text-center shadow-lg">
            <div className="mx-auto mb-[18px] grid h-[74px] w-[74px] place-items-center rounded-full bg-shu text-[38px] text-on-shu">✓</div>
            <h2 className="mb-2.5 font-serif text-[23px]">応募を送信しました</h2>
            <p className="mb-[22px] text-[15px] leading-relaxed text-sumi-soft">
              お寺と運営に応募が届きました。ここからは<b className="text-sumi">お寺と直接やりとり</b>で、日程や詳しいことを決められます。困ったときは運営が対応します。
            </p>
            <button onClick={() => { setDone(false); setPr(""); }} className="w-full rounded-xl bg-gradient-to-br from-shu to-shu-ink px-[26px] py-3 text-base font-semibold text-on-shu">一覧に戻る</button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterRow({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-[60px] flex-none text-[12.5px] text-sumi-faint">{label}</span>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={value === v} className={`rounded-[18px] border-[1.5px] px-[14px] py-2 text-sm ${value === v ? "border-shu bg-shu-bg font-semibold text-shu-ink" : "border-line bg-card text-sumi-soft hover:border-shu hover:text-shu-ink"}`}>{l}</button>
      ))}
    </div>
  );
}

function Field({ label, required, optional, children }: { label: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-[7px] block text-[15px] font-semibold">
        {label}
        {required && <span className="ml-1.5 text-xs font-semibold text-shu-ink">必須</span>}
        {optional && <span className="ml-1.5 text-xs font-normal text-sumi-faint">任意</span>}
      </label>
      {children}
    </div>
  );
}
