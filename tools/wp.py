# -*- coding: utf-8 -*-
"""Haalt achtergrond over een wijngaard, appellation of huis op bij Wikipedia.

Wikimedia vraagt om een user-agent met contactgegevens; zonder geeft de API 429 vanaf dit
netwerk. De tekst staat onder CC BY-SA, dus de app toont een korte zin met de naam van de bron en
een link naar het artikel, precies zoals bij de citaten van uitgevers. Elke zin wordt machinaal
teruggezocht in het artikel voordat hij wordt bewaard.
"""
import json, re, subprocess, time, urllib.parse

UA = 'CellarMentor-research/1.0 (https://github.com/mpoons/cellarmentor; max.ponsen@gmail.com)'
API = 'https://en.wikipedia.org/w/api.php'

def haal(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for poging in range(4):
        r = subprocess.run(['curl', '-sS', '-A', UA, '--max-time', '40', url],
                           capture_output=True, text=True, errors='replace')
        try:
            return json.loads(r.stdout)
        except Exception:
            time.sleep(2 ** poging)
    return {}

def zoek(naam, kies_titel=None):
    """Zoekt het artikel over dit gebied. Stopt zodra er een titel is die de naam bevat, want de
    kale naam vindt vaak het dorp en niet de wijn: "Pauillac" is een gemeente met een zeehaven.
    Drie vragen achter elkaar was verspilling; meestal is de eerste al raak."""
    uit = []
    for vraag in (f'{naam} wine appellation', f'{naam} AOC', naam):
        d = haal({'action': 'query', 'list': 'search', 'srsearch': vraag, 'srlimit': 6})
        for x in d.get('query', {}).get('search', []):
            if x['title'] not in uit: uit.append(x['title'])
        if kies_titel and kies_titel(naam, uit):
            break
        time.sleep(0.25)
    return uit


def intro(titel):
    d = haal({'action': 'query', 'prop': 'extracts', 'exintro': 1, 'explaintext': 1, 'titels': ''}
             | {'titles': titel})
    for p in d.get('query', {}).get('pages', {}).values():
        if 'extract' in p:
            return p['title'], p['extract']
    return None, None

# Wat een zin de moeite waard maakt: iets concreets over de grond, de helling, het klimaat, de
# omvang of de geschiedenis. "X is an appellation in France" zegt niets wat de app al niet weet.
INTERESSANT = re.compile(
    r'\b(soil|soils|limestone|clay|granite|schist|slate|gravel|sand|sandstone|marl|chalk|volcanic|'
    r'basalt|galestro|kimmeridgian|terroir|slope|slopes|hillside|hill|south-facing|east-facing|'
    r'west-facing|exposure|aspect|altitude|elevation|metres|meters|hectare|hectares|acres|'
    r'river|stream|sea|ocean|breeze|fog|mist|wind|mistral|tramontane|monopole|clos|walled|'
    r'monastery|monks|abbey|cistercian|founded|century|oldest|steep|terraces|terraced|amphitheatre)\b',
    re.I)

def zinnen(tekst):
    for z in re.split(r'(?<=[.!?])\s+', tekst.replace('\n', ' ')):
        z = z.strip()
        if 40 <= len(z) <= 230 and INTERESSANT.search(z):
            yield z

if __name__ == '__main__':
    import sys
    for naam in sys.argv[1:]:
        t = zoek(naam)
        if not t:
            print(f'{naam}: geen artikel'); continue
        titel, tekst = intro(t[0])
        if not tekst:
            print(f'{naam}: geen intro ({t[0]})'); continue
        z = list(zinnen(tekst))
        print(f'\n{naam}  ->  {titel}')
        for x in z[:2]: print('   ', x)
        if not z: print('    (niets concreets in de intro)')
        time.sleep(1)
