// Approximate token count calculation (rough estimate)
export const calculateTokens = (text: string): number => {
    // Average English word is 4-5 characters, and 1 token is about 4 characters
    return Math.ceil(text.length / 4);
  };
  // Check if user has enough credits
  export const hasEnoughCredits = (availableCredits: number, messageLength: number): boolean => {
    const estimatedTokens = calculateTokens(messageLength.toString());
    // We multiply by 2 to account for both the user's message and the AI's response
    return availableCredits >= estimatedTokens * 2;
  };
  // Calculate the cost of a conversation
  export const calculateConversationCost = (userMessage: string, aiResponse: string): number => {
    const userTokens = calculateTokens(userMessage);
    const aiTokens = calculateTokens(aiResponse);
    return userTokens + aiTokens;
  };
  // Update user credits in the database
  export const updateUserCredits = async (
    supabase: any,
    userId: string,
    tokensUsed: number
  ): Promise<{ success: boolean; error?: string; remainingCredits?: number }> => {
    try {
      // Get current credit info
      const { data: creditData, error: creditError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (creditError) throw creditError;
      const remainingCredits = creditData.total_credits - (creditData.used_credits + tokensUsed);
      
      if (remainingCredits < 0) {
        return {
          success: false,
          error: 'Insufficient credits'
        };
      }
      // Update credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          used_credits: creditData.used_credits + tokensUsed
        })
        .eq('user_id', userId);
      if (updateError) throw updateError;
      return {
        success: true,
        remainingCredits
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };