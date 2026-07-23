// ドメイン型。DESIGN.md / DESIGN_V2_PORTAL.md / SIMPLIFY_v3.md のスキーマに対応。
// v3方針：場所・空き日時・料金は「自由記述」。厳密な構造化（date/start/end 等）は任意。

export type AppStatus = "new" | "wait" | "ok" | "off";

/** お寺（temples） */
export interface Temple {
  id: string;
  name: string;
}

/** 貸出スペース（spaces）。availabilityNote 相当を `avail` として自由記述で持つ（v3）。 */
export interface Space {
  id: number;
  temple: string;
  name: string;      // 貸せる場所（自由入力）
  em: string;        // アイコン
  place: string;     // フィルタ用の目安（本堂/庭園/和室/境内）
  cats: string[];    // 相性のよい企画ジャンル
  desc: string;
  avail: string;     // 空き日時（自由記述・v3）
  cap: number;
  price: string;     // 料金（自由記述・「応相談」可）
  tags: string[];
}

/** スペース申込（applications）。v3で必須は message のみ。 */
export interface SpaceApplication {
  id: string;
  spaceId?: number;
  applicantName: string;
  title?: string;
  message: string;
  status: AppStatus; // new=新着 / wait=調整中 / ok=承認済み / off=辞退
}

/** お手伝い募集（gigs）。日時・報酬は自由記述。 */
export interface Gig {
  id: number;
  temple: string;
  title: string;
  em: string;
  cat: string;            // 清掃/祭り/受付/SNS
  work: string[];         // 働き方タグ（単発/土日/平日/早朝）
  when: string;           // 日時（自由記述）
  pay: string;            // 報酬（自由記述）
  cap: number;
  tags: [string, boolean][]; // [ラベル, 強調フラグ]
}

/** バイト応募（gig_applications）。v3で必須は message のみ。 */
export interface GigApplication {
  id: string;
  gigId?: number;
  applicantName: string;
  school?: string;
  message: string;
  status: AppStatus; // new=応募 / wait=面談調整 / ok=採用 / off=見送り
}

/** やりとり（messages）。thread_type と sender_type に対応。運営は閲覧可・トラブル時に介入（v3）。 */
export type SenderType = "temple" | "user" | "operator";
export interface Message {
  id: string;
  threadType: "space" | "gig";
  senderType: SenderType;
  body: string;
  createdAt: string;
}
