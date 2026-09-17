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
const C = vm.runInContext('({ S, schoonWijn, schoonHist, schoonLoc, schoonDoc, eigenSleutel, matchWine, foodCats, windowStatus, vensterUitloop, estimateWindow, oudVenster, vensterMigratie, tabelMigratie, TABEL_VERSIE, jaargangOordeel, streekVan, STREKEN, JAARTABEL, JAARBRON, rijpheidVan, rijpheidReikt, rijpheidZin, citaatVan, RIJPHEID, CITAAT, CITAAT_STIL, PRODUCENT, genoemdDoor, ACHTERGROND, achtergrondVan, PROD_VAAK, vaakGenoemd, prijsSleutel, creditCost, krimpErgens, syncBesluit, schrijfState, tabelPrijsPast, datumOf, waardeBlok, waardeSub, jaargangKloof, plekHtml, prijsBezig, versPrijsvakken, eanGeldig, eanUitRuns, eanRunsUitRij, EAN_L, EAN_G, EAN_PARITEIT, DB_KEY, YR, uid })', ctx);

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
test('windowStatus: jong, op dronk, drink binnenkort, op z\u2019n rijpst, over de piek, onbekend', () => {
  const y = C.YR();
  assert.equal(C.windowStatus({ drinkFrom: y + 2, drinkTo: y + 8 }).k, 'jong');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y + 10 }).k, 'op');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y }).k, 'nu');
  assert.equal(C.windowStatus({ drinkFrom: y - 5, drinkTo: y - 1 }).k, 'rijp', 'net voorbij het venster is geen alarm');
  assert.equal(C.windowStatus({ drinkFrom: y - 30, drinkTo: y - 20 }).k, 'over', 'ver voorbij het venster wel');
  assert.equal(C.windowStatus({}).k, 'onb');
});
test('windowStatus: "drink binnenkort" gaat nooit over meer dan drie jaar', () => {
  const y = C.YR();
  /* een venster van dertig jaar gaf met een vast percentage vijf jaar "binnenkort" */
  assert.equal(C.windowStatus({ drinkFrom: y - 25, drinkTo: y + 5 }).k, 'op');
  assert.equal(C.windowStatus({ drinkFrom: y - 25, drinkTo: y + 3 }).k, 'nu');
});
test('windowStatus: de uitloop groeit mee met wat de kelderregels van de fles denken', () => {
  const y = C.YR();
  /* korte vensters lopen kort uit */
  const kort = { type: 'rose', vintage: y - 4, grapes: [], name: 'Ros\u00e9', region: 'Provence', drinkFrom: y - 4, drinkTo: y - 2 };
  assert.equal(C.windowStatus(kort).k, 'over');
  /* een vintage champagne uit een groot jaar met een veel te kort venster niet */
  const champ = { type: 'mousserend', vintage: 2008, grapes: ['chardonnay', 'pinot noir'], name: 'Brut Vintage',
    region: 'Champagne', appellation: 'Champagne', drinkFrom: 2013, drinkTo: 2023 };
  assert.equal(C.windowStatus(champ).k, 'rijp', 'een 2008 champagne is in ' + y + ' niet over de piek');
  assert.ok(C.vensterUitloop(champ, 2013, 2023) > 10);
});
test('estimateWindow: een fles zonder venster krijgt er altijd een, en die loopt vooruit', () => {
  for (const type of ['rood', 'wit', 'rose', 'mousserend', 'zoet', 'versterkt', 'oranje']) {
    const e = C.estimateWindow({ type, vintage: 2020, grapes: [], name: 'x' });
    assert.ok(e.from <= e.to && e.from >= 2020, type);
    assert.ok(e.soort, 'elke schatting zegt welke soort fles hij dacht te zien');
  }
});
test('estimateWindow: bewaarwijnen krijgen de jaren die ze in het echt halen', () => {
  const duur = w => { const e = C.estimateWindow(w); return e.to - (w.vintage || C.YR()); };
  const champ2008 = { type: 'mousserend', vintage: 2008, grapes: ['chardonnay', 'pinot noir'], name: 'Brut Vintage', region: 'Champagne', appellation: 'Champagne' };
  assert.ok(duur(champ2008) >= 25, 'vintage champagne uit 2008 gaat decennia mee, niet vijftien jaar');
  const dp = { ...champ2008, name: 'Dom P\u00e9rignon', producer: 'Mo\u00ebt & Chandon' };
  assert.ok(duur(dp) > duur(champ2008), 'een prestige cuv\u00e9e gaat langer mee dan een gewone vintage');
  const barolo = { type: 'rood', vintage: 1996, grapes: ['nebbiolo'], name: 'Barolo Riserva', region: 'Piemonte', appellation: 'Barolo DOCG' };
  assert.ok(duur(barolo) >= 30, 'een Barolo Riserva uit 1996 is geen fles van achttien jaar');
  const yquem = { type: 'zoet', vintage: 1990, grapes: ['semillon'], name: "Ch\u00e2teau d'Yquem", region: 'Bordeaux', appellation: 'Sauternes' };
  assert.ok(duur(yquem) >= 45, 'edelzoet uit een groot jaar gaat een halve eeuw mee');
  const rose = { type: 'rose', vintage: 2024, grapes: ['grenache'], name: 'Ros\u00e9', region: 'Provence' };
  assert.ok(duur(rose) <= 4, 'en een ros\u00e9 wordt daar niet in meegesleept');
  const nouveau = { type: 'rood', vintage: 2025, grapes: ['gamay'], name: 'Beaujolais Nouveau', region: 'Beaujolais' };
  assert.ok(duur(nouveau) <= 3, 'nouveau blijft nouveau, ook al is gamay een druif met een venster');
});
test('estimateWindow: de jaargang rekt en kort het venster', () => {
  const basis = { type: 'rood', grapes: ['cabernet sauvignon'], name: 'Ch\u00e2teau x', region: 'Bordeaux', appellation: 'Pauillac' };
  const groot = C.estimateWindow({ ...basis, vintage: 2016 });   // uitzonderlijk
  const zwak = C.estimateWindow({ ...basis, vintage: 2013 });    // moeilijk
  assert.ok(groot.to - 2016 > zwak.to - 2013, 'een groot jaar houdt langer dan een moeilijk jaar');
  assert.ok(groot.from - 2016 >= zwak.from - 2013, 'en het heeft ook meer tijd nodig');
});
test('jaargangOordeel: kent de streek, en zwijgt waar hij niets weet', () => {
  const o = C.jaargangOordeel({ vintage: 2008, type: 'mousserend', region: 'Champagne', name: 'x' });
  assert.equal(o.niveau, 5);
  assert.equal(o.woord, 'uitzonderlijk');
  assert.match(o.streek, /Champagne/);
  assert.equal(C.jaargangOordeel({ vintage: 2008, type: 'rood', region: 'Kosovo', name: 'x' }), null, 'een onbekende streek geeft geen oordeel');
  assert.equal(C.jaargangOordeel({ vintage: null, type: 'rood', region: 'Bordeaux', name: 'x' }), null, 'zonder jaargang valt er niets te zeggen');
  const leeg = C.jaargangOordeel({ vintage: 1954, type: 'rood', region: 'Bordeaux', name: 'x' });
  assert.equal(leeg.woord, null, 'een jaar buiten de tabel is geen mening, geen gok');
  assert.equal(leeg.niveau, 3);
});
test('jaargangOordeel: rood en wit uit de Bourgogne worden apart beoordeeld', () => {
  const r = C.jaargangOordeel({ vintage: 2003, type: 'rood', region: 'Bourgogne', appellation: 'Gevrey-Chambertin', name: 'x' });
  const wt = C.jaargangOordeel({ vintage: 2014, type: 'wit', region: 'Bourgogne', appellation: 'Meursault', name: 'x' });
  assert.match(r.streek, /rood/);
  assert.match(wt.streek, /wit/);
});
test('de jaargangtabel scheidt gecontroleerde jaren van eigen schattingen', () => {
  /* Een plus achter het niveau betekent: tegen minstens twee onafhankelijke bronnen gelegd.
     De app zegt dat per fles tegen de gebruiker, dus het mag niet door elkaar lopen. */
  const champ = { vintage: 2008, type: 'mousserend', region: 'Champagne', name: 'x' };
  assert.equal(C.jaargangOordeel(champ).bron, 2, 'Champagne 2008 is tegen twee bronnen gelegd');
  const geschat = { vintage: 1979, type: 'mousserend', region: 'Champagne', name: 'x' };
  assert.equal(C.jaargangOordeel(geschat).bron, 0, '1979 staat er nog als eigen schatting');
  /* de middelste stand: één betrouwbare bron, een ster in de tabel */
  for (const jaren of Object.values(C.JAARBRON)) {
    for (const v of Object.values(jaren)) assert.ok(v === 1 || v === 2, 'bronstand is 1 of 2, niet ' + v);
  }
  /* elke gemarkeerde jaargang hoort ook een niveau te hebben */
  for (const [streek, jaren] of Object.entries(C.JAARBRON)) {
    for (const jaar of Object.keys(jaren)) {
      assert.ok(C.JAARTABEL[streek][jaar] >= 1, streek + ' ' + jaar + ' is gemarkeerd zonder niveau');
    }
  }
  const totaal = Object.values(C.JAARTABEL).reduce((n, j) => n + Object.keys(j).length, 0);
  const bron = Object.values(C.JAARBRON).reduce((n, j) => n + Object.keys(j).length, 0);
  assert.ok(bron > 180 && bron < totaal, `${bron} van ${totaal} jaren met bron; klopt dat nog?`);
});
test('de jaargangtabel is goed gevormd: bekende streken, geldige jaren en niveaus', () => {
  const keys = new Set();
  for (const st of C.STREKEN) {
    assert.ok(!keys.has(st.k), 'geen dubbele streeksleutel: ' + st.k);
    keys.add(st.k);
    assert.ok(st.l && st.kw.length, st.k);
    for (const k of st.kw) assert.equal(k, k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), 'trefwoord moet al genormaliseerd zijn: ' + k);
    for (const [jaar, niveau] of Object.entries(C.JAARTABEL[st.k])) {
      assert.ok(+jaar >= 1900 && +jaar <= C.YR(), st.k + ' ' + jaar);
      assert.ok(niveau >= 1 && niveau <= 5, st.k + ' ' + jaar + ': ' + niveau);
    }
  }
});
test('streekVan: brengt bekende appellations thuis, en niet bij de buren', () => {
  /* Een verkeerde streek geeft een verkeerd drinkadvies, en dat is erger dan geen advies.
     Deze gevallen kwamen op 16 sep uit een ronde langs 299 appellations en waren allemaal fout:
     'peninsula' ving Mornington en Niagara voor de Alentejo, 'vesuvio' ving Quinta do Vesuvio
     uit de Douro voor Campanië, 'orange' ving elke oranjewijn voor Nieuw-Zuid-Wales, 'sicilia'
     ving Vega Sicilia voor Sicilië, en 'alicante' ving de druif Alicante Bouschet uit de
     Alentejo en de Douro voor zuidoost-Spanje. */
  const streek = (appellation, land, type, naam) =>
    (C.streekVan({ appellation, country: land, type, name: naam || '' }) || {}).k || null;
  assert.equal(streek('Mornington Peninsula', 'Australië', 'rood'), 'australie_vic');
  assert.equal(streek('Niagara Peninsula', 'Canada', 'wit'), 'canada');
  assert.equal(streek('Península de Setúbal', 'Portugal', 'rood'), 'alentejo');
  assert.equal(streek('Douro', 'Portugal', 'versterkt', 'Quinta do Vesuvio Vintage Port'), 'douro_port');
  assert.equal(streek('Lacryma Christi del Vesuvio', 'Italië', 'rood'), 'campanie');
  assert.equal(streek('Kakheti', 'Georgië', 'wit', 'Orange Wine Rkatsiteli'), null, 'een oranjewijn is geen streek');
  assert.equal(streek('Orange, New South Wales', 'Australië', 'wit'), 'australie_nsw');
  assert.equal(streek('Ribera del Duero', 'Spanje', 'rood', 'Vega Sicilia Único'), 'ribera');
  assert.equal(streek('Sicilia', 'Italië', 'rood', 'Planeta'), 'sicilie');
  assert.equal(streek('Vinho Regional Alentejano', 'Portugal', 'rood', 'Alicante Bouschet'), 'alentejo');
  assert.equal(streek('Alicante', 'Spanje', 'rood', 'Bodegas Enrique Mendoza'), 'spanje_midden');
  assert.equal(streek('Entre-Deux-Mers', 'Frankrijk', 'wit'), 'bordeaux');
  /* en de gewone gevallen blijven staan */
  assert.equal(streek('Vino Nobile di Montepulciano', 'Italië', 'rood'), 'toscane');
  assert.equal(streek("Montepulciano d'Abruzzo", 'Italië', 'rood'), 'italie_midden');
  assert.equal(streek('Los Carneros', 'VS', 'rood', 'Napa Valley'), 'napa');
  assert.equal(streek('Carneros', 'VS', 'wit', 'Hyde Vineyard'), 'sonoma');
  /* de uitzonderingslijst hoort net als de trefwoorden al genormaliseerd te zijn */
  for (const st of C.STREKEN) {
    for (const k of (st.niet || [])) {
      assert.equal(k, k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), 'uitzondering moet genormaliseerd zijn: ' + k);
    }
  }
});
test('rijpheid uit een bron houdt "Over de piek?" tegen, en nooit andersom', () => {
  /* De aanleiding van het hele drinkvensterwerk was een verzamelaar die te horen kreeg dat zijn
     flessen over de piek waren terwijl ze dat niet waren. Gemeten over 452 streek-jaargangen zei
     de app dertien keer "Over de piek?" terwijl Berry Bros de wijn op z'n best noemde. Deze tabel
     mag daarom één kant op werken: een venster verlengen, nooit inkorten. */
  const claret = { id: 'r1', type: 'rood', vintage: 1982, grapes: ['cabernet sauvignon'],
    region: 'Bordeaux', appellation: 'Pauillac', name: 'Pauillac', qty: 1 };
  const r = C.estimateWindow(claret);
  claret.drinkFrom = r.from; claret.drinkTo = r.to;
  assert.ok(r.to < C.YR(), 'het venster van deze fles is volgens de regels allang afgelopen');
  const rp = C.rijpheidVan(claret);
  assert.equal(rp.stand, 2, 'Berry Bros noemt 1982 in Bordeaux op zijn best');
  assert.equal(C.windowStatus(claret).k, 'rijp', 'dus geen "Over de piek?" maar "Op z\u2019n rijpst"');
  /* zonder bronoordeel blijft de oude uitkomst staan */
  const zonder = { ...claret, id: 'r2', region: 'Kosovo', appellation: '', name: 'x' };
  assert.equal(C.rijpheidVan(zonder), null);
  assert.equal(C.windowStatus(zonder).k, 'over', 'een streek zonder bronoordeel verandert niet');
  /* de tabel kort nooit in: een fles die nog niet aan zijn venster toe is blijft "Nog te jong" */
  const jong = { id: 'r3', type: 'mousserend', vintage: 2020, grapes: ['chardonnay'],
    region: 'Champagne', appellation: 'Champagne', name: 'Brut', qty: 1, drinkFrom: C.YR() + 3, drinkTo: C.YR() + 20 };
  assert.equal(C.windowStatus(jong).k, 'jong');
});
test('streekVan leest afkortingen zoals ze op etiketten staan', () => {
  /* Gemeten over 18.675 echte wijnnamen uit de catalogus van Berry Bros: 661 vielen buiten elke
     streek, en 170 daarvan alleen door de schrijfwijze. "St Joseph" en "Nuits St Georges" staan zo
     op het etiket; "Ermitage" is hoe Chapoutier zijn Hermitage schrijft. */
  const pak = (naam, extra) => ({ id: 'a', type: 'rood', vintage: 2015, name: naam, qty: 1, ...extra });
  assert.equal(C.streekVan(pak('St Joseph Les Granits')).k, 'rhone_n');
  assert.equal(C.streekVan(pak('Nuits St Georges Les Boudots')).k, 'bourgogne_r');
  /* Dit stond fout in de app: 'saint georges' is in Bordeaux een satelliet van Saint-Émilion en
     Bordeaux staat eerder in de tabel, dus Nuits-Saint-Georges kreeg een Bordeaux-drinkadvies.
     Een machinale sweep over alle 68 streken vond vier van zulke botsingen. */
  assert.equal(C.streekVan(pak('Nuits-Saint-Georges Les Boudots')).k, 'bourgogne_r');
  assert.equal(C.streekVan(pak('Saint-Georges-Saint-Emilion')).k, 'bordeaux');
  assert.equal(C.streekVan(pak('Saint-Georges d Orques')).k, 'languedoc');
  assert.equal(C.streekVan(pak('Conca de Barbera Tinto')).k, 'priorat');
  /* 'montagne' is weg als los trefwoord: elk Montagne-Saint-Emilion draagt 'saint emilion' al,
     en los ving het ook Montagne de Reims en elk domein met dat woord in de naam. */
  assert.equal(C.streekVan(pak('Montagne-Saint-Emilion')).k, 'bordeaux');
  const reims = C.streekVan(pak('Montagne de Reims Blanc de Noirs', { type: 'mousserend' }));
  assert.ok(!reims || reims.k !== 'bordeaux', 'Montagne de Reims is geen Bordeaux');
  assert.equal(C.streekVan(pak('Ch St Emilion')).k, 'bordeaux');
  assert.equal(C.streekVan(pak('Ermitage Le Pavillon')).k, 'rhone_n');
  /* Ermitage is in de Valais ook de naam voor marsanne. Een verkeerde streek geeft een verkeerd
     drinkadvies, dus daar houdt de uitzondering het tegen. */
  const zwitsers = C.streekVan(pak('Ermitage', { type: 'wit', region: 'Valais', country: 'Zwitserland' }));
  assert.ok(!zwitsers || zwitsers.k !== 'rhone_n', 'een Valais-Ermitage is geen noordelijke Rhône');
});
test('de staat van dienst van een maker zegt niets over deze fles', () => {
  /* Dat Decanter de 2015 aanraadde zegt niets over de 2018, en die redenering maakt de app niet:
     er staat hoe vaak en in welke jaren, en verder niets. 1060 makers komen in twee of meer
     jaargangen terug. */
  let streek = null, naam = null, jaren = null;
  for (const k of Object.keys(C.PROD_VAAK)) {
    for (const n of Object.keys(C.PROD_VAAK[k])) {
      if (C.PROD_VAAK[k][n].length >= 3) { streek = k; naam = n; jaren = C.PROD_VAAK[k][n]; break; }
    }
    if (naam) break;
  }
  assert.ok(naam, 'er is minstens één maker met drie jaargangen');
  const st = C.STREKEN.find(s => s.k === streek);
  const fles = jaar => ({ id: 'v1', type: (st.t && st.t[0]) || 'rood', vintage: jaar, producer: naam,
    name: naam, region: st.l, appellation: st.kw[0], qty: 1 });
  /* voor een jaargang die wél in de lijst staat zegt genoemdDoor het al, en preciezer */
  assert.equal(C.vaakGenoemd(fles(jaren[0])), null, 'geen dubbele melding bij een genoemd jaar');
  /* voor een jaargang die er niet in staat komt de staat van dienst */
  let ander = 1961;
  while (jaren.includes(ander)) ander++;
  const v = C.vaakGenoemd(fles(ander));
  assert.ok(v, 'een andere jaargang krijgt de staat van dienst: ' + naam + ' ' + ander);
  assert.equal(v.aantal, jaren.length);
  assert.ok(v.aantal >= 2, 'nooit op grond van één enkele jaargang');
  /* elke regel in de tabel draagt minstens twee jaargangen */
  for (const k of Object.keys(C.PROD_VAAK)) {
    for (const n of Object.keys(C.PROD_VAAK[k])) {
      const jj = C.PROD_VAAK[k][n];
      assert.ok(Array.isArray(jj) && jj.length >= 2, k + ' ' + n + ': ' + JSON.stringify(jj));
      assert.equal(new Set(jj).size, jj.length, k + ' ' + n + ': dubbele jaargang');
    }
  }
});
test('een zin over de plek hoort bij de meest specifieke plek, niet bij de langste naam', () => {
  /* De app wist wat een jaargang in een streek deed en niets over de grond eronder. Nu staat er
     per plek één zin uit Wikipedia over de bodem, de helling of de geschiedenis. */
  const cnp = { id: 'a1', type: 'rood', vintage: 2015, region: 'Rhône',
    appellation: 'Châteauneuf-du-Pape', name: 'Châteauneuf-du-Pape', qty: 1 };
  const a = C.achtergrondVan(cnp);
  assert.ok(a && a.zin, 'Châteauneuf-du-Pape heeft een zin');
  assert.ok(a.url.startsWith('https://en.wikipedia.org/wiki/'), 'met een link naar het artikel');
  assert.equal(a.bron, 'Wikipedia');
  /* 'bordeaux' is een langer woord dan 'margaux' en raakt veel meer flessen. Zonder de maat voor
     specificiteit kreeg elke Margaux de algemene zin over de grond van Bordeaux. */
  if (C.ACHTERGROND['margaux'] && C.ACHTERGROND['bordeaux']) {
    const marg = C.achtergrondVan({ id: 'a2', type: 'rood', vintage: 2015, region: 'Bordeaux',
      appellation: 'Margaux', name: 'Château Margaux', qty: 1 });
    assert.equal(marg.plek, 'margaux', 'de specifieke plek wint: ' + (marg && marg.plek));
  }
  /* buiten een bekende streek zegt de app niets */
  assert.equal(C.achtergrondVan({ id: 'a3', type: 'rood', vintage: 2015, region: 'Kosovo', name: 'x', qty: 1 }), null);
  /* elke regel is compleet en verwijst naar een streek die bestaat */
  const sleutels = new Set(C.STREKEN.map(s => s.k));
  for (const kw of Object.keys(C.ACHTERGROND)) {
    const e = C.ACHTERGROND[kw];
    assert.ok(sleutels.has(e.s), kw + ': onbekende streek ' + e.s);
    assert.ok(e.z && e.z.length >= 40, kw + ': te korte zin');
    assert.ok(e.t && e.t.length > 1, kw + ': geen artikeltitel');
    assert.ok(Number.isInteger(e.n) && e.n >= 0, kw + ': geen maat voor specificiteit');
    assert.ok(!/&[a-z]+;|&#\d+;|==/.test(e.z), kw + ': rommel in de zin \u2014 ' + e.z);
  }
});
test('een nieuwe jaargangtabel werkt door in bestaande kelders, maar niet over jouw eigen venster heen', () => {
  /* Wie de app een jaar geleden heeft gevuld, loopt anders achter op alles wat er sindsdien is
     uitgezocht. Alleen een venster dat de app zelf heeft gezet (drinkSrc 'regels') wordt herrekend. */
  const basis = { type: 'rood', vintage: 2005, grapes: ['cabernet sauvignon'],
    region: 'Bordeaux', appellation: 'Pauillac', name: 'Pauillac', qty: 1 };
  C.S.wines = [
    { ...basis, id: 'm1', drinkFrom: 1990, drinkTo: 1995, drinkSrc: 'regels' },
    { ...basis, id: 'm2', drinkFrom: 1990, drinkTo: 1995, drinkSrc: 'eigen' },
    { ...basis, id: 'm3', drinkFrom: 1990, drinkTo: 1995, drinkSrc: 'ai' },
    { ...basis, id: 'm4', drinkFrom: 1990, drinkTo: 1995 },
  ];
  C.S.pairCache = [{ key: 'k', dish: 'lamsbout', at: 1, matches: [], buyTip: null }];
  C.S.settings.tabelVersie = 1;
  const n = C.tabelMigratie();
  assert.equal(n, 1, 'precies één fles herrekend');
  const [a, b, c, d] = C.S.wines;
  const r = C.estimateWindow(basis);
  assert.equal(a.drinkTo, r.to, 'het venster van de regels volgt de nieuwe tabel');
  assert.equal(a.drinkSrc, 'regels', 'en blijft van de regels');
  assert.equal(b.drinkTo, 1995, 'jouw eigen venster blijft staan');
  assert.equal(c.drinkTo, 1995, 'een venster uit de etiketscan blijft staan');
  assert.equal(d.drinkTo, 1995, 'zonder bekende herkomst blijft het staan');
  assert.equal(C.S.settings.tabelVersie, C.TABEL_VERSIE);
  assert.equal(C.S.pairCache.length, 0, 'de opgeslagen spijs-wijncombinaties zijn geschreven tegen de oude tabel');
  assert.equal(C.S.wines.length, 4, 'en er verdwijnt geen enkele fles');
  assert.equal(C.tabelMigratie(), 0, 'een tweede keer draaien doet niets meer');
  C.S.wines = [];
});
test('een producentnaam hoort bij dat huis, niet bij de buren met een langere naam', () => {
  /* In Pomerol staan P\u00e9trus en La Fleur-P\u00e9trus naast elkaar, in Saint-\u00c9milion Pavie,
     Pavie-Macquin en Pavie-Decesse. Dat zijn verschillende huizen. Zonder deze afvanger kreeg een
     fles La Fleur-P\u00e9trus het oordeel over P\u00e9trus: van de 1471 treffers in een catalogus van
     18.675 flessen waren er 390 van dat type. */
  const fles = (producer, jaar) => ({ id: 'p1', type: 'rood', vintage: jaar, producer,
    name: producer, region: 'Bordeaux', appellation: 'Pomerol', qty: 1 });
  const echt = C.genoemdDoor(fles('Petrus', 2009));
  if (echt) {
    assert.equal(echt.naam, 'Petrus');
    assert.equal(C.genoemdDoor(fles('Ch\u00e2teau La Fleur-P\u00e9trus', 2009)), null,
      'La Fleur-P\u00e9trus is een ander huis dan P\u00e9trus');
  }
  /* en een appellation achter de naam mag juist wel: die plaatst de wijn, hij hernoemt hem niet */
  const met = { id: 'p2', type: 'rood', vintage: 2009, producer: 'Petrus',
    name: 'Petrus Pomerol', region: 'Bordeaux', appellation: 'Pomerol', qty: 1 };
  if (echt) assert.ok(C.genoemdDoor(met), 'Petrus Pomerol is nog steeds Petrus');
  /* elke naam in de tabel is lang genoeg om niet overal op te matchen */
  for (const k of Object.keys(C.PRODUCENT)) {
    for (const j of Object.keys(C.PRODUCENT[k])) {
      for (const naam of C.PRODUCENT[k][j]) {
        assert.ok(typeof naam === 'string' && naam.trim().length >= 4, k + ' ' + j + ': ' + naam);
        assert.ok(!/&[a-z]+;|&#\d+;/i.test(naam), k + ' ' + j + ': niet ontsnapte html in ' + naam);
      }
    }
  }
});
test('een gepubliceerde zin zonder niveau claimt ook geen niveau', () => {
  /* De jaargangsgidsen van Decanter leveren 231 streek-jaargangen waar het dossier niets heeft.
     Hun zin wordt getoond, hun cijfer niet: een afleiding uit dat cijfer haalde tegen de bekende
     jaargangen maar 47% precies, en een sterretje zou beweren dat een bron dít niveau draagt. */
  const bourgogne = { id: 'z1', type: 'rood', vintage: 1969, region: 'Bourgogne', appellation: 'Vosne-Romanée', name: 'Vosne', qty: 1 };
  const c = C.citaatVan(bourgogne);
  assert.ok(c && c.tekst, '1969 rode Bourgogne heeft een zin uit de gids');
  assert.equal(c.uitgever, 'Decanter');
  assert.equal(c.geschreven, 2015, 'met het jaar waarin de gids is herzien');
  const o = C.jaargangOordeel(bourgogne);
  assert.ok(!o || !o.woord || o.bron === 0, 'maar geen onderbouwd niveau: ' + JSON.stringify(o));
});
test('een uitspraak over rijpheid telt vanaf het jaar waarin hij is gedaan', () => {
  /* 154 van de Decanter-gidsen zijn voor het laatst herzien in 2015. Hun "Keep" bij een 1997 ging
     over een wijn van achttien jaar, niet over een wijn van negenentwintig. De app rekende dat
     verschil niet en behandelde 25 streek-jaargangen als actueel terwijl ze dat niet waren. */
  const oud = { stand: 0, leeftijd: 18, peiljaar: 2015, jaar: 1997, vers: false,
    bron: 'Decanter', streek: 'Zuid-Afrika', woord: 'nog niet op dronk' };
  assert.equal(C.rijpheidReikt(oud, 12), 30, 'nog niet toe op zijn achttiende plus een plateau van twaalf');
  assert.ok(C.rijpheidReikt(oud, 4) < 2026 - 1997, 'met een kort plateau reikt dezelfde zin niet tot nu');
  const nu = { ...oud, stand: 2, leeftijd: 2026 - 1997, peiljaar: 2026, vers: true, bron: 'Berry Bros & Rudd' };
  assert.ok(C.rijpheidReikt(nu, 12) >= 2026 - 1997, 'een kaart van dit jaar spreekt wel over vandaag');
  /* en de zin zelf noemt het jaartal zodra hij niet van nu is */
  assert.ok(C.rijpheidZin(oud).includes('2015'), 'een oude uitspraak draagt zijn jaartal');
  assert.ok(!C.rijpheidZin(nu).includes('2026'), 'een uitspraak van nu hoeft dat niet');
  assert.ok(C.rijpheidZin(nu).includes('nu'));
  /* elke regel in de tabel draagt een peiljaar en een uitgever */
  for (const k of Object.keys(C.RIJPHEID)) {
    for (const j of Object.keys(C.RIJPHEID[k])) {
      const e = C.RIJPHEID[k][j];
      assert.ok(Number.isInteger(e.s) && e.s >= 0 && e.s <= 4, k + ' ' + j + ': stand klopt niet');
      assert.ok(e.y >= +j && e.y <= C.YR(), k + ' ' + j + ': peiljaar ' + e.y + ' kan niet');
      assert.ok(e.b === 'B' || e.b === 'D', k + ' ' + j + ': geen uitgever');
    }
  }
});
test('de naam van een uitgever staat niet op elke suggestiekaart', () => {
  /* De kaart bij een suggestie toont label en sub. Zet je daar een uitgeversnaam in, dan staat
     "volgens Berry Bros & Rudd" onder elke fles uit een onderzochte streek en leest niemand het
     nog. De naam hoort in bron, en die wordt getoond waar iemand er om vraagt. */
  const claret = { id: 's1', type: 'rood', vintage: 1982, grapes: ['cabernet sauvignon'],
    region: 'Bordeaux', appellation: 'Pauillac', name: 'Pauillac', qty: 1 };
  const r = C.estimateWindow(claret); claret.drinkFrom = r.from; claret.drinkTo = r.to;
  const st = C.windowStatus(claret);
  assert.equal(st.k, 'rijp');
  assert.ok(!/Berry Bros|Decanter/.test(st.sub), 'sub blijft een feit: ' + st.sub);
  assert.ok(/Berry Bros/.test(st.bron), 'de bron staat er wel, apart');
});
test('een citaat is een zin die iets beweert, geen puntenscore en geen wijnnaam', () => {
  /* Dit stond fout in de app: elf citaten toonden Decanters cijfers ("Languedoc 2022 vintage
     rating: 4.5 / 5", "2023 4/5 2022 3/5 ..."). Punten overnemen is precies wat deze app niet
     doet, en via een citaat kwam het er alsnog in. */
  const SCORE = /\d+([.,]\d+)?\s*\/\s*(5|10|20|100)\b|\b\d{2,3}\s*(points?|pts)\b|\brating:?\s*\d/i;
  for (const k of Object.keys(C.CITAAT)) {
    for (const j of Object.keys(C.CITAAT[k])) {
      const zin = C.CITAAT[k][j].t;
      assert.ok(!SCORE.test(zin), k + ' ' + j + ': puntenscore in een citaat \u2014 ' + zin);
      const woorden = zin.match(/[A-Za-z\u00c0-\u024f][A-Za-z\u00c0-\u024f'-]*/g) || [];
      assert.ok(woorden.length >= 5, k + ' ' + j + ': te kort om een bewering te zijn \u2014 ' + zin);
      const hoofd = woorden.filter(w => w[0] === w[0].toUpperCase()).length;
      assert.ok(hoofd / woorden.length <= 0.55, k + ' ' + j + ': leest als een naam \u2014 ' + zin);
      assert.ok((zin.match(/\b(19|20)\d\d\b/g) || []).length <= 2, k + ' ' + j + ': een rij jaartallen \u2014 ' + zin);
    }
  }
});
test('citaten: de juiste bron bij de juiste fles, en niet citeren wie dat niet wil', () => {
  const saut = { id: 'c1', type: 'zoet', vintage: 2023, region: 'Bordeaux', appellation: 'Sauternes', name: 'Sauternes', qty: 1 };
  const c = C.citaatVan(saut);
  assert.ok(c && c.uitgever, 'Sauternes 2023 heeft een vindplaats');
  assert.ok(c.url.startsWith('https://'), 'en een volledige link');
  assert.equal(c.jaar, 2023);
  /* Vinous zet onder elk artikel dat er niets uit gekopieerd mag worden. We noemen ze wel, we
     citeren ze niet: de lezer krijgt de vindplaats en een link naar het stuk zelf. */
  let stilJaar = null;
  for (const j of Object.keys(C.CITAAT.piemonte)) if (C.CITAAT.piemonte[j].u === 'Vinous') { stilJaar = +j; break; }
  assert.ok(stilJaar, 'Piemonte heeft minstens één vindplaats bij Vinous');
  const barolo = { id: 'c2', type: 'rood', vintage: stilJaar, region: 'Piemonte', appellation: 'Barolo', name: 'Barolo', qty: 1 };
  const b = C.citaatVan(barolo);
  assert.equal(b.uitgever, 'Vinous');
  assert.equal(b.tekst, null, 'van Vinous tonen we geen zin');
  assert.ok(b.url.includes('vinous.com'));
  /* en van elke uitgever in CITAAT_STIL wordt nergens een zin getoond */
  for (const k of Object.keys(C.CITAAT)) {
    for (const j of Object.keys(C.CITAAT[k])) {
      if (!C.CITAAT_STIL.includes(C.CITAAT[k][j].u)) continue;
      const w = { id: 'c3', type: 'rood', vintage: +j, region: '', appellation: '', name: '', qty: 1 };
      assert.equal(C.citaatVan({ ...w, ...eersteTrefwoord(k) }).tekst, null, k + ' ' + j + ': deze uitgever wil niet geciteerd worden');
    }
  }
  function eersteTrefwoord(sleutel) {
    const st = C.STREKEN.find(s => s.k === sleutel);
    return { appellation: st.kw[0], type: (st.t && st.t[0]) || 'rood' };
  }
  for (const k of Object.keys(C.CITAAT)) {
    for (const j of Object.keys(C.CITAAT[k])) {
      const e = C.CITAAT[k][j];
      assert.ok(e.u && e.p !== undefined && e.t, k + ' ' + j + ': vindplaats is niet compleet');
      assert.ok(!/winespectator/i.test(e.p), 'Wine Spectator weigert ClaudeBot en hoort er niet in te staan');
    }
  }
  /* zonder jaargang of zonder streek is er niets te citeren */
  assert.equal(C.citaatVan({ id: 'c3', type: 'rood', region: 'Bordeaux', name: 'x' }), null);
  assert.equal(C.citaatVan({ id: 'c4', type: 'rood', vintage: 2018, region: 'Kosovo', name: 'x' }), null);
});
test('vensterMigratie: zet alleen vensters recht die de oude regels zelf hebben bedacht', () => {
  const champ = { id: 'a1', type: 'mousserend', vintage: 2008, grapes: ['chardonnay', 'pinot noir'],
    name: 'Brut Vintage', region: 'Champagne', appellation: 'Champagne', qty: 1 };
  const oud = C.oudVenster(champ);
  const eigen = { id: 'b2', type: 'mousserend', vintage: 2008, grapes: [], name: 'Brut Vintage',
    region: 'Champagne', appellation: 'Champagne', qty: 1, drinkFrom: 2020, drinkTo: 2030 };
  const vast = { id: 'c3', type: 'rood', vintage: 2016, grapes: ['nebbiolo'], name: 'Barolo',
    region: 'Piemonte', qty: 1, drinkFrom: 2022, drinkTo: 2030, drinkSrc: 'eigen' };
  C.S.wines = [{ ...champ, drinkFrom: oud.from, drinkTo: oud.to }, eigen, vast];
  assert.equal(C.vensterMigratie(), 1, 'alleen de fles met een venster uit de oude regels');
  assert.equal(C.S.wines[0].drinkSrc, 'regels');
  assert.ok(C.S.wines[0].drinkTo > oud.to + 10, 'en die krijgt het venster dat hij verdient');
  assert.equal(C.S.wines[1].drinkTo, 2030, 'wat iemand zelf invulde blijft staan');
  assert.equal(C.S.wines[2].drinkTo, 2030, 'en een vastgelegde eigen bron ook');
  assert.equal(C.vensterMigratie(), 0, 'twee keer draaien verandert niets meer');
  C.S.wines = [];
});

/* ================= prijzen en jaargangen ================= */
test('jaargangKloof: zegt hoe groot het gat is en welke kant het op wijst, zonder te rekenen', () => {
  /* het echte geval uit de gedeelde prijstabel: een zoete Jurancon uit 2006 met de prijs van 2020 */
  const w = { name: "Ballet d'Octobre", producer: 'Domaine Cauhape', vintage: 2006, type: 'zoet',
    region: 'Jurancon', country: 'Frankrijk', value: 19.32, valueSrc: 'zoek',
    valueBron: { name: 'wine-searcher.com', vintage: 2020 } };
  const t = C.jaargangKloof(w);
  assert.match(t, /prijs van de 2020/);
  assert.match(t, /14 jaar ouder/);
  /* geen enkel bedrag in de zin: we rekenen het verschil bewust niet uit */
  assert.ok(!/\d+[,.]\d\d/.test(t), 'geen verzonnen bedrag in de uitleg: ' + t);
  /* dezelfde jaargang geeft niets */
  assert.equal(C.jaargangKloof({ ...w, valueBron: { name: 'x', vintage: 2006 } }), '');
  assert.equal(C.jaargangKloof({ ...w, valueBron: null }), '');
});
test('jaargangKloof: noemt het jaargangverschil als de tabel er iets over zegt', () => {
  const w = { name: 'Chateau x', producer: 'x', vintage: 2016, type: 'rood', region: 'Bordeaux',
    appellation: 'Pauillac', value: 90, valueSrc: 'zoek', valueBron: { name: 'x', vintage: 2013 } };
  const t = C.jaargangKloof(w);
  assert.match(t, /sterker jaar/, '2016 Bordeaux is uitzonderlijk, 2013 moeilijk: ' + t);
});
test('waardeBlok: een platte bandbreedte wordt een eerlijke marge, geen nepbereik', () => {
  /* een winkelprijs waarvan low en high gelijk zijn is geen marktbereik */
  const plat = { id: 'p1', name: 'x', producer: 'x', vintage: 2022, type: 'rood', qty: 1,
    value: 41, valueLow: 41, valueHigh: 41, valueSrc: 'zoek', valueBron: { name: 'winepilot.com' } };
  const h = C.waardeBlok(plat);
  assert.ok(!/41.*\u2013.*41|41 tot 41/.test(h), 'geen bereik van 41 tot 41: ' + h);
  /* en nul aan een van de kanten evenmin */
  const nul = { ...plat, id: 'p2', value: 35, valueLow: 0, valueHigh: 0 };
  assert.ok(C.waardeBlok(nul).includes('35'), 'de gevonden prijs blijft staan');
  /* een echte band blijft wel staan */
  const echt = { ...plat, id: 'p3', value: 24, valueLow: 22, valueHigh: 27 };
  assert.ok(C.waardeSub(echt).includes('22'), 'een echte ondergrens blijft: ' + C.waardeSub(echt));
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

/* ================= open detailvenster ververst zichzelf na een prijs (v85) ================= */
test('detail: prijsvak toont bezig en daarna de prijs, ook met een venster open', () => {
  const w = C.schoonWijn({ id: 'w-vers', name: 'Testwijn', producer: 'Test', vintage: 2020, qty: 1 });
  C.S.wines.push(w);
  assert.match(C.waardeBlok(w), /Nog geen prijs met bron/);
  C.prijsBezig.add(w.id);
  assert.match(C.waardeBlok(w), /zoekt de prijs/);
  assert.doesNotMatch(C.plekHtml(w) || '', /data-act="prijsZoek"/, 'geen tweede zoekopdracht voor dezelfde fles');
  /* een open detail: alleen de gemerkte vakken worden herschreven */
  const vak = { dataset: { prijsvak: w.id }, innerHTML: 'oud' }, plek = { dataset: { plekvak: w.id }, innerHTML: 'oud' }, vreemd = { dataset: { prijsvak: 'bestaat-niet' }, innerHTML: 'oud' };
  const oud = ctx.document.querySelectorAll;
  ctx.document.querySelectorAll = sel => sel.includes('prijsvak') ? [vak, vreemd] : [plek];
  try {
    C.prijsBezig.delete(w.id);
    w.value = 42; w.valueSrc = 'zoek'; w.valueBron = { name: 'Gall', url: 'https://www.gall.nl/x' };
    C.versPrijsvakken();
  } finally { ctx.document.querySelectorAll = oud; C.S.wines.pop(); }
  assert.match(vak.innerHTML, /42/);
  assert.match(vak.innerHTML, /Gall/);
  assert.notEqual(plek.innerHTML, 'oud');
  assert.equal(vreemd.innerHTML, 'oud', 'een vak van een fles die er niet meer ligt blijft met rust');
});
