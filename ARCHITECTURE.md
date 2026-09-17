# Architectuur van CellarMentor

Geschreven voor de eigenaar, niet voor een programmeur. Elke term die hieronder cursief staat, wordt uitgelegd in de woordenlijst onderaan. Bijwerken in dezelfde commit als elke structurele wijziging (nieuw onderdeel, nieuwe tabel, nieuwe externe dienst, andere gegevensstroom).

Stand: 16 september 2026, app-versie v87 (drinkvensters: een jaargangtabel per streek die tegen bronnen is gelegd, met per jaar vastgelegd of dat gelukt is; zie JAARGANGEN.md, herijkte bewaarduren en een stand “op z’n rijpst” tussen venster en uitloop). Vorige stand: 15 september 2026, v79 (prijzen: houdbaarheid van 90 dagen met verversing op de achtergrond, zoeken vanuit Nederland; v75 was de hernoeming van Caveau naar CellarMentor, alleen de zichtbare naam, het bronbestand en het adres). Vorige stand: 7 september 2026, v74 (het versienummer staat in `sw.js`), na de fresh review van die dag (`~/Downloads/fresh-review-caveau-2026-09-07.md`).

## 1. Wat het is

**Adres en brug (15 september 2026).** De app staat op cellarmentor.com (GitHub Pages met eigen domein). Daarvoor stond hij op mpoons.github.io, en de browser bewaart de kelder per adres: een kelder die zonder account op het oude adres is opgebouwd, is op het nieuwe adres niet te zien. Daarom draait op het oude adres (mpoons.github.io/caveau/, repo `mpoons/caveau`) dezelfde app als *brug*, met een banner die de weg wijst: inloggen (dan neemt de synchronisatie alles mee, ook foto's) of een back-up bewaren en op het nieuwe adres inlezen. De brug wordt gebouwd door `brug.sh` en blijft staan tot iedereen over is.

CellarMentor is een wijnkelder-app die in de browser draait en zich op een telefoon laat installeren als app (*PWA*). Je scant een etiket, de app herkent de wijn, bewaart hem in je kelder, zegt wanneer je hem moet drinken en welke fles bij een gerecht past. Alles werkt zonder account op het apparaat zelf. Met een account synchroniseert de kelder tussen apparaten en betaalt de app de AI voor je, tegen een maandelijks tegoed (*credits*).

## 2. De onderdelen

Er zijn drie lagen: het apparaat van de gebruiker, de server bij Supabase, en externe diensten die de server aanroept.

### 2a. Op het apparaat
- **De app zelf: `cellarmentor.html`.** Eén bestand met alle opmaak, alle schermen en alle programmacode (± 5.700 regels, zes scriptblokken). `head.html` en `build.sh` wikkelen het in tot `index.html`, het bestand dat GitHub Pages serveert. Er is geen framework, geen bundelaar en geen npm; niets hoeft geïnstalleerd te worden om de app te bouwen.
- **De service worker: `sw.js`.** Een klein programma dat de browser installeert en dat de app offline beschikbaar houdt. Het haalt de app zelf altijd eerst van het netwerk (zodat een nieuwe versie meteen komt) en valt terug op de bewaarde kopie als er geen verbinding is. Lettertypes staan in `fonts/` en worden meegecachet.
- **De gegevens op het apparaat.** De kelder, de historie, de verlanglijst, de locaties en de instellingen staan in één object (`S`) dat als tekst wordt bewaard in de opslag van de browser (*localStorage*, sleutel `caveau_v1`). Foto's zijn te groot daarvoor en staan in *IndexedDB*. Drie reservekopieën (`caveau_backup_daily`, `_prev` en `_prev2`) beschermen tegen een corrupte opslag of een verkeerde sync-keuze. Daarnaast staat er één losse teller `caveau_cam` (hoe vaak de camera openging, voor de iOS-wenk). Zit de opslag vol (± 5 MB), dan gaan de reservekopieën eerst weg, oudste eerst; lukt bewaren dan nog niet, dan blijft er een banner in de kelder staan tot het weer lukt.
- **Wat er in `S` stuurt.** Behalve de kelder zelf: `rev` (revisieteller van dit apparaat), `syncedRev` en `syncedTel` (wat er bij de laatste geslaagde sync stond, voor de sync-beslissing en de krimpbewaking), en instellingen als `taal`, `theme`, `cloud` (sessie en uid), `smaak` (het smaakprofiel, alleen op dit apparaat: het synct niet mee), `prijsAuto`, `deelPrijzen`, `mailMij`, `installWeg`, `lastLocation`, `prijsRondeOp` en `devMode`.
- **Verborgen wegen.** Zeven tikken op de titel van Instellingen zetten de ontwikkelaarsstand aan (eigen Anthropic-sleutel; uitzetten wist hem). De adressen `#privacy` en `#voorwaarden` openen die pagina's direct. `?plus=ok` en `?plus=annuleer` zijn de terugkeer uit Stripe. Een `#access_token=…` in het adres is een bevestigings- of herstelmail van Supabase. De app herkent de claude.ai-sandbox aan de hostnaam (`claudeusercontent.com`) of `window.claude`; daar staan AI en sync uit.

### 2b. Op de server (Supabase, project `dbzgrkipcoebglacsqwe`, datacenter Ierland)
- **Database (Postgres).** Tabellen: `cellars` (per gebruiker één document met de hele kelder plus een revisieteller), `photos` (foto's per wijn), `profiles` (plan, bonuscredits, Stripe-klantnummer, mailvoorkeur), `ai_usage` (elke AI-actie met soort, credits en tokens), `wine_prices` (gedeelde prijstabel, gevuld door de zoekfuncties), `wine_price_log` (letterlijke modelantwoorden; opgeruimd na 30 dagen, telkens als iemand een prijs zoekt, niet op de klok), `wine_paid` (wat gebruikers betaalden, alleen met toestemming), `ai_fouten` (mislukte AI-aanroepen: soort, status, korte foutmelding, geen gebruikers-id, 90 dagen). Elke tabel heeft *RLS*: een gebruiker ziet alleen zijn eigen rijen; `wine_prices`, `wine_price_log`, `wine_paid` en `ai_fouten` hebben geen enkele policy en zijn alleen voor de server zelf.
- **Auth.** Supabase Auth met e-mail en wachtwoord. De app praat rechtstreeks met de auth-endpoints; de sessie leeft een uur en wordt door de app zelf ververst.
- **Edge Functions** (kleine programma's in TypeScript, map `supabase/functions/`):
  - `ai`: alle AI-verkeer. Controleert de sessie, toetst de soort aanroep aan een vaste lijst (`KINDS`), boekt credits, roept Anthropic aan, streamt het antwoord door. Bouwt de prijsopdrachten zelf en negeert daarvoor wat de client stuurt. Elke mislukte Anthropic-aanroep komt in `ai_fouten`.
  - `billing`: maakt een Stripe-afrekenpagina of een link naar het klantportaal.
  - `stripe-webhook`: ontvangt gebeurtenissen van Stripe (betaald, opgezegd) en zet het plan in `profiles`. Geen sessiecontrole, wel een handtekeningcontrole.
  - `herinnering`: wekelijkse mail "drink binnenkort". Aangeroepen door de database-klok (*pg_cron*), niet door een gebruiker; toegang via een geheime header.
  - `kosten`: wekelijkse kostenmail naar Max, met sinds 7 sep ook het aantal mislukte AI-aanroepen per status (401 is een verlopen sleutel). Zelfde beveiliging als `herinnering`.
- **Database-functies (SQL).** `boek_credits` boekt credits in één transactie met een slot per gebruiker, `credits_used_this_month` telt, `zet_mail_herinnering` zet de mailvoorkeur, `lees_geheim` geeft een geheim uit de Vault aan de server (alleen service role). Bestanden in `supabase/schema-fase1.sql`, `schema-fase2.sql` en `supabase/sql/`.

### 2c. Externe diensten (allemaal alleen vanaf de server, behalve waar anders staat)
- **Anthropic** (Claude): etiketten lezen, wijnkaarten lezen, pairing, waardeschattingen, prijzen uit zoekfragmenten lezen, en bij "dieper zoeken" zelf vrij over het web zoeken vanuit Nederland (Sonnet 5, vijf zoekrondes), zoals in claude.ai. In de ontwikkelaarsstand kan de app met een eigen sleutel rechtstreeks naar Anthropic; buiten die stand nooit.
- **Open Food Facts**: alleen bij een gescande streepjescode die nergens te vinden is; er gaat alleen het nummer heen, en er komt een productnaam terug. Vrij, zonder sleutel.
- **Brave Search**: één zoekopdracht per prijsvraag (naam, producent, jaargang), en een tweede zonder jaargang als de eerste niets oplevert. Plafond 400 prijsvragen per dag over alle gebruikers, plus hoogstens 40 verversingen per dag van verouderde rijen in de prijstabel. Werkt alleen zodra de sleutel `BRAVE_SEARCH_KEY` is gezet; tot die tijd doet de zware agent (de zoekfunctie van Anthropic zelf) al het werk.
- **Stripe**: abonnement Plus (€2,99 per maand). Staat in testmodus; `PLUS_TE_KOOP = false` verbergt de koopknop.
- **Resend**: e-mail versturen (herinnering, kostenmail). Nog niet ingericht; zonder sleutel geeft de functie het overzicht als tekst terug.
- **GitHub Pages**: serveert de app vanaf `main`.

## 3. Waar de gegevens staan, en welke persoonlijk zijn

| Waar | Wat | Persoonsgegevens? Waarom? |
|---|---|---|
| Apparaat, localStorage | kelder, historie, verlanglijst, locaties, instellingen, proefnotities | Ja: eigen notities en drinkgedrag. Nodig voor de app zelf. Verlaat het apparaat alleen bij sync of back-up. |
| Apparaat, IndexedDB | foto's van etiketten en locaties | Meestal niet, kan wel (een foto van een kast thuis). |
| Apparaat, localStorage | eigen Anthropic-sleutel (alleen ontwikkelaarsstand), sessietoken | Geheimen. Gaan nooit mee in sync of back-up. |
| Supabase `auth.users` | e-mailadres, wachtwoord-hash | Ja. Nodig om in te loggen. |
| Supabase `cellars` | het hele kelderdocument | Ja, zelfde als lokaal. Nodig voor sync tussen apparaten. |
| Supabase `photos` | foto's | Zie boven. |
| Supabase `profiles` | plan, bonuscredits, Stripe-klantnummer, mailvoorkeur, datum laatste mail | Ja. Nodig voor tegoed, betalen en de herinneringsmail. |
| Supabase `ai_usage` | per AI-actie: gebruiker, soort, credits, tokens, tijd | Ja, gedragsgegevens. Nodig om het tegoed te tellen en kosten te bewaken. |
| Supabase `wine_prices` | wijn, jaargang, prijs, bron, datum, en wie het opzocht | Gebruikers-id alleen intern, om misbruik te herleiden. Prijs is gedeeld. |
| Supabase `wine_price_log` | letterlijk modelantwoord per zoekopdracht | Geen gebruikers-id. Verdwijnt na 30 dagen. |
| Supabase `wine_paid` | gebruiker, wijn, betaald bedrag | Ja, alleen na opt-in. Anderen zien alleen samengevoegde bedragen van minstens twee mensen. |
| Supabase `ai_fouten` | soort aanroep, status, korte foutmelding, tijd | Geen gebruikers-id. Verdwijnt na 90 dagen. |
| Resend (herinneringsmail) | e-mailadres, en van de flessen die aandacht vragen: naam, producent, jaargang, aantal en plek in de kelder | Ja, alleen na opt-in in Instellingen. |
| Stripe | klant, betaalgegevens | Ja, bij Stripe zelf; de app bewaart alleen het klantnummer. |
| Anthropic | wat er per aanroep wordt gestuurd (foto, kelderlijst, gerecht) | Kan notities bevatten. Anthropic bewaart API-verkeer volgens zijn eigen voorwaarden. |

**Exporteren:** Instellingen → back-up (volledig of zonder foto's), een JSON-bestand. **Verwijderen:** Instellingen → Alles wissen wist, met sync aan, eerst de cloud (alle foto's weg, leeg document met een hogere revisie) en pas daarna dit apparaat; lukt de cloud niet, dan wordt er niets gewist. De sessie blijft staan: het account is niet weg, alleen de kelder. Het account zelf (e-mailadres, inloggegevens) verwijderen kan de gebruiker nog niet zelf; de privacyverklaring zegt "mail me". Zie "Wat er nog niet is".

## 4. Hoe een verzoek door het systeem loopt

**Een etiket scannen.** De camera maakt een foto, de app verkleint hem tot 1400 px en stuurt hem naar de Edge Function `ai` (met de sessie van de gebruiker). Die controleert de sessie, boekt één credit in `ai_usage` via `boek_credits`, stuurt de foto naar Anthropic en streamt het antwoord terug. De app vult het formulier al terwijl het antwoord binnenkomt. Mislukt de aanroep of komt er geen tekst, dan wordt de credit weer weggehaald. Het antwoord gaat door `schoonAI()` (alles van buiten wordt genormaliseerd) voordat het in de kelder komt. Zonder account of in de sandbox is er geen AI; dan doen de kelderregels (vaste heuristiek in de app) het werk en zegt de app dat erbij.

**Synchroniseren.** Na elke wijziging bumpt de app de revisieteller en stuurt het hele document naar `cellars` (kelder, historie, verlanglijst, locaties, caches; niet de instellingen, dus ook niet het smaakprofiel). Bij het openen vraagt de app eerst alleen het revisienummer op. De beslissing staat in één functie zonder netwerk, `syncBesluit`: niet welk nummer het hoogst is, maar wie er iets veranderde sinds de laatste geslaagde sync. Uitkomsten: niets, alleen omhoog, alleen omlaag, of een botsing (dan kiest de gebruiker). Krimpt de kelder met meer dan 80 procent, dan vraagt de app eerst of dat de bedoeling is. Foto's gaan los, per stuk. Het cloud-document gaat bij binnenkomst door dezelfde normalisatie als een back-up.

**Een drinkvenster bepalen.** Dit gebeurt helemaal op het apparaat, zonder netwerk en zonder tegoed. Er zijn drie lagen. (1) Een *jaargangtabel* (`STREKEN`, achtendertig streken, elk met een niveau per jaar van moeilijk tot uitzonderlijk) zegt wat een jaar in een streek deed; rood en wit uit de Bourgogne staan apart, want die lopen uiteen. Per jaar staat erbij of het tegen gepubliceerde bronnen is gelegd of nog eigen schatting is, en de app zegt dat ook tegen de gebruiker; de bronnen, de dekking en de werklijst staan in `JAARGANGEN.md`. (2) Een *categorietabel* (`vensterBasis`) zegt hoe lang deze soort fles meegaat, gerekend vanaf de jaargang: een vintage champagne vijfentwintig jaar, een prestige cuvée veertig, geklasseerde Bordeaux en Barolo Riserva vijfendertig, edelzoet vijfenveertig, vintage port vijfenvijftig, een rosé drie. Het jaargangniveau rekt of kort dat (`JAAR_FACTOR`) en verschuift het begin (`JAAR_START`). (3) `windowStatus` zet dat om in een stand: nog te jong, op dronk, drink binnenkort, op z’n rijpst, over de piek. “Op z’n rijpst” is de uitloop ná het venster, en die groeit mee met wat de regels van díeze fles denken, zodat een te kort venster uit een CSV-bestand of van de AI stil wordt opgevangen. Waar het venster vandaan komt staat per fles in `drinkSrc` (regels, etiketscan, bestand of zelf ingevuld) en is in het detail op te vragen. Bestaande kelders worden eenmalig rechtgezet door `vensterMigratie()`, die alleen vensters aanraakt die exact gelijk zijn aan wat de oude formule (`oudVenster`) gaf. Het antwoord van de etiketscan gaat langs dezelfde regels (`ensureWindow`): scheelt het vijf jaar of meer aan de achterkant, dan winnen de regels. De herinneringsmail rekent met dezelfde standen, met één gedocumenteerd verschil (de server kent de jaargangtabel niet en gebruikt alleen de uitloop naar spanwijdte).

**Een gerecht kiezen.** De app stuurt de kelderlijst (tot 100 flessen alles, daarboven een voorselectie) plus het gerecht, de smaakvoorkeuren en de stijlregels naar `ai`. Het antwoord wordt per gerecht bewaard, zodat dezelfde vraag geen tweede credit kost.

**Een prijs opzoeken.** Eerst gratis de gedeelde tabel `wine_prices`. Niets gevonden, of de rij is ouder dan 90 dagen: één credit voor Brave plus Anthropic-Haiku dat de prijs uit de zoekfragmenten leest; de bron-URL komt uit het zoekresultaat, nooit uit het model. De zoeklaag zoekt in een trap (eerst de streepjescode als de gebruiker die heeft gescand, dan precies met jaargang, zonder jaargang, zonder cuvéenaam) op de zoekidentiteit die de scanner meegeeft (de naam waaronder een winkel de fles verkoopt, zonder eigenaarsfamilie of importeur); diezelfde identiteit is de sleutel van de prijstabel. Nog niets: op verzoek vijf credits voor de zware zoekagent (Sonnet 5), die vrij over het web zoekt vanuit Nederland, tot vijf rondes, met een herkansing als de zoekfunctie stoort. De zoekresultaten van Brave gaan gesorteerd naar het model: bekende winkels eerst, folders en retourwinkels achteraan. Elke gevonden prijs gaat na controle in de gedeelde tabel, met de gebruiker die zocht; een link erbij alleen als hij naar een bekende wijnsite (`PRIJS_SITES`) wijst, anders alleen de naam van de bron. De app haalt één keer per dag de tabel op voor de hele kelder (behalve flessen met een zelf ingevulde waarde): zo komt een nieuwer datapunt van een ander bij iedereen aan. Raadpleegt iemand een rij die ouder is dan 90 dagen, dan zoekt de server die daarna op de achtergrond opnieuw op (hoogstens 3 per aanroep en 40 per dag, alleen met Brave-sleutel, geen credit) en vervangt hem alleen als de nieuwe prijs tussen 0,4× en 2,5× de oude ligt.

**Betalen (nog uit).** De app vraagt `billing` om een Stripe-pagina. Na betaling meldt Stripe zich bij `stripe-webhook`, die na handtekeningcontrole en alleen bij status "paid" het plan op Plus zet. Een tijdstempel (`plan_event_at`) voorkomt dat een oude gebeurtenis een nieuwe overschrijft.

**De wekelijkse mail.** De database-klok roept `herinnering` aan met de geheime header. De functie leest de kelders van gebruikers die dat aanzetten, rekent met dezelfde drinkvensterregels als de app en mailt alleen als er iets te melden is, hoogstens één keer per 6,5 dag.

## 5. Beveiliging in één oogopslag

- **Wie mag wat.** Elke Edge Function met gebruikersverkeer eist een geldige Supabase-sessie (`verify_jwt = true`); de gebruikers-id komt uit die sessie, nooit uit wat de client stuurt. De database beschermt zichzelf met RLS. De webhook en de cron-functies staan bewust zonder sessiecontrole en hebben elk hun eigen geheim.
- **Geheimen.** Alle sleutels staan als Supabase-secret, op de Brave-sleutel na: die staat sinds 15 september versleuteld in de Supabase Vault (in de database) en is alleen via een functie voor de server zelf te lezen. In de code staat alleen de publishable key van Supabase, die publiek mag zijn omdat RLS de toegang bepaalt. De eigen Anthropic-sleutel van een gebruiker werkt alleen in de ontwikkelaarsstand en verlaat het apparaat nooit.
- **Invoer van buiten.** AI-antwoorden, back-ups, het cloud-document en CSV-bestanden gaan allemaal door een normalisatie (ids, jaartallen, getallen, links alleen http/https) voordat ze de kelder in mogen.
- **Browser.** Een *CSP* in `head.html` staat de app alleen verbinding toe met Supabase en Anthropic; elke nieuwe externe host moet daar bij, anders wordt hij stil geblokkeerd.
- **Geld.** Credits worden geboekt vóór de AI-aanroep, in één transactie met een slot per gebruiker. Grenzen op bodygrootte, aantal beelden en tekstlengte. Brave heeft een dagplafond. Bij Anthropic staat een uitgavenplafond.
- **Gegevensverlies.** "Alles wissen" vraagt bevestiging, wijst op de back-up, en wist lokaal pas nadat de cloud leeg is. Sync heeft een krimpbewaking en een keuzescherm bij botsingen. Drie lokale reservekopieën, en een blijvende banner als de opslag vol is.

## 6. Wat er nog niet is (en waar de werkregels dus wringen)

- **Weinig tests.** `tests/cellarmentor.test.js` (via `check.sh`, `node --test`, geen framework) laadt de scriptblokken uit `cellarmentor.html` zelf in een kleine browserstub en toetst de pure regels: de sync-beslissing, de krimpbewaking, de normalisatie van buiten, prijssleutel en credits gelijk aan de server, `matchWine`, gerechtherkenning, drinkvensters (standen, uitloop, bewaarduren per categorie, de jaargangtabel en de migratie), het opslagquotum. Alles met een scherm, camera of netwerk wordt met de hand getest in de browser. De stub is de zwakke plek: raakt een scriptblok op topniveau iets nieuws van de browser aan, dan moet de stub mee.
- **Geen staging.** Een push naar `main` is meteen productie.
- **Bijna geen foutmonitoring.** Fouten in de browser van een gebruiker zijn onzichtbaar. Mislukte AI-aanroepen staan sinds 7 sep in `ai_fouten` en in de kostenmail; andere serverfouten alleen in de Supabase-logs.
- **Geen branch-beveiliging** op GitHub en geen CI.
- **Account zelf verwijderen** kan de gebruiker nog niet; het gaat per mail.
- **De SQL voor `cellars` en `photos` staat niet in de repo.** Die tabellen zijn via het dashboard gemaakt; alleen latere tabellen staan als bestand. Bij een herbouw van het project ontbreekt dus een stuk.
- **Geen down-migraties.** SQL-bestanden zijn "vooruit" en worden met de hand gedraaid.
- **Supabase staat op het Pro-plan** (sinds 15 sep 2026, per organisatie): het project pauzeert niet meer en er zijn dagelijkse back-ups van de database (zeven dagen bewaard). Foto's staan in de database (`photos`), dus die zitten in de back-up; Supabase Storage wordt niet gebruikt.
- **De Anthropic-serversleutel verloopt 31 december 2026.**

## Woordenlijst

- *PWA*: een website die zich als app op het beginscherm laat zetten en offline werkt.
- *credits*: het maandelijkse tegoed aan AI-acties (gratis 20, Plus 300). Eén scan is één credit.
- *localStorage* en *IndexedDB*: twee opslagplekken van de browser op het apparaat; de eerste voor tekst, de tweede voor grotere bestanden zoals foto's.
- *RLS* (row level security): regels in de database die per rij bepalen wie hem mag zien of wijzigen. De gebruiker uit de sessie ziet alleen zijn eigen rijen.
- *Edge Function*: een klein serverprogramma dat op verzoek draait, zonder eigen server om te beheren.
- *pg_cron*: de klok in de database die op vaste tijden iets aanroept.
- *CSP* (content security policy): een lijst in de pagina zelf van waar de browser wel en niet verbinding mee mag maken.
- *sessie* / *JWT*: het bewijs dat iemand is ingelogd, een uur geldig, door de app zelf ververst.
- *webhook*: een adres waar een externe dienst (Stripe) iets komt melden.
- *sandbox*: de app als artifact binnen claude.ai, zonder account en zonder AI.
