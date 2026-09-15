// CellarMentor Fase 2 — Stripe-webhook: zet profiles.plan op 'plus' of terug op 'free'
// Plaatsen via: Supabase dashboard → Edge Functions → Deploy new function
//   → naam: stripe-webhook   → deze code plakken → Deploy
//
// ‼️ ZET "Verify JWT" UIT voor deze functie. Stripe roept hem aan zonder Supabase-token;
//    de echtheid wordt bewezen met de Stripe-handtekening hieronder, niet met een JWT.
//
// Vereiste secrets:
//   STRIPE_SECRET_KEY      = sk_live_... (zelfde als bij 'billing')
//   STRIPE_WEBHOOK_SECRET  = whsec_...   (Stripe → Developers → Webhooks → endpoint toevoegen)
//
// Endpoint-URL in Stripe: https://dbzgrkipcoebglacsqwe.supabase.co/functions/v1/stripe-webhook
// Te versturen events: checkout.session.completed, customer.subscription.updated,
//                      customer.subscription.deleted

import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

const ACTIVE = ['active', 'trialing']

// Sinds Stripe-API 2025-03-31 staat current_period_end op de abonnementsregel en niet
// meer op het abonnement zelf. Allebei lezen, dan klopt het onder elke API-versie.
function periodEnd(sub: Stripe.Subscription): number | undefined {
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  return item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end
}

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2025-10-29.clover' })
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  let event: Stripe.Event
  try {
    // In Deno moet dit de async variant zijn (WebCrypto), anders faalt de controle altijd.
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get('stripe-signature') || '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch (e) {
    console.error('stripe-webhook handtekening', String((e as Error)?.message || e).slice(0, 200))
    return new Response('Ongeldige handtekening', { status: 400 })
  }

  // Het profiel vinden: bij checkout weten we de gebruiker, daarna alleen de Stripe-klant.
  const findUserId = async (customerId: string | null, fallback?: string | null) => {
    if (fallback) return fallback
    if (!customerId) return null
    const { data } = await supa.from('profiles').select('user_id').eq('stripe_customer_id', customerId).maybeSingle()
    return data?.user_id || null
  }

  try {
    // Stripe garandeert geen volgorde: een vertraagde 'updated' mag een latere 'deleted' niet
    // overschrijven. Daarom bewaren we per profiel het tijdstip van de laatst verwerkte gebeurtenis.
    const nieuwer = async (userId: string) => {
      const { data } = await supa.from('profiles').select('plan_event_at').eq('user_id', userId).maybeSingle()
      const vorige = data?.plan_event_at ? Date.parse(data.plan_event_at) / 1000 : 0
      return event.created >= vorige
    }
    const stempel = new Date(event.created * 1000).toISOString()
    // Dezelfde controle nog eens in de update zelf: twee leveringen tegelijk (Stripe herhaalt en
    // levert parallel) komen anders allebei langs `nieuwer` en de oudste kan als laatste schrijven.
    const nietOuder = `plan_event_at.is.null,plan_event_at.lte.${stempel}`

    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session
      const userId = await findUserId(String(s.customer || ''), s.client_reference_id)
      // Bij SEPA is de sessie 'completed' terwijl de betaling nog onderweg is; dan wacht
      // Plus op 'subscription.updated' met status active.
      if (userId && s.payment_status === 'paid' && await nieuwer(userId)) {
        // Meteen de eerste verlengdatum ophalen, anders staat die pas na de eerste
        // 'subscription.updated' in het profiel en ziet de eerste maand er kaal uit.
        let ends: number | undefined
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(String(s.subscription))
          ends = periodEnd(sub)
        }
        await supa.from('profiles').update({
          plan: 'plus',
          plan_status: 'active',
          plan_renews_at: ends ? new Date(ends * 1000).toISOString() : null,
          stripe_customer_id: String(s.customer || ''),
          plan_event_at: stempel,
        }).eq('user_id', userId).or(nietOuder)
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      const userId = await findUserId(String(sub.customer || ''), sub.metadata?.user_id || null)
      if (userId && await nieuwer(userId)) {
        const live = event.type !== 'customer.subscription.deleted' && ACTIVE.includes(sub.status)
        // Bij opzeggen loopt het abonnement door tot het eind van de betaalde periode:
        // Stripe stuurt dan pas bij het aflopen 'deleted'. Tot die tijd blijft plan 'plus',
        // maar de status wordt 'canceling' zodat de app "loopt af op" toont in plaats
        // van "verlengt op" — en niet ten onrechte over een mislukte betaling klaagt.
        //
        // Stripe drukt "stopt aan het eind van de periode" op meer dan één manier uit:
        // als cancel_at_period_end, en in nieuwere API-versies als een cancel_at-datum.
        // Allebei aannemen, dan maakt het niet uit welke weg het klantportaal koos.
        const stopt = sub.cancel_at_period_end === true || !!sub.cancel_at
        const ends = sub.cancel_at || periodEnd(sub)
        await supa.from('profiles').update({
          plan: live ? 'plus' : 'free',
          plan_status: live && stopt ? 'canceling' : sub.status,
          plan_renews_at: ends ? new Date(ends * 1000).toISOString() : null,
          plan_event_at: stempel,
        }).eq('user_id', userId).or(nietOuder)
      }
    }
  } catch (e) {
    // 500 → Stripe probeert het opnieuw; beter dan stilzwijgend een abonnement missen.
    console.error('stripe-webhook', String((e as Error)?.message || e).slice(0, 300))
    return new Response('Fout aan onze kant', { status: 500 })
  }

  return new Response('ok', { status: 200 })
})
