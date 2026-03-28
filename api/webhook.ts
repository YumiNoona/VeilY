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
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

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

  // Support multiple event types for subscription lifecycle
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      const customerId = session.customer as string;

      if (!userId || !plan) {
        console.error('Missing metadata in checkout.session.completed');
        return res.status(400).json({ error: 'Missing metadata' });
      }

      // Update user with new plan and customer ID
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          plan: plan,
          stripe_customer_id: customerId,
          is_premium: true // Keep legacy flag active on upgrade
        })
        .eq('id', userId);

      if (error) throw error;
      console.log(`User ${userId} upgraded to ${plan}`);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      if (!customerId) break;

      // Reset usage counters on successful monthly payment
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          downloads_used: 0,
          videos_used: 0
        })
        .eq('stripe_customer_id', customerId);

      if (error) throw error;
      console.log(`Monthly reset performed for customer ${customerId}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      if (!customerId) break;

      // Downgrade to free on cancellation and reset all limits
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          plan: 'free',
          is_premium: false,
          downloads_used: 0,
          videos_used: 0
        })
        .eq('stripe_customer_id', customerId);

      if (error) throw error;
      console.log(`Customer ${customerId} downgraded to free`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
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
