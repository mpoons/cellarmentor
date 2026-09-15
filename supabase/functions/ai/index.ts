// CellarMentor AI-proxy: gewogen credits, de zoekagent voor prijzen en de gedeelde prijstabel.
// Uitrollen: supabase functions deploy ai --project-ref dbzgrkipcoebglacsqwe
// Vereist secret: CAVEAU_ANTHROPIC_KEY (aparte Anthropic-sleutel voor de server).
// "Verify JWT" laten aanstaan: alleen ingelogde CellarMentor-gebruikers kunnen deze functie aanroepen.
// Vereist de SQL uit supabase/sql/*.sql (wine_prices, wine_price_log, boek_credits, ai_fouten).

import { createClient } from 'npm:@supabase/supabase-js@2'

// Welke soorten verzoeken de app kent. Alles daarbuiten is geen CellarMentor-verkeer en krijgt 400.
// De soort komt in ai_usage.kind en in de kostenmail, dus hij mag geen vrije tekst zijn.
const KINDS = new Set(['ai', 'scan', 'herbereken', 'pairing', 'wijnkaart', 'gerechten', 'vraag', 'waardes', 'recept', 'import', 'smaak',
  'prijs', 'prijsdiep', 'prijscache', 'betaald'])

// Tegoed in CREDITS, niet in acties: een kaartscan kost nu eenmaal veel meer dan een etiketscan.
const FREE_CREDITS = 20    // gratis credits per maand
const PLUS_CREDITS = 300   // CellarMentor Plus (€2,99/mnd)
const DAY_CREDITS  = 60    // anti-misbruik per dag (geldt niet voor 'unlimited')

// Grenzen aan wat één credit mag kosten. De client bepaalt de inhoud, dus de server
// begrenst: bodygrootte, tekstlengte, aantal beelden, geen documenten (PDF's).
const MAX_BODY = 8_000_000      // bytes; zes kaartpagina's van 1568 px passen ruim
const MAX_TEXT = 30_000         // tekens tekst per verzoek
const MAX_IMAGES = 8
const MAX_MESSAGES = 2
const B64_PER_CREDIT = 700_000  // een etiket (1400 px) blijft 1 credit, een kaartpagina wordt 2

// Wat een actie kost. Moet gelijk blijven aan creditCost() in cellarmentor.html.
function creditsFor(kind: string, images: number): number {
  if (kind === 'wijnkaart') return Math.max(2, images * 2)
  if (kind === 'prijs') return 1          // zoeklaag: één Brave-zoekopdracht plus Haiku op de fragmenten, rond een cent
  if (kind === 'prijsdiep') return 5      // zoekagent met webtool: gemeten ± $0,06 met Haiku en drie zoekrondes
  return Math.max(1, images)
}
type Blok = { type?: string; text?: string; source?: { data?: string } }
function meet(messages: unknown) {
  let images = 0, docs = 0, tekst = 0, b64 = 0
  for (const m of (messages as { content?: unknown }[]) || []) {
    const c = m?.content
    if (typeof c === 'string') { tekst += c.length; continue }
    if (!Array.isArray(c)) continue
    for (const b of c as Blok[]) {
      if (b?.type === 'image') { images++; b64 += String(b.source?.data || '').length }
      else if (b?.type === 'text') tekst += String(b.text || '').length
      else docs++
    }
  }
  return { images, docs, tekst, b64 }
}

// Alles draait op Sonnet 5, behalve prijzen: die plukt Haiku 4.5 uit zoekresultaten.
const MODEL_DEFAULT = 'claude-sonnet-5'
const MODEL_BY_KIND: Record<string, string> = { prijs: 'claude-haiku-4-5', prijsdiep: 'claude-haiku-4-5' }
// Zoeklaag: hoogstens zoveel Brave-zoekopdrachten per dag, over alle gebruikers. Brave rekent
// zonder plafond af, dus het plafond staat hier.
const BRAVE_DAG_MAX = 400
// Wijnsites waar de zoekagent mag kijken: minder ruis, minder tokens, en een bron-URL
// die we vertrouwen (de gedeelde tabel neemt alleen adressen op deze domeinen op).
const PRIJS_SITES = ['wine-searcher.com', 'idealwine.com', 'vivino.com', 'cellartracker.com', 'gall.nl', 'grandcruwijnen.nl', 'wijnvoordeel.nl',
  'wijnbeurs.nl', 'drankdozijn.nl', 'bestofwines.com', 'topwijnen.be', 'vinatis.com', 'millesima.com', 'vino.com', 'catawiki.com', 'winedecider.com']
const STIJL = ' Schrijf in gewone zinnen met komma\'s en punten. Gebruik geen gedachtestreepjes en vermijd de constructie "niet X, maar Y".'

// Prijstabel: een opgezochte prijs blijft staan, met datum; de app toont "gegevens van <maand>".
// Wie een ouder datapunt wil verversen stuurt refresh:true mee.
type Wijn = { name?: unknown; producer?: unknown; vintage?: unknown; appellation?: unknown; region?: unknown; country?: unknown; est?: unknown }
const tekstVeld = (x: unknown, n = 120) => String(x ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, n)
function prijsSleutel(w: Wijn): string {
  const n = (x: unknown) => String(x || '').toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
  const jaar = Number(w.vintage) || 0
  return `${n(w.producer)}|${n(w.name)}|${jaar || 'nv'}`
}
// De opdracht voor de zoekagent wordt hier gebouwd, niet door de client: anders kan
// een gebruiker het model laten zeggen wat hij wil en dat in de gedeelde tabel zetten.
function prijsPrompt(w: Wijn): string {
  const naam = tekstVeld(w.name), prod = tekstVeld(w.producer), jaar = Number(w.vintage) || null
  const wie = `${naam}${prod && prod !== naam ? ', ' + prod : ''}, jaargang ${jaar || 'NV'}, ${[tekstVeld(w.appellation), tekstVeld(w.region), tekstVeld(w.country)].filter(Boolean).join(', ') || 'herkomst onbekend'}`
  const zoek = [prod, naam, jaar].filter(Boolean).join(' ')
  return `Zoek de actuele marktprijs in euro's van deze wijn: ${wie}.
Zo werk je: zoek eerst met de zoekfunctie op "${zoek} prix" (Franse en Nederlandse handels tonen euro's). Levert dat geen prijs op, zoek dan op "${[prod, naam].filter(Boolean).join(' ')} prijs" zonder jaargang, en als laatste op "${zoek} price". Een prijs die in een zoekresultaat staat telt, je hoeft de pagina niet te openen. Let op de flesmaat: Quarts de Chaume, Sauternes, Tokaji en veel zoete wijnen worden vaak per 50 cl of 37,5 cl verkocht. Zet de maat die je bij de prijs zag in size_seen en reken de prijs om naar 75 cl (50 cl × 1,5; 37,5 cl × 2; magnum ÷ 2), inclusief btw. Zie je geen maat, ga dan uit van 75 cl.
Regels voor het antwoord, in deze volgorde:
1. Vind je een prijs van precies jaargang ${jaar || 'NV'}: geef die, confidence "hoog".
2. Vind je alleen andere jaargangen van dezelfde wijn: geef VERPLICHT de prijs van de dichtstbijzijnde jaargang, zet die jaargang in vintage_found en confidence "middel". Dit is geen mislukking, dit is het gewenste antwoord. Nooit value null zolang je van deze wijn een prijs van welke jaargang dan ook hebt gezien.
3. Vind je alleen een prijs in dollars, ponden of franken: gebruik die, reken om naar euro (1 USD = 0,92 EUR, 1 GBP = 1,17 EUR, 1 CHF = 1,05 EUR), zet de oorspronkelijke prijs en munt in note en confidence "middel". Een Amerikaanse prijs is beter dan geen prijs.
4. Alleen als je van deze wijn helemaal geen enkele prijs vindt, in welke munt dan ook: {"value":null,"note":"reden"}.
Antwoord als allerlaatste met alleen dit JSON-object, zonder tekst ervoor of erna en zonder codeblok:
{"value":42,"low":38,"high":48,"source":"naam van de winkel of site","url":"adres van de pagina waar de prijs staat","vintage_found":2014,"size_seen":"75cl|50cl|37.5cl|magnum|onbekend","confidence":"hoog|middel|laag","note":"één korte zin in het Nederlands over waar de prijs vandaan komt, met de flesmaat als die geen 75 cl was"}${STIJL}`
}
// De goedkope zoeklaag: één zoekopdracht bij Brave, daarna leest Haiku de prijs uit de
// fragmenten. Geen webtool, geen paginabezoek; de bron-URL komt uit de zoekresultaten zelf,
// dus die kan het model niet verzinnen.
type Treffer = { title: string; url: string; desc: string }
async function braveZoek(w: Wijn): Promise<Treffer[]> {
  const key = Deno.env.get('BRAVE_SEARCH_KEY')
  if (!key) return []
  const q = [tekstVeld(w.producer), tekstVeld(w.name), Number(w.vintage) || ''].filter(Boolean).join(' ') + ' prijs'
  const u = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=10&country=NL&search_lang=nl&text_decorations=false&extra_snippets=true`
  try {
    const r = await fetch(u, { headers: { 'Accept': 'application/json', 'X-Subscription-Token': key }, signal: AbortSignal.timeout(8000) })
    if (!r.ok) { console.error('brave', r.status); return [] }
    const d = await r.json()
    // deno-lint-ignore no-explicit-any
    return ((d?.web?.results || []) as any[]).slice(0, 10).map((x) => ({
      title: tekstVeld(x.title, 160), url: String(x.url || '').slice(0, 500),
      desc: tekstVeld([x.description, ...(Array.isArray(x.extra_snippets) ? x.extra_snippets : [])].filter(Boolean).join(' '), 700),
    })).filter((t) => /^https?:\/\//.test(t.url))
  } catch (e) { console.error('brave', String((e as Error)?.message || e).slice(0, 120)); return [] }
}
function leesPrompt(w: Wijn, treffers: Treffer[]): string {
  const naam = tekstVeld(w.name), prod = tekstVeld(w.producer), jaar = Number(w.vintage) || null
  const wie = `${naam}${prod && prod !== naam ? ', ' + prod : ''}, jaargang ${jaar || 'NV'}`
  const lijst = treffers.map((t, i) => `${i + 1}. ${t.title} | ${t.url} | ${t.desc}`).join('\n')
  return `Hieronder staan zoekresultaten over deze wijn: ${wie}. Haal er de actuele winkelprijs per fles van 75 cl in euro's uit.
Regels, in deze volgorde:
1. Alleen bedragen die letterlijk in een resultaat staan en die over precies deze wijn (zelfde producent en cuvée) gaan. Twijfel je of het dezelfde wijn is, laat het resultaat weg.
2. Liefst jaargang ${jaar || 'NV'}: confidence "hoog". Alleen andere jaargangen gezien: neem de dichtstbijzijnde, zet die in vintage_found en confidence "middel". Dit is geen mislukking.
3. Winkelprijzen gaan vóór veilingbiedingen. Meerdere winkelprijzen: value is de middelste, low en high de laagste en hoogste.
4. Flesmaat: 50 cl × 1,5, 37,5 cl × 2, magnum ÷ 2; zet wat je zag in size_seen. Dollars of ponden: omrekenen (1 USD = 0,92 EUR, 1 GBP = 1,17 EUR), confidence "middel".
5. Zet in result het nummer van het resultaat waar de prijs vandaan komt.
6. Geen bruikbare prijs: {"value":null,"note":"reden"}.
Antwoord met alleen dit JSON-object, zonder tekst ervoor of erna:
{"value":42,"low":38,"high":48,"result":3,"vintage_found":${jaar || 'null'},"size_seen":"75cl|50cl|37.5cl|magnum|onbekend","confidence":"hoog|middel|laag","note":"één korte zin in het Nederlands over waar de prijs vandaan komt"}${STIJL}

${lijst}`
}
function tekstUit(data: { content?: { type?: string; text?: string }[] }): string {
  return (data?.content || []).filter((b) => b.type === 'text').map((b) => b.text || '').join('')
}
function jsonUit(txt: string): Record<string, unknown> | null {
  const m = txt.match(/\{[^{}]*"value"[^{}]*\}/g)
  if (m && m.length) { try { return JSON.parse(m[m.length - 1]) } catch { /* val terug */ } }
  const a = txt.indexOf('{'), z = txt.lastIndexOf('}')
  if (a < 0 || z <= a) return null
  try { return JSON.parse(txt.slice(a, z + 1)) } catch { return null }
}
// Alleen https-adressen op de toegestane wijnsites komen in de gedeelde tabel.
function okUrl(u: unknown): string {
  try {
    const x = new URL(String(u || ''))
    if (x.protocol !== 'https:' && x.protocol !== 'http:') return ''
    return PRIJS_SITES.some((h) => x.hostname === h || x.hostname.endsWith('.' + h)) ? x.href.slice(0, 500) : ''
  } catch { return '' }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (o: unknown, status: number) =>
  new Response(JSON.stringify(o), { status, headers: { ...CORS, 'content-type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  let boekId: string | null = null
  const boekWeg = async () => { if (boekId) { const id = boekId; boekId = null; await supa.from('ai_usage').delete().eq('id', id) } }
  // Een mislukte aanroep verwijdert zijn eigen verbruiksregel, dus zonder dit logboek ziet de
  // kostenmail een stille week terwijl elke gebruiker "Fout bij de AI" krijgt. Geen gebruikers-id.
  let soort = 'ai'
  const logFout = async (status: number, tekst: string) => {
    try {
      await supa.from('ai_fouten').insert({ kind: soort, status, tekst: tekst.slice(0, 300) })
      await supa.from('ai_fouten').delete().lt('created_at', new Date(Date.now() - 90 * 864e5).toISOString())
    } catch (_) { /* logboek is bijzaak, en de tabel kan nog ontbreken */ }
  }
  try {
    const jwt = (req.headers.get('authorization') || '').replace('Bearer ', '')
    const { data: { user }, error: authErr } = await supa.auth.getUser(jwt)
    if (authErr || !user) return json({ error: 'Niet ingelogd' }, 401)

    // profiel ophalen of aanmaken
    let { data: prof } = await supa.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    if (!prof) {
      const ins = await supa.from('profiles').insert({ user_id: user.id }).select().single()
      prof = ins.data
    }

    const raw = await req.text()
    if (raw.length > MAX_BODY) return json({ error: 'Verzoek te groot' }, 413)
    let body: Record<string, unknown> | null = null
    try { body = JSON.parse(raw) } catch { body = null }
    if (!body || typeof body !== 'object') return json({ error: 'Ongeldig verzoek' }, 400)
    const kind = String(body.kind || 'ai').slice(0, 30)
    if (!KINDS.has(kind)) return json({ error: 'Ongeldig verzoek' }, 400)
    soort = kind

    // Gemeenschapsprijzen: wat iemand betaalde, één regel per gebruiker per wijn. Alleen als de
    // gebruiker dat in Instellingen aanzet. Geen AI, geen credit. Anderen zien pas iets bij twee
    // of meer gebruikers, en dan alleen laag/hoog/midden.
    if (kind === 'betaald') {
      const w = (body.wine && typeof body.wine === 'object') ? body.wine as Wijn : null
      const prijs = Number(body.price)
      if (!w || !tekstVeld(w.name) || !(prijs > 0 && prijs < 100000)) return json({ error: 'Ongeldig verzoek' }, 400)
      try {
        const { error } = await supa.from('wine_paid').upsert({ key: prijsSleutel(w), name: tekstVeld(w.name, 200), producer: tekstVeld(w.producer, 200),
          vintage: Number(w.vintage) || null, price: Math.round(prijs * 100) / 100, user_id: user.id, created_at: new Date().toISOString() }, { onConflict: 'key,user_id' })
        if (error) { console.error('wine_paid', error.message); return json({ ok: false }, 200) }
      } catch (e) { console.error('wine_paid', String((e as Error)?.message || e).slice(0, 200)); return json({ ok: false }, 200) }
      return json({ ok: true }, 200)
    }

    // Gratis: alleen de prijstabel raadplegen, voor een lijst flessen (nieuwe scan of hele kelder).
    // Geen Anthropic-aanroep, geen credit.
    if (kind === 'prijscache') {
      const lijst: Wijn[] = Array.isArray(body.wines) ? (body.wines as Wijn[]).slice(0, 100) : []
      if (!lijst.length) return json({ prices: [] }, 200)
      try {
        const keys = [...new Set(lijst.map(prijsSleutel))]
        const { data: rows } = await supa.from('wine_prices').select('*').in('key', keys)
        const vers = (rows || []).filter((r) => r.value != null)
        await Promise.all(vers.map((r) => supa.from('wine_prices').update({ hits: (r.hits || 0) + 1 }).eq('key', r.key)))
        // gemeenschapsprijzen erbij: samengevoegd, en alleen bij twee of meer verschillende gebruikers
        let paid: unknown[] = []
        try {
          const { data: prows } = await supa.from('wine_paid').select('key, price, user_id, created_at').in('key', keys)
          const per: Record<string, { ps: number[]; users: Set<string>; at: string }> = {}
          for (const r of (prows || []) as { key: string; price: number; user_id: string; created_at: string }[]) {
            const p = per[r.key] || (per[r.key] = { ps: [], users: new Set(), at: '' })
            p.ps.push(Number(r.price)); p.users.add(r.user_id); if (r.created_at > p.at) p.at = r.created_at
          }
          // Tegen foute of kwaadwillende invoer: uitschieters (meer dan 2,5× of minder dan 0,4× de
          // mediaan) tellen niet mee, en pas vanaf twee overgebleven gebruikers komt er iets terug.
          // De client neemt het cijfer pas als waarde over vanaf drie; bij twee is het alleen ter info.
          paid = Object.entries(per).map(([key, p]) => {
            const alle = p.ps.slice().sort((a, b) => a - b)
            const med0 = alle[Math.floor(alle.length / 2)]
            const s = alle.filter((x) => x >= med0 * 0.4 && x <= med0 * 2.5)
            if (s.length < 2 || p.users.size < 2) return null
            return { key, n: Math.min(p.users.size, s.length), low: s[0], high: s[s.length - 1], med: s[Math.floor(s.length / 2)], at: p.at }
          }).filter(Boolean)
        } catch (_) { /* tabel nog niet aangemaakt */ }
        return json({ prices: vers.map((r) => ({ key: r.key, value: r.value, low: r.low, high: r.high, source: r.source, url: r.url,
          vintage_found: r.vintage_found, confidence: r.confidence, note: r.note, at: r.updated_at })), paid }, 200)
      } catch (_) { return json({ prices: [] }, 200) }
    }

    if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) return json({ error: 'Ongeldig verzoek' }, 400)
    const m = meet(body.messages)
    if (m.docs > 0 || m.images > MAX_IMAGES || m.tekst > MAX_TEXT) return json({ error: 'Verzoek te groot' }, 413)

    // zoekagent: alleen voor prijzen; de server bouwt de opdracht en kijkt eerst in de tabel
    const web = body.web === true && (kind === 'prijs' || kind === 'prijsdiep')
    const wijn: Wijn | null = web && body.wine && typeof body.wine === 'object' && tekstVeld((body.wine as Wijn).name) ? body.wine as Wijn : null
    if (web && !wijn) return json({ error: 'Ongeldig verzoek' }, 400)
    let messages = body.messages
    if (wijn) {
      messages = [{ role: 'user', content: [{ type: 'text', text: prijsPrompt(wijn) }] }]
      if (body.refresh !== true) {
        try {
          const key = prijsSleutel(wijn)
          const { data: row } = await supa.from('wine_prices').select('*').eq('key', key).maybeSingle()
          if (row && row.value != null) {
            await supa.from('wine_prices').update({ hits: (row.hits || 0) + 1 }).eq('key', key)
            const uit = { value: row.value, low: row.low, high: row.high, source: row.source, url: row.url,
              vintage_found: row.vintage_found, confidence: row.confidence, note: row.note, cached: true, at: row.updated_at }
            return json({ content: [{ type: 'text', text: JSON.stringify(uit) }], usage: { input_tokens: 0, output_tokens: 0 }, cached: true }, 200)
          }
        } catch (_) { /* tabel onbereikbaar: dan gewoon zoeken */ }
      }
    }

    // Credits: controle en boeking in één transactie met een slot per gebruiker.
    // De kostprijs volgt wat er werkelijk binnenkomt, niet alleen het opgegeven soort.
    const units = Math.max(creditsFor(kind, m.images), Math.ceil(m.b64 / B64_PER_CREDIT))
    const unlimited = prof?.plan === 'unlimited'
    const limit = prof?.plan === 'plus' ? PLUS_CREDITS : FREE_CREDITS + (prof?.bonus_credits || 0)
    const { data: boek, error: boekErr } = await supa.rpc('boek_credits', {
      p_user: user.id, p_kind: kind, p_units: units, p_limit: limit, p_day: DAY_CREDITS, p_unlimited: unlimited })
    if (boekErr) { console.error('boek_credits', boekErr.message); return json({ error: 'Tegoed kon niet worden geboekt' }, 500) }
    if (boek === '-2') return json({ error: 'Daglimiet bereikt, probeer het morgen weer', code: 'daglimiet' }, 429)
    if (boek === '-1') {
      const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0)
      const { data } = await supa.from('ai_usage').select('cost_units').eq('user_id', user.id).gte('created_at', monthStart.toISOString())
      const used = (data || []).reduce((n: number, r: { cost_units: number | null }) => n + (r.cost_units || 1), 0)
      return json({ error: 'AI-tegoed voor deze maand is op', code: 'quota', used, limit, needed: units }, 402)
    }
    boekId = String(boek)

    // verzoek doorsturen; de server bepaalt model en instellingen
    const wantStream = body.stream === true && !web
    const model = MODEL_BY_KIND[kind] || MODEL_DEFAULT
    // Zoeklaag (kind 'prijs'): Brave zoekt, Haiku leest. Geen sleutel of plafond bereikt: dan
    // valt 'prijs' terug op de zware agent, zodat de app blijft werken.
    let treffers: Treffer[] = []
    let viaBrave = false
    if (wijn && kind === 'prijs' && Deno.env.get('BRAVE_SEARCH_KEY')) {
      let vandaagN = 0
      try {
        const dag = new Date(); dag.setUTCHours(0, 0, 0, 0)
        const { count } = await supa.from('wine_price_log').select('*', { count: 'exact', head: true }).gte('created_at', dag.toISOString()).like('model', '%brave%')
        vandaagN = count || 0
      } catch (_) { /* logboek onbereikbaar: gewoon proberen */ }
      if (vandaagN < BRAVE_DAG_MAX) {
        treffers = await braveZoek(wijn)
        if (treffers.length) { viaBrave = true; messages = [{ role: 'user', content: [{ type: 'text', text: leesPrompt(wijn, treffers) }] }] }
        else {
          // niets gevonden bij Brave: geen AI-aanroep, credit terug, en dat melden
          await boekWeg()
          try { await supa.from('wine_price_log').insert({ key: prijsSleutel(wijn), model: 'brave', status: 204, text: '', value: null, error: 'geen zoekresultaten', tokens_in: 0, tokens_out: 0 }) } catch (_) { /* bijzaak */ }
          return json({ content: [{ type: 'text', text: JSON.stringify({ value: null, note: 'geen zoekresultaten bij wijnhandels' }) }], usage: { input_tokens: 0, output_tokens: 0 } }, 200)
        }
      }
    }
    const payload: Record<string, unknown> = {
      model,
      max_tokens: Math.min(Number(body.max_tokens) || 2000, 4000),
      messages,
      ...(wantStream ? { stream: true } : {}),
    }
    // Sonnet/Opus 5 denken standaard mee in het antwoordbudget; voor JSON zetten we dat uit. Haiku 4.5 kent dat veld anders: weglaten.
    if (!/haiku/.test(model)) payload.thinking = { type: 'disabled' }
    // De webzoekfunctie van de API zelf; Haiku 4.5 kent alleen de basisvariant.
    if (web && !viaBrave) payload.tools = [{ type: /haiku/.test(model) ? 'web_search_20250305' : 'web_search_20260209', name: 'web_search', max_uses: 3, allowed_domains: PRIJS_SITES }]
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': Deno.env.get('CAVEAU_ANTHROPIC_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })
    if (!r.ok || !r.body) {
      const fout = await r.json().catch(() => ({}))
      console.error('anthropic', r.status, JSON.stringify(fout).slice(0, 300))
      await boekWeg()
      await logFout(r.status, JSON.stringify(fout))
      return json({ error: r.status === 429 ? 'De AI is even druk, probeer het zo nog eens' : 'Fout bij de AI', status: r.status }, r.status >= 500 ? 502 : r.status)
    }

    // Streamen: de app vult het etiket in terwijl het antwoord binnenkomt. We laten de
    // gebeurtenissen ongewijzigd door en kijken alleen mee voor het verbruik. De credit is
    // al geboekt; komt er geen enkel stukje tekst (afgebroken vóór het antwoord), dan
    // halen we hem weer weg. Afbreken halverwege blijft betaald: het model heeft gewerkt.
    if (wantStream) {
      const dec = new TextDecoder()
      let inTok = 0, outTok = 0, gotText = false, tail = '', afgerond = false
      const afronden = async () => {
        if (afgerond) return; afgerond = true
        if (!gotText) { await boekWeg(); return }
        if (boekId) await supa.from('ai_usage').update({ tokens_in: inTok, tokens_out: outTok }).eq('id', boekId)
      }
      const spy = new TransformStream({
        transform(chunk, ctrl) {
          ctrl.enqueue(chunk)
          tail += dec.decode(chunk, { stream: true })
          let i: number
          while ((i = tail.indexOf('\n')) >= 0) {
            const line = tail.slice(0, i).trim(); tail = tail.slice(i + 1)
            if (!line.startsWith('data:')) continue
            try {
              const ev = JSON.parse(line.slice(5).trim())
              if (ev.type === 'content_block_delta' && ev.delta?.text) gotText = true
              if (ev.type === 'message_start') inTok = ev.message?.usage?.input_tokens || 0
              if (ev.type === 'message_delta') outTok = ev.usage?.output_tokens || outTok
            } catch (_) { /* halve regel: die maakt de volgende ronde af */ }
          }
        },
        flush: afronden,
        cancel: afronden,
      })
      return new Response(r.body.pipeThrough(spy), {
        status: 200,
        headers: { ...CORS, 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
      })
    }

    const data = await r.json()
    if (boekId) await supa.from('ai_usage').update({ tokens_in: data?.usage?.input_tokens || 0, tokens_out: data?.usage?.output_tokens || 0 }).eq('id', boekId)
    if (wijn) {
      const txt = tekstUit(data)
      const p = jsonUit(txt)
      // zoeklaag: de bron is het genummerde zoekresultaat, nooit een adres uit het model zelf
      if (p && viaBrave) {
        const t = treffers[Number(p.result) - 1]
        if (t) { p.url = t.url; try { p.source = new URL(t.url).hostname.replace(/^www\./, '') } catch { p.source = t.url.slice(0, 60) } }
        else { p.url = ''; p.source = 'zoekresultaat' }
      }
      const v = p ? Number(p.value) : NaN
      const goed = !!p && Number.isFinite(v) && v > 0 && v < 100000 && ['hoog', 'middel'].includes(String(p.confidence || ''))
      // logboek zonder gebruikers-id, en oude regels opruimen
      try {
        const logRij = { key: prijsSleutel(wijn), model: viaBrave ? model + '+brave' : model, status: r.status, text: txt.slice(0, 6000),
          value: goed ? v : null, error: p ? null : 'geen JSON', tokens_in: data?.usage?.input_tokens || 0, tokens_out: data?.usage?.output_tokens || 0 }
        // Meting: wat de scanner schatte naast wat de zoekagent vond. Zolang de kolom `schatting`
        // nog niet bestaat (SQL in supabase/sql/schatting-3sep.sql) valt de insert terug op de oude rij.
        const est = Number(wijn.est)
        const schatting = Number.isFinite(est) && est > 0 && est < 100000 ? est : null
        const { error: logErr } = await supa.from('wine_price_log').insert({ ...logRij, schatting })
        if (logErr) await supa.from('wine_price_log').insert(logRij)
        await supa.from('wine_price_log').delete().lt('created_at', new Date(Date.now() - 30 * 864e5).toISOString())
      } catch (_) { /* logboek is bijzaak */ }
      // gevonden prijs delen, alleen na controle: echt getal, geloofwaardige zekerheid, bron op een bekende site
      if (goed && p) {
        try {
          await supa.from('wine_prices').upsert({
            key: prijsSleutel(wijn), user_id: user.id,
            name: tekstVeld(wijn.name, 200), producer: tekstVeld(wijn.producer, 200), vintage: Number(wijn.vintage) || null,
            value: v, low: Number.isFinite(Number(p.low)) ? Number(p.low) : null, high: Number.isFinite(Number(p.high)) ? Number(p.high) : null,
            // ook op het Brave-pad alleen een link naar een bekende wijnsite; een andere bron houdt zijn naam, zonder link
            source: tekstVeld(p.source, 120), url: okUrl(p.url), vintage_found: Number(p.vintage_found) || null,
            confidence: tekstVeld(p.confidence, 10), note: tekstVeld(p.note, 300), updated_at: new Date().toISOString(),
          })
        } catch (e) { console.error('wine_prices upsert', String((e as Error)?.message || e).slice(0, 200)) }
      }
    }
    return json(data, 200)
  } catch (e) {
    console.error('ai', String((e as Error)?.message || e).slice(0, 300))
    await boekWeg()
    await logFout(0, String((e as Error)?.message || e))
    return json({ error: 'Er ging iets mis aan onze kant. Probeer het zo nog eens' }, 500)
  }
})
