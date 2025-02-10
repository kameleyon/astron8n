import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
// Initialize Stripe
export const stripePromise = loadStripe('pk_test_51QJcWMGTXKQOsgznvEcIRLI3gVc0wuICwLJhnIpWRNxNrarG4ayb9Of4yfUcOl0NGEpvSKgkLGFPHdNmZs7XAb5700UOpPtsAn');
// Create Stripe Checkout Session
export const createCheckoutSession = async (userId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId: 'prod_RVXNeQprNHXHhv', // Your product ID
      }),
    });
    const session = await response.json();
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });
    if (error) {
      throw error;
    }
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