// Tests voor de pure regels van CellarMentor, zonder browser en zonder framework: node --test tests/*.test.js
// (aangeroepen door check.sh). Laadt scriptblok 1, 2, 3 en 5 uit cellarmentor.html in een minimale
// browserstub, zodat de functies zelf onder test staan en niet een kopie ervan.
//
// De stub is de zwakke plek: voegt een blok op topniveau iets toe dat de DOM aanraakt, dan
// moet de stub mee. De fout die je dan ziet is "x is not a function" bij het laden hieronder.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const bron = fs.readFileSync(path.join(__dirname, '..', 'cellarmentor.html'), 'utf8');
const blokken = [...bron.matchAll(/^<script>$([\s\S]*?)^<\/script>$/gm)].map(m => m[1]);
assert.equal(blokken.length, 6, 'cellarmentor.html hoort zes scriptblokken te hebben');

/* ---- browserstub ---- */
const opslag = new Map();
const localStorage = {
  getItem: k => (opslag.has(k) ? opslag.get(k) : null),
  setItem: (k, v) => { if (localStorage.weiger && localStorage.weiger(k)) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; } opslag.set(k, String(v)); },
  removeItem: k => { opslag.delete(k); },
  weiger: null,
};
const leegEl = () => ({ dataset: {}, style: {}, classList: { add() {}, remove() {}, toggle() {} }, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, setAttribute() {}, getAttribute: () => null, hasAttribute: () => false, appendChild() {}, remove() {}, innerHTML: '', textContent: '', value: '' });
const document = {
  documentElement: { dataset: {}, lang: '' }, body: leegEl(), title: '',
  querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
  addEventListener() {}, createElement: leegEl,
};
const ctx = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, Date, Math, JSON, Number, String, Array, Object, Boolean, RegExp, Map, Set, Promise, Error, TypeError, RangeError,
  parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent, atob, btoa, URL, URLSearchParams, TextDecoder, TextEncoder, AbortSignal, crypto, Uint8Array, Uint32Array, Float32Array,
  localStorage, document, addEventListener() {}, removeEventListener() {},
  location: { hostname: 'localhost', hash: '', search: '', origin: 'http://localhost', pathname: '/', host: 'localhost' },
  history: { pushState() {}, replaceState() {}, go() {}, state: null },
  navigator: { userAgent: 'node', maxTouchPoints: 0, platform: 'node' },
  matchMedia: () => ({ matches: false }), requestAnimationFrame: f => f(),
  fetch: () => Promise.reject(new Error('geen netwerk in de tests')),
};
ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
for (const i of [0, 1, 2, 4]) vm.runInContext(blokken[i], ctx, { filename: `cellarmentor.html blok ${i + 1}` });
// const/let op topniveau zijn geen eigenschappen van de context; zo halen we ze op
const C = vm.runInContext('({ S, schoonWijn, schoonHist, schoonLoc, schoonDoc, eigenSleutel, matchWine, foodCats, windowStatus, estimateWindow, prijsSleutel, creditCost, krimpErgens, syncBesluit, schrijfState, tabelPrijsPast, datumOf, eanGeldig, eanUitRuns, eanRunsUitRij, EAN_L, EAN_G, EAN_PARITEIT, DB_KEY, YR, uid })', ctx);

/* de servertegenhangers, uit de TypeScript-bron geplukt zodat drift tussen client en server opvalt */
const serverBron = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'ai', 'index.ts'), 'utf8');
function serverFn(naam) {
  const m = serverBron.match(new RegExp(`function ${naam}\\([\\s\\S]*?\\n}`));
  assert.ok(m, `server heeft een functie ${naam}`);
  const js = m[0].replace(/\(w: Wijn\): string(?!\[)/, '(w)').replace(/\(x: unknown\)/g, '(x)').replace(/\(kind: string, images: number\): number/, '(kind, images)')
    .replace(/\(row: [^)]*\): boolean/, '(row)').replace(/\(treffers: [^)]*\): Treffer\[\]/, '(treffers, voorkeur, ruis)').replace(/\(t: Treffer\): number/, '(t)')
    .replace(/\(s: string\): string/, '(s)').replace(/\(w: Wijn\): Trede\[\]/, '(w)').replace(/\(w: Wijn\): \{[^}]*\}/, '(w)').replace(/\(code: unknown\): boolean/, '(code)')
    .replace(/const t: Trede\[\] = /, 'const t = ');
  return vm.runInContext(`(${js})`, ctx);
}
/* constanten en hulpjes van de server die zo'n functie nodig heeft */
vm.runInContext(`var PRIJS_VEROUDERD_DAGEN = ${serverBron.match(/const PRIJS_VEROUDERD_DAGEN = (\d+)/)[1]}`, ctx);
vm.runInContext(`var KLEUR = ${serverBron.match(/const KLEUR: Record<string, string> = (\{[^}]*\})/)[1]}`, ctx);
vm.runInContext("var tekstVeld = (x, n = 120) => String(x ?? '').replace(/[\\r\\n\\t]+/g, ' ').trim().slice(0, n)", ctx);
ctx.eanGeldig = serverFn('eanGeldig');
vm.runInContext("var eanVan = (w) => eanGeldig(w.ean) ? String(w.ean).replace(/\\D/g, '') : ''", ctx);

/* ================= sync ================= */
test('sync: zonder document in de cloud gaat alles omhoog', () => {
  assert.equal(C.syncBesluit(5, 0, null, false), 'eerste');
  assert.equal(C.syncBesluit(5, 0, 5, false), 'eerste');
});
test('sync: niets veranderd aan beide kanten doet niets', () => {
  assert.equal(C.syncBesluit(7, 7, 7, true), 'niets');
});
test('sync: alleen dit apparaat veranderde, dan push', () => {
  assert.equal(C.syncBesluit(8, 7, 7, true), 'push');
});
test('sync: alleen de cloud veranderde, dan pull, ook als het lokale nummer hoger is', () => {
  assert.equal(C.syncBesluit(7, 9, 7, true), 'pull');
  assert.equal(C.syncBesluit(12, 12, 12, true), 'niets', 'gelijk aan het ijkpunt is geen wijziging');
  assert.equal(C.syncBesluit(12, 3, 12, true), 'pull', 'de cloud ging terug (Alles wissen elders): overnemen, niet overschrijven');
});
test('sync: beide kanten veranderd is een botsing, wat de nummers ook zijn', () => {
  assert.equal(C.syncBesluit(8, 9, 7, true), 'botsing');
  assert.equal(C.syncBesluit(20, 9, 7, true), 'botsing');
});
test('sync: allereerste keer zonder ijkpunt vergelijkt de nummers', () => {
  assert.equal(C.syncBesluit(3, 1, null, true), 'push');
  assert.equal(C.syncBesluit(1, 3, null, true), 'pull');
  assert.equal(C.syncBesluit(3, 3, null, true), 'niets');
});
test('krimpbewaking: meer dan 80 procent minder wijnen, historie of wensen vraagt om bevestiging', () => {
  const tel = (w, h, s) => ({ wines: new Array(w), history: new Array(h), wishlist: new Array(s) });
  assert.equal(C.krimpErgens(tel(10, 0, 0), tel(1, 0, 0)), true);
  assert.equal(C.krimpErgens(tel(10, 0, 0), tel(3, 0, 0)), false);
  assert.equal(C.krimpErgens(tel(4, 0, 0), tel(0, 0, 0)), false, 'onder vijf stuks geen bewaking');
  assert.equal(C.krimpErgens(tel(10, 20, 0), tel(10, 2, 0)), true, 'ook de historie telt');
  assert.equal(C.krimpErgens(tel(10, 0, 6), tel(10, 0, 0)), true, 'ook de verlanglijst telt');
});

/* ================= normalisatie van buiten ================= */
test('schoonWijn: onbekend type wordt rood, foute id wordt vervangen, jaartal en link worden getoetst', () => {
  const w = C.schoonWijn({ id: '../../x', name: 'Test', type: 'paars', vintage: '1850', qty: '5000', valueBron: { url: 'javascript:alert(1)', name: 'x' } });
  assert.equal(w.type, 'rood');
  assert.match(w.id, /^[A-Za-z0-9_-]{1,64}$/);
  assert.notEqual(w.id, '../../x');
  assert.equal(w.vintage, null);
  assert.equal(w.qty, 999);
  assert.equal(w.valueBron.url, '');
});
test('schoonWijn: een waarde zonder bronveld geldt als zelf ingevuld', () => {
  assert.equal(C.schoonWijn({ name: 'x', value: 20 }).valueSrc, 'eigen');
  assert.equal(C.schoonWijn({ name: 'x', value: 20, valueSrc: 'ai' }).valueSrc, 'ai');
  assert.equal(C.schoonWijn({ name: 'x', value: 20, valueSrc: 'hack' }).valueSrc, 'eigen');
});
test('schoonWijn: iets dat geen object is wordt een lege wijn, geen fout', () => {
  assert.equal(C.schoonWijn(null).name, '');
  assert.equal(C.schoonWijn('tekst').type, 'rood');
});
test('schoonHist: alleen bekende redenen om af te boeken, sterren tussen 0 en 5', () => {
  assert.equal(C.schoonHist({ weg: 'gestolen', rating: 9 }).weg, undefined);
  assert.equal(C.schoonHist({ weg: 'cadeau', rating: 9 }).weg, 'cadeau');
  assert.equal(C.schoonHist({ rating: 9 }).rating, 5);
  assert.equal(C.schoonHist({ rating: -3 }).rating, 0);
});
test('schoonLoc: een rek houdt alleen geldige vakken binnen het raster', () => {
  const l = C.schoonLoc({ name: 'Rek', rek: { rijen: 2, kolommen: 3, vakken: { A1: 'abc', Z9: 'abc', B4: 'abc', A2: '../x' } } });
  assert.deepEqual(Object.keys(l.rek.vakken), ['A1']);
});

/* ================= client en server gelijk ================= */
test('prijssleutel: client en server geven dezelfde sleutel', () => {
  const server = serverFn('prijsSleutel');
  for (const w of [
    { name: 'Quarts de Chaume', producer: 'Domaine des Baumard', vintage: 2014 },
    { name: 'Château Léoville-Barton', producer: 'Léoville Barton', vintage: '2016' },
    { name: 'Brut Réserve', producer: 'Billecart-Salmon', vintage: null },
    { name: 'Viña Ardanza', producer: '', vintage: 0 },
    { name: 'Cuvée des Annibals', producer: 'Famille de Wulf Domaine des Annibals', vintage: 2025, zoekProducer: 'Domaine des Annibals', zoekNaam: 'Cuvée des Annibals' },
  ]) assert.equal(C.prijsSleutel(w), server(w), JSON.stringify(w));
  assert.equal(C.prijsSleutel({ name: 'Brut', producer: 'X', vintage: null }), 'x|brut|nv');
  assert.equal(C.prijsSleutel({ name: 'Cuvée des Annibals', producer: 'Famille de Wulf Domaine des Annibals', vintage: 2025, zoekProducer: 'Domaine des Annibals', zoekNaam: 'Cuvée des Annibals' }), 'domaine des annibals|cuvee des annibals|2025', 'de zoekidentiteit bepaalt de sleutel');
  assert.equal(C.schoonWijn({ name: 'x', zoekProducer: 'Domaine X' }).zoekProducer, 'Domaine X');
  assert.equal(C.schoonWijn({ name: 'x' }).zoekProducer, undefined);
});
test('credits: client en server rekenen hetzelfde', () => {
  const server = serverFn('creditsFor');
  for (const [kind, n] of [['scan', 1], ['wijnkaart', 1], ['wijnkaart', 3], ['prijs', 0], ['prijsdiep', 0], ['import', 4], ['pairing', 0]])
    assert.equal(C.creditCost(kind, n), server(kind, n), `${kind} met ${n} beelden`);
});
test('credits: de soorten die de app stuurt staan in de vaste lijst van de server', () => {
  const lijst = serverBron.match(/const KINDS = new Set\(\[([\s\S]*?)\]\)/)[1].match(/'([a-z]+)'/g).map(s => s.replace(/'/g, ''));
  const gebruikt = new Set(['ai', 'prijscache', 'betaald']);
  for (const m of bron.matchAll(/callClaude\([^;]*?,\s*'([a-z]+)'/g)) gebruikt.add(m[1]);
  for (const m of bron.matchAll(/'(prijsdiep|prijs)'/g)) gebruikt.add(m[1]);
  for (const k of gebruikt) assert.ok(lijst.includes(k), `server kent soort '${k}'`);
});

test('prijstabel: overschrijft nooit een eigen waarde, wel een fles zonder bron en een oudere opgezochte prijs', () => {
  const p = { at: '2026-09-15T10:00:00+00:00', value: 20 };
  assert.equal(C.tabelPrijsPast({ name: 'x' }, p), true, 'zonder waarde');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'ai' }, p), true, 'een schatting is geen bron');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'eigen' }, p), false, 'zelf ingevuld blijft staan');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'samen' }, p), true, 'een opgezochte prijs gaat vóór wat anderen betaalden');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'zoek', valueAt: '2026-06-01' }, p), true, 'de tabel is nieuwer');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'zoek', valueAt: '2026-09-15' }, p), false, 'zelfde dag is niets nieuws');
  assert.equal(C.tabelPrijsPast({ name: 'x', value: 30, valueSrc: 'zoek', valueAt: '2026-06-01' }, { value: 20 }), false, 'zonder datum in de tabel geen verversing');
  assert.equal(C.datumOf('2026-09-02T15:19:29.174+00:00'), '2026-09-02');
  assert.equal(C.datumOf('nonsense'), new Date().toISOString().slice(0, 10));
});
test('zoekidentiteit (server): eigenaarsfamilie en rechtsvorm vallen weg, de trap heeft hoogstens drie treden zonder dubbelen', () => {
  const kortVorm = serverFn('kortVorm');
  assert.equal(kortVorm('Famille de Wulf Domaine des Annibals'), 'Domaine des Annibals');
  assert.equal(kortVorm('SCEA Château Perron'), 'Château Perron');
  assert.equal(kortVorm('Famille Perrin'), 'Famille Perrin', 'zonder domein erachter is de familie zelf de producent');
  assert.equal(kortVorm('Louis Jadot'), 'Louis Jadot');
  ctx.kortVorm = kortVorm; ctx.zoekId = serverFn('zoekId');
  const zoekTreden = serverFn('zoekTreden');
  const qs = w => [...zoekTreden(w)].map(t => t.q);
  assert.deepEqual(qs({ producer: 'Famille de Wulf Domaine des Annibals', name: 'Cuvée des Annibals', vintage: 2025, appellation: 'Côtes de Provence', type: 'rose' }),
    ['Domaine des Annibals Cuvée des Annibals 2025 prijs', 'Domaine des Annibals Cuvée des Annibals wijn kopen', 'Domaine des Annibals Côtes de Provence rosé kopen']);
  assert.deepEqual(qs({ producer: 'Château Talbot', name: 'Château Talbot', vintage: null }), ['Château Talbot wijn kopen'], 'zonder jaargang en zonder appellation blijft één trede');
  assert.equal(qs({ zoekProducer: 'Louis Jadot', zoekNaam: 'Les Petites Pierres', producer: 'Maison Louis Jadot', name: 'Bourgogne Les Petites Pierres', vintage: 2023, region: 'Bourgogne', type: 'wit' })[0], 'Louis Jadot Les Petites Pierres 2023 prijs', 'de zoekidentiteit van de scanner wint');
  const metEan = [...zoekTreden({ producer: 'Château Talbot', name: 'Château Talbot', vintage: 2016, ean: '5901234123457' })];
  assert.equal(metEan[0].q, '5901234123457', 'de streepjescode is de eerste trede'); assert.equal(metEan[0].soort, 'ean');
  assert.equal(qs({ producer: 'X', name: 'Y', ean: '5901234123458' })[0], 'X Y wijn kopen', 'een ongeldige streepjescode telt niet');
  for (const c of ['5901234123457', '5901234123458', '96385074', '', null]) assert.equal(C.eanGeldig(c), ctx.eanGeldig(c), 'client en server gelijk: ' + c);
});
/* ================= streepjescode ================= */
/* een EAN als rij strepen, zoals de lezer hem uit een beeldregel haalt; module = breedte van één streepje */
function eanRuns(code, module, stoor) {
  const runs = [{ b: false, w: module * 12 }];
  const push = (b, n) => runs.push({ b, w: n * module + (stoor ? (runs.length % 3 === 0 ? 1 : 0) : 0) });
  const digit = (d, set, eerstStreep) => { const p = set[d]; for (let k = 0; k < 4; k++) push(eerstStreep ? k % 2 === 0 : k % 2 === 1, +p[k]); };
  push(true, 1); push(false, 1); push(true, 1);
  const links = code.length === 13 ? code.slice(1, 7) : code.slice(0, 4), rechts = code.length === 13 ? code.slice(7) : code.slice(4);
  const par = code.length === 13 ? C.EAN_PARITEIT[+code[0]] : 'LLLL';
  for (let i = 0; i < links.length; i++) digit(+links[i], par[i] === 'G' ? C.EAN_G : C.EAN_L, false);
  push(false, 1); push(true, 1); push(false, 1); push(true, 1); push(false, 1);
  for (let i = 0; i < rechts.length; i++) digit(+rechts[i], C.EAN_L, true);
  push(true, 1); push(false, 1); push(true, 1); push(false, module * 10);
  return runs;
}
test('eanGeldig: controlecijfer van EAN-13 en EAN-8, niets anders', () => {
  assert.equal(C.eanGeldig('5901234123457'), true);
  assert.equal(C.eanGeldig('5901234123458'), false, 'verkeerd controlecijfer');
  assert.equal(C.eanGeldig('8712100000003'), true);
  assert.equal(C.eanGeldig('96385074'), true, 'EAN-8');
  assert.equal(C.eanGeldig('12345'), false);
  assert.equal(C.eanGeldig(null), false);
});
test('eanUitRuns: leest een EAN-13 en een EAN-8 uit strepen, ook op zijn kop en met een pixel storing, en weigert onzin', () => {
  for (const code of ['5901234123457', '8712100000003', '3760091720511']) {
    assert.equal(C.eanUitRuns(eanRuns(code, 3, false)), code, code);
    assert.equal(C.eanUitRuns(eanRuns(code, 4, true)), code, code + ' met storing');
    assert.equal(C.eanUitRuns(eanRuns(code, 3, false).slice().reverse()), code, code + ' op zijn kop');
  }
  assert.equal(C.eanUitRuns(eanRuns('96385074', 3, false)), '96385074', 'EAN-8');
  assert.equal(C.eanUitRuns([{ b: false, w: 30 }, { b: true, w: 3 }, { b: false, w: 3 }, { b: true, w: 3 }, { b: false, w: 9 }]), null, 'te kort');
  const kapot = eanRuns('5901234123457', 3, false); kapot[20].w = 9;
  assert.equal(C.eanUitRuns(kapot), null, 'een kapotte streep geeft geen code, geen gok');
  assert.equal(C.eanUitRuns(null), null);
});
test('eanRunsUitRij: een beeldregel met schaduw en glans wordt toch de goede rij strepen', () => {
  /* de strepen als grijswaarden, met een lichtverloop van 90 links naar 250 rechts en wat ruis erop */
  const runs = eanRuns('8712100000003', 4, false);
  const px = []; for (const r of runs) for (let i = 0; i < r.w; i++) px.push(r.b ? 0 : 1);
  const g = new Float32Array(px.length);
  for (let x = 0; x < px.length; x++) { const licht = 90 + 160 * x / px.length; g[x] = px[x] ? licht : licht * 0.35 + ((x * 7) % 5); }
  assert.equal(C.eanUitRuns(C.eanRunsUitRij(g, g.length)), '8712100000003');
  assert.equal(C.eanRunsUitRij(new Float32Array(200).fill(200), 200), null, 'een egale regel heeft geen strepen');
});

test('rangschik (server): bekende winkels eerst, folders en retourwinkels achteraan, verder de volgorde van Brave', () => {
  const rangschik = serverFn('rangschik');
  const t = u => ({ title: u.includes('folder') ? 'Aanbiedingen folder' : 'x', url: u, desc: '' });
  const uit = rangschik([t('https://promocatalogues.fr/lidl'), t('https://www.onbekend.nl/wijn'), t('https://www.gall.nl/fles'), t('https://shop.retoura.de/x'), t('https://ander.be/y')],
    ['gall.nl'], ['promocatalogues', 'retoura']).map(x => x.url);
  assert.deepEqual(uit.join(' '), 'https://www.gall.nl/fles https://www.onbekend.nl/wijn https://ander.be/y https://promocatalogues.fr/lidl https://shop.retoura.de/x');
  assert.equal(rangschik([t('geen url')], [], []).length, 1, 'een kapot adres blijft staan, achteraan');
});
test('prijsVerouderd (server): een rij van meer dan 90 dagen oud geldt als verouderd', () => {
  const server = serverFn('prijsVerouderd');
  assert.equal(server({ updated_at: new Date(Date.now() - 10 * 864e5).toISOString() }), false);
  assert.equal(server({ updated_at: new Date(Date.now() - 100 * 864e5).toISOString() }), true);
  assert.equal(server({ updated_at: null }), true);
  assert.equal(server(null), true);
});

/* ================= kelderregels ================= */
test('matchWine: een andere jaargang is een andere fles', () => {
  C.S.wines = [{ id: 'a', name: 'Château Talbot', producer: 'Château Talbot', vintage: 2015 }];
  assert.equal(C.matchWine({ name: 'Château Talbot', producer: 'Château Talbot', vintage: 2016 }), null);
  assert.equal(C.matchWine({ name: 'Talbot', producer: '', vintage: 2015 })?.id, 'a');
});
test('matchWine: twee cuvées van hetzelfde domein zijn niet dezelfde wijn', () => {
  C.S.wines = [{ id: 'a', name: 'Clos du Papillon', producer: 'Domaine des Baumard', vintage: 2019 }];
  assert.equal(C.matchWine({ name: 'Quarts de Chaume', producer: 'Domaine des Baumard', vintage: 2019 }), null);
});
test('foodCats: trefwoorden gelden per heel woord, "ree" past niet op puree', () => {
  const ids = t => C.foodCats(t).map(c => c.id);
  /* arrays uit de vm-context hebben een ander Array-prototype, dus vergelijken als tekst */
  assert.equal(ids('Zeewolf met kalfsfond-witte-wijn-saus en knolselderijpuree').join(','), 'witvis,pastaroom', 'zeewolf en witte wijnsaus, geen ree uit puree en geen kalf uit kalfsfond');
  assert.ok(!ids('knolselderijpuree').includes('wild'));
  assert.ok(ids('champignonrisotto').includes('paddenstoel'));
  assert.ok(ids('kippenbout').includes('kip'));
  assert.ok(!ids('Lamothe').includes('lam'));
});
test('windowStatus: jong, op dronk, drink binnenkort, over de piek, onbekend', () => {
  const y = C.YR();
  assert.equal(C.windowStatus({ drinkFrom: y + 2, drinkTo: y + 8 }).k, 'jong');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y + 10 }).k, 'op');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y }).k, 'nu');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y - 1 }).k, 'over');
  assert.equal(C.windowStatus({}).k, 'onb');
});
test('estimateWindow: een fles zonder venster krijgt er altijd een, en die loopt vooruit', () => {
  for (const type of ['rood', 'wit', 'rose', 'mousserend', 'zoet', 'versterkt', 'oranje']) {
    const e = C.estimateWindow({ type, vintage: 2020, grapes: [], name: 'x' });
    assert.ok(e.from <= e.to && e.from >= 2020, type);
  }
});

/* ================= opslag ================= */
test('schrijfState: bij een vol quotum gaan de reservekopieën weg, oudste eerst, en de stand wordt bewaard', () => {
  opslag.set('caveau_backup_prev2', 'x'); opslag.set('caveau_backup_prev', 'x'); opslag.set('caveau_backup_daily', 'x');
  localStorage.weiger = k => k === C.DB_KEY && opslag.has('caveau_backup_prev');
  assert.equal(C.schrijfState(), true);
  assert.equal(opslag.has('caveau_backup_prev2'), false);
  assert.equal(opslag.has('caveau_backup_prev'), false);
  assert.equal(opslag.has('caveau_backup_daily'), true, 'de dagelijkse kopie blijft als het niet nodig is');
  assert.ok(opslag.has(C.DB_KEY));
  localStorage.weiger = k => k === C.DB_KEY;
  assert.equal(C.schrijfState(), false, 'echt vol: eerlijk false, geen uitzondering');
  localStorage.weiger = null;
});
test('uid: ids voldoen aan wat de normalisatie toelaat', () => {
  assert.match(C.uid(), /^[A-Za-z0-9_-]{1,64}$/);
});

/* ================= normalisatie van het hele document (15 sep 2026) ================= */
test('schoonHist: geen beoordeling blijft geen beoordeling, ook na een sync', () => {
  assert.equal(C.schoonHist({ name: 'x' }).rating, null);
  assert.equal(C.schoonHist({ name: 'x', rating: null }).rating, null);
  assert.equal(C.schoonHist({ name: 'x', rating: 0 }).rating, 0);
  assert.equal(C.schoonHist({ name: 'x', rating: 4.5 }).rating, 4.5);
});
test('prototype-sleutels tellen niet als type of reden', () => {
  assert.equal(C.eigenSleutel({ rood: 1 }, 'rood'), true);
  assert.equal(C.eigenSleutel({ rood: 1 }, 'constructor'), false);
  assert.equal(C.eigenSleutel({ rood: 1 }, undefined), false);
  assert.equal(C.schoonWijn({ name: 'x', type: 'constructor' }).type, 'rood');
  assert.equal(C.schoonHist({ name: 'x', weg: 'constructor' }).weg, undefined);
});
test('schoonDoc: verkeerde types in caches en tafel breken de app niet, score en persons zijn getallen', () => {
  const d = C.schoonDoc({ tonight: 'x', pairCache: [null, { key: 'k', dish: 'd', matches: [{ id: 'abc', score: '<img onerror=1>', reason: 'r' }] }],
    recipeCache: 'x', rev: '7', cellarName: 'n'.repeat(200), wines: [null, { name: 'ok' }] });
  assert.equal(d.tonight.length, 0);
  assert.equal(d.pairCache.length, 1);
  assert.equal(d.pairCache[0].matches[0].score, 0);
  assert.equal(d.recipeCache.length, 0);
  assert.equal(d.rev, 7);
  assert.equal(d.cellarName.length, 60);
  assert.equal(d.wines.length, 1);
  const r = C.schoonDoc({ recipeCache: [{ key: 'x|4', dish: 'x', persons: '<b>', recipe: {} }] }).recipeCache[0];
  assert.equal(r.persons, 2);
  assert.equal(r.recipe.ingredients.length, 0);
});
test('schoonWijn: valueAt is een datum of niets', () => {
  assert.equal(C.schoonWijn({ name: 'x', valueAt: 'nonsense' }).valueAt, undefined);
  assert.equal(C.schoonWijn({ name: 'x', valueAt: '2026-09-15' }).valueAt, '2026-09-15');
});
