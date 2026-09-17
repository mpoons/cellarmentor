# -*- coding: utf-8 -*-
"""Kiest uit een Wikipedia-artikel één zin die iets concreets over de plek zegt.

Waarom een keuze en niet de eerste zin die past: de eerste treffer is vaak een vervolgzin die
zonder zijn voorganger nergens op slaat ("Within the Barolo zone there are two major soil types
separated by the Alba-Barolo road"). Een zin telt pas mee als hij op zichzelf te lezen is - hij
begint niet met een verwijswoord, noemt de plek of een concreet kenmerk, en hoeft geen context.
"""
import re

VERWIJS = re.compile(r'^(however|within|since|it |its |this |that |these |those |they |their |he |she |'
                     r'there |such |additionally|moreover|furthermore|in addition|also|but |and |'
                     r'while |although|though|by contrast|on the other hand|as a result|'
                     r'consequently|nevertheless|nonetheless|thus |hence |the latter|the former)', re.I)
# Sterke termen: iets wat deze plek tot deze plek maakt - de grond, de helling, het klimaat, de
# omvang. Zwakke termen kleuren een zin maar dragen hem niet. Zonder die splitsing koos de kiezer
# bij Pauillac een zin over cruiseschepen, alleen omdat er "mid-20th century" in stond: dat artikel
# gaat over de gemeente en haar haven, niet over de wijn.
STERK = re.compile(
    r'\b(soil|soils|limestone|clay|granite|schist|slate|gravel|sand|sandstone|marl|chalk|volcanic|'
    r'basalt|galestro|kimmeridgian|terroir|slope|slopes|hillside|south-facing|east-facing|'
    r'west-facing|exposure|altitude|elevation|hectares|acres|monopole|clos|walled|steep|terraces|'
    r'terraced|amphitheatre|amphitheater|microclimate|alluvial|quartz|llicorella|drainage|'
    r'noble rot|botrytis|mistral|tramontane)\b', re.I)
ZWAK = re.compile(
    r'\b(river|stream|sea|breeze|fog|mist|monastery|monks|abbey|cistercian|century|oldest|'
    r'maritime|continental|iron|sunlight|ripening|frost|cellar|caves|vines|vineyard|vineyards)\b', re.I)
WIJN = re.compile(r'\b(wine|wines|vineyard|vineyards|grape|grapes|appellation|vigneron|winemak|viticult)\b', re.I)
ONDERWERP = re.compile(
    r'^(the\s+)?(soils?|vineyards?|area|region|appellation|zone|terroir|climate|slopes?|hillsides?|'
    r'vines|grapes?|plantings?|village|commune|estate|clos|cru)\b', re.I)
# Tabelbijschriften lezen als een zin en zijn er geen. Bij Rioja koos de kiezer "The area
# cultivated in 2018, in hectares, according to the grape varieties ... is as follows: As can be
# seen, red grapes represent 90.85%". Waar, en onleesbaar onder een fles.
ROMMEL = re.compile(r'\b(citation needed|as of \d{4}|see also|external links|references|'
                    r'as follows|as can be seen|the following table|the table below|listed below)\b', re.I)

def kies(tekst, naam=None):
    """Geeft de beste zin uit dit artikel, of None."""
    beste = None
    # kopjes eruit: in een platte-tekst-extract staan ze als "== Wine regions ==" midden in de
    # tekst, en dan begint de eerste zin van een sectie met zijn eigen kopje
    tekst = re.sub(r'^==+[^=]*==+\s*$', ' ', tekst, flags=re.M)
    for z in re.split(r'(?<=[.!?])\s+', tekst.replace('\n', ' ')):
        z = ' '.join(re.sub(r'==+[^=]*==+', ' ', z).split())
        if not (55 <= len(z) <= 220): continue
        if VERWIJS.match(z) or ROMMEL.search(z): continue
        if z.count('(') != z.count(')') or z.endswith(('e.g.', 'i.e.', 'etc.')): continue
        # Een rij cijfers is een tabel, maar een goede zin mag getallen bevatten: "With 345 acres
        # (140 ha) of vines, in soil composed greatly of granite and gravels, Hermitage produces
        # 730,000 bottles" viel op 10% cijfers af en dat is precies zo'n zin die je wilt tonen.
        kaal = re.sub(r'\([^)]*\)', '', z)
        if sum(c.isdigit() for c in kaal) / max(1, len(kaal)) > 0.16: continue
        if z.count('%') > 1: continue
        if ':' in z[:-1] and sum(c.isdigit() for c in z) > 8: continue
        sterk = {m.group(0).lower() for m in STERK.finditer(z)}
        if not sterk: continue
        zwak = {m.group(0).lower() for m in ZWAK.finditer(z)}
        score = len(sterk) * 10 + len(zwak) * 2
        # De zin moet over dit gebied gaan en niet over wijn in het algemeen. Dat is het geval als
        # hij de naam noemt, of als hij begint met het onderwerp van het artikel zelf ("The soils
        # of ...", "The vineyards ..."). Zonder die eis koos hij bij Rioja een zin over hoogte die
        # net zo goed over Mendoza had kunnen gaan; mét alleen de naam-eis verloor hij "The soils
        # of the Barbaresco zone are composed primarily of calcareous marl".
        heeftNaam = bool(naam) and _plat(naam).split()[0] in _plat(z)
        overOnderwerp = bool(ONDERWERP.match(z))
        if not (heeftNaam or overOnderwerp): continue
        if heeftNaam: score += 12
        if re.match(r'^[A-Z]', z): score += 3
        score -= abs(len(z) - 150) / 40
        if not beste or score > beste[0]: beste = (score, z)
    return beste[1] if beste else None


def _plat(s):
    import unicodedata
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if not unicodedata.combining(c))).strip()


def kies_titel(naam, titels):
    """Welk artikel gaat over dit gebied, en niet over het dorp of over de buren.

    Twee eisen, allebei uit een misser geleerd. De titel moet de naam zelf bevatten: zonder die eis
    kreeg "Barolo" het artikel over het huis Gaja en "Chablis" het algemene artikel Burgundy wine,
    allebei omdat er "wine" in de titel staat. En een titel met AOC, DOCG of (wine) wint van de kale
    plaatsnaam: "Pauillac" is een gemeente met een zeehaven, "Pauillac AOC" is de appellation."""
    n = _plat(naam)
    kand = [t for t in titels if n in _plat(t)]
    if not kand:
        return None

    def rang(t):
        laag = _plat(t)
        wijnwoord = any(w in laag for w in ('aoc', 'doc', 'docg', 'doq', 'ava', 'wine',
                                            'vineyard', 'appellation', 'wine region'))
        return (0 if wijnwoord else 1, len(t))
    return sorted(kand, key=rang)[0]
