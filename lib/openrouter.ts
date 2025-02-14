import { OpenRouterPayload } from "@/types/chat";
import { updateUserCredits, checkUserCredits } from "@/lib/utils/credits";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function getCurrentDateTime() {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  };
}

const SYSTEM_PROMPT = `You are AstroGenie, An Expert, Knowledgeable, Master in divination using ichin as a base for your reading. You have access to detailed information about the user including:
- Complete birth chart with planetary positions, signs, degrees, and houses
- Current planetary transits and their aspects
- Human Design profile including life path, type, authority, and definition
- Birth card information and its significance

You will weave these elements together seamlessly to provide deeply personalized readings, while keeping the ichin divination as your foundation. For any questions involving timing or future events, use your internet access to research current and upcoming planetary transits for that specific time period, and analyze how they interact with the user's natal chart positions provided above.

When providing readings, consider the user's unique astrological profile:
- Analyze the positions of planets in signs and houses
- Consider the aspects between planets
- For time-based questions (e.g. "this week", "next month", "in 3 months"):
  * Use your internet access to check real-time planetary positions and upcoming transits
  * Consider how these transits will interact with the user's natal chart
  * Pay special attention to transiting planets in angular houses and major aspects
- Integrate this with the user's Human Design and birth card information

Remember to:
1. Always check current and upcoming transits when the question involves timing
2. Consider transit-to-natal aspects for the specific time period mentioned
3. Maintain a natural, conversational tone while incorporating these insights

Current Date and Time: ${getCurrentDateTime().date} at ${getCurrentDateTime().time}

Follow these instructions strictly, do not be creative. stick to the following instructions ONLY. 
- DO NOT MENTION at any point that you are using ichin as your main method of divination to answer the user question. 
- GIVE THE ANSWER IN VERY HUMANLY, NATURAL CONVERSATION LANGUAGE WITHOUT TALKING ABOUT THE DIVINATION tools YOU use to CAST. 
- When user greet you, greet them back and ask how you can help.  
- Speak like you're talking to a close friend—keep it natural, casual, chill, and direct.  
- You can handle any language the user speaks.  
- Keep it concise, straightforward, down to earth and straight to the point—no fluff.  
- Don't offer any "best time" windows unless somebody explicitly asks for it.
- Never use roleplay actions or asterisk expressions (like *nods*, *waves*, *shuffles*, etc.)
- Avoid any kind of emotive actions in asterisks or parentheses
- Keep responses natural and conversational without artificial gestures or actions

when ask a question, cast an ichin reading with initial hexagram, changing lines, and final hexagram.
apply it to the contect of the question and answer the question directly, without sugarcoating, while also keeping the context based on the reading you cast and the questions. 
Example: Is Jacky snitch on me at work? Answer: Well, unfortunately I see that Jacky is the one who snitch on you, but it doesnt look like their motivation was out of malice, but seems like she volunteered the info by mistake" 
See what I mean? although they did snitch but the context change everything. 

 Delivery Style  
   - Vary how you start each response, but jump right into the answer, keep it casual, urban, welcoming and captivating tone. 
   - Straight-up truth. Be real, no sugarcoating. if the answer is No, it's ok to say No, for now (for empathy) but do not suggarcoat, and say it will work in the future when you didnt check that. Unless the reading shows it. 
   - Never reveal that you are using ichin to get your answer

4. Structure  
   - Start with the main insight, no lengthy preamble.  
   - Give direct guidance.   
   - Keep it as a text message
   - For time-based questions:
     * Extract the time period mentioned (e.g., "this week", "next 3 months")
     * Use your internet access to research planetary positions for that period
     * Consider how these transits interact with the natal chart
     * Include this analysis in your response without mentioning astrology

5. Boundaries  
   - Only answer what they specifically ask.  
   - Stick to your reading's results—don't assume extra stuff.  
   - If it's unclear, say so.  
   - Provide context if needed (for example, "Yes, Emmy spoke up to your boss, but it wasn't out of malice…").  

7. Final Reminders  
   - Tell it like it is.  
   - Switch up your conversation starters so it doesn't get stale.  
   - Don't tell anyone you are using ichin
   - Stay locked on clarity and honesty.
   - DO NOT MENTION at any point that you are using ichin as your main method of divination to answer the user question. 
   - DO NOT MENTION astrology, life path, human design, birth card or numerology, when giving your answers. JUST GIVE A STRAIGNFORWARD ANSWER.
   - DO NOT MENTION ICHIN. JUST GIVE A STRAIGNFORWARD ANSWER`;

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  userId: string,
  userProfile?: {
    birth_date?: string;
    birth_time?: string;
    birth_location?: string;
    birth_chart?: {
      planets?: {
        sun?: { sign: string; degree: number; house: number };
        moon?: { sign: string; degree: number; house: number };
        mercury?: { sign: string; degree: number; house: number };
        venus?: { sign: string; degree: number; house: number };
        mars?: { sign: string; degree: number; house: number };
        jupiter?: { sign: string; degree: number; house: number };
        saturn?: { sign: string; degree: number; house: number };
        uranus?: { sign: string; degree: number; house: number };
        neptune?: { sign: string; degree: number; house: number };
        pluto?: { sign: string; degree: number; house: number };
      };
      transits?: {
        current_planets?: {
          sun?: { sign: string; degree: number };
          moon?: { sign: string; degree: number };
          mercury?: { sign: string; degree: number };
          venus?: { sign: string; degree: number };
          mars?: { sign: string; degree: number };
          jupiter?: { sign: string; degree: number };
          saturn?: { sign: string; degree: number };
          uranus?: { sign: string; degree: number };
          neptune?: { sign: string; degree: number };
          pluto?: { sign: string; degree: number };
        };
        aspects?: Array<{
          planet1: string;
          planet2: string;
          aspect: string;
          orb: number;
        }>;
      };
    };
    human_design?: {
      life_path?: string;
      type?: string;
      authority?: string;
      profile?: string;
      definition?: string;
    };
    birth_card?: {
      card: string;
      meaning?: string;
      position?: string;
    };
  }
) {
  // Check if user has enough credits
  const creditCheck = await checkUserCredits(userId);
  if (!creditCheck.hasCredits) {
    throw new Error(creditCheck.error || 'You have run out of credits. Please visit the billing page to add more credits to continue using the service.');
  }

  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    // Validate API key
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenRouter API key is missing or invalid');
    }
    
    // Verify API key format
    if (!apiKey.startsWith('sk-or-v1-')) {
      throw new Error('Invalid API key format. Please ensure you are using a valid OpenRouter API key.');
    }

    // Update system prompt with current date/time
    const currentDateTime = getCurrentDateTime();
    const updatedSystemPrompt = SYSTEM_PROMPT.replace(
      /Current Date and Time:.*?\n/,
      `Current Date and Time: ${currentDateTime.date} at ${currentDateTime.time}\n`
    );

    // Prepare birth chart context
    let birthChartContext = '';
    if (userProfile?.birth_chart?.planets) {
      const planets = userProfile.birth_chart.planets;
      birthChartContext = `
User's Birth Chart:
Planets:
${Object.entries(planets)
  .filter(([_, data]) => data)
  .map(([planet, data]: [string, any]) => 
    `- ${planet.charAt(0).toUpperCase() + planet.slice(1)}: ${data.sign} (${data.degree}°) in House ${data.house}`
  ).join('\n')}

${userProfile.birth_chart.transits?.aspects ? `
Aspects:
${userProfile.birth_chart.transits.aspects
  .map((aspect: any) => 
    `- ${aspect.planet1} ${aspect.aspect} ${aspect.planet2} (orb: ${aspect.orb}°)`
  ).join('\n')}
` : ''}

${userProfile.human_design ? `
Human Design:
- Type: ${userProfile.human_design.type || 'Unknown'}
- Authority: ${userProfile.human_design.authority || 'Unknown'}
- Profile: ${userProfile.human_design.profile || 'Unknown'}
` : ''}

${userProfile.birth_card ? `
Birth Card: ${userProfile.birth_card.card}
${userProfile.birth_card.meaning ? `Meaning: ${userProfile.birth_card.meaning}` : ''}
` : ''}`;
    }

    const payload: OpenRouterPayload = {
      model: "perplexity/llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: updatedSystemPrompt + (birthChartContext ? `\n\nCurrent User's Information:\n${birthChartContext}` : '')
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    // Get the current environment's origin
    let referer = 'http://localhost:3000';
    if (typeof window !== 'undefined') {
      referer = window.location.origin;
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": referer,
        "X-Title": "AstroGenie",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401) {
        throw new Error('Invalid or missing API key. Please check your OpenRouter API key configuration.');
      }
      
      throw new Error(`API request failed (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API Response:', data);
      throw new Error('Received invalid response format from OpenRouter API');
    }

    // Get token usage from response
    const tokensUsed = data.usage?.total_tokens || 0;

    // Update user credits
    const creditUpdate = await updateUserCredits(userId, tokensUsed);
    if (!creditUpdate.success) {
      throw new Error(creditUpdate.error || 'Failed to update credits');
    }

    return {
      content: data.choices[0].message.content,
      tokensUsed,
      remainingCredits: creditUpdate.remainingCredits
    };
  } catch (error: any) {
    // Enhanced error logging
    console.error('Error in generateAIResponse:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    // User-friendly error message
    if (error.message.includes('API key')) {
      throw new Error('Unable to connect to AI service. Please check your API key configuration.');
    }
    
    if (error.message.includes('run out of credits')) {
      throw error; // Re-throw credit-related errors with the original message
    }
    
    throw new Error('Unable to generate response at the moment. Please try again later.');
  }
}
