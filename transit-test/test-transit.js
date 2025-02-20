import fetch from 'node-fetch';
import fs from 'fs/promises';

async function getTransitData() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AstroGenie Transit Data'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-thinking-exp:free',
        messages: [
          {
            role: 'system',
            content: `You are a Master data analyst who can search the internet and gather data and organised them in a chronological manner. You will follow the instruction as directed.

Create a detailed list of all upcoming astrology events and planetary transits for the next 30 days, starting from today's date (February 19, 2025).

To achieve this, meticulously examine EACH of the following links:

- Retrograde Planets: https://horoscopes.astro-seek.com/retrograde-planets-astrology-calendar-2025
- Solar and Lunar Eclipses: https://mooncalendar.astro-seek.com/solar-and-lunar-eclipses-2025
- Astrology Aspects Search Engine: https://horoscopes.astro-seek.com/astrology-aspects-online-search-engine
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

1. From the first link (https://horoscopes.astro-seek.com/retrograde-planets-astrology-calendar-2025), extract all retrograde start and/or end dates falling within the next 30 days.
2. From the second link (https://mooncalendar.astro-seek.com/solar-and-lunar-eclipses-2025), extract any solar and lunar eclipses within the next 30 days.
3. From the third link (https://horoscopes.astro-seek.com/astrology-aspects-online-search-engine), extract major planetary aspects occurring in the next 30 days. Focus on conjunctions, oppositions, squares, trines, and sextiles.
4. From the monthly calendar links, extract daily planetary transits and aspects, ensuring no events are missed.

You need to get
1. Current celestial positions (exact degrees)
2. Upcoming transits (exact dates and times)
3. Retrograde periods (start/end dates)
4. Lunar phases and eclipses
5. Notable aspects and configurations
6. Use astro.com for upcoming astrological transists
7. Use thecardsoflife.com/all-life-cards for cardology
8. Planets coming out of retrograde period and moving forwards
9. Upcoming eclipses
10. North nodes and south nodes
11. Lilith transits (exact dates and times) 

Required output
Combine all extracted information into a single, well-organized list. Format the list chronologically by date, Ascending:
[Date]: Event and/or transits and/or aspects, signs, degrees/minutes - add how important it is and any important events that happened in the past during this astrological transits, events, and/or aspects.

Each data point must include:
- Exact dates (DD/MM/YYYY)
- Precise degrees for planetary positions
- Specific timing for transitions
- Duration for longer events

Format your response exactly like this:

Here is a detailed list of upcoming astrology events and planetary transits for the next 30 days, starting from today, February 19, 2025. All times are in Coordinated Universal Time (UTC).

Retrograde and Direct Planets:
[List all planets going retrograde or direct]

Solar and Lunar Eclipses:
[List any eclipses with exact dates and times]

Daily Planetary Transits and Aspects:
[Month Year]

[Date]:
[Event with exact time]
[Event with exact time]

[Continue chronologically for each date with events]`
          },
          {
            role: 'user',
            content: 'Generate the transit data following the format specified above.'
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    const data = await response.json();
    
    // Extract just the content from the response
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      // Write the content to a file
      await fs.writeFile('transit-output.txt', content);
      console.log('Transit data has been written to transit-output.txt');
      
      // Also display the content in a readable format
      console.log('\nTransit Data:\n');
      console.log(content);
    } else {
      console.error('No content received in the response');
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getTransitData();
