import Link from "next/link";

// ゲートウェイ（総合トップ）。prototype/portal.html 画面A を移植。
// 一般ユーザーを「①スペースを借りる→/search」「②お手伝い→/gigs」に分岐＋お寺関係者ログイン→/temple。
export default function Gateway() {
  return (
    <>
      {/* top bar */}
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-6 py-[18px]">
        <Link href="/" className="flex items-center gap-[11px]">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-gradient-to-br from-shu to-shu-ink font-serif text-[22px] text-on-shu">寺</div>
          <div>
            <div className="font-serif text-xl leading-none tracking-[0.05em]">テラつなぎ</div>
            <div className="text-[11px] tracking-[0.1em] text-sumi-faint">お寺と、若い世代をつなぐポータル</div>
          </div>
        </Link>
        <Link href="/temple" className="ml-auto inline-flex items-center gap-2 rounded-[11px] border-[1.5px] border-line bg-card px-4 py-[9px] text-sm text-sumi-soft hover:border-matcha hover:text-matcha-ink">⛩️ お寺関係者の方はこちら</Link>
      </div>

      {/* hero */}
      <div className="mx-auto max-w-[1180px] px-6 pb-2 pt-[30px] text-center">
        <span className="inline-flex items-center gap-2 rounded-[18px] bg-matcha-bg px-3.5 py-1.5 text-[12.5px] tracking-[0.14em] text-matcha-ink">◦ お寺の「空き」と「人手」を、みんなの力に</span>
        <h1 className="mt-4 font-serif text-[clamp(28px,4.6vw,42px)] leading-[1.32] tracking-[0.03em]">お寺で、なにをしてみたいですか？</h1>
        <p className="mx-auto mt-3.5 max-w-[34em] text-base text-sumi-soft">あなたのやりたいことから、入口をお選びください。むずかしい手続きや調整は、運営がおてつだいします。</p>
      </div>

      {/* two gates */}
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-6 pb-2 pt-[26px] md:flex-row">
        {/* ① space */}
        <Link href="/search" className="group relative flex min-h-[400px] grow basis-0 flex-col justify-end overflow-hidden rounded-[22px] border border-line-soft text-white shadow-sm transition-all duration-500 hover:shadow-xl md:hover:grow-[1.5]">
          <div className="absolute inset-0 bg-gradient-to-b from-matcha to-matcha-deep" />
          <span className="absolute right-6 top-6 text-[74px] opacity-50 drop-shadow-lg">🏛️</span>
          <div className="relative z-[1] p-[30px]">
            <div className="text-[13px] tracking-[0.1em] opacity-90">① イベント・企画をしたい方へ</div>
            <div className="mt-2 font-serif text-[clamp(24px,2.8vw,30px)] leading-snug">お寺のスペースを借りて、<br />企画をひらく。</div>
            <div className="mt-3 max-w-[26em] text-[14.5px] leading-relaxed opacity-90">本堂・庭園・和室・境内などの空き枠を予約。ヨガ、マルシェ、ワークショップ、展示に。</div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {["スペースレンタル", "空き時間予約", "企画の申込"].map((t) => (
                <span key={t} className="rounded-[14px] border border-white/30 bg-white/[0.18] px-[11px] py-1 text-xs">{t}</span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fbf8f1] px-[22px] py-3 text-[15.5px] font-bold text-matcha-ink shadow-sm">スペースを探す →</span>
          </div>
        </Link>

        {/* ② work */}
        <Link href="/gigs" className="group relative flex min-h-[400px] grow basis-0 flex-col justify-end overflow-hidden rounded-[22px] border border-line-soft text-white shadow-sm transition-all duration-500 hover:shadow-xl md:hover:grow-[1.5]">
          <div className="absolute inset-0 bg-gradient-to-b from-shu to-shu-ink" />
          <span className="absolute right-6 top-6 text-[74px] opacity-50 drop-shadow-lg">🧹</span>
          <div className="relative z-[1] p-[30px]">
            <div className="text-[13px] tracking-[0.1em] opacity-90">② お寺でお手伝い・お仕事をしたい方へ</div>
            <div className="mt-2 font-serif text-[clamp(24px,2.8vw,30px)] leading-snug">お寺で単発バイト、<br />ちょっと貢献する。</div>
            <div className="mt-3 max-w-[26em] text-[14.5px] leading-relaxed opacity-90">境内清掃、お祭りの手伝い、受付、SNS投稿アシストなど。お寺専用のスキマバイトです。</div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {["単発バイト", "スキマ時間", "学生・若者歓迎"].map((t) => (
                <span key={t} className="rounded-[14px] border border-white/30 bg-white/[0.18] px-[11px] py-1 text-xs">{t}</span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fbf8f1] px-[22px] py-3 text-[15.5px] font-bold text-shu-ink shadow-sm">お手伝いを探す →</span>
          </div>
        </Link>
      </div>

      {/* temple strip */}
      <div className="mx-auto max-w-[1180px] px-6 pb-8 pt-3">
        <div className="flex flex-wrap items-center gap-4 rounded-[16px] border border-line-soft bg-card px-[22px] py-[18px] shadow-sm">
          <div className="grid h-12 w-12 flex-none place-items-center rounded-[12px] bg-kincha-bg text-2xl">⛩️</div>
          <div>
            <div className="font-serif text-lg">お寺のご住職・関係者の方へ</div>
            <div className="text-[13.5px] text-sumi-soft">空きスペースの掲載も、お手伝いの募集も、ひとつの管理画面から。掲載・調整は運営がサポートします。</div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2.5">
            <Link href="/temple" className="rounded-[11px] border-[1.5px] border-line bg-card px-[18px] py-[11px] text-[14.5px] font-semibold text-sumi hover:border-matcha hover:text-matcha-ink">ログイン</Link>
            <Link href="/temple/new" className="rounded-[11px] bg-kincha px-[18px] py-[11px] text-[14.5px] font-semibold text-white hover:brightness-105">お寺を無料で登録する</Link>
          </div>
        </div>
        <div className="mt-3 text-center text-[13px] text-sumi-faint">テラつなぎ（仮称）・学生チーム運営 ・ プロトタイプ</div>
      </div>
    </>
  );
}
