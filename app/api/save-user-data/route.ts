import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.userId || !data.birth_date || !data.birth_time || !data.birth_location) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, birth_date, birth_time, or birth_location' },
        { status: 400 }
      );
    }


   // Validate input data before destructuring
if (!data) {
  throw new Error("Invalid input: data is undefined or null");
}
// Destructure after validation
const { userId, ...birthChartData } = data;
// Check if user profile exists
const { data: existingProfile, error: fetchError } = await supabase
  .from("user_profiles")
  .select("*")
  .eq("id", userId)
  .limit(1);
if (fetchError && fetchError.code !== "PGRST116") {
  console.error("Error fetching profile:", fetchError);
  throw new Error("Failed to fetch user profile");
}
// Prepare profile data
const profileData = {
  id: userId,
  full_name: birthChartData.full_name,
  birth_date: birthChartData.birth_date,
  birth_time: !birthChartData.birth_time || birthChartData.birth_time === "" ? null : birthChartData.birth_time,
  birth_location: birthChartData.birth_location,
  latitude: birthChartData.latitude,
  longitude: birthChartData.longitude,
  has_unknown_birth_time: birthChartData.hasUnknownBirthTime ?? false, // Ensures default value
  updated_at: new Date().toISOString(),
};
// If profile doesn't exist, add additional fields for new users
if (!existingProfile) {
  Object.assign(profileData, {
    has_accepted_terms: true,
    created_at: new Date().toISOString(),
    timezone: null,
    acknowledged: true,
    subscription_start_date: null,
    trial_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    next_payment_date: null,
  });
}
console.log("Upserting profile with ID:", profileData.id);
// Update or insert user profile
const { error: upsertError } = await supabase
  .from("user_profiles")
  .upsert (profileData);
if (upsertError) {
  console.error("Error in upsert:", upsertError);
  throw new Error("Failed to save birth chart data: user defined");
}


    // Check credit balance for existing users
if (existingProfile) {
      let { data: credits, error: fetchCreditsError } = await supabase
        .from('user_credits')
        .select('total_credits, used_credits')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchCreditsError) {
        console.error('Error fetching credits:', fetchCreditsError);
        return NextResponse.json(
          { error: fetchCreditsError.message },
          { status: 500 }
        );
      }

      // If no credits row, create one
      if (!credits) {
        const { data: insertedCredits, error: insertedCreditsError } = await supabase
          .from('user_credits')
          .insert([{
            user_id: userId,
            total_credits: 10000,
            used_credits: 0,
            rollover_credits: 0,
            is_subscriber: false,
            subscription_start_date: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            trial_end_date: null,
            next_payment_date: null,
            rollover_expiration_date: null,
            stripe_subscription_id: null
          }])
          .select()
          .single();

        if (insertedCreditsError) {
          console.error('Error inserting missing credits record:', insertedCreditsError);
          return NextResponse.json(
            { error: insertedCreditsError.message },
            { status: 500 }
          );
        }

        if (!insertedCredits) {
          throw new Error('No credits row returned after insert.');
        }
        credits = insertedCredits;
      } else {
        // Clarify for TypeScript: if credits is null, we handle it separately;
        // otherwise we safely check the numeric fields
        if (!credits) {
          throw new Error('Credits object unexpectedly null after insertion check.');
        } else if (credits.total_credits - credits.used_credits < 1) {
          return NextResponse.json(
            { error: 'Insufficient credits to save birth chart' },
            { status: 402 }
          );
        }
      }
    } else {
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert([{
          user_id: userId,
          total_credits: 40000, // Monthly premium credits
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
    }

    // Deduct credit after successful save
    if (existingProfile) {
      await supabase.rpc('increment_used_credits', {
        user_id: userId,
        amount: 1
      });
    }

    return NextResponse.json({ 
      success: true,
      creditsUsed: existingProfile ? 1 : 0
    });
  } catch (error: any) {
    console.error('Error saving user data:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}