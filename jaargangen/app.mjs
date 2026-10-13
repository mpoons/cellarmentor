/* De rekenregels en de jaargangtabel van de app, letterlijk uit cellarmentor.html geknipt en in een
   vm-sandbox uitgevoerd. Zo staat er nergens een kopie van de tabel of de formules: wat de app rekent,
   rekenen deze pagina's ook. Het knippen gaat per declaratie op topniveau (const, let, function):
   vanaf de regel waarop hij begint, tot het eerste stuk dat als JavaScript compileert. Daardoor hoeft
   dit niets te weten over haakjes in strings of regexen. Loopt een uitdrukking door op de volgende
   regel (".replace(...)"), dan gaat die regel mee. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const NODIG = ['norm', 'YR', 'JAAR_WOORD', 'JAAR_FACTOR', 'JAAR_START', 'STREKEN', 'JAARBRON', 'JAARTABEL',
  'streekTekst', '_streekCache', 'streekVan', 'jaargangOordeel', 'G_LONG_WHITE', 'G_LIGHT_RED', 'G_BIG_RED',
  'R_BIG', 'R_WHITE_LONG', 'PRESTIGE', 'VROEG', 'EDELZOET', 'vensterAnker', 'vensterBasis', 'estimateWindow'];

export function laadApp(root){
  const bron = fs.readFileSync(path.join(root, 'cellarmentor.html'), 'utf8');
  const compileert = code => { try{ new vm.Script(code); return true; }catch(e){ return false; } };
  const knip = naam => {
    const m = new RegExp(`^(?:const|let|function)\\s+${naam}\\b`, 'm').exec(bron);
    if(!m) throw new Error(`${naam} niet gevonden in cellarmentor.html`);
    const regels = bron.slice(m.index).split('\n');
    let stuk = '';
    for(let i = 0; i < regels.length && i < 4000; i++){
      stuk += (i ? '\n' : '') + regels[i];
      if(!compileert(stuk)) continue;
      const volgende = regels.slice(i + 1).find(r => r.trim() !== '') || '';
      if(/^\s*(\.|\?|:|\+|-|\*|&&|\|\|)/.test(volgende)) continue;
      return stuk;
    }
    throw new Error(`${naam}: geen compileerbaar einde gevonden`);
  };
  const code = NODIG.map(knip).join('\n') +
    '\n({ STREKEN, JAARTABEL, JAARBRON, JAAR_WOORD, JAAR_FACTOR, JAAR_START, streekVan, jaargangOordeel, estimateWindow });';
  return vm.runInNewContext(code, {}, { filename: 'cellarmentor.html (geknipt)' });
}
