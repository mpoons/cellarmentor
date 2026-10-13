// CellarMentor Fase 2 — abonnement starten en beheren (Stripe Checkout + klantportaal)
// Plaatsen via: Supabase dashboard → Edge Functions → Deploy new function
//   → naam: billing   → deze code plakken → Deploy
// "Verify JWT" LAAT AANSTAAN: alleen ingelogde gebruikers mogen dit aanroepen.
//
// Vereiste secrets (Edge Functions → Secrets):
//   STRIPE_SECRET_KEY   = sk_live_... (of sk_test_... om te proberen)
//   STRIPE_PRICE_PLUS   = price_...   (het €2,99/maand-abonnement uit Stripe → Products)
// Optioneel (v100, marketingplan sectie 1c):
//   STRIPE_PRICE_PLUS_JAAR = price_... (jaarabonnement; zonder dit secret valt 'jaar' terug op de maandprijs)
//   PLUS_PROEF_DAGEN       = 7         (proefperiode in dagen; leeg of 0 = geen proef)
//   CAVEAU_APP_URL      = https://cellarmentor.com/   (waar Stripe naartoe terugstuurt)

import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (o: unknown, status: number) =>
  new Response(JSON.stringify(o), { status, headers: { ...CORS, 'content-type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2025-10-29.clover' })
    const appUrl = Deno.env.get('CAVEAU_APP_URL') || 'https://cellarmentor.com/'
    const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const jwt = (req.headers.get('authorization') || '').replace('Bearer ', '')
    const { data: { user }, error: authErr } = await supa.auth.getUser(jwt)
    if (authErr || !user) return json({ error: 'Niet ingelogd' }, 401)

    const { action, periode } = await req.json().catch(() => ({ action: '', periode: '' }))

    let { data: prof } = await supa.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    if (!prof) {
      const ins = await supa.from('profiles').insert({ user_id: user.id }).select().single()
      prof = ins.data
    }

    // Eén Stripe-klant per CellarMentor-account, zodat opzeggen en opnieuw starten blijft kloppen.
    let customerId: string | null = prof?.stripe_customer_id || null
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      await supa.from('profiles').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
    }

    if (action === 'checkout') {
      // Jaar alleen als die prijs er is; anders de maand, zodat een oude app of een ontbrekend secret nooit een fout geeft.
      const jaarPrijs = Deno.env.get('STRIPE_PRICE_PLUS_JAAR')
      const perJaar = periode === 'jaar' && !!jaarPrijs
      const proef = Math.max(0, Math.min(30, parseInt(Deno.env.get('PLUS_PROEF_DAGEN') || '0', 10) || 0))
      // De herkomst uit de aanmelding (utm, bezoekers-id) gaat mee, zodat de webhook een betaling
      // kan terugleggen op de bron (tabel events, sectie 1a van het marketingplan). Stripe-metadata: max 500 tekens per waarde.
      const m = (user.user_metadata || {}) as Record<string, unknown>
      const kort = (v: unknown) => (typeof v === 'string' ? v.slice(0, 80) : '')
      const herkomst: Record<string, string> = { user_id: user.id, periode: perJaar ? 'jaar' : 'maand' }
      for (const k of ['aid', 'src', 'med', 'cmp', 'inh']) if (kort(m[k])) herkomst[k] = kort(m[k])
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        client_reference_id: user.id,
        line_items: [{ price: perJaar ? jaarPrijs! : Deno.env.get('STRIPE_PRICE_PLUS')!, quantity: 1 }],
        metadata: herkomst,
        subscription_data: { metadata: herkomst, ...(proef ? { trial_period_days: proef } : {}) },
        allow_promotion_codes: true,
        success_url: appUrl + '?plus=ok',
        cancel_url: appUrl + '?plus=annuleer',
      })
      return json({ url: session.url }, 200)
    }

    if (action === 'portal') {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: appUrl,
      })
      return json({ url: session.url }, 200)
    }

    return json({ error: 'Onbekende actie' }, 400)
  } catch (e) {
    console.error('billing', String((e as Error)?.message || e).slice(0, 300))
    return json({ error: 'Er ging iets mis aan onze kant. Probeer het zo nog eens' }, 500)
  }
})
