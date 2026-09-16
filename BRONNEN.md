# Bronnen-allowlist voor het jaargangonderzoek

Deze lijst hoort op de netwerk-allowlist van de uitvoeromgeving. Hij is geordend naar de bronlagen uit `JAARGANGEN.md`, want die bepalen wat een bron mag beslissen: laag A beslist over kwaliteit, laag B weegt zwaar bij een láág oordeel, laag C levert feiten en nooit de doorslag.

**Drie dingen om te weten voor je hem invoert.**

De allowlist werkt **exact per host**. `decanter.com` toelaten is niet genoeg: de site leidt door naar `www.decanter.com`, en als die er niet op staat loopt het dood op een 301 naar een geblokkeerde host. Zet daarom overal de kale naam én de `www.`-variant op de lijst. Bij Wikipedia bleek `en.wikipedia.org` open terwijl `nl.wikipedia.org` dicht zat, dus subdomeinen erven niets.

**Whitelisten is niet altijd genoeg.** Drie sites blokkeren de bot zelf, los van de netwerkpolicy: `jancisrobinson.com` en `corneyandbarrow.com` geven 403 op elk verzoek, en `worldoffinewine.com` geeft 200 op de voorpagina en 403 op elk artikel. Die drie zijn het meest waard en het minst zeker; zet ze erop, maar reken er niet op.

**Lees met `curl`, niet met WebFetch.** WebFetch loopt over een andere uitgang en is voor élk domein geblokkeerd, ook voor hosts die met curl gewoon opengaan. Curl kost bovendien geen zoekbudget.

## Laag A — critici en specialisten (beslissende stem over kwaliteit)

| host | waarom |
|---|---|
| `vinous.com`, `v1.vinous.com`, `www.vinous.com` | **werkt al.** Nu de enige integraal leesbare laag-A-bron, en de dragende bron van ronde twee. Terugkijkende jaargangrapportages per streek. |
| `decanter.com`, `www.decanter.com` | jaargangkaarten en -gidsen per streek, de breedste dekking die er is |
| `jancisrobinson.com`, `www.jancisrobinson.com` | `/learn/vintages/` is letterlijk een jaargangkaart per streek. Bot-geblokkeerd, zie boven |
| `worldoffinewine.com`, `www.worldoffinewine.com` | per jaar een stuk, ook over streken die verder niemand dekt. Artikelen nu 403 |
| `winespectator.com`, `www.winespectator.com` | jaargangkaarten, brede dekking inclusief Nieuwe Wereld |
| `wineenthusiast.com`, `www.wineenthusiast.com` | idem, en sterk op Nieuwe Wereld |
| `thewineindependent.com`, `www.thewineindependent.com` | **deels bereikbaar.** Napa en Bordeaux, terugkijkend |
| `jamessuckling.com`, `www.jamessuckling.com` | Italië en Bordeaux |
| `timatkin.com`, `www.timatkin.com` | Rioja, Zuid-Afrika, Argentinië en Chili: precies de lege streken |
| `wineanorak.com`, `www.wineanorak.com` | Jura, Portugal, Zuid-Afrika, buitenbeentjes |
| `guildsomm.com`, `www.guildsomm.com` | streekdossiers met oogstverslagen |
| `drinkrhone.com`, `www.drinkrhone.com` | **werkt al.** Livingstone-Learmonth, de Rhône-specialist |
| `moselfinewines.com`, `www.moselfinewines.com` | **werkt al.** Duitsland, en de enige die droog en zoet apart weegt |
| `cluboenologique.com`, `www.cluboenologique.com` | **deels bereikbaar** |
| `thewinecellarinsider.com` | Bordeaux per jaargang, gratis toegankelijk |
| `robertparker.com`, `www.robertparker.com` | jaargangkaart; alleen als feitelijke steun, nooit als scorekaart |

## Laag B — handelaren met een lange publieke jaargangstaat

Hun láge oordelen wegen zwaar, hun hoge met terughoudendheid.

| host | waarom |
|---|---|
| `farrvintners.com`, `www.farrvintners.com` | **werkt al.** Blog met terugkijkende blindproeverijen (Southwold, "Ten Years On") |
| `bbr.com`, `www.bbr.com` | Berry Bros & Rudd: jaargangkaart plus drinkvensters per wijn |
| `justerinis.com`, `www.justerinis.com` | lange publieke jaargangstaat |
| `corneyandbarrow.com`, `www.corneyandbarrow.com` | idem. Bot-geblokkeerd, zie boven |
| `idealwine.com`, `www.idealwine.com` | Frankrijk, met jaargangoverzichten per streek |
| `thewinesociety.com`, `www.thewinesociety.com` | jaargangkaart én drinkvensters, breed |
| `laywheeler.com`, `www.laywheeler.com` | Bourgogne en Bordeaux |
| `millesima.com`, `www.millesima.com` | Frankrijk breed |
| `goedhuiswaddesdon.com` | Bourgogne |

## Laag C — streekinstanties en oogstverslagen (feiten, nooit de doorslag)

Opbrengst, vorstdata, hittegolven, ziektedruk, oogstdata, declaraties.

**Let op bij deze laag:** de hosts hieronder kon ik niet verifiëren, want ze zijn nu allemaal geblokkeerd en een geblokkeerd verzoek zegt niets over of het domein bestaat. Ze komen uit kennis, niet uit een meting. Controleer ze kort voor je ze invoert; een verkeerd gespelde host kost je niets behalve een regel op de lijst. De hosts met "**werkt al**" zijn wél gemeten.

**Frankrijk:** `bordeaux.com`, `www.bordeaux.com` · `bourgogne-wines.com`, `www.bourgogne-wines.com` · `vins-rhone.com`, `inter-rhone.com` · `champagne.fr`, `www.champagne.fr` · `vinsvaldeloire.fr`, `loirevalleywine.com` · `vinsdeprovence.com` · `languedoc-wines.com` · `vinsalsace.com`, `civa.fr` · `jura-vins.com` · `beaujolais.com` · `vins-sud-ouest.com` · `vinsdecorse.com`

**Italië:** `consorziobrunellodimontalcino.it` (**werkt al**) · `chianticlassico.com` · `consorziovalpolicella.it` · `langhevini.it` · `consorziobarolobarbarescoalbalanghe.it` · `consorziovinodoc.it` · `altoadigewines.com` · `winesofsicily.com`

**Spanje en Portugal:** `riojawine.com` (**werkt al**) · `riberadelduero.es` · `doqpriorat.org` · `sherry.wine` · `ivdp.pt` (**werkt al**) · `winesofportugal.com` · `vinhoverde.pt`

**Duitsland, Oostenrijk, Hongarije, Griekenland:** `deutscheweine.de`, `germanwines.de` · `vdp.de` · `austrianwine.com` · `tokaj.hu` · `winesofgreece.org` (**werkt al**)

**Nieuwe Wereld:** `wineaustralia.com` · `nzwine.com` · `wosa.co.za` · `winesofargentina.org` · `winesofchile.org` · `napavintners.com` · `sonomawinegrape.org` · `wineinstitute.org` · `oregonwine.org` · `washingtonwine.org` · `winebc.com` · `winesvinesanalytics.com`

## Referentie en drinkvensters

| host | waarom |
|---|---|
| `en.wikipedia.org` | **werkt al.** Goed voor discrete publieke feiten (welke jaren algemeen gedeclareerd zijn), niet voor kwaliteitsnuance |
| `cellartracker.com`, `www.cellartracker.com` | de enige brede publieke bron met **drinkvensters per wijn**, uit duizenden proefnotities. Precies het deel dat in ronde een en twee niet lukte |
| `wine-searcher.com`, `www.wine-searcher.com` | jaargangkaarten plus marktprijzen; ook bruikbaar voor de prijslaag |

## Wat dit oplevert

De plus-eis is twee onafhankelijke bronnen. Nu is Vinous de enige integraal leesbare laag-A-bron, dus komt vrijwel elke streek op één bron uit en mag er geen plus staan. **Eén tweede leesbare bron verdubbelt het werk niet maar ontgrendelt het:** met Decanter of World of Fine Wine erbij kan bijna elke Europese streek naar twee bronnen, en met Tim Atkin en de Nieuwe-Wereldinstanties komen Zuid-Afrika, Argentinië, Chili en Australië voor het eerst binnen bereik.

Als er maar één ding op kan: **`worldoffinewine.com` plus `decanter.com`**. Die twee samen dekken meer streken dan alle andere bij elkaar.
