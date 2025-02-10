import { supabase } from '@/lib/supabase';

async function testSupabaseConnection() {
  try {
    // Attempt to query system time from Supabase
    const { data, error } = await supabase.from('_realtime').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

testSupabaseConnection();
