#!/usr/bin/env python3
"""Zet gecontroleerde jaargangniveaus in de tabel van cellarmentor.html.

Waarom dit bestaat: de tabel STREKEN is met de hand ingevoerd en daarna tegen bronnen
gelegd (zie JAARGANGEN.md). Het overtypen van zo'n uitkomst is precies het werk waar
fouten in sluipen, en een verkeerd niveau is in deze app een verkeerd drinkadvies. Dus
gaat het door dit script: het leest een bestand met per regel een streeksleutel en de
jaren, controleert de vorm, schrijft het in cellarmentor.html en drukt af wat er
veranderde. Zo staat elke wijziging in de uitvoer en is de ronde na te rekenen.

Invoerformaat, één streek per regel, jaren gescheiden door een spatie:
    champagne: 1990:5 1996:5+ 2002:5+ 2008:5+
Een plus achter het niveau betekent: dit jaar is tegen minstens twee onafhankelijke
gepubliceerde bronnen gelegd en staat met vindplaats in JAARGANGEN.md. Zonder plus is het een
eigen schatting die nog niet is nagetrokken. Het script rekent die twee apart af in zijn verslag,
want het verschil tussen gecontroleerd en geschat is het hele punt van deze ronde.
Regels die met # beginnen of leeg zijn, worden overgeslagen. Een streek die niet in de
invoer staat, blijft ongemoeid.

Gebruik:
    python3 tools/zet-jaargangen.py onderzoek.txt            (droogloop, schrijft niets)
    python3 tools/zet-jaargangen.py onderzoek.txt --schrijf
Daarna altijd ./build.sh en ./check.sh.
"""
import re
import sys
from pathlib import Path

BRON = Path(__file__).resolve().parent.parent / 'cellarmentor.html'


def lees_invoer(pad):
    uit = {}
    for n, regel in enumerate(Path(pad).read_text(encoding='utf-8').splitlines(), 1):
        regel = regel.strip()
        if not regel or regel.startswith('#'):
            continue
        if ':' not in regel:
            sys.exit(f'regel {n}: geen streeksleutel gevonden: {regel!r}')
        sleutel, rest = regel.split(':', 1)
        sleutel = sleutel.strip()
        paren = {}
        for stuk in rest.split():
            m = re.fullmatch(r'(\d{4}):([1-5])(\+?)', stuk)
            if not m:
                sys.exit(f'regel {n}: {stuk!r} is geen jaar:niveau met niveau 1 tot 5, eventueel met +')
            jaar = int(m.group(1))
            if not 1900 <= jaar <= 2100:
                sys.exit(f'regel {n}: jaar {jaar} ligt buiten 1900 tot 2100')
            if jaar in paren:
                sys.exit(f'regel {n}: jaar {jaar} staat er twee keer in')
            paren[jaar] = m.group(2) + m.group(3)
        if sleutel in uit:
            sys.exit(f'regel {n}: streek {sleutel!r} staat er twee keer in')
        uit[sleutel] = paren
    return uit


def huidige_tabel(tekst):
    blok = re.search(r'const STREKEN = \[([\s\S]*?)\n\];', tekst)
    if not blok:
        sys.exit('STREKEN-tabel niet gevonden in cellarmentor.html')
    tabel = {}
    for m in re.finditer(r"\{k:'([a-z_]+)',[\s\S]*?\n   j:'([^']*)'\}", blok.group(1)):
        jaren = {}
        for stuk in m.group(2).split():
            jaar, niveau = stuk.split(':')
            jaren[int(jaar)] = niveau
        tabel[m.group(1)] = jaren
    return tabel


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    schrijf = '--schrijf' in sys.argv[2:]
    nieuw = lees_invoer(sys.argv[1])
    tekst = BRON.read_text(encoding='utf-8')
    oud = huidige_tabel(tekst)

    onbekend = [k for k in nieuw if k not in oud]
    if onbekend:
        sys.exit('streeksleutels die niet in de app bestaan: ' + ', '.join(onbekend))

    veranderd = 0
    for sleutel, jaren in nieuw.items():
        was, wordt = oud[sleutel], jaren
        erbij = sorted(j for j in wordt if j not in was)
        eraf = sorted(j for j in was if j not in wordt)
        anders = sorted(j for j in wordt if j in was and was[j] != wordt[j])
        if not (erbij or eraf or anders):
            print(f'{sleutel}: ongewijzigd ({len(wordt)} jaren)')
            continue
        veranderd += 1
        print(f'{sleutel}: {len(was)} -> {len(wordt)} jaren')
        for j in anders:
            print(f'    {j}: {was[j]} -> {wordt[j]}')
        if erbij:
            print('    erbij: ' + ' '.join(f'{j}:{wordt[j]}' for j in erbij))
        if eraf:
            print('    eraf:  ' + ' '.join(f'{j}:{was[j]}' for j in eraf))
        regel = ' '.join(f'{j}:{wordt[j]}' for j in sorted(wordt))
        bron = sum(1 for v in wordt.values() if str(v).endswith('+'))
        print(f'    gecontroleerd tegen bronnen: {bron} van {len(wordt)}')
        patroon = re.compile(r"(\{k:'" + re.escape(sleutel) + r"',[\s\S]*?\n   j:')[^']*('\})")
        tekst, n = patroon.subn(lambda m: m.group(1) + regel + m.group(2), tekst, count=1)
        if n != 1:
            sys.exit(f'{sleutel}: kon de j-regel niet vervangen')

    streken_zonder = sorted(set(oud) - set(nieuw))
    if streken_zonder:
        print('\nniet in de invoer, dus ongemoeid: ' + ', '.join(streken_zonder))
    if not schrijf:
        print(f'\ndroogloop: {veranderd} streken zouden veranderen. Voeg --schrijf toe om het door te voeren.')
        return
    BRON.write_text(tekst, encoding='utf-8')
    print(f'\ngeschreven: {veranderd} streken bijgewerkt. Draai nu ./build.sh en ./check.sh')


if __name__ == '__main__':
    main()
