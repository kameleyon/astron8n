import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

// This config is needed to disable the body parser for the webhook route
// so that we can access the raw body for signature verification
export const runtime = 'nodejs';
// In App Router, we don't need to explicitly disable the body parser
// as it's not enabled by default for route handlers

// Initialize Stripe with your secret key

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } else {
      // For development without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook Error: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Make sure this is a payment for credits
        if (session.mode === 'payment' && session.metadata?.credits && session.metadata?.user_id) {
          await handleSuccessfulPayment(session);
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      }
      
      case 'setup_intent.succeeded': {
        const setupIntent = event.data.object as Stripe.SetupIntent;
        // Handle successful setup of a payment method
        if (setupIntent.metadata?.user_id) {
          await handlePaymentMethodSetup(setupIntent);
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const creditsToAdd = parseInt(session.metadata?.credits || '0', 10);
  const packageId = session.metadata?.package_id || 'unknown';
  
  if (!userId || !creditsToAdd) {
    console.error('Missing user_id or credits in session metadata');
    return;
  }

  try {
    // Get current user credits
    const { data: userData, error: userError } = await supabase
      .from('user_credits')
      .select('total_credits, used_credits')
      .eq('user_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user credits:', userError);
      return;
    }
    
    // Calculate new total credits
    const currentTotalCredits = userData?.total_credits || 0;
    const newTotalCredits = currentTotalCredits + creditsToAdd;
    
    // Update user credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ total_credits: newTotalCredits })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return;
    }
    
    // Record the transaction in billing_activities
    const { error: activityError } = await supabase
      .from('billing_activities')
      .insert([{
        user_id: userId,
        type: 'token_purchase',
        amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
        date: new Date().toISOString(),
        status: 'completed',
        tokens: creditsToAdd,
        description: `Purchase of ${packageId} credit package`
      }]);
    
    if (activityError) {
      console.error('Error recording billing activity:', activityError);
    }
    
    console.log(`Added ${creditsToAdd} credits to user ${userId}`);
  } catch (err) {
    console.error('Error processing credit purchase:', err);
  }
}

async function handlePaymentMethodSetup(setupIntent: Stripe.SetupIntent) {
  const userId = setupIntent.metadata?.user_id;
  
  if (!userId || !setupIntent.payment_method) {
    console.error('Missing user_id or payment_method in setupIntent');
    return;
  }
  
  try {
    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(
      setupIntent.payment_method as string
    );
    
    if (!paymentMethod.card) {
      console.error('No card details in payment method');
      return;
    }
    
    // Check if user already has payment methods
    const { data: existingMethods, error: fetchError } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('user_id', userId);
    
    if (fetchError) {
      console.error('Error fetching existing payment methods:', fetchError);
      return;
    }
    
    // If this is the first payment method, set it as default
    const isDefault = !existingMethods || existingMethods.length === 0;
    
    // Save payment method to database
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert([{
        user_id: userId,
        stripe_payment_method_id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        is_default: isDefault
      }]);
    
    if (insertError) {
      console.error('Error saving payment method:', insertError);
    }
    
    console.log(`Saved payment method ${paymentMethod.id} for user ${userId}`);
  } catch (err) {
    console.error('Error processing payment method setup:', err);
  }
}
