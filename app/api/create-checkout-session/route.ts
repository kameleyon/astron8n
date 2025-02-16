import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

if (!NEXT_PUBLIC_URL) {
  throw new Error('NEXT_PUBLIC_URL environment variable is not set');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'
});

export async function POST(req: Request) {
  try {
    // Check auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Verify the access token
    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Parse request body
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    let priceId, reportType;
    try {
      const body = await req.json();
      priceId = body.priceId;
      reportType = body.reportType;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    if (!priceId || !reportType) {
      return NextResponse.json(
        { error: 'priceId and reportType are required' },
        { status: 400 }
      );
    }

    // Validate price ID and report type
    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Invalid price ID format' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session with error handling
    let checkoutSession;
    try {
      if (!user.email) {
        throw new Error('User email is required');
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer_email: user.email,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${NEXT_PUBLIC_URL}/reports/success?session_id={CHECKOUT_SESSION_ID}&report_type=${reportType}`,
        cancel_url: `${NEXT_PUBLIC_URL}/reports`,
        metadata: {
          userId: user.id,
          reportType: reportType,
          userEmail: user.email
        },
        payment_intent_data: {
          metadata: {
            userId: user.id,
            reportType: reportType
          }
        }
      };

      checkoutSession = await stripe.checkout.sessions.create(sessionParams);

      return NextResponse.json({
        id: checkoutSession.id,
        url: checkoutSession.url
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Handle Stripe errors specifically
      if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json(
          { 
            error: 'Payment service error',
            details: error.message
          },
          { status: error.statusCode || 500 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to create checkout session',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
