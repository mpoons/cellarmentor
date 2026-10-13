-- CellarMentor meting (v100, 13 okt 2026): de trechter van eerste bezoek tot betaling.
-- Plakken in: Supabase dashboard → SQL Editor → New query → Run. Veilig opnieuw te draaien.
-- Down-migratie: drop view if exists public.trechter_week, public.trechter_bron; drop table if exists public.events;
--
-- Wat erin komt: één rij per gebeurtenis uit de app en de landingspagina's (app_open, scan,
-- aanmeld_ok, betaalmuur, afrekenen …) met een willekeurige bezoekers-id (aid, geen persoonsgegeven),
-- de eerste herkomst (utm_source/medium/campaign/content, of de verwijzer) en een kleine props-JSON.
-- De server voegt 'betaald' en 'opgezegd' toe vanuit de Stripe-webhook.
-- Wie mag wat: iedereen mag invoegen (de app heeft geen sessie nodig om te meten); lezen kan
-- niemand behalve de service role (dashboard, Edge Functions). De checks hieronder begrenzen
-- wat er in een rij past, zodat de tabel geen opslagplek voor willekeurige data wordt.

create table if not exists public.events (
  id    bigint generated always as identity primary key,
  at    timestamptz not null default now(),
  aid   text check (aid is null or aid ~ '^[A-Za-z0-9_-]{6,64}$'),
  uid   uuid,
  name  text not null check (name ~ '^[a-z_]{2,32}$'),
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) < 1500),
  src   text check (length(src) <= 80),
  med   text check (length(med) <= 80),
  cmp   text check (length(cmp) <= 80),
  inh   text check (length(inh) <= 80),
  ref   text check (length(ref) <= 200),
  page  text check (length(page) <= 120)
);
create index if not exists events_at on public.events (at);
create index if not exists events_aid on public.events (aid);
create index if not exists events_name_at on public.events (name, at);

alter table public.events enable row level security;
drop policy if exists events_invoegen on public.events;
create policy events_invoegen on public.events for insert to anon, authenticated with check (true);
revoke all on public.events from anon, authenticated;
grant insert on public.events to anon, authenticated;

-- Trechter per week en per bron (eerste herkomst van de bezoeker). Alleen voor de service role.
create or replace view public.trechter_week with (security_invoker = on) as
with eerste as (
  select distinct on (aid) aid, coalesce(nullif(src, ''), case when ref is not null then 'verwijzing:' || ref else '(direct)' end) as bron, cmp
  from public.events where aid is not null order by aid, at
), per as (
  select date_trunc('week', e.at)::date as week, f.bron, e.aid, e.name, e.props
  from public.events e join eerste f using (aid)
)
select week, bron,
  count(distinct aid)                                                         as bezoekers,
  count(distinct aid) filter (where name = 'app_open')                        as app_geopend,
  count(distinct aid) filter (where name = 'aanmeld_ok')                      as aangemeld,
  count(distinct aid) filter (where name = 'scan' and (props->>'ai')::boolean) as gescand_met_ai,
  count(distinct aid) filter (where name = 'kelder_in')                       as fles_bewaard,
  count(distinct aid) filter (where name = 'betaalmuur')                      as betaalmuur_gezien,
  count(distinct aid) filter (where name = 'afrekenen')                       as afrekenen_gestart,
  count(distinct aid) filter (where name = 'betaald')                         as betaald
from per group by week, bron order by week desc, bezoekers desc;

create or replace view public.trechter_bron with (security_invoker = on) as
select bron, sum(bezoekers) bezoekers, sum(aangemeld) aangemeld, sum(gescand_met_ai) gescand_met_ai,
  sum(betaalmuur_gezien) betaalmuur_gezien, sum(afrekenen_gestart) afrekenen_gestart, sum(betaald) betaald,
  round(100.0 * sum(betaald) / nullif(sum(bezoekers), 0), 2) as pct_bezoek_naar_betaald
from public.trechter_week group by bron order by betaald desc, bezoekers desc;
revoke all on public.trechter_week, public.trechter_bron from anon, authenticated;
