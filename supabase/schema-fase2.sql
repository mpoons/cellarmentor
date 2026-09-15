-- CellarMentor Fase 2: gewogen credits + Stripe-abonnement
-- Plakken in: Supabase dashboard → SQL Editor → New query → Run
-- (Fase 1 moet al gedraaid zijn; deze query is veilig opnieuw te draaien.)

-- 1. Verbruik wordt in credits geteld, niet in acties.
--    Een etiketscan kost 1 credit, een wijnkaartfoto 2 — zie supabase/ai-function.ts.
alter table public.ai_usage add column if not exists cost_units int not null default 1;

-- 2. Abonnementsgegevens bij het profiel. Alleen de serverfunctie schrijft hierin.
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists plan_renews_at timestamptz;
alter table public.profiles add column if not exists plan_status text;   -- active | past_due | canceled | ...
create index if not exists profiles_stripe_customer on public.profiles (stripe_customer_id);

-- 3. Snel het maandtegoed opvragen zonder alle regels op te halen.
create or replace function public.credits_used_this_month()
returns int
language sql
stable
security invoker
as $$
  select coalesce(sum(cost_units), 0)::int
  from public.ai_usage
  where user_id = auth.uid()
    and created_at >= date_trunc('month', now() at time zone 'utc');
$$;
grant execute on function public.credits_used_this_month() to authenticated;
