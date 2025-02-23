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

      // Get or create Stripe customer
      let stripeCustomerId: string;

      // Check if user already has a Stripe customer ID
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (userProfile?.stripe_customer_id) {
        stripeCustomerId = userProfile.stripe_customer_id;
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id
          }
        });

        // Save Stripe customer ID to user profile
        await supabase
          .from('user_profiles')
          .update({ stripe_customer_id: customer.id })
          .eq('id', user.id);

        stripeCustomerId = customer.id;
      }

      // Create a Stripe Billing Portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_URL}/settings`,
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      return NextResponse.json(
        { error: 'Failed to create billing portal session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in add-payment-method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
