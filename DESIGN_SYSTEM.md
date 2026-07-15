# テラつなぎ デザインシステム（v1・2026-07-15）

5つのプロトタイプ（`prototype/*.html`）で実証済みの「型」を確定・言語化したもの。
**以降の画面実装（HANDOFF の B 系）は、判断せずこの仕様に沿って埋めるだけにする**のが目的。
プロトタイプでぶれていた値はここで一本化した（末尾「裁定メモ」参照）。

コンセプト: 和モダン／落ち着いたアースカラー。シニア（ご住職）も直感的に使える情報設計。
「入力より選択」「一目で状態が分かる」「運営が仲介」を UI で表現する。

---

## 1. カラートークン（確定値）

CSS カスタムプロパティで定義し、`prefers-color-scheme` と `:root[data-theme]` の両方で切替（4章）。
**色は必ずトークン経由で参照し、生 hex を各コンポーネントに直書きしない。**

### 基調・ニュートラル（和紙〜墨。緑寄りの温かいグレー）
| トークン | 用途 | Light | Dark |
|---|---|---|---|
| `--washi`      | ページ地（和紙） | `#f3ede0` | `#1c1a16` |
| `--washi-2`    | 一段沈めた地・入れ子 | `#ede5d4` | `#171512` |
| `--card`       | 浮いた面（カード） | `#fbf8f1` | `#26231d` |
| `--card-2`     | カード内の入れ子面 | `#f7f1e5` | `#2c2822` |
| `--sumi`       | 主テキスト（墨） | `#2c2822` | `#efe8da` |
| `--sumi-soft`  | 副テキスト | `#5b5346` | `#c1b8a6` |
| `--sumi-faint` | 三次・キャプション | `#8c8375` | `#8f8676` |
| `--line`       | 罫線・境界 | `#ddd2bd` | `#3a352c` |
| `--line-soft`  | 淡い罫線 | `#e7ddca` | `#332e26` |

### アクセント（抹茶＝ブランド軸 / 朱＝CTA・強調 / 金茶＝差し色）
| トークン | 用途 | Light | Dark |
|---|---|---|---|
| `--matcha`      | ブランド主色・トグルON・承認系ボタン | `#6a774b` | `#9aa876` |
| `--matcha-ink`  | 抹茶の文字色（淡地の上） | `#4f5a35` | `#b6c391` |
| `--matcha-bg`   | 抹茶の淡いウォッシュ | `#e6e8d5` | `#31382a` |
| `--matcha-deep` | グラデ・濃地面（LP運営帯） | `#414a2c` | `#c3cf9f` |
| `--shu`         | 主要CTA・落款・アクティブ下線 | `#b04a2f` | `#d9694a` |
| `--shu-ink`     | 朱の文字色 | `#8f3a24` | `#e9906f` |
| `--shu-bg`      | 朱の淡いウォッシュ・選択中 | `#f2ddd2` | `#3a2820` |
| `--kincha`      | 差し色・フォーカスリング・運営バッジ | `#a8823f` | `#cba861` |
| `--kincha-bg`   | 金茶の淡い帯（運営メッセージ） | `#f0e6cf` | `#39311d` |

### セマンティック（状態色。アクセントとは別系統）
| 状態 | 文字/主 | 背景 | Light 主/背 | Dark 主/背 |
|---|---|---|---|---|
| ok（承認・成立・掲載中） | `--ok` | `--ok-bg` | `#4f7a4d` / `#dfe9d8` | `#8fb27f` / `#2b3626` |
| wait（調整中・注意） | `--wait` | `--wait-bg` | `#b3822a` / `#f2e6c9` | `#d5ad57` / `#39311d` |
| off（辞退・非公開） | `--off` | `--off-bg` | `#9a5a4a` / `#ecdcd4` | `#c98874` / `#382622` |
| new（新着） | 朱を流用 | `--shu-ink` / `--shu-bg` | — | — |

---

## 2. タイポグラフィ

CDN 不可（Artifact CSP）かつ CJK はデータURI埋め込みが重いため、**システムフォントで確実に表示**する。
Windows/Mac 双方で明朝・ゴシックが出るスタックを使用。

```css
--serif: "Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","MS PMincho",serif;
--sans:  "Hiragino Kaku Gothic ProN","Yu Gothic","YuGothic","Meiryo","Noto Sans JP",sans-serif;
```

- **明朝（--serif）= 格・情緒**。見出し（h1〜h3）、ブランド名、大きな数値、落款。
- **ゴシック（--sans）= 可読・操作**。本文、ラベル、ボタン、フォーム、UI 全般。
- **数値は必ず** `font-variant-numeric: tabular-nums`（日時・件数・料金・カレンダー）。

### 基本サイズ（対象で切替＝ルール）
- **寺院・シニア向け画面（ダッシュボード／掲載フォーム／相談スレッド）= 17px**
- **企画者・公開向け画面（企画者検索／LP）= 16px**
- 行間: 本文 1.65、LP など読み物 1.75。

### 型スケール（役割 → サイズ / 書体）
| 役割 | サイズ | 書体 | 備考 |
|---|---|---|---|
| Hero 見出し | `clamp(38px,6.4vw,62px)` | 明朝 | LP のみ。`letter-spacing:.03em` |
| セクション見出し | `clamp(26px,3.6vw,34px)` | 明朝 | |
| ページ/パネル見出し | 19–30px | 明朝 | h1=28–30, パネル=19–21 |
| カード/項目タイトル | 16.5–18.5px | 明朝 | |
| 本文 | 15–17px | ゴシック | |
| ラベル・メタ | 13–14.5px | ゴシック | |
| キャプション・eyebrow | 11.5–13px | ゴシック | ラテンは `letter-spacing:.1–.16em; text-transform:uppercase` |

見出しは `text-wrap: balance`。

---

## 3. スペーシング・角丸・影・レイアウト

- **余白は flex/grid の `gap`** で作る（個別 margin の相殺を避ける）。よく使う値: 8 / 10 / 12 / 14 / 18 / 22 / 24px。
- **角丸**: `--radius:14px`（既定）。大きな広報面（LP のカード/帯）は 16–22px。
  ボタン 10–13px、チップ/ピル 18–20px、アバター/丸ボタン 50%。
- **影**（トークン化）:
  ```css
  --shadow:    0 1px 2px rgba(44,40,34,.05), 0 6px 20px rgba(44,40,34,.06);
  --shadow-lg: 0 4px 12px rgba(44,40,34,.10), 0 18px 44px rgba(44,40,34,.12);
  /* dark は rgba(0,0,0,.3〜.5) 系に差し替え（4章のブロックに含む） */
  ```
- **レイアウト幅**: コンテンツ最大 1080–1180px 中央寄せ、左右パディング 22–24px。
  ダッシュボード等は `1.5fr / 1fr` の2カラム、狭幅で1カラムへ。
- 横スクロールさせない。広い要素（表・カレンダー）は自前の `overflow-x:auto` 容器に入れる。

---

## 4. テーマ切替（ライト/ダーク）

トークンを `:root` に定義 → `@media (prefers-color-scheme: dark)` で上書き →
さらに `:root[data-theme="light"]` / `:root[data-theme="dark"]` で明示トグルを最優先。
**コンポーネントはトークン参照のみ**。メディアクエリ内で個別に色を書かない。
（実装済みの完全なトークンブロックは各 `prototype/*.html` の `<style>` 冒頭からそのまま流用可。）

---

## 5. コンポーネント・カタログ

各部品の「見た目・状態・参照実装」。State は `aria-*` 属性で持ち、CSS は属性セレクタで表現する。

| 部品 | 要点 | 状態 | 参照実装 |
|---|---|---|---|
| **落款シール（ブランド）** | 朱グラデの角丸四角に明朝「寺」 | — | 全画面ヘッダ |
| **ボタン** | primary=抹茶グラデ / shu=朱グラデ(主CTA) / outline / line(淡) / ghost / off(テキスト)。lg サイズあり | hover=`brightness(1.05)`＋`translateY(-1px)`／`disabled`=opacity .45–.5 | 全画面 |
| **チップ／トグル** | ピル。選択で `aria-pressed=true`→`--matcha-bg`＋`--matcha-ink`＋太字 | pressed / hover | フォーム・検索・スレッド |
| **統計タイル** | 左に4pxのセマンティック帯、ラベル＋明朝の大数値＋トレンド | 帯色でカテゴリ表現 | ダッシュボード |
| **ステータスピル** | `s-new`(朱)/`s-wait`/`s-ok`/`s-off` の bg・ink 対 | 状態遷移で貼替 | ダッシュボード・スレッド |
| **パネル/カード** | `--card`地・`--line-soft`罫・`--radius`・`--shadow` | hover=浮上（一覧カード） | 全画面 |
| **タブ** | 選択タブは下線 `--shu`（3px）、件数ピル付き | `aria-selected` | ダッシュボード |
| **選択カード** | 2px罫の大きめ選択肢。選択で罫`--shu`＋`--shu-bg` | `aria-pressed` | 掲載フォーム①場所 |
| **プリセット時間チップ／枠行** | ワンタップ時間帯、追加した枠は抹茶地の行＋削除 | — | 掲載フォーム② |
| **ステッパー（＋/−）** | 数値を大きなタップ領域で増減（52px/46px） | — | 掲載フォーム・企画者申込 |
| **トグルスイッチ** | 掲載ON/OFF。ON で`--matcha`＋ノブ移動 | `aria-pressed` | ダッシュボード |
| **カレンダーセル** | 予定=抹茶、本日/要確認=朱、`tabular-nums` | has/today | ダッシュボード |
| **メッセージ吹き出し（三者）** | 寺=右・抹茶／企画者=左・中立カード／運営=全幅・金茶帯＋バッジ | 送信で追加 | 相談スレッド |
| **スライドオーバー＋スクリム** | 右から申込フォーム、`translateX` .28s、背景スクリム | open クラス | 企画者検索 |
| **トースト** | 墨地・下中央・自動消滅。ok=抹茶アイコン | 表示/フェード | ダッシュボード・スレッド他 |
| **ライブプレビュー** | 入力に追従し「相手にはこう見える」を常時表示 | 入力バインド | 掲載フォーム |
| **フォーム入力** | date/time/text/textarea/number。1.5px `--line`罫、focus で `--matcha` | focus / エラー時罫`--shu` | フォーム類 |
| **ステップ進捗（ウィザード）** | 現在=朱丸、完了=抹茶丸、番号は明朝（漢数字も可） | active/done | 掲載フォーム・LP使い方 |
| **円相ensō／落款（装飾）** | SVG一筆書き（stroke-dashoffset）＋朱スタンプ。**LP等の広報面のみ** | 初回アニメ | LP |

- **フォーカス可視**: 全インタラクティブ要素に `:focus-visible{outline:3px solid var(--kincha);outline-offset:2px}`。

---

## 6. インタラクション・モーション

- トランジションは 0.15–0.28s。カード hover は `translateY(-1〜3px)`＋影を `--shadow-lg` へ。
- 出現演出は控えめに（LP のスクロールリビール、ensō の一筆書き程度）。過剰な動きは避ける。
- **`@media (prefers-reduced-motion: reduce)` で全 animation/transition を無効化**し、
  アニメの最終状態（描き切ったensō等）を初期表示にする。実装済みパターンを踏襲。

---

## 7. アクセシビリティ・シニア配慮（必須ルール）

- 寺院向け画面は基本 **17px**、タップ領域 **44px 以上**、高コントラストを死守。
- **専門語を避けた平易な日本語**（「webhook」等の実装語をユーザー向けに出さない）。
- **入力より選択**（カード・チップ・ステッパー・トグル）でタイプ量を最小化。
- 状態は色だけでなく**文言＋形（ピル/帯）**でも示す（色覚差への配慮）。
- 状態は `aria-pressed` / `aria-selected` / `aria-hidden` / `aria-live`（トースト）で持つ。

---

## 8. 実装マッピング（B 系へ引き継ぐ指針）

想定スタックは他プロジェクト踏襲の **Next.js(App Router)+TypeScript+Tailwind**（HANDOFF B-1）。

- **トークン**: `app/globals.css` に本書1・3章のCSS変数ブロック（light/dark/[data-theme]）を1か所だけ定義。
  プロトタイプでは各HTMLに重複コピーしているので、**実装では必ず一元化**する。
- **Tailwind**: `tailwind.config` の `theme.extend.colors` を CSS 変数参照にする。例:
  ```js
  colors:{ washi:'var(--washi)', sumi:'var(--sumi)', matcha:{DEFAULT:'var(--matcha)',ink:'var(--matcha-ink)',bg:'var(--matcha-bg)'}, shu:{/*…*/}, /* 以下同様 */ }
  fontFamily:{ serif:'var(--serif)', sans:'var(--sans)' }
  ```
- **コンポーネント化**（5章の各部品→React コンポーネント）:
  `Seal / Button(variant,size) / Chip / Toggle / StatTile / StatusPill / Panel / Tabs /
   SelectCard / Stepper / Switch / CalendarCell / MessageBubble(role) / SlideOver / Toast /
   LivePreview / Field(型別) / StepProgress`。
- **データ対応**（DESIGN.md のスキーマ）: StatusPill↔`applications.status`、MessageBubble.role↔`messages.sender_type`、
  SelectCard/検索↔`spaces`/`availabilities`。
- 各部品の具体マークアップは対応する `prototype/*.html`（5章の参照列）からコピーして移植する。

---

## 裁定メモ（プロトタイプ間のぶれを統一）

- **和紙の色味**: LP が `--washi:#f4efe3 / --washi-2:#ece3d1` とわずかに暖色寄りだった。
  **正はダッシュボード系の `#f3ede0 / #ede5d4`**。LP を実装時に合わせる（またはチーム判断で暖色版に全画面統一）。
- **基本フォントサイズ**: 17px（寺院・シニア向け）と 16px（企画者・公開向け）の使い分けを**ルールとして確定**（2章）。
- **角丸**: 既定 14px、広報面のみ 16–22px。
- **`--matcha-deep`**: LP のグラデ/濃地面用に追加。正トークンに採用。
- トークンの重複コピー（各HTML）は、実装時に globals.css へ一元化して解消する。
