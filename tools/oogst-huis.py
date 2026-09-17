# -*- coding: utf-8 -*-
"""Haalt uit Decanters proefverslagen de zinnen die één huis bij naam noemen.

Waarom dit er is: een zin over de streek zegt iets over duizend wijnen, een zin over het domein
zegt iets over de fles in je hand. Decanter laat in zijn jaargangstukken de makers zelf aan het
woord - "Lorenzo Maganelli (Le Chiuse) points to the importance of soil management" - en dat is
publiek geserveerde lopende tekst, geen proefnotitie achter de betaalmuur en geen score.

De wijnkaarten van hetzelfde artikel zijn al geoogst (kaarten-alles.json); die leveren de streek en
de jaargang waar het stuk over gaat, zodat een zin bij de juiste streek-jaargang terechtkomt.
"""
import html, json, re, subprocess, sys, time
from pathlib import Path

SCR = Path(__file__).resolve().parent
UA = 'curl/8.0'

def haal(url):
    r = subprocess.run(['curl', '-sS', '-A', UA, '--max-time', '45', url],
                       capture_output=True, text=True, errors='replace')
    return r.stdout if r.returncode == 0 else ''

def lopende_tekst(raw):
    """Het artikel zonder de wijnkaarten, de menu's en de scripts."""
    b = re.sub(r'<div class="wine wine[^"]*".*?(?=<footer|</article|$)', ' ', raw, flags=re.S)
    b = re.sub(r'<(script|style|nav|header|footer|aside)[^>]*>.*?</\1>', ' ', b, flags=re.S | re.I)
    b = re.sub(r'<[^>]+>', ' ', b)
    return html.unescape(re.sub(r'\s+', ' ', b))

def main():
    kaarten = json.loads((SCR/'kaarten-alles.json').read_text(encoding='utf-8'))
    uitpad = SCR/'huis-ruw.json'
    uit = json.loads(uitpad.read_text(encoding='utf-8')) if uitpad.exists() else {}
    urls = [u for u, v in kaarten.items() if v['kaarten']]
    print(f'{len(urls)} artikelen met kaarten, {len(uit)} al gedaan', flush=True)
    for n, u in enumerate(urls, 1):
        if u in uit:
            continue
        raw = haal(u)
        if not raw:
            uit[u] = []
        else:
            t = lopende_tekst(raw)
            # Alleen de huizen waarvan dit artikel zelf een wijn toont. Dat is strenger dan alle
            # namen van de streek en het sluit toevallige treffers uit: "San Polo" is in Montalcino
            # ook een gehucht, en zonder deze eis belandde een zin over dat gehucht bij het domein.
            kaart = {k['producent']: k for k in kaarten[u]['kaarten'] if len(k['producent']) > 5}
            vondst = []
            for z in re.split(r'(?<=[.!?])\s+', t):
                z = z.strip()
                if not (60 <= len(z) <= 280):
                    continue
                for nm in sorted(kaart, key=len, reverse=True):
                    if re.search(r'(?<![A-Za-z])' + re.escape(nm) + r'(?![A-Za-z])', z):
                        k = kaart[nm]
                        vondst.append({'naam': nm, 'zin': z, 'jaar': k['jaar'],
                                       'streek': k.get('streek'), 'appellatie': k.get('appellatie'),
                                       'land': k.get('land')})
                        break
            uit[u] = vondst
        if n % 10 == 0:
            uitpad.write_text(json.dumps(uit, ensure_ascii=False))
            print(f'{n}/{len(urls)}  zinnen: {sum(len(v) for v in uit.values())}', flush=True)
        time.sleep(0.15)
    uitpad.write_text(json.dumps(uit, ensure_ascii=False))
    print(f'klaar: {sum(len(v) for v in uit.values())} zinnen uit {len(uit)} artikelen')


main()
