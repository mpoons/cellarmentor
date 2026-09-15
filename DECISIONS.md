# Besluitenlog

Eén gedateerde regel per keuze die niet vanzelf spreekt, met het alternatief dat is afgewezen. Alleen toevoegen, nooit herschrijven. Nieuwste onderaan. Besluiten van vóór 1 september 2026 zijn achteraf opgetekend; de datum staat dan als "vóór sep 2026".

## vóór sep 2026 · Eén HTML-bestand, geen framework
De hele app staat in `caveau.html`, ook als bron voor de claude.ai-artifactversie. Afgewezen: een build met React of Vue en npm. Reden: nul installatie, het bestand is overal te openen en te publiceren. Prijs: één bestand van 5.700 regels, en syntaxfouten in één blok breken alles (vandaar `check.sh`).

## vóór sep 2026 · Gegevens eerst lokaal, cloud optioneel
localStorage plus IndexedDB is de waarheid; Supabase is een kopie voor sync. Afgewezen: server als enige bron. Reden: werkt zonder account en offline, en een gepauzeerd Supabase-project kost niemand zijn kelder.

## vóór sep 2026 · Supabase als server, publishable key in de code
Postgres met RLS, Auth en Edge Functions in één dienst. De publishable key staat in de code omdat RLS de toegang bepaalt; een geheime sleutel in een browser-app is toch niet geheim. Afgewezen: Firebase (vendor lock-in, geen SQL) en een eigen server (beheer).

## vóór sep 2026 · AI via de server met tegoed, eigen sleutel alleen in de ontwikkelaarsstand
Gebruikers betalen niet zelf bij Anthropic; de server telt credits (gratis 20 per maand, Plus 300 voor €2,99). Een eigen sleutel werkt alleen na zeven tikken op de titel in Instellingen. Afgewezen: iedereen een eigen sleutel laten plakken (te technisch voor familie) en onbeperkt gratis (kosten zonder plafond).

## vóór sep 2026 · Sync als heel document, last-write-wins met keuzescherm
De kelder gaat als één document heen en weer. Afgewezen: sync per wijn (veel complexer, en de kelder is klein). Prijs: bij wijziging op twee apparaten tegelijk moet de gebruiker kiezen.

## 2 sep 2026 · Alles van buiten normaliseren vóór het de kelder in gaat
AI-antwoorden, back-ups en het cloud-document gaan door één stel schoonfuncties. Afgewezen: vertrouwen op het model en op het eigen exportformaat. Reden uit de beveiligingsreview: een vervalst document of een hallucinerend model mag geen rare ids, jaartallen of links kunnen planten.

## 2 sep 2026 · Credits boeken vóór de AI-aanroep, in één transactie
SQL-functie `boek_credits` met een slot per gebruiker; bij een mislukte aanroep gaat de regel weer weg. Afgewezen: achteraf tellen (twee gelijktijdige verzoeken konden dan allebei door bij één credit over).

## 2 sep 2026 · Streamen van AI-antwoorden
Het scanformulier vult zich terwijl het antwoord binnenkomt. Afgewezen: wachten op het hele antwoord. Reden: de wachttijd voelde als een hangende app. Prijs: een afgebroken stroom geeft kapotte JSON, vandaar de herkansing zonder streamen (3 sep).

## 2 sep 2026 · Huisstijl: Maison (licht) en Étiquette (donker)
Gekozen uit zes richtingen. Lettertypes zelf gehost in `fonts/`. Afgewezen: Google Fonts laden (extra externe host in de CSP, en privacy).

## 2 sep 2026 · Prijs van een fles relatief aan de eigen kelder, nooit in absolute klassen
"Een van je duurdere flessen" in plaats van "doordeweeks". Externe scores (Parker enz.) nooit uit het geheugen van het model. Reden: een vaste schaal beledigt de kelder van €5 tot €20, en verzonnen scores zijn overtuigend en fout.

## 3 sep 2026 · Zoekagent voor prijzen op Haiku met vaste sitelijst, 5 credits
Gemeten: ± $0,06 tot $0,14 per fles. Afgewezen: Sonnet met vrij zoeken (te duur) en helemaal geen zoeken (de schatting zat er soms 2,5 keer naast).

## 3 sep 2026 · Geen tweede foto (achteretiket) per scan
Dubbele beeldkosten en een extra stap voor winst die de appellation-kennis van het model meestal al levert.

## 3 sep 2026 · Mailherinnering via pg_cron en Resend, opt-in
Eén Edge Function zonder sessiecontrole, beveiligd met een geheime header. Afgewezen: pushmeldingen (vergt een berichtenserver en app-store-distributie).

## 3 sep 2026 · Eén wijn op één plek
Geen voorraad per plek. Afgewezen: `plekken:{locatie: aantal}` met verhuisknop; raakt kaarten, detail, rekken, afboeken en sync. Randgeval voor nu.

## 4 sep 2026 · Engels als vertaallaag, niet als refactor
Code en teksten blijven Nederlands; een woordenboek plus een MutationObserver vertaalt wat op het scherm komt. Afgewezen: alle teksten door i18n-sleutels vervangen (honderden plekken in één bestand, groot risico). Prijs: elke nieuwe tekst vraagt een woordenboekregel, en wat niet gevonden wordt blijft Nederlands.

## 6 sep 2026 · Geen prijs zonder bron
Een AI-schatting telt niet mee in de kelderwaarde en staat alleen als "indicatie". Afgewezen: de schatting tonen als getal (familietest: "€16 op alles"). Drie lagen: gedeelde tabel (gratis), Brave plus Haiku (1 credit), zware agent (5 credits). Vierde laag (Wine-Searcher API, $250 per maand) wacht op inkomsten.

## 6 sep 2026 · Gemeenschapsprijzen alleen na opt-in en alleen samengevoegd
Tabel `wine_paid` zonder policies (alleen de server), uitschieters weg, tonen vanaf twee gebruikers, overnemen vanaf drie. Reden: privacyverklaring zei tot dan dat er niets werd gedeeld.

## 6 sep 2026 · Aanbieder is Ponsen Polutropon B.V.
Rechtspersoon voor Stripe, Supabase, Anthropic en de app stores. Moneybird van Atelier Marx wordt nooit voor Caveau gebruikt.

## 7 sep 2026 · Werkregels globaal, projectfeiten per repo
`~/.claude/CLAUDE.md` bevat de algemene regels (plannen, kleine wijzigingen, tests als specificatie, begrip bij de eigenaar, productieveiligheid, privacy, rapporteren, verse review). Blok §0 in de repo-`CLAUDE.md` bevat de commando's en de bewuste afwijkingen. `/ship` rapporteert alleen en repareert niets; `/fresh-review` draait in een verse sessie en repareert ook niets. Reden: zodra de sessie die de fout vindt hem ook wegwerkt, vallen "het werkt" en "het is gecontroleerd" weer samen. Afgewezen: alles in één lange projectfile (naleving zakt weg bij lange bestanden) en de commando's als automatisch ladende skills (juist niet door Claude zelf te starten).

## 7 sep 2026 · `check.sh` als lintstap
Syntaxcontrole per scriptblok en samen, typografische aanhalingstekens in tags, en index.html gelijk aan de build. Het is geen testsuite en wordt in rapporten ook niet zo genoemd. Afgewezen: ESLint (vraagt npm, en het bestand is geen module).

## 7 sep 2026 · "Alles wissen" leegt de cloud via de gewone upsert, en houdt de sessie
Met sync aan gaat eerst de cloud leeg (foto's weg, leeg document met een rev boven alles wat de cloud kent), pas daarna het apparaat; mislukt de cloud, dan wordt niets gewist. Afgewezen: een echte DELETE op `cellars` (vraagt een delete-policy die niet in de repo staat en dus niet te controleren is) en uitloggen bij wissen (de gebruiker verliest zijn account niet, alleen zijn kelder). Reden: de privacyverklaring beloofde dit al, en de code deed het niet.

## 7 sep 2026 · Tests laden de app zelf in een browserstub
`tests/caveau.test.js` knipt de scriptblokken uit `caveau.html` en draait ze in `node:vm` met een minimale `document`/`localStorage`/`location`. Afgewezen: de pure functies naar een apart bestand verhuizen (breekt het ene-bestand-principe en de artifact-bron) en een framework met npm. Prijs: de stub moet mee zodra een blok op topniveau iets nieuws van de browser aanraakt. Getest wordt alleen wat puur is; schermen blijven handwerk.

## 7 sep 2026 · Logboek `ai_fouten` in plaats van alleen console.error
Een mislukte aanroep verwijdert zijn eigen verbruiksregel, dus de kostenmail zag een stille week terwijl iedereen "Fout bij de AI" kreeg. Nieuwe tabel zonder gebruikers-id, 90 dagen, en een regel in de kostenmail. Afgewezen: fouten in `ai_usage` laten staan met een vlag (dan tellen ze mee in het tegoed) en een externe monitor (nog een dienst, nog een sleutel).

## 7 sep 2026 · De soort AI-aanroep is een vaste lijst
`kind` was vrije tekst van de client en kwam in de database en in de kostenmail. Nu `KINDS` op de server, anders 400; de test controleert dat elke soort die de app stuurt erin staat. Afgewezen: alleen escapen in de mail (dan blijft de database vrije tekst).

## 15 sep 2026 · Supabase Pro per organisatie, op naam van de BV
De organisatie "Ponsen Polutropon BV" staat op Pro ($25/mnd, spend cap aan). Reden: gratis projecten pauzeren na zeven dagen zonder verkeer en hebben geen back-ups; met betalende gebruikers in zicht is dat geen fundament. Het plan hangt aan de organisatie, dus alles wat Max later host komt als extra project in dezelfde organisatie onder dezelfde factuur (± $10/mnd per extra Micro-instantie). Afgewezen: een keep-alive-ping vanuit een GitHub Action (houdt alleen het pauzeren tegen, geen back-ups, 500 MB-grens, hangt aan een regel die Supabase kan aanscherpen) en een tweede organisatie per toepassing (dubbele vaste kosten).

## 15 sep 2026 · De app heet CellarMentor, de opslagsleutels blijven `caveau`
Zichtbare naam, bronbestand (`cellarmentor.html`), cachenaam, exportbestand, mails en repo (`mpoons/cellarmentor`) zijn hernoemd. De sleutels waaronder de kelder op het apparaat staat (`caveau_v1`, `caveau_backup_*`, `caveau_photos`, `caveau_cam`) blijven, omdat een andere sleutel de kelder van elke bestaande gebruiker onzichtbaar zou maken; het adres blijft op `mpoons.github.io` zodat die opslag (per herkomst, niet per pad) bereikbaar blijft. De Supabase-secrets `CAVEAU_*` en de cron-jobnamen blijven tot de sleutelvervanging van december 2026, omdat de waarde van de Anthropic-sleutel niet uit te lezen is en een hernoeming zonder die waarde de AI stil zou leggen. Afgewezen: sleutels migreren bij het opstarten (nieuw codepad op de gevoeligste plek van de app, zonder winst voor de gebruiker) en meteen naar cellarmentor.com verhuizen (andere herkomst, dus lege lokale opslag voor wie niet synct; eerst de brug uit het verhuisplan).

## 15 sep 2026 · Eigen domein cellarmentor.com, met een brug op het oude adres
De app verhuist naar cellarmentor.com (CNAME op GitHub Pages) nu de testers toch opnieuw moeten installeren na de naamswijziging. Omdat de browser opslag per adres bewaart, blijft op mpoons.github.io/caveau/ dezelfde app draaien als brug (repo `mpoons/caveau`, `brug.sh`), met een verhuisbanner: inloggen of back-up bewaren. Zo raakt niemand een lokale kelder kwijt, ook wie de banner lang negeert. Afgewezen: automatische overdracht via een iframe of popup (browsers scheiden de opslag van ingesloten pagina's, dus onbetrouwbaar) en overdracht via het URL-fragment (te klein voor foto's). Afgewezen: de TransIP-doorstuurservice voor de website (dan blijft het adres in de app github.io en verhuist iedereen later nóg een keer); die service blijft wel nuttig voor mail aan @cellarmentor.com.

