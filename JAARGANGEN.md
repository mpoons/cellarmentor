# De jaargangtabel: methode, bronnen en wat er nog niet klopt

Bij dit bestand hoort de tabel `STREKEN` in `cellarmentor.html`. Elk jaar daar heeft een niveau van 1 tot 5, en daarachter kan een teken staan dat zegt **hoe hard dat oordeel is**:

| in de tabel | betekent | wat de app zegt |
|---|---|---|
| `2016:5+` | tegen minstens twee onafhankelijke gepubliceerde bronnen gelegd | "tegen twee onafhankelijke bronnen gelegd" |
| `2016:5*` | op één betrouwbare bron gebaseerd, laag A of B, vindplaats hieronder | "op één betrouwbare bron gebaseerd" |
| `2016:5` | eigen schatting, niet nagetrokken | "nog een eigen schatting, niet nagetrokken" |

Die middelste stand is op 16 september toegevoegd, en de reden is een fout in de eerste opzet. Die kende alleen gecontroleerd of niet, en dat dwong tot weggooien wat één goede bron zei. Dat is verkeerd om: een oordeel uit één terugkijkende proeverij van Vinous is beduidend meer waard dan een gok van een taalmodel, ook al haalt het de lat van twee niet. Weggooien maakt de tabel niet eerlijker, alleen leger. **De regel is nu: als een goede, betrouwbare bron iets zegt over een streek of een jaar, neem het mee, en zet erbij hoe hard het is.** Een ster eist wel dezelfde discipline als een plus: de vindplaats komt in dit bestand, anders is het geen ster maar een schatting. De app zegt dat verschil per fles tegen de gebruiker, met een vraagteken achter het jaargangwoord en voluit in "Waar komt dit venster vandaan?". Dat onderscheid is de kern van dit bestand: een oordeel dat zich voordoet als gecontroleerd terwijl het dat niet is, is precies de zelfverzekerdheid die een kelderapp onbetrouwbaar maakt.

**Stand: 16 september 2026, na ronde twee. 246 van de 821 jaren gecontroleerd.** Let op: dat getal meet maar één ding. Een streek die `streekVan` niet herkent telt hier helemaal niet mee, en dat bleek een groter gat dan verwacht; zie de sectie over streken die de app niet herkent.

## Waarom een eigen tabel, en niet die van een criticus

De ontwerpregel uit `CLAUDE.md` blijft gelden: puntenscores van Parker, Decanter of Hamersma komen nooit in de app. Die hangen aan één fles, zijn redactioneel eigendom van de uitgever, en een taalmodel verzint ze overtuigend. Een jaargangreputatie per streek is iets anders: dat is openbare kennis die in vijf woorden past en die je uit meerdere onafhankelijke bronnen kunt afleiden. Wat we dus doen is lezen wat bronnen kwalitatief over een jaargang zeggen ("uitzonderlijk", "hagel in juni nam een kwart van de oogst", "veel rot, alleen de topproducenten slaagden") en daar zelf een consensusniveau uit vaststellen. Wat we niet doen is een puntenkaart van één uitgever omrekenen naar onze schaal.

Twee methodische lessen uit de ronde van 16 september, die bij een volgende ronde weer opgaan. De officiële jaargangwaarderingen van de streken zelf zijn bruikbaar maar systematisch mild: Ribera del Duero gaf in veertig jaar nooit een onvoldoende en maar twee keer "matig", dus die schaal één op één overnemen zou de app te hoog zetten. En de officiële Brunello-sterren zijn na 2020 afgeschaft, dus Toscane heeft voor recente jaren een andere basis nodig.

## De schaal

| niveau | woord in de app | betekenis |
|---|---|---|
| 5 | uitzonderlijk | een van de beste jaren van de generatie |
| 4 | sterk | ruim boven gemiddeld |
| 3 | klassiek | goed, niet bijzonder |
| 2 | wisselend | selectie nodig, veel producenten haalden het niet |
| 1 | moeilijk | misoogst door vorst, hagel, rot of regen |

Een jaar dat niet in de tabel staat geeft niveau 3 zonder woord: "geen mening". Dat is met opzet. Ontbreken is eerlijker dan een gok, en het niveau heeft dan geen effect op het drinkvenster. Dat geldt ook voor een hele streek: `jerez`, `madeira`, `australie_nsw`, `chili_zuid`, `spanje_midden`, `corsica`, `usa_oost` en `canada` staan er wel maar zijn leeg, omdat de app die flessen dan tenminste thuisbrengt en er niets over verzint.

## Dekking per streek

**Stand na de splitsing van 16 september: 68 streken, 1219 jaarvakjes, 246 op twee bronnen, 1 op één bron, de rest eigen schatting.**

Die noemer sprong van 821 naar 1219 en dat is geen verslechtering maar het zichtbaar worden van werk dat er altijd al lag. Zolang `australie` één rij was, telde 2018 als één vakje; nu Zuid-Australië, West-Australië en Victoria aparte rijen zijn, zijn het er drie, en dat zijn ze in werkelijkheid ook altijd geweest. De oude noemer verborg de vraag in plaats van hem te beantwoorden.

De best gedekte streken zijn `bordeaux` (37 van 42), `rhone_z` (27 van 29), `rhone_n` (26 van 30), `rioja` (26 van 34), `piemonte` (23 van 34), `champagne` (18 van 36), `douro_port` (17 van 33) en `bourgogne_w` (15 van 32). Daaronder `alsace` (11), `loire` (9), `ribera` (9), `napa` (8), `bourgogne_r` (6), `toscane` (6), `languedoc` (3), `duitsland` (3) en `sauternes` (2).

Alle overige streken staan op nul. De actuele telling per streek staat in de tabel zelf; ze hier met de hand bijhouden is precies het soort dubbele boekhouding dat gaat afwijken. `python3 tools/zet-jaargangen.py <bestand>` drukt de stand per streek af bij elke ronde.

## De splitsing van 16 september

De vorige versie van dit bestand had een lijst streken die "nu wéér niet kunnen kloppen, want daar is één getal per definitie fout". Die lijst is uitgevoerd. Achtendertig streken zijn er achtenzestig geworden.

Wat er gesplitst is, en waarop. **Californië** in Napa, Sonoma, de centrale kust en de noordkust, met een restrij voor wie alleen "California" op het etiket zet. **Australië** in Zuid-Australië, West-Australië, Victoria met Tasmanië, en Nieuw-Zuid-Wales. **Chili** in de kuststreken, de centrale vallei en het zuiden. **Noord-Italië** in noordoost, Lombardije, midden-Italië en Emilia met Ligurië. **Zuid-Italië** in Sicilië, Puglia, Campanië, Sardinië en een restrij voor Basilicata en Calabrië. **Portugal** in Dão met Bairrada, de Alentejo, Vinho Verde en Madeira. **Griekenland** in Santorini, het noorden en de Peloponnesos. En de **Douro** in port tegenover stille wijn, met `t:['versterkt']` op de portrij.

Nieuw omdat ze helemaal ontbraken: **midden- en zuidoost-Spanje** (Jumilla tot La Mancha), **Corsica**, het **oosten van de Verenigde Staten** (Finger Lakes, Long Island, Virginia) en **Canada** (Okanagan, Niagara).

**Hoe de bestaande jaren zijn verdeeld, en waarom niet gewoon overal dezelfde.** Een gesplitste rij erft alleen wat er voor die deelstreek ook echt over gezegd was. De gecontroleerde Californische jaren 2017 tot 2024 zijn naar **Napa** gegaan en nergens anders heen, want dat onderzoek ging over Napa; de andere Californische rijen houden dezelfde getallen als eigen schatting, zonder plus. Bij de Douro houdt **alleen de portrij** de zeventien gecontroleerde jaren, want een declaratie zegt niets over stille Douro; die rij begint met een korte reeks schattingen. **Nieuw-Zuid-Wales** en **Zuid-Chili** hebben helemaal niets geërfd, want de Hunter Valley heeft een eigen cyclus (subtropisch, oogst in januari, regen beslist) en Itata en Bío Bío hebben niets met de centrale vallei te maken; daar overtypen zou verzinnen zijn. **Madeira** is leeg omdat jaargang daar nauwelijks betekenis heeft.

Het effect is meteen zichtbaar en het is precies waarvoor de splitsing bestond. Napa 2020 geeft nu "wisselend" op twee bronnen, vanwege de rookschade; Russian River 2020 geeft "klassiek" op één bron, omdat de valleivloer van Sonoma relatief gespaard bleef. Tot vandaag kregen die twee flessen hetzelfde getal, en voor één van beide was dat aantoonbaar verkeerd.

**Wat dit kost.** De meeste nieuwe rijen dragen nu geërfde schattingen, en die zijn per definitie te grof: dat West-Australië en Zuid-Australië in 2018 hetzelfde getal hebben is een plaatshouder, geen bevinding. De splitsing maakt dat zichtbaar in plaats van het te verbergen, en dat is de winst. Het echte werk, per deelstreek, staat op de werklijst.

## Hoe onafhankelijk is een bron eigenlijk

Dit is de vraag die de tabel maakt of breekt, en de ronde van 16 september leverde er een gemeten antwoord op. Een promotie-organisatie van een wijnland of een streek verklaart een jaargang vrijwel nooit slecht, want het is hun eigen sector. Wines of Chile, Wines of Argentina, WoSA, Wine Australia, New Zealand Winegrowers en Wines of Greece horen in die categorie. Het harde bewijs staat in de Ribera del Duero-reeks: het Consejo Regulador gaf in veertig jaar nooit een "Deficiente" en maar twee keer "Regular". Die schaal overnemen zou de app systematisch te hoog zetten. Tegelijk is Rioja het tegenvoorbeeld, want dat Consejo varieert zijn oordeel wel degelijk en dat bleek bruikbaar. De regel is dus niet dat je ze niet gebruikt, de regel is waarvoor je ze gebruikt.

**Laag C, feiten en nooit de beslissende stem.** Promotie-organisaties en consejos zijn uitstekend en vaak gezaghebbend voor wat controleerbaar is: opbrengsten, neerslag, vorstdata, hittegolven, ziektedruk, startdatum van de oogst, hoeveel procent de oogst kromp. Dat zijn feiten waar ze geen belang bij hebben om ze te verdraaien, en ze publiceren zelfs een slechte opbrengst. Gebruik ze daarvoor, en laat het kwaliteitsniveau altijd door minstens één belangeloze bron bepalen.

**Laag B, beslissende stem met korrel zout.** Handelaren met een lange publieke jaargangstaat (Berry Bros & Rudd, Farr Vintners, Justerini & Brooks, Corney & Barrow, iDealwine) willen verkopen, maar hun staat kost hen reputatie als hij niet klopt en ze zetten jaren wel degelijk lager: Berry Bros plaatste Bourgogne 2023 wit expliciet onder 2017, 2020 en 2022. Behandel hun láge oordelen als een sterk signaal en hun hoge met terughoudendheid.

**Laag A, beslissende stem.** Critici met terugkijkende proeverijen en specialisten met een lange reeks: Vinous, Decanter, Jancis Robinson, World of Fine Wine, drinkrhone.com, Mosel Fine Wines. Die hebben er commercieel niets aan om een jaargang mooier te maken dan hij is.

Twee regels die daar uit volgen en die bij de volgende ronde moeten gelden.

**Geef een terugkijkende bron voorrang op een en-primeur-bron.** Een jaargang die tien jaar later opnieuw is geproefd is veel betrouwbaarder dan het oordeel bij de vatproef, en voor een kelderapp is juist dat terugkijkende oordeel wat telt. Bordeaux 2025 staat nu op en-primeur-oordelen en is daarmee voorlopig.

**Het eerlijkste signaal dat er bestaat is de beslissing van de producent zelf.** Of de porthuizen een jaargang declareerden, of de champagnehuizen een vintage uitbrachten, of Barolo-producenten hun topwijn declasseerden: dat zijn kostbare keuzes die niemand maakt om marketingredenen. Een huis dat besluit zijn vlaggenschip een jaar niet te maken, zegt meer dan welke beschrijving ook. Dat is precies het signaal dat bij de Douro deze ronde niet hard te maken was, en dat is waarom de Douro bovenaan de werklijst staat.

## Gebruikte bronnen, per laag

De ronde van 16 september gebruikte deze lagen, in deze voorkeursorde, met de eis van minstens twee onafhankelijke bronnen per jaar:

1. **Streekinstanties en oogstverslagen.** Consejo Regulador DOCa Rioja (officiële waardering per oogst), Consejo Regulador Ribera del Duero, Deutsches Weininstitut, VDP, Inter Rhône, InterLoire, Vins du Centre-Loire, Comité Champagne, Napa Valley Vintners, Sonoma County Winegrowers, Wine Institute, CIVB, Consorzio del Vino Brunello di Montalcino, Fédération de Châteauneuf-du-Pape.
2. **Handelaren met een lange publieke jaargangstaat.** Berry Bros & Rudd, Farr Vintners, Justerini & Brooks, Corney & Barrow, iDealwine.
3. **Vakmedia.** Decanter, Jancis Robinson, Vinous, The Drinks Business, Wine Spectator, Wine Enthusiast, World of Fine Wine, The Wine Independent, drinkrhone.com (John Livingstone-Learmonth), Mosel Fine Wines, Club Oenologique, Harpers.

Ronde twee (16 sep, tweede sessie) gebruikte daarvan alleen wat leesbaar bleek: Vinous als beslissende stem (laag A), het IVDP voor de declaratiefeiten en de jaargangkroniek (laag C), en Wikipedia als onafhankelijke controle op de lijst algemeen gedeclareerde jaren. World of Fine Wine leverde nog bruikbare bevestiging, maar alleen via zoekuittreksels, want de artikelen zelf gaven 403; dat is in de tabel hierboven niet als dragende bron voor een plus gebruikt, alleen als steun naast Vinous of het IVDP.

Niet gebruikt als dragende bron: SEO-blogs, marketingteksten van webshops over één fles, door AI gegenereerde inhoudsfarms en forums.

**Belangrijke beperking van ronde een (16 sep).** De sessie liep in een omgeving waarin de netwerkpolicy élk extern domein blokkeerde, ook Wikipedia. Er is daarom geen enkele bronpagina integraal gelezen: alles kwam uit uittreksels die de zoekindex van die pagina's teruggaf. Van welk domein een uitspraak komt was daarmee bekend, de woordelijke context niet. Dat is zwakker dan de pagina zelf lezen, en het is de reden dat een aantal streken helemaal leeg bleef.

**Wat ronde twee over de omgeving leerde, en waarom er maar één streek bij kwam.** De policy is tussen ronde een en twee verruimd, maar niet naar de bronnenlijst hierboven. Het gemeten beeld, met curl per host getoetst en niet aangenomen:

- `WebFetch` is nog steeds voor élk domein geblokkeerd, ook voor hosts die wél bereikbaar zijn. Dat loopt over een andere uitgang dan de container. Pagina's lezen gaat dus met `curl` vanuit Bash, en dat kost geen zoekbudget. Dat is de belangrijkste praktische les van deze ronde.
- Wel leesbaar, met volledige tekst: `vinous.com` (via `v1.vinous.com/articles/<slug>`, laag A en veruit de bruikbaarste), `ivdp.pt`, `drinkrhone.com`, `en.wikipedia.org`, `consorziobrunellodimontalcino.it`, `riojawine.com`, `winesofgreece.org`.
- Bereikbaar maar onbruikbaar: `worldoffinewine.com` geeft 200 op de voorpagina en 403 op elk artikel, `harpers.co.uk` geeft alleen "Subscriber login", `jancisrobinson.com` blokkeert de bot met 403.
- Geblokkeerd: `decanter.com`, `winespectator.com`, `wineenthusiast.com`, alle handelaren uit laag B (`bbr.com`, `farrvintners.com`, `justerinis.com`, `corneyandbarrow.com`, `idealwine.com`), vrijwel alle streekinstanties (`champagne.fr`, `deutscheweine.de`, `vdp.de`, `inter-rhone.com`, `civa.fr`, `bordeaux.com`) en alle porthuizen (`symington.com`, `taylor.pt`, `quintadonoval.com`).
- Let op de hostnaam: de allowlist is exact per host. `en.wikipedia.org` mag en `nl.wikipedia.org` niet; een kale domeinnaam kan langskomen terwijl de `www.`-variant waar hij heen wijst geblokkeerd is, wat een 301 naar een dood eind oplevert.

`WebSearch` werkt wel. Het werkzame patroon van deze ronde is daarom: zoeken om een URL te vinden, en die URL dan met `curl` integraal lezen. De Douro kon daardoor wél, want laag A (Vinous) en de streekinstantie (IVDP) zijn allebei leesbaar. Voor vrijwel alle andere lege streken ontbreekt een tweede leesbare onafhankelijke bron, en dan mag er per de regel hierboven geen plus staan. Dat is de hele reden dat ronde twee één streek opleverde in plaats van tweeëntwintig, en niet een kwestie van tijd of budget.

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

## Wat als eerste moet worden nagetrokken

Deze punten kwamen uit de ronde als sterke aanwijzingen die de lat van twee bronnen niet haalden. Ze staan dus **niet** in de tabel, en dit is de werklijst voor de volgende ronde, op volgorde van belang:

1. **Sauternes 1983 staat op 5 en dat is vermoedelijk fout.** Decanter beschrijft het jaar als matig, met "little or none of the noble rot". De hele Sauternes-reeks rust nu op één uitgever en is de minst betrouwbare grote streek in de tabel.
2. **Piemonte 2004 (nu 5) en 2014 (nu 2).** De fragmenten spreken beide waarden tegen: 2004 zou sneller zijn verouderd dan gedacht, en Vinous is juist positief over 2014.
3. **Champagne 2005 (nu 3).** Eén scherpe bron noemt het jaar wisselend met overrijpe en rotkarakters, wat naar 2 duwt.
4. **Elzas 2000 (nu 4), 2003 (nu 4) en 2012 (nu 4)** staan alle drie onder druk volgens één bron, en de Elzas mist de kruisverificatie van de CIVA volledig.
5. **Loire 2019 (nu 5), 2022 en 2015.** En de vier jaren waar een kelderapp voor oude zoete Chenin het meest aan heeft, 1989, 1990, 1996 en 1997, zijn met geen enkele serieuze bron aangeraakt.
6. ~~De Douro is de pijnlijkste lacune.~~ **Gedaan in ronde twee**, zie de sectie hierboven. Wat er van overblijft voor ronde drie: de rij splitsen in versterkte port en stille Douro, en de jaren 2004, 2005, 2008, 2012, 2013, 2015, 2019, 2020, 2021 en 2023 hebben nog geen tweede bron. Voor 2019 en 2023 ligt die er vermoedelijk wel zodra World of Fine Wine leesbaar is: die had per jaar een stuk, alleen gaf het domein op elk artikel een 403.
7. **Twee streken bestaan nog niet en zijn wel nodig:** midden- en zuidoost-Spanje (Jumilla tot La Mancha) en Corsica. Nu krijgt zo'n fles helemaal geen jaargangoordeel. Zie de sectie over streken die de app niet herkent.
8. **Duitsland 1999, 2003 en 2013 staan mogelijk te hoog** volgens de Decanter-gids, en voor Duitsland liggen droge en zoete riesling in sommige jaren ver uiteen (1988, 1994, 2003, 2010). De app onderscheidt die twee al in `vensterBasis`, dus een aparte rij voor droog en zoet is hier de logische volgende stap, zoals bij de Bourgogne al gebeurd is.

## Wanneer een streek gesplitst moet worden

Een streek verdient een eigen rij zodra bronnen melden dat de jaargangen er echt uiteenlopen, en niet eerder. Pauillac en Saint-Julien scheiden is zinloos, want die volgen elkaar bijna perfect; splitsen verdubbelt dan alleen het controlewerk en levert twee halfleeg rijen op. Het mechanisme is er wel: `STREKEN` gaat op volgorde van specifiek naar algemeen, dus een rij met de appellations van de rechteroever vóór de rij `bordeaux` werkt, en het veld `t:[...]` beperkt een rij tot bepaalde types, zoals bij de Bourgogne rood en wit.

**Deze lijst is op 16 september uitgevoerd; zie de sectie over de splitsing.** Hij blijft staan omdat hij vastlegt wáárom elke rij gesplitst is, en omdat de rijen nu wel bestaan maar nog grotendeels geërfde schattingen dragen:

- `australie` is nu één rij voor een heel continent. Margaret River en de Barossa liggen 2700 km van elkaar.
- `californie` loopt van Napa tot Santa Barbara, en de rookschade van 2020 sloeg per gebied verschillend toe: het onderzoek van 16 sep vond dat de valleivloer van Sonoma relatief gespaard bleef terwijl Napa voor late rode druiven vrijwel volledig werd geraakt.
- `chili` loopt van Limarí tot Itata, ruim 1300 km.
- `italie_noord` vat Alto Adige tot Abruzzo samen.
- `zuiditalie` vat de Etna en Puglia samen, twee volstrekt verschillende klimaten.
- `portugal` vat Vinho Verde tot Alentejo samen.
- `douro` vat versterkte port en droge Douro-tafelwijn samen. Nieuw uit ronde twee, en van deze hele lijst het best onderbouwd: een niet-gedeclareerd jaar zegt alleen iets over de port. Noval maakte in 2009 geen vintage port omdat het profiel niet klopte, terwijl de tafelwijnen van diezelfde oogst goed waren.
- `griekenland` vat Santorini, Naoussa en Nemea samen: een winderig, droog vulkaaneiland, hooggelegen Macedonië en de Peloponnesos. Gevonden in ronde twee bij een poging de streek te vullen, die juist daarom is gestaakt.

**Daarna de splitsingen waar bronnen op 16 september een echte divergentie meldden.** Deze zijn onderbouwd en niet bedacht:

- **Bordeaux linker- tegenover rechteroever.** 1998 (rechteroever uitstekend, Médoc kwam tekort), 2001 (zelfde patroon milder) en 2011 (Cabernet Franc rechts redelijk, links miste fenolische rijpheid).
- **Duitsland droog tegenover zoet.** 1988 en 1994 gaven botrytis en dus superieure Spätlese tot TBA; 2003 en 2010 waren juist lastig voor droog. De app onderscheidt droge en restzoete riesling al in `vensterBasis`, dus de tabel kan meteen mee.
- **Loire in droog wit, zoete Chenin en rood.** 2003 tilde Cabernet Franc naar een nieuw niveau terwijl Chenin leed onder meeldauw en rijpingsproblemen, en 2000 en 2006 waren in de Elzas net zo: zwak voor droog, uitstekend voor botrytis.
- **Elzas droog tegenover Vendanges Tardives en SGN**, om dezelfde reden.
- **Toscane in Brunello, Chianti en Bolgheri**, want kust en binnenland lopen in hete jaren uiteen.

Uit ronde twee komt daar één waarschuwing bij, want die ronde liep er zelf bijna in. Het enige dat over Griekenland te lezen was, ging integraal over opbrengst en wijngaardschade: 180 millimeter winterregen in 2023, een hagelbui in april die de oogst halveerde, 100 millimeter in 2024, en in 2025 drieduizend flessen waar er normaal achtduizend zijn. Over de kwaliteit van de wijn stond er niets. Dat om te rekenen naar een laag niveau zou exact de fout zijn die ronde een twee keer aantrof en repareerde bij Champagne 2024 en Bourgogne wit 2024. Er is daarom geen enkel Grieks jaar ingevoerd. **Opbrengstverlies is geen kwaliteitsverlies, ook niet als het de enige beschikbare informatie is; dan is "geen mening" het antwoord.**

Laat het onderzoek de divergentie zelf rapporteren in plaats van vooraf te beslissen. De opdracht hoort te zijn: meld per streek of bronnen melden dat deelgebieden of kleuren uiteenlopen, en zo ja voor welke jaren. Splits pas als het antwoord ja is en er voor beide helften data ligt.

## Een gat dat geen jaargangonderzoek is: streken die de app niet herkent

Naast "welk jaar is gecontroleerd" speelt een tweede vraag die de tabel stil kan laten falen: herkent `streekVan` de fles überhaupt? Zo niet, dan is er geen streek, dus geen jaargangoordeel, en de app zwijgt zonder te zeggen dat ze zwijgt. Dat is niet zichtbaar in de dekkingstabel hierboven, want die telt alleen jaren in streken die al bestaan.

Op 16 september zijn 144 veelvoorkomende appellations door `streekVan` gehaald (script in de sessie, niet bewaard). Vijfentwintig kwamen op niets uit, ruim een zesde. De pijnlijkste waren **Prosecco** en **Cava**, twee van de meest verkochte wijnen ter wereld, allebei zonder streek. Verder Corpinnat en Costers del Segre, Cerasuolo di Vittoria, en heel Corsica en midden- en zuidoost-Spanje.

Toegevoegd, alleen waar de streek onomstreden is: `veneto` kreeg prosecco, conegliano, valdobbiadene, asolo, glera, piave, montello en gambellara; `priorat` kreeg cava, corpinnat, costers del segre, catalunya, alella, pla de bages en tarragona; `zuiditalie` kreeg cerasuolo di vittoria, vittoria, frappato, nero d'avola, noto, faro, gaglioppo, irpinia, sannio en molise. Daarmee gaat het van vijfentwintig naar eenentwintig missers.

Wat er bewust níet is bijgeprikt, want een verkeerde streek geeft een verkeerd drinkadvies en dat is erger dan geen advies: **midden- en zuidoost-Spanje** (Jumilla, Yecla, Alicante, Utiel-Requena, Valencia, La Mancha, Valdepeñas, Almansa, Calatayud, Madrid, Gredos, Málaga) past in geen bestaande rij, en Jumilla onder Rioja hangen zou onzin zijn. **Corsica** (Vin de Corse, Patrimonio, Ajaccio) net zo: het ligt dichter bij Sardinië dan bij de Provence. Allebei hebben een eigen rij nodig, met eigen jaargangen. Dat is werk voor een volgende ronde en het staat op de werklijst.

Dit soort controle hoort periodiek te draaien, en is goedkoper dan jaargangonderzoek: het kost geen bronnen, alleen een lijst appellations tegen `streekVan`.

## Toscane, bijgesteld maar niet gecontroleerd

Vinous bleek voor Toscane terugkijkende jaargangstukken te hebben die integraal leesbaar zijn, en dat is precies het soort bron dat dit bestand het hoogst aanslaat. Er is geen tweede leesbare onafhankelijke bron voor Toscane, dus er staat **geen plus** bij; dit zijn betere schattingen, geen gecontroleerde jaren. Gebruikte vindplaatsen op `v1.vinous.com/articles/`: `the-landmark-vintage-2006-brunello-di-montalcino-retrospective-feb-2026`, `a-vintage-of-transcendence-2004-brunello-di-montalcino-retrospective-jan-2025` en `chianti-classico-looking-up-aug-2026`.

Wat eruit kwam: 2004 en 2006 zijn bevestigd op 5 (Galloni noemde 2006 destijds "a benchmark vintage for Brunello di Montalcino", de terugblik van twintig jaar later geeft hem gelijk), 2005 blijft 3 ("beginning to fade"), en 2002 is nieuw op 1, want Vinous spreekt van "the nearly nonexistent 2002s". **2022 ging van 4 naar 3**, omdat Galloni in augustus 2026 schrijft dat 2022 en 2023 zwaar zijn geraakt door weersextremen die de kwaliteit aantoonbaar omlaag haalden, niet alleen de opbrengst. 2024 is nieuw op 3 ("surprisingly good in spots, despite some inconsistency") en 2025 op 4 ("hold significant promise").

Let op de beperking, en die is dezelfde als bij de Douro: dit oordeel komt grotendeels uit Chianti Classico, terwijl de rij `toscane` ook Montalcino en Bolgheri vangt. Kust en binnenland lopen in hete jaren uiteen, dat staat al op de splitslijst. 2023 is daarom niet verlaagd hoewel Chianti dat jaar zwaar leed: dat is te specifiek om over heel Toscane uit te smeren.

## Hoe je een volgende ronde draait

0. **Toets eerst welke hosts bereikbaar zijn, en doe dat met `curl` en niet met WebFetch.** Ronde twee verloor bijna de hele ronde aan de aanname dat een geblokkeerde WebFetch betekent dat het domein dicht zit; in werkelijkheid waren Vinous en het IVDP gewoon te lezen. Draai per host `curl -sSL -o /dev/null -w '%{http_code}' https://host/`, volg de omleidingen, en trap niet in een 200 op de voorpagina bij een site die op artikelen 403 geeft. Bepaal pas daarna welke streken haalbaar zijn: een streek zonder twee leesbare onafhankelijke bronnen is geen streek om aan te beginnen.
1. Laat het onderzoek per streekgroep doen, met de bronnenlat hierboven en de eis van twee onafhankelijke bronnen per jaar. Geef de huidige waarden mee, zodat er bevestigd of tegengesproken wordt in plaats van opnieuw bedacht. Zoek om een URL te vinden en lees die dan met `curl`: zoeken kost budget, lezen niet.
2. Zet de uitkomst in een tekstbestand, één streek per regel: `champagne: 1996:5+ 2002:5+ ...`, met een plus bij elk jaar dat de lat haalt.
3. Draai `python3 tools/zet-jaargangen.py <bestand>` voor een droogloop. Die controleert de vorm, laat per streek zien wat er verandert en telt hoeveel jaren gecontroleerd zijn. Voeg `--schrijf` toe om het door te voeren.
4. Werk dit bestand bij: de dekkingstabel, de bronnen en de werklijst.
5. `./build.sh` en `./check.sh`. De tests toetsen de vorm van de tabel en de scheiding tussen gecontroleerde en geschatte jaren, niet de inhoud, want dat is een redactionele keuze.

Elk najaar hoort het nieuwe oogstjaar erbij, en horen de jonge jaargangen te worden bijgesteld zodra de wijnen op de markt zijn en er echte proefverslagen liggen. Een jaargangtabel is geen eenmalige gegevenslevering.
