# Ridge Line Supply Co. store

An apparel store with a product shop, a bag, Stripe checkout, and a crew-order form. It runs on Netlify.

## What is in this folder

| Path | What it is |
| --- | --- |
| `public/index.html` | The page |
| `public/site-config.js` | Your phone, email and a few switches. Edit this first. |
| `public/products.json` | Your products and prices. Prices are in cents, so `2800` is $28.00. |
| `public/assets/` | Styles, the shop script and the fonts (Barlow, SIL Open Font License) |
| `netlify/functions/checkout.js` | Starts a Stripe checkout. Prices come from `products.json`, never from the browser. |
| `netlify.toml` | Tells Netlify where everything is |

## What you need

- A free GitHub account
- A free Netlify account
- A Stripe account (free to open, with a fee on each sale)
- A domain name from a registrar such as Cloudflare, Namecheap or Porkbun

## 1. Add your details

Open `public/site-config.js` and fill in `phone`, `email` and `policy`. Anything left empty keeps a bracketed placeholder on the page, so fill in all three before you launch. No street address is shown on the page.

Open `public/products.json` and replace the sample products with yours. Each product has an `id`, `name`, `cat` (the filter group), `price` in cents, `sizes`, and `colors` as `[name, hex]` pairs.

The garments are drawings. They support `kind` of `tee`, `long`, `hoodie` or `cap`, and `print` of `mark`, `quote` or `climb`. A new garment shape or print design needs a code change. Real product photos are the next step up.

When your own products are in, set `sampleNote: false` in `site-config.js`.

## 2. Set up Stripe

1. In the Stripe Dashboard, switch on **test mode** and go to Developers, then API keys. Copy the **secret key** that starts with `sk_test_`.
2. Optional: create a **shipping rate** in the dashboard and copy its ID (it starts with `shr_`). Without one, checkout collects an address but charges no shipping.
3. You will paste both into Netlify in step 3.

This checkout ships to the US only and does not calculate sales tax. To change countries, edit `allowed_countries` in `checkout.js`. For sales tax, look at Stripe Tax and add `automatic_tax: { enabled: true }` to the session in `checkout.js`, and ask your accountant what you owe.

## 3. Put it online

**Option A: GitHub and Netlify (recommended)**

1. Create a new repository on GitHub and upload everything in this folder.
2. In Netlify, choose Add new site, then Import an existing project, and pick the repository. Netlify reads `netlify.toml`, so the defaults are right.
3. In the site settings, find Environment variables and add `STRIPE_SECRET_KEY` (your `sk_test_` key) and, if you made one, `STRIPE_SHIPPING_RATE_ID`.
4. Trigger a new deploy so the variables take effect.

**Option B: Netlify command line**

```
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

Add the environment variables in the Netlify site settings as above. Dragging the `public` folder onto Netlify shows the store, but checkout will not work because that skips the function.

## 4. Crew orders

The crew-order form is a Netlify Form. After the first deploy it appears under Forms in your Netlify site. Add an email notification there so each request lands in your inbox. The form has a hidden field that catches most spam bots.

## 5. Your domain

1. Check that the name is free at your registrar and that nobody has a trademark on it.
2. Buy it.
3. In Netlify, open Domain management, add your domain, and follow the DNS steps it shows. HTTPS turns on automatically.

Menu names change from time to time. If you do not see one, search the Netlify docs for the step name.

## 6. Test before you sell

With your `sk_test_` key in place, add something to the bag and check out. Use card `4242 4242 4242 4242`, any future date, and any three-digit code. Confirm the payment appears in your Stripe test payments. Also send a test crew order and check that it arrives.

To go live: finish activating your Stripe account, replace `STRIPE_SECRET_KEY` with the `sk_live_` key, and redeploy.

## Before you launch

- Real products, prices and, ideally, real photos
- Your shipping and returns policy, and who ships the orders and how
- Sales tax handled
- Phone, email and shipping and returns policy filled in on the page
- One real test order, in test mode, from start to finish

## Preview on your computer

`products.json` loads with a request, so opening `index.html` by double-click will not work. From the `public` folder run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Checkout and the crew form only work once the site is on Netlify.
