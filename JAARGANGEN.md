# De jaargangtabel: methode, bronnen en wat er nog niet klopt

Bij dit bestand hoort de tabel `STREKEN` in `cellarmentor.html`. Elk jaar daar heeft een niveau van 1 tot 5, en daarachter kan een teken staan dat zegt **hoe hard dat oordeel is**:

| in de tabel | betekent | wat de app zegt |
|---|---|---|
| `2016:5+` | tegen minstens twee onafhankelijke gepubliceerde bronnen gelegd | "tegen twee onafhankelijke bronnen gelegd" |
| `2016:5*` | op één betrouwbare bron gebaseerd, laag A of B, vindplaats hieronder | "op één betrouwbare bron gebaseerd" |
| `2016:5` | eigen schatting, niet nagetrokken | "nog een eigen schatting, niet nagetrokken" |

Die middelste stand is op 16 september toegevoegd, en de reden is een fout in de eerste opzet. Die kende alleen gecontroleerd of niet, en dat dwong tot weggooien wat één goede bron zei. Dat is verkeerd om: een oordeel uit één terugkijkende proeverij van Vinous is beduidend meer waard dan een gok van een taalmodel, ook al haalt het de lat van twee niet. Weggooien maakt de tabel niet eerlijker, alleen leger. **De regel is: als een goede, betrouwbare bron iets zegt over een streek of een jaar, neem het mee, en zet erbij hoe hard het is.** Een ster eist wel dezelfde discipline als een plus: de vindplaats komt in dit bestand, anders is het geen ster maar een schatting. De app zegt dat verschil per fles tegen de gebruiker, met een vraagteken achter het jaargangwoord en voluit in "Waar komt dit venster vandaan?". Dat onderscheid is de kern van dit bestand: een oordeel dat zich voordoet als gecontroleerd terwijl het dat niet is, is precies de zelfverzekerdheid die een kelderapp onbetrouwbaar maakt.

**Stand: 16 september 2026, na ronde drie. 636 van de 1255 jaren onderbouwd: 421 op twee onafhankelijke bronnen, 215 op één.** Voor ronde drie waren dat er 247 van de 1219, waarvan één op één bron. De sprong komt niet doordat er harder gezocht is maar doordat er meer te lezen viel; zie "Wat ronde drie veranderde" hieronder.

Let op wat dat getal níet meet. Een streek die `streekVan` niet herkent telt hier helemaal niet mee, en erger, een streek die `streekVan` **verkeerd** herkent telt hier als gedekt terwijl de gebruiker een advies uit de verkeerde streek krijgt. Ronde drie vond zes van die gevallen; zie de sectie over streken die de app niet herkent.

## Waarom een eigen tabel, en niet die van een criticus

De ontwerpregel uit `CLAUDE.md` blijft gelden: puntenscores van Parker, Decanter of Hamersma komen nooit in de app. Die hangen aan één fles, zijn redactioneel eigendom van de uitgever, en een taalmodel verzint ze overtuigend. Een jaargangreputatie per streek is iets anders: dat is openbare kennis die in vijf woorden past en die je uit meerdere onafhankelijke bronnen kunt afleiden. Wat we dus doen is lezen wat bronnen kwalitatief over een jaargang zeggen ("uitzonderlijk", "hagel in juni nam een kwart van de oogst", "veel rot, alleen de topproducenten slaagden") en daar zelf een consensusniveau uit vaststellen. Wat we niet doen is een puntenkaart van één uitgever omrekenen naar onze schaal.

Ronde twee trok die regel op tot "de bestaande jaargangkaarten zijn verboden terrein". Dat is te ruim, en ronde drie heeft het teruggedraaid met een meting erbij. Een kaart lézen is niet hetzelfde als een kaart overnemen, en de kaarten van Berry Bros & Rudd en Wine Spectator zijn gemeten tegen de 246 jaren die deze tabel onafhankelijk al had vastgesteld: Berry Bros komt op 47 procent exact gelijk en 92 procent binnen één stap (n=223), Wine Spectator op 55 en 98 procent (n=62). De afwijking loopt op precies waar hun rij breder is dan de onze — Berry Bros' "Italy" tegen ons Piemonte haalt 39 procent en zit zes keer twee stappen mis, hun "Red Bordeaux" tegen onze Bordeaux haalt 78 procent. **De regel die daaruit volgt: een jaargangkaart is een tweede stem, nooit de eerste.** Het niveau komt uit wat een laag-A-bron kwalitatief zegt; de kaart bevestigt of spreekt tegen. Van de 450 bevindingen van deze ronde rust er geen enkele alleen op een kaartcijfer.

Twee methodische lessen uit 16 september staan nog steeds. De officiële jaargangwaarderingen van de streken zelf zijn bruikbaar maar systematisch mild: Ribera del Duero gaf in veertig jaar nooit een onvoldoende, dus die schaal één op één overnemen zou de app te hoog zetten. En de officiële Brunello-sterren zijn na 2020 afgeschaft, dus Toscane heeft voor recente jaren een andere basis nodig.

## De schaal

| niveau | woord in de app | betekenis |
|---|---|---|
| 5 | uitzonderlijk | een van de beste jaren van de generatie |
| 4 | sterk | ruim boven gemiddeld |
| 3 | klassiek | goed, niet bijzonder |
| 2 | wisselend | selectie nodig, veel producenten haalden het niet |
| 1 | moeilijk | misoogst door vorst, hagel, rot of regen |

Een jaar dat niet in de tabel staat geeft niveau 3 zonder woord: "geen mening". Dat is met opzet. Ontbreken is eerlijker dan een gok, en het niveau heeft dan geen effect op het drinkvenster. Dat geldt ook voor een hele streek: `jerez`, `madeira`, `spanje_midden`, `usa_oost`, `canada`, `australie_nsw` en `chili_zuid` staan er wel maar zijn leeg, omdat de app die flessen dan tenminste thuisbrengt en er niets over verzint.

## Dekking per streek

Achtenzestig streken, 1255 jaarvakjes. De teller hieronder komt uit de tabel zelf; `python3 tools/zet-jaargangen.py <bestand>` drukt hem per streek af bij elke ronde, dus hem hier met de hand bijhouden is dubbele boekhouding die gaat afwijken. Deze momentopname staat er omdat de verhouding tussen de kolommen het verhaal vertelt.

| streek | twee bronnen | één bron | schatting | totaal |
|---|---|---|---|---|
| `douro_port` de Douro (port) | 17 | 24 | 2 | 43 |
| `duitsland` Duitsland | 26 | 13 | 0 | 39 |
| `bordeaux` Bordeaux | 37 | 0 | 5 | 42 |
| `sauternes` Sauternes en Barsac | 24 | 11 | 0 | 35 |
| `piemonte` Piemonte | 30 | 1 | 3 | 34 |
| `bourgogne_w` de Bourgogne (wit) | 28 | 2 | 2 | 32 |
| `alsace` de Elzas | 11 | 17 | 0 | 28 |
| `bourgogne_r` de Bourgogne (rood) | 23 | 4 | 2 | 29 |
| `rhone_z` de zuidelijke Rhône | 27 | 0 | 2 | 29 |
| `rhone_n` de noordelijke Rhône | 26 | 0 | 4 | 30 |
| `rioja` Rioja | 26 | 0 | 8 | 34 |
| `loire` de Loire | 24 | 1 | 1 | 26 |
| `toscane` Toscane | 13 | 11 | 7 | 31 |
| `champagne` Champagne | 18 | 0 | 18 | 36 |
| `beaujolais` de Beaujolais | 6 | 11 | 0 | 17 |
| `oostenrijk` Oostenrijk | 3 | 13 | 3 | 19 |
| `veneto` de Veneto | 7 | 7 | 8 | 22 |
| `jura` de Jura en Savoie | 6 | 7 | 1 | 14 |
| `australie_wa` West-Australië | 4 | 6 | 14 | 24 |
| `douro` de Douro (stille wijn) | 10 | 0 | 4 | 14 |
| `provence` de Provence | 6 | 3 | 6 | 15 |
| `ribera` Ribera del Duero en Toro | 9 | 0 | 17 | 26 |
| `argentinie` Argentinië | 0 | 8 | 7 | 15 |
| `languedoc` de Languedoc en Roussillon | 5 | 3 | 4 | 12 |
| `napa` Napa Valley | 8 | 0 | 22 | 30 |
| `priorat` Priorat en Montsant | 2 | 6 | 12 | 20 |
| `australie_za` Zuid-Australië | 1 | 6 | 17 | 24 |
| `chili_centraal` de Chileense centrale vallei | 1 | 6 | 9 | 16 |
| `chili_kust` de Chileense kuststreken | 0 | 7 | 9 | 16 |
| `dao_bairrada` de Dão en Bairrada | 1 | 6 | 5 | 12 |
| `nieuwzeeland` Nieuw-Zeeland | 6 | 1 | 7 | 14 |
| `oregon` Oregon | 3 | 4 | 7 | 14 |
| `sonoma` Sonoma County | 3 | 4 | 23 | 30 |
| `spanje_wit` noordwest Spanje | 3 | 4 | 5 | 12 |
| `sudwest` het zuidwesten van Frankrijk | 0 | 7 | 7 | 14 |
| `australie_vic` Victoria en Tasmanië | 0 | 6 | 17 | 23 |
| `ca_kust` de Californische centrale kust | 5 | 1 | 24 | 30 |
| `washington` Washington State | 2 | 4 | 10 | 16 |
| `zuidafrika` Zuid-Afrika | 0 | 4 | 9 | 13 |
| `alentejo` de Alentejo en het zuiden | 0 | 3 | 9 | 12 |
| `corsica` Corsica | 0 | 2 | 0 | 2 |
| `sicilie` Sicilië | 0 | 2 | 14 | 16 |
| `australie` Australië | 0 | 0 | 22 | 22 |
| `australie_nsw` Nieuw-Zuid-Wales | 0 | 0 | 0 | 0 |
| `ca_noord` de Californische noordkust | 0 | 0 | 30 | 30 |
| `californie` Californië | 0 | 0 | 30 | 30 |
| `campanie` Campanië | 0 | 0 | 16 | 16 |
| `canada` Canada | 0 | 0 | 0 | 0 |
| `chili` Chili | 0 | 0 | 15 | 15 |
| `chili_zuid` Zuid-Chili | 0 | 0 | 0 | 0 |
| `emilia_liguria` Emilia-Romagna en Ligurië | 0 | 0 | 13 | 13 |
| `griekenland` Griekenland | 0 | 0 | 10 | 10 |
| `griekenland_noord` Noord-Griekenland | 0 | 0 | 10 | 10 |
| `griekenland_zuid` de Peloponnesos | 0 | 0 | 10 | 10 |
| `italie_midden` Midden-Italië | 0 | 0 | 13 | 13 |
| `italie_no` Noordoost-Italië | 0 | 0 | 13 | 13 |
| `jerez` Jerez | 0 | 0 | 0 | 0 |
| `lombardije` Lombardije | 0 | 0 | 13 | 13 |
| `madeira` Madeira | 0 | 0 | 0 | 0 |
| `portugal` Portugal | 0 | 0 | 12 | 12 |
| `puglia` Puglia | 0 | 0 | 16 | 16 |
| `santorini` Santorini | 0 | 0 | 10 | 10 |
| `sardinie` Sardinië | 0 | 0 | 16 | 16 |
| `spanje_midden` midden- en zuidoost-Spanje | 0 | 0 | 0 | 0 |
| `tokaj` Tokaj | 0 | 0 | 18 | 18 |
| `usa_oost` het oosten van de Verenigde Staten | 0 | 0 | 0 | 0 |
| `vinho_verde` Vinho Verde | 0 | 0 | 12 | 12 |
| `zuiditalie` Zuid-Italië | 0 | 0 | 16 | 16 |

Streken die nog helemaal op eigen schatting staan: `australie` (de restrij), `californie` en `ca_noord`, `chili` (de restrij), `portugal` (de restrij), `vinho_verde`, `tokaj`, de drie Griekse rijen, `santorini`, en de Italiaanse deelrijen `campanie`, `puglia`, `sardinie`, `zuiditalie`, `italie_no`, `italie_midden`, `lombardije` en `emilia_liguria`. Die laatste groep is de grootste openstaande post van de tabel, en hij is niet aangeraakt omdat er deze ronde geen tijd meer voor was, niet omdat er niets te vinden is: Vinous heeft voor Campanië, Abruzzo, Umbrië, Lazio, de Vulture en Emilia-Romagna elk een eigen reeks jaargangrapporten, en die zijn integraal leesbaar.

## Wat ronde drie veranderde

Ronde twee sloot af met de conclusie dat het onderzoek vastliep op bereikbaarheid: van laag A was alleen Vinous leesbaar, laag B was volledig dicht, en daarom kon er bij vrijwel geen enkele streek een tweede onafhankelijke bron naast Vinous komen. Die conclusie was voor een groot deel onjuist, en de oorzaak is het opschrijven waard. **De hulpfunctie waarmee gemeten werd, stuurde een Chrome-user-agent mee. Decanter, World of Fine Wine en The Wine Society geven op die string 403 en op `curl/8.0` gewoon 200.** Omgekeerd komt ook voor: een paar Spaanse en Italiaanse streeksites doen precies het tegenovergestelde, en La Revue du Vin de France gaf op de ene user-agent 403 en op de andere volledige artikelen. Van de 141 hosts op de lijst bleken er 91 bereikbaar in plaats van elf. De meetregel staat nu in `BRONNEN.md`: **een host is pas afgeschreven als hij op bèide user-agents faalt.**

Wat er daardoor mogelijk werd, in cijfers: **450 bevindingen over 35 streken, met 835 citaten uit elf uitgevers.** De grootste dragers zijn Vinous (394 citaten), Decanter (262), Wine Spectator (63), Mosel Fine Wines (35), World of Fine Wine (33) en La Revue du Vin de France (21).

**Elke bevinding is machinaal nagerekend.** Het onderzoek leverde blokken op met streek, jaar, niveau, URL, bronlaag en een letterlijk citaat van vijf tot dertig woorden; een script haalde daarna élke URL opnieuw op en controleerde of dat citaat er woordelijk in stond. Alle 835 citaten kwamen door die controle; één bevinding viel er aanvankelijk uit (een weggevallen apostrof in "their '06 production") en is na controle van de bron alsnog aangehouden. Dat is geen formaliteit. Een citaat dat niet te vinden is, is precies hoe een verzonnen bron eruitziet, en zonder die stap zou dit bestand niet kunnen beweren wat het beweert.

Twee redactionele regels zijn deze ronde vastgelegd. **Twee stukken van dezelfde uitgever zijn geen twee onafhankelijke bronnen** — dat wordt nu afgerekend op de registreerbare domeinnaam, en het degradeerde onder meer Languedoc 2022 van een plus naar een ster. En **een jaar dat al tegen twee onafhankelijke bronnen lag, draait niet om op één uitgever**; zo'n tegenspraak komt op de werklijst in plaats van in de tabel.

### De verdenkingen van de werklijst, afgehandeld

**Sauternes 1983 stond bovenaan en de verdenking klopt niet.** De werklijst zei dat Decanter het jaar als matig beschrijft, met "little or none of the noble rot". Geen enkele Decanter-pagina zegt dat. Decanters eigen Sauternes- en Barsac-jaargangsgids geeft 1983 de hoogste waardering met "A very late vintage produced some truly classic wines" en "The fine warm conditions of late summer led to the development of a crop of particularly fine botrytis-affected grapes"; The Wine Cellar Insider noemt het "the best vintage for Sauternes" van zijn periode. De enige reserve is een ouder stuk van Clive Coates, "Not all the 1983s are as good as they could have been", en datzelfde stuk noemt 1983 "the first fine Sauternes vintage for seven years". Dat gaat over selectie, niet over gebrek aan edelrot. **1983 blijft 5, nu op drie uitgevers.** Waar het fragment uit ronde een vandaan kwam is niet te achterhalen; de les is dat een fragment zonder vindplaats geen verdenking hoort te dragen die twee rondes blijft staan.

**De echte fout in Sauternes zat elders: 2023 stond op 3 en gaat naar 5.** Decanter kopt "Sheer excellence", Wine Spectator noemt het de beste sinds 2014, World of Fine Wine zet 2023 in één rij met 2005, 2009 en 2015. De hele reeks is bijgewerkt: vijf jaren omhoog (1999, 2011, 2013, 2014 en 2023), tien omlaag (1986, 2002, 2003, 2006, 2007, 2008, 2010, 2016, 2017 en 2019) en 2025 nieuw. Sauternes ging van 2 onderbouwde jaren naar 35 van de 35.

**Piemonte 2004 en 2014 zijn allebei uitgezocht, met tegengestelde uitkomst.** 2004 is níet bevestigd als vroeg verouderend: beide terugkijkende bronnen zijn positief en 5 blijft staan. 2014 is wél bijgesteld, van 2 naar 3, want Vinous noemt de beste 2014's "some of the most thrilling young Barolos I have ever tasted" en meldt in dezelfde adem dat er veel verdund en ondiep is. Daarnaast ging 2018 van 3 naar 2 op drie uitgevers, met het producentensignaal erbij dat Giacomo Conterno tussen 2016 en 2018 geen Monfortino maakte, en 2008 van 4 naar 5.

**De Elzas mist de kruisverificatie niet meer:** 28 van de 28 jaren zijn onderbouwd, elf op twee bronnen. 2000 staat nu op 4 en 2003 nieuw op 2; 2012 blijft 3.

**De Loire heeft zijn oude zoete jaren voor het eerst gedekt, en twee daarvan stonden omgekeerd.** 1996 gaat van 4 naar 5 ("Overall probably the best vintage of the 1990s") en 1997 van 5 naar 4 voor de streek als geheel — waarbij de bronnen erbij zeggen dat het voor zoete Chenin juist andersom is. 1989 is bevestigd op 5, 1990 verlaagd naar 4, en 2019 van 5 naar 4, precies zoals de werklijst vermoedde.

**De Douro is in beide rijen verder gekomen.** Voor port leverde Decanter twee volledige jaargangkaarten van Richard Mayson op, 1960 tot 1999 en 2000 tot 2021, met per jaar lopende tekst; dat zijn tien nieuwe jaren en zes verlagingen (2004, 2005, 2008, 2012, 2021 en 1985). Voor de stille Douro bleek Wine Spectator een aparte kaart "Douro Valley Reds" te hebben, los van de portkaart — de enige bron die de tafelwijn apart beoordeelt, en daarmee de onderbouwing van de splitsing van 16 september. 2009 is daar nieuw op 3: voor port een beperkte declaratie, voor de stille wijn "Balanced wines emerged from a challenging vintage".

**Duitsland ging van 3 naar 39 van de 39**, met Mosel Fine Wines als vierde stem naast Vinous, Decanter en Wine Spectator. Verder, telkens het aantal onderbouwde jaren vóór en na: Bourgogne rood 6 naar 27, Bourgogne wit 15 naar 30, de Elzas 11 naar 28, Toscane 6 naar 24, Piemonte 23 naar 31, de Loire 9 naar 25, Sauternes 2 naar 35, port 17 naar 41. Van nul begonnen en nu onderbouwd: Veneto 14, Beaujolais 17, Oostenrijk 16, de Jura 13, de stille Douro 12, West-Australië 10, Provence 9, Priorat 8, Argentinië 8, de Languedoc van 3 naar 8, het Zuidwesten 7, noordwest-Spanje 7, Nieuw-Zeeland 7, Oregon 7, Sonoma 7, Zuid-Australië 7, de Dão en Bairrada 7, beide Chileense rijen 7, Washington 6, de Californische centrale kust 6, Victoria 6, Zuid-Afrika 4, de Alentejo 3, Corsica 2 en Sicilië 2.

**Corsica en midden-Spanje waren de twee streken die op de werklijst stonden als "bestaat niet en is wel nodig".** Ze bestaan sinds 16 september als lege rij. Corsica is nu niet meer leeg: La Revue du Vin de France bleek leesbaar met de juiste user-agent en heeft volledige streekdegustaties per jaargang, precies voor de streken waar verder niemand over schrijft. Twee jaren zijn daarmee hard te maken, de rest blijft leeg. Midden- en zuidoost-Spanje blijft wél volledig leeg, en dat is na doorzoeken van Vinous, Decanter, World of Fine Wine, Wine Spectator en The Wine Society de juiste uitkomst: het dichtstbijzijnde stuk (Vinous over mediterraan Spanje) wordt volgens zijn eigen tekst gedomineerd door Catalonië en zegt niets over La Mancha, Valdepeñas, Madrid, Gredos of Málaga. Wie die rij ooit versmalt tot Levante en Murcia, kan 2015, 2016 en 2018 wél onderbouwen.

### Een grens die de tabel niet kan trekken: premox

De witte Bourgognes van 1995 tot 2003 staan laag omdat premature oxidatie de bewaarduur halveert. Ronde drie vond dat de bronnen de **kwaliteit bij release** van juist die jaren hoog inschatten: Decanter geeft 1995 en 1996 de hoogste waardering, 1997 en 1998 een ruime voldoende. Dat is geen tegenspraak maar een botsing tussen twee dingen die deze tabel met één getal beschrijft. Het niveau stuurt in de app zowel het wóórd dat de gebruiker leest als de **jaargangfactor op het drinkvenster**. Die jaren omhoog zetten zou het venster verlengen op precies de flessen met het grootste risico, en dat is voor een kelderapp de verkeerde kant op. **Het besluit van ronde een blijft daarom staan en de premoxjaren zijn ongemoeid gelaten**, met deze aantekening erbij, omdat de volgende ronde hier een echte keuze heeft: een apart risicoveld naast het niveau, of accepteren dat het niveau bij deze jaren over de fles gaat en niet over de oogst.

## Bereikbaar is niet hetzelfde als toegestaan

Ronde drie mat welke hosts opengingen en ging toen aan het lezen. Dat is een stap overgeslagen, en
die is er achteraf bij gekomen: wat zegt de uitgever er zélf van. Per bron nagekeken in hun
`robots.txt` en in de notities onder hun artikelen. Drie soorten antwoord, en drie manieren om
ermee om te gaan; de volledige uitwerking staat in `BRONNEN.md`.

**Wine Spectator weigert AI-verkeer en is daarom uit het onderzoek gehaald.** Hun `robots.txt` zet
`User-agent: ClaudeBot` op `Disallow: /`, en hetzelfde voor `Anthropic-Client`. Daar is geen omweg
voor die deugt. Dat kostte wat: 24 jaren verloren hun hele onderbouwing en 22 zakten van twee
bronnen naar één, geconcentreerd in de stille Douro, de Loire rond 2002-2013 en Sauternes
2016-2020. Een herstelronde langs de bronnen die het wél toestaan heeft er 23 van de 24 alsnog
onderbouwd; alleen `douro` 2022 is terug naar "geen mening", en `douro` 2021 is er om een andere
reden uit gehaald — het enige bewijs was dat het jaar binnen het bereik viel van een proeverij over
acht jaargangen tegelijk, en dat is een plaatsing en geen jaargangoordeel.

**Vinous wordt genoemd maar niet geciteerd.** Onder elk artikel staat "No portion of this article
may be copied, shared or redistributed without prior consent from Vinous". De app toont bij die
jaargangen de uitgever en een link naar het stuk, en niet hun zin. Van de 448 vindplaatsen in de
app zijn er 238 op die manier stil. Bij de overige uitgevers staat een kort citaat met
bronvermelding en link, hooguit één per streek-jaargang.

**De regels staan in de code, niet alleen hier.** `tools/zet-bronnen.py` weigert Wine Spectator,
`CITAAT_STIL` in `cellarmentor.html` houdt bij wie wel genoemd maar niet geciteerd wordt, en
`tests/cellarmentor.test.js` controleert allebei. Een regel die alleen in een document staat,
sneuvelt bij de eerste ronde die het document niet leest.

## Wat de bronnen naast een niveau nog meer zeggen

Het jaargangniveau is niet het enige dat uit deze bronnen te halen valt, en twee andere dingen zijn
deze ronde in de app gezet. Allebei komen ze uit `bronnen/bevindingen.json` en
`bronnen/producenten.json` via `tools/zet-bronnen.py`, zodat de app en het dossier niet uit elkaar
kunnen lopen.

**Rijpheid per streek en jaargang.** Berry Bros zet bij elk jaar een rijpheidscode (Not ready,
Ready – youthful, Ready – at best, Ready – mature) en Decanter een woord (Keep, Drink now, Drink
soon). Samen 702 jaren over zeventien streken, waarvan er 702 in de controle hieronder zitten. De
tabel wordt **maar één kant op gebruikt**: hij mag verhinderen dat de app "Over de piek?" zegt, en
nooit een venster inkorten. Dat is geen willekeur maar de risicokeuze die dit bestand al maakte: te
vroeg "over de piek" roepen laat iemand een goede fles weggooien, terwijl een fles die volgens de
app nog kan wachten bij de eerste slok gecontroleerd wordt.

**En elke uitspraak telt vanaf het jaar waarin hij is gedaan.** Dat klinkt vanzelfsprekend en was
het niet. De kaart van Berry Bros is van 2026 en gaat over nu; de jaargangsgidsen van Decanter niet.
154 van de gedateerde regels komen uit gidsen die voor het laatst in 2015 zijn herzien, en hun
"Keep" bij een 1997 ging over een wijn van achttien jaar — niet over een wijn van negenentwintig.
Elke regel draagt daarom een peiljaar, en de app rekent uit tot welke leeftijd de uitspraak reikt:
de leeftijd bij het schrijven plus het deel van het drinkplateau dat er toen nog lag (heel bij "nog
niet toe", 0,7 bij "jong maar open", 0,4 bij "op z'n best"). De lengte van dat plateau komt uit het
venster van de fles zelf, zodat een port anders wordt doorgerekend dan een Sancerre. Reikt de
uitspraak niet tot vandaag, dan onderdrukt hij niets meer. Zei de bron juist dat de tijd drong,
dan bevestigt hij de waarschuwing in plaats van hem te negeren.

Botsen twee bronnen, dan wint sinds deze ronde **de jongste waarneming**, en pas bij een gelijk
peiljaar de stand die de wijn het meeste leven geeft. Dat corrigeerde 25 streek-jaargangen die als
actueel werden behandeld terwijl de jongste bron iets anders zei: zes in Bordeaux, acht in de rode
Bourgogne, vijf in de witte, en zes in Zuid-Afrika waar Decanter in 2015 "Keep" schreef en Berry
Bros de wijn in 2026 rijp noemt. Wat overblijft zijn achttien onderdrukte waarschuwingen —
Argentinië 2001, Bordeaux 1982, 1986, 1988 en 1994, witte Bourgogne 2000, de Loire 1985, 1988 en
1989, Washington 1999, 2000, 2002, 2003 en 2006, en Zuid-Afrika 2001, 2003, 2004 en 2005 — waarvan
er dertien op een bron van dit jaar rusten en vijf op een Decanter-gids uit 2015 of 2019 die ver
genoeg vooruit reikt. Dat verschil staat nu ook op het scherm: "Berry Bros & Rudd noemt 1982 in
Bordeaux nu op z'n best" tegenover "Decanter noemde 1999 in Washington State in 2015 nog niet op
dronk". De lezer ziet het jaartal en kan zelf wegen.

**Een tweede val bij dezelfde bron.** De publicatiedatum van die gidsen is onbruikbaar: bij 270 van
de 277 is `article:published_time` gelijk aan de jaargang die de gids bespreekt, want Decanter heeft
ze teruggedateerd. Een gids over 1962 draagt 1962 als publicatiejaar. Alleen
`article:modified_time` zegt iets, en die staat voor 240 gidsen op 2015.

**Eén vertaalfout hoort hier vastgelegd, want hij was niet zichtbaar in de code maar wel in de
uitkomst.** In de eerste opzet werd Decanters "Drink now" gelezen als "op z'n best". De controle
liet toen 98 onderdrukte waarschuwingen zien in plaats van 25, met Bordeaux 1963, 1965 en 1972
erbij — beruchte rampjaren. Bij Decanter staat bij Bordeaux 1965 ("A disastrous year") exact
hetzelfde woord als bij een rijp topjaar: "Drink now" betekent daar "drink hem op", niet "dit is
zijn hoogtepunt". Alleen "Keep" en de keep-drink-mengvormen zijn ondubbelzinnig; de rest telt nu
als rijp en onderdrukt niets. De les is algemener dan deze tabel: een woord uit een bron overnemen
zonder te toetsen wat het in de uiterste gevallen betekent, geeft precies het soort stille fout dat
dit bestand moet voorkomen. De toets die het ving was simpel — tel wat de regel verandert en kijk
of die lijst er geloofwaardig uitziet.

**Producenten die een criticus bij de besten noemt.** Decanters jaargangsgidsen zetten per jaar een
lijst "Best Producers" of "Best wines": 2239 vermeldingen over 226 jaargangen in elf streken —
Bordeaux, Sauternes, beide Bourgognes, Duitsland, port, Piemonte, Toscane, Rioja, Washington en
Zuid-Afrika. Dat is iets anders dan een puntenscore — het is een
lijst namen uit een gepubliceerde gids, geen cijfer aan één fles — en het is wat de app in staat
stelt te zeggen dat Decanter Château Climens bij de beste wijnen van 1988 noemt. De koppeling is
streng: streek én jaargang moeten al kloppen, en de naam moet in de producent of de wijnnaam staan
en niet in de appellation. Dat laatste is nodig omdat anders elke fles uit Margaux zou matchen op
château Margaux. De lijsten dekken vooral 1960 tot 2008, want Decanters recente jaargangstukken
hebben dat blok niet; voor oude flessen is het juist daar het meest waard. Vinous heeft voor recente
jaargangen vergelijkbare lijsten, maar die mogen we niet overnemen: wel naar linken, niet citeren.

**Welke uitspraken verouderen en welke niet.** Dat onderscheid loopt door dit hele onderdeel heen.
Dat een jaargang warm was, of dat een producent dat jaar tot de besten werd gerekend, blijft waar
zolang het waar was; zulke zinnen gaan ongewijzigd mee, met het jaartal erbij. Een uitspraak over
rijpheid gaat over de wijn zoals die was toen het stuk verscheen, en moet worden doorgerekend. Van
de 448 citaten bevatten er maar drie rijpheidstaal, dus die scheiding kostte bijna niets — maar het
is wel de reden dat die drie niet onder een fles staan en in het blad erachter met het aantal jaren
dat erbij hoort.

**En wat er wél in stond, maar er niet in hoorde.** De vorige versie van dit onderdeel toonde in elf
citaten precies het cijfer dat deze app niet overneemt: "Languedoc 2022 vintage rating: 4.5 / 5",
"Barossa Shiraz 2023 vintage rating: 4/5", en rijen als "2023 4/5 2022 3/5 2021 5/5". Vijf andere
"citaten" waren wijnnamen uit een kop — "Sogrape Casa Ferreirinha Barca Velha 2011 Douro, Portugal"
— die onder een fles lezen als een oordeel dat er niet is. De keuze lette op bronlaag en zinslengte
en niet op wát er stond. Dat is nu een filter met een test eronder: minstens vijf woorden, geen
cijferpatroon, niet meer dan 55% hoofdletterwoorden, hoogstens twee jaartallen. Twintig van de 448
streek-jaargangen raakten daarmee hun citaat kwijt, en dat is de goede ruil. Berry Bros' cijfers en
Decanters `x/5` zijn gelezen om er een eigen oordeel uit af te leiden, en staan niet in de app.

## Getoetst aan een catalogus in plaats van aan eigen voorbeelden

De dekkingstabel hierboven telt cellen in onze eigen tabel. Dat zegt niet wat iemand met een kelder
merkt, want een kelder is niet gelijkmatig over streken en jaren verdeeld. De catalogus van Berry
Bros die al voor het prijswerk was opgehaald bevat 18.675 echte wijnnamen met jaargang, en die is
als proef gebruikt: elke naam als fles door `streekVan`, `jaargangOordeel`, `rijpheidVan`,
`citaatVan` en `genoemdDoor`.

| | aandeel |
|---|---|
| streek herkend | 97,5% |
| jaargangoordeel | 94,8% |
| daarvan tegen twee onafhankelijke bronnen | 70,7% |
| gepubliceerde uitspraak over rijpheid | 68,3% |
| vindplaats of citaat | 62,2% |
| zin die we mogen tonen | 42,6% |
| producent bij de besten genoemd | 0,4% |

Per jaargangblok is het beeld scheef, en precies omgekeerd aan waar het nodig is:

| jaargang | dubbel onderbouwd | rijpheid | citaat |
|---|---|---|---|
| 1960–1989 | 13% | 38% | 23% |
| 1990–1999 | 51% | 66% | 44% |
| 2000–2009 | 71% | 76% | 51% |
| 2010–2019 | 65% | 64% | 45% |
| 2020–2025 | 82% | 73% | 34% |

Een oude fles is nu juist waar iemand niet zelf weet of hij nog goed is. Dat blok is deze ronde van
4% naar 23% citaatdekking gegaan door de jaargangsgidsen van Decanter erbij te halen, maar de
dubbele onderbouwing blijft er 13%. Dat is het eerste wat een volgende ronde moet aanpakken.

**Twee fouten die geen eigen steekproef had gevonden.** Van de 661 namen die buiten elke streek
vielen, viel 170 alleen op de schrijfwijze: "St Joseph", "Nuits St Georges", en "Ermitage" zoals
Chapoutier zijn Hermitage schrijft. En ernstiger: `saint georges` stond als Bordeaux-trefwoord,
want Saint-Georges-Saint-Émilion is een satelliet, en Bordeaux staat eerder in de tabel. Daardoor
kreeg **Nuits-Saint-Georges een Bordeaux-drinkadvies** — 41 flessen in die ene catalogus, en
Nuits-Saint-Georges is geen obscure appellatie. Een sweep die elk trefwoord van elke streek tegen
alle latere streken legt vond nog drie: Saint-Georges-d'Orques in de Languedoc, Conca de Barberà
onder Piemonte, en `montagne`, dat elk domein met dat woord in de naam naar Bordeaux trok. Dat
laatste trefwoord is geschrapt: elk etiket van Montagne-Saint-Émilion draagt `saint emilion` al.

**Wat de gidsen van Decanter wel en niet mogen leveren.** Die gidsen geven per streek en jaargang
een cijfer x/5 én een zin, en voor 231 streek-jaargangen zegt onze tabel niets terwijl de gids er
wel is. Het cijfer overnemen is getoetst en afgewezen. Tegen de 98 jaargangen die al tegen twee
onafhankelijke bronnen liggen komt een afleiding uit cijfer plus zin op 47% precies en 89% binnen
één stap; op de gevallen waar cijfer en zin allebei uitgesproken zijn op 73% en 96%. Dat is te
weinig voor een sterretje, dat immers zegt dat een betrouwbare bron dít niveau draagt. De ijking
laat ook zien waarom: hun zinnen gaan vaak over een deel van de oogst ("some classic wines", "the
finest wines were rich") of over één fles ("Petrus was the wine of the vintage and is still
magnificent", bij drie sterren). En vijf van de tien grootste missers zijn de premox-jaren in de
witte Bourgogne, waar ons lagere niveau juist bewust afwijkt van wat er in 2015 werd geschreven.
De zinnen zelf worden wel getoond, met vindplaats en jaartal, en het oordeel blijft "geen mening".

## Hoe onafhankelijk is een bron eigenlijk

Dit is de vraag die de tabel maakt of breekt. Een promotie-organisatie van een wijnland of een streek verklaart een jaargang vrijwel nooit slecht, want het is hun eigen sector. Het harde bewijs staat in de Ribera del Duero-reeks: het Consejo Regulador gaf in veertig jaar nooit een "Deficiente" en maar twee keer "Regular". Tegelijk is Rioja het tegenvoorbeeld, want dat Consejo varieert zijn oordeel wel degelijk. De regel is dus niet dat je ze niet gebruikt, de regel is waarvoor je ze gebruikt.

**Laag C, feiten en nooit de beslissende stem.** Promotie-organisaties en consejos zijn uitstekend en vaak gezaghebbend voor wat controleerbaar is: opbrengsten, neerslag, vorstdata, hittegolven, ziektedruk, startdatum van de oogst, hoeveel procent de oogst kromp. Dat zijn feiten waar ze geen belang bij hebben ze te verdraaien. Gebruik ze daarvoor, en laat het kwaliteitsniveau altijd door minstens één belangeloze bron bepalen.

**Laag B, beslissende stem met korrel zout.** Handelaren met een lange publieke jaargangstaat (Berry Bros & Rudd, Farr Vintners, Justerini & Brooks, The Wine Society, iDealwine) willen verkopen, maar hun staat kost hen reputatie als hij niet klopt en ze zetten jaren wel degelijk lager. Behandel hun láge oordelen als een sterk signaal en hun hoge met terughoudendheid.

**Laag A, beslissende stem.** Critici met terugkijkende proeverijen en specialisten met een lange reeks: Vinous, Decanter, World of Fine Wine, Wine Spectator, Mosel Fine Wines, La Revue du Vin de France, James Suckling, drinkrhone.com, The Wine Cellar Insider.

**En sinds ronde drie: twee stukken van dezelfde uitgever zijn geen twee onafhankelijke bronnen.** Dat klinkt vanzelfsprekend en het ging bijna mis, want een streek waar één uitgever twee artikelen over heeft is precies een streek waar de tweede stem ontbreekt. Het wordt nu afgerekend op de registreerbare domeinnaam.

Drie regels die hieruit volgen en die elke ronde weer opgaan.

**Geef een terugkijkende bron voorrang op een en-primeur-bron.** Een jaargang die tien jaar later opnieuw is geproefd is veel betrouwbaarder, en voor een kelderapp is juist dat wat telt. Deze ronde leverde daar een schoolvoorbeeld van op: het oogstbericht over Argentinië 2023 sprak van "unprecedented balance", terwijl de terugblik van drie jaar later "the tannins turned out compressed and somewhat rustic" noteert. Ook Washington 2022 draaide om: "Though the 2022s underwhelmed me in 2024" leidde tot een hogere waardering, niet een lagere.

**Het eerlijkste signaal dat er bestaat is de beslissing van de producent zelf.** Of de porthuizen declareerden, of een huis zijn topwijn maakte: dat zijn kostbare keuzes die niemand om marketingredenen maakt. Deze ronde droeg dat signaal onder meer Veneto 2014 (Bertani maakte geen Amarone), Piemonte 2018 (Conterno maakte drie jaar geen Monfortino), de Alentejo 2011 en 2017 (Torre do Esporão is sinds 2004 vier keer uitgebracht), Bairrada 2014 en Zuid-Afrika 2023 (Rustenberg en Taaibosch brachten hun topcuvées niet uit).

**Opbrengstverlies is geen kwaliteitsverlies.** Dat is nu vier rondes achter elkaar de val geweest waar het onderzoek in dreigde te lopen. Als een bron alleen over hagel, droogte, vorst en hectoliters gaat en niets over de wijn zegt, is "geen mening" het antwoord. Deze ronde is de val bewust vermeden bij de hagel in Valpolicella 2020, bij de gehalveerde oogsten in Toscane 2023, bij de vorst in het Zuidwesten 2019 en bij de droogte in Chili 2024 — en hij werkt ook de andere kant op: Bourgogne wit 2023 was juist een **grote** oogst, en dat pakte voor chardonnay goed uit omdat die druif niet opbrengstgevoelig is.

## Wat bronnen zeggen over deelgebieden en kleuren die uiteenlopen

De opdracht van deze ronde was om dit te rapporteren in plaats van vooraf te beslissen. Dit is wat er gevonden is, met de streek erbij die het raakt. Niets hiervan is uitgevoerd; het is de onderbouwing voor de volgende splitsingsronde.

**Australië is het duidelijkst, en de splitsing van 16 september is daarmee achteraf gerechtvaardigd.** Vinous benoemt het zelf over 2011: "it's inevitable that these wines will be ignored by too many consumers who think that all Australian wine regions suffered from bad luck in 2011". Zuid-Australië en Victoria staan dat jaar op 1, West-Australië op 4. In 2009 brandde Victoria (Black Saturday) terwijl hetzelfde artikel 2009 "strong in Western as well as South Australia" noemt. In 2020 werd in Beechworth en de Alpine Valleys helemaal geen wijn gemaakt door rook, terwijl Margaret River "the best of recent years" had. In 2023 staat Margaret River op 5 en Victoria op 2. **Binnen Zuid-Australië loopt het ook uiteen** (Barossa 2021 boven 2022, McLaren Vale precies andersom), en **Tasmanië loopt af van Victoria** (2024 is daar "the star"). Een aparte rij voor Tasmanië is de volgende logische stap.

**Californië 2020 is per gebied een compleet ander jaar,** en de rij `ca_kust` hoort dat jaar hóger te staan dan `sonoma` in plaats van lager. Santa Barbara leverde "the finest wines in California in 2020 by a wide margin"; Paso Robles kwam er met selectie doorheen; de Santa Lucia Highlands verloren de oogst; Sonoma kreeg volgens Decanter 2 van de 5 en volgens Vinous "a very high degree of variability". Dat is meteen een correctie op de aanname van 16 september dat de valleivloer van Sonoma gespaard bleef: voor pinot noir gold dat niet.

**Oregon 2020 loopt uiteen per kleur en per deelgebied.** Vrijwel alle witte druiven waren al binnen toen de rook viel, en het uiterste noordoosten (The Rocks District) volgt de jaargangen van oostelijk Washington in plaats van die van de Willamette.

**Toscane 2023 is de verdenking die klopte.** Vinous over Chianti Classico: "2023 is a highly inconsistent vintage", met opbrengsten 30 tot 50 procent lager. Vinous over de kust, inclusief Bolgheri: "I see 2023 as stronger across the board than 2022". Ook 2005 en 2020 lopen kust en binnenland uiteen. Toscane 2023 op één getal is dus alleen als gemiddelde juist.

**Duitsland loopt droog tegen zoet uiteen,** zoals de vorige ronde al vermoedde, en Mosel Fine Wines is de enige bron die beide apart weegt. De app onderscheidt droge en restzoete riesling al in `vensterBasis`, dus de tabel kan meteen mee.

**De Bourgogne loopt rood tegen wit uiteen in minstens tien jaargangen,** en niet altijd dezelfde kant op: wit boven rood in 2008, 2014, 2017, 2020, 2023 en 2024, rood boven wit in 2018 en 2019, en in 2003 en 2021 zijn de bronnen het onderling oneens. De app heeft die twee al apart, dus dit is geen splitsing maar een aansporing om beide rijen los te blijven onderzoeken. **Chablis wijkt af van de Côte d'Or** en heeft geen eigen rij.

**De Loire loopt uiteen tussen droog, zoet en rood,** en 1996 tegen 1997 is het scherpste voorbeeld: 1996 is sterker voor droge wijn, 1997 voor zoete Chenin. In 2007 en 2010 lopen de druiven ver uiteen, en in 2019 en 2023 is er nauwelijks zoete wijn gemaakt.

**Verder gemeld, per streek:** Sauternes tegen Barsac in 1989, 2010, 2012 en 2016; de Jura tegen Savoie (2021 was "Annus horribilis" in de Jura en "un millésime de référence" in Savoie); Jura wit tegen rood in 2021 en 2022, in tegengestelde richting; de Languedoc per appellation in 2022 en per kleur in 2023; het Zuidwesten tussen Cahors en Madiran in 2022; Chili kust tegen centrale vallei in 2017, 2021, 2022 en 2023, met een producentencitaat dat het samenvat ("I've never seen so many variations in the same year"); de Dão tegen Bairrada en de Dão tegen de Alentejo; noordwest-Spanje, waar `spanje_wit` vijf streken vangt die in 2016 en 2017 aantoonbaar niet hetzelfde deden; Sicilië, waar de Etna en het zuidoosten in 2023 tegengesteld liepen; en de Veneto, waar het jaargangoordeel volgens Vinous op Soave wordt gevormd en naar Valpolicella geëxtrapoleerd terwijl Amarone pas drie tot vier jaar later vrijkomt.

## Een gat dat geen jaargangonderzoek is: streken die de app niet herkent

Naast "welk jaar is gecontroleerd" speelt een tweede vraag die de tabel stil kan laten falen: herkent `streekVan` de fles überhaupt, en herkent hij hem góéd? Zo niet, dan is er geen oordeel of een verkeerd oordeel, en in beide gevallen zegt de app niet dat er iets mis is.

Op 16 september zijn 299 veelvoorkomende appellations door `streekVan` gehaald, ruim twee keer zoveel als de ronde ervoor, en deze keer is ook gecontroleerd wáár ze uitkomen en niet alleen dát ze ergens uitkomen. **Dat tweede deel leverde zes echte fouten op, en die zijn erger dan de veertien missers.**

| wat er misging | waarom | hoe het is opgelost |
|---|---|---|
| Mornington Peninsula (Australië) en Niagara Peninsula (Canada) kwamen uit op de Alentejo | het trefwoord `peninsula` stond er voor Península de Setúbal | trefwoord toegespitst op `peninsula de setubal`, en `alentejano` toegevoegd |
| Quinta do Vesuvio, een Douro-porthuis, kwam uit op Campanië | het trefwoord `vesuvio` | vervangen door `lacryma christi` |
| elke oranjewijn kwam uit op Nieuw-Zuid-Wales | het trefwoord `orange` voor de streek Orange | vervangen door `new south wales` |
| Vega Sicilia, de bekendste Ribera del Duero, kwam uit op Sicilië | ` sicilia ` staat letterlijk in ` vega sicilia ` | uitzondering `niet:['vega sicilia']` op de rij Sicilië |
| Alicante Bouschet, een gangbare druif in de Alentejo en de Douro, kwam uit op zuidoost-Spanje | het trefwoord `alicante` voor de DO Alicante | uitzondering `niet:['alentejo','alentejano','douro','portugal']` |
| Entre-Deux-Mers kwam nergens uit | ontbrak | toegevoegd aan Bordeaux |

Voor de laatste twee is er een nieuw veld bijgekomen: **`niet:[...]` op een rij in `STREKEN` sluit die rij uit zodra een van die woorden in de herkomsttekst staat.** Dat is bewust geen slimme oplossing maar een expliciete: een trefwoord dat op zichzelf klopt maar botst met één beroemde naam, krijgt die naam als uitzondering, en de reden staat in het commentaar erbij. De twaalf gevallen uit de tabel hierboven plus zes gewone gevallen staan nu als test in `tests/cellarmentor.test.js`, zodat ze niet terug kunnen komen.

Wat er overblijft is veertien appellations zonder streek, en dat zijn allemaal landen zonder rij: Zwitserland, Engeland, Libanon, Georgië, Israël, Uruguay, Texas en Arizona, plus `Vin de France` en `IGP Pays d'Oc`, die per definitie geen streek hebben. Een lege rij voor die landen zou de fles thuisbrengen zonder iets te verzinnen, net als `jerez` en `madeira` nu; dat staat op de werklijst.

Deze controle hoort periodiek te draaien en kost geen bronnen, alleen een lijst appellations tegen `streekVan`.

## Wat als eerste moet worden nagetrokken

De werklijst van ronde twee is afgewerkt op twee punten na, die hieronder terugkomen. Dit is de nieuwe lijst, op volgorde van belang.

1. **De acht Italiaanse deelrijen staan nog volledig op de geërfde schatting van 16 september**: `campanie`, `puglia`, `sardinie`, `zuiditalie`, `italie_no`, `italie_midden`, `lombardije` en `emilia_liguria`, samen ruim honderd jaarvakjes. Dit is verreweg de grootste openstaande post, en hij is haalbaar: Vinous heeft voor Campanië, Abruzzo, Umbrië, Lazio, de Vulture, Sicilië en Emilia-Romagna elk een eigen reeks jaargangrapporten, allemaal integraal leesbaar. Begin bij `https://v1.vinous.com/articles/mount-etna-the-juggernaut-of-italian-wine-sep-2026` en volg de verwante-artikelenlijst.
2. **Champagne is de best gedekte streek die deze ronde niet is aangeraakt**: 18 van de 36 jaren, en de open verdenking van ronde twee staat er nog. **Champagne 2005 staat op 3 en één scherpe bron noemt het jaar wisselend met overrijpe en rotkarakters.** Er is geen Decanter-jaargangkaart per jaar voor Champagne gevonden, maar hun Collector's Guide is integraal leesbaar en Wine Spectator heeft wel een Champagne-kaart met tekst per jaar.
3. **Vier tegenspraken die deze ronde bewust niet zijn doorgevoerd, omdat één uitgever een jaar met twee bronnen niet omdraait.** Bourgogne wit 2023 (staat 3, World of Fine Wine zegt 4 en noemt wit boven rood); Elzas 2021 (staat 3, één bron zegt 4); port 2007 (staat 5, Decanter zegt "These aren't blockbuster Ports"); port 2016 (staat 5, Decanter noteert "some picked too early"). Eén extra onafhankelijke bron per geval beslist het.
4. **Twee jaren waar twee laag-A-bronnen elkaar echt tegenspreken** en waar de tabel dus een keuze maakt die betwistbaar is: port 1997 (Vinous proefde er ruim veertig en kwam op "average to slightly above average", Decanter noemt het "well-structured" en zet het naast 1983 — de tabel volgt Vinous omdat een toegewijde proeverij zwaarder weegt) en Toscane 2020 (Vinous en World of Fine Wine tegen Decanter, twee tegen één, de tabel staat op 3).
5. **Toscane 2009 staat nog op 3 terwijl het bewijs voor 2 er ligt** — maar dat bewijs komt volledig uit Montalcino, en de rij vangt ook Chianti en Bolgheri. Dezelfde reden waarom 2023 in ronde twee niet verlaagd is. Los dit op door Toscane te splitsen in Brunello, Chianti en Bolgheri, waarvoor deze ronde het bewijs heeft geleverd, en niet door het gemiddelde te verlagen.
6. **De splitsingen waarvoor deze ronde het bewijs heeft verzameld**, in volgorde van hoe hard het bewijs is: Toscane in Brunello, Chianti en Bolgheri; Duitsland in droog en zoet; de Loire in droog wit, zoete Chenin en rood; Tasmanië los van Victoria; Chablis los van de Côte d'Or; de Dão los van Bairrada; Savoie los van de Jura. Splits pas als er voor beide helften ook data ligt.
7. **De lege rijen die nog gevuld kunnen worden:** `australie_nsw` (de Hunter Valley heeft een eigen cyclus en Vinous schrijft erover), `chili_zuid` (Itata en Bío Bío), `usa_oost` en `canada`. En de veertien landen zonder rij uit de vorige sectie.
8. **Drinkvensters per stijl uit bronnen** is nu drie rondes achter elkaar niet gelukt. CellarTracker, de enige brede publieke bron met vensters per wijn, blokkeert de bot zelf (405 op curl, 202 met een lege body op een browser-user-agent) en `wine-searcher.com` geeft 403. Wat wél kan: Berry Bros publiceert een rijpheidscode per jaar per streek in dezelfde payload als zijn jaargangkaart, Decanter zet bij elke jaargang een drinkvenster ("Drink from 2035-2060"), en Wine Spectator geeft per jaar "Drink", "Drink or hold" of "Hold". Dat is geen venster per wijn maar het is wel een onafhankelijke controle op `vensterBasis`, en het ligt er al.
9. **Griekenland blijft leeg, en dat is nu een gemeten conclusie in plaats van een vermoeden.** Ronde drie heeft Vinous, Decanter, World of Fine Wine en Wine Spectator met de werkende user-agent doorzocht. De Griekse stukken die er zijn, gaan over rassen en producenten met proefnotities; er is geen jaargangkaart en geen jaargangoordeel. Het is geen zoekfout maar een leemte in de bereikbare gepubliceerde bronnen.

## Hoe je een volgende ronde draait

0. **Toets eerst welke hosts bereikbaar zijn, met `curl` en niet met WebFetch, en met bèide user-agents.** Ronde twee verloor bijna alles aan de aanname dat een geblokkeerde WebFetch betekent dat een domein dicht zit; ronde drie verloor bijna de helft van zijn bronnen aan de aanname dat één user-agent genoeg is. Draai per host `curl -sSL -o /dev/null -w '%{http_code}' -A 'curl/8.0' https://host/` én hetzelfde met een browserstring, en trap niet in een 200 op de voorpagina bij een site die op artikelen 403 geeft. Een `000` is een weigering van de uitgaande proxy, niet een niet-bestaand domein; `curl -sS "$HTTPS_PROXY/__agentproxy/status"` noteert per host waarom.
1. Laat het onderzoek per streekgroep doen, met de bronnenlat hierboven. Geef de huidige waarden mee, zodat er bevestigd of tegengesproken wordt in plaats van opnieuw bedacht. Zoek om een URL te vínden en lees die dan met `curl`: zoeken kost budget, lezen niet. Eén werkwijze die telkens loont: haal één artikel van een uitgever op en grep de linklijst eruit; zowel Vinous als Decanter zetten de hele streekindex in de zijbalk.
2. **Eis per bevinding een letterlijk citaat van vijf tot dertig woorden, met de URL erbij, en reken het daarna machinaal na.** Haal elke URL opnieuw op en controleer of het citaat er woordelijk in staat. Van de 450 bevindingen van ronde drie kwamen alle 835 citaten door die controle; dat is de reden dat dit bestand kan beweren wat het beweert. Reken in dezelfde stap af of twee bronnen wel van twee uitgevers komen.
3. Zet de uitkomst in een tekstbestand, één streek per regel: `champagne: 1996:5+ 2002:5+ ...`.
4. Draai `python3 tools/zet-jaargangen.py <bestand>` voor een droogloop. Die controleert de vorm, laat per streek zien wat er verandert en telt de drie standen. Voeg `--schrijf` toe om het door te voeren. **Nooit met de hand in `cellarmentor.html` overtypen.**
5. Werk dit bestand bij: de dekkingstabel, de vindplaatsen, de divergentie en de werklijst. En `DECISIONS.md` voor wat er veranderde en waarom.
6. `./build.sh` en `./check.sh`. De tests toetsen de vorm van de tabel en of `streekVan` de bekende appellations nog goed thuisbrengt, niet de inhoud van de oordelen, want dat is een redactionele keuze.

Elk najaar hoort het nieuwe oogstjaar erbij, en horen de jonge jaargangen te worden bijgesteld zodra de wijnen op de markt zijn en er echte proefverslagen liggen. Een jaargangtabel is geen eenmalige gegevenslevering.

## Vindplaatsen per streek

Hieronder staat per streek, per jaar, waar het oordeel vandaan komt: de uitgever, het pad van het artikel en een citaat dat de strekking draagt. Elk citaat is machinaal teruggevonden in de opgehaalde pagina. Bij een jaar met meer dan drie bronnen staan de eerste drie; de rest staat in de onderzoeksbestanden van de ronde. Jaren die hier niet staan zijn ofwel in een eerdere ronde vastgesteld — die vindplaatsen staan in de secties over ronde een en twee hieronder — ofwel nog eigen schatting.

**alentejo**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2011 | 5* | World of Fine Wine `news-features/herdade-do-esporao-torre-finest-alentejo-red-wine`; World of Fine Wine `news-features/herdade-do-esporao-torre-finest-alentejo-red-wine` | "as one might expect from an exceptional, slow-ripening year" |
| 2017 | 5* | World of Fine Wine `news-features/herdade-do-esporao-torre-finest-alentejo-red-wine`; World of Fine Wine `news-features/herdade-do-esporao-torre-finest-alentejo-red-wine` | "lower August and September temperatures allowed for full phenolic and flavor ripeness" |
| 2018 | 3* | The Drinks Business `2026/06/alentejo-lessons-from-the-front-line-of-climate-change` | "in the heatwave year of 2018" |

**alsace**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1990 | 5* | Decanter `premium/alsace-riesling-panel-tasting-results-465790` | "The top-scoring wine hails from the stellar 2015 vintage, held by many to be the best in Alsace since the l..." |
| 1997 | 4* | Vinous `articles/alsace-1998-and-1997-jul-1999`; Vinous `articles/alsace-1998-and-1997-jul-1999` | "my generally favorable impressions of these two vintages" |
| 1998 | 4* | Vinous `articles/alsace-1998-and-1997-jul-1999`; Vinous `articles/alsace-1998-and-1997-jul-1999` | "The acidity of '98 is typically ripe and harmonious, the kind of acidity that frames rather than clashes wi..." |
| 1999 | 3* | Vinous `articles/alsace-2000-and-1999-jul-2001`; Vinous `articles/alsace-2000-and-1999-jul-2001` | "good in the case of 1999 and very good to outstanding in 2000" |
| 2000 | 4* | Vinous `articles/alsace-2000-and-1999-jul-2001`; Vinous `articles/alsace-2000-and-1999-jul-2001` | "good in the case of 1999 and very good to outstanding in 2000" |
| 2001 | 5* | Vinous `articles/alsace-2002-and-2001-nov-2003`; Vinous `articles/alsace-2002-and-2001-nov-2003` | "The best 2001s offer wonderful purity of aromas and flavors and great elegance" |
| 2002 | 4* | Vinous `articles/alsace-2002-and-2001-nov-2003`; Vinous `articles/alsace-2002-and-2001-nov-2003` | "If one variety stands out in 2002, it's riesling" |
| 2003 | 2* | Vinous `articles/2004-alsace-wines-nov-2006` | "I am not a fan of this vintage, as the extreme heat produced wines with freakishly high alcohol and dangero..." |
| 2004 | 3* | Vinous `articles/2004-alsace-wines-nov-2006`; Vinous `articles/2004-alsace-wines-nov-2006` | "Most estates agree that 2004 was best for riesling." |
| 2005 | 4* | Vinous `articles/alsace-s-2005-vintage-jul-2007` | "four stars plus (out of five) for gewürztraminer, four stars for pinot gris and three stars plus for riesling" |
| 2006 | 2* | Vinous `articles/alsace-2007-and-2006-nov-2008`; Vinous `articles/alsace-2007-and-2006-nov-2008` | "Many producers sold off or declassified a significant portion of their" |
| 2007 | 5* | Vinous `articles/alsace-2007-and-2006-nov-2008` | "what most makers agreed is an excellent to outstanding year for this beautiful region" |
| 2008 | 5* | Vinous `articles/alsace-update-nov-2010`; Vinous `articles/alsace-update-nov-2010` | "At the level of the better producers, 2008 is an exciting vintage" |
| 2009 | 3* | Vinous `articles/alsace-update-nov-2010`; Vinous `articles/2011-and-2010-alsace-wines-nov-2012` | "It was easy to produce big wines but a trickier matter to make wines with real tension, detail and aromatic..." |
| 2010 | 5* | Vinous `articles/2011-and-2010-alsace-wines-nov-2012` | "2010 is outstanding, quite possibly one of the greatest Alsace vintages of all time" |
| 2011 | 4* | Vinous `articles/2011-and-2010-alsace-wines-nov-2012` | "2011 is an excellent vintage (the wines are far better than those of 2009), while 2010 is outstanding" |
| 2012 | 3* | Vinous `articles/alsace-2012s-and-early-released-2013s-apr-2015`; Vinous `articles/alsace-2012s-and-early-released-2013s-apr-2015` | "both growing seasons produced many charming, very good wines that will generally offer early appeal" |
| 2013 | 3* | Vinous `articles/alsace-2012s-and-early-released-2013s-apr-2015`; Vinous `articles/alsace-2012s-and-early-released-2013s-apr-2015` | "Clearly, 2013 was a problematic" |
| 2014 | 3* | Vinous `articles/alsace-the-2014s-and-late-release-2013s-feb-2016`; Vinous `articles/alsace-the-2014s-and-late-release-2013s-feb-2016` | "The 2014 vintage is not going to be remembered in Alsace as particularly memorable." |
| 2015 | 4+ | Vinous `articles/alsace-the-2015s-and-late-released-2014s-mar-2017`; Decanter `premium/alsace-riesling-panel-tasting-results-465790` | "2015 is close to a once-in-a-lifetime vintage for Gewürztraminer" |
| 2016 | 4* | Vinous `articles/alsace-the-2016s-late-released-2015s-apr-2018`; Vinous `articles/alsace-the-2016s-late-released-2015s-apr-2018` | "the wines of 2016 are mostly graceful and refined" |
| 2017 | 4+ | Decanter `premium/alsace-riesling-panel-tasting-results-465790`; Vinous `articles/alsace-luxembourg-2017s-and-late-released-2016s-jan-2019` | "2017 was a low-yielding vintage, due to the effects of a late spring frost, compounded by the hot summer. T..." |
| 2018 | 4* | Decanter `premium/alsace-riesling-panel-tasting-results-465790`; Decanter `premium/alsace-riesling-panel-tasting-results-465790` | "The 2018s were expressive, fragrant and accessible, acidities perhaps a little softer from this warm, gener..." |
| 2019 | 5* | Decanter `premium/alsace-riesling-panel-tasting-results-465790` | "The 2019s typically displayed a combination of perfume and richness offset by thrilling acidities" |
| 2020 | 4* | Vinous `articles/alsace-2020s-and-2021s-just-like-janus-apr-2023` | "showing wines with real thrill from 2021 and sumptuous expressions of 2020" |
| 2021 | 4* | Vinous `articles/alsace-2020s-and-2021s-just-like-janus-apr-2023`; Vinous `articles/alsace-2020s-and-2021s-just-like-janus-apr-2023` | "The low yields saved the quality of the vintage." |
| 2022 | 4* | Vinous `articles/alsace-2022-whites-a-lucky-escape-apr-2024` | "This resulted in some stunning wines from concentrated grapes with expressive and juicy fruit flavors." |
| 2023 | 4* | Vinous `articles/alsace-2023-astonishing-whites-and-splendid-reds-from-a-complex-year-apr-2025`; Vinous `articles/alsace-2023-astonishing-whites-and-splendid-reds-from-a-complex-year-apr-2025` | "The 2023 Rieslings thus have concentration, moderate alcohol, ripe acidity and great aging potential." |

**argentinie**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 2* | Decanter `wine-news/el-nino-argentina-2016-wine-harvest-305057` | "adding botrytis to the list of problems alongside powdery and downy mildew" |
| 2017 | 4* | Decanter `wine-news/argentina-harvest-2017-368765` | "Although quality is considered high across the board, damaging spring frosts significantly reduced the quan..." |
| 2019 | 5* | Decanter `wine-news/argentina-2019-harvest-excellent-vintage-across-the-board-421181`; Decanter `wine-news/argentina-2019-harvest-excellent-vintage-across-the-board-421181` | "Some winemakers are calling 2019 their best vintage of the decade" |
| 2020 | 3* | Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026`; Vinous `articles/harvest-report-chile-and-argentina-jul-2020` | "2020 and 2023 had a detrimental effect on stony areas. Faster ripening and" |
| 2021 | 5* | Vinous `articles/andean-character-uco-valley-reds-aug-2025`; Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026` | "the most expressive examples to ever come from Gualtallary are from the 2021 and 2022 vintages" |
| 2022 | 5* | Vinous `articles/andean-character-uco-valley-reds-aug-2025`; Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026` | "the most expressive examples to ever come from Gualtallary are from the 2021 and 2022 vintages" |
| 2023 | 3* | Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026`; Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026` | "the tannins turned out compressed and somewhat rustic." |
| 2024 | 4* | Vinous `articles/northern-mendoza-the-old-and-new-terroirs-of-lujan-de-cuyo-mar-2026` | "Two thousand twenty-four is an especially intriguing year for reds." |

**australie_vic**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2009 | 2* | Vinous `articles/best-new-releases-from-australia-jul-2012` | "Two thousand nine in Victoria can be a dicey proposition because of epic brush fires that ravaged the regio..." |
| 2011 | 1* | Vinous `articles/australia-rediscovers-its-mojo-mar-2016`; Vinous `articles/best-new-wines-from-australia-jul-2014` | "red wine producers in South Australia and Victoria would like to" |
| 2020 | 2* | Vinous `articles/north-east-victoria-full-of-surprises-feb-2025`; Vinous `articles/victoria-cutting-edge-meets-classic-mar-2024` | "long-term exposure to smoke haze saw no wines made in Alpine Valleys or Beechworth" |
| 2021 | 5* | Vinous `articles/victoria-cutting-edge-meets-classic-mar-2024` | "This is a standout vintage, yielding beautifully" |
| 2022 | 4* | Vinous `articles/digging-for-gold-in-western-victoria-nov-2024` | "Central Victoria experienced the best conditions of the year, with Heathcote enjoying an outstanding year" |
| 2023 | 2* | Vinous `articles/digging-for-gold-in-western-victoria-nov-2024`; Vinous `articles/digging-for-gold-in-western-victoria-nov-2024`; Vinous `articles/island-paradise-wines-of-tasmania-jul-2026` | "2023 was a challenging vintage across much of Victoria" |

**australie_wa**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2009 | 4* | Vinous `articles/best-new-releases-from-australia-jul-2012` | "the 2009 and 2010 vintages, which represent most of the red wines I tasted this year, were both strong in W..." |
| 2011 | 4* | Vinous `articles/best-new-wines-from-australia-jul-2014`; Vinous `articles/best-new-wines-from-australia-jul-2014` | "Western Australia and the Margaret River in particular enjoyed far better circumstances in '11 than their c..." |
| 2012 | 4* | Vinous `articles/australia-rediscovers-its-mojo-mar-2016` | "the hot, dry growing season resulted in red wines of very good depth and power, with the structure to age" |
| 2013 | 4* | Vinous `articles/australia-rediscovers-its-mojo-mar-2016` | "very good to excellent vintage in Western Australia" |
| 2019 | 4* | Decanter `wine/margaret-river/margaret-river-vintage-report-2024-chardonnay-and-2023-cabernet-sauvignon` | "2022: 5/5 2021: 3/5 2020: 5/5 2019: 4/5" |
| 2020 | 5+ | Vinous `articles/the-yin-and-the-yang-of-western-australia-may-2024`; Vinous `articles/the-yin-and-the-yang-of-western-australia-may-2024`; Decanter `premium/vintage-report-margaret-river-cabernet-sauvignon-2021-chardonnay-2022-535480` | "Revisiting the 2020 Cabernet Sauvignons from Margaret River for this report showcased what an outstanding v..." |
| 2021 | 4+ | Vinous `articles/the-yin-and-the-yang-of-western-australia-may-2024`; Decanter `wine/margaret-river/margaret-river-vintage-report-2024-chardonnay-and-2023-cabernet-sauvignon` | "Although Cabernet Sauvignons and other red wines lacked some" |
| 2022 | 5+ | Decanter `wine/margaret-river/margaret-river-vintage-report-2024-chardonnay-and-2023-cabernet-sauvignon`; Vinous `articles/the-yin-and-the-yang-of-western-australia-may-2024` | "2022: 5/5 2021: 3/5 2020: 5/5 2019: 4/5" |
| 2023 | 5+ | Vinous `articles/a-landmark-vintage-2023-margaret-river-cabernet-sauvignon-jan-2026`; Decanter `wine/margaret-river/margaret-river-vintage-report-2024-chardonnay-and-2023-cabernet-sauvignon`; World of Fine Wine `news-features/2023-margaret-river` | "2023 is a year of the highest quality, a once-in-a-decade vintage that is sure to thrive in the cellar" |
| 2024 | 4* | Decanter `wine/margaret-river/margaret-river-vintage-report-2024-chardonnay-and-2023-cabernet-sauvignon` | "CHARDONNAY 2024: 4/5 The warmest, driest and earliest vintage on record" |

**australie_za**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2009 | 4* | Vinous `articles/best-new-releases-from-australia-jul-2012` | "the 2009 and 2010 vintages, which represent most of the red wines I tasted this year, were both strong in W..." |
| 2011 | 1* | Vinous `articles/best-new-wines-from-australia-jul-2014`; Vinous `articles/australia-rediscovers-its-mojo-mar-2016`; Vinous `articles/best-new-wines-from-australia-jul-2013` | "Two thousand eleven is one of those vintages that producers across the vast southern stretch of Australia" |
| 2020 | 3* | Vinous `articles/changing-gears-in-barossa-jun-2023` | "the growing season created bold and ripe wines with fleshy tannins that will drink well over the medium term" |
| 2021 | 5* | Vinous `articles/changing-gears-in-barossa-jun-2023`; Vinous `articles/barossa-2022-run-don-t-walk-aug-2024` | "2021 has created wines with power and grace that should age very well" |
| 2022 | 5* | Vinous `articles/barossa-2022-run-don-t-walk-aug-2024`; Vinous `articles/mclaren-vale-pushing-the-refinement-envelope-apr-2025`; Vinous `articles/australia-s-limestone-coast-the-limestone-effect-sep-2026` | "Two thousand twenty-two is the best year in the Barossa since 2018" |
| 2023 | 3+ | Vinous `articles/barossa-and-clare-valley-the-champion-and-the-contender-aug-2025`; Vinous `articles/mclaren-vale-pushing-the-refinement-envelope-apr-2025`; Decanter `premium/barossa-shiraz-2023-vintage-report-and-40-top-scoring-wines-559843` | "The 2023 vintage was one of the more challenging in recent years, particularly for red wines in Clare and B..." |
| 2024 | 4* | Vinous `articles/australia-s-limestone-coast-the-limestone-effect-sep-2026`; Vinous `articles/barossa-and-clare-valley-the-champion-and-the-contender-aug-2025` | "this should turn out to be an exceptional vintage with powerful, well-structured wines" |

**beaujolais**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2005 | 5* | Vinous `articles/2014-beaujolais-another-dream-vintage-aug-2016`; Vinous `articles/cellar-favorite-2005-jean-foillard-morgon-cote-du-py-nov-2015` | "consistently outstanding group of Beaujolais since the legendary 2005s, which" |
| 2009 | 4* | Vinous `articles/the-new-golden-age-of-beaujolais-aug-2013`; Vinous `articles/beaujolais-if-you-want-value-you-ve-got-it-oct-2019` | "Three successive very good to epic vintages (2011, 2010 and 2009) are on offer" |
| 2010 | 5* | Vinous `articles/the-new-golden-age-of-beaujolais-aug-2013`; Vinous `articles/a-lucky-13-for-beaujolais-lovers-jul-2016` | "I remain confident that the best 2010s will richly reward up to a decade--or even more--of aging" |
| 2011 | 4* | Vinous `articles/the-new-golden-age-of-beaujolais-aug-2013`; Vinous `articles/2014-beaujolais-another-dream-vintage-aug-2016` | "Three successive very good to epic vintages (2011, 2010 and 2009) are on offer" |
| 2012 | 2* | Vinous `articles/2016-beaujolais-hail-yes-mar-2018`; Vinous `articles/a-lucky-13-for-beaujolais-lovers-jul-2016` | "2012 being the sole weak link in the chain" |
| 2013 | 4+ | Vinous `articles/a-lucky-13-for-beaujolais-lovers-jul-2016`; Decanter `wine-reviews-tastings/wine-panel-tastings/cru-beaujolais-2015-panel-tasting-results-374107` | "products of a late growing season and a prolonged harvest, the 2013s possess" |
| 2014 | 5* | Vinous `articles/2014-beaujolais-another-dream-vintage-aug-2016`; Vinous `articles/2015-beaujolais-monumental-but-often-atypical-dec-2017` | "consistently outstanding group of Beaujolais since the legendary 2005s, which" |
| 2015 | 4+ | Vinous `articles/2015-beaujolais-monumental-but-often-atypical-dec-2017`; Decanter `wine-reviews-tastings/wine-panel-tastings/cru-beaujolais-2015-panel-tasting-results-374107` | "I tasted a higher percentage of outstanding" |
| 2016 | 4* | Vinous `articles/2016-beaujolais-hail-yes-mar-2018`; Vinous `articles/beaujolais-if-you-want-value-you-ve-got-it-oct-2019` | "most 2016 Beaujolais are built along more classical lines" |
| 2017 | 3* | Vinous `articles/beaujolais-if-you-want-value-you-ve-got-it-oct-2019`; Vinous `articles/changing-perspectives-in-beaujolais-aug-2021` | "When it comes to problematic vintages, 2017 has most of" |
| 2018 | 4+ | Decanter `premium/beaujolais-2018-cru-vintage-guide-more-than-110-wines-rated-455257`; Vinous `articles/changing-perspectives-in-beaujolais-aug-2021` | "The 2018 vintage continues a very fine run for the under-rated crus of Beaujolais" |
| 2019 | 4+ | Vinous `articles/changing-perspectives-in-beaujolais-aug-2021`; Decanter `premium/cru-beaujolais-2019-panel-tasting-results-461704` | "a number of which I found to be truly outstanding and, in many cases, age-worthy" |
| 2020 | 4* | Vinous `articles/the-future-is-beaujolais-2020-2022-releases-may-2023` | "warmer 2020 vintage overflows with quality, and stylistically it will appeal to" |
| 2021 | 2* | Vinous `articles/the-future-is-beaujolais-2020-2022-releases-may-2023`; Vinous `articles/but-seriously-beaujolais-2021-2023-apr-2024` | "inconsistent, a facet of that year I foresaw last autumn when tasting" |
| 2022 | 4+ | Vinous `articles/but-seriously-beaujolais-2021-2023-apr-2024`; Decanter `premium/cru-beaujolais-2022-panel-tasting-results-553081` | "2022 sees a bifurcation in quality" |
| 2023 | 4+ | Vinous `articles/buy-some-try-some-beaujolais-2022-2024-apr-2025`; Decanter `premium/why-2023-is-a-must-have-vintage-for-beaujolais-lovers-569912`; World of Fine Wine `tasting-notes/beaujolais-2023-vintage` | "treasure trove of outstanding Beaujolais that equal or surpass their 2022" |
| 2024 | 2* | Vinous `articles/gamayzing-beaujolais-new-releases-may-2026`; Vinous `articles/gamayzing-beaujolais-new-releases-may-2026` | "Many 2024s feel meagre, besmirched by a vegetal" |

**bourgogne_r**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1990 | 5+ | Vinous `articles/1996-and-1995-red-burgundies-mar-1998`; Decanter `learn/vintage-guides/red-burgundy-117871` | "In 1990, almost universally regarded as one of the three or four best vintages of the last 20 years" |
| 1993 | 4+ | Vinous `articles/burgundy-with-plenty-of-age-1865-1999-may-2019`; Decanter `learn/vintage-guides/red-burgundy-117871` | "The 1993 vintage is now fondly regarded, though" |
| 1995 | 4+ | Vinous `articles/1996-and-1995-red-burgundies-mar-1998`; Decanter `learn/vintage-guides/red-burgundy-117871` | "the best '95s are concentrated, dense, structured wines made from a small crop" |
| 1996 | 4+ | Vinous `articles/1996-and-1995-red-burgundies-mar-1998`; Decanter `learn/vintage-guides/red-burgundy-117871` | "The vintage is consistently attractive, and in numerous cellars outstanding wines were made" |
| 1999 | 5+ | Vinous `articles/the-glorious-1999-red-burgundies-mar-2018`; Decanter `learn/vintage-guides/red-burgundy-117871` | "the 1999 red Burgundies offered a rare combination of charm and power" |
| 2000 | 2+ | Vinous `articles/2000-and-1999-red-burgundies-mar-2002`; Decanter `learn/vintage-guides/red-burgundy-117871` | "made for a tricky vintage for pinot noir and a mixed bag of wines" |
| 2002 | 5+ | Vinous `articles/the-glorious-2002-red-burgundies-feb-2016`; Decanter `learn/vintage-guides/red-burgundy-117871` | "beautifully balanced vintage with captivating sweet fruit, pliant texture and seductive" |
| 2003 | 3+ | Vinous `articles/the-good-the-bad-and-the-ugly-burgundy-2010-2003-2004-jun-2020`; Decanter `learn/vintage-guides/red-burgundy-117871` | "neither did they compel me to revise my lukewarm view of 2003" |
| 2004 | 2+ | Vinous `articles/the-good-the-bad-and-the-ugly-burgundy-2010-2003-2004-jun-2020`; Decanter `learn/vintage-guides/red-burgundy-117871` | "the following vintage is one that I have never liked and often abhorred" |
| 2005 | 5+ | Vinous `articles/2005-and-2004-red-burgundies-mar-2007`; Decanter `learn/vintage-guides/red-burgundy-117871` | "2005 is potentially the greatest red Burgundy vintage I've yet tasted from barrel" |
| 2006 | 3+ | Vinous `articles/2006-and-2005-red-burgundies-mar-2008`; Decanter `learn/vintage-guides/red-burgundy-117871` | "has yielded scented, elegant, site-typical red wines that will offer considerable pleasure to Burgundy puri..." |
| 2008 | 3+ | Vinous `articles/relive-the-nightmare-2008-red-white-burgundy-aug-2022`; Decanter `learn/vintage-guides/red-burgundy-117871` | "overcome. At worst, the wines are tough, rather green and lack mid-palate" |
| 2009 | 4+ | Vinous `articles/the-2009-red-burgundies-from-bottle-apr-2012`; Decanter `learn/vintage-guides/red-burgundy-117871` | "The wines are radiant, generous and exceptionally beautiful" |
| 2010 | 5* | Vinous `articles/2010-red-burgundies-mar-2013`; Vinous `articles/the-good-the-bad-and-the-ugly-burgundy-2010-2003-2004-jun-2020` | "2010 is the finest vintage for red Burgundy I have tasted since I made my first tour of the region in 1988" |
| 2011 | 3* | Decanter `learn/vintage-guides/red-burgundy-117871` | "As so often in recent years, 2011 proved to be a tricky and challenging vintage for growers" |
| 2012 | 4+ | Vinous `articles/2012-red-burgundies-jan-2014`; Decanter `learn/vintage-guides/red-burgundy-117871` | "For a vintage that produced so many utterly compelling red Burgundies" |
| 2013 | 3* | Vinous `articles/ten-years-on-burgundy-2013-oct-2023` | "I rank it slightly above 2008, another troublesome vintage" |
| 2015 | 5+ | Vinous `articles/red-burgundy-2016-and-2015-two-terrific-but-very-different-vintages-jan-2018`; Decanter `learn/vintage-guides/red-burgundy-117871` | "it has produced many outstanding, mostly large-scaled wines and some that are downright massive" |
| 2016 | 4* | Vinous `articles/red-burgundy-2016-and-2015-two-terrific-but-very-different-vintages-jan-2018`; Vinous `articles/through-the-other-side-burgundy-2016-in-bottle-oct-2019` | "outstanding pair of back-to-back vintages studded with hauntingly beautiful reds" |
| 2017 | 4+ | Vinous `articles/2017-burgundy-a-modern-classic-jan-2019`; Decanter `learn/vintage-guides/red-burgundy-117871` | "The 2017 reds are very good, often excellent, and from time to time, bloody awesome" |
| 2018 | 4+ | Vinous `articles/2018-burgundy-confounded-expectations-jan-2020`; Decanter `learn/vintage-guides/red-burgundy-117871` | "On reflection, the 2018 Burgundies" |
| 2019 | 5+ | Vinous `articles/la-lumiere-noire-2019-burgundy-cote-de-nuits-dec-2020`; Decanter `learn/vintage-guides/red-burgundy-117871`; World of Fine Wine `news-features/2022-burgundy-en-primeur` | "I love the 2019 vintage for both whites and reds" |
| 2020 | 4+ | Vinous `articles/dance-the-quickstep-burgundy-2020-dec-2021`; Vinous `articles/dance-the-quickstep-burgundy-2020-dec-2021`; World of Fine Wine `news-features/2020-burgundy-classic-wines-from-an-extreme-season` | "there is much to admire about the 2020s" |
| 2021 | 3+ | Vinous `articles/a-vintage-with-issues-burgundy-2021-oct-2025`; Vinous `articles/a-vintage-with-issues-burgundy-2021-oct-2025`; World of Fine Wine `news-features/2021-burgundy-vintage` | "The growing season capped the" |
| 2022 | 5* | World of Fine Wine `news-features/2022-burgundy-en-primeur`; World of Fine Wine `news-features/2022-burgundy-en-primeur` | "For the reds, it is a very great vintage. Maybe best red vintage recently" |
| 2023 | 4+ | Vinous `articles/the-lord-giveth-burgundy-2023-jan-2025`; World of Fine Wine `news-features/2023-burgundy-introduction` | "gave rise to a veritable trove of white and reds that will drink" |
| 2024 | 3+ | Decanter `premium/burgundy-2024-en-primeur-white-wines-shine-amid-a-small-and-challenging-harvest-572388`; World of Fine Wine `news-features/2024-burgundy-vintage` | "2024 is a challenging vintage for red wine" |

**bourgogne_w**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1995 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 1996 | 3+ | Vinous `articles/2003-and-2002-white-burgundies-sep-2004`; Decanter `learn/vintage-guides/white-burgundy-117857` | "Perhaps the most problematic vintage in this regard is 1996" |
| 1997 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 1998 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 1999 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 2000 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 2001 | 3+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "of premature oxidation of white Burgundies (premox for short) was highest" |
| 2002 | 4* | Decanter `learn/vintage-guides/white-burgundy-117857` | "Ripe with balancing acidity. Good ageing potential." |
| 2003 | 2+ | Decanter `learn/vintage-guides/white-burgundy-117857`; Vinous `articles/2006-and-2005-white-burgundies-sep-2007` | "Opulent wines for early drinking" |
| 2005 | 4+ | Vinous `articles/2005-white-burgundies-jul-2006`; Decanter `learn/vintage-guides/white-burgundy-117857` | "this is indeed a very ripe and often remarkably rich group of wines" |
| 2006 | 3+ | Vinous `articles/2006-and-2005-white-burgundies-sep-2007`; Decanter `learn/vintage-guides/white-burgundy-117857` | "Although both vintages yielded many wonderfully rich and potentially outstanding wines" |
| 2007 | 4+ | Vinous `articles/2007-and-2006-white-burgundies-sep-2008`; Decanter `learn/vintage-guides/white-burgundy-117857` | "the better 2007s show lovely aromatic freshness" |
| 2008 | 4+ | Vinous `articles/2008-and-2007-white-burgundies-sep-2009`; Decanter `learn/vintage-guides/white-burgundy-117857` | "many insiders have maintained that the vintage favored chardonnay over pinot" |
| 2009 | 3+ | Vinous `articles/the-2009-white-burgundies-aug-2011`; Decanter `learn/vintage-guides/white-burgundy-117857` | "The 2009 harvest yielded a large number of delicious white Burgundies, many of which will drink beautifully..." |
| 2010 | 5+ | Vinous `articles/elegance-and-power-the-2010-white-burgundies-aug-2012`; Decanter `learn/vintage-guides/white-burgundy-117857` | "The 2010 white Burgundies are some of the most riveting young wines I have ever tasted" |
| 2011 | 3* | Decanter `learn/vintage-guides/white-burgundy-117857` | "It is difficult to generalise about the white wines in 2011, as so much depended on when the grapes were pi..." |
| 2012 | 4+ | Vinous `articles/2012-and-2011-white-burgundies-sep-2013`; Decanter `learn/vintage-guides/white-burgundy-117857` | "2012 has turned out to be a very good vintage for the white wines of the Cote de Beaune" |
| 2013 | 3+ | Vinous `articles/2013-and-2012-white-burgundies-sep-2014`; Decanter `learn/vintage-guides/white-burgundy-117857` | "the cool, late, challenging 2013 growing season has produced many delightful wines" |
| 2014 | 5+ | Vinous `articles/the-2014-white-burgundies-what-s-not-to-like-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857`; World of Fine Wine `homepage-featured-articles/2014-white-burgundy-a-retrospective` | "vintage in the same style category as 2012, 2010 and 2008" |
| 2015 | 4+ | Vinous `articles/the-2015-white-burgundies-a-year-of-sunshine-sep-2016`; Decanter `learn/vintage-guides/white-burgundy-117857` | "growing season of 2015 yielded Burgundy" |
| 2016 | 4+ | Vinous `articles/2016-white-burgundy-excellent-complicated-sep-2018`; Decanter `learn/vintage-guides/white-burgundy-117857` | "Two thousand sixteen is a potentially classic white Burgundy vintage" |
| 2017 | 5+ | Vinous `articles/2017-burgundy-a-modern-classic-jan-2019`; Decanter `learn/vintage-guides/white-burgundy-117857` | "there are some quite brilliant whites that, many growers are beginning to opine, equal or even surpass the ..." |
| 2018 | 4+ | Vinous `articles/2018-burgundy-confounded-expectations-jan-2020`; Decanter `learn/vintage-guides/white-burgundy-117857` | "The real surprise is the quality of the whites" |
| 2019 | 4+ | Vinous `articles/la-lumiere-noire-2019-burgundy-cote-de-nuits-dec-2020`; Decanter `learn/vintage-guides/white-burgundy-117857` | "I love the 2019 vintage for both whites and reds" |
| 2020 | 5* | Vinous `articles/dance-the-quickstep-burgundy-2020-dec-2021`; Vinous `articles/dance-the-quickstep-burgundy-2020-dec-2021` | "the best whites almost shimmer with" |
| 2021 | 4* | Vinous `articles/a-vintage-with-issues-burgundy-2021-oct-2025`; Vinous `articles/a-vintage-with-issues-burgundy-2021-oct-2025` | "a percentage of wines were afflicted by botrytis" |
| 2023 | 4* | World of Fine Wine `news-features/2023-burgundy-introduction`; World of Fine Wine `news-features/2023-burgundy-introduction` | "2023 Burgundy was a bounteous but heterogenous vintage in which the white wines outshone the reds" |
| 2024 | 4* | Decanter `premium/burgundy-2024-en-primeur-white-wines-shine-amid-a-small-and-challenging-harvest-572388` | "2024 is a good to very good vintage that has produced whites of elegance and finesse" |

**ca_kust**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2018 | 5* | Decanter `premium/paso-robles-2022-vintage-best-wines-from-a-challenging-year-542775` | "2018: A desirable, long growing season crafting wines of classic structure and intense fruit." |
| 2019 | 5+ | Decanter `premium/paso-robles-2022-vintage-best-wines-from-a-challenging-year-542775`; Vinous `articles/paso-robles-boundless-diversity-may-2023` | "2019: An excellent vintage on all accounts." |
| 2020 | 3+ | Vinous `articles/santa-barbara-a-rare-bright-spot-for-california-in-2020-aug-2022`; Vinous `articles/paso-robles-boundless-diversity-may-2023`; Decanter `premium/paso-robles-2023-vintage-report-and-top-wines-tasted-573832` | "Santa Barbara produced the finest wines in California in 2020 by a" |
| 2021 | 5+ | Decanter `premium/paso-robles-2023-vintage-report-and-top-wines-tasted-573832`; Vinous `articles/santa-lucia-highlands-cool-climate-excellence-in-2021-nov-2023` | "2021: After a challenging 2020 vintage, 2021 arrived in this key region" |
| 2022 | 3+ | Vinous `articles/santa-barbara-out-of-many-one-aug-2025`; Vinous `articles/santa-barbara-out-of-many-one-aug-2025`; Decanter `premium/paso-robles-2023-vintage-report-and-top-wines-tasted-573832` | "The 2022 vintage was a punisher." |
| 2023 | 5+ | Vinous `articles/santa-barbara-out-of-many-one-aug-2025`; Decanter `premium/paso-robles-2023-vintage-report-and-top-wines-tasted-573832` | "Santa Barbara yielded an embarrassment of riches" |

**chili_centraal**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 3* | Vinous `articles/harvest-report-chile-and-argentina-jul-2020` | "just like 2016, when a lack of concentration paved the way for more elegant wines" |
| 2017 | 3* | Decanter `wine-news/chile-2017-wine-harvest-is-hot-and-early-369078`; Decanter `wine-news/chile-2017-wine-harvest-is-hot-and-early-369078` | "2017 is clearly an atypical vintage, marked by extremely high temperatures" |
| 2018 | 5* | Decanter `wine-news/chile-harvest-2019-promising-vintage-but-yield-drops-across-chile-421785` | "Coming off of the back of what many consider the best vintage of the last decade" |
| 2019 | 4* | Decanter `wine-news/chile-harvest-2019-promising-vintage-but-yield-drops-across-chile-421785` | "Although winemakers consider 2019 a very good vintage in terms of quality" |
| 2022 | 4* | Vinous `articles/the-2022-harvest-in-chile-a-cool-dry-year-jun-2022`; Vinous `articles/the-2022-harvest-in-chile-a-cool-dry-year-jun-2022` | "are located, to produce a quality-focused vintage with fresh, red fruit" |
| 2023 | 3* | Vinous `articles/the-harvest-in-chile-a-two-sided-vintage-may-2023`; Vinous `articles/chile-a-recalibration-in-the-heartlands-of-maipo-jul-2026` | "saw the highest temperatures of the past 74 years" |
| 2024 | 4+ | Vinous `articles/chile-a-recalibration-in-the-heartlands-of-maipo-jul-2026`; Decanter `wine-news/chiles-2024-harvest-yields-lower-but-quality-high-530474` | "The 2024s are generally the most compelling." |

**chili_kust**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2017 | 4* | Decanter `wine-news/chile-2017-wine-harvest-is-hot-and-early-369078` | "Coastal regions were also buffered from the extreme heat." |
| 2018 | 5* | Decanter `wine-news/chile-harvest-2019-promising-vintage-but-yield-drops-across-chile-421785` | "Coming off of the back of what many consider the best vintage of the last decade" |
| 2019 | 4* | Decanter `wine-news/chile-harvest-2019-promising-vintage-but-yield-drops-across-chile-421785` | "Although winemakers consider 2019 a very good vintage in terms of quality" |
| 2021 | 3* | Vinous `articles/coastal-chile-an-unfamiliar-terroir-worth-exploring-oct-2025`; Vinous `articles/coastal-chile-an-unfamiliar-terroir-worth-exploring-oct-2025` | "In that sense, while 2021 was an excessively cool" |
| 2022 | 4* | Vinous `articles/the-2022-harvest-in-chile-a-cool-dry-year-jun-2022`; Vinous `articles/coastal-chile-an-unfamiliar-terroir-worth-exploring-oct-2025` | "which made for a wonderful harvest in Limar" |
| 2023 | 4* | Vinous `articles/coastal-chile-an-unfamiliar-terroir-worth-exploring-oct-2025`; Vinous `articles/the-harvest-in-chile-a-two-sided-vintage-may-2023`; Vinous `articles/the-harvest-in-chile-a-two-sided-vintage-may-2023` | "2023 is considered a fresh vintage, in contrast to the" |
| 2024 | 3* | Vinous `articles/coastal-chile-an-unfamiliar-terroir-worth-exploring-oct-2025` | "Two thousand twenty-four is considered to be a classic vintage with average" |

**corsica**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2017 | 3* | La Revue du Vin de France `vin-corse-millesime-degustation-avis-patrimonio-ajaccio-commentaires-notes,4589185.asp`; La Revue du Vin de France `vin-corse-millesime-degustation-avis-patrimonio-ajaccio-commentaires-notes,4589185.asp` | "Le millésime 2017 fut assez compliqué en Corse" |
| 2018 | 3* | La Revue du Vin de France `que-valent-les-vins-corses-du-millesime,4644700.asp`; La Revue du Vin de France `que-valent-les-vins-corses-du-millesime,4644700.asp` | "Le millésime 2018 est homogène." |

**dao_bairrada**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2011 | 5* | Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787` | "2017, 2016, 2015, 2012, 2011, 2008, 2005, 2004, 2003" |
| 2012 | 4* | Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787` | "2017, 2016, 2015, 2012, 2011, 2008, 2005, 2004, 2003" |
| 2014 | 2+ | Decanter `premium/regional-profile-bairrada-plus-top-wines-worth-seeking-out-446871`; World of Fine Wine `news-features/the-dao-finding-its-tao` | "We have been achieving full ripeness in Baga before autumn rains in every single vintage, save 2014." |
| 2015 | 5* | Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787` | "2017, 2016, 2015, 2012, 2011, 2008, 2005, 2004, 2003" |
| 2016 | 5* | Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787` | "2017, 2016, 2015, 2012, 2011, 2008, 2005, 2004, 2003" |
| 2017 | 5* | Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787`; Decanter `premium/regional-profile-dao-wines-worth-seeking-out-435787` | "which, fortunately, occurred after this excellent vintage" |
| 2020 | 4* | Decanter `premium/regional-profile-bairrada-plus-top-wines-worth-seeking-out-446871` | "2020 caps a decade of unprecedented harvests." |

**douro**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2009 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "There was a limited declaration" |
| 2009 | 3+ | World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest`; Decanter `premium/sogrape-legado-vertical-tasting-474786` | "An August temperature spike accelerated the ripening process and produced rich, ripe wines." |
| 2011 | 5* | World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "No shortage of oomph in this celebrated vintage." |
| 2011 | 5+ | World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest`; Decanter `premium/good-value-douro-reds-417806`; Wine Anorak `2025/07/25/the-douro-wines-of-sograpes-casa-de-ferreininha-including-barca-velha-portugals-m...` | "A much-acclaimed vintage produced statuesque Vintage Ports (a general declaration) and impressively concent..." |
| 2013 | 2+ | Decanter `premium/good-value-douro-reds-417806`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2013 Productive year. Promising until heavy late- September rains; flavour and tannin ripeness issues." |
| 2014 | 2* | World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "lacks the intensity and structure" |
| 2014 | 3+ | Decanter `premium/good-value-douro-reds-417806`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2014 Unsettled weather throughout the year and the wettest September for 80 years resulted in less concentr..." |
| 2015 | 4+ | Decanter `premium/good-value-douro-reds-417806`; Decanter `premium/chryseia-a-profile-of-portugals-icon-wine-and-new-releases-439311`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2015 An even year produced consistent, very balanced wines, with lovely fruit and smooth, ripe tannins." |
| 2016 | 4+ | Decanter `premium/good-value-douro-reds-417806`; Decanter `premium/douro-red-wines-panel-tasting-results-494591`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2016 A wet winter and spring, hot, dry summer and welcome mid-September showers produced favourable ripenin..." |
| 2017 | 4+ | Decanter `premium/good-value-douro-reds-417806`; Decanter `premium/the-douro-wines-an-evolution-423643`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2017 Exceptionally dry, warm and early (picking began in August). Flavour and tannin ripeness were advanced..." |
| 2018 | 4* | Decanter `premium/douro-red-wines-panel-tasting-results-494591` | "powerful wines from extremely dry and hot years like 2018, as well as more elegant wines from cooler vintag..." |
| 2018 | 3+ | Decanter `premium/good-value-douro-reds-417806`; Decanter `premium/douro-red-wines-panel-tasting-results-494591`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "2018 Extreme weather (drought, rainfall, hail, heat) scythed production. Low yields mean the best wines wil..." |
| 2019 | 4* | Decanter `premium/douro-red-wines-panel-tasting-results-494591` | "powerful wines from extremely dry and hot years like 2018, as well as more elegant wines from cooler vintag..." |
| 2019 | 4+ | Decanter `premium/douro-red-wines-panel-tasting-results-494591`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest`; World of Fine Wine `tasting-notes/the-douro-boys-luxury-of-time-20th-anniversary-tasting` | "included powerful wines from extremely dry and hot years like 2018, as well as more elegant wines from cool..." |
| 2020 | 3+ | Decanter `premium/douro-red-wines-panel-tasting-results-494591`; Decanter `premium/douro-red-wines-panel-tasting-results-494591`; World of Fine Wine `tasting-notes/niepoort-douro-wines-best-finest` | "while those who prefer a more vibrant and fruit-forward wine should look for bottles from 2020" |

**douro_port**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1963 | 5* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "A post-war classic. Superb wines" |
| 1966 | 5* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "the best on par with 1963" |
| 1970 | 5* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "Classic, tight-knit wines, some outstanding, that will will last a lifetime" |
| 1980 | 3* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "An underrated vintage that produced approachable, easygoing wines" |
| 1982 | 3* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "Forward and relatively fast-maturing, with soft, sweet character" |
| 1983 | 4* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "The best will last forever" |
| 1985 | 4* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "some emerged with serious faults. Buyer beware!" |
| 1987 | 3* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "A handful of shippers declared good wines for the medium term" |
| 1991 | 4* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "Soft and relatively early maturing" |
| 1992 | 5* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "big, rich and complete" |
| 1994 | 5* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "outstanding wines that are ripe and well structured" |
| 1995 | 2* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "some rather coarse, burnt wines with roasted coffee notes" |
| 1996 | 2* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "many of the wines tasted dilute" |
| 1997 | 3* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "well-structured wines" |
| 1998 | 3* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "Some excellent single-quinta Ports" |
| 1999 | 2* | Decanter `learn/vintage-guides/vintage-port/port-vintage-guide-380297` | "Prospects of an excellent year dashed by rain" |
| 2000 | 5* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "the best will last a lifetime" |
| 2001 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "Mid-weight wines, mostly single-quinta. Soft and supple now" |
| 2002 | 2* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "something of a damp squib due to a wet harvest" |
| 2003 | 5* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A long, hot summer produced ripe, opulent wines. Widely declared" |
| 2004 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A successful single-quinta year, well-balanced wines" |
| 2005 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "Powerful, concentrated single-quinta wines and a handful of outright declarations" |
| 2006 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "Variable year. Some good single-quinta wines for the medium term" |
| 2008 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "General quality will of course be quite varied" |
| 2009 | 4* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A hot year producing ripe, opulent wines" |
| 2010 | 2* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "An uneven year with generally high yields" |
| 2011 | 5* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "Universally declared, outstanding wines with poise and finesse" |
| 2012 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "Not generally declared but some very good single-quinta wines" |
| 2013 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A good year for single-quinta Ports" |
| 2014 | 2* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "The weakest year in a very strong decade for vintage Port" |
| 2015 | 4* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A limited declaration resulting in mostly single-quinta wines" |
| 2017 | 5* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A magnificent vintage, generally declared hard on the heels of 2016" |
| 2018 | 4* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "The fourth good year in a row, though more patchy than 2017" |
| 2019 | 4* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "A few classic declarations, as well as some very good single-quinta wines" |
| 2020 | 4* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "excellent wines produced in minute quantities" |
| 2021 | 3* | Decanter `learn/vintage-guides/port-vintage-guide-2000-2022-493922` | "very few classic declarations but some good single-quinta wines in prospect" |

**duitsland**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1971 | 5* | Decanter `learn/vintage-guides/germany/1971-vintage-guide-for-germany-117737` | "A great vintage, with best wines showing magnificent balance of richness and acidity" |
| 1975 | 5+ | Decanter `learn/vintage-guides/germany/1975-vintage-guide-for-germany-117503`; Vinous `articles/germany-2001-golden-october-nov-2002` | "An under-rated year although the Mosel produced a number of very good wines" |
| 1976 | 5+ | Decanter `learn/vintage-guides/germany/1976-vintage-guide-for-germany-117442`; Vinous `articles/germany-2003-extreme-riesling-jan-2005` | "An excellent vintage with very ripe, rich wines" |
| 1988 | 4+ | Decanter `learn/vintage-guides/germany/1988-vintage-guide-for-germany-116629`; Mosel Fine Wines `2008-retrospective-fruity-noble-sweet-riesling.php` | "Classic wines with excellent structure and complexity" |
| 1989 | 4* | Decanter `learn/vintage-guides/germany/1989-vintage-guide-for-germany-116545` | "A rich, ripe vintage but some wines lacked sufficient acidity to age well" |
| 1990 | 5* | Decanter `learn/vintage-guides/germany/1990-vintage-guide-for-germany-116455` | "A great vintage which produced rich and concentrated wines of impressive longevity" |
| 1993 | 4+ | Decanter `learn/vintage-guides/germany/1993-vintage-guide-for-germany-116182`; Mosel Fine Wines `moselfinewines-issue-65-apr-2023-is-out.php` | "A particularly fine vintage in the Mosel" |
| 1994 | 4+ | Decanter `learn/vintage-guides/germany/1994-vintage-guide-for-germany-116099`; Vinous `articles/germany-2003-extreme-riesling-jan-2005` | "A good year for Beerenauslese and Trockenbeerenauslese in the Rheingau and Pfalz" |
| 1995 | 4+ | Decanter `learn/vintage-guides/germany/1995-vintage-guide-for-germany-116000`; Mosel Fine Wines `2005-1995-retrospectives.php` | "A very successful vintage in the Mosel, producing both rich and racy wines" |
| 1996 | 4+ | Mosel Fine Wines `1996-riesling-retrospective-plenty-of-racy-freshness.php`; Decanter `learn/vintage-guides/germany/1996-vintage-guide-for-germany-115901` | "The vintage still drinks beautifully well today." |
| 1997 | 4+ | Decanter `learn/vintage-guides/germany/1997-vintage-guide-for-germany-115828`; Mosel Fine Wines `1997-riesling-retrospective-textbook-mosel-beauty.php`; Vinous `articles/germany-1999-generous-to-a-fault-jan-2001` | "A good vintage in every German wine growing region" |
| 1998 | 4+ | Decanter `learn/vintage-guides/germany/1998-vintage-guide-for-germany-115750`; Mosel Fine Wines `1998-riesling-retrospective-riesling-all-rounder.php` | "Variable quality. Very good Scheurebes and Spatburgunders from the Pfalz" |
| 1999 | 3+ | Vinous `articles/germany-1999-generous-to-a-fault-jan-2001`; Vinous `articles/germany-1999-generous-to-a-fault-jan-2001`; Decanter `learn/vintage-guides/germany/1999-vintage-guide-for-germany-115646` | "If there can be such a thing as too generous ripeness, then '99 must plead guilty" |
| 2000 | 2+ | Vinous `articles/germany-2000-rot-and-redemption-jan-2002`; Decanter `learn/vintage-guides/germany/2000-vintage-guide-for-germany-115602` | "The harvest in 2000 was thus a generally dismal and dispiriting affair, a race against rot" |
| 2001 | 5+ | Decanter `learn/vintage-guides/germany/2001-vintage-guide-for-germany-115445`; Mosel Fine Wines `moselfinewines-issue-56-apr-2021-is-out.php` | "A great year: clean, concentrated, structured wines worthy of aging" |
| 2002 | 4* | Decanter `learn/vintage-guides/germany/2002-vintage-guide-for-germany-115328` | "High levels of ripeness and fine acidity are the hallmarks of this vintage" |
| 2003 | 3* | Vinous `articles/joel-payne-on-germany-2005-jan-2007`; Vinous `articles/germany-2003-extreme-riesling-jan-2005` | "As 2003 was generally slightly overrated and 2004 wrongly underrated by pundits" |
| 2004 | 4+ | Decanter `learn/vintage-guides/germany/2004-vintage-guide-for-germany-115129`; Mosel Fine Wines `2015-dry-german-riesling-an-overview.php` | "Fresh, fruity white wines with pronounced aromas" |
| 2005 | 5+ | Mosel Fine Wines `2005-1995-retrospectives.php`; Decanter `learn/vintage-guides/germany/2005-vintage-guide-for-germany-115040`; Vinous `articles/joel-payne-on-germany-2005-jan-2007` | "Staggering level of quality of the fruity and dessert wines." |
| 2006 | 3+ | Decanter `learn/vintage-guides/germany/2006-vintage-guide-for-germany-114952`; Mosel Fine Wines `2006-riesling-retrospective.php` | "Looks like a classic vintage for those who waited before picking but those who didn" |
| 2007 | 5+ | Decanter `learn/vintage-guides/germany/2007-vintage-guide-for-germany-114901`; Mosel Fine Wines `2007-retrospective-fruity-noble-sweet-riesling.php`; Vinous `articles/joel-payne-on-germany-2007-jan-2009` | "Outstanding wines in all quality levels, showing a fine balance of ripeness, fruity acidity and mineral fla..." |
| 2008 | 4+ | Decanter `learn/vintage-guides/germany/2008-vintage-guide-for-germany-114817`; Mosel Fine Wines `2008-dry-off-dry-riesling-retrospective.php` | "Cool vintage favouring Kabinett/Spätlese ripeness levels" |
| 2009 | 5+ | Vinous `articles/germany-2009-everybody-s-darling-jan-2011`; World of Fine Wine `2014/02/09/2009-german-vintage-report-4204462`; Mosel Fine Wines `2009-retrospective-fruity-noble-sweet-riesling.php` | "This does look to be a great vintage for Germany: pure, rich and well-balanced." |
| 2010 | 4+ | Vinous `articles/germany-2010-jan-2012`; Mosel Fine Wines `moselfinewines-issue-50-apr-2020-is-out.php` | "Although many, if not most, of the 2010s are at best mediocre in quality, what is good is extremely good" |
| 2011 | 4+ | Vinous `articles/germany-2011-jan-2013`; Mosel Fine Wines `moselfinewines-issue-56-apr-2021-is-out.php` | "many wines appear somewhat broad-shouldered or overly unctuous and lack the refreshing crispness" |
| 2012 | 4* | Vinous `articles/germany-2012-jan-2014`; Vinous `articles/germany-2012-jan-2014` | "it is an exceptional year for dry wines, especially the rieslings" |
| 2013 | 3+ | Vinous `articles/2013-germany-mar-2015`; Mosel Fine Wines `moselfinewines-issue-65-apr-2023-is-out.php` | "the tip of the iceberg was exceptional but the broad mass of wines is considerably less interesting" |
| 2014 | 3* | Mosel Fine Wines `vintage-2014-a-look-back.php`; Mosel Fine Wines `vintage-2014-a-look-back.php`; Mosel Fine Wines `moselfinewines-issue-70-apr-2024-is-out.php` | "we have never experienced such a heterogeneous vintage in the Mosel" |
| 2015 | 5* | Mosel Fine Wines `moselfinewines-issue-75-apr-2025-is-out.php`; Mosel Fine Wines `2015-mosel-vintage-land-of-plenty.php` | "2015 turned out a to be a hugely successful vintage across the board" |
| 2016 | 4* | Mosel Fine Wines `moselfinewines-issue-80-apr-2026-is-out.php`; Mosel Fine Wines `2016-mosel-vintage-victory-from-the-jaws-of-defeat.php`; Mosel Fine Wines `2016-dry-german-riesling-an-overview.php` | "2016 turned out to be rounder vintage but one with impeccable balance at the top." |
| 2017 | 4* | Mosel Fine Wines `2017-mosel-vintage-small-but-beautiful.php`; Mosel Fine Wines `2017-dry-german-riesling-an-overview.php` | "The vintage is a stunner at the top and generated some of the finest Riesling ever made." |
| 2018 | 4+ | Decanter `premium/grosses-gewachs-german-riesling-2018-pinot-noir-and-silvaner-423742`; Decanter `premium/grosses-gewachs-german-riesling-2018-pinot-noir-and-silvaner-423742`; Mosel Fine Wines `2018-mosel-vintage-kissed-by-the-sun.php` | "There are hardly any bad wines, many decent wines and very few outstanding wines." |
| 2019 | 5* | Mosel Fine Wines `moselfinewines-issue-53-aug-2020-is-out.php` | "2019 was anything but easy ... but at the top, the vintage is epic" |
| 2020 | 4* | Mosel Fine Wines `moselfinewines-issue-59-nov-2021-is-out.php`; Mosel Fine Wines `moselfinewines-issue-57-jul-2021-is-out.php` | "2020 proved a contrasted vintage with some stunners at the top but caution is needed." |
| 2021 | 5* | Mosel Fine Wines `moselfinewines-issue-62-jun-2022-is-out.php`; Mosel Fine Wines `moselfinewines-issue-60-feb-2022-is-out.php` | "The 2021 proved marked by rain and cool weather and yet delivered some absolute stunner" |
| 2022 | 4+ | Mosel Fine Wines `moselfinewines-issue-66-jun-2023-is-out.php`; Vinous `articles/2022-mosel-saar-ruwer-old-vines-and-steep-challenges-oct-2023` | "the vintage turned out unexpectedly classic and delivered some stunners" |
| 2023 | 4+ | Vinous `articles/rheinhessen-rheingau-riesling-triumphs-after-rain-oct-2024`; Mosel Fine Wines `moselfinewines-issue-71-jun-2024-is-out.php` | "Rheingau and Rheinhessen produced world-class Rieslings in 2023." |
| 2024 | 4+ | Mosel Fine Wines `moselfinewines-issue-76-jul-2025-is-out.php`; Vinous `articles/2024-mosel-saar-and-ruwer-tales-of-woe-and-wow-oct-2025` | "2024 is a truly great vintage in the making!" |
| 2025 | 4* | Vinous `articles/2025-rheingau-pfalz-energy-ripeness-brilliance-and-speed-aug-2026`; Vinous `articles/2025-rheingau-pfalz-energy-ripeness-brilliance-and-speed-aug-2026` | "the 2025 growing season yielded brilliant and juicy Rieslings full of energy and ripeness" |

**jura**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2011 | 4* | Decanter `premium/regional-profile-jura-wines-396704` | "On the plus-side, 2011, 2015 and 2016 were very good to excellent." |
| 2012 | 2* | Decanter `premium/regional-profile-jura-wines-396704` | "quantity and quality were both compromised in 2012, 2013 and 2014 by rain, mildew and the Drosophila suzuki..." |
| 2013 | 2* | Decanter `premium/regional-profile-jura-wines-396704` | "quantity and quality were both compromised in 2012, 2013 and 2014 by rain, mildew and the Drosophila suzuki..." |
| 2014 | 2* | Decanter `premium/regional-profile-jura-wines-396704` | "quantity and quality were both compromised in 2012, 2013 and 2014 by rain, mildew and the Drosophila suzuki..." |
| 2015 | 4* | Decanter `premium/regional-profile-jura-wines-396704` | "On the plus-side, 2011, 2015 and 2016 were very good to excellent." |
| 2016 | 4* | Decanter `premium/regional-profile-jura-wines-396704` | "On the plus-side, 2011, 2015 and 2016 were very good to excellent." |
| 2017 | 4+ | Vinous `articles/jura-nature-hits-hard-but-the-wines-fight-back-sep-2025`; La Revue du Vin de France `vin-savoie-degustation-millesime-avis-notes-commentaires-achats-conseils,4593738.asp` | "The 2017s are marked by elegance and restraint, with a refined profile that generally avoids excess." |
| 2018 | 4+ | La Revue du Vin de France `2018-dans-le-jura-le-millesime-du-grand-sourire,4635818.asp`; La Revue du Vin de France `2018-dans-le-jura-le-millesime-du-grand-sourire,4635818.asp`; Vinous `articles/jura-nature-hits-hard-but-the-wines-fight-back-sep-2025` | "Le niveau moyen de notre dégustation s’avère quoi qu’il en soit fort élevé" |
| 2019 | 4* | iDealwine `les-notes-du-millesime-2019` | "La qualité des vins, blancs comme rouges, est au moins au niveau des 2018" |
| 2020 | 4+ | iDealwine `les-notes-du-millesime-2020`; Vinous `articles/bonjour-jura-aug-2024` | "Millésime solaire, sans toutefois l’être autant que 2015 ou 2018" |
| 2021 | 3+ | Vinous `articles/bonjour-jura-aug-2024`; iDealwine `les-notes-du-millesime-2021` | "Jura reds from 2021 are good at best, with only a handful" |
| 2022 | 4+ | Vinous `articles/bonjour-jura-aug-2024`; iDealwine `les-notes-du-millesime-2022` | "White wines in 2022 are more of a mixed bag, with some lacking acidity," |
| 2023 | 4+ | Vinous `articles/jura-nature-hits-hard-but-the-wines-fight-back-sep-2025`; iDealwine `les-notes-du-millesime-2023` | "I can confirm a good to very good overall vintage for both whites and reds." |

**languedoc**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 4* | James Suckling `wine-tasting-reports/languedoc-roussillon-annual-report-rising-ambitions-and-an-ocean-of-cho...` | "with 2016 impressing the most and 2018 proving to be more polished than generally acknowledged" |
| 2017 | 4* | La Revue du Vin de France `vin-languedoc-millesime-analyse-degustation-notes-verdict-conseils-achat,4590925.asp`; La Revue du Vin de France `vin-languedoc-millesime-analyse-degustation-notes-verdict-conseils-achat,4590925.asp` | "Peu de vins, mais des flacons de grandes qualités" |
| 2018 | 3* | La Revue du Vin de France `millesime-en-languedoc-la-syrah-domine-limoux-se-place,4627609.asp`; La Revue du Vin de France `millesime-en-languedoc-la-syrah-domine-limoux-se-place,4627609.asp` | "s’il est à ranger dans la catégorie des bons millésimes, 2018 frappe par son hétérogénéité" |
| 2019 | 4+ | James Suckling `wine-tasting-reports/languedoc-roussillon-annual-report-rising-ambitions-and-an-ocean-of-cho...`; iDealwine `les-notes-du-millesime-2019` | "2020 was a top-caliber, warm vintage and 2019 was similar in quality but with more power that needs to settle" |
| 2020 | 5+ | Decanter `premium/languedoc-report-2023-latest-releases-tasted-515229`; James Suckling `wine-tasting-reports/languedoc-roussillon-annual-report-rising-ambitions-and-an-ocean-of-cho...` | "2020 was another hot and dry year, and is widely regarded as one of the best in recent times across many ap..." |
| 2021 | 3+ | Decanter `premium/languedoc-report-2023-latest-releases-tasted-515229`; La Revue du Vin de France `languedoc-roussillon-quels-vins-des-millesimes-2021-et-2022-privilegier,4819412.asp` | "Languedoc 2021 vintage rating: 3.5 / 5" |
| 2022 | 4+ | Decanter `premium/languedoc-report-2023-latest-releases-tasted-515229`; La Revue du Vin de France `languedoc-roussillon-quels-vins-des-millesimes-2021-et-2022-privilegier,4819412.asp` | "Languedoc 2022 vintage rating: 4.5 / 5" |
| 2023 | 3+ | Decanter `premium/languedoc-under-the-lens-2022-and-2023-vintages-560506`; iDealwine `les-notes-du-millesime-2023` | "The whites are mixed, I found many to be too chewy and tannic, while the successes were mineral and herbal." |

**loire**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1989 | 5+ | Decanter `wine/wine-regions/loire/regional-profile-anjou-saumur-248168`; Decanter `magazine/loire-grapes-red-and-white-varietals-249463`; Vinous `articles/focus-on-loire-valley-chenin-blanc-dec-2014` | "Hot summer and fine autumn. One of the great vintages of the 20th century." |
| 1990 | 4+ | Decanter `wine/wine-regions/loire/regional-profile-anjou-saumur-248168`; Decanter `magazine/loire-grapes-red-and-white-varietals-249463`; Vinous `articles/cellar-favorite-1990-domaine-philippe-foreau-clos-naudin-vouvray-moelleux-goutte-d-...` | "Attractive wines but without the ageing potential of 1989." |
| 1996 | 5+ | Decanter `wine/wine-regions/loire/regional-profile-anjou-saumur-248168`; Vinous `articles/best-new-wines-from-the-loire-valley-nov-1998`; Decanter `magazine/loire-grapes-red-and-white-varietals-249463` | "A classic Loire vintage. Overall probably the best vintage of the 1990s." |
| 1997 | 4+ | Decanter `wine/wine-regions/loire/regional-profile-anjou-saumur-248168`; Vinous `articles/best-new-wines-from-the-loire-valley-nov-1998`; Vinous `articles/best-new-wines-from-the-loire-valley-nov-1998` | "Very appealing red wines and some especially fine sweet wines." |
| 2002 | 4+ | Decanter `wine-news/loire-vintage-report-100888`; Decanter `wine-news/loire-vintage-report-100888`; Vinous `articles/2002-loire-valley-sauvignon-blancs-mar-2004` | "The 2002 vintage in the Loire is surprisingly good." |
| 2003 | 3+ | Decanter `wine-news/loire-vintage-report-100888`; Decanter `wine/wine-regions/loire/regional-profile-anjou-saumur-248168`; Vinous `articles/sancerre-taking-the-temperature-aug-2021` | "The 2003s have opulent fruit, often high alcohol and significantly lower acidity than normal. While good fo..." |
| 2005 | 5+ | Decanter `features/red-loire-2005-vintage-report-247669`; Decanter `features/red-loire-2005-vintage-report-247669`; Vinous `articles/loire-valley-cabernet-franc-dec-2014` | "Red Loire 2005 is a fantastic vintage" |
| 2007 | 3* | Vinous `articles/focus-on-loire-valley-sauvignon-blanc-mar-2010`; Vinous `articles/focus-on-loire-valley-sauvignon-blanc-mar-2010`; Vinous `articles/best-new-wines-from-the-central-loire-may-2010` | "a good but generally not outstanding vintage like 2007 at prices close to those of the great 2005s" |
| 2008 | 4+ | Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/focus-on-loire-valley-sauvignon-blanc-mar-2010` | "2008 Saved by Indian summer. Precise, balanced and long lived." |
| 2009 | 3+ | Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/cellar-favorite-2009-francois-cotat-sancerre-les-culs-de-beaujeu-aug-2021` | "2009 Hot year, rich wines. Not as ageworthy as ’08 or ’10." |
| 2010 | 4+ | Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/focus-on-loire-valley-chenin-blanc-dec-2014` | "2010 Long, hot autumn. Classic, with higher acidity than ’09." |
| 2011 | 3+ | Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/loire-valley-cabernet-franc-dec-2014`; Vinous `articles/loire-valley-sauvignon-blanc-sep-2014` | "2011 Early vintage, rot a problem. Drink these before your 2008s and 2010s." |
| 2013 | 2+ | Decanter `premium/loire-cabernet-franc-panel-tasting-results-398131`; Vinous `articles/loire-valley-sauvignon-blanc-sep-2014`; Decanter `premium/loire-2021-vintage-report-top-whites-from-2020-and-2021-481010` | "2013 Cold spring, very late flowering, least good for many years. Lack of ripeness – avoid." |
| 2014 | 3* | Vinous `articles/big-love-for-loire-jul-2020` | "the vintages from 2015 to 2018 are strong, and 2018 is considered exceptional" |
| 2014 | 4+ | Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/2014-2015-muscadet-contrasting-vintages-ripe-for-discovery-may-2017` | "2014 Very good vintage saved by hot September. Classic wines with high acidity." |
| 2015 | 4* | Vinous `articles/big-love-for-loire-jul-2020`; Vinous `articles/cellar-favorite-1990-domaine-philippe-foreau-clos-naudin-vouvray-moelleux-goutte-d-...` | "the vintages from 2015 to 2018 are strong, and 2018 is considered exceptional" |
| 2015 | 4+ | Decanter `premium/loire-cabernet-franc-panel-tasting-results-398131`; Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/2014-2015-muscadet-contrasting-vintages-ripe-for-discovery-may-2017` | "2015 Warm year producing powerful,ripe wines, if a smallish crop." |
| 2016 | 4+ | Decanter `premium/loire-cabernet-franc-panel-tasting-results-398131`; Decanter `premium/top-dry-loire-chenin-blanc-353130`; Vinous `articles/big-love-for-loire-jul-2020` | "2016 Many parts hit by frosts, up to 100% loss. Also mildew. Small crop but good quality wines." |
| 2018 | 5* | Vinous `articles/big-love-for-loire-jul-2020` | "the vintages from 2015 to 2018 are strong, and 2018 is considered exceptional" |
| 2018 | 5+ | Decanter `premium/loire-whites-2022-plus-top-new-releases-504810`; Vinous `articles/big-love-for-loire-jul-2020` | "Hailed as a great vintage, which generally combined quality and quantity, although the alcohols on some whi..." |
| 2019 | 4* | Decanter `premium/loire-2019-vintage-overview-436849`; Decanter `premium/loire-2019-vintage-overview-436849` | "Incredibly 2019 is the sixth successive good to very good quality vintage in the Loire" |
| 2019 | 4+ | Decanter `premium/loire-2019-vintage-overview-436849`; Decanter `premium/loire-valley-2023-vintage-report-white-wines-and-the-best-new-releases-542456`; Vinous `articles/sancerre-taking-the-temperature-aug-2021` | "Incredibly 2019 is the sixth successive good to very good quality vintage in the Loire, in a continuous run..." |
| 2020 | 4+ | Decanter `premium/loire-whites-2022-plus-top-new-releases-504810`; Vinous `articles/sancerre-taking-the-temperature-aug-2021`; Vinous `articles/chenin-blanc-wait-a-sec-sep-2022` | "Another hot vintage with many good, concentrated wines but also some that lack freshness and zip." |
| 2021 | 3+ | Decanter `premium/loire-whites-2022-plus-top-new-releases-504810`; Decanter `premium/loire-valley-2023-vintage-report-white-wines-and-the-best-new-releases-542456`; Vinous `articles/loire-chenin-dividing-lines-oct-2023` | "Despite some early doubts there are some lovely whites, though quality is variable and volume severely down..." |
| 2022 | 4+ | Decanter `premium/loire-whites-2022-plus-top-new-releases-504810`; Decanter `premium/loire-whites-2022-plus-top-new-releases-504810`; Vinous `articles/loire-chenin-blanc-chaume-the-way-jul-2024` | "2022 is a very good quality vintage across the board. Some are hailing it as one of the great years" |
| 2023 | 3* | Vinous `articles/loire-chenin-blanc-chaume-the-way-jul-2024` | "2023 was a soggy season that left growers in despair: powdery" |
| 2023 | 3+ | Decanter `premium/loire-valley-2023-vintage-report-white-wines-and-the-best-new-releases-542456`; Vinous `articles/the-mighty-ducks-2023-loire-valley-reds-aug-2025`; Vinous `articles/the-mighty-ducks-2023-loire-valley-reds-aug-2025` | "One of the most complicated vintages in recent memory, testing the abilities and resilience of vignerons th..." |

**nieuwzeeland**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2017 | 3* | Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081` | "2023 4/5 2022 3/5 2021 5/5 2020 5/5 2019 5/5 2018 3/5 2017 3/5 2016 4/5" |
| 2018 | 3+ | Vinous `articles/new-zealand-reds-treading-lightly-apr-2022`; Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081` | "After a middling 2018 season, 2019 is being talked up" |
| 2019 | 4+ | Vinous `articles/new-zealand-reds-treading-lightly-apr-2022`; Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081` | "2019, 2020 and 2021 are Hawke's Bay's answer to 1988, 1989 and 1990 in Bordeaux" |
| 2020 | 4+ | Vinous `articles/new-zealand-whites-the-state-of-play-nov-2020`; Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081` | "2020 was a Goldilocks season: not too hot, not too cold" |
| 2021 | 5+ | Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081`; Vinous `articles/2023-new-zealand-whites-the-cyclone-vintage-apr-2024` | "2023 4/5 2022 3/5 2021 5/5 2020 5/5 2019 5/5 2018 3/5 2017 3/5 2016 4/5" |
| 2022 | 3+ | Vinous `articles/2023-new-zealand-whites-the-cyclone-vintage-apr-2024`; Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081` | "2022 was neither the most fun of vintages to make nor to taste" |
| 2023 | 3+ | Decanter `premium/new-zealand-pinot-noir-vintage-report-and-40-new-releases-rated-540081`; Vinous `articles/2023-new-zealand-whites-the-cyclone-vintage-apr-2024` | "2023 4/5 2022 3/5 2021 5/5 2020 5/5 2019 5/5 2018 3/5 2017 3/5 2016 4/5" |

**oostenrijk**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1999 | 5* | Vinous `articles/austria-outstanding-abundant-1999s-nov-2000` | "will stand alongside the wines of '86, '90 and '97 as benchmarks of quality and complexity" |
| 2000 | 4* | Vinous `articles/austria-2000-extreme-often-excellent-nov-2001` | "Danubian growers have delivered a vintage of quite high overall quality, especially when it comes to riesling" |
| 2002 | 4* | Vinous `articles/austria-s-amiable-2002s-nov-2003`; Vinous `articles/austria-s-amiable-2002s-nov-2003` | "Certainly the top rieslings exhibit more spine and nerve than those of 2000" |
| 2006 | 5* | Vinous `articles/austria-06-the-year-of-gruner-veltliner-nov-2007`; Vinous `articles/austria-06-the-year-of-gruner-veltliner-nov-2007` | "one vintner known for his cautious skepticism actually described 2006 as" |
| 2007 | 4* | Vinous `articles/austria-2007-light-fresh-and-classic-nov-2008`; Vinous `articles/austria-2007-light-fresh-and-classic-nov-2008` | "the dry whites from Lower Austria from the 2007 vintage possess less power and body than usual" |
| 2011 | 4* | Vinous `articles/vintages-of-paradox-and-mystery-in-germany-and-austria-jan-2019`; Vinous `articles/austria-2012-and-2011-dec-2013` | "The abundant crop of 2011 is associated there with only modest quality" |
| 2012 | 4* | Vinous `articles/austria-2012-and-2011-dec-2013` | "most growers praised the lower levels of alcohol in the 2012s and the refreshing nerve that the 2011s often..." |
| 2013 | 5* | Vinous `articles/2013-a-great-vintage-for-austrian-riesling-and-gruner-veltliner-nov-2015` | "Rieslings and Grüner Veltliners display exceptionally bright acidity, clear flavor definition and uncanny c..." |
| 2015 | 5* | Vinous `articles/austria-s-2015-rieslings-gruner-veltliners-ripe-ready-feb-2017` | "overflows with generous, lovely wines that belie mid-summer drought and record-setting heat" |
| 2016 | 4* | Vinous `articles/austrian-riesling-gruner-veltliner-up-to-the-challenges-of-2016-oct-2018` | "sleek, invitingly fragrant wines of intricacy, charm and alcoholic moderation. The best are often more exci..." |
| 2019 | 5* | Decanter `premium/austrian-gruner-veltliner-top-wines-from-2019-2020-and-2021-484690` | "2019 saw an early harvest of healthy grapes after a warm summer and mild autumn." |
| 2020 | 4* | Decanter `premium/austrian-gruner-veltliner-top-wines-from-2019-2020-and-2021-484690` | "hail in the Wachau severely reduced the crop, but the wines turned out well, with fine acidity and ample fr..." |
| 2021 | 5+ | Decanter `premium/austrian-gruner-veltliner-top-wines-from-2019-2020-and-2021-484690`; Vinous `articles/2022-wachau-and-lower-austria-an-overshadowed-vintage-worth-exploring-feb-2024` | "2021 was potentially the best of the trio after a fine September" |
| 2022 | 4* | Vinous `articles/2022-wachau-and-lower-austria-an-overshadowed-vintage-worth-exploring-feb-2024`; Vinous `articles/2022-wachau-and-lower-austria-an-overshadowed-vintage-worth-exploring-feb-2024` | "When tasting 2022 and 2021 side by side, it is evident that 2021 stands out." |
| 2023 | 4+ | Vinous `articles/2023-wachau-and-lower-austria-mercurial-weather-gods-smiled-in-the-end-jul-2024`; Vinous `articles/2023-wachau-and-lower-austria-mercurial-weather-gods-smiled-in-the-end-jul-2024`; World of Fine Wine `news-features/austrias-best-single-vineyard-wines` | "2023 tops 2022 but does not quite reach the level of 2021 in all respects" |
| 2024 | 3+ | Vinous `articles/2024-wachau-and-lower-austria-calamities-and-coups-de-coeur-jun-2025`; Vinous `articles/2024-wachau-and-lower-austria-calamities-and-coups-de-coeur-jun-2025`; World of Fine Wine `news-features/austrias-best-single-vineyard-wines` | "Quality is thus more mixed in 2024, yet there are plenty of highlights and coups de coeur nonetheless." |

**oregon**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2017 | 4* | Vinous `articles/oregon-s-2019-pinot-noirs-a-return-to-classicism-feb-2022` | "a noteworthy vintage for the great number of bright, well-structured wines that were produced despite the h..." |
| 2019 | 5+ | Vinous `articles/oregon-s-2019-pinot-noirs-a-return-to-classicism-feb-2022`; Decanter `premium/oregon-vintage-report-tricky-willamette-valley-2022-sticks-the-landing-534893` | "epic Pinot Noirs of noteworthy elegance and energy" |
| 2020 | 1+ | Vinous `articles/oregon-s-2019-pinot-noirs-a-return-to-classicism-feb-2022`; Vinous `articles/oregon-s-2019-pinot-noirs-a-return-to-classicism-feb-2022`; Decanter `premium/oregon-vintage-report-tricky-willamette-valley-2022-sticks-the-landing-534893` | "numerous producers opted not to make any red wines at all from the Pinot Noir crop and simply walked away f..." |
| 2021 | 5* | Vinous `articles/sitting-pretty-oregon-s-new-release-pinot-noir-chardonnay-and-beyond-jan-2024` | "Despite some early worries, the 2021 vintage turned out to be fantastic." |
| 2022 | 4+ | Decanter `premium/oregon-vintage-report-tricky-willamette-valley-2022-sticks-the-landing-534893`; Vinous `articles/oregon-2022-the-rollercoaster-vintage-aug-2024` | "2022 5/5 A cool and wet spring, including an early April frost" |
| 2023 | 3* | Vinous `articles/unpacking-oregon-s-multi-faceted-2023-vintage-jul-2025`; Vinous `articles/unpacking-oregon-s-multi-faceted-2023-vintage-jul-2025` | "Although it is not a consistently excellent year, many winemakers achieved greatness" |
| 2024 | 4* | Vinous `articles/willamette-valley-returns-to-classicism-the-2024-vintage-jul-2026` | "This is a vintage to be excited about" |

**piemonte**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2004 | 5+ | Vinous `articles/2004-barolo-the-cream-rises-to-the-top-may-2015`; Vinous `articles/2004-barolo-the-cream-rises-to-the-top-may-2015`; Decanter `premium/rating-the-barolo-vintages-of-the-noughties-540485` | "one of the all-time great vintages for Barolo" |
| 2005 | 3+ | Vinous `articles/2005-barolo-a-dark-horse-emerges-jul-2016`; Decanter `premium/rating-the-barolo-vintages-of-the-noughties-540485` | "the best 2005 Barolos are showing all of their pedigree" |
| 2006 | 5* | Vinous `articles/2006-barolo-a-modern-day-classic-in-the-making-feb-2010`; Vinous `articles/2004-barolo-the-cream-rises-to-the-top-may-2015` | "The 2006 Barolos are big, powerful wines the" |
| 2008 | 5+ | Vinous `articles/a-look-back-at-the-2008-barolos-may-2014`; Decanter `premium/rating-the-barolo-vintages-of-the-noughties-540485` | "utterly magnificent, profound wines that represent a new" |
| 2014 | 3+ | Vinous `articles/2014-barolo-surprise-surprise-feb-2018`; Vinous `articles/2014-barbaresco-an-october-surprise-oct-2017`; Decanter `premium/piedmont-wine-vintage-guide-459396` | "the finest 2014s are some of the most thrilling young Barolos I have ever tasted" |
| 2017 | 3+ | Vinous `articles/2017-barolo-here-we-go-again-feb-2021`; World of Fine Wine `homepage-featured-articles/barolo-2017` | "the 2017s are mid-weight Barolos with the classic structure of Nebbiolo" |
| 2018 | 2+ | Vinous `articles/the-enigma-of-2018-barolo-feb-2022`; Vinous `articles/the-enigma-of-2018-barolo-feb-2022`; Vinous `articles/the-2018-barolos-part-2-oct-2022` | "the most erratic, frustratingly inconsistent Barolo vintage I have encountered" |
| 2019 | 4+ | Vinous `articles/2019-barolo-back-on-track-jan-2023`; World of Fine Wine `homepage-featured-articles/2019-barolo-best-five-wines`; Decanter `premium/piedmont-wine-vintage-guide-459396` | "with a stellar vintage in 2019" |

**priorat**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2015 | 5* | Vinous `articles/mediterranean-spain-where-to-start-mar-2021` | "An outstanding vintage, by any measure and especially for those who like to hold their wines for long aging" |
| 2016 | 5* | Vinous `articles/mediterranean-spain-where-to-start-mar-2021` | "it was an outstanding year overall. Numerous wines are truly top-drawer" |
| 2017 | 3* | Vinous `articles/mediterranean-spain-where-to-start-mar-2021` | "This is by no means a homogenous vintage." |
| 2018 | 4* | Vinous `articles/mediterranean-spain-where-to-start-mar-2021`; Vinous `articles/mediterranean-spain-where-to-start-mar-2021` | "a very good to outstanding vintage for regions across its Mediterranean rim" |
| 2021 | 4+ | Vinous `articles/sun-limestone-and-heritage-exploring-catalunya-and-levante-nov-2025`; Decanter `premium/priorat-2021-vs-2022-panel-tasting-results-574712`; Decanter `premium/priorat-an-enthralling-new-wave-arises-543893` | "The 2021 reds are concentrated but balanced" |
| 2022 | 3+ | Vinous `articles/sun-limestone-and-heritage-exploring-catalunya-and-levante-nov-2025`; Vinous `articles/sun-limestone-and-heritage-exploring-catalunya-and-levante-nov-2025`; Decanter `premium/priorat-2021-vs-2022-panel-tasting-results-574712` | "Most of the 2022s, in contrast, show signs of uneven ripeness and rustic tannins alongside marked concentra..." |
| 2023 | 3* | Vinous `articles/sun-limestone-and-heritage-exploring-catalunya-and-levante-nov-2025` | "the wines achieved good balance, though they are still more concentrated than usual" |
| 2024 | 3* | Vinous `articles/sun-limestone-and-heritage-exploring-catalunya-and-levante-nov-2025` | "Relief came in 2024, but the reds still bear the scars of the previous three years." |

**provence**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 3* | Decanter `premium/bandol-regional-profile-20-top-wines-482329` | "Good quality, although a slightly smaller vintage and not regarded as a great one." |
| 2017 | 4* | Decanter `premium/bandol-regional-profile-20-top-wines-482329` | "the fruit was expressive, although volumes were reduced" |
| 2018 | 2+ | La Revue du Vin de France `provence-quel-millesime-privilegier-entre-2018-2019-et-2020,4804251.asp`; La Revue du Vin de France `provence-quel-millesime-privilegier-entre-2018-2019-et-2020,4804251.asp`; Decanter `premium/bandol-regional-profile-20-top-wines-482329` | "2018 est un millésime bien en-dessous de ses cadets" |
| 2019 | 5+ | La Revue du Vin de France `provence-quel-millesime-privilegier-entre-2018-2019-et-2020,4804251.asp`; Decanter `premium/bandol-regional-profile-20-top-wines-482329` | "2019 est un grand millésime pour les vins rouges et blancs de Provence." |
| 2020 | 5+ | Vinous `articles/the-delights-of-southern-france-may-2026`; La Revue du Vin de France `provence-quel-millesime-privilegier-entre-2018-2019-et-2020,4804251.asp`; Decanter `premium/bandol-regional-profile-20-top-wines-482329` | "Vintage 2020 is a benchmark year for Bandol reds." |
| 2021 | 3+ | Vinous `articles/the-delights-of-southern-france-may-2026`; Decanter `premium/bandol-regional-profile-20-top-wines-482329`; La Revue du Vin de France `en-provence-quels-millesimes-privilegier-entre-2020-2021-et-2022,4834938.asp` | "The reds show a restrained, austere style." |
| 2022 | 4+ | Vinous `articles/the-delights-of-southern-france-may-2026`; iDealwine `les-notes-du-millesime-2022` | "the wines repeatedly show more freshness than expected" |
| 2023 | 3+ | Vinous `articles/the-delights-of-southern-france-may-2026`; iDealwine `les-notes-du-millesime-2023` | "the reds often show slightly firmer than usual tannins that will need time to resolve in bottle" |
| 2024 | 3* | Vinous `articles/the-delights-of-southern-france-may-2026` | "The wines show a more classical register, with elegance and restraint taking precedence." |

**sauternes**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 1983 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; The Wine Cellar Insider `wine-topics/bordeaux-wine-buying-guide-tasting-notes-ratings/bordeaux-wine-detailed-vintage-...` | "A very late vintage produced some truly classic wines" |
| 1986 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `magazine/dicing-with-the-devil-249950` | "The wines are rich and complex, but many lack acidity and finesse." |
| 1986 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Many rich and complex wines" |
| 1988 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/focus-on-sauternes-jul-1998`; Vinous `articles/focus-on-sauternes-jul-1998` | "An outstanding vintage with a large number of richly classic wines" |
| 1989 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/focus-on-sauternes-jul-1998` | "An excellent vintage of power and concentration" |
| 1990 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/focus-on-sauternes-jul-1998`; The Wine Cellar Insider `wine-topics/bordeaux-wine-buying-guide-tasting-notes-ratings/bordeaux-wine-detailed-vintage-...` | "A very fine vintage; the best are sensational" |
| 1995 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A classic vintage with many very fine wines" |
| 1995 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A classic vintage with many very fine wines" |
| 1996 | 4+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/focus-on-sauternes-jul-1998`; Vinous `articles/1997-and-1996-sauternes-jul-1999` | "A high quality vintage with rich and concentrated wines" |
| 1997 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; The Wine Cellar Insider `wine-topics/bordeaux-wine-buying-guide-tasting-notes-ratings/bordeaux-wine-detailed-vintage-...`; Vinous `articles/1997-and-1996-sauternes-jul-1999` | "The finest vintage since 1990. Many excellent wines" |
| 1998 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Rain caused problems throughout the vintage but a number of excellent wines were produced nevertheless" |
| 1999 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A very fine vintage of classic quality" |
| 2001 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; The Wine Cellar Insider `wine-topics/bordeaux-wine-buying-guide-tasting-notes-ratings/bordeaux-wine-detailed-vintage-...`; Vinous `articles/stand-and-deliver-2001-sauternes-sep-2021` | "A very great vintage, with wonderful succulence and aromatic complextity." |
| 2002 | 3+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/2003-and-2002-sauternes-and-barsacs-jul-2005` | "Light with little botrytis so drink early" |
| 2003 | 4+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/2003-and-2002-sauternes-and-barsacs-jul-2005` | "ripe, powerful, concentrated sweet wines with excellent botrytis expression and aging potential" |
| 2004 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A small quantity of quality botrytised wine will be produced but this will not be considered a great year." |
| 2004 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Balanced wine rich in botrytis from better producers who selected for noble rot affected fruit" |
| 2005 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/2007-and-2005-sauternes-and-barsacs-jul-2008` | "Everything came together beautifully in 2005, and in terms of power and elegance" |
| 2006 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A challenging harvest but with potential." |
| 2006 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "A challenging harvest but with potential. The successes are impressively pure, fresh and complex" |
| 2007 | 4+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/2007-and-2005-sauternes-and-barsacs-jul-2008`; Vinous `articles/looking-back-2007-sauternes-oct-2022` | "Outstanding vintage that combines richness and purity with balance and breed." |
| 2008 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "are fresh and elegant but ultimately lack concentration and depth" |
| 2008 | 2* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "The best wines – from the top terroirs – are fresh and elegant but ultimately lack concentration and depth." |
| 2009 | 5* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Rich, decadent and opulent. Some blowsy and over the top, others among the best Sauternes ever made." |
| 2009 | 5* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Decanter `premium/sauternes-sip-young-savour-old-560404` | "Rich, decadent and opulent. Some blowsy and over the top, others among the best Sauternes ever made." |
| 2010 | 4+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; Vinous `articles/bordeaux-2010-the-sweet-wines-aug-2011` | "Discreet and ageworthy wines with high acidity, but very well balanced." |
| 2011 | 5+ | Vinous `articles/2011-bordeaux-sauternes-aug-2012`; Vinous `articles/2011-bordeaux-sauternes-aug-2012`; Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "The wines of Sauternes and Barsac are spectacular in 2011." |
| 2012 | 2* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Difficult year in which many estates did not make their grand vin." |
| 2012 | 2* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Difficult year in which many estates did not make their grand vin. Barsac wines fared best." |
| 2013 | 4* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Very good year but uneven quality; for the most part, top names did well." |
| 2013 | 3* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Very good year but uneven quality; for the most part, top names did well." |
| 2014 | 5* | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815` | "Outstanding year of pure wines marked by lemony botrytis and high acidity." |
| 2014 | 5+ | Decanter `learn/vintage-guides/bordeaux-vintage-guide/sauternes-and-barsac/vintage-guide-2-117815`; World of Fine Wine `news-features/bordeaux-2023-sauternes` | "Outstanding year of pure wines marked by lemony botrytis and high acidity." |
| 2015 | 4* | Decanter `learn/bordeaux-vintage-guide/bordeaux-2025-ideal-conditions-lead-to-luscious-sauternes` | "producing a classic yet energetic style that sits comfortably between the concentration of 2023 and the har..." |
| 2015 | 5+ | Decanter `premium/sauternes-2015-in-bottle-385677`; Vinous `articles/2015-bordeaux-every-bottle-tells-a-story-feb-2018`; Vinous `articles/2015-bordeaux-every-bottle-tells-a-story-feb-2018` | "It’s an outstanding vintage, with many fleshy, rich wines but with good acidity levels so as to avoid comin..." |
| 2016 | 3+ | Decanter `learn/vintage-guides/en-primeur/bordeaux-en-primeur/365697-365697`; Decanter `learn/vintage-guides/en-primeur/bordeaux-en-primeur/365697-365697`; Vinous `articles/southwold-2016-bordeaux-ten-years-on-apr-2026` | "This is a very good year for many estates, with good purity of fruit thanks to a lack of grey rot, and long..." |
| 2017 | 4+ | Decanter `learn/vintage-guides/en-primeur/sauternes-2017-wines-393657`; Decanter `learn/vintage-guides/en-primeur/sauternes-2017-wines-393657`; Vinous `articles/come-on-aline-chateau-coutet-1943-2017-feb-2024` | "Some wonderfully rich and ripe Sauternes and Barsac wines can be found in the Bordeaux 2017 vintage" |
| 2018 | 3+ | Decanter `premium/sauternes-sip-young-savour-old-560404`; Decanter `premium/sauternes-sip-young-savour-old-560404`; Vinous `articles/2018-chateau-d-yquem-sep-2020` | "The wines showed varying degrees of concentration with moderate sugar levels, but some acidities were low, ..." |
| 2019 | 4+ | Decanter `premium/best-sauternes-2019-wines-tasted-en-primeur-440143`; Vinous `articles/bordeaux-2019-the-southwold-tasting-feb-2023`; Vinous `articles/bordeaux-2019-the-southwold-tasting-feb-2023` | "among the best estates, I found 2019 to be not only rich and concentrated but also precise, with high aroma..." |
| 2020 | 3+ | Decanter `premium/sauternes-sip-young-savour-old-560404`; Decanter `premium/sauternes-sip-young-savour-old-560404`; Vinous `articles/bordeaux-2020-the-southwold-tasting-nov-2024` | "A year that demonstrates a great vintage for red Bordeaux isn’t necessarily a stellar one for Sauternes." |
| 2021 | 3* | World of Fine Wine `tasting-notes/2021-bordeaux-sauternes-barsac`; World of Fine Wine `tasting-notes/2021-bordeaux-sauternes-barsac` | "felt disinclined to make any sweet wine, which, for a lot of them, meant absolutely no wine at all" |
| 2021 | 4+ | World of Fine Wine `tasting-notes/2021-bordeaux-sauternes-barsac`; World of Fine Wine `tasting-notes/2021-bordeaux-sauternes-barsac`; Vinous `articles/2-2-5-bordeaux-2021-in-bottle-feb-2024` | "in the minute crop of 2021 we have been given some wonderful wines: botrytically ( sic ) pure (a delicious ..." |
| 2022 | 4* | World of Fine Wine `homepage-featured-articles/bordeaux-2022-field-notes-sauternes-ripeness-is-all`; World of Fine Wine `homepage-featured-articles/bordeaux-2022-field-notes-sauternes-ripeness-is-all` | "The quality of the wines is varied, but the best are very good indeed." |
| 2022 | 3+ | World of Fine Wine `homepage-featured-articles/bordeaux-2022-field-notes-sauternes-ripeness-is-all`; Vinous `articles/keeping-everyone-happy-southwold-bordeaux-2022-mar-2026`; Vinous `articles/2022-bordeaux-in-bottle-living-in-the-present-jan-2025` | "The quality of the wines is varied, but the best are very good indeed." |
| 2023 | 5+ | Decanter `premium/best-sauternes-barsac-2023-wines-tasted-en-primeur-528839`; World of Fine Wine `news-features/bordeaux-2023-sauternes` | "the botrytised sweet wines of Bordeaux had a fine vintage" |
| 2024 | 3+ | Decanter `premium/best-sauternes-barsac-2024-wines-tasted-en-primeur-557741`; Decanter `premium/best-sauternes-barsac-2024-wines-tasted-en-primeur-557741`; The Drinks Business `2025/05/bordeaux-2024-en-primeur-sauternes-barsac` | "The 2024 vintage in Sauternes and Barsac delivered a fresher, more elegant expression than usual, with lowe..." |
| 2025 | 5* | Decanter `learn/bordeaux-vintage-guide/bordeaux-2025-ideal-conditions-lead-to-luscious-sauternes`; Decanter `learn/bordeaux-vintage-guide/bordeaux-2025-ideal-conditions-lead-to-luscious-sauternes` | "Sauternes and Barsac produced a host of pure and luscious sweet wines in 2025." |

**sicilie**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2022 | 4* | Vinous `articles/sicily-excels-despite-mother-nature-s-wrath-the-2022-and-2023-vintages-jul-2025` | "these ripe, elegant, balanced wines offer both immediate appeal and the underlying harmony for medium-term ..." |
| 2023 | 2* | Vinous `articles/sicily-excels-despite-mother-nature-s-wrath-the-2022-and-2023-vintages-jul-2025` | "The Peronospora epidemic ravaged all of Sicily, hitting the northeast hardest but sparing the southeast the..." |

**sonoma**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 5* | Vinous `articles/sonoma-s-stellar-2016s-apr-2018` | "one of the most consistently brilliant and alluring young vintages I have ever tasted in Sonoma" |
| 2017 | 4* | Vinous `articles/exploring-the-best-new-releases-from-sonoma-and-beyond-may-2019`; Vinous `articles/exploring-the-best-new-releases-from-sonoma-and-beyond-may-2019` | "2017 is a very strong vintage for Pinot Noir" |
| 2020 | 2+ | Vinous `articles/california-north-coast-eyes-wide-open-jan-2022`; Vinous `articles/sonoma-s-sensational-2021s-aug-2023`; Decanter `premium/sonoma-county-2021-vintage-report-535572` | "2020 is a wine-by-wine proposition with a very high degree of variability" |
| 2021 | 5+ | Vinous `articles/sonoma-s-sensational-2021s-aug-2023`; Decanter `premium/sonoma-county-2021-vintage-report-535572` | "Two thousand twenty-one is the best Sonoma vintage since 2018" |
| 2022 | 4+ | Decanter `premium/sonoma-county-the-2022-vintage-report-562065`; Decanter `premium/sonoma-county-the-2022-vintage-report-562065`; Vinous `articles/sonoma-and-neighbors-2022-2023-opposites-attract-jan-2025` | "2022 in Sonoma County: 4/5" |
| 2023 | 4* | Vinous `articles/going-to-california-sonoma-s-2024s-and-2023s-jan-2026`; Vinous `articles/sonoma-and-neighbors-2022-2023-opposites-attract-jan-2025` | "two strong back-to-back vintages that provide fascinating contrasts" |
| 2024 | 4* | Vinous `articles/going-to-california-sonoma-s-2024s-and-2023s-jan-2026` | "two strong back-to-back vintages that provide fascinating contrasts" |

**spanje_wit**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2016 | 3* | Vinous `articles/spain-s-northern-regions-keep-it-cool-march-2019` | "It was a similar mixed bag in 2016, when parts of Bierzo" |
| 2017 | 3+ | Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399`; Vinous `articles/spain-s-northern-regions-keep-it-cool-march-2019` | "Overall crop comparatively large. Decent quality." |
| 2018 | 4+ | Vinous `articles/atlantic-spain-it-s-always-about-the-weather-jun-2021`; Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399` | "was a textbook vintage for Galicia, with generally mild weather throughout the season" |
| 2019 | 4* | Vinous `articles/atlantic-spain-it-s-always-about-the-weather-jun-2021` | "most wine lovers are going to be thrilled with the wide range of high-quality bottlings that are available" |
| 2020 | 3+ | Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399`; Vinous `articles/atlantic-spain-it-s-always-about-the-weather-jun-2021` | "Ripe, full-flavoured wines with balancing acidity in the best" |
| 2021 | 3* | Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399`; Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399` | "A very cool vintage, with low temperatures in the summer that barely touched 30" |
| 2022 | 4* | Decanter `premium/rias-baixas-regional-profile-plus-10-wines-worth-seeking-out-496399` | "Unusually hot, dry vintage, with some welcome rains just before harvest, which added volume and freshness t..." |

**sudwest**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2017 | 4* | La Revue du Vin de France `vins-sud-ouest-millesime-verdict-avis-resultat-commentaire-degustation,4592854.asp` | "le Sud-Ouest livre un superbe millésime 2017 malgré les aléas du climat" |
| 2018 | 4* | La Revue du Vin de France `le-millesime-2018-dans-le-sud-ouest-de-fronton-a-l-aveyron-place-aux-outsiders,4634159.asp`; La Revue du Vin de France `dans-le-sud-ouest-des-vins-de-bel-equilibre-au-paradis-des-fortes-tetes,4712681.asp` | "Le Sud-Ouest livre un superbe millésime 2018" |
| 2019 | 4* | iDealwine `les-notes-du-millesime-2019` | "Les raisins ont donc atteint de belles maturités, surtout en rouge, en gardant un bel équilibre dans les jus" |
| 2020 | 4* | iDealwine `les-notes-du-millesime-2020` | "notamment s’agissant des vins rouges qui montrent de belles concentrations" |
| 2021 | 3* | iDealwine `les-notes-du-millesime-2021` | "pas les mêmes niveaux de concentration que ceux des années précédentes plus solaires" |
| 2022 | 4* | iDealwine `les-notes-du-millesime-2022` | "ce qui en fait un très bon millésime" |
| 2023 | 4* | iDealwine `les-notes-du-millesime-2023` | "Si les volumes ont globalement diminué, la qualité est toutefois très séduisante." |

**toscane**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2001 | 4* | Vinous `articles/in-the-sweet-spot-2001-brunello-di-montalcino-mar-2021`; Vinous `articles/in-the-sweet-spot-2001-brunello-di-montalcino-mar-2021` | "one of the best vintages of its decade" |
| 2004 | 5* | Vinous `articles/a-vintage-of-transcendence-2004-brunello-di-montalcino-retrospective-jan-2025` | "the 2004s are in fine condition" |
| 2005 | 3* | Vinous `articles/2005-tuscany-ten-years-later-dec-2015`; Vinous `articles/2005-tuscany-ten-years-later-dec-2015` | "Only a few 2005s are going to improve in the cellar" |
| 2006 | 5* | Vinous `articles/the-landmark-vintage-2006-brunello-di-montalcino-retrospective-feb-2026` | "It is the landmark vintage of the 2000s" |
| 2007 | 4* | Vinous `articles/brunello-di-montalcino-2007-a-worthy-successor-to-2006-apr-2012` | "Vintage 2007 is a more than worthy follow-up to 2006" |
| 2009 | 2* | Vinous `articles/2009-brunello-di-montalcino-the-day-of-reckoning-may-2014`; Vinous `articles/2009-brunello-di-montalcino-the-day-of-reckoning-may-2014` | "most uneven, problematic young wines I have ever tasted" |
| 2010 | 5+ | Vinous `articles/brunello-di-montalcino-2007-a-worthy-successor-to-2006-apr-2012`; Decanter `premium/collectors-guide-tuscany-533032` | "2010 is the next great vintage for Montalcino" |
| 2011 | 3* | Vinous `articles/2011-brunello-di-montalcino-terroir-matters-feb-2016` | "a vintage with a great deal of variability" |
| 2012 | 4* | Vinous `articles/the-pendulum-swings-2012-brunello-di-montalcino-jan-2023` | "the 2012s are overdelivering in" |
| 2013 | 4* | Vinous `articles/the-2014-brunello-di-montalcino-and-2013-riservas-opposites-attract-march-2019`; Vinous `articles/the-pendulum-swings-2012-brunello-di-montalcino-jan-2023` | "classic year (2013). And yet, both vintages have something to offer" |
| 2014 | 3* | Vinous `articles/chianti-classico-the-stellar-2015s-and-surprising-2014s-jan-2018`; Vinous `articles/the-2014-brunello-di-montalcino-and-2013-riservas-opposites-attract-march-2019` | "the best examples are wonderfully nuanced" |
| 2015 | 5+ | Vinous `articles/chianti-classico-the-stellar-2015s-and-surprising-2014s-jan-2018`; Decanter `premium/collectors-guide-tuscany-533032` | "the gorgeous, radiant 2015s" |
| 2016 | 5+ | Vinous `articles/2016-chianti-classico-a-modern-day-benchmark-aug-2019`; Vinous `articles/2016-brunello-di-montalcino-radiance-personified-nov-2020`; Decanter `premium/collectors-guide-tuscany-533032` | "The 2016s are distinguished by their" |
| 2017 | 3+ | Vinous `articles/jekyll-and-hyde-2017-brunello-di-montalcino-and-2016-riservas-dec-2021`; Vinous `articles/2016-chianti-classico-a-modern-day-benchmark-aug-2019`; Decanter `premium/collectors-guide-tuscany-533032` | "This is not a vintage to skip, nor is it one to go deep on" |
| 2018 | 3+ | Vinous `articles/2018-brunello-di-montalcino-the-rubik-s-cube-vintage-dec-2022`; Decanter `premium/brunello-di-montalcino-2019-full-report-522099` | "idiosyncratic vintages in memory" |
| 2019 | 5+ | Vinous `articles/buckle-your-seatbelts-2019-brunello-and-2021-rosso-di-montalcino-dec-2023`; Decanter `premium/brunello-di-montalcino-2019-full-report-522099`; World of Fine Wine `tasting-notes/brunello-di-montalcino-2019-exceptional-vintage` | "the entire region excelled, from southwest to east" |
| 2020 | 3+ | Vinous `articles/a-tale-of-two-extremes-the-2020-brunellos-and-2019-riservas-nov-2024`; Vinous `articles/chianti-classico-the-brilliant-2021s-&-variable-2020s-aug-2023`; World of Fine Wine `tasting-notes/2020-brunello-di-montalcino` | "remarkably high highs and," |
| 2021 | 5* | Vinous `articles/the-exquisite-2021-brunellos-nov-2025`; Vinous `articles/chianti-classico-the-brilliant-2021s-&-variable-2020s-aug-2023` | "2021 is a triumph for Montalcino" |
| 2022 | 3* | Vinous `articles/chianti-classico-looking-up-aug-2026`; Vinous `articles/the-exquisite-2021-brunellos-nov-2025` | "The finest 2022s are positively riveting" |
| 2023 | 3* | Vinous `articles/chianti-classico-looking-up-aug-2026`; Vinous `articles/tuscany-s-maremma-scenes-from-the-coast-jul-2026` | "2023 is a highly inconsistent vintage" |

**veneto**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2010 | 2* | Vinous `articles/amarone-new-releases-may-2017`; Vinous `articles/amarone-new-releases-may-2017` | "will not be remembered as a great one in Veneto" |
| 2011 | 5* | Vinous `articles/amarone-new-releases-may-2017`; Vinous `articles/amarone-new-releases-may-2017` | "vintage is consistently superb. While the growing season was also very hot" |
| 2012 | 3* | Vinous `articles/amarone-new-releases-may-2017` | "some 2012 Amarones are marred by green streaks" |
| 2013 | 4* | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/amarone-new-releases-may-2017` | "intense, deeply complex and structured, yet full of zesty" |
| 2014 | 2+ | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Decanter `premium/bertani-amarone-della-valpolicella-classico-a-43-vintage-vertical-495627` | "The few 2014s I’ve tasted come across as diluted and" |
| 2015 | 4+ | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Decanter `premium/amarone-2017-vintage-report-485688` | "Most 2015s are drinking beautifully right now" |
| 2016 | 5+ | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/valpolicella-soave-the-times-they-are-a-changin-feb-2021`; Decanter `premium/amarone-2017-vintage-report-485688` | "2016 is a vintage to talk about for decades to come" |
| 2017 | 3+ | Decanter `premium/amarone-2017-vintage-report-485688`; Vinous `articles/valpolicella-soave-the-times-they-are-a-changin-feb-2021`; Decanter `premium/amarone-panel-tasting-results-542023` | "good but not great in Valpolicella" |
| 2018 | 3+ | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Decanter `premium/amarone-panel-tasting-results-542023` | "2018 remains one of my least favorite vintages from the last decade" |
| 2019 | 5+ | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/veneto-rising-amarone-soave-and-beyond-sep-2025`; Decanter `premium/amarone-panel-tasting-results-542023` | "The 2019s are dark and radiant wines" |
| 2020 | 3+ | Vinous `articles/on-the-cusp-of-evolution-amarone-and-valpolicella-apr-2022`; Vinous `articles/veneto-rising-amarone-soave-and-beyond-sep-2025`; Decanter `premium/amarone-panel-tasting-results-542023` | "was very difficult in the Veneto, yet success was found by estates" |
| 2021 | 4* | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/veneto-the-land-of-opportunity-mar-2023` | "2021 has serious potential" |
| 2022 | 3* | Vinous `articles/veneto-a-constant-state-of-evolution-feb-2024`; Vinous `articles/veneto-rising-amarone-soave-and-beyond-sep-2025` | "a year of glycerol richness and intense, ripe fruit" |
| 2023 | 3* | Vinous `articles/veneto-rising-amarone-soave-and-beyond-sep-2025`; Vinous `articles/veneto-rising-amarone-soave-and-beyond-sep-2025` | "vintage was challenging for winemakers" |

**washington**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2018 | 5* | Vinous `articles/washington-waltzes-in-2018-slowly-marches-on-in-2019-mar-2022` | "2018 is one of the great vintages of our time in Washington State" |
| 2019 | 4+ | Vinous `articles/washington-waltzes-in-2018-slowly-marches-on-in-2019-mar-2022`; Decanter `premium/columbia-valley-2021-vintage-report-overview-of-washington-and-oregon-plus-top-scori...` | "The 2019 vintage is shaping up to be a year where top producers shone brightly" |
| 2020 | 2+ | Vinous `articles/against-all-odds-washington-states-2020s-and-2019s-mar-2023`; Decanter `premium/columbia-valley-2021-vintage-report-overview-of-washington-and-oregon-plus-top-scori...` | "consumers must be very picky when choosing 2020s to place into their cellars" |
| 2021 | 3* | Decanter `premium/columbia-valley-2021-vintage-report-overview-of-washington-and-oregon-plus-top-scori...` | "2021 3/5 A vintage beset by record-shattering temperatures" |
| 2022 | 4* | Vinous `articles/washington-state-on-a-roll-the-suave-2022s-and-seductive-2023s-oct-2025` | "Though the 2022s underwhelmed me in 2024, their" |
| 2023 | 5* | Vinous `articles/washington-state-on-a-roll-the-suave-2022s-and-seductive-2023s-oct-2025`; Vinous `articles/washington-state-on-a-roll-the-suave-2022s-and-seductive-2023s-oct-2025` | "The wines seem to have the vibrant fruit of 2021 and the balanced structure of 2018" |

**zuidafrika**

| jaar | niveau | vindplaatsen | strekking |
|---|---|---|---|
| 2015 | 5* | Vinous `articles/steenwold-south-africa-ten-years-on-jul-2025` | "vintage is viewed as one of the greatest in recent times, a textbook growing" |
| 2021 | 5* | Vinous `articles/the-a-to-z-of-south-africa-nov-2023`; Vinous `articles/the-a-to-z-of-south-africa-nov-2023` | "Two thousand twenty-one is generally cooler than recent seasons" |
| 2022 | 4* | Vinous `articles/the-a-to-z-of-south-africa-nov-2023` | "Two thousand twenty-two was a warm vintage, the fruit picked at similar" |
| 2023 | 2* | Vinous `articles/the-a-to-z-of-south-africa-nov-2023`; Vinous `articles/south-africa-where-are-we-now-sep-2024`; Vinous `articles/south-africa-where-are-we-now-sep-2024` | "picking essentially became a salvage operation, and in 2023, they will" |

## Wat eerdere rondes vaststelden

Deze secties blijven staan omdat ze de vindplaatsen van ronde een en twee vastleggen en omdat ze uitleggen waarom de tabel is zoals hij is. Waar ronde drie ze heeft ingehaald, staat dat hierboven; de tekst hieronder is niet achteraf bijgewerkt.

## De splitsing van 16 september

De vorige versie van dit bestand had een lijst streken die "nu wéér niet kunnen kloppen, want daar is één getal per definitie fout". Die lijst is uitgevoerd. Achtendertig streken zijn er achtenzestig geworden.

Wat er gesplitst is, en waarop. **Californië** in Napa, Sonoma, de centrale kust en de noordkust, met een restrij voor wie alleen "California" op het etiket zet. **Australië** in Zuid-Australië, West-Australië, Victoria met Tasmanië, en Nieuw-Zuid-Wales. **Chili** in de kuststreken, de centrale vallei en het zuiden. **Noord-Italië** in noordoost, Lombardije, midden-Italië en Emilia met Ligurië. **Zuid-Italië** in Sicilië, Puglia, Campanië, Sardinië en een restrij voor Basilicata en Calabrië. **Portugal** in Dão met Bairrada, de Alentejo, Vinho Verde en Madeira. **Griekenland** in Santorini, het noorden en de Peloponnesos. En de **Douro** in port tegenover stille wijn, met `t:['versterkt']` op de portrij.

Nieuw omdat ze helemaal ontbraken: **midden- en zuidoost-Spanje** (Jumilla tot La Mancha), **Corsica**, het **oosten van de Verenigde Staten** (Finger Lakes, Long Island, Virginia) en **Canada** (Okanagan, Niagara).

**Hoe de bestaande jaren zijn verdeeld, en waarom niet gewoon overal dezelfde.** Een gesplitste rij erft alleen wat er voor die deelstreek ook echt over gezegd was. De gecontroleerde Californische jaren 2017 tot 2024 zijn naar **Napa** gegaan en nergens anders heen, want dat onderzoek ging over Napa; de andere Californische rijen houden dezelfde getallen als eigen schatting, zonder plus. Bij de Douro houdt **alleen de portrij** de zeventien gecontroleerde jaren, want een declaratie zegt niets over stille Douro; die rij begint met een korte reeks schattingen. **Nieuw-Zuid-Wales** en **Zuid-Chili** hebben helemaal niets geërfd, want de Hunter Valley heeft een eigen cyclus (subtropisch, oogst in januari, regen beslist) en Itata en Bío Bío hebben niets met de centrale vallei te maken; daar overtypen zou verzinnen zijn. **Madeira** is leeg omdat jaargang daar nauwelijks betekenis heeft.

Het effect is meteen zichtbaar en het is precies waarvoor de splitsing bestond. Napa 2020 geeft nu "wisselend" op twee bronnen, vanwege de rookschade; Russian River 2020 geeft "klassiek" op één bron, omdat de valleivloer van Sonoma relatief gespaard bleef. Tot vandaag kregen die twee flessen hetzelfde getal, en voor één van beide was dat aantoonbaar verkeerd.

**Wat dit kost.** De meeste nieuwe rijen dragen nu geërfde schattingen, en die zijn per definitie te grof: dat West-Australië en Zuid-Australië in 2018 hetzelfde getal hebben is een plaatshouder, geen bevinding. De splitsing maakt dat zichtbaar in plaats van het te verbergen, en dat is de winst. Het echte werk, per deelstreek, staat op de werklijst.


## Ronde twee, 16 september: de Douro

De Douro stond bovenaan de werklijst omdat de lijst gedeclareerde vintagejaren normaal het makkelijkst hard te maken publieke feit is dat er bestaat. Dat klopte: de streek ging van nul naar zeventien gecontroleerde jaren, en twee jaren bleken er flink naast te zitten.

Eerst een correctie op de werklijst van ronde een zelf. Die zei "begin bij het IVDP en bij de declaratiepagina's van Symington en Fladgate", maar het IVDP declareert helemaal niets. Het instituut regelt alleen de definitie (honderd procent Douro, één oogst, ongeveer twee jaar hout, bottelen in Portugal) en keurt de monsters; de declaratie is een besluit van elk huis afzonderlijk, met Fladgate en Symington als feitelijk scharnier. Wat het IVDP wél heeft, en wat deze ronde de dragende bron werd, is een eigen jaargangkroniek op `ivdp.pt/pt/vinhos/vinhos-do-porto/vintages/`, die per jaar terugloopt tot 1756 en er telkens bij zet hoe breed er gedeclareerd werd: "Quase todas as empresas declararam", "Poucas casas declararam", "Não foi ano Vintage". Dat is precies het signaal dat dit bestand het eerlijkste noemt dat er bestaat, en het komt hier van de instantie die de monsters keurt.

Het IVDP is laag C en mag dus niet in zijn eentje over kwaliteit beslissen. De beslissende stem kwam van Vinous, dat een aparte jaargangrapportage heeft per gedeclareerd jaar en waarvan de artikelen integraal leesbaar bleken. Gebruikte vindplaatsen, alle op `v1.vinous.com/articles/`:

| jaar | vindplaats | strekking |
|---|---|---|
| 1997 | `1997-vintage-ports-may-2000` | "average to slightly above average year"; ruim veertig wijnen geproefd, "lack the structure and grip of a great, ageworthy port vintage" |
| 2000 | `2000-vintage-ports-jan-2003` | "stronger than the '97s and close in quality to the excellent '94s", "port's most consistently successful vintage to date" |
| 2003 | `2003-vintage-ports-jan-2006` | "among the outstanding port vintages of recent decades, along with such stellar years as 2000, 1997, 1994, 1977, 1970, 1966 and 1963" |
| 2009 | `2009-vintage-ports-nov-2012` | split decision: Fladgate declareerde, Symington en Noval niet |
| 2011 | `2011-vintage-ports-may-2014` | "the first widely declared port vintage since 2007"; Seely: "probably the best I have known in my 20 years at Quinta do Noval" |
| 2016 | `vintage-port-the-2016-declaration-jun-2018` | "fabulous"; op de vraag of iets de 2011s evenaart: "Yes...the 2016 vintage" |
| 2017 | `an-ineluctable-pair-2017-vintage-ports-jun-2019` | "Clearly, these 2017 Vintage Ports merit a General Declaration"; Symington en Guimaraens vergelijken de zomer met 1945 |
| 2018 | `2018-single-quinta-ports-jun-2020` | "no general declaration"; wel "a clutch of marvelous Single Quintas", "remarkably consistent" |
| 2024 | `vintage-port-the-2024-declaration-sep-2026` | "the first General Declaration ... since 2017", "near-perfect season", een Dow's "that will surely rank among the all-time greats" |

Twee jaren gingen daardoor fors omlaag, en het zijn allebei gevallen van het patroon dat ronde een al vaststelde: de tabel stond te hoog.

**1997 ging van 5 naar 3.** Dit is de scherpste vondst van de ronde, en precies waarvoor de regel "een terugkijkend oordeel gaat voor en-primeur" bestaat. Bijna elk groot huis declareerde 1997, en op de declaratie alleen zou het jaar een 5 verdienen. Maar Vinous proefde er ruim veertig en kwam uit op "average to slightly above average", met de opmerking "never before have I encountered such a gap in quality between the best producers and the rest in a widely declared vintage" en de observatie dat de huizen mede declareerden omdat de 1994's uitverkocht waren en de markt ernaar stond. Het IVDP is in dezelfde richting opvallend terughoudend: waar 2003 "qualidade excepcional" krijgt, staat bij 1997 alleen "alguns de excelente qualidade", sommige zijn uitstekend. Voor een kelderapp is dat het verschil tussen een fles die nog twintig jaar kan en een die dat niet heeft. Let op de tegenspraak: het 2003-stuk noemt 1997 en passant in een rijtje sterrenjaren. Het toegewijde proefverslag weegt zwaarder dan die opsomming, en dat is ook de regel.

**2022 ging van 5 naar 3.** De tabel had er het hoogste niveau staan voor een jaar dat een van de heetste en droogste ooit was, met negen dagen boven 40 °C en 47 °C in Pinhão half juli, en waarin de meeste huizen juist niet declareerden. Vinous bevestigt dat laatste hard van de andere kant: 2024 is de eerste algemene declaratie sinds 2017, dus tussen 2018 en 2023 was er geen enkele.

Verder toegevoegd of bevestigd. **2024 is nieuw op 5**, een algemene declaratie door zowel Fladgate (Taylor's, Fonseca, Croft) als Symington (Warre, Dow's, Cockburn's, Vesúvio, Graham's), bij beide de eerste in zeven jaar. **2018 op 4** is een splitdeclaratie: Fladgate, Noval, Ramos Pinto en Sogevinus declareerden, Symington niet. **1991 op 4 en 1992 op 5** zijn de "semi-declarations" die Vinous zo noemt, met het IVDP dat 1992 "excepcional" en 1991 "excelente" geeft, dus in die volgorde. **1963, 1966, 1970, 1977 en 1994** staan op 5 op het rijtje sterrenjaren uit het 2003-stuk plus de kroniek van het IVDP, die bij 1963, 1966, 1970 en 1977 "quase todas as empresas declararam" noteert en bij 1994 "Declaração geral", met de wijn "ainda mais intenso que o de 1992".

Drie jaren zijn zonder plus gewijzigd of toegevoegd, op één bron, en dat staat hier zodat een volgende ronde weet waar ze vandaan komen. Wikipedia meldt dat Quinta do Vesuvio in zijn hele bestaan maar drie jaargangen oversloeg: 1993, 2002 en 2014. Een huis dat vrijwel elk jaar declareert en er drie laat schieten, zegt daarmee iets scherps over precies die drie. **2014 ging daarom van 3 naar 2**, en **1993 en 2002 zijn nieuw op 2**. Eén bron is te weinig voor een plus, dus die staat er niet.

**Wat de Douro-rij nog steeds fout doet, en wat ronde drie moet oplossen.** De rij vangt met `port`, `porto`, `douro` en `duriense` zowel versterkte port als droge Douro-tafelwijn, en die twee lopen aantoonbaar uiteen. 2009 is het schoolvoorbeeld: Noval maakte geen vintage port omdat de wijnen niet het profiel hadden, terwijl dezelfde oogst prima tafelwijn gaf. Een niet-gedeclareerd jaar is een uitspraak over port en niet over de streek. Dit hoort dus bij het rijtje streken die gesplitst moeten worden, met `t:[...]` op versterkt tegenover stil, en de splitsing is hier beter onderbouwd dan de meeste andere op die lijst.


## Wat ronde een veranderde, en welke denkfout eronder zat

Vóór deze ronde kwam de hele tabel uit het geheugen van een taalmodel. Dat zat er structureel naast, en bijna altijd te hoog. De grootste correcties:

- **Bourgogne wit 1995 tot 2002 ging hard omlaag** (1995 van 4 naar 2, 1996 van 4 naar 3, en 1997, 1998, 2001 en 2003 nieuw op 2). Reden: premature oxidatie. De intrinsieke kwaliteit van die jaren was goed, maar de literatuur is eenstemmig dat vrijwel elke witte Bourgogne tussen 1995 en 2002 erdoor is geraakt, met 1995 als ergste. Voor een kelderapp is dat het enige dat telt, want het halveert de bewaarduur.
- **Piemonte ging op zeven jaren een stap omlaag** (1996, 1999, 2000, 2007, 2012, 2020, 2022), telkens met Decanter en Vinous die dezelfde kant op wijzen.
- **Rioja schoof op dertien jaren**, in beide richtingen, en werd daarmee de best onderbouwde streek van de tabel.
- **Twee keer bleek de app opbrengstverlies te verwarren met kwaliteitsverlies.** Champagne 2024 stond op 2 en Bourgogne wit 2024 op 2, terwijl de bronnen bij beide expliciet zeggen dat de kwaliteit overeind bleef en alleen het volume instortte. Bourgogne wit 2024 gaat naar 4, met vier bronnen die de witte wijnen het hoogtepunt van het jaar noemen en met 2014 vergelijken.
- **Champagne bleek grotendeels goed.** Van de achttien gecontroleerde jaren week er één af (1995 van 4 naar 3). De kernjaren 2002, 2008, 2012 en 2022 zijn bevestigd op uitzonderlijk, en dat is precies waar de oorspronkelijke klacht over ging.
- **2025 is nieuw** voor Champagne (5), Bordeaux (4), Loire (4) en Duitsland (4).


## Toscane, bijgesteld maar niet gecontroleerd

Vinous bleek voor Toscane terugkijkende jaargangstukken te hebben die integraal leesbaar zijn, en dat is precies het soort bron dat dit bestand het hoogst aanslaat. Er is geen tweede leesbare onafhankelijke bron voor Toscane, dus er staat **geen plus** bij; dit zijn betere schattingen, geen gecontroleerde jaren. Gebruikte vindplaatsen op `v1.vinous.com/articles/`: `the-landmark-vintage-2006-brunello-di-montalcino-retrospective-feb-2026`, `a-vintage-of-transcendence-2004-brunello-di-montalcino-retrospective-jan-2025` en `chianti-classico-looking-up-aug-2026`.

Wat eruit kwam: 2004 en 2006 zijn bevestigd op 5 (Galloni noemde 2006 destijds "a benchmark vintage for Brunello di Montalcino", de terugblik van twintig jaar later geeft hem gelijk), 2005 blijft 3 ("beginning to fade"), en 2002 is nieuw op 1, want Vinous spreekt van "the nearly nonexistent 2002s". **2022 ging van 4 naar 3**, omdat Galloni in augustus 2026 schrijft dat 2022 en 2023 zwaar zijn geraakt door weersextremen die de kwaliteit aantoonbaar omlaag haalden, niet alleen de opbrengst. 2024 is nieuw op 3 ("surprisingly good in spots, despite some inconsistency") en 2025 op 4 ("hold significant promise").

Let op de beperking, en die is dezelfde als bij de Douro: dit oordeel komt grotendeels uit Chianti Classico, terwijl de rij `toscane` ook Montalcino en Bolgheri vangt. Kust en binnenland lopen in hete jaren uiteen, dat staat al op de splitslijst. 2023 is daarom niet verlaagd hoewel Chianti dat jaar zwaar leed: dat is te specifiek om over heel Toscane uit te smeren.
