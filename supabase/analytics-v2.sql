-- Traffic analytics v2 (sessions, time on site, city, channel, funnel events). Run once in the Supabase SQL editor. Safe to re-run.
-- Needs supabase/analytics.sql to have been run first.
alter table page_views add column if not exists session text, add column if not exists pid text, add column if not exists dur int,
  add column if not exists city text, add column if not exists region text, add column if not exists country text,
  add column if not exists medium text, add column if not exists campaign text, add column if not exists landing boolean default false;
create index if not exists page_views_pid on page_views(pid);
create index if not exists page_views_session on page_views(session);
alter table site_events add column if not exists visitor text, add column if not exists session text;
create index if not exists site_events_name_created on site_events(name, created_at desc);
alter table orders add column if not exists visitor text;
create index if not exists orders_visitor on orders(visitor);
notify pgrst, 'reload schema';
