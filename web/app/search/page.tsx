"use client";

import { useMemo, useState } from "react";
import { SlideOver } from "@/components/SlideOver";
import { Stepper } from "@/components/Stepper";

// 企画者の空き枠検索〜申込。prototype/organizer-search.html を移植（移植第3号）。
type Space = {
  id: number; temple: string; name: string; em: string; place: string; cats: string[];
  desc: string; slots: string[]; cap: number; price: string; tags: string[];
};

const SPACES: Space[] = [
  { id: 1, temple: "妙覚寺", name: "本堂", em: "⛩️", place: "本堂", cats: ["ヨガ", "音楽"],
    desc: "朝の澄んだ空気の中、静かに過ごせる本堂。定期利用の相談も歓迎です。",
    slots: ["8/3(日) 7:00–8:30", "8/17(日) 7:00–8:30", "8/23(土) 18:00–20:00"], cap: 30, price: "応相談",
    tags: ["静か・音量控えめ", "土足厳禁", "冷暖房なし"] },
  { id: 2, temple: "妙覚寺", name: "境内広場", em: "🏯", place: "境内", cats: ["マルシェ", "展示"],
    desc: "大きな催しに向く広い境内。電源あり、8ブース程度のマルシェ実績あり。",
    slots: ["9/7(日) 10:00–15:00", "9/21(祝) 10:00–15:00"], cap: 200, price: "¥20,000",
    tags: ["屋外", "電源あり", "拡声器は要相談"] },
  { id: 3, temple: "長楽寺", name: "庭園", em: "🌿", place: "庭園", cats: ["展示", "ワークショップ"],
    desc: "手入れの行き届いた回遊式庭園。撮影・展示・少人数の茶会に。",
    slots: ["土日午後（応相談）", "8/30(土) 13:00–16:00"], cap: 40, price: "¥15,000",
    tags: ["屋外", "撮影可", "雨天中止"] },
  { id: 4, temple: "建仁院", name: "客殿（和室）", em: "🍵", place: "和室", cats: ["ワークショップ"],
    desc: "冷暖房完備の落ち着いた和室。手仕事のワークショップにおすすめ。",
    slots: ["平日 10:00–17:00（応相談）", "8/12(火) 13:00–15:30"], cap: 16, price: "¥8,000",
    tags: ["冷暖房あり", "給湯・台所", "駐車場"] },
  { id: 5, temple: "光明寺", name: "本堂", em: "⛩️", place: "本堂", cats: ["音楽", "ヨガ"],
    desc: "音の響きが美しい本堂。夜間の音楽会・朗読会に向いています。",
    slots: ["夜間 18:00–20:30（応相談）", "9/13(土) 18:30–20:30"], cap: 50, price: "応相談",
    tags: ["音響設備", "夜間可", "土足厳禁"] },
  { id: 6, temple: "円成寺", name: "書院", em: "🏛️", place: "和室", cats: ["ワークショップ", "展示"],
    desc: "少人数の会に向く静かな書院。読書会・句会・小さな展示に。",
    slots: ["随時（応相談）", "8/24(日) 14:00–16:00"], cap: 12, price: "¥5,000",
    tags: ["静か", "お手洗い", "駐車場"] },
];

const CAT_FILTERS = [["all", "すべて"], ["ヨガ", "ヨガ・体操"], ["マルシェ", "マルシェ・市"], ["ワークショップ", "ワークショップ"], ["音楽", "音楽・朗読"], ["展示", "展示・撮影"]] as const;
const PLACE_FILTERS = [["all", "すべて"], ["本堂", "本堂"], ["庭園", "庭園"], ["和室", "和室・客殿"], ["境内", "境内・屋外"]] as const;
const FORM_CATS = ["ヨガ・体操", "マルシェ", "ワークショップ", "音楽・朗読", "展示・撮影", "その他"];

export default function SearchPage() {
  const [cat, setCat] = useState("all");
  const [place, setPlace] = useState("all");
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Space | null>(null);
  const [title, setTitle] = useState("");
  const [formCat, setFormCat] = useState(FORM_CATS[0]);
  const [slotSel, setSlotSel] = useState<string | null>(null);
  const [headcount, setHeadcount] = useState(15);
  const [content, setContent] = useState("");
  const [done, setDone] = useState(false);

  const list = useMemo(
    () =>
      SPACES.filter((s) => {
        if (cat !== "all" && !s.cats.includes(cat)) return false;
        if (place !== "all" && s.place !== place) return false;
        if (q) {
          const hay = (s.temple + s.name + s.desc + s.tags.join("") + s.slots.join("")).toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [cat, place, q],
  );

  function openPanel(s: Space) {
    setCurrent(s);
    setSlotSel(null);
    setTitle("");
    setContent("");
    setHeadcount(15);
    setFormCat(FORM_CATS[0]);
  }
  const canSubmit = title.trim() !== "" && content.trim() !== "" && slotSel !== null;

  return (
    <>
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-[22px] py-[11px]">
          <a href="/" className="flex items-center gap-[11px]">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-shu to-shu-ink font-serif text-xl text-on-shu">寺</div>
            <div>
              <div className="font-serif text-[19px] leading-none tracking-[0.04em]">テラつなぎ</div>
              <div className="text-[11px] tracking-[0.1em] text-sumi-faint">お寺の空き枠を探す</div>
            </div>
          </a>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-[#8a7f6a] to-[#6f6553] font-serif text-base text-[#f4f1e6]">田</div>
            <div className="hidden sm:block">
              <div className="text-[13px] leading-tight">みどりヨガスタジオ</div>
              <div className="text-[11px] text-sumi-faint">企画者・田村さん</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-[22px] pb-20">
        {/* hero + search */}
        <div className="pb-5 pt-[30px]">
          <h1 className="font-serif text-[30px] tracking-[0.02em]">お寺で、あなたの企画をひらく。</h1>
          <p className="mt-2 text-[15.5px] text-sumi-soft">本堂・庭園・和室・境内——お寺の空いている場所と時間を見つけて、申し込めます。</p>
          <div className="mt-5 flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-line bg-card py-1.5 pl-4 pr-1.5 shadow-sm">
            <span className="text-[19px] text-sumi-faint">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="キーワードで探す（例：本堂、庭園、静か、夜、駐車場）"
              className="flex-1 bg-transparent px-1 py-3 text-base outline-none"
            />
            <button className="rounded-[10px] bg-gradient-to-br from-shu to-shu-ink px-[22px] py-3 text-[15px] font-semibold text-on-shu">さがす</button>
          </div>
          {/* filters */}
          <div className="mt-4 flex flex-col gap-3">
            <FilterRow label="企画" value={cat} onChange={setCat} options={CAT_FILTERS} />
            <FilterRow label="場所" value={place} onChange={setPlace} options={PLACE_FILTERS} />
          </div>
        </div>

        <div className="mb-3.5 mt-6 flex items-baseline gap-2.5">
          <span className="font-serif text-[19px]">見つかった空き枠</span>
          <span className="text-sm text-sumi-faint tabular">{list.length}件</span>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && (
            <div className="col-span-full py-[50px] text-center text-sumi-faint">
              条件に合う空き枠が見つかりませんでした。<br />フィルターやキーワードを変えてお試しください。
            </div>
          )}
          {list.map((s) => (
            <article key={s.id} className="flex flex-col overflow-hidden rounded-[14px] border border-line-soft bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="relative grid h-[118px] place-items-center bg-gradient-to-br from-matcha-bg to-washi-2 text-[48px]">
                <span>{s.em}</span>
                <span className="absolute left-[11px] top-[11px] rounded-[14px] bg-card px-[11px] py-1 text-xs font-semibold text-matcha-ink shadow-sm">{s.cats[0]}ほか</span>
                <span className="absolute bottom-[11px] right-[11px] rounded-[12px] bg-sumi/80 px-[11px] py-1 text-[13px] font-semibold text-washi tabular">{s.price}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="text-[12.5px] text-sumi-faint">{s.temple}</div>
                <div className="font-serif text-[18px]">{s.name}</div>
                <div className="mt-[7px] flex-1 text-[13.5px] leading-relaxed text-sumi-soft">{s.desc}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.slots.slice(0, 2).map((x) => (
                    <span key={x} className="rounded-[9px] border border-line-soft bg-card-2 px-[9px] py-1 text-xs text-sumi-soft tabular">🗓 {x}</span>
                  ))}
                  {s.slots.length > 2 && <span className="rounded-[9px] border border-line-soft bg-card-2 px-[9px] py-1 text-xs text-sumi-soft">＋{s.slots.length - 2}枠</span>}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-xl bg-washi-2 px-[9px] py-[3px] text-[11.5px] text-sumi-faint">{t}</span>
                  ))}
                </div>
                <div className="mt-3.5 flex items-center gap-2.5">
                  <span className="flex-1 text-[13px] text-sumi-soft">〜{s.cap}名</span>
                  <button onClick={() => openPanel(s)} className="rounded-[10px] bg-matcha px-[18px] py-2.5 text-[14.5px] font-semibold text-on-accent hover:brightness-105">申し込む</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* apply slide-over */}
      <SlideOver
        open={current !== null}
        onClose={() => setCurrent(null)}
        title="この枠に申し込む"
        footer={
          <div className="flex items-center gap-3">
            <span className="flex-1 text-xs text-sumi-faint">送信すると、お寺と運営に申込が届きます。日程はこのあと相談できます。</span>
            <button
              disabled={!canSubmit}
              onClick={() => { setDone(true); setCurrent(null); }}
              className="rounded-xl bg-gradient-to-br from-shu to-shu-ink px-[26px] py-3 text-base font-semibold text-on-shu shadow-sm hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              申し込む
            </button>
          </div>
        }
      >
        {current && (
          <>
            <div className="mb-[22px] flex items-center gap-3 rounded-xl border border-line-soft bg-card p-4">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-matcha-bg text-[25px]">{current.em}</div>
              <div>
                <div className="text-xs text-sumi-faint">{current.temple}</div>
                <div className="font-serif text-[17px]">{current.name}</div>
              </div>
            </div>

            <Field label="企画タイトル" required>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例）朝の寺ヨガ教室" className="w-full rounded-[10px] border-[1.5px] border-line bg-card px-[13px] py-3 text-base outline-none focus:border-matcha" />
            </Field>

            <Field label="企画のジャンル" optional>
              <div className="flex flex-wrap gap-2">
                {FORM_CATS.map((c) => (
                  <button key={c} onClick={() => setFormCat(c)} aria-pressed={formCat === c} className={`rounded-[18px] border-[1.5px] px-[14px] py-2 text-sm ${formCat === c ? "border-matcha bg-matcha-bg font-semibold text-matcha-ink" : "border-line bg-card text-sumi-soft hover:border-matcha"}`}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="希望日時" required>
              <div className="flex flex-col gap-2">
                {current.slots.map((s) => (
                  <button key={s} onClick={() => setSlotSel(s)} aria-pressed={slotSel === s} className={`flex items-center gap-[11px] rounded-[11px] border-[1.5px] px-[14px] py-3 text-[15px] tabular ${slotSel === s ? "border-shu bg-shu-bg font-semibold" : "border-line bg-card hover:border-matcha"}`}>
                    <span className={`relative h-5 w-5 flex-none rounded-full border-2 ${slotSel === s ? "border-shu after:absolute after:inset-[3px] after:rounded-full after:bg-shu" : "border-line"}`} />
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="想定人数" optional>
              <Stepper value={headcount} onChange={setHeadcount} unit="名ほど" />
            </Field>

            <Field label="企画内容" required>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="どんな催しか、音量や火気の有無、準備・片付けの流れなどを書くと、お寺が判断しやすくなります。" className="min-h-[88px] w-full resize-y rounded-[10px] border-[1.5px] border-line bg-card px-[13px] py-3 text-base leading-relaxed outline-none focus:border-matcha" />
            </Field>
          </>
        )}
      </SlideOver>

      {/* success */}
      {done && current === null && title !== "" && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-washi/80 p-[22px] backdrop-blur-sm">
          <div className="max-w-[440px] rounded-[18px] border border-line-soft bg-card p-9 text-center shadow-lg">
            <div className="mx-auto mb-[18px] grid h-[74px] w-[74px] place-items-center rounded-full bg-matcha text-[38px] text-on-accent">✓</div>
            <h2 className="mb-2.5 font-serif text-[23px]">申込を送信しました</h2>
            <p className="mb-[22px] text-[15px] leading-relaxed text-sumi-soft">
              お寺と運営に申込が届きました。お寺からの返信や日程の相談は、マイページの「相談スレッド」で続けられます。
            </p>
            <button onClick={() => { setDone(false); setTitle(""); }} className="w-full rounded-xl bg-gradient-to-br from-shu to-shu-ink px-[26px] py-3 text-base font-semibold text-on-shu">一覧に戻る</button>
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
      <span className="w-[52px] flex-none text-[12.5px] text-sumi-faint">{label}</span>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={value === v} className={`rounded-[18px] border-[1.5px] px-[14px] py-2 text-sm ${value === v ? "border-matcha bg-matcha-bg font-semibold text-matcha-ink" : "border-line bg-card text-sumi-soft hover:border-matcha hover:text-matcha-ink"}`}>{l}</button>
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
