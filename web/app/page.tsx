import Link from "next/link";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

// 公開LP。prototype/landing.html を移植（移植第1号・以降の見本）。
// CTA のリンク先（/temple, /search 等）は各画面の実装後に差し替える。TODO はコメントで明示。
const DASHBOARD = "#doors"; // TODO: 実装後に /temple へ
const SEARCH = "#doors"; // TODO: 実装後に /search へ

export default function Home() {
  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1080px] items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-gradient-to-br from-shu to-shu-ink font-serif text-[22px] text-on-shu">
              寺
            </div>
            <span className="font-serif text-xl tracking-[0.05em]">テラつなぎ</span>
          </div>
          <nav className="ml-6 hidden gap-6 md:flex">
            <a href="#doors" className="text-sm text-sumi-soft hover:text-matcha-ink">はじめる</a>
            <a href="#how" className="text-sm text-sumi-soft hover:text-matcha-ink">使い方</a>
            <a href="#examples" className="text-sm text-sumi-soft hover:text-matcha-ink">生まれた企画</a>
            <a href="#ops" className="text-sm text-sumi-soft hover:text-matcha-ink">運営のサポート</a>
          </nav>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Button variant="ghost" href={SEARCH}>空き枠を探す</Button>
            <Button variant="shu" href={DASHBOARD}>お寺の方はこちら</Button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-[1080px] items-center gap-8 px-6 pb-14 pt-16 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-matcha-bg px-3.5 py-1.5 text-[13px] tracking-[0.14em] text-matcha-ink">
              ◦ 学生がつくる、お寺の新しい縁
            </span>
            <h1 className="font-serif text-[clamp(38px,6.4vw,62px)] font-semibold leading-[1.25] tracking-[0.03em]">
              お寺の敷居を、<br />そっと<span className="text-shu-ink">下げる</span>。
            </h1>
            <p className="mt-5 max-w-[30em] text-[17px] leading-loose text-sumi-soft">
              本堂、庭園、和室、境内——。使われていない場所と時間を、ヨガやマルシェ、
              ワークショップをひらきたい人へ。お寺と人々を、学生のチカラで結び直すプラットフォームです。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href={DASHBOARD}>お寺として場所を掲載する</Button>
              <Button variant="outline" size="lg" href={SEARCH}>企画する場所を探す</Button>
            </div>
            <p className="mt-4 text-[13px] text-sumi-faint">
              掲載も申込も無料。むずかしい調整は、運営がおてつだいします。
            </p>
          </div>

          {/* hero art: 円相＋縦書き＋落款 */}
          <div className="relative grid h-[340px] place-items-center" aria-hidden="true">
            <div className="absolute inset-0 grid place-items-center">
              <svg className="enso" viewBox="0 0 300 300">
                <path d="M204 64 C150 34 74 46 50 108 C26 170 60 244 132 256 C204 268 262 214 254 148 C248 96 210 68 176 62" />
              </svg>
            </div>
            <div className="vtag relative font-serif text-[30px] leading-none text-sumi">
              場<span className="text-shu-ink">を</span>ひらく
            </div>
            <div className="vstamp absolute bottom-2 right-[calc(50%-132px)] grid h-[52px] w-[52px] place-items-center rounded-[10px] border-2 border-shu bg-shu/10 text-center font-serif text-[13px] leading-[1.15] text-shu">
              結<br />縁
            </div>
          </div>
        </div>
      </section>

      {/* ===== TWO DOORS ===== */}
      <section id="doors" className="py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <SectionHeading
            center
            tag="Start here"
            title="二つの入口から、はじめられます"
            lead="場所を貸したいお寺の方も、企画をひらきたい方も。あなたの立場からどうぞ。"
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {/* お寺 */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-br from-matcha-bg to-transparent px-7 pb-5 pt-7">
                <div className="text-[40px]">⛩️</div>
                <div className="mt-2.5 text-[13px] tracking-[0.1em] text-sumi-faint">TEMPLE ／ お寺・ご住職の方</div>
                <div className="mt-1 font-serif text-2xl">空いている場所を、活かす</div>
              </div>
              <div className="flex flex-1 flex-col px-7 pb-6 pt-5">
                <ul className="mb-6 flex flex-col gap-3">
                  {[
                    "本堂・庭園・和室・境内などの空き枠を、条件つきで掲載",
                    "届いた企画を、承認・相談・辞退でかんたん管理",
                    "やりとりや当日の段取りは、運営がおてつだい",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] text-sumi-soft">
                      <span className="font-bold text-matcha-ink">✓</span>{t}
                    </li>
                  ))}
                </ul>
                <Button variant="primary" size="lg" href={DASHBOARD} className="mt-auto w-full">
                  お寺の管理画面をみる ›
                </Button>
              </div>
            </div>

            {/* 企画者 */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-br from-shu-bg to-transparent px-7 pb-5 pt-7">
                <div className="text-[40px]">🧘</div>
                <div className="mt-2.5 text-[13px] tracking-[0.1em] text-sumi-faint">ORGANIZER ／ 企画したい方</div>
                <div className="mt-1 font-serif text-2xl">お寺で、企画をひらく</div>
              </div>
              <div className="flex flex-1 flex-col px-7 pb-6 pt-5">
                <ul className="mb-6 flex flex-col gap-3">
                  {[
                    "ヨガ・マルシェ・ワークショップ…お寺の空き枠を検索",
                    "企画タイトルと希望日時を入れて、その場で申込",
                    "お寺との日程調整は、相談スレッドで安心して",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] text-sumi-soft">
                      <span className="font-bold text-shu-ink">✓</span>{t}
                    </li>
                  ))}
                </ul>
                <Button variant="shu" size="lg" href={SEARCH} className="mt-auto w-full">
                  空き枠をさがす ›
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW ===== */}
      <section id="how" className="bg-washi-2 py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <SectionHeading
            center
            tag="How it works"
            title="掲載から開催まで、四つの歩み"
            lead="はじめての方でも迷わないよう、運営があいだに立って進めます。"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "一", em: "📝", t: "掲載する", d: "お寺が、貸せる場所・時間・条件を登録します。" },
              { n: "二", em: "🤝", t: "出会う", d: "企画者が空き枠を見つけ、企画を申し込みます。" },
              { n: "三", em: "💬", t: "相談する", d: "運営を交えた三者で、日程や条件を調整します。" },
              { n: "四", em: "✿", t: "ひらく", d: "承認されたら開催。お寺に、新しい人の縁が生まれます。" },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-line-soft bg-card p-5">
                <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-matcha font-serif text-[15px] text-on-accent">
                  {s.n}
                </div>
                <span className="absolute right-[18px] top-5 text-2xl opacity-50">{s.em}</span>
                <div className="mt-3.5 font-serif text-lg">{s.t}</div>
                <div className="mt-1.5 text-sm leading-relaxed text-sumi-soft">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXAMPLES ===== */}
      <section id="examples" className="py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <SectionHeading
            center
            tag="Ideas"
            title="こんな企画が、生まれています"
            lead="お寺の静けさや広さは、こんな催しと相性がよいものです。"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { em: "🧘", t: "朝の寺ヨガ", d: "澄んだ本堂で、呼吸を整える朝の時間。", tag: "本堂 ・ 早朝" },
              { em: "🍡", t: "和菓子ワークショップ", d: "和室で親子とつくる、季節の上生菓子。", tag: "客殿 ・ 週末" },
              { em: "🛍️", t: "境内あさひマルシェ", d: "地元の作り手が集う、小さな朝市。", tag: "境内 ・ 日中" },
              { em: "🖌️", t: "写経と対話の会", d: "灯りの下で筆を持ち、静かに語らう夜。", tag: "本堂 ・ 夜間" },
            ].map((e) => (
              <div key={e.t} className="overflow-hidden rounded-2xl border border-line-soft bg-card shadow-sm">
                <div className="grid h-24 place-items-center bg-gradient-to-br from-matcha-bg to-washi-2 text-[40px]">{e.em}</div>
                <div className="px-4 pb-4 pt-3.5">
                  <div className="font-serif text-[16.5px]">{e.t}</div>
                  <div className="mt-1.5 text-[13px] leading-relaxed text-sumi-soft">{e.d}</div>
                  <div className="mt-2.5 text-[11.5px] font-semibold tracking-wide text-kincha">{e.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPS（運営サポート・濃地の帯） ===== */}
      <section id="ops" className="py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="grid items-center gap-8 rounded-[22px] bg-[#3c4530] px-11 py-12 text-[#f4f1e6] md:grid-cols-2">
            <div>
              <h2 className="font-serif text-[clamp(24px,3.2vw,30px)] leading-snug tracking-[0.03em]">
                むずかしいところは、<br />運営があいだに立ちます。
              </h2>
              <p className="mt-4 text-[15.5px] leading-loose text-[#f4f1e6]/80">
                「何をどう貸せばいいか分からない」「日程の相談が不安」——。
                そんなお寺の困りごとを、私たち学生チームが窓口となって包括的におてつだい。
                掲載の代行から当日の段取りまで、そっと支えます。
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              {[
                { em: "📞", h: "相談窓口を、まるごと代行", d: "掲載内容の相談も、企画者とのやりとりも、運営が間に入ります。" },
                { em: "🗝️", h: "当日の段取りまで支援", d: "鍵の受け渡しや受付の立ち会いも、ご希望に応じて。" },
                { em: "🛡️", h: "安心して、はじめの一歩を", d: "条件やトラブルの心配は、運営が一緒に考えます。" },
              ].map((p) => (
                <div key={p.h} className="flex gap-3.5 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4">
                  <span className="text-2xl">{p.em}</span>
                  <div>
                    <div className="text-[15.5px] font-semibold">{p.h}</div>
                    <div className="mt-0.5 text-[13.5px] leading-relaxed text-[#f4f1e6]/75">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-6 pb-10 pt-[70px] text-center">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="font-serif text-[clamp(28px,4.2vw,40px)] leading-snug tracking-[0.04em]">
            お寺の一室から、<br />まちの縁が生まれる。
          </h2>
          <p className="mx-auto mt-4 text-base text-sumi-soft">まずは、あなたの立場からのぞいてみてください。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" href={DASHBOARD}>お寺として掲載する</Button>
            <Button variant="outline" size="lg" href={SEARCH}>企画する場所を探す</Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-8 border-t border-line">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-3.5 px-6 py-8 text-[13.5px] text-sumi-faint">
          <div className="flex items-center gap-3">
            <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-gradient-to-br from-shu to-shu-ink font-serif text-lg text-on-shu">
              寺
            </div>
            <span className="font-serif text-[17px]">テラつなぎ</span>
          </div>
          <span>お寺と企画を結ぶ ・ 学生チーム運営（仮称・プロトタイプ）</span>
          <div className="ml-auto flex gap-5">
            <a href="#doors" className="text-sumi-soft hover:text-matcha-ink">はじめる</a>
            <a href="#how" className="text-sumi-soft hover:text-matcha-ink">使い方</a>
            <a href="#ops" className="text-sumi-soft hover:text-matcha-ink">運営について</a>
          </div>
        </div>
      </footer>
    </>
  );
}
