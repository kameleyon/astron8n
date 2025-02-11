import { supabase } from "@/lib/supabase";

interface CreditUpdateResult {
  success: boolean;
  error?: string;
  remainingCredits?: number;
}

export async function updateUserCredits(userId: string, tokensUsed: number): Promise<CreditUpdateResult> {
  try {
    // Get current user credits
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!creditData) throw new Error('No credit record found');

    // Check if user has enough credits
    if (creditData.total_credits - creditData.used_credits < tokensUsed) {
      return {
        success: false,
        error: 'Insufficient credits',
        remainingCredits: creditData.total_credits - creditData.used_credits
      };
    }

    // Update used credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({
        used_credits: creditData.used_credits + tokensUsed
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return {
      success: true,
      remainingCredits: creditData.total_credits - (creditData.used_credits + tokensUsed)
    };
  } catch (error) {
    console.error('Error updating credits:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update credits'
    };
  }
}

export async function checkUserCredits(userId: string): Promise<{
  hasCredits: boolean;
  remainingCredits?: number;
  error?: string;
}> {
  try {
    const { data: creditData, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!creditData) throw new Error('No credit record found');

    const remainingCredits = creditData.total_credits - creditData.used_credits;
    const hasCredits = remainingCredits > 0;

    // Check if trial has expired
    if (creditData.trial_end_date) {
      const trialEndDate = new Date(creditData.trial_end_date);
      if (trialEndDate < new Date()) {
        // If trial expired and user is not a subscriber, they can't use credits
        if (!creditData.is_subscriber) {
          return {
            hasCredits: false,
            remainingCredits: 0,
            error: 'Trial period has expired'
          };
        }
      }
    }

    return {
      hasCredits,
      remainingCredits,
      error: hasCredits ? undefined : 'No credits remaining'
    };
  } catch (error) {
    console.error('Error checking credits:', error);
    return {
      hasCredits: false,
      error: error instanceof Error ? error.message : 'Failed to check credits'
    };
  }
}
