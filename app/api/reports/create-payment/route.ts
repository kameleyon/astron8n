import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

export async function POST(req: Request) {
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

      // Get request body
      const { reportId, priceId } = await req.json();

      if (!reportId || !priceId) {
        return NextResponse.json(
          { error: 'Missing reportId or priceId' },
          { status: 400 }
        );
      }

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/reports/success?session_id={CHECKOUT_SESSION_ID}&report_type=${reportId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/reports`,
        metadata: {
          userId: user.id,
          reportType: reportId
        }
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error('Authentication or Stripe session creation failed:', error);
      return NextResponse.json(
        { error: 'Failed to create payment session' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in create-payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
