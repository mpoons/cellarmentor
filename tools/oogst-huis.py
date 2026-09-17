# -*- coding: utf-8 -*-
"""Haalt uit Decanters proefverslagen de zinnen die één huis bij naam noemen.

Waarom dit er is: een zin over de streek zegt iets over duizend wijnen, een zin over het domein
zegt iets over de fles in je hand. Decanter laat in zijn jaargangstukken de makers zelf aan het
woord - "Lorenzo Maganelli (Le Chiuse) points to the importance of soil management" - en dat is
publiek geserveerde lopende tekst, geen proefnotitie achter de betaalmuur en geen score.

De wijnkaarten van hetzelfde artikel zijn al geoogst (kaarten-alles.json); die leveren de streek en
de jaargang waar het stuk over gaat, zodat een zin bij de juiste streek-jaargang terechtkomt.

Twee dingen zijn hier hard geleerd:

  Een kop is geen zin. De eerste versie verving elke tag door een spatie, waardoor een kop aan de
  eerste zin van de volgende alinea vastplakte: "Fita Preta Co-founded in 2004 by winemaker..." en
  "Sarah Ahmed reports How thrilling to see...". Dat leest onder een fles als kapot Nederlands
  Engels. Nu wordt elke bloktag een alineagrens, en een stuk tekst zonder eindleesteken is een kop.

  Een kop met een huisnaam erin is wél iets waard. Decanters portretten zetten de naam boven de
  alinea en herhalen hem er niet in. Die alinea's waren daardoor onbereikbaar. Een kop die een van
  de huizen van dit artikel noemt geldt daarom als onderwerp voor de zinnen die erop volgen, tot de
  volgende kop.
"""
import html, json, re, subprocess, sys, time
from pathlib import Path

SCR = Path(__file__).resolve().parent
UA = 'curl/8.0'
# Alles wat op het scherm een nieuwe regel of alinea begint. Zonder deze grens plakt een kop aan
# de zin erna vast, en dat is precies de fout die dit bestand moest oplossen.
BLOK = re.compile(r'</?(?:p|div|h[1-6]|li|ul|ol|td|th|tr|table|br|section|article|blockquote'
                  r'|figcaption|figure|dt|dd|dl|hr|main|form|label|button)\b[^>]*>', re.I)
EIND = re.compile(r'[.!?][’”"\')\]]?$')


def haal(url):
    r = subprocess.run(['curl', '-sS', '-A', UA, '--max-time', '45', url],
                       capture_output=True, text=True, errors='replace')
    return r.stdout if r.returncode == 0 else ''


def segmenten(raw):
    """Het artikel als losse alinea-stukken: de wijnkaarten, menu's en scripts eruit, elke bloktag
    een grens, en binnen een alinea nog op zinseinde gesplitst. Geeft (alineanummer, zin) terug,
    want een kop geldt alleen voor de alinea die er direct op volgt."""
    b = re.sub(r'<div class="wine wine[^"]*".*?(?=<footer|</article|$)', ' ', raw, flags=re.S)
    b = re.sub(r'<(script|style|nav|header|footer|aside|figcaption)[^>]*>.*?</\1>', ' ',
               b, flags=re.S | re.I)
    b = BLOK.sub(' ¶ ', b)
    b = re.sub(r'<[^>]+>', ' ', b)
    # Eerst de entiteiten, dan pas de spaties: &nbsp; wordt een harde spatie die [ \t\r\n] niet
    # vangt, en dan houd je "as cool as  Bordeaux ," over waar een link stond.
    t = re.sub(r'\s+', ' ', html.unescape(b))
    t = re.sub(r'\s+([,.;:!?])', r'\1', t)
    # Splitsen op een aanhalingsteken alleen als er een punt voor staat: ‘glou-glou’
    # style is geen zinseinde, en dat leverde 35 halve zinnen op.
    uit, nr = [], 0
    for alinea in t.split('¶'):
        zinnen = [s.strip() for s in re.split(r'(?<=[.!?])\s+|(?<=[.!?][’”"])\s+', alinea)
                  if s.strip()]
        # lege blokken niet meetellen: een kop staat tussen twee tags en zou anders twee of drie
        # nummers verder liggen dan de alinea eronder
        if not zinnen:
            continue
        nr += 1
        uit.extend((nr, s) for s in zinnen)
    return uit


def is_kop(s):
    return len(s) <= 90 and not EIND.search(s)


def kop_van(kop, naam):
    """Is deze kop een portretkop van dit huis?

    Hij moet met de naam beginnen en er mag hooguit een korte staart achter staan: "Susana Balbo
    Wines", "Ch\u00e2teau Maris, Minervois". Een jaartal in de staart maakt er een wijnnaam van
    ("Niepoort Redoma Ros\u00e9 2023"), en een naam die pas achteraan staat maakt er een redactiekop van
    ("Standout Brunello 2018 Canalicchio di Sopra"). Allebei zeggen niet dat de alinea eronder over
    het huis gaat, en allebei stonden er."""
    if not kop.startswith(naam):
        return False
    staart = kop[len(naam):].strip(' \u2013\u2014-:.,&')
    return len(staart) <= 14 and not re.search(r'\b(?:19|20)\d\d\b', staart)


def noemt(zin, naam):
    return re.search(r'(?<![A-Za-z])' + re.escape(naam) + r'(?![A-Za-z])', zin) is not None


def main():
    kaarten = json.loads((SCR / 'kaarten-alles.json').read_text(encoding='utf-8'))
    uitpad = SCR / 'huis-ruw.json'
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
            # Alleen de huizen waarvan dit artikel zelf een wijn toont. Dat is strenger dan alle
            # namen van de streek en het sluit toevallige treffers uit: "San Polo" is in Montalcino
            # ook een gehucht, en zonder deze eis belandde een zin over dat gehucht bij het domein.
            kaart = {k['producent']: k for k in kaarten[u]['kaarten'] if len(k['producent']) > 5}
            namen = sorted(kaart, key=len, reverse=True)
            vondst, onder, kopnr = [], None, -9
            for nr, s in segmenten(raw):
                if is_kop(s):
                    # Een kop die niets ánders is dan de naam van een huis uit dit artikel is een
                    # portretkop, en die geldt als onderwerp. "Niepoort Redoma Rosé 2023" is een
                    # wijnnaam en "Standout Brunello 2018 Canalicchio di Sopra" een redactiekop;
                    # die zeggen niet dat de alinea eronder over het huis gaat.
                    kaal = s.strip(' –—-:.,’”‘“"')
                    onder = next((nm for nm in namen if kop_van(kaal, nm)), None)
                    kopnr = nr
                    continue
                if not (60 <= len(s) <= 280):
                    continue
                nm = next((nm for nm in namen if noemt(s, nm)), None)
                via = 'zin'
                # Alleen de alinea die direct op de kop volgt. Zonder die grens liep de kop door
                # tot de volgende kop en belandde "Then again, Montsant is much more varied in its
                # soils" onder Terroir Sense Fronteres.
                if not nm and onder and nr == kopnr + 1:
                    nm, via = onder, 'kop'
                if not nm:
                    continue
                k = kaart[nm]
                vondst.append({'naam': nm, 'zin': s, 'jaar': k['jaar'], 'via': via,
                               'streek': k.get('streek'), 'appellatie': k.get('appellatie'),
                               'land': k.get('land')})
            uit[u] = vondst
        if n % 10 == 0:
            uitpad.write_text(json.dumps(uit, ensure_ascii=False))
            print(f'{n}/{len(urls)}  zinnen: {sum(len(v) for v in uit.values())}', flush=True)
        time.sleep(0.15)
    uitpad.write_text(json.dumps(uit, ensure_ascii=False))
    print(f'klaar: {sum(len(v) for v in uit.values())} zinnen uit {len(uit)} artikelen')


main()
