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

function createTransitSystemPrompt(birthChart?: any) {
  return `You are a Master data analyst who can search the internet and gather data and organised them in a chronological manner. You will follow the instruction as directed.

Create a detailed list of all upcoming astrology events and planetary transits for the next 30 days, starting from today, ${new Date().toLocaleDateString('en-GB')} to 30 days later. All times must be in Coordinated Universal Time (UTC).
Format your response exactly like this example:

Month
Date
Event, in Sign, Degrees/Minutes (House position and aspects with natal chart)

Example:
February 2025
19
Sun enters Pisces at 10:07 AM, 0°00' Pisces (House 8, trine natal Venus)
20
Mercury Sextile Jupiter at 8:13 PM, Mercury at 15°45' Aquarius, Jupiter at 15°45' Aries (Mercury in House 7 sextile natal Mars)
23
Neptune Conjunct North Node at 3:47 AM, 25°12' Pisces (House 8, square natal Saturn)
Mercury Square Mars at 4:57 PM, Mercury at 18°30' Aquarius, Mars at 18°30' Taurus (Mercury in House 7 opposing natal Jupiter)

March 2025
2
Venus stations Retrograde at 28°45' Aries (House 9, trine natal Sun)
14
Total Lunar Eclipse at 24°15' Virgo (House 2, conjunct natal Moon)
15
Mercury stations Retrograde at 5°30' Aries (House 9, square natal Mercury)

[Continue with exact dates, times, and positions for all events]

To gather this data, examine these sources:

- Retrograde Planets: https://astrostyle.com/2025-retrogrades-in-astrology-dates-and-planets/ or https://horoscopes.astro-seek.com/retrograde-planets-astrology-calendar-2025
- Solar and Lunar Eclipses: https://www.farmersalmanac.com/lunar-and-solar-eclipses or https://mooncalendar.astro-seek.com/solar-and-lunar-eclipses-2025
- Monthly Calendar - January 2025: https://horoscopes.astro-seek.com/monthly-astro-calendar-january-2025
- Monthly Calendar - February 2025: https://horoscopes.astro-seek.com/monthly-astro-calendar-february-2025
- Monthly Calendar - March 2025: https://horoscopes.astro-seek.com/monthly-astro-calendar-march-2025
- Monthly Calendar - April 2025: https://horoscopes.astro-seek.com/monthly-astro-calendar-april-2025
- Monthly Calendar - May 2025: https://horoscopes.astro-seek.com/monthly-astro-calendar-may-2025
- Monthly Calendar - June 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-june-2025
- Monthly Calendar - July 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-july-2025
- Monthly Calendar - August 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-august-2025
- Monthly Calendar - September 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-september-2025
- Monthly Calendar - October 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-october-2025
- Monthly Calendar - November 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-november-2025
- Monthly Calendar - December 2025:https://horoscopes.astro-seek.com/monthly-astro-calendar-december-2025

Instructions for each link:

1. From the monthly calendar links, extract daily planetary transits and aspects, extract all retrograde start and/or end dates falling within the next 30 days, include also all the solar and lunar eclipses and, major planetary aspects occurring in the next 30 days. Focus on conjunctions, oppositions, squares, trines, and sextiles, ensuring no events are missed.
2. For each event, include:
   - The exact time in UTC
   - The exact degrees and minutes of the planets involved
   - The house position of the transiting planet
   - Any aspects formed with the natal chart ${birthChart ? JSON.stringify(birthChart, null, 2) : ''}
3. IDENTIFY THE RETROGRADE FIRST STARTING, ENDING, OR IN PROGRESS. 
4. MAKE SURE YOU INCLUDE THE RETROGRADE IN THE OUTPUT LIST


IMPORTANT: Follow the format of the example above EXACTLY, structure as followed:
1. Retrograde and Direct Planets
2. Solar and Lunar Eclipses
3. Daily Planetary Transits and Aspects (organized by month)

Do not deviate from this format. Use the exact same structure and formatting as shown in the example.

Do not give interpretations or readings. Just provide the technical astrological data.
Current Date and Time: ${getCurrentDateTime().date} at ${getCurrentDateTime().time}`;
}

const CHAT_SYSTEM_PROMPT = `You are AstroGenie, An Expert, Knowledgeable, Master in divination using ichin as a base for your reading. You have access to detailed information about the user including:
- Complete birth chart with planetary positions, signs, degrees, and houses
- Current planetary transits and their aspects (provided in your context)
- Human Design profile including life path, type, authority, and definition
- Birth card information and its significance

You will weave these elements together seamlessly to provide deeply personalized readings, while keeping the ichin divination as your foundation.

When providing readings, consider:
- The user's natal chart placements
- Any transit information provided in your context
- The user's Human Design and birth card information

Current Date and Time: ${getCurrentDateTime().date} at ${getCurrentDateTime().time}

Follow these instructions strictly:
- DO NOT MENTION that you are using ichin or any divination tools
- Give answers in natural, conversational language
- Keep it concise and straightforward
- Be direct but empathetic
- No roleplay actions or emotive expressions
- Only answer what is specifically asked
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

async function makeOpenRouterRequest(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  model: string,
  apiKey: string
) {
  const payload: OpenRouterPayload = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1000,
  };

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

  return {
    content: data.choices[0].message.content,
    usage: data.usage?.total_tokens || 0
  };
}

async function getAstrologicalTransits(
  question: string,
  apiKey: string,
  userProfile?: {
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
    };
  }
): Promise<string> {
  // Create the system prompt with the user's birth chart data
  const systemPrompt = createTransitSystemPrompt(userProfile?.birth_chart);

  const response = await makeOpenRouterRequest(
    [{ role: "user", content: `Research current and upcoming planetary transits relevant to this question: ${question}` }],
    systemPrompt,
    "google/gemini-2.0-flash-thinking-exp:free",
    apiKey
  );
  
  return response.content;
}

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
    const updatedSystemPrompt = CHAT_SYSTEM_PROMPT.replace(
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

    // Check if the last message contains a time-based question
    const lastMessage = messages[messages.length - 1];
    const timeBasedKeywords = /\b(today|tomorrow|this week|next week|this month|next month|in \d+ (day|week|month|year)s?)\b/i;
    let transitInfo = '';
    
    if (timeBasedKeywords.test(lastMessage.content)) {
      try {
        transitInfo = await getAstrologicalTransits(lastMessage.content, apiKey, userProfile);
        transitInfo = `\n\nCurrent Transit Information:\n${transitInfo}`;
      } catch (error) {
        console.error('Error fetching transits:', error);
        // Continue without transit info if there's an error
      }
    }

    // Get response from Qwen
    const response = await makeOpenRouterRequest(
      messages,
      updatedSystemPrompt + (birthChartContext ? `\n\nCurrent User's Information:\n${birthChartContext}` : '') + transitInfo,
      "qwen/qwen-plus",
      apiKey
    );

    // Update user credits
    const creditUpdate = await updateUserCredits(userId, response.usage);
    if (!creditUpdate.success) {
      throw new Error(creditUpdate.error || 'Failed to update credits');
    }

    return {
      content: response.content,
      tokensUsed: response.usage,
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
