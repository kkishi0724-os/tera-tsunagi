# テラつなぎ（仮称）

お寺の空きスペース・空き時間 × イベント企画者マッチングプラットフォーム。
学生起業チームによる新規事業。**現在は企画・プロトタイプ段階。**

## 中身

- `prototype/` … 動くプロトタイプ一式（自己完結の静的HTML）。**Cloudflare の公開対象**
  - `index.html` … プロジェクト・インデックス（公開時のトップ）
  - `landing.html` / `temple-owner-dashboard.html` / `temple-listing-form.html`
    / `temple-application-thread.html` / `organizer-search.html` / `design-system.html`
- `DESIGN.md` … 要件定義・システム設計
- `DESIGN_SYSTEM.md` … デザインシステムの正
- `HANDOFF.md` … 現状と残作業の正（再開時にまず読む）

## デプロイ（Cloudflare・関西お墓サポートと同じ方式）

- 静的アセットを Cloudflare Workers で配信（`wrangler.toml` の `[assets] directory = "./prototype"`）
- **GitHub に push すると Cloudflare が自動ビルド・公開**（連携設定後）
- 公開トップは `prototype/index.html`
