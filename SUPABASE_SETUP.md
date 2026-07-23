# Supabase セットアップ手順（運営本人の作業）

コード側は接続準備済み。**鍵がない間はモックデータで動作**し、下記を設定すると自動で本番データに切り替わります。
（私＝AIはアカウント作成・鍵入力ができないため、ここはご本人の操作です。）

## 手順

1. **プロジェクト作成**
   - https://supabase.com にログイン（Googleでも可）→ New project を作成（リージョンは Tokyo 推奨）。

2. **テーブル作成（SQL）**
   - 左メニュー **SQL Editor** → 新規クエリに `web/supabase/migrations/0001_init.sql` の内容を貼り付けて Run。
   - 続けて `web/supabase/seed.sql`（動作確認用の初期データ）も Run。

3. **鍵を取得して設定**
   - **Project Settings → API** で `Project URL` と `anon public` key をコピー。
   - `web/.env.local` を新規作成し（`.env.example` をコピー）、次を設定：
     ```
     NEXT_PUBLIC_SUPABASE_URL=（Project URL）
     NEXT_PUBLIC_SUPABASE_ANON_KEY=（anon public key）
     ```
   - ※ `.env.local` は Git 追跡対象外（鍵はコミットされません）。

4. **確認**
   - `cd web && npm run dev` → `/search`・`/gigs` が **Supabase のデータ**を表示すれば成功
     （未設定・エラー時は自動でモック表示に戻ります）。

## いま繋がっている範囲 / これから

- [済・要鍵] **読み取り**：`/search`（spaces）・`/gigs`（gigs）が `lib/data.ts` の `fetchSpaces/fetchGigs` 経由で Supabase を読む。
- [次] **書き込み**：申込・応募・メッセージの保存（`create*` 関数を `lib/data.ts` に追加 → 各フォームの送信を実接続）。
- [次] **残りの画面**：`/temple`（申込・応募・スペース・募集）と `/temple/messages` のデータもデータ層へ集約。
- [次] **認証・権限**：Supabase Auth（お寺／ユーザー／運営）。RLS で「公開は誰でも閲覧」「運営はやりとり閲覧可（v3）」を設定。
- **注意**：`anon key` はブラウザに露出する前提の公開鍵。機密操作は RLS と（必要なら）サーバー関数で守ること。決済情報は持たない（A4）。

> ※ 本番データの読み書きは、鍵設定後にご自身の環境で確認してください（AI 側では鍵が無いため未検証）。
