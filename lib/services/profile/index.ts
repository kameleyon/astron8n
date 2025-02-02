import { supabase } from '@/lib/supabase';
import { calculateLifePath, calculateExpression, calculateSoulUrge } from './numerology';
import { calculateHumanDesign } from './humanDesign';
import { getCards } from './cardology';

// Initialize Supabase client

interface ProfileData {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  full_name: string;
}

export async function updateProfileCalculations(profileData: ProfileData) {
  try {
    // Calculate Life Path Number
    const lifePath = calculateLifePath(profileData.birth_date);
    
    // Calculate Expression Number
    const expression = calculateExpression(profileData.full_name);
    
    // Calculate Soul Urge Number
    const soulUrge = calculateSoulUrge(profileData.full_name);
    
    // Calculate Human Design data
    const humanDesign = calculateHumanDesign(
      profileData.birth_date,
      profileData.birth_time,
      profileData.latitude,
      profileData.longitude
    );
    
    // Calculate Birth Cards
    const cards = getCards(profileData.birth_date);
    
    // Update profile in database
    const { error } = await supabase
      .from('profiles')
      .update({
        life_path_number: lifePath,
        expression_number: expression,
        soul_urge_number: soulUrge,
        human_design_type: humanDesign?.type,
        human_design_authority: humanDesign?.authority,
        human_design_profile: humanDesign?.profile,
        human_design_definition: humanDesign?.definition,
        birth_card: cards?.birthCard?.value,
        personality_card: cards?.personalityCard?.value,
        soul_card: cards?.soulCard?.value,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileData.id);
    
    if (error) throw error;
    
    return {
      success: true,
      data: {
        lifePath,
        expression,
        soulUrge,
        humanDesign,
        cards
      }
    };
  } catch (error) {
    console.error('Error updating profile calculations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getProfileCalculations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        life_path_number,
        expression_number,
        soul_urge_number,
        human_design_type,
        human_design_authority,
        human_design_profile,
        human_design_definition,
        birth_card,
        personality_card,
        soul_card
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting profile calculations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
