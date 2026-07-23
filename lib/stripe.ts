import Stripe from "stripe";

let cachedClient: Stripe | undefined;

function getStripeClient(): Stripe {
  if (!cachedClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set. Add it to your .env file.");
    }
    cachedClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return cachedClient;
}

// Lazy proxy: constructing the real client (and validating STRIPE_SECRET_KEY) is deferred
// until a property is actually accessed at request time. `next build` imports every route
// module — including this one — during page-data collection regardless of whether the
// route ever runs, so throwing eagerly at module load broke builds that don't have Stripe
// configured yet (e.g. a demo deploy). Deferring means the build succeeds either way, and
// routes that actually call Stripe still fail loudly and immediately if the key is missing.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripeClient(), prop);
  },
});
