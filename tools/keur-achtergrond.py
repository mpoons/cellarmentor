# -*- coding: utf-8 -*-
"""Keurt de geoogste zinnen en schrijft bronnen/achtergrond-wikipedia.json.

Eén regel die tijdens het oogsten niet te maken was. Noemt een zin de plek zelf niet, dan mag hij
ook geen ánder eigennaam noemen: bij 'graves' koos de kiezer "The soil of Pessac-Léognan is
composed of gravel terraces", en Pessac-Léognan is het noordelijke deel van Graves maar niet
hetzelfde. Zulke zinnen gaan eruit, tenzij de eigennaam ook in de titel van het artikel staat.
"""
import json, re, sys, unicodedata
from pathlib import Path

SCR = Path(__file__).resolve().parent
UIT = SCR.parent / 'bronnen' / 'achtergrond-wikipedia.json'

def plat(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if not unicodedata.combining(c))).strip()

# woorden die met een hoofdletter beginnen maar geen plaatsnaam zijn
GEEN_PLAATS = {'the','a','an','in','of','and','or','but','it','its','this','that','these','those',
  'january','february','march','april','may','june','july','august','september','october','november',
  'december','world','war','i','ii','aoc','aop','doc','docg','do','doq','ava','igt','igp','vdp',
  'chardonnay','merlot','cabernet','sauvignon','syrah','shiraz','grenache','pinot','noir','blanc',
  'riesling','sangiovese','nebbiolo','tempranillo','semillon','muscadelle','malbec','verdot','franc',
  'botrytis','cinerea','appellation','controlee','origine','protegee','french','italian','spanish',
  'german','portuguese','roman','romans','cistercian','benedictine','celsius','fahrenheit'}

def zelfde_plek(zin, kw, titel):
    p = plat(zin)
    if plat(kw).split()[0] in p:
        return True
    tp = plat(titel)
    for w in re.findall(r'\b[A-Z][a-zA-ZÀ-ɏ\'\-]{2,}', zin[1:]):   # niet de eerste letter
        lw = plat(w)
        if lw in GEEN_PLAATS or not lw: continue
        if lw in tp: continue
        return False
    return True

def breedte(kw, namen):
    """Hoeveel wijnnamen dit trefwoord raakt. Dat is de maat voor hoe algemeen het is: 'bordeaux'
    raakt duizenden flessen, 'margaux' honderden. Zonder die maat won bij het tonen het lángste
    trefwoord, en dat is toevallig 'bordeaux' - waardoor een Pauillac de algemene zin over de grond
    van Bordeaux kreeg in plaats van de zijne."""
    k = ' ' + plat(kw) + ' '
    return sum(1 for n in namen if k in n)


def main():
    ruw = json.loads((SCR/'achtergrond-ruw.json').read_text(encoding='utf-8'))
    # De beroemde wijngaarden komen uit een eigen oogst. Hun sleutel moet genormaliseerd zijn, want
    # de app zoekt ze in de genormaliseerde tekst van de fles: "Clos de Vougeot" wordt
    # "clos de vougeot" en "Échézeaux" wordt "echezeaux".
    crupad = SCR/'cru-ruw.json'
    if crupad.exists():
        for naam, e in json.loads(crupad.read_text(encoding='utf-8')).items():
            if e and e.get('zin'):
                ruw.setdefault(plat(naam), e)
    namen = []
    idx = SCR/'bbr-index.json'   # optioneel: de catalogus waartegen de specificiteit wordt gemeten
    if idx.exists():
        namen = [' ' + plat(w['naam']) + ' ' for w in json.loads(idx.read_text(encoding='utf-8'))]
    per, weg = {}, 0
    for kw, e in sorted(ruw.items()):
        if not e or not e.get('zin'): continue
        if not zelfde_plek(e['zin'], kw, e['titel']):
            weg += 1; continue
        per[kw] = {'streek': e['streek'], 'zin': e['zin'], 'titel': e['titel'],
                    'breedte': breedte(kw, namen) if namen else 0}
    UIT.write_text(json.dumps({
        'bron': 'Wikipedia (Engelstalig)',
        'licentie': 'CC BY-SA 4.0',
        'toelichting': ('Eén zin per plek over de grond, de helling, het klimaat of de geschiedenis. '
          'Geen oordeel en geen jaargang: dit verandert niet per oogst. De zin is machinaal gekozen uit '
          'het artikel en machinaal teruggezocht. De app toont hem als citaat met de bron en een link, '
          'zoals de licentie vraagt. Zinnen die de plek niet noemen én een andere eigennaam bevatten '
          'zijn verwijderd, want die gaan over de buren.'),
        'per_trefwoord': per}, ensure_ascii=False, indent=1, sort_keys=True), encoding='utf-8')
    print(f'{len(per)} plekken bewaard, {weg} afgekeurd omdat de zin over een andere plek ging')

main()
