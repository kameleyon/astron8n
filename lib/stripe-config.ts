export const STRIPE_CONFIG = {
  subscriptions: {
    monthly: {
      // Price ID for API calls (not used directly anymore)
      priceId: process.env.NODE_ENV === 'production' 
        ? 'price_1QtJfoGTXKQOsgznJ56CUks0'  // Production price ID
        : 'price_1QtJfoGTXKQOsgznJ56CUks0',  // Test price ID
      // Permalink for direct user access (shows trial period)
      checkoutUrl: process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/cN26r455td8N5iw3ce'
        : 'https://buy.stripe.com/cN26r455td8N5iw3ce',
      credits: 40000,
      name: 'Monthly Subscription',
      trialDays: 3
    }
  }
};

export const getStripeCheckoutUrl = (productType: 'monthly') => {
  return STRIPE_CONFIG.subscriptions[productType].checkoutUrl;
};
