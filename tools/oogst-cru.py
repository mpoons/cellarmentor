# -*- coding: utf-8 -*-
"""Zelfde oogst als voor de appellations, maar voor beroemde wijngaarden die geen trefwoord van de
app zijn. Clos de Vougeot bepaalt geen streek - dat doet 'vougeot' niet eens - maar staat wel op
het etiket, en is precies het soort plek waar iemand iets over wil lezen."""
import importlib.util, json, time
from pathlib import Path
SCR = Path(__file__).resolve().parent
wp = importlib.util.module_from_spec(importlib.util.spec_from_file_location('wp', SCR/'wp.py'))
importlib.util.spec_from_file_location('wp', SCR/'wp.py').loader.exec_module(wp)
wp2 = importlib.util.module_from_spec(importlib.util.spec_from_file_location('wp2', SCR/'wp2.py'))
importlib.util.spec_from_file_location('wp2', SCR/'wp2.py').loader.exec_module(wp2)

def volledig(titel):
    d = wp.haal({'action':'query','prop':'extracts','explaintext':1,'titles':titel})
    for p in d.get('query',{}).get('pages',{}).values():
        if 'extract' in p: return p['title'], p['extract']
    return None, None

taken = [tuple(x) for x in json.loads((SCR/'cru-volgorde.json').read_text(encoding='utf-8'))]
uitpad = SCR/'cru-ruw.json'
uit = json.loads(uitpad.read_text(encoding='utf-8')) if uitpad.exists() else {}
for n, (streek, naam) in enumerate(taken, 1):
    if naam in uit: continue
    t = wp2.kies_titel(naam, wp.zoek(naam, wp2.kies_titel))
    if not t:
        uit[naam] = None
    else:
        titel, tekst = volledig(t)
        if not tekst or len(wp2.WIJN.findall(tekst)) < 6:
            uit[naam] = None
        else:
            z = wp2.kies(tekst, naam)
            uit[naam] = {'streek': streek, 'zin': z, 'titel': titel} if z else None
    if n % 10 == 0:
        uitpad.write_text(json.dumps(uit, ensure_ascii=False))
        print(f'{n}/{len(taken)}  met een zin: {sum(1 for v in uit.values() if v)}', flush=True)
    time.sleep(0.2)
uitpad.write_text(json.dumps(uit, ensure_ascii=False))
print(f'klaar: {sum(1 for v in uit.values() if v)} van de {len(uit)}')
