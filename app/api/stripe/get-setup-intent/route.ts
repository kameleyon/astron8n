import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Use the same API version as other endpoints
});

export async function POST(request: Request) {
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

    // Parse request body
    const { setupIntentId } = await request.json();

    if (!setupIntentId) {
      return NextResponse.json(
        { error: 'Missing setup intent ID' },
        { status: 400 }
      );
    }

    // Retrieve the setup intent from Stripe
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId, {
      expand: ['payment_method']
    });

    // Skip metadata verification since we're not using metadata anymore

    // Verify that the setup intent was successful
    if (setupIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Setup intent not completed' },
        { status: 400 }
      );
    }

    // Return the payment method details
    return NextResponse.json({
      paymentMethod: setupIntent.payment_method
    });
  } catch (error) {
    console.error('Error in get-setup-intent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
