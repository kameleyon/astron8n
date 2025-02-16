import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// This file is a Route Handler in Next.js App Router
// See: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function POST(req: Request) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia'
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No stripe signature found');
      return NextResponse.json(
        { error: 'No Stripe signature found' },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    console.log('Received webhook payload:', rawBody.slice(0, 100) + '...');
    console.log('Stripe signature:', signature);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
      console.log('Successfully constructed event:', event.type);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, reportType } = session.metadata || {};

      if (!userId || !reportType) {
        throw new Error('Missing metadata in Stripe session');
      }

      console.log(`Processing webhook for session ${session.id}, user ${userId}, report ${reportType}`);

      // Check if payment already exists
      const { data: existingPayment, error: checkError } = await supabase
        .from('payments')
        .select('id, status')
        .eq('stripe_session_id', session.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing payment:', checkError);
        throw checkError;
      }

      if (!existingPayment) {
        console.log(`Creating new payment record for session ${session.id}`);
        
        // Save payment information
        const { data: newPayment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            payment_intent: session.payment_intent as string,
            amount: session.amount_total || 0,
            status: 'succeeded',
            report_type: reportType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (paymentError) {
          console.error('Error saving payment:', paymentError);
          throw paymentError;
        }

        console.log(`Successfully created payment record:`, newPayment);
      } else {
        console.log(`Payment already exists for session ${session.id}, status: ${existingPayment.status}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
