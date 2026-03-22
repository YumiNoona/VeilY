import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Required for Stripe Webhook signature validation in Node/Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', 
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY as string;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await resolveRawBody(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency: Ignore anything that isn't a successful checkout session completion natively
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('No userId attached to checkout session metadata');
    return res.status(400).json({ error: 'No userId attached to checkout session' });
  }

  // Construct Supabase Client with service_role privilege avoiding RLS blocks
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);

  // Replay Protection: Inserts the event.id into DB; will constraint panic if duplicate
  const { error: idempotencyError } = await supabaseAdmin
    .from('webhook_events')
    .insert([{ id: event.id }]);

  if (idempotencyError) {
    if (idempotencyError.code === '23505') { // Postgres unique_violation error code
      console.log(`Duplicate Stripe hook intercepted | Event ${event.id} already processed.`);
      return res.status(200).json({ received: true });
    }
    console.error('Failed to log webhook event to db:', idempotencyError);
    return res.status(500).json({ error: 'Database idempotency constraint failure' });
  }

  // Perform backend user upgrade
  const { error: upgradeError } = await supabaseAdmin
    .from('users')
    .update({ is_premium: true })
    .eq('id', userId);

  if (upgradeError) {
    console.error('Failed to finalize user database upgrade:', upgradeError);
    return res.status(500).json({ error: 'Failed to apply upgrade status' });
  }

  res.status(200).json({ success: true });
}

async function resolveRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve) => {
    let rawBody = '';
    req.on('data', (chunk: string) => {
      rawBody += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(rawBody));
    });
  });
}
