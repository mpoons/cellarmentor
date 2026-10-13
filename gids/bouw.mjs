#!/usr/bin/env node
/* Bouwt /gids/: de hub en vier artikelen.

   node gids/bouw.mjs

   De tekst staat hieronder. Elk getal over een drinkvenster komt uit de rekenregels van de app
   (jaargangen/app.mjs knipt ze uit cellarmentor.html), zodat een artikel niet iets anders beweert dan
   de app zelf doet. Verandert een regel of de jaargangtabel, draai dit dan opnieuw.

   Schrijfregels (CLAUDE.md, "Schrijfstijl"): geen gedachtestreepjes, geen "niet X, maar Y", korte
   alinea's, en een feit van buiten krijgt een link. Getalbereiken zoals 8–13 °C mogen een streepje. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { laadApp } from '../jaargangen/app.mjs';
import { pagina, schrijf, esc, kader, slot, kruimpad, breadcrumbLd, schrijfSitemap, SITE } from '../jaargangen/sjabloon.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HIER, '..');
const APP = laadApp(ROOT);
const DATUM_PUB = '2026-10-13';
const DATUM_NL = '13 oktober 2026';
const NU = new Date().getFullYear();

/* venster van een fles volgens de app: "2022–2047" */
const vw = w => { const r = APP.estimateWindow(w); return `${r.from}–${r.to}`; };
/* typische periode in jaren na de oogst, voor een jaar zonder oordeel (factor 1) */
const duur = w => { const v = 1900, r = APP.estimateWindow({ ...w, vintage: v }); return { van: r.from - v, tot: r.to - v, soort: r.soort }; };
const woord = (w) => { const o = APP.jaargangOordeel(w); return o && o.woord ? o.woord : null; };

/* ---------- bronnen van buiten ---------- */
const BRON = {
  decanterWaar: 'https://www.decanter.com/learn/advice/where-should-i-store-my-wine-51418/',
  decanterVideo: 'https://www.decanter.com/learn/how-to/how-to-store-wine-video-tutorial-54233',
  ctExport: 'https://support.cellartracker.com/article/29-exporting-data',
  invintoryVivino: 'https://help.invintory.com/en/articles/16591126-how-to-import-from-vivino',
  apPortabiliteit: 'https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacyrechten-avg/recht-op-gegevens-overdragen-dataportabiliteit',
};
const ext = (url, tekst) => `<a href="${url}" rel="noopener">${tekst}</a>`;

/* ---------- voorbeeldflessen ---------- */
const barolo = j => ({ type:'rood', appellation:'Barolo', grapes:['nebbiolo'], vintage:j });
const medoc = j => ({ type:'rood', appellation:'Haut-Médoc', grapes:['cabernet sauvignon', 'merlot'], vintage:j });
const champ = j => ({ type:'mousserend', appellation:'Champagne', grapes:['chardonnay', 'pinot noir'], vintage:j });
const sancerre = j => ({ type:'wit', appellation:'Sancerre', grapes:['sauvignon blanc'], vintage:j });
const vport = j => ({ type:'versterkt', appellation:'Porto', name:'Vintage Port', vintage:j });
const saintJulien = j => ({ type:'rood', appellation:'Saint-Julien', name:'Grand Cru Classé', grapes:['cabernet sauvignon', 'merlot'], vintage:j });

/* De soorten uit vensterBasis, met voorbeelden. Het getal komt uit de app; de voorbeelden zijn zo gekozen
   dat de app ze ook echt in die soort plaatst (gecontroleerd hieronder). */
const SOORTEN = [
  { groep:'Rood', rijen:[
    ['Lichte rode wijn', 'Beaujolais, pinot noir, zweigelt, mencía', { type:'rood', appellation:'Beaujolais', grapes:['gamay'] }],
    ['Rode wijn voor elke dag', 'merlot, grenache, de meeste rode wijn zonder grote naam', { type:'rood', appellation:'Bordeaux', grapes:['merlot'] }],
    ['Rode wijn van een stevige druif', 'cabernet sauvignon, syrah, malbec, Rioja crianza', { type:'rood', appellation:'Rioja Crianza', grapes:['tempranillo'] }],
    ['Rode wijn met een classificatie', 'Chianti Classico Riserva, Volnay premier cru', { type:'rood', appellation:'Chianti Classico Riserva', grapes:['sangiovese'] }],
    ['Rode wijn uit een streek die rijpt', 'Barolo, Brunello, Médoc, Hermitage, Châteauneuf-du-Pape, Ribera del Duero', { type:'rood', appellation:'Barolo', grapes:['nebbiolo'] }],
    ['Grote bewaarwijn', 'geklasseerde Bordeaux, Barolo riserva, Rioja gran reserva, grand cru uit de Bourgogne', { type:'rood', appellation:'Pauillac', name:'Grand Cru Classé' }],
  ]},
  { groep:'Wit', rijen:[
    ['Witte wijn voor de eerste jaren', 'sauvignon blanc, pinot grigio, muscadet', { type:'wit', appellation:'Sancerre', grapes:['sauvignon blanc'] }],
    ['Witte wijn van een druif die rijpt', 'riesling, chenin blanc, chardonnay, albariño, grüner veltliner', { type:'wit', appellation:'Alsace', grapes:['riesling'] }],
    ['Witte wijn uit een streek die rijpt', 'Meursault, Chablis premier cru, Savennières, Vouvray, riesling uit de Moezel', { type:'wit', appellation:'Meursault', grapes:['chardonnay'] }],
  ]},
  { groep:'Rosé, oranje en jong', rijen:[
    ['Wijn voor de eerste jeugd', 'Beaujolais Nouveau, vinho verde, moscato d’Asti', { type:'rood', name:'Beaujolais Nouveau', grapes:['gamay'] }],
    ['Rosé', 'de meeste rosé, zoals Côtes de Provence', { type:'rose', appellation:'Côtes de Provence' }],
    ['Rosé om te bewaren', 'Bandol, Tavel', { type:'rose', appellation:'Bandol' }],
    ['Oranjewijn', 'witte druiven die op de schil vergist zijn', { type:'oranje' }],
  ]},
  { groep:'Mousserend', rijen:[
    ['Lichte mousserende wijn', 'prosecco', { type:'mousserend', name:'Prosecco' }],
    ['Cava, crémant of sekt met jaartal', 'crémant de Loire, cava', { type:'mousserend', name:'Crémant de Loire' }],
    ['Traditionele methode met jaartal', 'Franciacorta, blanc de blancs van buiten de Champagne', { type:'mousserend', name:'Franciacorta' }],
    ['Vintage champagne', 'champagne met een jaartal', { type:'mousserend', appellation:'Champagne' }],
    ['Vintage champagne, blanc de blancs', 'alleen chardonnay', { type:'mousserend', appellation:'Champagne', name:'Blanc de Blancs' }],
    ['Prestige cuvée', 'de topcuvée van een champagnehuis', { type:'mousserend', appellation:'Champagne', name:'Cuvée Prestige' }],
  ]},
  { groep:'Zoet', rijen:[
    ['Zoete wijn', 'zoete muscat, moscatel', { type:'zoet', name:'Moscatel' }],
    ['Zoete wijn van een druif die rijpt', 'Vouvray moelleux, zoete chenin, furmint', { type:'zoet', name:'Vouvray Moelleux', grapes:['chenin blanc'] }],
    ['Riesling met restzoet', 'Kabinett, Spätlese', { type:'zoet', name:'Riesling Spätlese' }],
    ['Edelzoete wijn', 'Sauternes, Tokaji aszú, Trockenbeerenauslese, Quarts de Chaume', { type:'zoet', appellation:'Sauternes' }],
  ]},
  { groep:'Versterkt', rijen:[
    ['Fino en manzanilla', 'hoe verser hoe beter', { type:'versterkt', name:'Manzanilla' }],
    ['Tawny en ruby', 'klaar bij het bottelen', { type:'versterkt', name:'Tawny Port' }],
    ['LBV-port', 'late bottled vintage', { type:'versterkt', name:'LBV Port' }],
    ['Vintage port', 'alleen uit gedeclareerde jaren', { type:'versterkt', name:'Vintage Port' }],
    ['Sherry uit het vat', 'amontillado, oloroso', { type:'versterkt', name:'Oloroso' }],
    ['Versterkte zoete wijn', 'Banyuls, Maury', { type:'versterkt', name:'Maury' }],
  ]},
];
const soortTabellen = () => SOORTEN.map(g => `<h3>${esc(g.groep)}</h3>
<table class="tabel"><thead><tr><th scope="col">Soort</th><th scope="col">Voorbeelden</th><th scope="col" class="r">Jaren na de oogst</th></tr></thead><tbody>
${g.rijen.map(([naam, vb, w]) => { const d = duur(w); return `<tr><td>${esc(naam)}</td><td class="zacht">${esc(vb)}</td><td class="r tnum">${d.van}–${d.tot}</td></tr>`; }).join('\n')}
</tbody></table>`).join('\n');
/* controle: de voorbeelden vallen in de soort die de tabel noemt */
for(const g of SOORTEN) for(const [naam, , w] of g.rijen){
  const s = duur(w).soort.toLowerCase(), n = naam.toLowerCase();
  const sleutel = { 'rode wijn voor elke dag':'rode wijn', 'wijn voor de eerste jeugd':'eerste jeugd', 'rosé':'rosé voor het jaar erop', 'grote bewaarwijn':'grote bewaarwijn',
    'cava, crémant of sekt met jaartal':'cava, crémant of sekt', 'traditionele methode met jaartal':'traditionele methode', 'prestige cuvée':'prestige cuvée',
    'riesling met restzoet':'restzoete riesling', 'fino en manzanilla':'fino of manzanilla', 'tawny en ruby':'tawny of ruby', 'versterkte zoete wijn':'versterkte zoete wijn' }[n] || n;
  if(!s.includes(sleutel)) throw new Error(`voorbeeld voor "${naam}" valt in de app onder "${s}"`);
}
const madeiraDak = duur({ type:'versterkt', name:'Madeira Malmsey' }).tot;
const champNV = (() => { const r = APP.estimateWindow({ type:'mousserend', appellation:'Champagne', vintage:null, addedAt: Date.UTC(2026, 0, 1) }); return r.to - r.from; })();

/* ---------- de artikelen ---------- */
const ARTIKELEN = [
{
  slug:'drinkvenster',
  titel:'Wanneer is wijn op dronk? Zo werkt een drinkvenster',
  h1:'Wanneer is een wijn <em>op dronk?</em> Zo werkt een drinkvenster',
  kruim:'Wanneer is wijn op dronk',
  beschrijving:'Een drinkvenster zegt van welk tot welk jaar een wijn op z’n best is. Zo lees je het, zo komt het tot stand en zo weet je of jouw fles op dronk is.',
  lijstTekst:'Wat “op dronk” betekent, waar een drinkvenster vandaan komt en wat de jaargang ermee doet.',
  lede:'Een fles is op dronk als hij laat zien wat hij in zich heeft. Een drinkvenster zegt van welk tot welk jaar dat zo is. Hier lees je hoe zo’n venster tot stand komt, wat de jaargang ermee doet en hoe je bij je eigen fles nagaat of hij open kan.',
  body: () => `
<h2>Wat betekent “op dronk”?</h2>
<p>Op dronk is het moment waarop een wijn klaar is om gedronken te worden. Het fruit is er nog, tannine en zuur zijn in balans, en wat er met de jaren bij is gekomen voegt iets toe. Bij een jonge, frisse wijn is dat moment er meteen. Bij een wijn die gemaakt is om te rijpen kan het jaren duren.</p>
<p>De meeste wijn in de winkel is gemaakt om binnen een paar jaar te drinken. Een sauvignon blanc, een rosé of een lichte rode wordt met de jaren niet beter. Bewaren is iets voor wijn met genoeg zuur, tannine, suiker of concentratie om de tijd te overbruggen, zoals Barolo, goede Bordeaux, riesling, vintage port en edelzoete wijn.</p>

<h2>Wat is een drinkvenster?</h2>
<p>Een drinkvenster is een periode, meestal geschreven als twee jaartallen, bijvoorbeeld ${esc(vw(barolo(2016)))}. Het eerste jaar is het moment waarop de wijn open begint te gaan. Het tweede is het jaar tot waar hij op z’n best blijft.</p>
<p>Daartussen verandert de wijn. Jong is hij strakker en fruitiger. Later wordt hij zachter, en komen er tonen bij als leer, paddenstoel en gedroogd fruit, of bij witte wijn honing en noten. Welke fase je het mooist vindt, is smaak. Daarom is een venster breed en geen datum.</p>
<p>Een venster is een aanbeveling en geen houdbaarheidsdatum. Een fles gaat niet op 1 januari na het laatste jaar ineens achteruit. Wel wordt de kans groter dat hij over z’n hoogtepunt is.</p>

<h2>Waar komt een drinkvenster vandaan?</h2>
<p>Er zijn drie gebruikelijke bronnen, en ze vullen elkaar aan.</p>
<ul>
<li><b>De maker of de wijnhandel.</b> Veel producenten en handelaren zetten een advies op hun website, in hun catalogus of op het achteretiket. Zij kennen de wijn het best. Het advies is wel geschreven toen de wijn jong was.</li>
<li><b>Critici en vakbladen.</b> Bij een proefnotitie hoort vaak een venster. Dat gaat over die ene wijn, geproefd op één moment, en het kan bij een latere proeverij opschuiven.</li>
<li><b>Vuistregels.</b> Heb je geen advies voor je eigen fles, dan kom je ver met wat je weet over de soort wijn, de streek en het jaar. Daar rekent CellarMentor mee, en <a href="/gids/hoe-lang-wijn-bewaren/">hoe lang kun je wijn bewaren</a> zet die regels per soort op een rij.</li>
</ul>
<p>Een venster dat bij de oogst is opgesteld, is een voorspelling. Wie later proeft, ziet hoe de wijn zich echt ontwikkelt. Een advies van tien jaar geleden mag je dus met een korrel zout nemen, in beide richtingen.</p>

<h2>Wat doet de jaargang met het venster?</h2>
<p>Twee flessen van dezelfde wijn uit verschillende jaren kunnen een heel ander venster hebben. In een jaar waarin de druiven gezond en goed rijp binnenkomen, is de wijn vaak geconcentreerder: hij heeft meer tijd nodig en gaat langer mee. Een jaar met hagel, rot of een natte oogst geeft meestal lichtere wijn, die eerder op dronk is en korter meegaat.</p>
<p>Een voorbeeld uit de rekenregels van CellarMentor. Een Barolo uit 2016, in de tabel een ${esc(woord(barolo(2016)))} jaar, krijgt ${esc(vw(barolo(2016)))}. Een Barolo uit 2014, een ${esc(woord(barolo(2014)))} jaar, krijgt ${esc(vw(barolo(2014)))}. En een uit 2002, een ${esc(woord(barolo(2002)))} jaar, krijgt ${esc(vw(barolo(2002)))}. Dezelfde soort wijn, drie heel verschillende antwoorden.</p>
<p>Per streek staat het oordeel voor elk jaar in de <a href="/jaargangen/">wijnjarentabel</a>, bijvoorbeeld voor <a href="/jaargangen/piemonte/">Piemonte</a>, <a href="/jaargangen/bordeaux/">Bordeaux</a> en <a href="/jaargangen/champagne/">Champagne</a>. Bij elk jaar staat of dat oordeel tegen bronnen is gelegd of nog een eigen schatting is.</p>
<p>Een jaargangoordeel geldt voor een streek, niet voor één producent. Een goede maker haalt in een moeilijk jaar meer uit zijn druiven dan een slordige in een groot jaar.</p>

${kader('artikel', 'Je eigen flessen', 'Scan het etiket en CellarMentor rekent het venster uit soort, streek en jaargang, en laat zien waar het vandaan komt. Gratis, in je browser.')}

<h2>Hoe weet je of jouw fles op dronk is?</h2>
<ol>
<li><b>Zoek uit wat voor wijn het is.</b> Soort, streek, jaargang, en of er een classificatie op staat, zoals premier cru, riserva of gran reserva. Dat bepaalt de orde van grootte.</li>
<li><b>Kijk of de maker een advies geeft.</b> Op de website of het achteretiket staat soms een venster. Dat is een goed begin.</li>
<li><b>Leg het jaar ernaast.</b> Een groot jaar schuift alles op, een moeilijk jaar maakt het korter.</li>
<li><b>Denk aan hoe de fles heeft gelegen.</b> Koel, donker en rustig houdt een wijn langer goed. Een warme kast maakt de rijping sneller. Meer daarover in <a href="/gids/wijn-bewaren-thuis/">wijn bewaren thuis</a>.</li>
<li><b>Heb je meer flessen van dezelfde wijn, open er dan één.</b> Dat is de betrouwbaarste test die er is. Proeft hij nog strak en gesloten, dan wacht je met de rest.</li>
</ol>
<p>Twijfel je tussen te vroeg en te laat, kies dan voor te vroeg. Een fles die wat jong opengaat, is nog steeds een goede wijn. Wat over z’n hoogtepunt is, komt niet meer terug.</p>

<h2>Is een wijn na zijn drinkvenster slecht?</h2>
<p>Niet per se. Een venster is een schatting, en veel wijnen houden het langer vol dan op papier staat, zeker uit grote jaren en uit een goede kelder.</p>
<p>Tekenen dat een fles over z’n hoogtepunt is: rode wijn die aan de rand bruin is geworden en vlak smaakt, zonder fruit. Witte wijn die donker amber kleurt en naar bruine appel of sherry ruikt, bij een wijn waar dat niet bij hoort.</p>
<p>Een muffe lucht van natte kranten of een vochtige kelder is iets anders. Dat is meestal een kurkfout, en die heeft met leeftijd niets te maken.</p>

<h2>Hoe CellarMentor het drinkvenster rekent</h2>
<p>In CellarMentor krijgt elke fles een venster uit drie dingen: de soort wijn, de streek en de jaargang. De soort bepaalt de basis, van een paar jaar voor een rosé tot tientallen jaren voor vintage port. Daarna weegt het jaar mee: een uitzonderlijk jaar rekt de bewaartijd met een kwart en begint later, een moeilijk jaar maakt hem ongeveer een derde korter.</p>
<p>Een geklasseerde Saint-Julien uit 2016 komt zo op ${esc(vw(saintJulien(2016)))}. Een vintage champagne uit 2008 op ${esc(vw(champ(2008)))}, en een uit 2021, in de Champagne een ${esc(woord(champ(2021)))} jaar, op ${esc(vw(champ(2021)))}.</p>
<p>Bij elke fles staat een stand: Nog te jong, Op dronk, Drink binnenkort, Op z’n rijpst of Over de piek?. Na het einde van het venster komt eerst Op z’n rijpst: de fles mag open en er is niets mis. Pas later verschijnt het vraagteken.</p>
<p>Onder “Waar komt dit venster vandaan?” zie je de soort fles, het oordeel over de jaargang en of dat oordeel tegen bronnen is gelegd. Weet je het beter, bijvoorbeeld omdat de maker iets anders zegt, dan zet je het venster zelf. Dat laat de app staan.</p>
`,
},
{
  slug:'hoe-lang-wijn-bewaren',
  titel:'Hoe lang kun je wijn bewaren? Per soort, met voorbeelden',
  h1:'Hoe lang kun je wijn bewaren? <em>Per soort, met voorbeelden</em>',
  kruim:'Hoe lang kun je wijn bewaren',
  beschrijving:'Van rosé tot vintage port: per soort wijn hoe lang hij goed blijft, met voorbeelden, en wat jaargang en bewaarplek eraan veranderen.',
  lijstTekst:'Per soort wijn een typische bewaartijd, met voorbeelden en het effect van jaargang en bewaarplek.',
  lede:'Van een paar maanden tot een halve eeuw: hoe lang een wijn goed blijft, hangt vooral af van wat voor wijn het is. Hieronder per soort de vuistregels die CellarMentor gebruikt, met voorbeelden, en wat jaargang en bewaarplek eraan veranderen.',
  body: () => `
<h2>Het korte antwoord</h2>
<p>De meeste wijn is gemaakt om binnen een paar jaar te drinken. Rosé, lichte witte wijn en de meeste mousserende wijn zonder jaartal zijn op hun best in de eerste jaren na de oogst.</p>
<p>Stevige rode wijn uit een klassieke streek, goede riesling, vintage champagne, edelzoete wijn en vintage port kunnen tientallen jaren mee. Veel wijn zit daartussen, met een bewaartijd van ergens tussen de vijf en vijftien jaar.</p>
<p>Gaat het om een geopende fles? Die staat onderaan.</p>

<h2>Hoe lang per soort wijn</h2>
<p>De tabellen hieronder geven per soort een typische periode, in jaren na de oogst. Het eerste getal is wanneer de wijn op dronk begint te raken, het tweede tot wanneer hij op z’n best blijft. Het zijn de vuistregels die CellarMentor gebruikt voor een gewoon jaar en een goede bewaarplek. Een 0 betekent: meteen te drinken.</p>
${soortTabellen()}
<p class="zacht">Twee soorten passen niet in een tabel. Champagne zonder jaartal is klaar als je hem koopt; CellarMentor rekent dan met het jaar waarin de fles in je kelder kwam en geeft hem ${champNV} jaar. Madeira heeft geen zinnig einde: de app rekent met ${madeiraDak} jaar, wat in de praktijk “zo lang als je wilt” betekent.</p>

<h2>Voorbeelden: vier flessen, vier antwoorden</h2>
<ul>
<li><b>Sancerre uit 2024.</b> Sauvignon blanc, gemaakt om fris te drinken: ${esc(vw(sancerre(2024)))}.</li>
<li><b>Barolo uit 2016.</b> Nebbiolo uit een streek die rijpt, in een ${esc(woord(barolo(2016)))} jaar: ${esc(vw(barolo(2016)))}.</li>
<li><b>Vintage champagne uit 2008.</b> Een ${esc(woord(champ(2008)))} jaar in de Champagne: ${esc(vw(champ(2008)))}.</li>
<li><b>Vintage port uit 2017.</b> Een ${esc(woord(vport(2017)))} portjaar: ${esc(vw(vport(2017)))}.</li>
</ul>
<p>Dat zijn vensters voor een fles die goed heeft gelegen. Wat de jaargang er precies aan verandert, lees je hieronder.</p>

<h2>Wat de jaargang eraan verandert</h2>
<p>De tabellen gaan uit van een gewoon jaar. In een uitzonderlijk jaar heeft wijn meer tijd nodig en gaat hij langer mee; in een moeilijk jaar is hij eerder op dronk en korter goed. CellarMentor rekt de bewaartijd in een uitzonderlijk jaar met een kwart en laat hem later beginnen. Een moeilijk jaar maakt hem ongeveer een derde korter.</p>
<p>Een rode Haut-Médoc uit 2016, in de tabel een ${esc(woord(medoc(2016)))} jaar, komt zo op ${esc(vw(medoc(2016)))}. Dezelfde wijn uit 2013, een ${esc(woord(medoc(2013)))} jaar, op ${esc(vw(medoc(2013)))}. Hoe elk jaar per streek uitviel, staat in de <a href="/jaargangen/">wijnjarentabel</a>, bijvoorbeeld voor <a href="/jaargangen/bordeaux/">Bordeaux</a> en <a href="/jaargangen/rioja/">Rioja</a>.</p>
<p>Het oordeel over een jaar geldt voor een hele streek. Een goede producent maakt in een moeilijk jaar vaak betere wijn dan het jaar doet vermoeden.</p>

${kader('artikel', 'Hoe lang kan jouw fles nog?', 'Scan het etiket. CellarMentor zoekt de soort, de streek en de jaargang erbij en zegt of hij nu open kan of nog moet wachten.')}

<h2>Welke wijn kun je lang bewaren?</h2>
<p>Zoek je een fles om jaren weg te leggen, bijvoorbeeld voor een geboortejaar, kijk dan naar de soorten met het langste venster. Volgens de vuistregels hierboven zijn dat vintage port (${(d => d.van + '–' + d.tot)(duur(vport()))} jaar), edelzoete wijn zoals Sauternes (${(d => d.van + '–' + d.tot)(duur({ type:'zoet', appellation:'Sauternes' }))}), een prestige cuvée uit de Champagne (${(d => d.van + '–' + d.tot)(duur({ type:'mousserend', appellation:'Champagne', name:'Cuvée Prestige' }))}), riesling met restzoet (${(d => d.van + '–' + d.tot)(duur({ type:'zoet', name:'Riesling Spätlese' }))}) en de grote rode bewaarwijnen, zoals geklasseerde Bordeaux en Barolo riserva (${(d => d.van + '–' + d.tot)(duur({ type:'rood', appellation:'Pauillac', name:'Grand Cru Classé' }))}).</p>
<p>Kies dan bij voorkeur een goed jaar uit die streek; de <a href="/jaargangen/">wijnjarentabel</a> laat per streek zien welke jaren dat zijn. En geef de fles een plek die achttien jaar lang koel en donker blijft.</p>

<h2>Wat de bewaarplek eraan verandert</h2>
<p>De getallen hierboven gaan uit van een koele, donkere en rustige plek. Een warmere plek laat wijn sneller rijpen, en grote schommelingen in temperatuur zijn slecht voor elke fles. Een wijn die jaren in een warme keukenkast stond, is dus eerder klaar en eerder over z’n hoogtepunt dan dezelfde wijn uit een kelder.</p>
<p>Hoe je dat thuis regelt, met temperatuur, licht en de vraag of een fles moet liggen of staan, lees je in <a href="/gids/wijn-bewaren-thuis/">wijn bewaren thuis</a>.</p>

<h2>Waarom de getallen per bron verschillen</h2>
<p>Zoek je dezelfde wijn op bij een handelaar, een criticus en de maker, dan krijg je vaak drie verschillende vensters. Dat is logisch. De een proefde de wijn jong, de ander later, en iedereen heeft een eigen idee van wanneer een wijn op z’n best is.</p>
<p>Vuistregels zoals hierboven geven de orde van grootte. Voor je eigen fles weegt het advies van de maker zwaarder, en een fles openen zegt meer dan elk getal. Hoe je dat aanpakt, staat in <a href="/gids/drinkvenster/">wanneer is een wijn op dronk</a>.</p>

<h2>Hoe lang blijft een geopende fles goed?</h2>
<p>Dit artikel gaat over dichte flessen. Een geopende fles is een ander verhaal: zuurstof doet dan in dagen wat in de kelder jaren duurt. De meeste wijn is een dag of twee na het openen nog goed als je de fles weer afsluit en koel zet. Mousserende wijn verliest zijn bubbels sneller. Versterkte wijn, zoals tawny port en oloroso, houdt het langer vol.</p>
`,
},
{
  slug:'wijn-bewaren-thuis',
  titel:'Wijn bewaren thuis: temperatuur, licht, liggen of staan',
  h1:'Wijn bewaren thuis: <em>temperatuur, licht, liggen of staan</em>',
  kruim:'Wijn bewaren thuis',
  beschrijving:'Hoe bewaar je wijn thuis zonder kelder? De juiste temperatuur, licht, liggen of staan, de beste plek in huis en wanneer een wijnklimaatkast zin heeft.',
  lijstTekst:'De juiste temperatuur, licht, liggen of staan, en de beste plek in een huis zonder kelder.',
  lede:'Een wijnkelder hoeft geen kelder te zijn. Wijn wil een koele plek die het hele jaar ongeveer even koel blijft, donker en rustig, met flessen met een kurk op hun zij. Zo pak je dat thuis aan.',
  body: () => `
<h2>Wat wijn nodig heeft</h2>
<ul>
<li><b>Koel.</b> Rond de 12 °C is ideaal.</li>
<li><b>Constant.</b> Liever een paar graden te warm dan elke dag op en neer.</li>
<li><b>Donker.</b> Sterk licht verandert de wijn.</li>
<li><b>Rustig.</b> Geen trillingen.</li>
<li><b>Liggend</b>, als er een kurk in zit.</li>
<li><b>Niet te droog</b>, anders droogt de kurk uit.</li>
</ul>
<p>Dit is breed gedragen advies. Decanter geeft het in een kort stuk over ${ext(BRON.decanterWaar, 'waar je je wijn bewaart')}, en wijnschrijver Steven Spurrier zet het op een rij in een ${ext(BRON.decanterVideo, 'videoles van Decanter')}. De getallen hieronder komen uit die twee stukken.</p>

<h2>Welke temperatuur is goed?</h2>
<p>Decanter noemt 8 tot 13 °C ideaal. Spurrier noemt 12 °C de temperatuur van een klassieke kelder, en vindt alles tussen 8 en 15 °C in orde. Ergens rond de 12 °C zit je dus goed.</p>
<p>Belangrijker dan het precieze getal is dat de temperatuur niet steeds verandert. Beide bronnen waarschuwen voor de keuken, die warm is tijdens het koken en daarna weer afkoelt. Decanter noemt de garage om dezelfde reden. Daarnaast laat een warmere plek wijn sneller rijpen, zodat een fles eerder op z’n hoogtepunt is en er ook eerder overheen.</p>
<p>Bewaren en schenken zijn twee verschillende temperaturen. De meeste rode wijn schenk je iets warmer dan je hem bewaart, veel witte wijn iets kouder. Dat regel je op de dag zelf.</p>

<h2>Licht</h2>
<p>Volgens Spurrier verandert sterk licht de kleur van wijn: witte wijn wordt donkerder en rode lichter. Een bewaarplek moet zo donker zijn als het kan.</p>
<p>Thuis betekent dat: een dichte kast, een doos of een ruimte zonder raam. Flessen op een plank in de vensterbank of onder een lamp die de hele dag brandt, gaan sneller achteruit.</p>

<h2>Liggen of staan?</h2>
<p>Flessen met een kurk leg je neer. Zo blijft de kurk vochtig en sluit hij goed. Staat een fles jarenlang rechtop, dan kan de kurk uitdrogen en komt er lucht bij de wijn.</p>
<p>Bij een schroefdop maakt het volgens Spurrier minder uit, omdat daar geen lucht langs kan. Een fles die je binnen een paar weken drinkt, kan gerust staan.</p>

<h2>Luchtvochtigheid en trillingen</h2>
<p>Een bewaarplek heeft wat vocht nodig, anders drogen de kurken uit. Dat zegt Spurrier, zonder er een getal aan te hangen. Is het juist erg vochtig, dan laten etiketten los en kan er schimmel op komen. Dat is slecht voor het etiket en voor de waarde van de fles.</p>
<p>Decanter raadt aan trillingen te vermijden. Zet een rek dus niet naast de wasmachine of de droger.</p>

${kader('artikel', 'Weet wat waar ligt', 'In CellarMentor maak je je eigen plekken en rekken met vakjes, tot “Kast onder, B3”. Bij elke fles zie je waar hij ligt en wanneer hij op dronk is.')}

<h2>Waar in huis?</h2>
<p>De meeste Nederlandse huizen hebben geen kelder. Dit zijn de plekken die het vaakst goed uitpakken, en de plekken om te vermijden.</p>
<ul>
<li><b>Een kast onder de trap of een inbouwkast aan een binnenmuur.</b> Spurrier noemt de kast onder de trap en de kledingkast als alternatief voor een kelder. Ze zijn donker en de temperatuur schommelt er weinig.</li>
<li><b>Een kelder of kruipruimte.</b> Vaak koel genoeg, maar kijk naar vocht en schimmel. Ruikt het er muf, dan is het geen plek voor jaren.</li>
<li><b>Een onverwarmde kamer aan de noordkant.</b> Kan goed zijn, als de zon er niet op staat en de verwarming dicht blijft.</li>
<li><b>Vermijd</b> de keuken, de garage, de zolder, de plek naast de cv-ketel of de verwarming, en een kamer met veel zon.</li>
</ul>
<p>Twijfel je over een plek, leg er dan een thermometer die de hoogste en laagste temperatuur onthoudt. Na een paar weken weet je hoeveel hij schommelt. Een heel jaar meten zegt nog meer, want de zomer is de echte test.</p>

<h2>Wat als een fles toch warm heeft gestaan?</h2>
<p>Eén warme middag in de auto maakt een fles meestal niet kapot. Hoe langer en hoe warmer, hoe groter het effect: de wijn rijpt sneller en verliest eerder zijn frisheid.</p>
<p>Er zijn twee dingen om op te letten. Is de kurk een stukje omhoog gekomen, of is er wijn langs de kurk gelopen, dan heeft de fles het zwaar gehad. Drink zo’n fles dan liever binnenkort dan dat je hem nog jaren laat liggen. Bij vorst geldt hetzelfde: wijn die bevriest zet uit en kan de kurk naar buiten drukken. Een onverwarmde schuur of garage is in de winter dus ook geen goede plek.</p>

<h2>Wijn bewaren voor later</h2>
<p>Leg je een fles weg voor een verjaardag over tien of achttien jaar, kies dan eerst een wijn die zo lang mee kan. Welke soorten dat zijn, staat in <a href="/gids/hoe-lang-wijn-bewaren/">hoe lang kun je wijn bewaren</a>. Daarna is de plek alles: de koelste, donkerste en rustigste plek in huis, waar niemand de fles tussendoor verplaatst.</p>
<p>Laat de fles in de doos van de wijnhandel liggen als dat kan, op zijn kant. Schrijf erop wat erin zit en wanneer hij open mag. In CellarMentor kun je hetzelfde vastleggen, met de plek en het drinkvenster erbij.</p>

<h2>Een wijnklimaatkast, en waarom een koelkast niet werkt</h2>
<p>Is er geen plek die koel en constant genoeg blijft, dan is een wijnklimaatkast de oplossing. Spurrier noemt zo’n kast als alternatief voor een kelder: hij houdt de wijn op een vaste temperatuur.</p>
<p>Let bij het kiezen op drie dingen. Dat hij een vaste bewaartemperatuur aanhoudt, dat de deur dicht of getint is, en dat er plek is voor meer flessen dan je nu hebt. Een kast met twee zones is handig als je ook op temperatuur wilt schenken; om te bewaren is één zone genoeg.</p>
<p>Een gewone koelkast is geen bewaarplek voor jaren. Hij staat een stuk kouder dan de 8 °C die de bronnen hierboven als ondergrens noemen, en hij gaat de hele dag open en dicht. Voor een fles die je deze week drinkt, is hij prima.</p>

<h2>Wat een goede plek oplevert</h2>
<p>Hoe beter een fles ligt, hoe beter het drinkvenster klopt. De vensters in CellarMentor gaan uit van een goede bewaarplek. Ligt een fles warmer, pas dan het venster aan; de app laat een venster dat je zelf zet staan.</p>
<p>Hoe lang de verschillende soorten wijn meegaan, staat in <a href="/gids/hoe-lang-wijn-bewaren/">hoe lang kun je wijn bewaren</a>. Hoe de jaargang daarbij meetelt, zie je per streek in de <a href="/jaargangen/">wijnjarentabel</a>.</p>
`,
},
{
  slug:'cellartracker-vivino-overstappen',
  titel:'Je kelder uit CellarTracker of Vivino exporteren',
  h1:'Je kelder uit CellarTracker of Vivino <em>meenemen</em>',
  kruim:'Overstappen van CellarTracker of Vivino',
  beschrijving:'Zo exporteer je je kelder uit CellarTracker of Vivino als CSV en lees je hem in CellarMentor in, met drinkvensters. Gratis en zonder credits.',
  lijstTekst:'Je kelder exporteren als CSV en in één keer inlezen, met plekken en drinkvensters.',
  lede:'Wie al jaren een kelder bijhoudt in CellarTracker of Vivino, begint niet graag opnieuw. Dat hoeft ook niet. Met een CSV-bestand neem je je flessen mee naar CellarMentor, met jaargang, aantal, plek en drinkvenster. Inlezen is gratis en kost geen credits.',
  body: () => `
<h2>Waarom overstappen, of allebei gebruiken</h2>
<p>CellarTracker is een van de oudste en uitgebreidste kelderprogramma’s, met veel proefnotities van andere gebruikers. Vivino is sterk in beoordelingen van andere drinkers en in het kopen van wijn.</p>
<p>CellarMentor gaat over de vraag welke fles er vanavond open moet. Elke fles krijgt een drinkvenster uit soort, streek en jaargang, je ziet welke flessen nu op hun mooist zijn, en de app kiest uit je eigen kelder de fles bij je eten. Hij werkt in het Nederlands, in je browser, en zonder account blijft alles op je telefoon. Wat de app verder doet, staat op de <a href="/start/">startpagina</a>.</p>
<p>Je hoeft niet te kiezen. Wie zijn proefnotities in CellarTracker wil houden, kan dat gewoon blijven doen.</p>

<h2>Je kelder exporteren uit CellarTracker</h2>
<p>De stappen hieronder volgen de ${ext(BRON.ctExport, 'helppagina van CellarTracker over exporteren')}.</p>
<ol>
<li>Open CellarTracker op een computer, op de volledige website. Volgens CellarTracker kan exporteren niet vanuit de app of de mobiele site.</li>
<li>Ga naar de lijst die je wilt meenemen, bijvoorbeeld je kelder (My Cellar).</li>
<li>Klik rechtsboven op Export en kies welke kolommen je meeneemt. Neem in elk geval naam, producent, jaargang en aantal mee, en als je ze hebt ook plek, aankoopprijs en drinkvenster.</li>
<li>Bewaar het bestand als CSV. Een tabgescheiden bestand kan ook.</li>
</ol>
<p>Plek en vak staan in CellarTracker alleen in de weergaven per fles, zegt dezelfde helppagina. Ook zo’n export per fles leest CellarMentor in: flessen van dezelfde wijn uit hetzelfde jaar telt hij op tot één regel. Lagen die flessen op verschillende plekken, dan krijgt de regel de plek van de eerste. Die pas je daarna per wijn aan.</p>
<p>CellarTracker raadt zelf aan om regelmatig zo’n export te maken als reservekopie. Ook als je blijft, is dat een goed idee.</p>

<h2>Je kelder exporteren uit Vivino</h2>
<p>Vivino heeft een export van je gegevens, maar we vonden er geen eigen handleiding van Vivino over. De stappen hieronder komen uit de ${ext(BRON.invintoryVivino, 'uitleg van een andere kelderapp')}, en menu’s kunnen intussen anders heten.</p>
<ol>
<li>Log in op de website van Vivino en ga via je profielfoto naar de instellingen.</li>
<li>Vraag onder accountbeheer een export van je gegevens aan. Dat kan een tijd duren.</li>
<li>Je krijgt een zip-bestand. Daarin staat onder meer <b>cellar.csv</b>: dat is het bestand met je kelder.</li>
</ol>
<p>Volgens dezelfde uitleg staan je eigen beoordelingen, aankoopprijzen en plekken niet in dat bestand. Naam, producent, jaargang, streek, land, soort en aantal wel.</p>
<p>Vind je de export niet, dan kun je Vivino vragen om je gegevens over te dragen. Dat recht heb je onder de AVG; de Autoriteit Persoonsgegevens legt ${ext(BRON.apPortabiliteit, 'uit hoe dat werkt')}. Of gebruik de route zonder CSV, verderop.</p>

${kader('artikel', 'Probeer het met je eigen bestand', 'Inlezen is gratis, kost geen credits en werkt ook zonder account. Je ziet eerst wat er gevonden is; pas als jij aanvinkt gaat er iets je kelder in.')}

<h2>Inlezen in CellarMentor</h2>
<ol>
<li>Open CellarMentor en ga naar <b>Meer</b>, <b>Meerdere flessen tegelijk</b>.</li>
<li>Tik op <b>CSV kiezen</b> en kies je bestand. Of het komma’s, puntkomma’s of tabs gebruikt, ziet CellarMentor zelf.</li>
<li>Bij <b>Kolommen koppelen</b> staat per veld al de kolom die er het meest op lijkt. CellarMentor herkent namen uit CellarTracker, Vivino en Nederlandse spreadsheets. Alleen de naam van de wijn is verplicht. Pas aan wat niet klopt, bijvoorbeeld de kolom met het aantal flessen, en tik op <b>Inlezen</b>.</li>
<li>Je krijgt een controlelijst. Wijnen die al in je kelder staan, zijn gemarkeerd en staan uit. Vink aan wat klopt, pas aantallen aan en tik een wijn aan om jaargang, soort of plek bij te werken. Je kunt ook in één keer een plek zetten voor alles wat aangevinkt is.</li>
<li>Tik op de knop onderaan om de flessen in je kelder te leggen.</li>
</ol>
<p>Per keer leest CellarMentor tot 400 verschillende wijnen. Een grotere kelder lees je in delen in.</p>

<h2>Wat er meekomt, en wat niet</h2>
<ul>
<li><b>Meegenomen</b>, als de kolom in je bestand staat: naam, producent, jaargang, soort, druiven, land, regio, appellation, aantal, plek, aankoopprijs, waarde en je eigen notitie.</li>
<li><b>Drinkvensters</b> uit je bestand blijven staan. Alleen als het einde vijf jaar of meer eerder ligt dan wat de app voor die fles rekent, neemt CellarMentor het latere jaar. Daarna verandert zo’n venster niet meer vanzelf; alleen vensters die de app zelf heeft bedacht, bewegen mee als de jaargangtabel wordt bijgewerkt.</li>
<li><b>Zonder venster</b> in het bestand rekent CellarMentor er een uit soort, streek en jaargang, zoals bij elke andere fles. Hoe dat werkt, lees je in <a href="/gids/drinkvenster/">wanneer is een wijn op dronk</a>.</li>
<li><b>De soort</b> komt uit de kolom voor type of kleur. Ontbreekt die, dan kijkt CellarMentor naar de druiven, en anders wordt het rood. Kijk rosé, mousserend en zoet dus even na in de controlelijst.</li>
<li><b>Niet meegenomen:</b> scores en beoordelingen, de lijst van flessen die je al gedronken hebt, foto’s en proefnotities van anderen.</li>
</ul>

<h2>Als het niet meteen lukt</h2>
<ul>
<li><b>“Geen tabel gevonden in dit bestand.”</b> Het bestand heeft minder dan twee regels, of het is geen tekstbestand, zoals een Excel-bestand. Bewaar het eerst als CSV.</li>
<li><b>Letters als é en ü komen verkeerd over.</b> Heb je het bestand in Excel geopend en opnieuw bewaard, kies dan bij het bewaren voor CSV UTF-8.</li>
<li><b>Alles wordt rode wijn.</b> Koppel bij Kolommen koppelen de kolom met het type of de kleur. Staat die niet in je bestand, dan kun je de soort in de controlelijst per wijn aanpassen.</li>
<li><b>Het aantal klopt niet.</b> Koppel de kolom met het aantal flessen. Zonder die kolom telt elke regel als één fles. De flesmaat komt niet mee, dus een magnum telt ook als één fles.</li>
<li><b>Een wijn heeft geen jaargang.</b> Een jaartal buiten 1900 tot 2100, of tekst in die kolom, leest CellarMentor als geen jaargang. Het venster rekent dan vanaf het jaar waarin de fles in je kelder kwam.</li>
</ul>
<p>Het is een eenmalige overzet. CellarMentor houdt CellarTracker of Vivino daarna niet bij; wat je daar nog verandert, neem je met een nieuwe export mee. Wijnen die al in je kelder staan, worden dan herkend en staan uit.</p>

<h2>Geen CSV? Plak een lijst of maak een foto</h2>
<p>In hetzelfde scherm kun je ook een lijst plakken, of tot vier foto’s laten lezen van een lijst of van flessen die rechtop staan. Dat gaat via de sommelier in de app en kost credits: een geplakte lijst één, en foto’s één per foto. Per keer haalt hij er tot zestig wijnen uit, en ook hier zie je eerst wat er gevonden is.</p>

<h2>En dan</h2>
<p>Staat je kelder erin, dan heeft elke fles een drinkvenster en zie je welke flessen nu op dronk zijn en welke nog moeten wachten. Waar die vensters op rusten, zie je per streek in de <a href="/jaargangen/">wijnjarentabel</a>, bijvoorbeeld voor <a href="/jaargangen/bordeaux/">Bordeaux</a>.</p>
`,
},
];

/* ---------- opmaak ---------- */
const CSS_GIDS = `
.tabel td.zacht{color:var(--ink2);font-size:14.5px}
.tabel .r{text-align:right}
.tabel td.r{white-space:nowrap}
.tabel td{overflow-wrap:anywhere}
.hub{list-style:none;margin:6px 0 10px}
.hub li{border-top:1px solid var(--line)}
.hub li:last-child{border-bottom:1px solid var(--line)}
.hub a{display:block;padding:20px 0;text-decoration:none}
.hub a b{display:block;font-family:var(--serif);font-weight:500;font-size:clamp(22px,5vw,27px);line-height:1.2}
.hub a span{display:block;color:var(--ink2);font-size:15.5px;margin-top:6px}
.hub a:hover b{color:var(--acc)}
.tekst ul.hub li{padding:0}
.tekst ul.hub li::before{display:none}
`;

const woorden = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<aside[\s\S]*?<\/aside>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ').split(/\s+/).filter(w => /[A-Za-zÀ-ÿ0-9]/.test(w)).length;

function artikelPagina(a){
  const pad = `/gids/${a.slug}/`;
  const stappen = [{ naam:'CellarMentor', pad:'/start/' }, { naam:'Gids', pad:'/gids/' }, { naam:a.kruim, pad }];
  const body = a.body();
  const n = woorden(`<p>${a.lede}</p>` + body);
  const minuten = Math.max(1, Math.round(n / 220));
  const andere = ARTIKELEN.filter(x => x !== a);
  const inhoud = `<div class="wrap smal">
${kruimpad(stappen)}
<article>
<div class="kop">
  <div class="eyebrow">Gids</div>
  <h1>${a.h1}</h1>
  <p class="sub">${esc(a.lede)}</p>
  <p class="meta">CellarMentor · ${DATUM_NL} · ${minuten} minuten lezen</p>
</div>
<div class="tekst">
${body}
</div>
</article>
<section class="verder"><div class="eyebrow">Verder lezen</div><ul>
${andere.map(x => `<li><a href="/gids/${x.slug}/">${esc(x.titel)}<span>${esc(x.lijstTekst)}</span></a></li>`).join('\n')}
<li><a href="/jaargangen/">Wijnjaren per streek<span>Per jaar het oordeel en het drinkvenster, voor ${APP.STREKEN.length} streken.</span></a></li>
<li><a href="/start/">Wat CellarMentor doet<span>Scan het etiket en weet wanneer je hem opent.</span></a></li>
</ul></section>
</div>
${slot('Welke fles <em>moet er vanavond open?</em>', 'Scan er één, dan weet je het. Gratis, in je browser, zonder account.')}`;
  const ld = [{
    '@context':'https://schema.org', '@type':'Article', headline: a.titel, description: a.beschrijving, inLanguage:'nl',
    datePublished: DATUM_PUB, dateModified: DATUM_PUB, mainEntityOfPage: SITE + pad, image: SITE + '/og.png',
    author: { '@type':'Organization', name:'CellarMentor', url: SITE + '/start/' },
    publisher: { '@type':'Organization', name:'CellarMentor', url: SITE + '/start/' },
  }, breadcrumbLd(stappen)];
  return { html: pagina({ pad, titel:a.titel, beschrijving:a.beschrijving, ogType:'article', css:CSS_GIDS, ld, inhoud }), woorden: n };
}

function hub(){
  const pad = '/gids/';
  const stappen = [{ naam:'CellarMentor', pad:'/start/' }, { naam:'Gids', pad }];
  const inhoud = `<div class="wrap smal">
${kruimpad(stappen)}
<div class="kop">
  <div class="eyebrow">Gids</div>
  <h1>Wijn bewaren en <em>op het juiste moment openen</em></h1>
  <p class="sub">Wanneer een wijn op dronk is, hoe lang hij meegaat en hoe je hem thuis goed bewaart. In gewone woorden, met de getallen waar CellarMentor zelf mee rekent.</p>
</div>
<div class="tekst">
<ul class="hub">
${ARTIKELEN.map(a => `<li><a href="/gids/${a.slug}/"><b>${esc(a.titel)}</b><span>${esc(a.lijstTekst)}</span></a></li>`).join('\n')}
<li><a href="/jaargangen/"><b>Wijnjaren per streek</b><span>De wijnjarentabel van CellarMentor: per streek en per jaar het oordeel, het drinkvenster en of het oordeel tegen bronnen is gelegd.</span></a></li>
</ul>
</div>
${kader('hub', 'Liever meteen weten?', 'Scan het etiket van een fles en CellarMentor zegt of hij nu open kan of nog moet wachten, en waarom.')}
</div>
${slot('Welke fles <em>moet er vanavond open?</em>', 'Scan er één, dan weet je het. Gratis, in je browser, zonder account.')}`;
  return pagina({ pad, titel:'Gids: wijn bewaren en op het juiste moment openen', ogType:'website', css:CSS_GIDS,
    beschrijving:'Wanneer is wijn op dronk, hoe lang kun je hem bewaren en hoe bewaar je hem thuis? Uitleg in gewone woorden, met de rekenregels van CellarMentor.',
    ld:[{ '@context':'https://schema.org', '@type':'CollectionPage', name:'Gids: wijn bewaren en op het juiste moment openen', url: SITE + pad, inLanguage:'nl',
      hasPart: ARTIKELEN.map(a => ({ '@type':'Article', headline:a.titel, url: SITE + `/gids/${a.slug}/` })) }, breadcrumbLd(stappen)], inhoud });
}

/* ---------- schrijven ---------- */
for(const a of ARTIKELEN){
  const { html, woorden: n } = artikelPagina(a);
  schrijf(path.join(HIER, a.slug, 'index.html'), html);
  console.log(`gids/${a.slug}/  ${n} woorden`);
}
schrijf(path.join(HIER, 'index.html'), hub());
const datum = new Date().toISOString().slice(0, 10);
console.log(`gids/index.html geschreven; sitemapvoorstel met ${schrijfSitemap(ROOT, datum)} adressen.`);
