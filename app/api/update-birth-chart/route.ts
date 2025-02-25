import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Create a Supabase client with the service role key for admin privileges
// This ensures we have full access to update the database
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.userId || !data.birth_date || !data.birth_location) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, birth_date, or birth_location' },
        { status: 400 }
      );
    }

    console.log('Updating birth chart profile with data:', {
      userId: data.userId,
      name: data.full_name,
      date: data.birth_date,
      time: data.hasUnknownBirthTime ? null : data.birth_time,
      location: data.birth_location,
      lat: data.latitude,
      lng: data.longitude,
      hasUnknownTime: data.hasUnknownBirthTime
    });

    // Use direct SQL query to update the profile to avoid any constraint issues
    // This bypasses any ORM-level constraints that might be causing problems
    const { error: rpcError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        UPDATE user_profiles
        SET 
          full_name = $1,
          birth_date = $2,
          birth_time = $3,
          birth_location = $4,
          latitude = $5,
          longitude = $6,
          has_unknown_birth_time = $7,
          updated_at = now()
        WHERE id = $8
      `,
      params: [
        data.full_name,
        data.birth_date,
        data.hasUnknownBirthTime ? null : data.birth_time,
        data.birth_location,
        data.latitude,
        data.longitude,
        data.hasUnknownBirthTime,
        data.userId
      ]
    });

    if (rpcError) {
      console.error('Error executing SQL update:', rpcError);
      
      // Fallback to direct update if RPC fails
      try {
        // Prepare the profile data
        const profileData = {
          full_name: data.full_name,
          birth_date: data.birth_date,
          birth_time: data.hasUnknownBirthTime ? null : data.birth_time,
          birth_location: data.birth_location,
          latitude: data.latitude,
          longitude: data.longitude,
          has_unknown_birth_time: data.hasUnknownBirthTime,
          updated_at: new Date().toISOString()
        };
        
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('id', data.userId)
          .maybeSingle();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        let result;
        
        if (existingProfile) {
          // Update existing profile
          const { data: updatedData, error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update(profileData)
            .eq('id', data.userId)
            .select()
            .single();
            
          if (updateError) {
            throw updateError;
          }
          
          result = updatedData;
        } else {
          // Insert new profile with raw SQL to avoid constraint issues
          const { error: insertError } = await supabaseAdmin.rpc('execute_sql', {
            sql: `
              INSERT INTO user_profiles (
                id, full_name, birth_date, birth_time, birth_location, 
                latitude, longitude, has_unknown_birth_time, updated_at, created_at
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, now(), now()
              )
            `,
            params: [
              data.userId,
              data.full_name,
              data.birth_date,
              data.hasUnknownBirthTime ? null : data.birth_time,
              data.birth_location,
              data.latitude,
              data.longitude,
              data.hasUnknownBirthTime
            ]
          });
          
          if (insertError) {
            throw insertError;
          }
          
          // Fetch the newly inserted profile
          const { data: newProfile, error: fetchNewError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', data.userId)
            .single();
            
          if (fetchNewError) {
            throw fetchNewError;
          }
          
          result = newProfile;
        }
        
        console.log('Profile updated successfully:', result);
        
        return NextResponse.json({ 
          success: true,
          message: 'Birth chart profile updated successfully',
          profile: result
        });
      } catch (fallbackError: any) {
        console.error('Fallback update error:', fallbackError);
        return NextResponse.json(
          { error: fallbackError.message || 'Failed to update profile' },
          { status: 500 }
        );
      }
    } else {
      // Fetch the updated profile
      const { data: updatedProfile, error: fetchError } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', data.userId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching updated profile:', fetchError);
        return NextResponse.json(
          { error: 'Profile updated but could not fetch the updated data' },
          { status: 200 }
        );
      }
      
      console.log('Profile updated successfully:', updatedProfile);
      
      return NextResponse.json({ 
        success: true,
        message: 'Birth chart profile updated successfully',
        profile: updatedProfile
      });
    }
  } catch (error: any) {
    console.error('Error updating birth chart profile:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
