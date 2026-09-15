// CellarMentor herinnering: hoogstens één mail per week aan wie dat in Instellingen aanzette,
// en alleen als er iets te melden is (op dronk gekomen, drink binnenkort, over de piek).
// Uitrollen: supabase functions deploy herinnering --project-ref dbzgrkipcoebglacsqwe
// Vereist secrets: CRON_SECRET (zelfde waarde als in supabase/sql/herinnering.sql),
//   RESEND_API_KEY (resend.com, met geverifieerd afzenderdomein), MAIL_FROM (bv. "CellarMentor <kelder@voorbeeld.nl>").
// Optioneel: CAVEAU_APP_URL (link onderaan de mail).
// verify_jwt staat uit (config.toml): de aanroep komt van pg_cron, niet van een gebruiker.
// De header x-cron-secret is de toegangscontrole. Met de hand testen:
//   curl -X POST https://dbzgrkipcoebglacsqwe.supabase.co/functions/v1/herinnering -H "x-cron-secret: …"

import { createClient } from 'npm:@supabase/supabase-js@2'

const APP_URL = Deno.env.get('CAVEAU_APP_URL') || 'https://mpoons.github.io/cellarmentor/'
const WACHT_DAGEN = 6.5   // niet vaker dan dit, ook als de cron vaker zou lopen

type Wijn = { name?: string; producer?: string; vintage?: number | null; qty?: number; drinkFrom?: number | null; drinkTo?: number | null; location?: string }
type Stand = 'onb' | 'jong' | 'over' | 'nu' | 'op'

// Zelfde regels als windowStatus() in cellarmentor.html; hier apart, zodat de mail nooit iets anders zegt dan de app.
function stand(w: Wijn, y: number): Stand {
  const f = Number(w.drinkFrom) || 0, t = Number(w.drinkTo) || 0
  if (!f && !t) return 'onb'
  if (f && y < f) return 'jong'
  if (t && y > t) return 'over'
  if (t) {
    const span = Math.max(1, t - (f || t)), rem = t - y
    if (rem <= Math.max(1, Math.round(span * 0.18))) return 'nu'
  }
  return 'op'
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
const naam = (w: Wijn) => [w.name, w.vintage].filter(Boolean).join(' ')
const regel = (w: Wijn) => {
  const extra = [w.producer, w.qty && w.qty > 1 ? `×${w.qty}` : '', w.location].filter(Boolean).join(' · ')
  const venster = w.drinkFrom && w.drinkTo ? `${w.drinkFrom}–${w.drinkTo}` : w.drinkTo ? `t/m ${w.drinkTo}` : ''
  return { kop: naam(w), sub: [extra, venster].filter(Boolean).join(' · ') }
}

function mail(groepen: { titel: string; uitleg: string; wijnen: Wijn[] }[], jaar: number) {
  const tekst: string[] = [], html: string[] = []
  for (const g of groepen) {
    if (!g.wijnen.length) continue
    tekst.push(g.titel.toUpperCase(), g.uitleg, '')
    html.push(`<h2 style="font:600 17px Georgia,serif;margin:22px 0 4px;color:#2B1E23">${esc(g.titel)}</h2><p style="margin:0 0 10px;color:#6B5F63;font-size:13.5px">${esc(g.uitleg)}</p>`)
    for (const w of g.wijnen.slice(0, 12)) {
      const r = regel(w)
      tekst.push(`• ${r.kop}${r.sub ? ' (' + r.sub + ')' : ''}`)
      html.push(`<div style="padding:8px 0;border-top:1px solid #E4D8C2"><div style="font:italic 500 16px Georgia,serif;color:#2B1E23">${esc(r.kop)}</div>${r.sub ? `<div style="font-size:13px;color:#6B5F63">${esc(r.sub)}</div>` : ''}</div>`)
    }
    if (g.wijnen.length > 12) { tekst.push(`… en nog ${g.wijnen.length - 12}`); html.push(`<div style="font-size:13px;color:#6B5F63;padding:6px 0">… en nog ${g.wijnen.length - 12}</div>`) }
    tekst.push('')
  }
  tekst.push(`Open je kelder: ${APP_URL}`, '', 'Je krijgt deze mail omdat je dat in CellarMentor hebt aangezet (Meer, Instellingen, Herinnering per mail). Daar zet je hem ook weer uit.')
  const body = `<div style="background:#F6F1E7;padding:28px 16px;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#2B1E23">
  <div style="max-width:520px;margin:0 auto;background:#FFFCF6;border:1px solid #E4D8C2;padding:26px 24px">
    <div style="font:600 13px Georgia,serif;letter-spacing:.18em;text-transform:uppercase;color:#8E3347">CellarMentor</div>
    <h1 style="font:italic 500 24px Georgia,serif;margin:8px 0 2px">Wat er in ${jaar} om aandacht vraagt</h1>
    ${html.join('')}
    <p style="margin:24px 0 0"><a href="${esc(APP_URL)}" style="display:inline-block;background:#8E3347;color:#FFFCF6;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:600">Open je kelder</a></p>
    <p style="font-size:12px;color:#8A7E71;margin-top:22px;line-height:1.5">Je krijgt deze mail omdat je dat in CellarMentor hebt aangezet (Meer, Instellingen, Herinnering per mail). Daar zet je hem ook weer uit.</p>
  </div></div>`
  return { text: tekst.join('\n'), html: body }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const secret = Deno.env.get('CRON_SECRET')
  if (!secret || req.headers.get('x-cron-secret') !== secret) return new Response('Unauthorized', { status: 401 })
  const resendKey = Deno.env.get('RESEND_API_KEY'), from = Deno.env.get('MAIL_FROM')
  if (!resendKey || !from) { console.error('RESEND_API_KEY of MAIL_FROM ontbreekt'); return new Response('Niet ingericht', { status: 500 }) }

  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: profs, error } = await supa.from('profiles').select('user_id, mail_laatst').eq('mail_herinnering', true)
  if (error) { console.error(error); return new Response('Lezen mislukt', { status: 500 }) }

  const jaar = new Date().getFullYear()
  let verstuurd = 0, stil = 0, mislukt = 0
  for (const p of profs || []) {
    if (p.mail_laatst && Date.now() - new Date(p.mail_laatst).getTime() < WACHT_DAGEN * 86400_000) { stil++; continue }
    const { data: u } = await supa.auth.admin.getUserById(p.user_id)
    const email = u?.user?.email
    if (!email) continue
    const { data: cel } = await supa.from('cellars').select('data').eq('user_id', p.user_id).maybeSingle()
    const wijnen: Wijn[] = Array.isArray(cel?.data?.wines) ? cel.data.wines : []
    const nu: Wijn[] = [], op: Wijn[] = [], over: Wijn[] = []
    for (const w of wijnen) {
      if (!(Number(w.qty) > 0)) continue
      const s = stand(w, jaar)
      if (s === 'nu') nu.push(w)
      else if (s === 'over') over.push(w)
      else if (s === 'op' && Number(w.drinkFrom) === jaar) op.push(w)   // dit jaar het venster in gekomen
    }
    if (!nu.length && !op.length && !over.length) { stil++; continue }
    const sorteer = (a: Wijn, b: Wijn) => (Number(a.drinkTo) || 9999) - (Number(b.drinkTo) || 9999)
    const { text, html } = mail([
      { titel: 'Drink binnenkort', uitleg: 'Het venster van deze flessen loopt op zijn eind. Eerst deze.', wijnen: nu.sort(sorteer) },
      { titel: 'Op dronk gekomen', uitleg: `Sinds ${jaar} klaar om open te gaan.`, wijnen: op.sort(sorteer) },
      { titel: 'Over de piek?', uitleg: 'Het venster is voorbij. Grote bewaarwijnen trekken zich daar weinig van aan; een eenvoudige fles wel.', wijnen: over.sort(sorteer) },
    ], jaar)
    const n = nu.length + op.length + over.length
    const subject = nu.length ? `${nu.length === 1 ? 'Eén fles' : nu.length + ' flessen'} om binnenkort te drinken` : `${n === 1 ? 'Eén fles' : n + ' flessen'} in je kelder vragen om aandacht`
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject, html, text }),
    })
    if (!r.ok) { mislukt++; console.error('mail mislukt', p.user_id, r.status, (await r.text()).slice(0, 200)); continue }
    await supa.from('profiles').update({ mail_laatst: new Date().toISOString() }).eq('user_id', p.user_id)
    verstuurd++
  }
  return Response.json({ verstuurd, stil, mislukt })
})
