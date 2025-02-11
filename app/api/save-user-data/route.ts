import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...birthChartData } = data;
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert([{
        id: userId,
        full_name: birthChartData.full_name,
        birth_date: birthChartData.birth_date,
        birth_time: birthChartData.birth_time,
        birth_location: birthChartData.birth_location,
        latitude: birthChartData.latitude,
        longitude: birthChartData.longitude,
        has_unknown_birth_time: birthChartData.hasUnknownBirthTime,
        has_accepted_terms: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        timezone: null,
        acknowledged: true,
        subscription_start_date: null,
        trial_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        next_payment_date: null
      }]);

    if (profileError) throw profileError;

    // Create user credits
    const { error: creditsError } = await supabase
      .from('user_credits')
      .upsert([{
        user_id: userId,
        total_credits: 17000, // Monthly premium credits
        used_credits: 0,
        rollover_credits: 0,
        is_subscriber: true,
        subscription_start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        next_payment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        rollover_expiration_date: null,
        stripe_subscription_id: null // This will be updated when Stripe webhook confirms the subscription
      }]);

    if (creditsError) throw creditsError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving user data:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
