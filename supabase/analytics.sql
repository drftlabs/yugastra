-- Website visitor tracking for Admin → Analytics. Run once in the Supabase SQL editor.
create table if not exists page_views(
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  path text, visitor text, ref text, device text, lang text);
create index if not exists page_views_created on page_views(created_at desc);
create index if not exists page_views_visitor on page_views(visitor);
alter table page_views enable row level security;

-- Prepaid discount, Meta Pixel and the other new settings need no SQL: they are saved from Admin → Settings.
