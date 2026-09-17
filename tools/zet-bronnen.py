#!/usr/bin/env python3
"""Schrijft de twee brontabellen in cellarmentor.html: wat bronnen over rijpheid zeggen, en één
citaat per streek en jaargang.

Waarom dit bestaat, en waarom het een script is en geen handwerk: net als bij de jaargangniveaus
is overtypen precies het werk waar fouten in sluipen, en een verkeerd citaat bij de verkeerde wijn
is erger dan geen citaat. De invoer is het onderzoeksdossier zelf (bronnen/bevindingen.json), zodat
de app en het dossier niet uit elkaar kunnen lopen.

Twee regels die in de tabellen zijn ingebakken:

  Wine Spectator wordt niet gebruikt. Hun robots.txt weigert ClaudeBot en Anthropic-Client met
  Disallow: /. Dat is een expliciete weigering en die respecteren we, ook al kost het 24 jaren hun
  onderbouwing.

  Vinous wordt wel als bron genoemd maar niet geciteerd. Onder elk artikel staat "No portion of
  this article may be copied, shared or redistributed without prior consent from Vinous". De
  gebruiker ziet daarom de uitgever en een link, en niet hun zin. Dat is geen verlies: de link
  brengt de lezer bij het stuk zelf, wat is wat die notitie beschermt.

Gebruik:
    python3 tools/zet-bronnen.py            (droogloop, schrijft niets)
    python3 tools/zet-bronnen.py --schrijf
Daarna altijd ./build.sh en ./check.sh.
"""
import json
import re
import sys
from pathlib import Path

WORTEL = Path(__file__).resolve().parent.parent
BRON = WORTEL / 'cellarmentor.html'
GEWEIGERD = {'Wine Spectator'}
# Uitgevers die hun tekst niet gekopieerd willen zien. Bij die twee toont de app de naam en de
# link, en niet hun zin. Een zin die niemand te zien krijgt is minder waard dan een zin die dat
# wel doet, dus bij gelijke geschiktheid wint een uitgever die wel geciteerd mag worden.
STIL = {'Vinous', 'The Wine Cellar Insider'}
MAX_CITAAT = 115


def basis(url):
    m = re.match(r'(https?://[^/]+/)', url)
    return m.group(1) if m else ''


# Zinnen waarin een bron iets over rijpheid zegt in plaats van over het karakter van de jaargang.
# Een oordeel over een jaargang veroudert niet ("een warm jaar met rijpe tannines" blijft waar),
# maar "drink now" uit 2015 slaat op een wijn die toen elf jaar jonger was. Zulke citaten gaan
# daarom niet op de kaart bij de fles, alleen in het blad erachter, met het jaartal erbij.
RIJPTAAL = re.compile(
    r"\b(drink(ing)? (now|up|soon)|ready to drink|ready now|past (its|their) (best|peak|prime)|"
    r"should be drunk|at (its|their) (best|peak|prime)|cellar (until|for)|will keep|"
    r"keeps? (for|until)|needs? (more )?time|will need time|approachable|over the hill|fading|"
    r"hold (until|for)|not ready|years? (of (life|ageing|aging)|to go))\b", re.I)


# Een citaat moet een zin zijn die iets beweert, geen naam en geen cijfer. Twee dingen worden
# hier hard tegengehouden.
#
#   Puntenscores. De opdracht verbiedt ze en toch stonden ze in de app: elf citaten toonden
#   "Languedoc 2022 vintage rating: 4.5 / 5" of een rij "2023 4/5 2022 3/5". Dat is precies het
#   cijfer dat we niet overnemen, alleen binnengekomen via de achterdeur van een citaat.
#
#   Naamregels. "Sogrape Casa Ferreirinha Barca Velha 2011 Douro, Portugal" is een wijnnaam uit een
#   kop, geen oordeel. Onder een fles leest dat als een uitspraak die er niet is.
SCORE = re.compile(r'\d+(?:[.,]\d+)?\s*/\s*(?:5|10|20|100)\b|\b\d{2,3}\s*(?:points?|pts)\b'
                   r'|\brating:?\s*\d|\b\d{2,3}[-\u2013]\d{2,3}\s*(?:points?|pts)\b', re.I)


def zegt_iets(zin):
    woorden = re.findall(r"[A-Za-z\u00c0-\u024f][A-Za-z\u00c0-\u024f'\-]*", zin)
    if SCORE.search(zin) or len(woorden) < 5:
        return False
    # een kop of een wijnnaam staat vol hoofdletters; een zin niet
    if sum(1 for w in woorden if w[0].isupper()) / len(woorden) > 0.55:
        return False
    # een rij jaartallen is een tabel, geen zin
    if len(re.findall(r'\b(?:19|20)\d\d\b', zin)) > 2:
        return False
    return True


# Woorden waarmee een schrijver een oordeel velt. Van de 448 citaten bevatten er 276 er geen:
# dat zijn zinnen als "in the heatwave year of 2018", waar is maar nietszeggend onder een fles.
# Bij gelijke geschiktheid wint de zin die iets vindt. En een zin die het tegenovergestelde vindt
# van wat wij hebben vastgesteld gaat achteraan: onder een uitzonderlijk Barolo 2004 stond
# "The only niggle was the abundant crop", en dat leest als een app die zichzelf tegenspreekt.
LOF = re.compile(r'\b(excellent|outstanding|superb|magnificent|great|greatest|exceptional|brilliant'
                 r'|stunning|stunners|remarkable|classic|fine|finest|beautiful|glorious|sublime'
                 r'|legendary|memorable|impressive|successful|perfect|thrilling|profound|benchmark)\b', re.I)
KRITIEK = re.compile(r'\b(difficult|poor|disastrous|dilute[d]?|weak|thin|disappointing|challenging'
                     r'|tricky|uneven|patchy|variable|modest|unripe|niggle|worst|failure)\b', re.I)


def kies_citaat(bevinding):
    """Eén vindplaats per streek-jaargang. Laag A gaat voor. Daarbinnen telt eerst of het stuk een
    terugblik is: de opdracht zegt dat een retrospectief oordeel zwaarder weegt dan een en-primeur,
    en met een jaartal bij elke vindplaats is dat nu ook machinaal te zien. Daarna de lengte: lang
    genoeg voor een hele gedachte, kort genoeg om onder een fles te passen."""
    kand = [b for b in bevinding['bronnen'] if b['uitgever'] not in GEWEIGERD]
    if not kand:
        return None
    kand = [b for b in kand if zegt_iets(b['citaat'])]
    if not kand:
        return None
    laagA = [b for b in kand if b['laag'] == 'A'] or kand

    niveau = bevinding['niveau']

    def rang(b):
        zin, jaar = b['citaat'], b.get('jaar')
        past = 0 if 30 <= len(zin) <= MAX_CITAAT else 1
        lof, kritiek = bool(LOF.search(zin)), bool(KRITIEK.search(zin))
        # een zin die het omgekeerde vindt van ons eigen niveau spreekt de app tegen
        botst = 1 if ((niveau >= 4 and kritiek and not lof) or (niveau <= 2 and lof and not kritiek)) else 0
        oordeelt = 0 if (lof or kritiek) else 1
        terugblik = 0 if (jaar and jaar - bevinding['jaar'] >= 3) else 1
        return (past, botst, 1 if b['uitgever'] in STIL else 0, oordeelt, terugblik, len(zin))

    return sorted(laagA, key=rang)[0]


def bouw():
    bev = json.loads((WORTEL / 'bronnen' / 'bevindingen.json').read_text(encoding='utf-8'))
    citaat, uitgevers = {}, {}
    for b in bev['bevindingen']:
        keus = kies_citaat(b)
        if not keus:
            continue
        u = keus['uitgever']
        uitgevers.setdefault(u, basis(keus['url']))
        citaat.setdefault(b['streek'], {})[b['jaar']] = {
            'u': u, 'p': keus['url'][len(uitgevers[u]):], 't': keus['citaat'],
            'y': keus.get('jaar'), 'r': 1 if RIJPTAAL.search(keus['citaat']) else 0}

    # Een rijpheidsuitspraak is een waarneming op een moment, geen eigenschap van de wijn.
    # Daarom wordt naast de stand ook het peiljaar bewaard: het jaar waarin de bron het schreef.
    # Berry Bros heeft één peiljaar voor de hele kaart, Decanter een peiljaar per gids.
    # Botsen twee bronnen, dan wint de jongste waarneming; bij een gelijk peiljaar de stand die
    # de wijn het meeste leven geeft. Dat laatste is de risicokeuze van deze app: te vroeg "over
    # de piek" roepen laat iemand een goede fles weggooien, terwijl een fles die volgens de app
    # nog kan wachten bij de eerste slok gecontroleerd wordt.
    CODE = {'bbr': 'B', 'decanter': 'D'}
    # De jaargangsgidsen van Decanter geven per streek en jaargang ook een zin, en die zin staat
    # voor 231 streek-jaargangen waar het dossier niets heeft - vooral jaren van vóór 1990, precies
    # waar deze app het zwakst was. Er hoort nadrukkelijk géén niveau bij. Die gidsen geven wel een
    # cijfer, en dat is getoetst tegen de 98 jaargangen die al tegen twee onafhankelijke bronnen
    # liggen: een afleiding uit cijfer plus zin komt op 47% precies en 89% binnen één stap, op de
    # uitersten 73% en 96%. Dat is te weinig voor een sterretje, want dat zegt dat een betrouwbare
    # bron dít niveau draagt. De zin is wel gepubliceerd en na te lezen, dus die tonen we en het
    # oordeel blijft "geen mening". Ze vullen alleen aan, ze overschrijven nooit een vindplaats uit
    # het dossier zelf.
    zinpad = WORTEL / 'bronnen' / 'jaargangzinnen-decanter.json'
    if zinpad.exists():
        zin = json.loads(zinpad.read_text(encoding='utf-8'))
        for streek, jaren in zin['per_streek'].items():
            for jaar, e in jaren.items():
                if int(jaar) in citaat.get(streek, {}):
                    continue
                if not zegt_iets(e['zin']):
                    continue
                u = zin['uitgever']
                uitgevers.setdefault(u, basis(e['url']))
                citaat.setdefault(streek, {})[int(jaar)] = {
                    'u': u, 'p': e['url'][len(uitgevers[u]):], 't': e['zin'],
                    'y': e.get('jaar'), 'r': 1 if RIJPTAAL.search(e['zin']) else 0}

    rijp = {}
    for pad in sorted((WORTEL / 'bronnen').glob('rijpheid-*.json')):
        sleutel = pad.stem.split('-', 1)[1]
        code = CODE[sleutel]
        rauw = json.loads(pad.read_text(encoding='utf-8'))
        per = rauw.get('per_streek', rauw)
        vast = rauw.get('peiljaar')
        for streek, jaren in per.items():
            for jaar, w in jaren.items():
                stand, peil = (w['stand'], w['peiljaar']) if isinstance(w, dict) else (w, vast)
                if peil is None:
                    raise SystemExit(f'{pad.name}: {streek} {jaar} heeft geen peiljaar')
                oud = rijp.setdefault(streek, {}).get(int(jaar))
                if oud is None or peil > oud[1] or (peil == oud[1] and stand < oud[0]):
                    rijp[streek][int(jaar)] = (int(stand), int(peil), code)
    rijpbron = {}
    for streek, jaren in rijp.items():
        codes = {c for _, _, c in jaren.values()}
        rijpbron[streek] = ' en '.join(n for c, n in (('B', 'Berry Bros & Rudd'), ('D', 'Decanter')) if c in codes)
    # Eén zin per plek uit Wikipedia. Geen oordeel en geen jaargang: dit gaat over de grond, de
    # helling en de geschiedenis, en dat verandert niet per oogst.
    achterpad = WORTEL / 'bronnen' / 'achtergrond-wikipedia.json'
    achter = {}
    if achterpad.exists():
        rauw = json.loads(achterpad.read_text(encoding='utf-8'))
        for kw, e in rauw.get('per_trefwoord', {}).items():
            if e and e.get('zin') and e.get('titel'):
                achter[kw] = {'s': e['streek'], 'z': e['zin'], 't': e['titel'], 'n': int(e.get('breedte') or 0)}

    prodpad = WORTEL / 'bronnen' / 'producenten.json'
    prod = json.loads(prodpad.read_text(encoding='utf-8')) if prodpad.exists() else {'per_streek': {}, 'urls': {}}
    return citaat, uitgevers, rijp, rijpbron, prod, achter


def js(v):
    return json.dumps(v, ensure_ascii=False).replace('</', '<\\/')


def main():
    citaat, uitgevers, rijp, rijpbron, prod, achter = bouw()
    tekst = BRON.read_text(encoding='utf-8')

    rij_regels = ',\n'.join(
        f"  {k}: '" + ' '.join('%d:%d:%d:%s' % ((j,) + rijp[k][j]) for j in sorted(rijp[k])) + "'"
        for k in sorted(rijp))
    cit_regels = ',\n'.join(
        f"  {k}: {{" + ', '.join(
            f"{j}:{{u:{js(citaat[k][j]['u'])},p:{js(citaat[k][j]['p'])},t:{js(citaat[k][j]['t'])}"
            + (f",y:{citaat[k][j]['y']}" if citaat[k][j]['y'] else '')
            + (',r:1' if citaat[k][j]['r'] else '') + '}'
            for j in sorted(citaat[k])) + '}'
        for k in sorted(citaat))
    bas_regels = ',\n'.join(f'  {js(u)}: {js(b)}' for u, b in sorted(uitgevers.items()))

    vervang = [
        ('RIJP_TABEL', rij_regels),
        ('CITAAT_BASIS', bas_regels),
        ('CITAAT', cit_regels),
        ('PROD_URL', ',\n'.join(
            f'  {k}: {{' + ', '.join(f'{j}:{js(u)}' for j, u in sorted(v.items(), key=lambda t: int(t[0]))) + '}'
            for k, v in sorted(prod.get('urls', {}).items()) if k in prod['per_streek'])),
        ('PRODUCENT', ',\n'.join(
            f'  {k}: {{' + ', '.join(f'{j}:{js(namen)}' for j, namen in sorted(v.items(), key=lambda t: int(t[0]))) + '}'
            for k, v in sorted(prod['per_streek'].items()))),
        ('ACHTERGROND', ',\n'.join(
            f'  {js(kw)}: {{s:{js(v["s"])},z:{js(v["z"])},t:{js(v["t"])},n:{v["n"]}}}'
            for kw, v in sorted(achter.items()))),
        ('PROD_JAAR', ',\n'.join(
            f'  {k}: {{' + ', '.join(f'{j}:{y}' for j, y in sorted(v.items(), key=lambda t: int(t[0]))) + '}'
            for k, v in sorted(prod.get('peiljaar', {}).items()))),
    ]
    for naam, regels in vervang:
        # de tabel staat er leeg als `const X = {};` of gevuld als een blok waarvan elke regel
        # met twee spaties begint. Geen greedy match over de rest van het bestand heen.
        patroon = re.compile(r'^const ' + naam + r' = \{\};$|^const ' + naam + r' = \{\n(?:  [^\n]*\n)*\};$', re.M)
        tekst, n = patroon.subn(lambda m: 'const ' + naam + ' = {\n' + regels + '\n};', tekst, count=1)
        if n != 1:
            sys.exit(f'kon de tabel {naam} niet vervangen ({n} treffers)')

    jaren = sum(len(v) for v in citaat.values())
    stil = sum(1 for k in citaat for j in citaat[k] if citaat[k][j]['u'] == 'Vinous')
    print(f'citaten: {jaren} over {len(citaat)} streken, van {len(uitgevers)} uitgevers')
    print(f'  waarvan alleen als vindplaats getoond (Vinous): {stil}')
    vermeld = sum(len(x) for v in prod['per_streek'].values() for x in v.values())
    print(f'producenten: {vermeld} vermeldingen over {len(prod["per_streek"])} streken en '
          f'{sum(len(v) for v in prod["per_streek"].values())} jaargangen')
    print(f'achtergrond: {len(achter)} plekken met een zin uit Wikipedia')
    print(f'rijpheid: {sum(len(v) for v in rijp.values())} jaren over {len(rijp)} streken')
    for k in sorted(rijp):
        print(f'  {k}: {len(rijp[k])} jaren, {rijpbron[k]}')
    if '--schrijf' not in sys.argv:
        print('\ndroogloop: niets geschreven. Voeg --schrijf toe om het door te voeren.')
        return
    BRON.write_text(tekst, encoding='utf-8')
    print('\ngeschreven. Draai nu ./build.sh en ./check.sh')


if __name__ == '__main__':
    main()
