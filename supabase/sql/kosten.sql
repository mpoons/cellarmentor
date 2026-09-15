-- CellarMentor: wekelijks kostenoverzicht (3 sep 2026). Hoort bij supabase/functions/kosten/index.ts.
-- Elke maandag 07:00 UTC (09:00 Nederlandse zomertijd). Het secret staat ook als CRON_SECRET bij de Edge Functions.
create extension if not exists pg_cron;
create extension if not exists pg_net;
do $$ begin
  if exists (select 1 from cron.job where jobname = 'caveau-kosten') then perform cron.unschedule('caveau-kosten'); end if;
end $$;
select cron.schedule(
  'caveau-kosten',
  '0 7 * * 1',
  $$
  select net.http_post(
    url := 'https://dbzgrkipcoebglacsqwe.supabase.co/functions/v1/kosten',
    headers := '{"content-type":"application/json","x-cron-secret":"VUL_HIER_CRON_SECRET_IN"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
