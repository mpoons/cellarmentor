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
const C = vm.runInContext('({ S, schoonWijn, schoonHist, schoonLoc, schoonDoc, eigenSleutel, matchWine, foodCats, windowStatus, estimateWindow, prijsSleutel, creditCost, krimpErgens, syncBesluit, schrijfState, toonAccountWenk, ACCOUNT_WENK_BIJ, DB_KEY, YR, uid })', ctx);

/* de servertegenhangers, uit de TypeScript-bron geplukt zodat drift tussen client en server opvalt */
const serverBron = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'ai', 'index.ts'), 'utf8');
function serverFn(naam) {
  const m = serverBron.match(new RegExp(`function ${naam}\\([\\s\\S]*?\\n}`));
  assert.ok(m, `server heeft een functie ${naam}`);
  const js = m[0].replace(/\(w: Wijn\): string/, '(w)').replace(/\(x: unknown\)/g, '(x)').replace(/\(kind: string, images: number\): number/, '(kind, images)');
  return vm.runInContext(`(${js})`, ctx);
}

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
  ]) assert.equal(C.prijsSleutel(w), server(w), JSON.stringify(w));
  assert.equal(C.prijsSleutel({ name: 'Brut', producer: 'X', vintage: null }), 'x|brut|nv');
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

test('schoonWijn: de bron van het drinkvenster is ai, regels of eigen, anders niets', () => {
  assert.equal(C.schoonWijn({ name: 'x', vensterBron: 'regels' }).vensterBron, 'regels');
  assert.equal(C.schoonWijn({ name: 'x', vensterBron: 'ai' }).vensterBron, 'ai');
  assert.equal(C.schoonWijn({ name: 'x', vensterBron: 'hack' }).vensterBron, undefined);
  assert.equal(C.schoonWijn({ name: 'x' }).vensterBron, undefined);   /* een fles van vóór dit veld blijft zonder bron */
});

test('accountwenk: alleen zonder account, vanaf de drempel, en niet na wegklikken', () => {
  const n = C.ACCOUNT_WENK_BIJ;
  assert.equal(C.toonAccountWenk(n, false, true), true);
  assert.equal(C.toonAccountWenk(n - 1, false, true), false);
  assert.equal(C.toonAccountWenk(n, true, true), false);
  assert.equal(C.toonAccountWenk(n + 50, false, false), false);
  assert.equal(C.toonAccountWenk(n, undefined, true), true);   /* een oude instellingenset zonder de vlag */
});
