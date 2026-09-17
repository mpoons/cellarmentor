const fs=require('fs'), vm=require('vm');
const opslag=new Map();
const localStorage={getItem:k=>opslag.has(k)?opslag.get(k):null,setItem:(k,v)=>opslag.set(k,String(v)),removeItem:k=>opslag.delete(k)};
const leegEl=()=>({dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},setAttribute(){},getAttribute:()=>null,hasAttribute:()=>false,appendChild(){},remove(){},innerHTML:'',textContent:'',value:''});
const document={documentElement:{dataset:{},lang:''},body:leegEl(),title:'',querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){},createElement:leegEl};
const ctx={console,setTimeout,clearTimeout,setInterval,clearInterval,Date,Math,JSON,Number,String,Array,Object,Boolean,RegExp,Map,Set,Promise,Error,TypeError,RangeError,parseInt,parseFloat,isNaN,isFinite,encodeURIComponent,decodeURIComponent,atob:()=>'',btoa:()=>'',URL,URLSearchParams,TextDecoder,TextEncoder,crypto,Uint8Array,Uint32Array,Float32Array,localStorage,document,addEventListener(){},removeEventListener(){},location:{hostname:'localhost',hash:'',search:'',origin:'http://localhost',pathname:'/',host:'localhost'},history:{pushState(){},replaceState(){},go(){},state:null},navigator:{userAgent:'node',maxTouchPoints:0,platform:'node'},matchMedia:()=>({matches:false}),requestAnimationFrame:f=>f(),fetch:()=>Promise.reject(new Error('x'))};
ctx.window=ctx;ctx.self=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app-blok.js','utf8'), ctx);
// Bouwt bronnen/huiszinnen-decanter.json: één zin per huis, met de streek die de app zelf bepaalt.
const C=vm.runInContext('({streekVan,STREKEN})',ctx);
const ruw=JSON.parse(fs.readFileSync('huis-ruw.json','utf8'));
const ROMMEL=/(newsletter|Future brands|Image credit|Scroll down|Copy link|Pinterest|preferred source|Join Decanter|Sign in|Subscribe|View all|tasting notes and scores|Share this article|Follow us|privacy policy|terms and conditions|advertise|cookies|\| Decanter|Read more|Related |See also|Click here|affiliate commission)/i;
const LIJST=/([A-ZÀ-Ü][\w'’\-]+(?: [A-ZÀ-Ü][\w'’\-]+)*,\s*){3,}/;
// Koppen van een opsomming lekken mee als staart van een zin: "... a more classic balance is found
// in the wines.' Top picks: Château Margaux, Château d'Issan, Château Palmer."
const OPSOMKOP=/\b(top picks?|best wines?|recommended|also tasted|highlights|wines to try|see also)\s*:/i;
const ZEGT=/\b(says|said|explains|explained|recalls|recalled|notes|noted|asserts|adds|added|points out|argues|believes|describes|reports|acknowledges|concurs|admits|according to|is|are|was|were|has|have|had|makes|made|produces|produced|shows|showed|lies|sits|covers|planted|picked|harvested|ferments?|ages|aged|blend)\b/i;
// Een zin die met een verwijswoord begint hangt aan de zin ervoor. Bij een zin die onder een kop
// met de huisnaam staat is dat verleidelijk om toch te nemen ("Fita Preta" / "It was founded in
// 2004"), maar onder een fles mist de lezer waar "it" naar wijst.
const VERWIJST=/^(it|its|they|their|these|those|he|she|his|her|there|such|this|that)\b/i;
// Bij een zin onder een kop ook: een aanhefwoord dat terugwijst naar de zin ervoor, en een
// werkwoord voorop zonder onderwerp ("Has all the estate's signature fragrance").
const HANGT=/^(so|but|and|yet|then|however|meanwhile|instead|also|still|though|besides|moreover|has|have|had|is|are|was|were|offers?|shows?|comes?|brings?|makes?|gives?|delivers?|remains?|feels?|tastes?|sits?)\b/i;
// en de zin moet ergens naar het huis wijzen; anders is het een zin over de streek die toevallig
// onder een portretkop stond ("For centuries, the Douro Superior was a seat of agriculture").
const HUISWOORD=/\b(estate|domaine|winery|cellars?|property|vineyards?|family|label|wines?|winemaker|owner|owned|founded|planted|farms?|hectares?|\dha|its|his|her|their)\b/i;
// Een enkele kop staat vetgedrukt binnen dezelfde alinea en is dus geen bloktag: "Canalicchio di
// Sopra Despite a striking new bottling..." Begint een zin met de huisnaam en dan meteen een woord
// waarmee geen naam verdergaat, dan is dat zo'n kop en gaat hij eraf.
const AANHEF=/^(despite|one|two|three|a|an|after|although|as|at|by|during|from|in|since|while|with|without|for|not|now|then|there|here|both|many|most|some|when|where|what|how|why|run|owned|located|founded|acquired|known|situated|planted|grown|established|co-founded)\b/i;
function stripKop(z, naam){
  const i=z.indexOf(naam);
  if(i!==0) return z;
  let r=z.slice(naam.length).replace(/^[\s,;:\u2013\u2014-]+/, '');
  // een cuvée- of plaatsnaam achter de huisnaam hoort bij de kop: "San Filippo, La Lucère One of..."
  const m=r.match(/^((?:[A-ZÀ-Ü][\w'\u2019-]*\s+){0,3})(.*)$/s);
  for(const kandidaat of [r, m ? m[2] : '']){
    if(kandidaat && AANHEF.test(kandidaat) && /^[A-ZÀ-Ü]/.test(kandidaat)) return kandidaat;
  }
  return z;
}
const TYPE=['rood','wit','zoet','mousserend','versterkt'];
const kaartNamen={};
for(const [u,l] of Object.entries(ruw)) kaartNamen[u]=[...new Set(l.map(x=>x.naam))];
const per={}; let schoon=0, weg=0, geenStreek=0;
for(const [url,lijst] of Object.entries(ruw)){
  for(const x of lijst){
    // Een weggehaalde link laat dubbele spaties achter: "as cool as  Bordeaux ,"
    const z=stripKop(x.zin.replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim(), x.naam);
    // is de kop er net afgehaald, dan noemt de zin het huis niet meer en gelden dezelfde
    // regels als voor een zin die onder een kop stond
    const via=z!==x.zin?'kop':(x.via||'zin');
    if(ROMMEL.test(z)||LIJST.test(z)||OPSOMKOP.test(z)||!ZEGT.test(z)||!/^[A-ZÀ-Ü‘"“]/.test(z)){weg++;continue;}
    // Alleen bij een zin die onder een kop stond: daar is "it" nergens naar terug te leiden. Staat
    // de huisnaam in de zin zelf, dan is er niets mis met "It certainly seems criminal to shout
    // about drinking Domaine Tempier's rosé as soon as it is launched".
    if(via==='kop'&&(VERWIJST.test(z)||HANGT.test(z)||!HUISWOORD.test(z))){weg++;continue;}
    // Een alinea die op een dubbele punt eindigt loopt door in het blok eronder; wat we hier
    // hebben is dan een halve gedachte.
    if(!/[.!?][’”"')\]]?$/.test(z)){weg++;continue;}
    // De zin moet over dít huis gaan. Noemt hij er drie of meer, dan is het een overzicht; staat de
    // naam pas in de tweede helft, dan is het huis een bijzin en niet het onderwerp.
    const andere=(kaartNamen[url]||[]).filter(nm=>nm!==x.naam&&new RegExp('(?<![A-Za-z])'+nm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z])').test(z));
    if(andere.length>=2){weg++;continue;}
    // Een zin die onder een kop met de huisnaam stond noemt dat huis zelf niet. Noemt hij een
    // ánder huis uit ditzelfde artikel, dan gaat hij over dat andere huis en niet over dit.
    if(via==='kop'&&andere.length){weg++;continue;}
    // Staat de naam pas in de tweede helft, dan is het huis een bijzin en niet het onderwerp.
    // Een zin die onder een kop met de naam staat noemt hem niet en heeft die toets niet nodig.
    if(via!=='kop'&&z.indexOf(x.naam)>z.length*0.55){weg++;continue;}
    let st=null;
    for(const t of TYPE){
      st=C.streekVan({type:t,appellation:x.appellatie||'',region:x.streek||'',country:x.land||'',name:'',producer:''});
      if(st) break;
    }
    if(!st){geenStreek++;continue;}
    schoon++;
    const m=(per[st.k]=per[st.k]||{});
    const e=(m[x.naam]=m[x.naam]||[]);
    if(!e.some(y=>y.zin===z)) e.push({zin:z, jaar:x.jaar, via, pad:url.replace('https://www.decanter.com/','')});
  }
}
let huizen=0, zinnen=0;
for(const s of Object.keys(per)){huizen+=Object.keys(per[s]).length; for(const n of Object.keys(per[s])) zinnen+=per[s][n].length;}
console.log(`${schoon} schone zinnen (${weg} afgekeurd, ${geenStreek} zonder streek)`);
console.log(`${zinnen} zinnen over ${huizen} huizen in ${Object.keys(per).length} streken`);
fs.writeFileSync('huis-per-streek.json', JSON.stringify({per_streek:per}, null, 1));
