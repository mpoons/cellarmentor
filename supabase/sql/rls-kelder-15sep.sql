-- RLS voor cellars en photos, 15 sep 2026. De policies van deze twee tabellen stonden tot nu toe
-- alleen in het dashboard, niet in de repo, dus ze waren niet te controleren. Dit bestand zet ze
-- expliciet: een gebruiker leest en schrijft alleen rijen met zijn eigen user_id, ook bij een
-- upsert waarin de client user_id zelf meestuurt (pushDoc, pushPhotos). Zonder `with check` zou
-- een ingelogde gebruiker met zijn eigen token een rij voor een ánder user_id kunnen schrijven.
-- Draaien met: supabase db query --linked -f supabase/sql/rls-kelder-15sep.sql
-- Controle daarna, met het token van gebruiker A en het uuid van B:
--   curl -X POST "$SB/rest/v1/cellars?on_conflict=user_id" -H "apikey: $KEY" -H "authorization: Bearer $A" \
--     -H "content-type: application/json" -H "prefer: resolution=merge-duplicates" -d '[{"user_id":"<B>","data":{"rev":1}}]'
--   moet 401/403 geven (code 42501), en GET /rest/v1/cellars?select=user_id mag alleen A tonen.
-- Down: drop policy ... voor elk van de acht namen hieronder.
alter table public.cellars enable row level security;
alter table public.photos  enable row level security;
alter table public.cellars alter column user_id set default auth.uid();
alter table public.photos  alter column user_id set default auth.uid();

drop policy if exists cellars_select_own on public.cellars;
drop policy if exists cellars_insert_own on public.cellars;
drop policy if exists cellars_update_own on public.cellars;
drop policy if exists cellars_delete_own on public.cellars;
create policy cellars_select_own on public.cellars for select to authenticated using (auth.uid() = user_id);
create policy cellars_insert_own on public.cellars for insert to authenticated with check (auth.uid() = user_id);
create policy cellars_update_own on public.cellars for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy cellars_delete_own on public.cellars for delete to authenticated using (auth.uid() = user_id);

drop policy if exists photos_select_own on public.photos;
drop policy if exists photos_insert_own on public.photos;
drop policy if exists photos_update_own on public.photos;
drop policy if exists photos_delete_own on public.photos;
create policy photos_select_own on public.photos for select to authenticated using (auth.uid() = user_id);
create policy photos_insert_own on public.photos for insert to authenticated with check (auth.uid() = user_id);
create policy photos_update_own on public.photos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy photos_delete_own on public.photos for delete to authenticated using (auth.uid() = user_id);
