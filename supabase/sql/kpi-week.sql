-- CellarMentor: de weekcijfers voor het lanceringsdashboard (alleen lezen, geen wijzigingen).
-- Draaien in de SQL Editor of via de Supabase-koppeling van Claude, na meting-13okt.sql.
-- Eén rij per ISO-week: precies de velden van het formulier "Cijfers per week" in het dashboard.
-- Advertentieklikken en -kosten komen uit Google Ads en Meta, niet uit deze tabel.
with w as (
  select to_char(date_trunc('week', at), 'IYYY-"W"IW') as week, aid, name, props from public.events
)
select week,
  count(distinct aid)                                                           as bezoekers,
  count(distinct aid) filter (where name = 'aanmeld_ok')                        as aanmeldingen,
  count(distinct aid) filter (where name = 'scan' and (props->>'ai')::boolean)  as activatie,
  count(distinct aid) filter (where name = 'betaalmuur')                        as betaalmuur,
  count(*)            filter (where name = 'betaald')                           as betaald,
  (select count(*) from public.profiles where plan = 'plus')                    as betalers_nu
from w group by week order by week desc;
