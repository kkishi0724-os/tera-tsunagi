# テラつなぎ（仮称）｜要件定義書・システム設計書（初版・MVP）

お寺の空きスペース・空き時間 × イベント企画者マッチングプラットフォーム。

## 1. ビジョン・ビジネスモデル

- **ビジョン**: お寺の敷居を下げ、学生のチカラでお寺と人々を繋ぎ直す。
- **モデル**: お寺が「空いているスペース・時間帯（本堂・境内・和室など）」を掲載 →
  企画者（ヨガ・マルシェ・WS・学生イベント等）が空き枠に申込 → マッチング。
- **自社の立ち位置**: プラットフォーム提供に加え、お寺の困りごと・相談窓口（実装支援）を
  裏側で包括請負。

## 2. ターゲットユーザー

| 区分 | 想定ユーザー | 主な利用シーン | UI配慮 |
|---|---|---|---|
| 寺院側（供給） | ご住職・寺族・寺務担当（シニア層・IT不慣れ） | 空き枠掲載、申込の承認・相談 | 大きめ文字・少ないタップ・平易な日本語 |
| 企画者側（需要） | ヨガ講師・マルシェ主催・WS講師・学生団体 | 空き枠検索、企画申込、当日調整 | スマホ最適・簡潔なフォーム |
| 自社（運営） | 我々の会社 | 掲載代行・トラブル対応・調整支援 | 管理者ビュー（MVP後） |

## 3. 主要機能（MVP）

1. お寺の空きスペース・時間掲載機能（場所・時間帯・設備・条件）
2. 企画案の申込・一覧機能（企画タイトル・内容・希望日時）
3. マッチング・ステータス管理機能（承認／調整中／辞退のダッシュボード）

## 4. 画面遷移図（基本設計）

```
[公開トップ / LP]
   ├─ お寺として掲載する ─▶ [寺院 新規登録] ─▶ [メール認証]
   │                                              ▼
   │                                  ★[寺院ダッシュボード]★ ← プロトタイプ実装済み
   │                                     ├─ [空き枠 新規掲載フォーム]
   │                                     ├─ [空き枠 一覧 / 編集]
   │                                     ├─ [申込一覧] ─▶ [申込詳細] ─▶(承認/調整中/辞退)
   │                                     ├─ [予定カレンダー] ─▶ [イベント詳細]
   │                                     └─ [メッセージ / 相談窓口]
   │
   └─ 企画を探す ─▶ [空き枠検索・一覧] ─▶ [空き枠詳細] ─▶ [企画申込フォーム]
                                                              ▼
                                          [企画者マイページ]（申込状況・メッセージ）
```

## 5. データベース簡易テーブル設計

```
temples（お寺）
  temple_id (PK) / name / sect(宗派) / address / contact_name /
  email / phone / description / status(審査中|公開中|停止) / created_at

spaces（スペース枠：貸出可能な場所×条件）
  space_id (PK) / temple_id (FK) / place_type(本堂|庭園|客殿|和室|境内) /
  title / capacity / equipment / conditions(音量・飲食等) /
  base_price / photos / status(掲載中|非公開) / created_at

availabilities（空き時間帯：スペースの貸出可能スロット）
  availability_id (PK) / space_id (FK) / date / start_time / end_time /
  status(空き|仮押さえ|成立)

organizers（企画者・主催者）
  organizer_id (PK) / name / org_name / email / phone /
  category(ヨガ|マルシェ|WS|学生団体 等) / created_at

applications（申込案件：企画者→空き枠のマッチング）
  application_id (PK) / organizer_id (FK) / space_id (FK) /
  availability_id (FK, nullable) / event_title / event_content /
  desired_datetime / headcount / message /
  status(新着|調整中|承認|辞退|成立) / created_at / updated_at

messages（相談・調整スレッド）
  message_id (PK) / application_id (FK) / sender_type(寺|企画者|運営) /
  body / created_at
```

**設計ポイント**
- `spaces`（場所定義）と `availabilities`（日時スロット）を分離 → 同じ本堂に複数枠を柔軟登録。
- `applications.status` をマッチングの中核ステートマシンとして管理。
- 運営（自社）は `messages.sender_type=運営` として全案件に介入でき、
  「相談窓口の包括請負」を表現。

## 6. プロトタイプ実装済み範囲

`prototype/temple-owner-dashboard.html`（寺院向けダッシュボード）。
外部依存ゼロの自己完結 HTML/CSS/バニラJS。Artifact 公開済み:
https://claude.ai/code/artifact/4f4e53f0-acf7-4106-81c5-df488c1edd80

- 和モダン配色（和紙／墨／抹茶＝ブランド軸／朱＝CTA／金茶）、明朝見出し＋ゴシック本文
- シニア配慮（基本17px・タップ44px・高コントラスト・平易な日本語）
- ライト/ダーク両対応
- 動作するインタラクション: タブ切替、申込の承認/相談/辞退（ステータス変化＋集計自動更新）、
  スペース掲載トグル、カレンダー自動描画、掲載CTA、運営サポート枠
