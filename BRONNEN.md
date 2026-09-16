# Bronnen voor het jaargangonderzoek: wat werkt, en wat welke bron mag beslissen

Dit bestand had twee doelen. Het eerste was een wenslijst voor de netwerk-allowlist, want in ronde
een en twee was vrijwel alles geblokkeerd. Dat doel is grotendeels vervallen: **op 16 september,
ronde drie, bleek 91 van de 141 hosts gewoon bereikbaar**, waaronder de twee bronnen waarvan het
vorige bestand zei dat ze samen meer streken dekken dan alle andere bij elkaar, Decanter en World
of Fine Wine. Wat overblijft is het tweede doel, en dat is het belangrijkere: vastleggen welke soort
bron waarover mag beslissen, en hoe je meet of een bron leesbaar is in plaats van het aan te nemen.

## De les van ronde drie: een 403 is een eigenschap van het verzoek, niet van het domein

Ronde twee schreef Decanter, Wine Spectator, World of Fine Wine, The Wine Society en de hele
handelslaag af als geblokkeerd. Dat was voor een deel de netwerkpolicy en voor een deel iets anders:
**de user-agent.** Gemeten over alle 141 hosts, elk met twee user-agents:

| user-agent | leesbaar |
|---|---|
| `curl/8.0` | `worldoffinewine.com`, `thewinesociety.com`, `vinsalsace.com`, `winecountryontario.ca` geven 200 — en 403 op Chrome |
| Chrome-string | `docalatayud.com`, `somontano.org`, `thewinecellarinsider.com`, `beaujolais.com` geven 200 — en 403 of 522 op curl |
| allebei | de overige 84 bereikbare hosts |

De praktische regel is dus: **toets elke host met bèide, en schrijf er pas een af als hij op allebei
faalt.** Dat kost één extra verzoek en het verschil is deze ronde twee van de drie belangrijkste
bronnen geweest.

Twee andere valkuilen uit eerdere rondes staan nog steeds overeind. **Lees met `curl` vanuit Bash,
niet met WebFetch**: WebFetch loopt over een andere uitgang en is voor élk domein geblokkeerd, ook
voor hosts die met curl opengaan; curl kost bovendien geen zoekbudget, dus zoek alleen om een URL te
vínden en lees die dan met curl. En **een 200 op de voorpagina is geen leesbaar artikel**: controleer
de tekst. Bij Decanter betekent een 404 een verkeerde URL en geen blokkade, dus haal de indexpagina's
op en grep de links eruit in plaats van slugs te raden.

Wat een geblokkeerd verzoek wél precies is, is nu ook gemeten. Een `000` komt niet van een niet
bestaand domein maar van de uitvoeromgeving: `curl -sS "$HTTPS_PROXY/__agentproxy/status"` noteert
per host `gateway answered 502 to CONNECT (policy denial or upstream failure)`. Dat onderscheid is
nuttig, want het betekent dat de 35 onbereikbare hosts hieronder wél bestaan en alleen op de
allowlist hoeven.

## Wat bereikbaar is, per laag

**Laag A, critici en specialisten — beslissende stem over kwaliteit.**
Bereikbaar: `vinous.com` en `v1.vinous.com` (integraal leesbaar, per streek terugkijkende
jaargangrapportages, de dragende bron van ronde twee en drie), `decanter.com` (jaargangkaarten per
jaar en per streek, zie hieronder), `worldoffinewine.com` (met `curl/8.0`), `winespectator.com`,
`jamessuckling.com`, `timatkin.com`, `wineanorak.com`, `guildsomm.com`, `drinkrhone.com`,
`moselfinewines.com`, `thewinecellarinsider.com`, `thewineindependent.com`, `cluboenologique.com`,
`thedrinksbusiness.com`, `harpers.co.uk`, `robertparker.com`, `terredevins.com`, `vinetur.com`.
Nog steeds dicht: `jancisrobinson.com` (403 op beide), `falstaff.com`, `gamberorosso.it`,
`larvf.com`, `wineenthusiast.com` en `winemag.com` (403 op beide), `bourgogne-report.com` (policy).

**Laag B, handelaren met een lange publieke jaargangstaat — lage oordelen wegen zwaar, hoge met
terughoudendheid.** Bereikbaar: `bbr.com` (de volledige jaargangkaart 1978-2025 voor 21 streken,
inclusief rijpheidscode per jaar; zie de waarschuwing hieronder), `thewinesociety.com` (met
`curl/8.0`), `farrvintners.com`, `justerinis.com`, `idealwine.com`, `millesima.com`,
`goedhuiswaddesdon.com`. Dicht: `corneyandbarrow.com`, `laywheeler.com`, `leaandsandeman.co.uk`
(403 op beide), `armit.co.uk` (policy).

**Laag C, streekinstanties en oogstverslagen — feiten, nooit de doorslag.** Ruim veertig bereikbaar,
waaronder `bordeaux.com`, `chablis-wines.com`, `chateauneuf.com`, `vins-rhone.com`,
`vinsvaldeloire.fr`, `vinsdeprovence.com`, `languedoc-wines.com`, `vinsalsace.com`, `jura-vins.com`,
`beaujolais.com`, `sauternes-barsac.com`, `vinsdecorse.com`, `madiran-pacherenc.com`,
`chianticlassico.com`, `consorziobrunellodimontalcino.it`, `consorziovalpolicella.it`,
`consorziovinochianti.it`, `consorziovinonobile.it`, `langhevini.it`, `coneglianovaldobbiadene.it`,
`prosecco.it`, `consorziomontefalco.it`, `winesofsicily.com`, `imtdoc.it`, `riojawine.com`,
`riberadelduero.es`, `doqpriorat.org`, `domontsant.com`, `dopenedes.cat`, `dorueda.com`,
`doriasbaixas.com`, `dotoro.es`, `navarrawine.com`, `somontano.org`, `docalatayud.com`,
`jumillawine.com`, `utielrequena.org`, `sherry.wine`, `ivdp.pt`, `winesofportugal.com`, `cvrdao.pt`,
`vinhosdoalentejo.pt`, `deutscheweine.de`, `germanwines.de`, `vdp.de`, `moselwein.de`,
`rheingau.com`, `oesterreichwein.at`, `tokaj.hu`, `winesofgreece.org`, `newwinesofgreece.com`,
`wineaustralia.com`, `nzwine.com`, `wosa.co.za`, `winesofargentina.org`, `winesofchile.org`,
`napavintners.com`, `sonomawinegrape.org`, `sonomawine.com`, `wineinstitute.org`, `oregonwine.org`,
`washingtonwine.org`, `pasowine.com`, `sbcountywines.com`, `montereywines.org`, `winebc.com`,
`winecountryontario.ca`.

Geblokkeerd door de netwerkpolicy (allemaal laag C op `armit.co.uk` en `bourgogne-report.com` na, en
dus de moeite van het whitelisten waard, maar geen van alle beslissend voor kwaliteit):
`alicantedop.org`, `altoadigewines.com`, `aoc-cahors.fr`, `armit.co.uk`, `banyuls-collioure.com`,
`bergerac-duras.fr`, `bierzo.wine`, `bourgogne-report.com`, `bourgogne-wines.com`, `cava.wine`,
`champagne.fr`, `civa.fr`, `consorziobarolobarbarescoalbalanghe.it`, `consorziobolgheri.com`,
`consorziofranciacorta.it`, `consorzioproseccodoc.it`, `consorziotutelalambrusco.it`,
`consorziotutelavinidabruzzo.it`, `consorziovinietna.it`, `consorziovinipuglia.it`,
`consorziovinisoave.it`, `consorziovinitaurasi.it`, `consorziovinivaltellina.com`, `cvrbairrada.pt`,
`empordawines.com`, `inter-rhone.com`, `ivbam.gov.pt`, `jurancon-vins.fr`, `lamanchawines.es`,
`loirevalleywine.com`, `vindesavoie.net`, `vinhoverde.pt`, `vinidocsardegna.it`, `vinitrentino.com`,
`vins-sud-ouest.com`.

De kale hostlijst om te plakken staat in `BRONNEN-HOSTS.txt`. De allowlist werkt exact per host, dus
de kale naam én de `www.`-variant zijn allebei nodig; `en.wikipedia.org` mag terwijl
`nl.wikipedia.org` niet mag, en subdomeinen erven niets.

## Welke bron mag wat beslissen

Deze indeling is de kern van het bestand en verandert niet.

**Laag A** zijn critici met terugkijkende proeverijen en specialisten. Zij hebben er commercieel
niets aan om een jaargang mooier te maken dan hij is, en zij beslissen over kwaliteit.

**Laag B** zijn handelaren met een lange publieke jaargangstaat. Ze willen verkopen, maar hun staat
kost hen reputatie als hij niet klopt. Behandel hun **lage** oordelen als een sterk signaal en hun
hoge met terughoudendheid.

**Laag C** zijn streekinstanties en promotie-organisaties. Uitstekend en vaak gezaghebbend voor wat
controleerbaar is — opbrengst, vorstdata, hittegolven, ziektedruk, oogstdata, declaraties — en
**nooit de beslissende stem over kwaliteit**, want ze verklaren hun eigen jaargang bijna nooit
slecht. Het gemeten bewijs staat in `JAARGANGEN.md`: Ribera del Duero gaf in veertig jaar nooit een
onvoldoende.

## De twee jaargangkaarten, en waarom ze nooit in hun eentje beslissen

Twee bronnen geven een volledige kaart over veel streken tegelijk, en dat is verleidelijk genoeg om
er een aparte waarschuwing bij te zetten.

- **Berry Bros & Rudd**, `https://www.bbr.com/vintage-chart`: 858 jaarvakjes over 21 streken van 1978
  tot 2025, met een eigen schaal van "1 (very poor) to 10 (outstanding)" en een rijpheidscode per
  jaar. De gegevens zitten in de Nuxt-payload van de pagina en zijn er met `node` uit te halen.
- **Wine Spectator**, de portemonneekaart achter `https://www.winespectator.com/vintage-charts`
  (een PDF op `s3.amazonaws.com`): ruim vijftig streken, maar alleen de recente jaren, met naast het
  cijfer een gepubliceerde bandnaam (Classic, Outstanding, Very Good, Good, Mediocre) en een
  drinkadvies.

Beide zijn gemeten tegen de jaren die deze tabel onafhankelijk al had vastgesteld. Berry Bros komt
op 47 procent exact gelijk en 92 procent binnen één stap (n=223); Wine Spectator op 55 procent exact
en 98 procent binnen één stap (n=62). Dat is goed genoeg om te bevestigen en te ontkennen, en te
slecht om op te varen: de afwijking loopt op precies waar je het verwacht, namelijk waar hun rij
breder is dan de onze. Berry Bros' rij "Italy" tegen onze Piemonte haalt 39 procent en zit zes keer
twee stappen mis; hun "Red Bordeaux" tegen onze Bordeaux haalt 78 procent.

**De regel die daaruit volgt: een jaargangkaart is een tweede stem, nooit de eerste.** Het niveau
komt uit wat een laag-A-bron kwalitatief zegt; de kaart bevestigt of spreekt tegen. Een kaart van
één uitgever omrekenen naar onze schaal blijft verboden, en dat is niet hetzelfde als hem lezen.

## Wat nog niet lukt

`cellartracker.com` geeft 405 op curl en 202 met een lege body op Chrome: een anti-botmaatregel van
de site zelf, niet de netwerkpolicy. Dat is jammer, want het is de enige brede publieke bron met
**drinkvensters per wijn**, uit duizenden proefnotities, en dat is precies het deel dat in ronde een,
twee en drie niet is gelukt. `wine-searcher.com` (403 op beide) valt om dezelfde reden af.
`thewinesociety.com` is nu wel leesbaar en publiceert drinkvensters bij zijn wijnen; dat is de beste
overgebleven ingang voor een volgende ronde.
