import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { STRIPE_CONFIG } from '@/lib/stripe-config';

// Initialize Supabase client inside the route handler to avoid build-time errors
const getSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

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

    const supabase = getSupabaseClient();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, reportType } = session.metadata || {};

        if (!userId || !reportType) {
          throw new Error('Missing metadata in Stripe session');
        }

        console.log(`Processing checkout session ${session.id}, user ${userId}, report ${reportType}`);

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
          
          // If this is a subscription checkout, update user_credits
          if (reportType === 'subscription') {
            // Get subscription from Stripe
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            // Calculate trial end date
            const trialEndDate = subscription.trial_end 
              ? new Date(subscription.trial_end * 1000) 
              : new Date(Date.now() + (STRIPE_CONFIG.subscriptions.monthly.trialDays * 24 * 60 * 60 * 1000));
            
            // Calculate next payment date
            const nextPaymentDate = new Date(subscription.current_period_end * 1000);
            
            // Update user_credits
            const { error: updateError } = await supabase
              .from('user_credits')
              .update({
                is_subscriber: true,
                subscription_start_date: new Date().toISOString(),
                trial_end_date: trialEndDate.toISOString(),
                next_payment_date: nextPaymentDate.toISOString(),
                stripe_subscription_id: subscription.id,
                total_credits: STRIPE_CONFIG.subscriptions.monthly.credits
              })
              .eq('user_id', userId);
            
            if (updateError) {
              console.error('Error updating user credits:', updateError);
              throw updateError;
            }
            
            console.log(`Successfully updated user credits for subscription`);
          }
        } else {
          console.log(`Payment already exists for session ${session.id}, status: ${existingPayment.status}`);
        }
        break;
      }
      
      case 'customer.subscription.trial_will_end': {
        // This event is triggered 3 days before a trial ends
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        
        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }
        
        console.log(`Trial ending soon for subscription ${subscription.id}, user ${userId}`);
        
        // Update user_credits to indicate trial is ending soon
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            next_payment_date: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating user credits for trial end:', updateError);
          throw updateError;
        }
        
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;
        
        if (!subscription) {
          console.log('Not a subscription invoice, skipping');
          break;
        }
        
        // Get subscription details
        const subscriptionData = await stripe.subscriptions.retrieve(subscription);
        const userId = subscriptionData.metadata.userId;
        
        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }
        
        console.log(`Payment succeeded for subscription ${subscription}, user ${userId}`);
        
        // Check if this is the first payment after trial
        const isFirstPayment = subscriptionData.status === 'active' && 
                              subscriptionData.trial_end && 
                              subscriptionData.trial_end < Math.floor(Date.now() / 1000);
        
        // Update user_credits
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            is_subscriber: true,
            total_credits: STRIPE_CONFIG.subscriptions.monthly.credits,
            last_payment_date: new Date().toISOString(),
            next_payment_date: new Date(subscriptionData.current_period_end * 1000).toISOString()
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating user credits for payment:', updateError);
          throw updateError;
        }
        
        // Add payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            stripe_session_id: invoice.id,
            payment_intent: invoice.payment_intent as string,
            amount: invoice.amount_paid,
            status: 'succeeded',
            report_type: 'subscription',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
          throw paymentError;
        }
        
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;
        
        if (!subscription) {
          console.log('Not a subscription invoice, skipping');
          break;
        }
        
        // Get subscription details
        const subscriptionData = await stripe.subscriptions.retrieve(subscription);
        const userId = subscriptionData.metadata.userId;
        
        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }
        
        console.log(`Payment failed for subscription ${subscription}, user ${userId}`);
        
        // Update user_credits to indicate payment failed
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            is_subscriber: false,
            payment_status: 'failed'
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating user credits for failed payment:', updateError);
          throw updateError;
        }
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        
        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }
        
        console.log(`Subscription ${subscription.id} canceled for user ${userId}`);
        
        // Update user_credits to indicate subscription is canceled
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            is_subscriber: false,
            subscription_end_date: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating user credits for canceled subscription:', updateError);
          throw updateError;
        }
        
        break;
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
