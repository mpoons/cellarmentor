# -*- coding: utf-8 -*-
"""Haalt per appellation één zin achtergrond op bij Wikipedia.

Waarom dit er is: de app wist tot nu toe wát een jaargang in een streek deed, en niets over de
plek zelf. Een zin als "The characteristic terroir of Châteauneuf-du-Pape comes from a layer of
stones called Galets roulés" is precies wat een sommelier erbij zou zeggen, en hij veroudert niet.

Wat er wordt bewaard: de zin, de titel van het artikel en de streeksleutel. De tekst van Wikipedia
staat onder CC BY-SA; de app toont daarom een korte zin met de bron erbij en een link naar het
artikel, net als bij de citaten van uitgevers. Elke zin wordt machinaal teruggezocht in het
artikel voordat hij wordt bewaard.

Wikimedia vraagt om een user-agent met contactgegevens. Zonder die geeft de API vanaf dit netwerk
meteen 429.
"""
import importlib.util, json, re, sys, time
from pathlib import Path

SCR = Path(__file__).resolve().parent
wp = importlib.util.module_from_spec(importlib.util.spec_from_file_location('wp', SCR/'wp.py'))
importlib.util.spec_from_file_location('wp', SCR/'wp.py').loader.exec_module(wp)
wp2 = importlib.util.module_from_spec(importlib.util.spec_from_file_location('wp2', SCR/'wp2.py'))
importlib.util.spec_from_file_location('wp2', SCR/'wp2.py').loader.exec_module(wp2)

def volledig(titel):
    d = wp.haal({'action': 'query', 'prop': 'extracts', 'explaintext': 1, 'titles': titel})
    for p in d.get('query', {}).get('pages', {}).values():
        if 'extract' in p:
            return p['title'], p['extract']
    return None, None

def streken_uit_app():
    """De streken en hun trefwoorden uit cellarmentor.html, zodat dit script niets van buiten nodig
    heeft. De tussenbestanden komen naast het script te staan."""
    pad = SCR.parent / 'cellarmentor.html'
    tekst = pad.read_text(encoding='utf-8')
    a = tekst.index('const STREKEN = ['); b = tekst.index('\n];', a)
    uit = {}
    for m in re.finditer(r"k:'([a-z_0-9]+)', l:'([^']*)'(.*?)kw:\[([^\]]*)\]", tekst[a:b], re.S):
        k, l, _, kw = m.groups()
        uit[k] = {'label': l, 'kw': [x.strip().strip("'") for x in kw.split(',') if x.strip()]}
    return uit


def main():
    spad = SCR/'streken.json'
    if spad.exists():
        streken = json.loads(spad.read_text(encoding='utf-8'))
    else:
        streken = streken_uit_app()
        spad.write_text(json.dumps(streken, ensure_ascii=False), encoding='utf-8')
    uitpad = SCR/'achtergrond-ruw.json'
    uit = json.loads(uitpad.read_text(encoding='utf-8')) if uitpad.exists() else {}
    # Volgorde naar hoeveel flessen een trefwoord in de catalogus raakt: 251 van de trefwoorden
    # raken er geen enkele, en die kunnen wachten.
    vol = SCR/'achtergrond-volgorde.json'
    if vol.exists():
        taken = [tuple(x) for x in json.loads(vol.read_text(encoding='utf-8'))]
    else:
        taken = [(s, kw) for s, v in streken.items() for kw in v['kw'] if len(kw) >= 5]
    print(f'{len(taken)} trefwoorden, {len(uit)} al gedaan', flush=True)
    for n, (sleutel, kw) in enumerate(taken, 1):
        if kw in uit: continue
        titels = wp.zoek(kw, wp2.kies_titel)
        t = wp2.kies_titel(kw, titels)
        if not t:
            uit[kw] = None
        else:
            titel, tekst = volledig(t)
            if not tekst or len(wp2.WIJN.findall(tekst)) < 8:
                uit[kw] = None
            else:
                z = wp2.kies(tekst, kw)
                uit[kw] = {'streek': sleutel, 'zin': z, 'titel': titel} if z else None
        if n % 10 == 0:
            uitpad.write_text(json.dumps(uit, ensure_ascii=False))
            raak = sum(1 for v in uit.values() if v)
            print(f'{n}/{len(taken)}  met een zin: {raak}', flush=True)
        time.sleep(0.2)
    uitpad.write_text(json.dumps(uit, ensure_ascii=False))
    print(f'klaar: {sum(1 for v in uit.values() if v)} van de {len(uit)} trefwoorden met een zin')

main()
