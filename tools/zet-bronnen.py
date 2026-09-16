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
MAX_CITAAT = 115


def basis(url):
    m = re.match(r'(https?://[^/]+/)', url)
    return m.group(1) if m else ''


def kies_citaat(bevinding):
    """Eén vindplaats per streek-jaargang: laag A gaat voor, en daarbinnen het citaat dat nog een
    hele gedachte bevat maar kort genoeg is om onder een fles te passen."""
    kand = [b for b in bevinding['bronnen'] if b['uitgever'] not in GEWEIGERD]
    if not kand:
        return None
    laagA = [b for b in kand if b['laag'] == 'A'] or kand
    goed = [b for b in laagA if 30 <= len(b['citaat']) <= MAX_CITAAT]
    return (goed or sorted(laagA, key=lambda b: len(b['citaat'])))[0]


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
            'u': u, 'p': keus['url'][len(uitgevers[u]):], 't': keus['citaat']}

    rijp, rijpbron = {}, {}
    for pad in sorted((WORTEL / 'bronnen').glob('rijpheid-*.json')):
        naam = {'bbr': 'Berry Bros & Rudd', 'decanter': 'Decanter'}[pad.stem.split('-', 1)[1]]
        for streek, jaren in json.loads(pad.read_text(encoding='utf-8')).items():
            for jaar, stand in jaren.items():
                # Zijn twee bronnen het oneens over de rijpheid, dan wint de bron die de wijn nog
                # het meeste leven geeft. Dat is geen optimisme maar de risicokeuze van deze app:
                # te vroeg "over de piek" roepen laat iemand een goede fles weggooien, terwijl een
                # fles die volgens de app nog kan wachten bij de eerste slok gecontroleerd wordt.
                # Berry Bros noemt Bordeaux 1982 op zijn best, Decanter zegt "Drink soon"; de tabel
                # houdt dan de eerste aan.
                oud = rijp.setdefault(streek, {}).get(int(jaar))
                rijp[streek][int(jaar)] = int(stand) if oud is None else min(oud, int(stand))
            rijpbron[streek] = naam if streek not in rijpbron or rijpbron[streek] == naam \
                else rijpbron[streek] + ' en ' + naam
    prodpad = WORTEL / 'bronnen' / 'producenten.json'
    prod = json.loads(prodpad.read_text(encoding='utf-8')) if prodpad.exists() else {'per_streek': {}, 'urls': {}}
    return citaat, uitgevers, rijp, rijpbron, prod


def js(v):
    return json.dumps(v, ensure_ascii=False).replace('</', '<\\/')


def main():
    citaat, uitgevers, rijp, rijpbron, prod = bouw()
    tekst = BRON.read_text(encoding='utf-8')

    rij_regels = ',\n'.join(
        f"  {k}: '" + ' '.join(f'{j}:{rijp[k][j]}' for j in sorted(rijp[k])) + "'"
        for k in sorted(rijp))
    cit_regels = ',\n'.join(
        f"  {k}: {{" + ', '.join(
            f"{j}:{{u:{js(citaat[k][j]['u'])},p:{js(citaat[k][j]['p'])},t:{js(citaat[k][j]['t'])}}}"
            for j in sorted(citaat[k])) + '}'
        for k in sorted(citaat))
    bas_regels = ',\n'.join(f'  {js(u)}: {js(b)}' for u, b in sorted(uitgevers.items()))

    vervang = [
        ('RIJP_TABEL', rij_regels),
        ('RIJP_BRON', ',\n'.join(f'  {k}: {js(v)}' for k, v in sorted(rijpbron.items()))),
        ('CITAAT_BASIS', bas_regels),
        ('CITAAT', cit_regels),
        ('PROD_URL', ',\n'.join(f'  {k}: {js(v)}' for k, v in sorted(prod['urls'].items()) if k in prod['per_streek'])),
        ('PRODUCENT', ',\n'.join(
            f'  {k}: {{' + ', '.join(f'{j}:{js(namen)}' for j, namen in sorted(v.items(), key=lambda t: int(t[0]))) + '}'
            for k, v in sorted(prod['per_streek'].items()))),
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
