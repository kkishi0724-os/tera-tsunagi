-- テラつなぎ 初期スキーマ（DESIGN.md 5章 / DESIGN_V2_PORTAL.md / SIMPLIFY_v3.md 準拠）
-- Supabase の SQL Editor に貼り付けて実行してください。
-- v3方針：場所名・空き日時・料金は自由記述（テキスト）。厳密な構造化は任意。

create table if not exists temples (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamptz default now()
);

-- 一般ユーザー統合（企画者にもワーカーにもなれる）
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  is_organizer boolean default false,
  is_worker boolean default false,
  school text,
  created_at timestamptz default now()
);

-- 貸出スペース
create table if not exists spaces (
  id bigint primary key generated always as identity,
  temple text not null,
  name text not null,          -- 貸せる場所（自由入力）
  em text default '⛩️',
  place text,                  -- フィルタ用の目安（本堂/庭園/和室/境内）
  cats text[] default '{}',
  description text default '',
  avail text default '',       -- 空き日時（自由記述・v3）
  cap int,
  price text default '応相談',  -- 料金（自由記述）
  tags text[] default '{}',
  published boolean default true,
  created_at timestamptz default now()
);

-- スペース申込（v3：必須は message のみ）
create table if not exists space_applications (
  id uuid primary key default gen_random_uuid(),
  space_id bigint references spaces(id),
  applicant_name text,
  title text,
  message text not null,
  status text default 'new',   -- new/wait/ok/off
  created_at timestamptz default now()
);

-- お手伝い募集
create table if not exists gigs (
  id bigint primary key generated always as identity,
  temple text not null,
  title text not null,
  em text default '🧹',
  cat text,                    -- 清掃/祭り/受付/SNS
  work text[] default '{}',    -- 単発/土日/平日/早朝
  when_note text default '',   -- 日時（自由記述）
  pay text default '',         -- 報酬（自由記述）
  cap int,
  tags jsonb default '[]',     -- [[ラベル, 強調フラグ], ...]
  open boolean default true,
  created_at timestamptz default now()
);

-- バイト応募（v3：必須は message のみ）
create table if not exists gig_applications (
  id uuid primary key default gen_random_uuid(),
  gig_id bigint references gigs(id),
  applicant_name text,
  school text,
  message text not null,
  status text default 'new',   -- new/wait/ok/off
  created_at timestamptz default now()
);

-- やりとり（thread_type で space/gig を切替。運営は閲覧可＝v3）
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_type text,            -- space / gig
  space_application_id uuid references space_applications(id),
  gig_application_id uuid references gig_applications(id),
  sender_type text,            -- temple / user / operator
  body text,
  created_at timestamptz default now()
);

-- ===== RLS（最低限）=====
-- 公開スペース・募集は誰でも閲覧可。書き込みと申込/応募/メッセージのポリシーは
-- 認証設計に合わせて後日追加（運営は全閲覧可＝v3）。
alter table spaces enable row level security;
alter table gigs enable row level security;
create policy "read published spaces" on spaces for select using (published = true);
create policy "read open gigs" on gigs for select using (open = true);
