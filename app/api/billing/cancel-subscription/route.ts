import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

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

    // Check if user has an active subscription in subscription_history
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscription_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    if (!subscriptionData) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Update subscription status to 'cancelled'
    const { error: updateError } = await supabase
      .from('subscription_history')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscriptionData.id);

    if (updateError) {
      console.error('Error cancelling subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Update user_credits to reflect subscription cancellation
    const { error: creditUpdateError } = await supabase
      .from('user_credits')
      .update({ 
        is_subscriber: false,
        // Keep existing credits but mark as non-subscriber
      })
      .eq('user_id', user.id);

    if (creditUpdateError) {
      console.error('Error updating user credits:', creditUpdateError);
      // Continue anyway as the subscription was cancelled
    }

    // Return success response
    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      end_date: subscriptionData.next_payment_date || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in cancel-subscription API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
