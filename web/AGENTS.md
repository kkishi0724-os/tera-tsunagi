# This is NOT the Next.js you know

This version (Next 16 / React 19 / Tailwind v4) has breaking changes — APIs, conventions,
and file structure may all differ from your training data.
Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.

## このプロジェクトの要点

- 静的サイト（`output: "export"` → `out/`）。サーバー処理（API ルート等）は追加しない。
- スタイルは **Tailwind v4**。設定JSは無く、トークンは `app/globals.css` の
  `@theme inline` ＋ CSS 変数で定義（`DESIGN_SYSTEM.md` が正）。
- デザインの型・部品仕様は リポジトリ直下の `DESIGN_SYSTEM.md`、
  各画面の見た目は `prototype/*.html` を参照して移植する。
