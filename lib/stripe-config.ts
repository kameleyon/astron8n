export const STRIPE_CONFIG = {
  subscriptions: {
    monthly: {
      // Price ID for API calls (not used directly anymore)
      priceId: process.env.NODE_ENV === 'production' 
        ? 'price_1QtJ3TGTXKQOsgzn1U1g0kje'  // Production price ID
        : 'price_1QtJ3TGTXKQOsgzn1U1g0kje',  // Test price ID
      // Permalink for direct user access (shows trial period)
      checkoutUrl: process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/astrogenie-monthly-subscription'
        : 'https://buy.stripe.com/test_4gw03xf4H4uUcEw5kp',
      credits: 17000,
      name: 'Monthly Subscription',
      trialDays: 3
    }
  }
};

export const getStripeCheckoutUrl = (productType: 'monthly') => {
  return STRIPE_CONFIG.subscriptions[productType].checkoutUrl;
};
