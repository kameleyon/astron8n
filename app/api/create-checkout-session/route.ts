import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Use the latest API version
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
    const body = await request.json();
    const { packageId, credits, amount } = body;

    if (!packageId || !credits || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if user already has a Stripe customer ID
    const { data: userData, error: userDataError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userDataError && userDataError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userDataError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    let customerId = userData?.stripe_customer_id;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });

      customerId = customer.id;

      // Save the customer ID to the user's profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user profile' },
          { status: 500 }
        );
      }
    }

    // Get the price ID based on the package selected
    let priceId: string;
    let creditsAmount: number;
    
    switch (packageId) {
      case 'basic':
        priceId = 'price_1RDTkoGTXKQOsgznwXSKf1uP'; // Basic: $2.99 for 5000 credits
        creditsAmount = 5000;
        break;
      case 'pro':
        priceId = 'price_1RDTmYGTXKQOsgzntFpo66Cs'; // Pro: $3.99 for 9000 credits
        creditsAmount = 9000;
        break;
      case 'premium':
        priceId = 'price_1RDToRGTXKQOsgzntueN0ejg'; // Premium: $5.99 for 17000 credits
        creditsAmount = 17000;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid package ID' },
          { status: 400 }
        );
    }

    // Create a Stripe Checkout session for purchasing credits
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        package_id: packageId,
        credits: creditsAmount.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/settings?purchase_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/settings?purchase_cancelled=true`,
    });

    // Return the checkout URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error in create-checkout-session API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
