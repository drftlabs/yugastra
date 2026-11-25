-- Traffic analytics (complete, standalone). Run once in the Supabase SQL editor. Safe to re-run.
-- It creates everything it needs, so supabase/analytics.sql is not required first.
create table if not exists page_views(
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  path text, visitor text, ref text, device text, lang text);
create index if not exists page_views_created on page_views(created_at desc);
create index if not exists page_views_visitor on page_views(visitor);
alter table page_views enable row level security;

alter table page_views add column if not exists session text, add column if not exists pid text, add column if not exists dur int,
  add column if not exists city text, add column if not exists region text, add column if not exists country text,
  add column if not exists medium text, add column if not exists campaign text, add column if not exists landing boolean default false;
create index if not exists page_views_pid on page_views(pid);
create index if not exists page_views_session on page_views(session);

create table if not exists site_events(id bigserial primary key, name text, path text, meta jsonb, created_at timestamptz default now());
alter table site_events enable row level security;
alter table site_events add column if not exists visitor text, add column if not exists session text;
create index if not exists site_events_name_created on site_events(name, created_at desc);

alter table orders add column if not exists visitor text;
create index if not exists orders_visitor on orders(visitor);
notify pgrst, 'reload schema';
