-- Streepjescode in de prijstabel (16 sep 2026). Hoort bij supabase/functions/ai/index.ts (eanVan, zoekTreden).
-- Een EAN is een exacte identiteit: wie dezelfde fles onder een andere naam scant, vindt zo toch de rij van een
-- ander. De Edge Function vangt het ontbreken van de kolom op, dus dit is veilig in elke volgorde te draaien.
-- Draaien in: Supabase dashboard → SQL Editor. Veilig opnieuw te draaien.
alter table public.wine_prices add column if not exists ean text;
create index if not exists wine_prices_ean on public.wine_prices (ean) where ean is not null;

-- Terugweg (down): drop index if exists public.wine_prices_ean; alter table public.wine_prices drop column if exists ean;
