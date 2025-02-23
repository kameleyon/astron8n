import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

export async function GET(req: Request) {
  try {
    // Get auth header and verify format
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract and verify access token
    const accessToken = authHeader.split(' ')[1];
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        throw new Error('Invalid or expired authentication token');
      }

      // Get user's Stripe customer ID
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (!userProfile?.stripe_customer_id) {
        return NextResponse.json({
          is_trial: true,
          trial_end_date: null, // Will be set when trial starts
          next_payment_date: null,
          activities: []
        });
      }

      // Get customer's subscriptions and payment methods from Stripe
      const [subscriptions, paymentMethods, charges] = await Promise.all([
        stripe.subscriptions.list({
          customer: userProfile.stripe_customer_id,
          status: 'active',
          limit: 1
        }),
        stripe.paymentMethods.list({
          customer: userProfile.stripe_customer_id,
          type: 'card'
        }),
        stripe.charges.list({
          customer: userProfile.stripe_customer_id,
          limit: 10
        })
      ]);

      // Get trial and subscription info
      const subscription = subscriptions.data[0];
      const isTrialActive = subscription?.status === 'trialing';
      const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end * 1000) : null;
      const nextPayment = subscription?.current_period_end 
        ? new Date(subscription.current_period_end * 1000) 
        : null;

      // Format billing activities
      const activities = charges.data.map(charge => ({
        type: charge.metadata.type || 'token_purchase',
        amount: charge.amount / 100,
        tokens: parseInt(charge.metadata.tokens || '0'),
        date: new Date(charge.created * 1000).toISOString(),
        status: charge.status === 'succeeded' ? 'completed' : charge.status
      }));

      return NextResponse.json({
        is_trial: isTrialActive,
        trial_end_date: trialEnd?.toISOString() || null,
        next_payment_date: nextPayment?.toISOString() || null,
        payment_method: paymentMethods.data[0] ? {
          brand: paymentMethods.data[0].card?.brand,
          last4: paymentMethods.data[0].card?.last4,
          exp_month: paymentMethods.data[0].card?.exp_month,
          exp_year: paymentMethods.data[0].card?.exp_year
        } : null,
        activities
      });

    } catch (error) {
      console.error('Error fetching billing info:', error);
      return NextResponse.json(
        { error: 'Failed to fetch billing information' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in get-info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
