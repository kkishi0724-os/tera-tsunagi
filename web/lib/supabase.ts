import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase クライアント（環境変数が設定されている時だけ有効）。
// 鍵は .env.local に設定（.env.example 参照）。未設定ならモックデータにフォールバックする。
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key);
}

export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}
