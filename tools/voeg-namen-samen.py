#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Voegt dezelfde producent onder twee schrijfwijzen samen in bronnen/producenten.json.

Waarom dit nodig is. De namen komen uit twee soorten stukken van dezelfde uitgever. De oude
jaargangsgidsen schrijven het huis kaal ("La Conseillante", "Ausone", "Coutet"), de recente
proefverslagen voluit ("Château La Conseillante", "Château Ausone", "Château Coutet"). Bij het
samenvoegen bleven dat twee regels, met twee keer een halve staat van dienst: La Conseillante had
elf jaargangen onder de ene naam en zes onder de andere. Erger nog, de app kon zichzelf
tegenspreken - "Decanter raadt La Conseillante aan bij 2006" én "Decanter raadt Château La
Conseillante aan bij zes ándere jaargangen", over hetzelfde huis.

Wat er wordt samengevoegd en wat niet. Alleen het weglaten van een *titelwoord* vooraan telt:
château, domaine, quinta, tenuta, weingut en zo verder. Een voornaam telt niet mee, want dat
onderscheidt juist verschillende huizen: Olivier Leflaive blijft los van Leflaive. De volledige
schrijfwijze wint als weergave, want die is duidelijker onder een fles.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

WORTEL = Path(__file__).resolve().parent.parent
PAD = WORTEL / 'bronnen' / 'producenten.json'

TITEL = ['chateau', 'ch', 'domaine', 'dom', 'maison', 'tenuta', 'castello', 'quinta', 'bodega',
         'bodegas', 'weingut', 'cantina', 'azienda agricola', 'azienda', 'podere', 'fattoria',
         'vina', 'vinedos', 'casa', 'herdade', 'clos', 'le domaine', 'la maison', 'the']


def plat(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9]+', ' ', s)).strip()


def kern(naam):
    """De naam zonder titelwoord vooraan, als sleutel om op samen te voegen."""
    n = plat(naam)
    veranderd = True
    while veranderd:
        veranderd = False
        for t in sorted(TITEL, key=len, reverse=True):
            if n.startswith(t + ' ') and len(n) > len(t) + 3:
                n = n[len(t) + 1:]
                veranderd = True
                break
    return n


def main():
    d = json.loads(PAD.read_text(encoding='utf-8'))
    per = d['per_streek']
    samen = 0
    verslag = []
    for streek, jaren in per.items():
        # welke schrijfwijzen horen bij dezelfde kern, en welke is de volledigste
        namen = {n for lijst in jaren.values() for n in lijst}
        groepen = {}
        for n in namen:
            groepen.setdefault(kern(n), []).append(n)
        keuze = {}
        for k, lijst in groepen.items():
            if len(lijst) > 1:
                samen += len(lijst) - 1
                verslag.append((streek, k, sorted(lijst)))
            beste = sorted(lijst, key=lambda x: (-len(x), x))[0]
            for n in lijst:
                keuze[n] = beste
        for jaar, lijst in jaren.items():
            uit, gezien = [], set()
            for n in lijst:
                b = keuze.get(n, n)
                if b in gezien:
                    continue
                gezien.add(b)
                uit.append(b)
            jaren[jaar] = uit
    # de staat van dienst opnieuw afleiden uit de samengevoegde lijsten
    vaak = {}
    for streek, jaren in per.items():
        namen = {}
        for jaar, lijst in jaren.items():
            for n in set(lijst):
                namen.setdefault(n, set()).add(int(jaar))
        m = {n: sorted(js) for n, js in namen.items() if len(js) >= 2}
        if m:
            vaak[streek] = m
    d['vaak'] = vaak
    if '--schrijf' in sys.argv:
        PAD.write_text(json.dumps(d, ensure_ascii=False, indent=1, sort_keys=True), encoding='utf-8')
    print(f'{samen} schrijfwijzen samengevoegd')
    print(f'staat van dienst: {sum(len(v) for v in vaak.values())} makers in twee of meer jaargangen')
    for streek, k, lijst in verslag[:15]:
        print(f'  {streek:12} {k:28} <- {lijst}')
    if '--schrijf' not in sys.argv:
        print('\ndroogloop: niets geschreven. Voeg --schrijf toe.')


main()
