// Starts a Stripe Checkout session for the bag.
// Prices come from public/products.json on the server, never from the browser.
const Stripe = require('stripe');
const products = require('../../public/products.json');

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(500, { error: 'Checkout is not set up yet.' });

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'That request could not be read.' });
  }

  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0 || items.length > 30) {
    return json(400, { error: 'Your bag is empty.' });
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const line_items = [];
  for (const it of items) {
    const p = byId.get(String(it.pid));
    const ci = Number(it.ci);
    const qty = Number(it.qty);
    const ok =
      p &&
      Number.isInteger(ci) &&
      p.colors[ci] &&
      p.sizes.includes(it.size) &&
      Number.isInteger(qty) &&
      qty >= 1 &&
      qty <= 99;
    if (!ok) return json(400, { error: 'An item in your bag is no longer available.' });
    line_items.push({
      quantity: qty,
      price_data: {
        currency: 'usd',
        unit_amount: p.price,
        product_data: { name: `${p.name} (${p.colors[ci][0]}, ${it.size})` },
      },
    });
  }

  // Netlify sets URL to the site's main address. The host header is a fallback.
  const base = String(process.env.URL || `https://${event.headers.host}`).replace(/\/$/, '');

  const params = {
    mode: 'payment',
    line_items,
    success_url: `${base}/?order=success`,
    cancel_url: `${base}/?order=cancelled`,
    shipping_address_collection: { allowed_countries: ['US'] },
    phone_number_collection: { enabled: true },
  };
  // Optional: create a shipping rate in the Stripe dashboard and add its ID in Netlify.
  if (process.env.STRIPE_SHIPPING_RATE_ID) {
    params.shipping_options = [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID }];
  }

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create(params);
    return json(200, { url: session.url });
  } catch (err) {
    console.error('Stripe error:', err && err.message);
    return json(502, { error: 'Checkout could not be started.' });
  }
};
