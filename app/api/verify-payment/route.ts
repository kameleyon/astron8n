import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
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
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify that the session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session does not belong to this user' },
        { status: 403 }
      );
    }

    // Verify that the payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Determine credits to add based on package ID
    let creditsToAdd: number;
    const packageId = session.metadata?.package_id || 'unknown';
    
    switch (packageId) {
      case 'basic':
        creditsToAdd = 5000; // Basic: $2.99 for 5000 credits
        break;
      case 'pro':
        creditsToAdd = 9000; // Pro: $3.99 for 9000 credits
        break;
      case 'premium':
        creditsToAdd = 17000; // Premium: $5.99 for 17000 credits
        break;
      default:
        // Fallback to metadata if package ID is not recognized
        creditsToAdd = parseInt(session.metadata?.credits || '0', 10);
        if (!creditsToAdd) {
          return NextResponse.json(
            { error: 'Invalid package ID and no credits specified in metadata' },
            { status: 400 }
          );
        }
    }

    // Get current user credits
    const { data: userData, error: userError } = await supabase
      .from('user_credits')
      .select('total_credits, used_credits')
      .eq('user_id', user.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user credits:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user credits' },
        { status: 500 }
      );
    }
    
    // Calculate new total credits
    const currentTotalCredits = userData?.total_credits || 0;
    const newTotalCredits = currentTotalCredits + creditsToAdd;
    
    // Update user credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ total_credits: newTotalCredits })
      .eq('user_id', user.id);
    
    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user credits' },
        { status: 500 }
      );
    }
    
    // Record the transaction in billing_activities
    const { error: activityError } = await supabase
      .from('billing_activities')
      .insert([{
        user_id: user.id,
        type: 'token_purchase',
        amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
        date: new Date().toISOString(),
        status: 'completed',
        tokens: creditsToAdd,
        description: `Purchase of ${packageId} credit package`
      }]);
    
    if (activityError) {
      console.error('Error recording billing activity:', activityError);
      return NextResponse.json(
        { error: 'Failed to record billing activity' },
        { status: 500 }
      );
    }
    
    console.log(`Added ${creditsToAdd} credits to user ${user.id}`);
    
    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
      newTotalCredits: newTotalCredits
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
