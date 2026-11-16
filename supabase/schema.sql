-- YUGASTRA schema. Run in Supabase SQL editor, then seed.sql.
create extension if not exists pgcrypto;

create table if not exists admins(
  user_id uuid primary key references auth.users on delete cascade,
  display_name text, is_owner boolean default false, active boolean default true,
  perms jsonb default '[]'::jsonb, created_at timestamptz default now());

create table if not exists customers(
  id uuid primary key references auth.users on delete cascade,
  email text, name text, phone text, created_at timestamptz default now());
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin insert into public.customers(id,email) values(new.id,new.email) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists site_settings(key text primary key, value jsonb);

create table if not exists collections(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, theme text default 'dhruv', -- dhruv | surya | naksh | vyom | soma
  tagline text, description text, image text, banner text, headline text, variants_label text,
  sanskrit text, meaning text, story text, dial_color text,
  sort int default 0, active boolean default true, created_at timestamptz default now());

create table if not exists products(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, sku text unique, collection_id uuid references collections on delete set null,
  tagline text, description text, long_description text, features jsonb default '[]'::jsonb,
  case_color text, strap_color text, weight_g int, seo_title text, seo_description text, price numeric not null default 0, compare_price numeric,
  stock int not null default 0, edition_total int default 0, edition_sold int default 0,
  images jsonb default '[]'::jsonb, specs jsonb default '{}'::jsonb,
  featured boolean default false, active boolean default true, sort int default 0,
  created_at timestamptz default now());

create table if not exists reviews(
  id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade,
  name text, rating int default 5, body text, approved boolean default false, featured boolean default false,
  created_at timestamptz default now());

create table if not exists slides(
  id uuid primary key default gen_random_uuid(), eyebrow text, title text, subtitle text,
  cta_label text default 'Discover', cta_href text default '/collections', image text, theme text default 'dhruv',
  sort int default 0, active boolean default true);

create table if not exists circle_members(
  id uuid primary key default gen_random_uuid(), name text, watch text, dial text, diameter text,
  edition text, image text, sort int default 0, active boolean default true);

create table if not exists pages(slug text primary key, title text, body text, updated_at timestamptz default now());

create sequence if not exists order_seq start 1001;
create table if not exists orders(
  id uuid primary key default gen_random_uuid(),
  order_number text unique, status text default 'pending_payment', -- pending_payment|paid|processing|shipped|delivered|cancelled
  customer_id uuid references customers on delete set null,
  name text, email text, phone text, address text, city text, state text, pincode text,
  items jsonb, subtotal numeric, discount numeric default 0, discount_code text,
  shipping numeric default 0, total numeric, payment_method text, amount_due numeric default 0, -- COD balance
  razorpay_order_id text, razorpay_payment_id text, paid_at timestamptz,
  courier text, tracking_number text, tracking_url text, notes text,
  created_at timestamptz default now());
create index if not exists orders_rzp on orders(razorpay_order_id);

create table if not exists messages(
  id uuid primary key default gen_random_uuid(), kind text default 'contact', name text, email text, phone text,
  order_number text, body text, resolved boolean default false, created_at timestamptz default now());
create table if not exists discounts(
  id uuid primary key default gen_random_uuid(), code text unique not null, kind text default 'percent', -- percent|flat
  value numeric not null, min_order numeric default 0, max_uses int default 0, used int default 0,
  expires_at timestamptz, active boolean default true);
create table if not exists subscribers(email text primary key, created_at timestamptz default now());
create table if not exists checkouts(
  id uuid primary key default gen_random_uuid(), email text, phone text, name text, items jsonb, total numeric,
  recovered boolean default false, updated_at timestamptz default now());
create table if not exists site_events(id bigserial primary key, name text, path text, meta jsonb, created_at timestamptz default now());
create table if not exists wa_otps(phone text primary key, code_hash text, expires_at timestamptz, attempts int default 0, sent_at timestamptz, verified_until timestamptz);

create or replace function public.decrement_stock(p_id uuid, p_qty int) returns void language sql as $$
  update products set stock = greatest(0, stock - p_qty), edition_sold = edition_sold + p_qty where id = p_id; $$;
create or replace function public.use_discount(p_code text) returns void language sql as $$
  update discounts set used = used + 1 where upper(code) = upper(p_code); $$;
create or replace function public.next_order_number() returns text language sql as $$
  select 'YG-' || nextval('order_seq')::text; $$;

-- RLS: public can read catalog; everything else is service-role only
alter table admins enable row level security; alter table customers enable row level security;
alter table site_settings enable row level security; alter table collections enable row level security;
alter table products enable row level security; alter table reviews enable row level security;
alter table slides enable row level security; alter table circle_members enable row level security;
alter table pages enable row level security; alter table orders enable row level security;
alter table messages enable row level security; alter table discounts enable row level security;
alter table subscribers enable row level security; alter table checkouts enable row level security;
alter table site_events enable row level security; alter table wa_otps enable row level security;
create policy "pub read collections" on collections for select using (active);
create policy "pub read products" on products for select using (active);
create policy "pub read reviews" on reviews for select using (approved);
create policy "pub read slides" on slides for select using (active);
create policy "pub read circle" on circle_members for select using (active);
create policy "pub read pages" on pages for select using (true);
create policy "pub read settings" on site_settings for select using (true);
create policy "own customer" on customers for select using (auth.uid() = id);
create policy "own orders" on orders for select using (auth.uid() = customer_id);

-- For databases created before the 5-collection catalogue: add the new columns.
alter table collections add column if not exists sanskrit text;
alter table collections add column if not exists meaning text;
alter table collections add column if not exists story text;
alter table collections add column if not exists dial_color text;
alter table products add column if not exists sku text;
alter table products add column if not exists long_description text;
alter table products add column if not exists features jsonb default '[]'::jsonb;
alter table products add column if not exists case_color text;
alter table products add column if not exists strap_color text;
alter table products add column if not exists weight_g int;
alter table products add column if not exists seo_title text;
alter table products add column if not exists seo_description text;
create unique index if not exists products_sku_key on products(sku);

-- Circle early-access sign-ups
create table if not exists circle_signups(
  id uuid primary key default gen_random_uuid(), name text, email text unique, phone text, created_at timestamptz default now());
alter table circle_signups enable row level security;

-- Hindi copy (falls back to English when empty)
alter table collections add column if not exists tagline_hi text, add column if not exists headline_hi text, add column if not exists description_hi text, add column if not exists story_hi text, add column if not exists meaning_hi text;
alter table products add column if not exists tagline_hi text, add column if not exists description_hi text, add column if not exists long_description_hi text;

-- Order language, product video, and admin-managed image slots
alter table orders add column if not exists lang text default 'en';
alter table products add column if not exists video text;
create table if not exists site_images(
  id uuid primary key default gen_random_uuid(), slot text unique, image text, caption text, caption_hi text, active boolean default true);
alter table site_images enable row level security;
alter table pages add column if not exists title_hi text, add column if not exists body_hi text;

alter table collections add column if not exists show_glow boolean default true;

alter table collections add column if not exists wide_banner text;
alter table orders add column if not exists landmark text;
