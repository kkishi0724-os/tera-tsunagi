import { Button } from "@/components/Button";
import { StatusPill } from "@/components/StatusPill";

// トークン・部品パイプラインの動作確認用ページ。
// 実装が進んだら、prototype/landing.html を移植したLPに置き換える。
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-matcha-bg px-3 py-1.5 text-[13px] tracking-wider text-matcha-ink">
        ◦ 学生がつくる、お寺の新しい縁
      </span>

      <h1 className="mt-5 font-serif text-4xl leading-tight tracking-wide sm:text-5xl">
        お寺の敷居を、そっと<span className="text-shu-ink">下げる</span>。
      </h1>
      <p className="mt-4 max-w-xl leading-8 text-sumi-soft">
        本堂・庭園・和室・境内——。使われていない場所と時間を、ヨガやマルシェ、
        ワークショップをひらきたい人へ。お寺と人々を、学生のチカラで結び直します。
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button variant="shu">お寺として掲載する</Button>
        <Button variant="outline">企画する場所を探す</Button>
      </div>

      <div className="mt-12 rounded-2xl border border-line-soft bg-card p-6 shadow-sm">
        <div className="text-sm text-sumi-faint">申込ステータス（部品サンプル）</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill status="new" label="新着" />
          <StatusPill status="wait" label="調整中" />
          <StatusPill status="ok" label="承認済み" />
          <StatusPill status="off" label="辞退" />
        </div>
      </div>

      <p className="mt-10 text-sm text-sumi-faint">
        この画面はデザイントークンと部品の動作確認用です。ライト/ダーク両対応。
        各画面は <code className="font-serif">DESIGN_SYSTEM.md</code> と{" "}
        <code className="font-serif">prototype/</code> を参照して実装します。
      </p>
    </main>
  );
}
