-- CellarMentor Fase 1: profielen (plan/tegoed) + AI-verbruiksregistratie
-- Plakken in: Supabase dashboard → SQL Editor → New query → Run

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',            -- 'free' | 'plus' | 'unlimited'
  bonus_credits int not null default 0,          -- extra gratis acties bovenop het maandtegoed
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
-- schrijven kan alleen via de serverfunctie (service role) of het dashboard

create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'ai',
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.ai_usage enable row level security;
create policy "usage_select_own" on public.ai_usage for select using (auth.uid() = user_id);
create index if not exists ai_usage_user_time on public.ai_usage (user_id, created_at);
