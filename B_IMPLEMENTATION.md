# B 実装ガイド（2026-07-15 開始）

下位モデル・別セッションが、判断せず手を動かして実装を進めるための手順書。
デザインの型は `DESIGN_SYSTEM.md`、各画面の見た目は `prototype/*.html`、
要件・DBは `DESIGN.md` が正。**まず各作業前に `web/AGENTS.md`（Next 16 の注意）を読むこと。**

## なぜ `web/` サブフォルダか

- ルートの `wrangler.toml` は現在 `./prototype`（動くHTML）を配信しており、**公開サイトが稼働中**。
- これを壊さないよう、実アプリは `web/` に置いて並走させる。完成後に切替（下記）。

## セットアップ（初回の一歩）

```bash
cd web
npm install
npm run dev      # http://localhost:3000 で確認（トークン動作確認ページが出る）
npm run build    # 静的書き出し → web/out/
```

`web/` に用意済みのもの（既存プロジェクトと同じ構成）:
- `package.json`（Next 16.2.7 / React 19.2.4 / Tailwind v4 / TS5）
- `next.config.ts`（`output: "export"`・images unoptimized）／`postcss.config.mjs`／`tsconfig.json`
- `app/globals.css` … **デザイントークンを Tailwind v4 の `@theme inline`＋CSS変数で定義済み**
  （`bg-washi` `text-sumi` `border-line` `bg-matcha-bg` `font-serif` 等が使える。ライト/ダーク対応）
- `app/layout.tsx` / `app/page.tsx`（トークン動作確認用のデモ）
- `components/Button.tsx` / `components/StatusPill.tsx`（**部品移植のパターン見本**）

## 実装の進め方（型に沿って埋めるだけ）

各画面は「対応する `prototype/*.html` を見ながら React コンポーネントへ移植」する。
色・余白・角丸は `DESIGN_SYSTEM.md` のトークン＝Tailwindユーティリティに置換する（生hex禁止）。

推奨の順番（依存の少ない順）:
1. **共通部品**（`components/`）を出し切る：`Button` `Chip` `StatusPill` `StatTile` `Panel` `Tabs`
   `SelectCard` `Stepper` `Switch` `Toast` `Field` `MessageBubble` `SlideOver` `StepProgress`。
   → `DESIGN_SYSTEM.md` 5章の部品カタログと参照実装（prototype）を1対1で移植。
2. **公開LP** `app/page.tsx` ← `prototype/landing.html`
3. **寺院ダッシュボード** `app/temple/page.tsx` ← `prototype/temple-owner-dashboard.html`
4. **掲載フォーム** `app/temple/spaces/new/page.tsx` ← `prototype/temple-listing-form.html`
5. **申込詳細/相談スレッド** `app/temple/applications/[id]/page.tsx` ← `prototype/temple-application-thread.html`
6. **企画者 検索〜申込** `app/search/page.tsx` ← `prototype/organizer-search.html`
7. データ層：まずはモックデータ → 後で DB（`DESIGN.md` のスキーマ）。
   ※ 静的export構成のため、サーバー処理が要るなら外部サービス（Cloudflare の機能・外部API・外部決済）を使う。

## ダークモードのテーマ切替

`app/globals.css` で `prefers-color-scheme` と `:root[data-theme]` の両方に対応済み。
トグルを付ける場合は `document.documentElement.setAttribute("data-theme", ...)` するクライアント部品を追加。

## 公開の切替（実アプリが揃ったら）

- 案A：`web/` を新しい Cloudflare プロジェクトとして連携（ビルド `npm run build`、出力 `web/out`）。
- 案B：`web/` の中身をリポジトリ直下へ移し、ルート `wrangler.toml` を `./out` に変更（既存プロジェクトと同型）。
- どちらでも、切替までは現行の `prototype/` 配信が生きる。

## 注意（`web/AGENTS.md` より）

Next 16 / React 19 / Tailwind v4 は学習データと差異あり。**コードを書く前に
`node_modules/next/dist/docs/` の該当ガイドを読む**こと。API 変更・非推奨に注意。
