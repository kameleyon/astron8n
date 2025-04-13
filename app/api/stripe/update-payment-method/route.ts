import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Use the latest API version
});

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authHeader = headers().get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has any payment methods
    const { data: paymentMethods, error: paymentMethodsError } = await supabase
      .from('payment_methods')
      .select('stripe_payment_method_id')
      .eq('user_id', user.id)
      .limit(1);

    if (paymentMethodsError) {
      console.error('Error fetching payment methods:', paymentMethodsError);
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 500 }
      );
    }

    if (!paymentMethods || paymentMethods.length === 0) {
      return NextResponse.json(
        { error: 'No payment method found to update' },
        { status: 404 }
      );
    }

    // Create a new Stripe customer for this user
    const customer = await stripe.customers.create({
      email: user.email,
      // Not using metadata to avoid webhook processing
    });

    const customerId = customer.id;

    // Create a SetupIntent to securely collect payment details
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // Allow using this payment method for future payments
      // Not using metadata to avoid webhook processing
    });

    // Create a Stripe Checkout session for updating a payment method
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      payment_method_types: ['card'],
      // Not using setup_intent_data metadata to avoid webhook processing
      success_url: `/settings/payment-success?setup_intent={SETUP_INTENT}`,
      cancel_url: `/settings?payment_update_cancelled=true`,
    });

    // Return the checkout URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error in update-payment-method API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
