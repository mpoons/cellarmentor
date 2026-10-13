/* Gedeelde opmaak voor de gids en de wijnjarenpagina's.
   Kop, tokens, lettertypen, kop- en voetregel en het meetscript zijn gelijk aan /start/index.html,
   zodat deze pagina's eruitzien als dezelfde site en de meting (lp_view, lp_cta, lp_scroll) op
   dezelfde manier binnenkomt; `pagina` in elke meting is location.pathname.
   Gebruikt door jaargangen/bouw.mjs en gids/bouw.mjs. */
import fs from 'node:fs';
import path from 'node:path';

export const SITE = 'https://cellarmentor.com';

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Lettertypen en tokens: letterlijk die van /start/. */
const FONTS = `@font-face{font-family:'EB Garamond';font-style:italic;font-weight:400 800;font-display:swap;src:url(/fonts/ebgaramond-italic-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:400 800;font-display:swap;src:url(/fonts/ebgaramond-normal-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:400 800;font-display:swap;src:url(/fonts/ebgaramond-normal-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+A720-A7FF}
@font-face{font-family:'Playfair Display';font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/playfair-normal-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Playfair Display';font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/playfair-italic-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`;

const BASIS = `
/* dezelfde tokens als de app (Maison licht, Étiquette donker) */
:root{
  --bg:#F6F2EA; --card:#FFFDF8; --card2:#EFE7D8;
  --ink:#241B1F; --ink2:#6B5A60; --ink3:#9C8D92;
  --line:#E3D9C7; --acc:#6E1F33; --acc-deep:#4F1524; --acc-soft:#F5E8EA; --on-acc:#FFF8F0;
  --gold:#A8813D; --rule:#C8A96A;
  --serif:'Playfair Display','Iowan Old Style',Palatino,Georgia,serif;
  --sc:'EB Garamond','Iowan Old Style',Palatino,Georgia,serif;
  --sans:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
}
@media (prefers-color-scheme: dark){
  :root{ --bg:#1B1418; --card:#271D23; --card2:#31262C; --ink:#E4D9C9; --ink2:#AE9E94; --ink3:#8A767E;
    --line:#3D2F36; --acc:#C9A25A; --acc-deep:#E0BE7A; --acc-soft:#3A2E24; --on-acc:#1B1418; --gold:#C9A25A; --rule:#6E552C; }
}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font:400 17px/1.65 var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.smal{max-width:760px}
.eyebrow{font-family:var(--sc);font-variant:small-caps;text-transform:lowercase;letter-spacing:.16em;color:var(--gold);font-size:17px;font-weight:500}

header{border-bottom:1px solid var(--line)}
header .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
.merk{font-family:var(--sc);font-variant:small-caps;letter-spacing:.12em;font-size:22px;font-weight:500;text-decoration:none;color:var(--ink)}
.kopknop{font-size:14px;font-weight:600;color:var(--acc);text-decoration:none;letter-spacing:.02em}

.kruim{font-size:13.5px;color:var(--ink3);padding-top:22px}
.kruim ol{list-style:none;display:flex;flex-wrap:wrap;gap:4px 8px}
.kruim li+li::before{content:'›';margin-right:8px;color:var(--rule)}
.kruim a{color:var(--ink3);text-decoration:none}
.kruim a:hover{text-decoration:underline}

.kop{padding:26px 0 8px}
h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,8.4vw,54px);line-height:1.08;letter-spacing:-.01em;margin:10px 0 16px;overflow-wrap:break-word;hyphens:auto}
h1 em{font-style:italic}
.sub{font-size:clamp(17px,4.4vw,20px);color:var(--ink2);line-height:1.55}
.meta{font-family:var(--sc);font-style:italic;color:var(--ink3);font-size:15.5px;margin-top:16px}

.tekst{padding:8px 0 24px}
.tekst h2{font-family:var(--serif);font-weight:500;font-size:clamp(26px,6vw,34px);line-height:1.15;letter-spacing:-.005em;margin:46px 0 12px;padding-top:26px;border-top:1px solid var(--line)}
.tekst h3{font-family:var(--serif);font-weight:500;font-size:21px;line-height:1.3;margin:28px 0 8px}
.tekst p{margin:0 0 14px}
.tekst p.zacht{color:var(--ink2);font-size:15.5px}
.tekst a{text-decoration:underline;text-decoration-color:var(--rule);text-underline-offset:3px}
.tekst a:hover{color:var(--acc)}
.tekst ul,.tekst ol{margin:4px 0 18px;padding:0}
.tekst ul{list-style:none}
.tekst ul li{position:relative;padding:7px 0 7px 22px;border-top:1px solid var(--line)}
.tekst ul li:last-child{border-bottom:1px solid var(--line)}
.tekst ul li::before{content:'';position:absolute;left:2px;top:17px;width:7px;height:7px;border:1px solid var(--acc);transform:rotate(45deg)}
.tekst ol{padding-left:24px}
.tekst ol li{padding:4px 0 4px 4px}
.tekst ol li::marker{font-family:var(--serif);color:var(--gold)}
.tekst b,.tekst strong{font-weight:600}

/* een tabel met haarlijnen, zonder kader */
.tabel{width:100%;border-collapse:collapse;margin:8px 0 22px;font-size:15.5px}
.tabel th{font-family:var(--sc);font-variant:small-caps;text-transform:lowercase;letter-spacing:.12em;font-weight:500;color:var(--gold);text-align:left;padding:8px 10px 8px 0;border-bottom:1px solid var(--rule);font-size:16px;vertical-align:bottom}
.tabel td{padding:10px 10px 10px 0;border-bottom:1px solid var(--line);vertical-align:top}
.tabel td:last-child,.tabel th:last-child{padding-right:0}
.tnum{font-variant-numeric:tabular-nums}

.kader{background:var(--card);border:1px solid var(--line);outline:1px solid var(--rule);outline-offset:-6px;padding:24px 22px;margin:30px 0;border-radius:2px}
.kader .eyebrow{margin-bottom:4px}
.kader p{color:var(--ink2);margin:0 0 4px}
.kader .cta{margin-top:16px}

.cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--acc);color:var(--on-acc);text-decoration:none;
  font-weight:600;font-size:15px;letter-spacing:.08em;text-transform:uppercase;padding:17px 28px;border-radius:4px;margin-top:28px;min-height:54px;
  transition:background .2s ease}
.cta:hover{background:var(--acc-deep)}
.cta svg{flex:none}
.tweede{display:inline-block;margin:16px 0 0 2px;color:var(--ink);font-size:15px;text-decoration:underline;text-decoration-color:var(--rule);text-underline-offset:4px}
.ctarij{display:flex;flex-wrap:wrap;align-items:center;column-gap:24px}

.verder{padding:40px 0 8px;border-top:1px solid var(--line);margin-top:24px}
.verder ul{list-style:none;margin-top:10px}
.verder li{border-top:1px solid var(--line)}
.verder li:last-child{border-bottom:1px solid var(--line)}
.verder a{display:block;padding:14px 0;text-decoration:none;font-family:var(--serif);font-size:19px;line-height:1.3}
.verder a:hover{color:var(--acc)}
.verder a span{display:block;font-family:var(--sans);font-size:14.5px;color:var(--ink2);margin-top:2px}

.slot{padding:72px 0 84px;text-align:center;border-top:1px solid var(--line);margin-top:40px}
.slot h2{font-family:var(--serif);font-weight:500;font-size:clamp(30px,7vw,44px);line-height:1.1;margin:12px auto 8px;max-width:640px}
.slot h2 em{font-style:italic}
.slot p{color:var(--ink2)}
.slot .ctarij{justify-content:center}
footer{border-top:1px solid var(--line);padding:30px 0 calc(30px + env(safe-area-inset-bottom));font-size:13.5px;color:var(--ink3)}
footer .wrap{display:flex;flex-wrap:wrap;gap:10px 22px;justify-content:space-between}
footer a{color:var(--ink3)}

@media (min-width:900px){
  body{font-size:18px}
  .kop{padding:40px 0 12px}
  h1{font-size:clamp(46px,4.8vw,58px)}
}
@media (prefers-reduced-motion: reduce){ html{scroll-behavior:auto} }
`;

/* Het meetscript van /start/, ongewijzigd. Op deze pagina's bestaat geen .hero of #plak, dus het
   laatste blok doet niets; het staat er zodat het script letterlijk gelijk blijft. */
const METING = `<script>
/* Meting, gelijk aan de app (zie cellarmentor.html, "Meting"): een willekeurige id per apparaat en de
   eerste herkomst in localStorage, gedeeld met de app op hetzelfde domein. Geen cookies, geen derden. */
(function(){
  var aan = location.hostname === 'cellarmentor.com';
  var SB = 'https://dbzgrkipcoebglacsqwe.supabase.co', KEY = 'sb_publishable_Qvrq6CS6M-CPY5nwQ6suAw_lkpwYrYR';
  function aid(){ try{ var a = localStorage.getItem('caveau_aid'); if(!a || !/^[A-Za-z0-9_-]{6,64}$/.test(a)){ a = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[^A-Za-z0-9]/g,'').slice(0,32); localStorage.setItem('caveau_aid', a); } return a; }catch(e){ return null; } }
  function herkomst(){
    try{ var h = JSON.parse(localStorage.getItem('caveau_herkomst') || 'null'); if(h) return h; }catch(e){}
    var q = new URLSearchParams(location.search), k = function(v, n){ return v ? String(v).slice(0, n) : null; }, ref = null;
    try{ ref = document.referrer ? new URL(document.referrer).hostname : null; }catch(e){}
    if(ref === location.hostname) ref = null;
    var h2 = { src:k(q.get('utm_source') || q.get('via'), 80), med:k(q.get('utm_medium'), 80), cmp:k(q.get('utm_campaign'), 80), inh:k(q.get('utm_content'), 80), ref:k(ref, 200), page:k(location.pathname, 120), at:Date.now() };
    try{ localStorage.setItem('caveau_herkomst', JSON.stringify(h2)); }catch(e){}
    return h2;
  }
  function meet(naam, props){
    if(!aan) return;
    try{
      var h = herkomst();
      var rij = { aid:aid(), name:naam, props:Object.assign({ pagina:location.pathname, breed:innerWidth >= 900 }, props || {}), src:h.src, med:h.med, cmp:h.cmp, inh:h.inh, ref:h.ref, page:h.page };
      fetch(SB + '/rest/v1/events', { method:'POST', keepalive:true, headers:{ apikey:KEY, 'content-type':'application/json', prefer:'return=minimal' }, body:JSON.stringify([rij]) }).catch(function(){});
    }catch(e){}
  }
  herkomst(); meet('lp_view');
  document.addEventListener('click', function(e){ var a = e.target.closest('[data-cta]'); if(a) meet('lp_cta', { plek:a.getAttribute('data-cta') }); });
  var diep = false; addEventListener('scroll', function(){ if(!diep && scrollY > document.body.scrollHeight * .6){ diep = true; meet('lp_scroll'); } }, { passive:true });
  /* plakknop: pas zichtbaar als de knop in de hero uit beeld is */
  var plak = document.getElementById('plak'), hero = document.querySelector('.hero .cta');
  if('IntersectionObserver' in window && plak && hero){
    new IntersectionObserver(function(es){ var uit = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; plak.classList.toggle('aan', uit); plak.setAttribute('aria-hidden', uit ? 'false' : 'true'); plak.querySelector('a').tabIndex = uit ? 0 : -1; }).observe(hero);
  }
})();
</script>`;

const CAMERA = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1l1.4-2h6.2L16.5 6h1A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z"/><circle cx="12" cy="12" r="3.4"/></svg>`;

/* De twee knoppen die op elke pagina staan. `plek` komt als data-cta in de meting. */
export const knoppen = plek => `<div class="ctarij">
      <a class="cta" href="/?taal=nl" data-cta="${esc(plek)}">${CAMERA}Scan je eerste fles</a>
      <a class="tweede" href="/?taal=nl&amp;demo=1" data-cta="${esc(plek)}-demo">Bekijk een voorbeeldkelder</a>
    </div>`;

export const kader = (plek, kop, tekst) => `<aside class="kader">
    <div class="eyebrow">${kop}</div>
    <p>${tekst}</p>
    ${knoppen(plek)}
  </aside>`;

export const slot = (kop, tekst) => `<section class="slot"><div class="wrap">
  <div class="eyebrow">Vanavond</div>
  <h2>${kop}</h2>
  <p>${tekst}</p>
  ${knoppen('slot')}
</div></section>`;

export const kruimpad = stappen => `<nav class="kruim" aria-label="Kruimelpad"><ol>${stappen.map((s, i) =>
  i === stappen.length - 1 ? `<li aria-current="page">${esc(s.naam)}</li>` : `<li><a href="${esc(s.pad)}">${esc(s.naam)}</a></li>`).join('')}</ol></nav>`;

export const breadcrumbLd = stappen => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: stappen.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.naam, item: SITE + s.pad }))
});

/* Een hele pagina. `pad` is het absolute pad met slash aan het eind, zoals /gids/drinkvenster/. */
export function pagina({ pad, titel, beschrijving, ogType = 'article', ld = [], css = '', inhoud }){
  if(titel.length > 60) throw new Error(`titel te lang (${titel.length}): ${titel}`);
  if(beschrijving.length > 155) throw new Error(`beschrijving te lang (${beschrijving.length}): ${beschrijving}`);
  const url = SITE + pad;
  const ldHtml = ld.map(o => `<script type="application/ld+json">\n${JSON.stringify(o).replace(/</g, '\\u003c')}\n</script>`).join('\n');
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src https://dbzgrkipcoebglacsqwe.supabase.co; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#F6F2EA" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1B1418" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${esc(ogType)}">
<meta property="og:site_name" content="CellarMentor">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschrijving)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="nl_NL">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/playfair-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
${ldHtml}
<style>
${FONTS}
${BASIS}${css}
</style>
</head>
<body>

<header><div class="wrap">
  <a class="merk" href="/start/">CellarMentor</a>
  <a class="kopknop" href="/?taal=nl" data-cta="kop">Open de app</a>
</div></header>

<main>
${inhoud}
</main>

<footer><div class="wrap">
  <span>CellarMentor is een dienst van Ponsen Polutropon B.V., Amsterdam · KvK 77838335</span>
  <span><a href="/gids/">Gids</a> · <a href="/jaargangen/">Wijnjaren</a> · <a href="/#voorwaarden">Voorwaarden</a> · <a href="/#privacy">Privacy</a> · Geniet, maar drink met mate</span>
</div></footer>

${METING}
</body>
</html>
`;
}

export function schrijf(bestand, html){
  fs.mkdirSync(path.dirname(bestand), { recursive: true });
  fs.writeFileSync(bestand, html);
}

/* Het sitemapvoorstel: alle pagina's onder /gids/ en /jaargangen/ die op schijf staan, plus / en /start/.
   Komt in gids/sitemap-voorstel.xml; de wortel is niet van deze scripts. */
export function schrijfSitemap(root, datum){
  const paden = ['/', '/start/'];
  for(const map of ['gids', 'jaargangen']){
    const basis = path.join(root, map);
    if(fs.existsSync(path.join(basis, 'index.html'))) paden.push(`/${map}/`);
    if(!fs.existsSync(basis)) continue;
    for(const d of fs.readdirSync(basis, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()){
      if(fs.existsSync(path.join(basis, d, 'index.html'))) paden.push(`/${map}/${d}/`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Voorstel: hoort als /sitemap.xml op de wortel, met een regel "Sitemap: https://cellarmentor.com/sitemap.xml" in /robots.txt.
     Geschreven door jaargangen/bouw.mjs en gids/bouw.mjs. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paden.map(p => `  <url><loc>${SITE}${p}</loc><lastmod>${datum}</lastmod></url>`).join('\n')}
</urlset>
`;
  schrijf(path.join(root, 'gids', 'sitemap-voorstel.xml'), xml);
  return paden.length;
}
