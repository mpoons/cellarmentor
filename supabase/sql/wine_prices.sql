-- CellarMentor-prijstabel: door de zoekagent opgezochte marktprijzen, gedeeld door alle
-- gebruikers. Alleen de Edge Function (service role) leest en schrijft hierin;
-- er zijn bewust geen RLS-policies, dus de client kan er niet bij.
-- Draaien in: Supabase dashboard → SQL Editor.
create table if not exists public.wine_prices (
  key            text primary key,          -- producent|naam|jaargang, genormaliseerd
  name           text,
  producer       text,
  vintage        int,
  value          numeric,
  low            numeric,
  high           numeric,
  source         text,
  url            text,
  vintage_found  int,
  confidence     text,
  note           text,
  hits           int default 0,             -- hoe vaak een scan hiervan profiteerde
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
alter table public.wine_prices enable row level security;
