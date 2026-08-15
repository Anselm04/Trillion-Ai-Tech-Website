-- Trillion AI Tech — initial schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  email text,
  language text default 'en',
  currency text default 'usd',
  created_at timestamptz default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('customer','admin')),
  requires_2fa boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  featured boolean not null default false,
  product_type text not null check (product_type in ('download','web_app','agent','tool','software','game')),
  thumbnail_url text,
  demo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  stripe_price_id text unique,
  stripe_product_id text,
  currency text not null default 'usd',
  amount_cents integer not null,
  billing_interval text not null check (billing_interval in ('month','year','one_time')),
  trial_days integer not null default 7,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null check (status in ('trial','active','grace','revoked','canceled')),
  access_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists public.download_grants (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.entitlements(id) on delete cascade,
  storage_path text not null,
  expires_at timestamptz not null default now() + interval '5 minutes',
  download_count integer not null default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.entitlements enable row level security;
alter table public.download_grants enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "public_categories_read" on public.categories for select using (true);
create policy "public_products_read" on public.products for select using (status = 'active');
create policy "public_prices_read" on public.product_prices for select using (active = true);
create policy "entitlements_select_own" on public.entitlements for select using (auth.uid() = user_id);
create policy "download_grants_select_own" on public.download_grants for select using (
  exists (select 1 from public.entitlements e where e.id = entitlement_id and e.user_id = auth.uid())
);

-- Seed categories
insert into public.categories (slug, name, sort_order) values
  ('apps','Apps',1),('games','Games',2),('agents','Agents',3),('tools','Tools',4),('software','Software',5)
on conflict (slug) do nothing;
