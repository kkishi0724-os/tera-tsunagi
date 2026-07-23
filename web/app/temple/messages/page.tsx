"use client";

import { useState } from "react";
import { MessageBubble } from "@/components/MessageBubble";

// やりとり（1対1・簡素版 v3）。お寺⇔申込者の直接メッセージ。運営は閲覧でき、トラブル時に「運営に相談」で呼べる。
type Msg = { id: number; role: "self" | "other" | "ops"; body: string; time: string };

const INITIAL: Msg[] = [
  { id: 1, role: "other", time: "9:40",
    body: "はじめまして、みどりヨガスタジオの田村と申します。朝の本堂で15名ほどのヨガ教室を開かせていただけないかと思い、申し込みました。8月の日曜の朝などいかがでしょうか。" },
  { id: 2, role: "self", time: "11:20",
    body: "ご丁寧にありがとうございます。8月3日（日）の朝7時からでしたらお貸しできます。堂内は土足厳禁ですので、靴下でお願いできますでしょうか。" },
  { id: 3, role: "other", time: "12:05",
    body: "ありがとうございます！8月3日でぜひお願いします。参加者は全員、素足か靴下でうかがいます。" },
];

const QUICK = ["承知しました。お待ちしています。", "当日の流れを教えてください。", "日程を少し相談させてください。"];

export default function Messages() {
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  }
  function now() {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: Date.now(), role: "self", body: t, time: now() }]);
    setInput("");
    showToast("メッセージを送信しました");
  }
  function callOperator() {
    setMsgs((m) => [
      ...m,
      { id: Date.now(), role: "ops", time: now(),
        body: "運営です。お困りごとを確認しました。日程・当日の段取り・キャンセルなど、こちらで間に入って対応します。どうぞご安心ください。" },
    ]);
    showToast("運営に連絡しました");
  }

  return (
    <div className="flex min-h-screen flex-col text-[17px]">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[780px] items-center gap-3 px-5 py-[11px]">
          <a href="/temple" className="grid h-[38px] w-[38px] place-items-center rounded-[11px] border border-line bg-card text-lg text-sumi-soft hover:border-matcha hover:text-matcha-ink" aria-label="もどる">‹</a>
          <div className="flex items-center gap-2.5">
            <div className="grid h-[42px] w-[42px] place-items-center rounded-full bg-gradient-to-br from-[#8a7f6a] to-[#6f6553] font-serif text-[17px] text-[#f4f1e6]">田</div>
            <div>
              <div className="text-[15.5px] font-semibold leading-tight">田村 佳奈 さん</div>
              <div className="text-[12px] text-sumi-faint">みどりヨガスタジオ</div>
            </div>
          </div>
          <a href="/temple/messages" className="ml-auto rounded-[10px] bg-matcha px-4 py-2 text-[14px] font-semibold text-on-accent hover:brightness-105" onClick={() => showToast("この申込を承認しました")}>✓ 承認</a>
        </div>
      </header>

      {/* 申込の文脈 */}
      <div className="border-b border-line-soft bg-card-2">
        <div className="mx-auto flex max-w-[780px] items-center gap-3 px-5 py-3 text-[14px] text-sumi-soft">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-matcha-bg text-lg">🧘</span>
          <span>申込：<b className="text-sumi">朝の寺ヨガ教室</b> ・ 本堂</span>
        </div>
      </div>

      {/* 運営の見守りバナー */}
      <div className="border-b border-kincha/30 bg-kincha-bg">
        <div className="mx-auto flex max-w-[780px] flex-wrap items-center gap-x-3 gap-y-2 px-5 py-2.5">
          <span className="text-[13.5px] text-kincha">👀 このやりとりは運営が確認しています。トラブル時は対応します。</span>
          <button onClick={callOperator} className="ml-auto rounded-[9px] border border-kincha/50 bg-card px-3 py-1.5 text-[13px] font-semibold text-kincha hover:brightness-105">運営に相談する</button>
        </div>
      </div>

      {/* thread */}
      <div className="flex-1 bg-washi-2">
        <div className="mx-auto flex max-w-[780px] flex-col gap-4 px-5 py-6">
          <div className="text-center text-[12.5px] text-sumi-faint">
            <span className="rounded-[14px] border border-line-soft bg-card px-3.5 py-1">申込を受け付けました ・ 7月14日</span>
          </div>
          {msgs.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              name={m.role === "self" ? "妙覚寺（ご住職）" : m.role === "other" ? "田村 佳奈" : undefined}
              roleTag={m.role === "self" ? "お寺" : m.role === "other" ? "企画者" : undefined}
              avatar={m.role === "self" ? "妙" : "田"}
              time={m.time}
            >
              {m.body}
            </MessageBubble>
          ))}
        </div>
      </div>

      {/* composer */}
      <div className="sticky bottom-0 border-t border-line bg-card">
        <div className="mx-auto max-w-[780px] px-5 py-3.5">
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button key={q} onClick={() => send(q)} className="rounded-[18px] border-[1.5px] border-line bg-card px-3.5 py-2 text-[14px] text-sumi-soft hover:border-matcha hover:bg-matcha-bg hover:text-matcha-ink">{q}</button>
            ))}
          </div>
          <div className="flex items-end gap-2.5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力…（上のボタンから選ぶこともできます）"
              className="max-h-40 min-h-[52px] flex-1 resize-none rounded-xl border-[1.5px] border-line bg-card-2 px-3.5 py-3 text-base leading-relaxed outline-none focus:border-matcha"
            />
            <button onClick={() => send(input)} disabled={input.trim() === ""} aria-label="送信" className="grid h-[52px] w-[56px] flex-none place-items-center rounded-xl bg-gradient-to-br from-shu to-shu-ink text-[22px] text-on-shu shadow-sm hover:brightness-105 disabled:opacity-50">➤</button>
          </div>
          <div className="mt-2 text-[12px] text-sumi-faint">お寺として返信します。日時など細かいことは、ここで直接決められます。</div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[90] -translate-x-1/2">
          <div className="flex items-center gap-2.5 rounded-xl bg-sumi px-5 py-3 text-[15px] text-washi shadow-lg">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-matcha text-sm text-white">✓</span>{toast}
          </div>
        </div>
      )}
    </div>
  );
}
