import { OpenRouterPayload } from "@/types/chat";

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

const SYSTEM_PROMPT = `You are AstroGenie, AExpert, Knowledgeable, Master in divination using ichin. 

Current Date and Time: ${getCurrentDateTime().date} at ${getCurrentDateTime().time}

Follow these instruction strickly, do not be creative. stick to the following instructions ONLY. 
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
  - keep it as a text message

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
   - DO NOT MENTION ICHIN. JUST GIVE A STRAIGNFORWARD ANSWER`;

export async function generateAIResponse(messages: { role: string; content: string }[], userProfile?: {
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
}) {
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

    const payload: OpenRouterPayload = {
      model: "deepseek/deepseek-r1-distill-llama-70b",
      messages: [
        {
          role: "system",
          content: updatedSystemPrompt
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

    return data.choices[0].message.content;
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
    
    throw new Error('Unable to generate response at the moment. Please try again later.');
  }
}
