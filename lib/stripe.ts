import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
let stripeInstance: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is not set');
      return null;
    }
    stripeInstance = loadStripe(key);
  }
  return stripeInstance;
};
// Create Stripe Checkout Session
export const createCheckoutSession = async (priceId: string, reportType: string, accessToken: string) => {
  try {
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
      const error = data.error || 'Failed to create checkout session';
      throw new Error(error);
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error('No checkout URL received');
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
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
