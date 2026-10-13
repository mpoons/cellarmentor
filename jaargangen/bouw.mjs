#!/usr/bin/env node
/* Bouwt /jaargangen/ uit de jaargangtabel van de app zelf.

   node jaargangen/bouw.mjs

   Waar de gegevens vandaan komen: STREKEN, de vensterregels (vensterBasis, estimateWindow) en alles
   wat die nodig hebben, letterlijk uit cellarmentor.html geknipt en in een vm-sandbox uitgevoerd.
   Er staat dus geen kopie van de tabel of van de formules in dit script: verandert de tabel, dan
   draai je dit opnieuw en kloppen de pagina's weer. Het knippen gaat per declaratie op topniveau
   (const, let, function): vanaf de regel waarop hij begint, tot het eerste stuk dat als JavaScript
   compileert. Zo hoeft dit script niets te weten over haakjes in strings of regexen.

   Wat er publiek op komt, en wat bewust niet (zie JAARGANGEN.md en DECISIONS.md, 16 en 17 sep):
   - per jaar het niveau in het woord van de app (uitzonderlijk, sterk, klassiek, wisselend, moeilijk)
     en hoe hard dat oordeel is, in de woorden van de app;
   - een drinkvenster voor een omschreven voorbeeldfles, met de rekenregels van de app;
   - de namen van de uitgevers die voor een streek zijn gelezen.
   Niet: puntenscores, citaten (Vinous en The Wine Cellar Insider willen niet geciteerd worden, en
   een citaat hoort bij een fles in de app, niet op een pagina die we breed verspreiden), de
   rijpheidstabel (een waarneming van Berry Bros of Decanter, niet van ons), producentenlijsten.
   Streken zonder één nagetrokken jaar, of met minder dan MIN_JAREN jaren, krijgen geen eigen
   pagina: daar zou de pagina alleen onze eigen schatting herhalen, en een paar Italiaanse en
   Griekse rijen zijn nu nog letterlijk gelijk aan elkaar. Ze staan wel in het overzicht. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { laadApp } from './app.mjs';
import { pagina, schrijf, esc, kader, slot, kruimpad, breadcrumbLd, schrijfSitemap, SITE } from './sjabloon.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HIER, '..');
const MIN_JAREN = 5;     // minder jaren dan dit: geen eigen pagina
const MIN_BRON = 1;      // minstens zoveel jaren tegen een bron gelegd: anders geen eigen pagina

/* ---------- 1. de app inlezen (zie app.mjs) ---------- */
const APP = laadApp(ROOT);
const { STREKEN, JAARTABEL, JAARBRON, JAAR_WOORD, streekVan, estimateWindow } = APP;

/* De stand van de tabel, uit JAARGANGEN.md ("**Stand: 16 september 2026, ..."). */
const jg = fs.readFileSync(path.join(ROOT, 'JAARGANGEN.md'), 'utf8');
const STAND = (/\*\*Stand: (\d{1,2} [a-z]+ \d{4})/.exec(jg) || [])[1] || null;

/* Welke uitgevers per streek zijn gelezen, uit het onderzoeksdossier. Alleen namen, geen zinnen. */
const UITGEVERS = {};
try{
  const dossier = JSON.parse(fs.readFileSync(path.join(ROOT, 'bronnen', 'bevindingen.json'), 'utf8'));
  for(const b of dossier.bevindingen || []){
    for(const x of b.bronnen || []){
      if(!x.uitgever || /wine ?spectator/i.test(x.uitgever) || /winespectator\.com/.test(x.url || '')) continue;
      ((UITGEVERS[b.streek] ||= {})[x.uitgever] = ((UITGEVERS[b.streek] || {})[x.uitgever] || 0) + 1);
    }
  }
}catch(e){ console.warn('bronnen/bevindingen.json niet gelezen:', e.message); }

/* ---------- 2. per streek: naam, slug, land, inleiding en voorbeeldflessen ----------
   `w` is een fles zoals de app hem kent; estimateWindow rekent er het venster mee uit, en het script
   controleert dat streekVan hem in déze rij plaatst. `kort` staat boven de kolom. Elke inleiding is
   eigen tekst; houd hem bij feiten die je zonder bron kunt verdedigen. */
const R = (type, appellation, grapes, extra = {}) => ({ type, appellation, grapes, ...extra });
const REGIO = {
  sauternes: { slug:'sauternes', naam:'Sauternes en Barsac', land:'Frankrijk',
    intro:'Sauternes en Barsac maken edelzoete wijn van semillon en sauvignon blanc. Of een jaar slaagt, hangt af van de edelrot, en die vraagt in het najaar mistige ochtenden en droge middagen. Dat geeft de natuur niet elk jaar. De app gebruikt deze rij ook voor de zoete buren, zoals Cérons, Loupiac, Sainte-Croix-du-Mont en Monbazillac.',
    refs:[{ kort:'Sauternes', label:'een Sauternes of Barsac', w:R('zoet', 'Sauternes', ['semillon', 'sauvignon blanc']) }] },
  bordeaux: { slug:'bordeaux', naam:'Bordeaux', land:'Frankrijk',
    intro:'Bordeaux is de streek waar het meest over jaargangen wordt gepraat. De rode wijnen zijn blends van vooral cabernet sauvignon en merlot, en het weer in de zomer en rond de oogst bepaalt hoe rijp die druiven worden. Deze rij geldt voor de hele streek, van de Médoc en Pessac-Léognan tot Saint-Émilion, Pomerol en de Côtes. De zoete wijnen hebben een eigen pagina.',
    refs:[{ kort:'Médoc, Graves of rechteroever', label:'een rode Bordeaux uit de Médoc, Graves of van de rechteroever, zonder classificatie op het etiket', w:R('rood', 'Haut-Médoc', ['cabernet sauvignon', 'merlot']) },
          { kort:'grand cru classé', label:'een geklasseerde Bordeaux (grand cru classé)', w:R('rood', 'Pauillac', ['cabernet sauvignon', 'merlot'], { name:'Grand Cru Classé' }) }] },
  champagne: { slug:'champagne', naam:'Champagne', land:'Frankrijk', in:'in de Champagne',
    intro:'In de Champagne maken de meeste huizen alleen in betere jaren een wijn met jaartal; de rest gaat op in de brut zonder jaargang. Deze tabel gaat over die jaargangchampagnes. Voor een brut zonder jaartal rekent de app met het jaar waarin de fles in je kelder kwam.',
    refs:[{ kort:'vintage champagne', label:'een vintage champagne', w:R('mousserend', 'Champagne', ['chardonnay', 'pinot noir'], { name:'Brut Millésime' }) },
          { kort:'prestige cuvée', label:'een prestige cuvée', w:R('mousserend', 'Champagne', ['chardonnay', 'pinot noir'], { name:'Cuvée Prestige' }) }] },
  bourgogne_w: { slug:'bourgogne-wit', naam:'Bourgogne wit', land:'Frankrijk',
    intro:'Witte Bourgogne is chardonnay, van Chablis in het noorden tot de Mâconnais in het zuiden. De app houdt rood en wit apart, omdat een jaar voor de ene kleur heel anders kan uitvallen dan voor de andere. Bij de jaren rond 1995 tot 2003 is de tabel met opzet voorzichtig: veel witte Bourgognes uit die periode oxideerden eerder dan verwacht, en dan is een korter venster de veiligere kant.',
    refs:[{ kort:'Côte de Beaune', label:'een witte dorpswijn uit de Côte de Beaune, zoals Meursault', w:R('wit', 'Meursault', ['chardonnay']) },
          { kort:'Bourgogne Blanc', label:'een Bourgogne Blanc', w:R('wit', 'Bourgogne', ['chardonnay']) }] },
  bourgogne_r: { slug:'bourgogne-rood', naam:'Bourgogne rood', land:'Frankrijk',
    intro:'Rode Bourgogne is pinot noir, een dunschillige druif die gevoelig is voor regen, hagel en rot. Daardoor verschillen de jaren hier sterk. De app houdt rood en wit apart, ook al komen ze uit dezelfde dorpen.',
    refs:[{ kort:'Volnay premier cru', label:'een Volnay premier cru', w:R('rood', 'Volnay Premier Cru', ['pinot noir']) },
          { kort:'Bourgogne Rouge', label:'een Bourgogne Rouge', w:R('rood', 'Bourgogne', ['pinot noir']) }] },
  beaujolais: { slug:'beaujolais', naam:'Beaujolais', land:'Frankrijk',
    intro:'De Beaujolais is gamay. De tien crus, zoals Morgon, Fleurie en Moulin-à-Vent, maken de wijnen die het langst meegaan. Gewone Beaujolais drink je jong.',
    refs:[{ kort:'cru uit de Beaujolais', label:'een cru zoals Morgon of Fleurie', w:R('rood', 'Morgon', ['gamay']) }] },
  rhone_n: { slug:'rhone-noord', naam:'noordelijke Rhône', land:'Frankrijk',
    intro:'De noordelijke Rhône is syrah op steile hellingen langs de rivier, met Hermitage, Côte-Rôtie en Cornas als de wijnen die het langst rijpen. Wit komt er van viognier in Condrieu en van marsanne en roussanne.',
    refs:[{ kort:'Côte-Rôtie of Cornas', label:'een Hermitage, Côte-Rôtie of Cornas', w:R('rood', 'Côte-Rôtie', ['syrah']) },
          { kort:'Saint-Joseph', label:'een rode Saint-Joseph', w:R('rood', 'Saint-Joseph', ['syrah']) }] },
  rhone_z: { slug:'rhone-zuid', naam:'zuidelijke Rhône', land:'Frankrijk',
    intro:'In de zuidelijke Rhône is grenache de hoofddruif, meestal met syrah en mourvèdre erbij. Châteauneuf-du-Pape is de bekendste naam, met Gigondas, Vacqueyras en Rasteau ernaast.',
    refs:[{ kort:'Châteauneuf-du-Pape', label:'een rode Châteauneuf-du-Pape', w:R('rood', 'Châteauneuf-du-Pape', ['grenache', 'syrah', 'mourvèdre']) },
          { kort:'Gigondas', label:'een Gigondas of Vacqueyras', w:R('rood', 'Gigondas', ['grenache', 'syrah']) }] },
  provence: { slug:'provence', naam:'Provence', land:'Frankrijk',
    intro:'De Provence is voor de meeste mensen rosé, en die drink je jong. Om te bewaren is Bandol de naam: rode wijn van vooral mourvèdre, die jaren nodig heeft.',
    refs:[{ kort:'rode Bandol', label:'een rode Bandol', w:R('rood', 'Bandol', ['mourvèdre']) },
          { kort:'rosé', label:'een rosé uit de Côtes de Provence', w:R('rose', 'Côtes de Provence', ['grenache', 'cinsault']) }] },
  languedoc: { slug:'languedoc-roussillon', naam:'Languedoc en Roussillon', land:'Frankrijk',
    intro:'Languedoc en Roussillon zijn samen een grote en gevarieerde streek, van Minervois en Corbières tot Pic Saint-Loup en de zoete wijnen van Banyuls en Maury. Eén oordeel per jaar is hier grover dan in een kleine streek, en de producent weegt dus zwaarder.',
    refs:[{ kort:'rode Languedoc', label:'een rode Languedoc van syrah en grenache', w:R('rood', 'Pic Saint-Loup', ['syrah', 'grenache']) }] },
  sudwest: { slug:'zuidwest-frankrijk', naam:'Zuidwest-Frankrijk', land:'Frankrijk', in:'in het zuidwesten van Frankrijk',
    intro:'Het zuidwesten van Frankrijk is een lappendeken van kleine streken. Madiran (tannat) en Cahors (malbec) maken stevige rode wijn die tijd nodig heeft, en Jurançon is bekend om witte wijn, droog en zoet.',
    refs:[{ kort:'Madiran', label:'een Madiran', w:R('rood', 'Madiran', ['tannat']) },
          { kort:'Cahors', label:'een Cahors', w:R('rood', 'Cahors', ['malbec']) }] },
  loire: { slug:'loire', naam:'Loire', land:'Frankrijk',
    intro:'Langs de Loire groeit veel verschillende wijn: muscadet bij de kust, chenin blanc in Anjou en Touraine, cabernet franc in Chinon en Bourgueil, en sauvignon blanc in Sancerre en Pouilly-Fumé. Een jaar kan voor droge en zoete chenin verschillend uitvallen; de tabel geeft één oordeel voor de hele streek.',
    refs:[{ kort:'Vouvray of Savennières', label:'een Vouvray of Savennières', w:R('wit', 'Vouvray', ['chenin blanc']) },
          { kort:'Sancerre', label:'een Sancerre of Pouilly-Fumé', w:R('wit', 'Sancerre', ['sauvignon blanc']) }] },
  alsace: { slug:'elzas', naam:'Elzas', land:'Frankrijk',
    intro:'In de Elzas staan riesling, pinot gris en gewurztraminer centraal, droog of met restzoet. Wijnen uit een grand cru-wijngaard en de late oogsten, vendanges tardives en sélection de grains nobles, gaan het langst mee.',
    refs:[{ kort:'grand cru riesling', label:'een riesling uit een grand cru', w:R('wit', 'Alsace Grand Cru', ['riesling']) },
          { kort:'riesling', label:'een gewone Elzasser riesling', w:R('wit', 'Alsace', ['riesling']) }] },
  jura: { slug:'jura-savoie', naam:'Jura en Savoie', land:'Frankrijk',
    intro:'De Jura is klein en eigenzinnig: savagnin en chardonnay voor wit, poulsard en trousseau voor rood, en de vin jaune, die onder een laagje gist in het vat rijpt. De Savoie ligt dichter bij de Alpen en maakt vooral frisse witte wijn.',
    refs:[{ kort:'witte Arbois', label:'een witte Arbois of Côtes du Jura', w:R('wit', 'Arbois', ['chardonnay', 'savagnin']) }] },
  piemonte: { slug:'piemonte', naam:'Piemonte (Barolo, Barbaresco)', kortnaam:'Piemonte', land:'Italië', in:'in Piemonte',
    intro:'Piemonte is de streek van de nebbiolo, en Barolo en Barbaresco zijn de wijnen waarvoor deze tabel het meest wordt gebruikt. Barbera en dolcetto komen uit dezelfde heuvels en zijn eerder op dronk. Ook Gavi, Roero en de wijnen uit het noorden, zoals Gattinara en Ghemme, vallen onder deze rij.',
    refs:[{ kort:'Barolo of Barbaresco', label:'een Barolo of Barbaresco', w:R('rood', 'Barolo', ['nebbiolo']) },
          { kort:'Barbera d’Alba', label:'een Barbera d’Alba', w:R('rood', 'Barbera d’Alba', ['barbera']) }] },
  toscane: { slug:'toscane', naam:'Toscane', land:'Italië',
    intro:'Toscane is sangiovese: Chianti Classico, Brunello di Montalcino en Vino Nobile di Montepulciano. In Bolgheri aan de kust staan vooral Bordeauxdruiven.',
    refs:[{ kort:'Brunello', label:'een Brunello di Montalcino', w:R('rood', 'Brunello di Montalcino', ['sangiovese']) },
          { kort:'Chianti Classico', label:'een Chianti Classico', w:R('rood', 'Chianti Classico', ['sangiovese']) }] },
  veneto: { slug:'veneto', naam:'Veneto (Amarone, Valpolicella)', kortnaam:'Veneto', land:'Italië', in:'in de Veneto',
    intro:'In de Veneto maakt de corvina de rode wijnen van Valpolicella, van lichte Valpolicella via Ripasso tot Amarone, dat van ingedroogde druiven wordt gemaakt. Wit komt er van garganega in Soave en van glera voor prosecco.',
    refs:[{ kort:'Amarone', label:'een Amarone della Valpolicella', w:R('rood', 'Amarone della Valpolicella', ['corvina']) },
          { kort:'Ripasso', label:'een Valpolicella Ripasso', w:R('rood', 'Valpolicella Ripasso', ['corvina']) }] },
  sicilie: { slug:'sicilie', naam:'Sicilië', land:'Italië', in:'op Sicilië',
    intro:'Op Sicilië lopen de omstandigheden ver uiteen, van de vulkaanhellingen van de Etna tot het warme zuiden en westen. Nero d’Avola en, op de Etna, nerello mascalese zijn de bekendste rode druiven. Het grootste deel van deze rij is nog onze eigen schatting.',
    refs:[{ kort:'Etna Rosso', label:'een Etna Rosso', w:R('rood', 'Etna Rosso', ['nerello mascalese']) }] },
  rioja: { slug:'rioja', naam:'Rioja', land:'Spanje', in:'in de Rioja',
    intro:'Rioja is tempranillo, vaak met garnacha erbij, en kent een indeling naar rijping: crianza, reserva en gran reserva. Een gran reserva heeft jaren gerijpt voor hij de bodega verlaat en gaat daarna nog lang mee. De app gebruikt deze rij ook voor Navarra en de buurstreken Cariñena, Campo de Borja en Somontano.',
    refs:[{ kort:'gran reserva', label:'een Rioja gran reserva', w:R('rood', 'Rioja Gran Reserva', ['tempranillo']) },
          { kort:'crianza of reserva', label:'een Rioja crianza of reserva', w:R('rood', 'Rioja Crianza', ['tempranillo']) }] },
  ribera: { slug:'ribera-del-duero', naam:'Ribera del Duero en Toro', land:'Spanje',
    intro:'Ribera del Duero en Toro liggen hoog op de Castiliaanse hoogvlakte langs de Duero en maken krachtige rode wijn van tempranillo, daar tinto fino en tinta de Toro genoemd. Vorst is er een bekend risico.',
    refs:[{ kort:'Ribera del Duero', label:'een Ribera del Duero', w:R('rood', 'Ribera del Duero', ['tempranillo']) },
          { kort:'Toro', label:'een Toro', w:R('rood', 'Toro', ['tempranillo']) }] },
  priorat: { slug:'priorat', naam:'Priorat en Montsant', land:'Spanje',
    intro:'Priorat maakt geconcentreerde rode wijn van garnacha en cariñena op leisteen, en Montsant ligt er als een ring omheen. De app gebruikt deze rij ook voor de rest van Catalonië, zoals Penedès en cava.',
    refs:[{ kort:'Priorat', label:'een Priorat', w:R('rood', 'Priorat', ['garnacha', 'cariñena']) }] },
  spanje_wit: { slug:'noordwest-spanje', naam:'Noordwest-Spanje', land:'Spanje', in:'in het noordwesten van Spanje',
    intro:'Het groene noordwesten van Spanje is een andere wereld dan de rest van het land: albariño in Rías Baixas, godello in Valdeorras en mencía in Bierzo en Ribeira Sacra. De app gebruikt deze rij ook voor Rueda en zijn verdejo, al ligt dat verder landinwaarts.',
    refs:[{ kort:'Rías Baixas', label:'een albariño uit Rías Baixas', w:R('wit', 'Rías Baixas', ['albariño']) },
          { kort:'Bierzo', label:'een mencía uit Bierzo', w:R('rood', 'Bierzo', ['mencía']) }] },
  douro_port: { slug:'port', naam:'port', titelnaam:'port', land:'Portugal', in:'in de Douro',
    intro:'Een vintage port komt alleen uit jaren die een huis goed genoeg vindt; dat heet declareren. Zo’n port gaat decennia mee. Deze rij geldt voor port. De stille rode Douro heeft een eigen pagina, omdat een goed portjaar en een goed jaar voor tafelwijn niet altijd samenvallen.',
    refs:[{ kort:'vintage port', label:'een vintage port', w:R('versterkt', 'Porto', ['touriga nacional'], { name:'Vintage Port' }) },
          { kort:'LBV', label:'een LBV (late bottled vintage)', w:R('versterkt', 'Porto', ['touriga nacional'], { name:'LBV' }) }] },
  douro: { slug:'douro', naam:'Douro (stille wijn)', kortnaam:'Douro', land:'Portugal', in:'in de Douro',
    intro:'De stille rode Douro komt van dezelfde druiven als port, zoals touriga nacional en touriga franca, en wordt gewoon uitgegist tot droge wijn. Het oordeel over een jaar kan daarom afwijken van dat voor port.',
    refs:[{ kort:'rode Douro', label:'een rode Douro', w:R('rood', 'Douro', ['touriga nacional', 'touriga franca']) }] },
  dao_bairrada: { slug:'dao-bairrada', naam:'Dão en Bairrada', land:'Portugal', in:'in de Dão en Bairrada',
    intro:'Dão en Bairrada liggen in het midden van Portugal. De Dão is beschut door bergen en maakt rode wijn van onder meer touriga nacional. Bairrada ligt dichter bij de kust en is de streek van de baga, een druif met veel zuur en tannine die tijd nodig heeft.',
    refs:[{ kort:'rode Dão', label:'een rode Dão', w:R('rood', 'Dão', ['touriga nacional']) }] },
  alentejo: { slug:'alentejo', naam:'Alentejo en het zuiden', land:'Portugal', in:'in de Alentejo',
    intro:'De Alentejo is warm en uitgestrekt, met rode wijn van onder meer aragonez, trincadeira en alicante bouschet. De app gebruikt deze rij ook voor Tejo, Lisboa en Setúbal.',
    refs:[{ kort:'rode Alentejo', label:'een rode Alentejo', w:R('rood', 'Alentejo', ['aragonez', 'trincadeira']) }] },
  duitsland: { slug:'duitsland', naam:'Duitsland', land:'Duitsland', in:'in Duitsland',
    intro:'Duitsland is vooral riesling, van droog tot edelzoet. Het zuur maakt riesling geschikt om te bewaren, en wijnen met restzoet, zoals Spätlese en Auslese, kunnen tientallen jaren meegaan.',
    refs:[{ kort:'droge riesling', label:'een droge riesling uit de Moezel, Rheingau, Nahe of Pfalz', w:R('wit', 'Mosel', ['riesling']) },
          { kort:'Spätlese', label:'een riesling Spätlese met restzoet', w:R('zoet', 'Mosel', ['riesling'], { name:'Riesling Spätlese' }) }] },
  oostenrijk: { slug:'oostenrijk', naam:'Oostenrijk', land:'Oostenrijk', in:'in Oostenrijk',
    intro:'Oostenrijk is grüner veltliner en riesling, met de Wachau, het Kremstal en het Kamptal langs de Donau als bekendste streken, en rode wijn van blaufränkisch en zweigelt in het Burgenland. In de Wachau staat Smaragd voor de rijpste droge wijnen.',
    refs:[{ kort:'Wachau Smaragd', label:'een Smaragd uit de Wachau', w:R('wit', 'Wachau', ['grüner veltliner'], { name:'Smaragd' }) },
          { kort:'grüner veltliner', label:'een grüner veltliner uit het Kamptal of Kremstal', w:R('wit', 'Kamptal', ['grüner veltliner']) }] },
  napa: { slug:'napa-valley', naam:'Napa Valley', land:'Verenigde Staten', in:'in Napa Valley',
    intro:'Napa Valley is de bekendste wijnvallei van Californië, met cabernet sauvignon als hoofddruif. Het weer is er stabieler dan in veel Europese streken; hitte en bosbranden zijn de risico’s die een jaar kunnen kleuren.',
    refs:[{ kort:'Napa cabernet', label:'een cabernet sauvignon uit Napa Valley', w:R('rood', 'Napa Valley', ['cabernet sauvignon']) }] },
  sonoma: { slug:'sonoma', naam:'Sonoma County', land:'Verenigde Staten', in:'in Sonoma',
    intro:'Sonoma ligt ten westen van Napa en is gevarieerder: koel bij de kust en in de Russian River Valley, waar pinot noir en chardonnay groeien, en warmer in Alexander Valley en Dry Creek, waar cabernet sauvignon en zinfandel staan.',
    refs:[{ kort:'cabernet', label:'een cabernet sauvignon uit Alexander Valley', w:R('rood', 'Alexander Valley', ['cabernet sauvignon']) },
          { kort:'pinot noir', label:'een pinot noir uit de Russian River Valley', w:R('rood', 'Russian River Valley', ['pinot noir']) }] },
  ca_kust: { slug:'californie-centrale-kust', naam:'Californische centrale kust', kortnaam:'centrale kust', land:'Verenigde Staten', in:'aan de centrale kust van Californië',
    intro:'De centrale kust van Californië loopt van Monterey tot Santa Barbara. Paso Robles is warm en maakt vooral stevige rode wijn. Santa Barbara County en de Santa Lucia Highlands zijn koeler en bekend om pinot noir en chardonnay.',
    refs:[{ kort:'Paso Robles', label:'een cabernet sauvignon uit Paso Robles', w:R('rood', 'Paso Robles', ['cabernet sauvignon']) },
          { kort:'pinot noir', label:'een pinot noir uit Santa Barbara County', w:R('rood', 'Santa Barbara County', ['pinot noir']) }] },
  oregon: { slug:'oregon', naam:'Oregon', land:'Verenigde Staten', in:'in Oregon',
    intro:'Oregon, en vooral de Willamette Valley, is de pinot noir-streek van de Verenigde Staten. Het klimaat is koeler dan in Californië, en de jaren lopen daardoor verder uiteen.',
    refs:[{ kort:'pinot noir', label:'een pinot noir uit de Willamette Valley', w:R('rood', 'Willamette Valley', ['pinot noir']) }] },
  washington: { slug:'washington', naam:'Washington State', land:'Verenigde Staten', in:'in Washington State',
    intro:'Washington State maakt de meeste wijn in het droge oosten van de staat, in de Columbia Valley en rond Walla Walla, met cabernet sauvignon, merlot en syrah als belangrijkste rode druiven.',
    refs:[{ kort:'cabernet', label:'een cabernet sauvignon uit de Columbia Valley', w:R('rood', 'Columbia Valley', ['cabernet sauvignon']) }] },
  australie_za: { slug:'zuid-australie', naam:'Zuid-Australië', land:'Australië', in:'in Zuid-Australië',
    intro:'Zuid-Australië omvat de warme Barossa Valley en McLaren Vale, bekend om shiraz, maar ook koelere streken als de Adelaide Hills, de Clare en Eden Valley met hun riesling, en Coonawarra met cabernet sauvignon.',
    refs:[{ kort:'Barossa shiraz', label:'een shiraz uit de Barossa Valley', w:R('rood', 'Barossa Valley', ['shiraz']) },
          { kort:'McLaren Vale', label:'een shiraz uit McLaren Vale', w:R('rood', 'McLaren Vale', ['shiraz']) }] },
  australie_wa: { slug:'west-australie', naam:'West-Australië', land:'Australië', in:'in West-Australië',
    intro:'West-Australië is voor wijnliefhebbers vooral Margaret River, bekend om cabernet sauvignon en chardonnay, met de koelere Great Southern verder naar het zuiden. De Indische Oceaan tempert het klimaat.',
    refs:[{ kort:'cabernet', label:'een cabernet sauvignon uit Margaret River', w:R('rood', 'Margaret River', ['cabernet sauvignon']) },
          { kort:'chardonnay', label:'een chardonnay uit Margaret River', w:R('wit', 'Margaret River', ['chardonnay']) }] },
  australie_vic: { slug:'victoria-tasmanie', naam:'Victoria en Tasmanië', land:'Australië', in:'in Victoria en Tasmanië',
    intro:'Victoria en Tasmanië zijn de koele kant van Australië: pinot noir en chardonnay uit de Yarra Valley, het Mornington Peninsula en Tasmanië, en shiraz uit Heathcote en de Grampians.',
    refs:[{ kort:'shiraz', label:'een shiraz uit Heathcote', w:R('rood', 'Heathcote', ['shiraz']) },
          { kort:'pinot noir', label:'een pinot noir uit de Yarra Valley', w:R('rood', 'Yarra Valley', ['pinot noir']) }] },
  nieuwzeeland: { slug:'nieuw-zeeland', naam:'Nieuw-Zeeland', land:'Nieuw-Zeeland', in:'in Nieuw-Zeeland',
    intro:'Nieuw-Zeeland is bekend om sauvignon blanc uit Marlborough en pinot noir uit Central Otago en Martinborough. De meeste sauvignon blanc is gemaakt om jong te drinken; pinot noir heeft meer tijd.',
    refs:[{ kort:'pinot noir', label:'een pinot noir uit Central Otago', w:R('rood', 'Central Otago', ['pinot noir']) },
          { kort:'sauvignon blanc', label:'een sauvignon blanc uit Marlborough', w:R('wit', 'Marlborough', ['sauvignon blanc']) }] },
  zuidafrika: { slug:'zuid-afrika', naam:'Zuid-Afrika', land:'Zuid-Afrika', in:'in Zuid-Afrika',
    intro:'Zuid-Afrika maakt de meeste kwaliteitswijn in de West-Kaap, met Stellenbosch voor cabernet sauvignon en blends, het Swartland voor chenin blanc en syrah, en het koelere Elgin en Hemel-en-Aarde.',
    refs:[{ kort:'cabernet', label:'een cabernet sauvignon uit Stellenbosch', w:R('rood', 'Stellenbosch', ['cabernet sauvignon']) },
          { kort:'chenin blanc', label:'een chenin blanc uit het Swartland', w:R('wit', 'Swartland', ['chenin blanc']) }] },
  argentinie: { slug:'argentinie', naam:'Argentinië', land:'Argentinië', in:'in Argentinië',
    intro:'Argentinië is malbec, vooral uit Mendoza, waar de wijngaarden hoog tegen de Andes liggen. Hogere delen zoals de Uco-vallei geven frissere wijn. In het noorden ligt Salta, met nog hogere wijngaarden en de witte torrontés.',
    refs:[{ kort:'malbec', label:'een malbec uit Mendoza', w:R('rood', 'Mendoza', ['malbec']) }] },
  chili_kust: { slug:'chili-kust', naam:'Chileense kuststreken', kortnaam:'Chileense kust', land:'Chili', in:'in de Chileense kuststreken',
    intro:'De Chileense kuststreken, zoals Casablanca, San Antonio met Leyda, en Limarí, worden gekoeld door de Stille Oceaan en maken vooral sauvignon blanc, chardonnay en pinot noir.',
    refs:[{ kort:'pinot noir', label:'een pinot noir uit Casablanca of Leyda', w:R('rood', 'Casablanca', ['pinot noir']) },
          { kort:'sauvignon blanc', label:'een sauvignon blanc uit Casablanca of Leyda', w:R('wit', 'Casablanca', ['sauvignon blanc']) }] },
  chili_centraal: { slug:'chili-centrale-vallei', naam:'Chileense centrale vallei', kortnaam:'centrale vallei', land:'Chili', in:'in de centrale vallei van Chili',
    intro:'De centrale vallei van Chili, met Maipo, Colchagua en Cachapoal, is warmer dan de kust en maakt het grootste deel van de rode wijn van het land, van cabernet sauvignon, carmenère en syrah.',
    refs:[{ kort:'cabernet of carmenère', label:'een cabernet sauvignon of carmenère uit Maipo of Colchagua', w:R('rood', 'Colchagua', ['cabernet sauvignon']) }] },
};
/* Land per rij, ook voor rijen zonder eigen pagina (die staan in het overzicht). */
const LAND = {
  corsica:'Frankrijk', puglia:'Italië', campanie:'Italië', sardinie:'Italië', zuiditalie:'Italië', italie_no:'Italië',
  lombardije:'Italië', italie_midden:'Italië', emilia_liguria:'Italië', spanje_midden:'Spanje', jerez:'Spanje',
  vinho_verde:'Portugal', madeira:'Portugal', portugal:'Portugal', tokaj:'Hongarije', santorini:'Griekenland',
  griekenland_noord:'Griekenland', griekenland_zuid:'Griekenland', griekenland:'Griekenland', ca_noord:'Verenigde Staten',
  californie:'Verenigde Staten', usa_oost:'Verenigde Staten', canada:'Canada', australie_nsw:'Australië', australie:'Australië',
  chili_zuid:'Chili', chili:'Chili',
};
const LANDEN = ['Frankrijk', 'Italië', 'Spanje', 'Portugal', 'Duitsland', 'Oostenrijk', 'Hongarije', 'Griekenland',
  'Verenigde Staten', 'Canada', 'Argentinië', 'Chili', 'Australië', 'Nieuw-Zeeland', 'Zuid-Afrika'];

/* ---------- 3. rekenen ---------- */
const NU = new Date().getFullYear();
const DATUM = new Date().toISOString().slice(0, 10);
const BRON_KORT = { 2:'twee bronnen', 1:'één bron', 0:'eigen schatting' };
const BRON_LANG = { 2:'tegen twee onafhankelijke bronnen gelegd', 1:'op één betrouwbare bron gebaseerd', 0:'nog een eigen schatting, niet nagetrokken' };
const kaal = l => l.replace(/^(de|het) /, '');
const hoofd = s => s.charAt(0).toUpperCase() + s.slice(1);
const lijstZin = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' en ' + a[a.length - 1];
const jarenZin = js => {
  /* aaneengesloten jaren als reeks: 2015, 2016, 2017 → 2015 tot en met 2017 */
  const uit = []; let i = 0;
  while(i < js.length){ let j = i; while(j + 1 < js.length && js[j + 1] === js[j] + 1) j++;
    uit.push(j - i >= 2 ? `${js[i]} tot en met ${js[j]}` : j > i ? `${js[i]}, ${js[j]}` : `${js[i]}`); i = j + 1; }
  return lijstZin(uit.join(', ').split(', '));
};

const rijen = STREKEN.map(st => {
  const jaren = Object.keys(JAARTABEL[st.k]).map(Number).sort((a, b) => a - b);
  const bronnen = jaren.map(j => (JAARBRON[st.k] || {})[j] || 0);
  const cfg = REGIO[st.k];
  const n2 = bronnen.filter(b => b === 2).length, n1 = bronnen.filter(b => b === 1).length;
  const pagina = !!cfg && jaren.length >= MIN_JAREN && (n2 + n1) >= MIN_BRON;
  return { st, cfg, jaren, n2, n1, pagina, land: cfg ? cfg.land : LAND[st.k] };
});
for(const r of rijen){
  if(!r.land) throw new Error(`geen land voor ${r.st.k}`);
  if(r.cfg && !r.pagina) console.warn(`let op: ${r.st.k} heeft een configuratie maar haalt de drempel niet`);
  if(!r.cfg && r.jaren.length >= MIN_JAREN && r.n1 + r.n2 >= MIN_BRON) console.warn(`let op: ${r.st.k} haalt de drempel maar heeft nog geen tekst in REGIO; geen pagina gemaakt`);
}
for(const k of Object.keys(REGIO)) if(!STREKEN.some(s => s.k === k)) throw new Error(`REGIO.${k} bestaat niet meer in STREKEN`);

function vensters(r){
  return r.cfg.refs.map(ref => {
    const st = streekVan({ ...ref.w, name: ref.w.name || '' });
    if(!st || st.k !== r.st.k) throw new Error(`voorbeeldfles "${ref.label}" valt in ${st ? st.k : 'geen streek'} in plaats van ${r.st.k}`);
    const perJaar = {};
    for(const j of r.jaren){ const v = estimateWindow({ ...ref.w, vintage: j }); perJaar[j] = { van: v.from, tot: v.to, soort: v.soort }; }
    return { ...ref, perJaar, soort: perJaar[r.jaren[0]].soort };
  });
}

/* ---------- 4. html ---------- */
const NIVEAU_SVG = n => `<svg class="nv" width="44" height="8" viewBox="0 0 44 8" aria-hidden="true">${[0,1,2,3,4].map(i =>
  `<rect x="${i * 9}" y="0" width="7" height="8" rx="1" class="${i < n ? 'aan' : 'uit'}"/>`).join('')}</svg>`;

const CSS_STREEK = `
.nv{display:inline-block;vertical-align:middle;margin-right:8px}
.nv .aan{fill:var(--acc)} .nv .uit{fill:var(--line)}
.jt{width:100%;border-collapse:collapse;margin:10px 0 18px;font-size:15.5px}
.jt th{font-family:var(--sc);font-variant:small-caps;text-transform:lowercase;letter-spacing:.1em;font-weight:500;color:var(--gold);text-align:left;padding:8px 12px 8px 0;border-bottom:1px solid var(--rule);font-size:16px;vertical-align:bottom;line-height:1.25}
.jt td{padding:9px 12px 9px 0;border-bottom:1px solid var(--line);vertical-align:middle}
.jt td:last-child,.jt th:last-child{padding-right:0}
.jt .jr{font-family:var(--serif);font-size:19px;font-variant-numeric:lining-nums tabular-nums}
.jt .vn{font-variant-numeric:tabular-nums;color:var(--ink2);white-space:nowrap}
.jt .vn.nu{color:var(--ink);font-weight:600}
.jt .nr{white-space:nowrap}
.jt .br{color:var(--ink2);font-size:14px}
.jt .br.b0{color:var(--ink3);font-style:italic}
.legenda{font-size:14px;color:var(--ink2)}
.schaal{list-style:none;margin:8px 0 18px}
.schaal li{display:flex;align-items:center;gap:4px;padding:6px 0;border-top:1px solid var(--line);font-size:15.5px}
.schaal li:last-child{border-bottom:1px solid var(--line)}
.schaal b{font-weight:600;min-width:7.5em}
.tekst ul.schaal li{padding-left:0}
.tekst ul.schaal li::before{display:none}
@media (max-width:640px){
  .jt thead{display:none}
  .jt tr{display:grid;grid-template-columns:3.2em minmax(0,1fr) auto;column-gap:10px;row-gap:2px;padding:11px 0;border-bottom:1px solid var(--line)}
  .jt td{border:0;padding:0}
  .jt .jr{grid-column:1;grid-row:1 / span 3;align-self:start;line-height:1.3}
  .jt .wd{grid-column:2;grid-row:1;white-space:nowrap}
  .jt .br{grid-column:3;grid-row:1;text-align:right;align-self:center}
  .jt .va{grid-column:2 / -1;grid-row:2}
  .jt .vb{grid-column:2 / -1;grid-row:3}
  .jt .vn{white-space:normal}
  .jt .vn::before{content:attr(data-k) ': ';font-weight:400;color:var(--ink3);font-size:13.5px}
}
.overzicht{list-style:none;margin:6px 0 10px}
.overzicht li{border-top:1px solid var(--line);padding:12px 0}
.overzicht li:last-child{border-bottom:1px solid var(--line)}
.overzicht a{font-family:var(--serif);font-size:20px;line-height:1.3;text-decoration:none}
.overzicht a:hover{color:var(--acc)}
.overzicht .feit{display:block;font-size:14.5px;color:var(--ink2);margin-top:2px}
.tekst ul.overzicht li{padding-left:0}
.tekst ul.overzicht li::before{display:none}
`;

const naamVan = r => r.cfg ? r.cfg.naam : hoofd(kaal(r.st.l));
const inVan = r => (r.cfg && r.cfg.in) || ('in ' + r.st.l.replace(/ \((rood|wit|port|stille wijn)\)$/, ''));

function streekPagina(r, alle){
  const { st, cfg, jaren } = r;
  const vs = vensters(r);
  const naam = cfg.naam, kort = cfg.kortnaam || naam, tnaam = cfg.titelnaam || kort;
  const pad = `/jaargangen/${cfg.slug}/`;
  const titel = [`Wijnjaren ${tnaam}: goede jaren en wanneer op dronk`, `Wijnjaren ${tnaam}: goede jaren en drinkvensters`,
    `Wijnjaren ${tnaam}: welk jaar is goed?`, `Wijnjaren ${tnaam}`].find(t => t.length <= 60);
  const a = vs[0];
  const besch = [
    `Wijnjaren ${kort} van ${jaren[0]} tot ${jaren.at(-1)}: per jaar het oordeel, wanneer ${a.label} op dronk is en of het jaar is nagetrokken.`,
    `Wijnjaren ${kort} van ${jaren[0]} tot ${jaren.at(-1)}: per jaar het oordeel, het drinkvenster en of het jaar tegen bronnen is gelegd.`,
    `Wijnjaren ${kort}: per jaar het oordeel, het drinkvenster en of het jaar tegen bronnen is gelegd.`].find(t => t.length <= 155);
  const stappen = [{ naam:'CellarMentor', pad:'/start/' }, { naam:'Wijnjaren', pad:'/jaargangen/' }, { naam: kort, pad }];

  /* in het kort */
  const per = n => jaren.filter(j => JAARTABEL[st.k][j] === n);
  const s5 = per(5), s4 = per(4), s1 = per(1), s2 = per(2);
  const op = jaren.filter(j => a.perJaar[j].van <= NU && NU <= a.perJaar[j].tot);
  const jong = jaren.filter(j => a.perJaar[j].van > NU);
  const kortZin = [];
  const n0 = jaren.length - r.n2 - r.n1;
  kortZin.push(`De tabel heeft een oordeel over ${jaren.length} jaargangen ${inVan(r)}, van ${jaren[0]} tot ${jaren.at(-1)}. Hoe hard die oordelen zijn: ${r.n2} tegen twee onafhankelijke bronnen gelegd, ${r.n1} op één betrouwbare bron gebaseerd, ${n0} nog een eigen schatting.`);
  const regels = [];
  if(s5.length) regels.push(`<li><b>Uitzonderlijk:</b> ${jarenZin(s5)}</li>`);
  if(s4.length) regels.push(`<li><b>Sterk:</b> ${jarenZin(s4)}</li>`);
  if(s2.length) regels.push(`<li><b>Wisselend:</b> ${jarenZin(s2)}</li>`);
  if(s1.length) regels.push(`<li><b>Moeilijk:</b> ${jarenZin(s1)}</li>`);
  const opZin = op.length
    ? `Op dronk in ${NU} volgens de rekenregels van de app, voor ${a.label}: ${jarenZin(op)}.`
    : `Voor ${a.label} valt in ${NU} geen jaar uit deze tabel binnen het venster dat de app rekent.`;
  const jongZin = jong.length ? ` Nog te jong: ${jarenZin(jong)}.` : '';

  /* de tabel */
  const twee = vs.length > 1;
  const kopRij = `<tr><th scope="col">Jaar</th><th scope="col">Jaargang</th>${vs.map(v => `<th scope="col">Op dronk<br>${esc(v.kort)}</th>`).join('')}<th scope="col">Onderbouwing</th></tr>`;
  const body = [...jaren].reverse().map(j => {
    const n = JAARTABEL[st.k][j], b = (JAARBRON[st.k] || {})[j] || 0;
    const cel = (v, cls) => { const p = v.perJaar[j]; const nu = p.van <= NU && NU <= p.tot;
      return `<td class="vn ${cls}${nu ? ' nu' : ''}" data-k="${esc(v.kort)}"><span class="nr">${p.van}–${p.tot}</span></td>`; };
    return `<tr><td class="jr">${j}</td><td class="wd">${NIVEAU_SVG(n)}${JAAR_WOORD[n]}</td>${cel(vs[0], 'va')}${twee ? cel(vs[1], 'vb') : ''}<td class="br b${b}" title="${esc(BRON_LANG[b])}">${BRON_KORT[b]}</td></tr>`;
  }).join('\n');

  const uitgevers = Object.entries(UITGEVERS[st.k] || {}).sort((x, y) => y[1] - x[1]).map(([u]) => u);
  const buren = alle.filter(x => x.pagina && x.land === r.land && x !== r);

  const inhoud = `<div class="wrap smal">
${kruimpad(stappen)}
<div class="kop">
  <div class="eyebrow">Wijnjaren · ${esc(r.land)}</div>
  <h1>Wijnjaren ${esc(tnaam)}: welk jaar is goed, en wanneer is hij op dronk</h1>
  <p class="sub">${esc(cfg.intro)}</p>
  ${STAND ? `<p class="meta">Tabelstand ${esc(STAND)} · pagina bijgewerkt ${esc(datumNL(DATUM))}</p>` : ''}
</div>
<div class="tekst">
<h2>In het kort</h2>
<p>${esc(kortZin.join(' '))}</p>
${regels.length ? `<ul>${regels.join('')}</ul>` : ''}
<p>${esc(opZin + jongZin)}</p>

<h2>Alle jaren op een rij</h2>
<p class="legenda">Het oordeel per jaar, met het drinkvenster dat de app rekent voor ${esc(lijstZin(vs.map(v => v.label)))}. Een venster in het vet bevat ${NU}. De laatste kolom zegt hoe hard het oordeel is: twee bronnen (${esc(BRON_LANG[2])}), één bron (${esc(BRON_LANG[1])}) of eigen schatting (nog niet nagetrokken).</p>
<table class="jt">
<thead>${kopRij}</thead>
<tbody>
${body}
</tbody>
</table>
<p class="legenda">Jaren die er niet staan, hebben in de app geen oordeel. Dat is met opzet: liever niets zeggen dan gokken. Zo’n jaar telt als gewoon jaar en verandert het venster niet.</p>

${kader('midden', 'Je eigen flessen', 'Scan het etiket van een fles en CellarMentor legt deze tabel ernaast, samen met de soort wijn en wat je zelf over de fles weet. Je ziet meteen of hij nu open kan of nog moet wachten.')}

<h2>Zo komt dit tot stand</h2>
<p>De jaargangtabel is van CellarMentor zelf. Per streek en per jaar staat er één woord: uitzonderlijk, sterk, klassiek, wisselend of moeilijk. Dat woord vat samen wat gepubliceerde bronnen kwalitatief over de oogst zeggen. Er zitten geen punten van critici in, en we nemen geen scorekaart van één uitgever over.</p>
<ul class="schaal">
${[5,4,3,2,1].map(n => `<li>${NIVEAU_SVG(n)}<b>${JAAR_WOORD[n]}</b>${{5:'een van de beste jaren van de generatie',4:'ruim boven gemiddeld',3:'goed, zonder uitschieters',2:'selectie nodig, veel producenten haalden het niet',1:'misoogst door vorst, hagel, rot of regen'}[n]}</li>`).join('\n')}
</ul>
<p>Het drinkvenster begint bij de soort fles. ${esc(hoofd(a.label))} valt in de app onder “${esc(a.soort)}”${twee ? `, ${esc(vs[1].label)} onder “${esc(vs[1].soort)}”` : ''}. Daarna weegt de jaargang mee: een uitzonderlijk jaar rekt de bewaartijd met een kwart en begint later, een moeilijk jaar maakt hem ongeveer een derde korter. Hoe dat precies werkt, staat in <a href="/gids/drinkvenster/">wanneer is een wijn op dronk</a>, en hoe lang de verschillende soorten meegaan in <a href="/gids/hoe-lang-wijn-bewaren/">hoe lang kun je wijn bewaren</a>.</p>
<p>Bij elk jaar staat hoe hard het oordeel is. ${esc(hoofd(BRON_LANG[2]))} betekent dat minstens twee uitgevers die los van elkaar staan hetzelfde beeld geven. ${esc(hoofd(BRON_LANG[1]))} betekent één terugkijkende proeverij of jaargangstaat van een vakblad of handelaar. Bij een eigen schatting is het jaar nog niet nagetrokken; de app zet daar in je kelder een vraagteken achter.${uitgevers.length ? ` Voor deze streek zijn onder meer ${esc(lijstZin(uitgevers.slice(0, 6)))} gelezen.` : ''}</p>
<p>Waar het ophoudt: het oordeel geldt voor de streek, niet voor een producent. Een goede maker haalt in een moeilijk jaar meer dan een slordige in een groot jaar, en hoe een fles heeft gelegen weegt zwaarder dan allebei. Ligt het venster achter je, dan is de fles daarmee niet bedorven. De app zegt dan eerst “Op z’n rijpst” en pas later “Over de piek?”, en je kunt het venster altijd zelf aanpassen. Wil je weten hoe je flessen het beste liggen, lees dan <a href="/gids/wijn-bewaren-thuis/">wijn bewaren thuis</a>.</p>
</div>

${buren.length ? `<section class="verder"><div class="eyebrow">Meer uit ${esc(r.land)}</div><ul>${buren.map(x => `<li><a href="/jaargangen/${x.cfg.slug}/">Wijnjaren ${esc(x.cfg.naam)}<span>${x.jaren.length} jaren, ${x.jaren[0]} tot ${x.jaren.at(-1)}</span></a></li>`).join('')}
<li><a href="/jaargangen/">Alle streken<span>het overzicht van de wijnjarentabel</span></a></li></ul></section>`
  : `<section class="verder"><div class="eyebrow">Verder</div><ul><li><a href="/jaargangen/">Alle streken<span>het overzicht van de wijnjarentabel</span></a></li></ul></section>`}
</div>
${slot('Welke fles <em>moet er vanavond open?</em>', 'Scan er één, dan weet je het. Gratis, in je browser, zonder account.')}`;

  return pagina({ pad, titel, beschrijving: besch, ogType: 'website', css: CSS_STREEK,
    ld: [breadcrumbLd(stappen)], inhoud });
}

function datumNL(iso){
  const M = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${M[m - 1]} ${y}`;
}

function overzicht(alle){
  const pad = '/jaargangen/';
  const stappen = [{ naam:'CellarMentor', pad:'/start/' }, { naam:'Wijnjaren', pad }];
  const met = alle.filter(r => r.pagina), zonder = alle.filter(r => !r.pagina);
  const totJ = alle.reduce((s, r) => s + r.jaren.length, 0), tot2 = alle.reduce((s, r) => s + r.n2, 0), tot1 = alle.reduce((s, r) => s + r.n1, 0);
  const blok = land => {
    const rs = met.filter(r => r.land === land); if(!rs.length) return '';
    return `<h2>${esc(land)}</h2><ul class="overzicht">${rs.map(r => {
      const top = r.jaren.filter(j => JAARTABEL[r.st.k][j] === 5);
      return `<li><a href="/jaargangen/${r.cfg.slug}/">${esc(r.cfg.naam)}</a><span class="feit">${r.jaren.length} jaren, ${r.jaren[0]} tot ${r.jaren.at(-1)}; ${r.n2 + r.n1} nagetrokken.${top.length ? ` Uitzonderlijk: ${esc(top.slice(-6).join(', '))}${top.length > 6 ? ' en eerder' : ''}.` : ''}</span></li>`;
    }).join('')}</ul>`;
  };
  const zonderTekst = zonder.map(r => r.jaren.length ? `${hoofd(kaal(r.st.l))}` : `${hoofd(kaal(r.st.l))} (nog leeg)`);
  const inhoud = `<div class="wrap smal">
${kruimpad(stappen)}
<div class="kop">
  <div class="eyebrow">Wijnjarentabel</div>
  <h1>Wijnjaren per streek: welk jaar is goed, en wanneer drink je hem</h1>
  <p class="sub">De jaargangtabel van CellarMentor, per streek een pagina. Per jaar één woord voor de oogst, het drinkvenster van een omschreven voorbeeldfles, en eerlijk erbij of dat oordeel is nagetrokken.</p>
  ${STAND ? `<p class="meta">Tabelstand ${esc(STAND)} · pagina bijgewerkt ${esc(datumNL(DATUM))}</p>` : ''}
</div>
<div class="tekst">
<p>De app kent ${STREKEN.length} streken en ${totJ} jaargangen. Van die jaargangen zijn er ${tot2} tegen twee onafhankelijke bronnen gelegd en ${tot1} op één betrouwbare bron gebaseerd; de rest is nog een eigen schatting. Hieronder staan de ${met.length} streken met een eigen pagina. Een streek krijgt die pas als er minstens één jaar is nagetrokken; anders zou de pagina alleen onze eigen schatting herhalen.</p>
<p>Wat de woorden betekenen en hoe een jaargang het drinkvenster verschuift, lees je in <a href="/gids/drinkvenster/">wanneer is een wijn op dronk</a>.</p>
${LANDEN.map(blok).join('\n')}
<h2>Nog zonder eigen pagina</h2>
<p>Deze streken herkent de app wel, maar hun jaren zijn nog niet tegen bronnen gelegd, of de rij is nog leeg: ${esc(lijstZin(zonderTekst))}. In de app krijgt een fles uit zo’n streek een oordeel met een vraagteken erachter, of geen oordeel. Een lege rij is met opzet leeg: zolang er niets betrouwbaars over te zeggen is, zegt de app niets.</p>
</div>
${kader('midden', 'Je eigen kelder', 'Scan een etiket en CellarMentor zoekt de streek en de jaargang erbij, rekent het drinkvenster uit en laat zien waar dat vandaan komt.')}
</div>
${slot('Welke fles <em>moet er vanavond open?</em>', 'Scan er één, dan weet je het. Gratis, in je browser, zonder account.')}`;
  return pagina({ pad, titel:'Wijnjarentabel: goede wijnjaren per streek', ogType:'website', css: CSS_STREEK,
    beschrijving:`Wijnjaren per streek uit de tabel van CellarMentor: per jaar het oordeel, het drinkvenster en of het oordeel tegen bronnen is gelegd.`,
    ld:[breadcrumbLd(stappen)], inhoud });
}

/* ---------- 5. schrijven ---------- */
const UIT = HIER;
/* streekmappen die niet meer gemaakt worden (bijvoorbeeld na een hernoemde slug) worden gemeld, niet gewist */
const nieuw = new Set(rijen.filter(r => r.pagina).map(r => r.cfg.slug));
for(const d of fs.readdirSync(UIT, { withFileTypes: true }))
  if(d.isDirectory() && !nieuw.has(d.name)) console.warn(`let op: jaargangen/${d.name}/ wordt niet meer gebouwd; haal hem weg als dat klopt`);
let n = 0;
for(const r of rijen.filter(r => r.pagina)){
  schrijf(path.join(UIT, r.cfg.slug, 'index.html'), streekPagina(r, rijen));
  n++;
}
schrijf(path.join(UIT, 'index.html'), overzicht(rijen));
const urls = schrijfSitemap(ROOT, DATUM);
console.log(`${n} streekpagina's en het overzicht geschreven (${STREKEN.length} streken in de tabel, tabelstand ${STAND || 'onbekend'}); sitemapvoorstel met ${urls} adressen.`);
console.log('zonder pagina:', rijen.filter(r => !r.pagina).map(r => r.st.k).join(', '));
