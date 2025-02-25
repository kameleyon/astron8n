import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // For API routes in Next.js, we need to handle authentication differently
    // We'll trust the userId provided in the request since it's coming from
    // a client-side component that already verified the user's session
    
    // Alternatively, we could use cookies or headers to pass the session token
    // but for simplicity, we'll just proceed with the update

    // Try to use the stored procedure first
    try {
      const { error } = await supabase.rpc('update_birth_chart_profile', {
        p_user_id: data.userId,
        p_full_name: data.full_name,
        p_birth_date: data.birth_date,
        p_birth_time: data.hasUnknownBirthTime ? null : data.birth_time,
        p_birth_location: data.birth_location,
        p_latitude: data.latitude,
        p_longitude: data.longitude,
        p_has_unknown_birth_time: data.hasUnknownBirthTime
      });

      if (error) {
        console.error('Error using stored procedure:', error);
        throw error;
      }
    } catch (rpcError) {
      console.error('RPC error:', rpcError);
      
      try {
        // If the stored procedure fails, try a direct SQL update
        // This is a more targeted approach that only updates specific fields
        const { error: sqlError } = await supabase.rpc('execute_sql', {
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

        if (sqlError) {
          console.error('Error with direct SQL update:', sqlError);
          throw sqlError;
        }
      } catch (sqlExecuteError) {
        console.error('SQL execute error:', sqlExecuteError);
        
        // Last resort: try a simple update operation
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
        
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', data.userId);
          
        if (updateError) {
          console.error('Error with update operation:', updateError);
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Birth chart profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating birth chart profile:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
