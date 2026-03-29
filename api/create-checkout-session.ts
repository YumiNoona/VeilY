import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', 
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, plan } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({ error: 'User ID and Plan are required' });
    }

    // Map App Plans to Stripe Price IDs
    const priceId = plan === 'pro' 
      ? process.env.STRIPE_PRICE_STANDARD 
      : process.env.STRIPE_PRICE_PRO;

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan or missing Price ID configuration' });
    }

    const host = req.headers.host || 'localhost:5173';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        user_id: userId,
        plan: plan, // 'pro' or 'premium'
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
