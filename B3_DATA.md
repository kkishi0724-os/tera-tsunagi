# B-3 データ層と本番バックエンド（2026-07-15）

## いまの状態（済）

- ドメイン型 `web/lib/types.ts`（DESIGN.md / DESIGN_V2_PORTAL.md / SIMPLIFY_v3.md 準拠）。
- モックのデータ層 `web/lib/data.ts`（`getSpaces()` / `getGigs()` … **差し替え用の継ぎ目**）。
- 画面は inline 配列をやめ、この getter 経由でデータを読む（`/search`・`/gigs` を移行済み）。
- **狙い**：本番DBに繋ぐときは `lib/data.ts` の getter 中身だけ差し替えれば、画面側の変更は最小。

## 次（未・要バックエンド選定＝アカウント/鍵が必要）

現状は **静的export（`output: "export"`）→ Cloudflare 静的配信**。サーバー処理を持たない構成のため、
永続データは次のいずれかで実現する（**この選定はチーム判断。実際の作成は本人のアカウント/鍵が要る＝運営側で用意**）。

| 選択肢 | 概要 | 相性 | 備考 |
|---|---|---|---|
| **Supabase（推奨・有力）** | Postgres＋認証＋クライアントSDK | ◎ 静的exportのままブラウザから直接呼べる | 姉妹プロジェクト handball-donation で採用実績。RLSでアクセス制御 |
| Cloudflare D1 / KV | CFのDB/KV。Workerが必要 | ○ | 静的配信からWorker構成へ一部変更が要る |
| 端末内（localStorage 等） | 保存はブラウザ内のみ | △ | チームの低リスク志向に合うが、端末間同期・お寺⇔ユーザー共有ができない |

**推奨**：まず **Supabase**。`spaces`/`applications`/`gigs`/`gig_applications`/`messages`（DESIGN準拠）を作成し、
`lib/data.ts` の getter を Supabase クライアント呼び出しに差し替える（getter を `async` 化 → 画面は初期表示を
ローディング＋`useEffect`/Server-Component取得へ調整）。認証（お寺ログイン・ユーザー）も Supabase Auth で。

### 運営側で用意が必要なもの（私からは作成不可）
- Supabase プロジェクト作成、`NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` を `.env.local` に設定（鍵は本人が管理）。
- テーブル作成（DESIGN.md 5章＋v2/v3の差分：`avail` 自由記述、`message` 中心の申込 等）。
- 決済は外部（Stripe等）に委譲し、カード情報は自社で持たない（A4_PRODUCT_DECISIONS.md）。

## 移行の段取り（バックエンド決定後）
1. `lib/types.ts` を確定スキーマに合わせて微調整。
2. `lib/data.ts` の getter を実バックエンド呼び出しに（まず読み取り、次に作成/更新）。
3. 申込・応募・メッセージの **書き込み**（`create*`）を追加し、画面のダミー送信を実接続に。
4. 認証・権限（お寺/ユーザー/運営の閲覧範囲。運営はやりとり閲覧可＝v3）。
