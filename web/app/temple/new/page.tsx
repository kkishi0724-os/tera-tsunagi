"use client";

import { useState } from "react";

// 空き枠の掲載（簡素版 v3）。離脱を減らすため自由入力・必須2つだけ。
// 細かい日時・条件・料金は設定させず、申込後の直接やりとりで決める（SIMPLIFY_v3.md）。
export default function NewListing() {
  const [place, setPlace] = useState("");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const canSubmit = place.trim() !== "" && when.trim() !== "";

  return (
    <div className="text-[17px]">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-6 py-[11px]">
          <a href="/temple" className="inline-flex items-center gap-2 rounded-[11px] border border-line bg-card px-[15px] py-[9px] text-[15px] text-sumi-soft hover:border-matcha hover:text-matcha-ink">‹ もどる</a>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-shu to-shu-ink font-serif text-xl text-on-shu">寺</div>
            <span className="font-serif text-lg tracking-[0.04em]">テラつなぎ</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-8">
        <h1 className="font-serif text-[28px] tracking-[0.02em]">空いている場所を、掲載する</h1>
        <p className="mt-2.5 leading-relaxed text-sumi-soft">
          むずかしい設定は要りません。<b className="text-sumi">貸せる場所</b>と、<b className="text-sumi">だいたいの空き時間</b>を書くだけ。
          細かい日時や条件は、<b className="text-sumi">申し込みが来てから直接やりとり</b>で決められます。
        </p>

        <div className="mt-8 flex flex-col gap-7">
          {/* 場所（自由入力） */}
          <div>
            <label htmlFor="place" className="block text-[17px] font-semibold">
              貸せる場所<span className="ml-2 text-[13px] font-semibold text-shu-ink">必須</span>
            </label>
            <p className="mb-2.5 mt-1 text-[14px] text-sumi-faint">お寺の言葉で、ご自由にどうぞ。</p>
            <input
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="例）本堂、庭園のあずまや前、山門横の広場"
              className="w-full rounded-xl border-[1.5px] border-line bg-card px-4 py-3.5 text-[17px] outline-none focus:border-matcha"
            />
          </div>

          {/* 空いている日時（自由入力） */}
          <div>
            <label htmlFor="when" className="block text-[17px] font-semibold">
              空いている日時<span className="ml-2 text-[13px] font-semibold text-shu-ink">必須</span>
            </label>
            <p className="mb-2.5 mt-1 text-[14px] text-sumi-faint">きっちり決めなくて大丈夫。おおよそで結構です。</p>
            <textarea
              id="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="例）平日の午前中ならいつでも／8月の土日／基本いつでも相談OK"
              className="min-h-[96px] w-full resize-y rounded-xl border-[1.5px] border-line bg-card px-4 py-3.5 text-[17px] leading-relaxed outline-none focus:border-matcha"
            />
          </div>

          {/* ひとこと（任意） */}
          <div>
            <label htmlFor="note" className="block text-[17px] font-semibold">
              ひとこと・お願い<span className="ml-2 text-[13px] font-normal text-sumi-faint">任意</span>
            </label>
            <p className="mb-2.5 mt-1 text-[14px] text-sumi-faint">書かなくても掲載できます。</p>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例）静かに使っていただける方を歓迎します。詳しいことは申込後にご相談で。"
              className="min-h-[80px] w-full resize-y rounded-xl border-[1.5px] border-line bg-card px-4 py-3.5 text-[17px] leading-relaxed outline-none focus:border-matcha"
            />
          </div>

          {/* 安心の案内 */}
          <div className="rounded-2xl bg-matcha-bg px-5 py-4 text-[15px] leading-relaxed text-matcha-ink">
            📞 細かい日時・人数・条件は、<b>申し込みが来てから直接やりとり</b>で決められます。
            言った言わないやトラブルの心配は、<b>運営があいだに入って対応</b>しますのでご安心ください。
          </div>
        </div>
      </main>

      {/* 固定フッター送信 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-washi/95 backdrop-blur">
        <div className="mx-auto flex max-w-[720px] items-center gap-4 px-6 py-3.5">
          <span className="flex-1 text-[13px] text-sumi-faint">掲載後もいつでも修正・非公開にできます。</span>
          <button
            disabled={!canSubmit}
            onClick={() => setDone(true)}
            className="rounded-xl bg-gradient-to-br from-shu to-shu-ink px-7 py-3.5 text-[17px] font-semibold text-on-shu shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            この内容で掲載する
          </button>
        </div>
      </div>

      {/* 成功 */}
      {done && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-washi/80 p-6 backdrop-blur-sm">
          <div className="max-w-[440px] rounded-[18px] border border-line-soft bg-card p-9 text-center shadow-lg">
            <div className="mx-auto mb-[18px] grid h-[74px] w-[74px] place-items-center rounded-full bg-matcha text-[38px] text-on-accent">✓</div>
            <h2 className="mb-2.5 font-serif text-[23px]">掲載しました</h2>
            <p className="mb-[22px] text-[15px] leading-relaxed text-sumi-soft">
              <b className="text-sumi">「{place}」</b>を掲載しました。申し込みが届いたら、
              直接やりとりで日時や詳しいことを決められます。むずかしいときは運営がサポートします。
            </p>
            <a href="/temple" className="inline-block w-full rounded-xl bg-gradient-to-br from-shu to-shu-ink px-[26px] py-3 text-base font-semibold text-on-shu">ダッシュボードにもどる</a>
          </div>
        </div>
      )}
    </div>
  );
}
