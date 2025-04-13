import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
let stripeInstance: Promise<Stripe | null> | null = null;

export const getStripe = async () => {
  if (!stripeInstance) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }
    stripeInstance = loadStripe(key);
  }
  const stripe = await stripeInstance;
  if (!stripe) {
    throw new Error('Failed to initialize Stripe');
  }
  return stripe;
};
// Create Stripe Checkout Session
export const createCheckoutSession = async (priceId: string, reportType: string, accessToken: string) => {
  try {
    // Validate inputs
    if (!priceId || !reportType || !accessToken) {
      throw new Error('Missing required parameters for checkout session');
    }

    // Ensure price ID format is valid
    if (!priceId.startsWith('price_')) {
      throw new Error('Invalid price ID format');
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        priceId,
        reportType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to create checkout session: ${response.status}`);
    }

    if (!data.url) {
      throw new Error('No checkout URL received from server');
    }

    // Redirect to Stripe checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during checkout');
  }
};
// Handle subscription status
export const handleSubscriptionStatus = async (userId: string, status: 'active' | 'canceled') => {
  try {
    const { error } = await supabase
      .from('user_credits')
      .update({
        is_subscriber: status === 'active',
        subscription_start_date: status === 'active' ? new Date().toISOString() : null,
        total_credits: status === 'active' ? 3500 : 1500
      })
      .eq('user_id', userId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};
