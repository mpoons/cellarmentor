-- Geheimen in de Supabase Vault (15 sep 2026). Hoort bij braveSleutel() in supabase/functions/ai/index.ts.
-- Waarom: de Brave-sleutel is gezet vanuit een sessie zonder CLI-toegang, en `supabase secrets set` was
-- daar niet mogelijk. De Vault bewaart een geheim versleuteld in de database; deze functie geeft het
-- alleen aan de service role (de Edge Functions). De functie leest eerst de omgevingsvariabele, dus
-- zodra Max de sleutel ooit als echt secret zet, wint die en kan de kluisregel weg.
-- Draaien in: Supabase dashboard → SQL Editor. Veilig opnieuw te draaien. De waarde zelf staat NIET hier:
--   select vault.create_secret('<de sleutel>', 'BRAVE_SEARCH_KEY', 'Brave Search API, zoeklaag prijzen');
create or replace function public.lees_geheim(p_naam text)
returns text language sql security definer set search_path = public, vault as $$
  select decrypted_secret from vault.decrypted_secrets where name = p_naam order by created_at desc limit 1
$$;
revoke all on function public.lees_geheim(text) from public, anon, authenticated;
grant execute on function public.lees_geheim(text) to service_role;

-- Terugweg (down): drop function if exists public.lees_geheim(text);
--                  delete from vault.secrets where name = 'BRAVE_SEARCH_KEY';
