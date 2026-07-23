// モックのデータ層（差し替え用の継ぎ目）。
// 画面はこの getter 経由でデータを読む。後日、本番バックエンド（B3_DATA.md 参照）に繋ぐ際は
// この getter の中身だけ差し替えれば、画面側の変更は最小で済む。
import type { Space, Gig } from "./types";
import { getSupabase } from "./supabase";

const SPACES: Space[] = [
  { id: 1, temple: "妙覚寺", name: "本堂", em: "⛩️", place: "本堂", cats: ["ヨガ", "音楽"],
    desc: "朝の澄んだ空気の中、静かに過ごせる本堂。定期利用の相談も歓迎です。",
    avail: "平日の朝／土日の夕方など、応相談", cap: 30, price: "応相談", tags: ["静か・音量控えめ", "土足厳禁"] },
  { id: 2, temple: "妙覚寺", name: "境内広場", em: "🏯", place: "境内", cats: ["マルシェ", "展示"],
    desc: "大きな催しに向く広い境内。電源あり、8ブース程度のマルシェ実績あり。",
    avail: "9月の日曜・祝日の日中", cap: 200, price: "¥20,000〜", tags: ["屋外", "電源あり"] },
  { id: 3, temple: "長楽寺", name: "庭園", em: "🌿", place: "庭園", cats: ["展示", "ワークショップ"],
    desc: "手入れの行き届いた回遊式庭園。撮影・展示・少人数の茶会に。",
    avail: "土日の午後（雨天中止）", cap: 40, price: "¥15,000〜", tags: ["屋外", "撮影可"] },
  { id: 4, temple: "建仁院", name: "客殿（和室）", em: "🍵", place: "和室", cats: ["ワークショップ"],
    desc: "冷暖房完備の落ち着いた和室。手仕事のワークショップにおすすめ。",
    avail: "平日 10〜17時ごろ、応相談", cap: 16, price: "¥8,000〜", tags: ["冷暖房あり", "給湯・台所"] },
  { id: 5, temple: "光明寺", name: "本堂", em: "⛩️", place: "本堂", cats: ["音楽", "ヨガ"],
    desc: "音の響きが美しい本堂。夜間の音楽会・朗読会に向いています。",
    avail: "夜間 18〜21時ごろ、応相談", cap: 50, price: "応相談", tags: ["音響設備", "夜間可"] },
  { id: 6, temple: "円成寺", name: "書院", em: "🏛️", place: "和室", cats: ["ワークショップ", "展示"],
    desc: "少人数の会に向く静かな書院。読書会・句会・小さな展示に。",
    avail: "随時、応相談", cap: 12, price: "¥5,000〜", tags: ["静か", "駐車場"] },
];

const GIGS: Gig[] = [
  { id: 1, temple: "妙覚寺", title: "境内の落ち葉清掃", em: "🧹", cat: "清掃", work: ["単発", "土日", "早朝"],
    when: "9/6(土) 8:00–11:00", pay: "時給1,200円", cap: 2, tags: [["未経験OK", true], ["朝活", false], ["道具貸与", false]] },
  { id: 2, temple: "妙覚寺", title: "秋祭りの設営・受付補助", em: "🏮", cat: "祭り", work: ["単発", "土日"],
    when: "9/23(祝) 9:00–16:00", pay: "日給8,000円", cap: 5, tags: [["学生歓迎", true], ["まかないあり", true], ["友達と応募OK", false]] },
  { id: 3, temple: "長楽寺", title: "法要の受付・お茶出し", em: "🍵", cat: "受付", work: ["単発", "平日"],
    when: "8/28(木) 10:00–13:00", pay: "時給1,100円", cap: 2, tags: [["未経験OK", true], ["服装貸与", false], ["落ち着いた環境", false]] },
  { id: 4, temple: "光明寺", title: "SNS投稿・写真撮影アシスト", em: "📷", cat: "SNS", work: ["平日"],
    when: "平日 応相談（週1〜）", pay: "1回3,000円", cap: 1, tags: [["スマホでOK", true], ["在宅一部可", false], ["継続歓迎", false]] },
  { id: 5, temple: "建仁院", title: "写経会の準備・片付け", em: "🖌️", cat: "受付", work: ["土日"],
    when: "毎週土曜 14:00–17:00", pay: "時給1,150円", cap: 2, tags: [["週1〜", true], ["未経験OK", false], ["冷暖房あり", false]] },
  { id: 6, temple: "円成寺", title: "庭園の草むしり", em: "🌿", cat: "清掃", work: ["単発", "土日", "早朝"],
    when: "8/24(日) 7:00–10:00", pay: "時給1,200円", cap: 3, tags: [["未経験OK", true], ["涼しい朝", false], ["道具貸与", false]] },
];

/** 初期表示用の同期モック（即描画）。 */
export function getSpaces(): Space[] {
  return SPACES;
}
export function getGigs(): Gig[] {
  return GIGS;
}

/**
 * 掲載中スペースを取得。Supabase 未設定・エラー時はモックにフォールバック。
 * 画面は初期表示に getSpaces() を使い、マウント後に fetchSpaces() で差し替える想定。
 */
export async function fetchSpaces(): Promise<Space[]> {
  const sb = getSupabase();
  if (!sb) return SPACES;
  const { data, error } = await sb
    .from("spaces")
    .select("id,temple,name,em,place,cats,description,avail,cap,price,tags")
    .eq("published", true)
    .order("id");
  if (error || !data || data.length === 0) return SPACES;
  return data.map((r): Space => ({
    id: r.id, temple: r.temple, name: r.name, em: r.em ?? "⛩️", place: r.place ?? "",
    cats: r.cats ?? [], desc: r.description ?? "", avail: r.avail ?? "",
    cap: r.cap ?? 0, price: r.price ?? "応相談", tags: r.tags ?? [],
  }));
}

/** 募集中のお手伝いを取得。Supabase 未設定・エラー時はモックにフォールバック。 */
export async function fetchGigs(): Promise<Gig[]> {
  const sb = getSupabase();
  if (!sb) return GIGS;
  const { data, error } = await sb
    .from("gigs")
    .select("id,temple,title,em,cat,work,when_note,pay,cap,tags")
    .eq("open", true)
    .order("id");
  if (error || !data || data.length === 0) return GIGS;
  return data.map((r): Gig => ({
    id: r.id, temple: r.temple, title: r.title, em: r.em ?? "🧹", cat: r.cat ?? "",
    work: r.work ?? [], when: r.when_note ?? "", pay: r.pay ?? "",
    cap: r.cap ?? 0, tags: r.tags ?? [],
  }));
}
