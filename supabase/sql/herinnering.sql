-- CellarMentor: herinnering per mail (3 sep 2026). Draaien in de SQL-editor van het dashboard.
-- Hoort bij supabase/functions/herinnering/index.ts en het vinkje "Mail mij" in Instellingen.

alter table public.profiles add column if not exists mail_herinnering boolean not null default false;
alter table public.profiles add column if not exists mail_laatst timestamptz;

-- De app zet de voorkeur via deze functie, zodat er geen update-policy op profiles nodig is
-- (daar staan ook plan en tegoed in, en die blijven voor de client gesloten).
create or replace function public.zet_mail_herinnering(p_aan boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Niet ingelogd';
  end if;
  update public.profiles set mail_herinnering = p_aan where user_id = auth.uid();
  if not found then
    insert into public.profiles (user_id, mail_herinnering) values (auth.uid(), p_aan);
  end if;
end;
$$;
revoke all on function public.zet_mail_herinnering(boolean) from public, anon;
grant execute on function public.zet_mail_herinnering(boolean) to authenticated;

-- Wekelijks op zondagochtend. cron rekent in UTC: 08:00 UTC is 09:00 of 10:00 Nederlandse tijd.
-- Vul hieronder dezelfde waarde in als het secret CRON_SECRET van de Edge Function.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule(
  'caveau-herinnering',
  '0 8 * * 0',
  $$
  select net.http_post(
    url := 'https://dbzgrkipcoebglacsqwe.supabase.co/functions/v1/herinnering',
    headers := '{"content-type":"application/json","x-cron-secret":"VUL_HIER_CRON_SECRET_IN"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Handig bij het testen:
--   select * from cron.job;                      -- staat de taak er?
--   select cron.unschedule('caveau-herinnering'); -- weer weghalen
