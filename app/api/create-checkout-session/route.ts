import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (using live API)
const stripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '', {
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
    const { packageId, amount } = body;

    if (!packageId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // We don't need to check for a Stripe customer ID in the database
    // Instead, we'll just create a checkout session with the user's ID in the metadata

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
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/settings/success?package_id=${packageId}` : `/settings/success?package_id=${packageId}`,
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/settings?purchase_cancelled=true` : '/settings?purchase_cancelled=true',
      // Not including metadata to avoid webhook processing
      client_reference_id: user.id // Use client_reference_id instead of metadata
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
