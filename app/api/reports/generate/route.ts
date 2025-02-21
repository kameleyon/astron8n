import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Initialize Supabase client inside the route handler to avoid build-time errors
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

async function createPDF(content: string, firstName: string) {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Calculate date range
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  const todayStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const endDateStr = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const pageWidth = 612; // Letter size width
  const pageHeight = 792; // Letter size height
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // Create the first page
  const firstPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 50;

  // Try to embed the logo from public/orangelogo.png
  try {
    const logoPath = path.join(process.cwd(), 'public', 'orangelogo.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.25);

    // Get the width of the page
    const pageWidth = firstPage.getWidth();

    // Calculate the x position to center the logo
    const centeredX = (pageWidth - logoDims.width) / 2;

    // Draw the logo with the centered x coordinate
    firstPage.drawImage(logoImage, {
      x: centeredX,
      y: y - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Adjust y position to avoid overlap with the logo
    y -= logoDims.height + 30;
  } catch (err) {
    console.error('Could not embed orangelogo.png from public folder:', err);
    // If the logo fails to load, the report will continue without the logo
  }

  // Draw the main title
  const mainTitle = 'AstroGenie Report';
  const titleWidth = helveticaBold.widthOfTextAtSize(mainTitle, 28);
  firstPage.drawText(mainTitle, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: 28,
    font: helveticaBold,
    color: rgb(254/255, 142/255, 12/255),
  });
  y -= 35;

  // Draw the subtitle
  const subTitle = 'Comprehensive upcoming 30-Day Focus and Action Plan';
  const subTitleWidth = helvetica.widthOfTextAtSize(subTitle, 14);
  firstPage.drawText(subTitle, {
    x: (pageWidth - subTitleWidth) / 2,
    y: y,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 25;

  // Date range
  const dateRangeText = `From ${todayStr} to ${endDateStr}`;
  const dateRangeWidth = helvetica.widthOfTextAtSize(dateRangeText, 12);
  firstPage.drawText(dateRangeText, {
    x: (pageWidth - dateRangeWidth) / 2,
    y: y,
    size: 12,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 20;

  // Draw the divider line
  const lineY = y - 10;
  firstPage.drawLine({
    start: { x: margin, y: lineY },
    end: { x: pageWidth - margin, y: lineY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y = lineY - 50;

  // Parse and place content
  let currentPage = firstPage;
  const lines = content.split('\n');

  for (const line of lines) {
    if (y < margin + 50) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    if (line.startsWith('# ')) {
      y -= 30;
      currentPage.drawText(line.substring(2), {
        x: margin,
        y,
        size: 24,
        font: helveticaBold,
        color: rgb(254/255, 142/255, 12/255),
      });
      y -= 40;
    } else if (line.startsWith('## ')) {
      y -= 20;
      currentPage.drawText(line.substring(3), {
        x: margin,
        y,
        size: 20,
        font: helveticaBold,
        color: rgb(254/255, 142/255, 12/255),
      });
      y -= 30;
    } else if (line.startsWith('- ')) {
      currentPage.drawText('•', {
        x: margin + 15,
        y,
        size: 12,
        font: helvetica,
        color: rgb(254/255, 142/255, 12/255),
      });

      const bulletText = line.substring(2);
      const words = bulletText.split(' ');
      let currentLine = '';
      let xPos = margin + 40;

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);

        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y,
            size: 12,
            font: helvetica,
            color: rgb(0, 0, 0),
          });
          currentLine = word + ' ';
          y -= 20;
          xPos = margin + 30;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        currentPage.drawText(currentLine, {
          x: xPos,
          y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }

      y -= 30;
    } else if (line.trim() === '') {
      y -= 20;
    } else {
      let currentLine = '';
      let xPos = margin;
      let isBold = false;
      let text = line;

      if (text.includes('**')) {
        const parts = text.split('**');
        const lastPart = parts.length % 2 === 1 ? parts.pop() : '';
        const processedParts = [];
        for (let i = 0; i < parts.length; i += 2) {
          if (i + 1 < parts.length) {
            processedParts.push(parts[i] + parts[i + 1]);
          } else {
            processedParts.push(parts[i]);
          }
        }
        text = processedParts.join('') + (lastPart || '');
        isBold = parts.length > 1;
      }

      if (text.startsWith('###')) {
        text = text.substring(3);
        isBold = true;
      }

      const words = text.split(' ');
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = (isBold ? helveticaBold : helvetica).widthOfTextAtSize(testLine, 12);

        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y,
            size: 12,
            font: isBold ? helveticaBold : helvetica,
            color: rgb(0, 0, 0),
          });
          currentLine = word + ' ';
          y -= 20;
          xPos = margin;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        currentPage.drawText(currentLine, {
          x: xPos,
          y,
          size: 12,
          font: isBold ? helveticaBold : helvetica,
          color: rgb(0, 0, 0),
        });
      }

      y -= 30;

      if (y < margin + 50) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    }
  }

  return await pdfDoc.save();
}

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = getSupabaseClient();

    // Get auth header and verify format
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract and verify access token
    const accessToken = authHeader.split(' ')[1];
    let user;
    
    try {
      const { data, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!data?.user) {
        throw new Error('User not found');
      }

      user = data.user;
    } catch (error) {
      console.error('Authentication failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }

    const { userId, reportType } = await req.json();

    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 403 }
      );
    }

    // Get user profile data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Extract first name from full name
    const firstName = userProfile.full_name?.split(' ')[0] || 'User';

    // Define types for birth chart data
    interface Planet {
      name: string;
      sign: string;
      longitude: number;
      latitude: number;
      distance: number;
      longitudeSpeed: number;
      retrograde: boolean;
      formatted: string;
    }

    // Calculate birth chart
    let birthChartData;
    try {
      const { calculateBirthChart } = await import('../../../../birthchartpack/lib/services/astro/calculator');

      if (!userProfile.birth_date) {
        throw new Error('Birth date is required');
      }

      if (!userProfile.birth_location || !userProfile.latitude || !userProfile.longitude) {
        throw new Error('Birth location details are incomplete');
      }

      birthChartData = await calculateBirthChart({
        name: userProfile.full_name,
        date: userProfile.birth_date,
        time: userProfile.birth_time || '12:00',
        location: userProfile.birth_location,
        latitude: userProfile.latitude,
        longitude: userProfile.longitude,
        houseSystem: 'PLACIDUS'
      });

      if (!birthChartData || !birthChartData.planets || !birthChartData.ascendant) {
        throw new Error('Birth chart calculation returned invalid data');
      }
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate birth chart';
      throw new Error(`Birth chart calculation failed: ${errorMessage}`);
    }

    // Extract key planets
    const sunPlanet = birthChartData.planets.find((p: Planet) => p.name === 'Sun');
    const moonPlanet = birthChartData.planets.find((p: Planet) => p.name === 'Moon');

    if (!sunPlanet?.sign || !moonPlanet?.sign || !birthChartData.ascendant?.sign) {
      console.error('Essential birth chart data is missing', {
        hasSunSign: !!sunPlanet?.sign,
        hasMoonSign: !!moonPlanet?.sign,
        hasAscendantSign: !!birthChartData.ascendant?.sign
      });
      throw new Error('Unable to generate report: Missing essential birth chart data');
    }

    // Build birth chart object
    const birthChart = {
      sun_sign: sunPlanet.sign,
      moon_sign: moonPlanet.sign,
      rising_sign: birthChartData.ascendant.sign,
      houses: birthChartData.houses || [],
      aspects: birthChartData.aspects || [],
      planets: birthChartData.planets || []
    };

    // Get user data
    let userDataFields = {
      human_design: {},
      numerology: {},
      life_path: {},
      cardology: {}
    };

    const { data: existingData } = await supabase
      .from('user_data')
      .select('human_design, numerology, life_path, cardology')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingData) {
      userDataFields = existingData;
    } else {
      const { data: newData, error: insertError } = await supabase
        .from('user_data')
        .insert([{
          user_id: userId,
          human_design: userDataFields.human_design,
          numerology: userDataFields.numerology,
          life_path: userDataFields.life_path,
          cardology: userDataFields.cardology
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user data record:', insertError);
      } else if (newData) {
        userDataFields = newData;
      }
    }

    // Combine data
    const combinedData = {
      birth_chart: birthChart,
      ...userDataFields
    };

    // Check OpenRouter API key
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Fetch transit data
    console.log('Starting transit data search...');
    let transitData: string | undefined;
    let retryCount = 0;
    const maxRetries = 3;
    const timeout = 30000;

    while (retryCount < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const perplexityResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
            'X-Title': 'AstroGenie Transit Data'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-thinking-exp:free',
            messages: [
              {
                role: 'system',
                content: `You are a Master data analyst who can search the internet and gather data and organize them in a chronological manner. You will follow the instruction as directed.

CRITICAL: You must check and list ALL retrograde periods in these three categories:

1. Currently in Retrograde (list with exact dates and times):
- Mars: Currently retrograde since Dec 6, 2024 at 06°10' Pisces, goes direct Feb 24, 2025 at 17°00' Leo
- Jupiter: Currently retrograde since Oct 9, 2024 at 21°20' Sagittarius, goes direct Feb 4, 2025 at 11°16' Sagittarius
- Uranus: Currently retrograde since Sep 1, 2024 at 27°15' Taurus, goes direct Jan 30, 2025 at 23°15' Taurus
- North Node: Ongoing retrograde in Leo

2. Going Retrograde in next 30 days (list with exact dates and times):
- Mercury: Starts retrograde Mar 15, 2025 at 09°35' Aries
- Venus: Starts retrograde Mar 2, 2025 at 10°50' Aries

3. Coming out of Retrograde in next 30 days (list with exact dates and times):
- Mars: Goes direct Feb 24, 2025 at 17°00' Leo
- Jupiter: Goes direct Feb 4, 2025 at 11°16' Sagittarius
- Uranus: Goes direct Jan 30, 2025 at 23°15' Taurus

For each retrograde event, you MUST include:
- Exact date and time in UTC
- Exact degrees and minutes
- Sign position
- Whether going retrograde or direct

For each planet/point, determine if it is:
1. Currently in retrograde
2. Going retrograde in the next 30 days
3. Coming out of retrograde (going direct) in the next 30 days

You MUST include ALL relevant retrograde periods in your output.

Create a detailed list of all upcoming astrology events and planetary retrogrades, coming out of retrograde and in transits and/or any aspects going on for the next 30 days, starting from today, ${new Date().toLocaleDateString('en-GB')} to 30 days later. All times must be in Coordinated Universal Time (UTC).
Format your response following this exact structure:

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

1. From the monthly calendar links, Solar and Lunar Eclipses links and, Retrograde Planets links extract daily planetary transits and aspects, extract all retrograde start and/or end dates falling within the next 30 days, include also all the solar and lunar eclipses and, major planetary aspects occurring in the next 30 days. Focus on conjunctions, oppositions, squares, trines, and sextiles, ensuring no events are missed.
2. For each event, include:
   - The exact time in UTC
   - The exact degrees and minutes of the planets involved
   - The house position of the transiting planet
   - Any aspects formed with the natal chart ${JSON.stringify(combinedData, null, 2)}
3. IDENTIFY THE RETROGRADE FIRST STARTING, ENDING, OR IN PROGRESS. 
4. MAKE SURE YOU INCLUDE THE RETROGRADE IN THE OUTPUT LIST


IMPORTANT: Follow this structure exactly:

1. Start with "**Retrograde and Direct Planets:" section
   - List all planets going direct or retrograde
   - Format: "- [Month Day, Year]: [Planet] goes [direct/retrograde] at [degrees°minutes] in [Sign] at [time] UTC"
   - Include ALL retrograde events (starting, ending, and ongoing)
   - Pay special attention to planets coming out of retrograde

2. Follow with "**Solar and Lunar Eclipses:" section
   - List all eclipses
   - Format: "- [Month Day, Year]: [Type] Eclipse at [degrees°minutes] in [Sign] [time] UTC"

3. End with "**Daily Planetary Transits and Aspects:" section
   - Organize by month
   - Format month header as "[Month Year]"
   - Format each entry as "- [Month Day, Year]: [Event] at [degrees°minutes] in [Sign] at [time] UTC"
   - Include house positions and aspects to natal chart

For each event, include:
- Exact time in UTC
- Exact degrees and minutes
- House position
- Aspects to natal chart

Do not deviate from this format. Use the exact same structure and formatting as shown in the example.`
              },
              {
                role: 'user',
                content: 'Generate the transit data following the format specified above.'
              }
            ],
            temperature: 0.2,
            max_tokens: 25000
          })
        });

        clearTimeout(timeoutId);

        console.log('Transit data response status:', perplexityResponse.status);
        const perplexityData = await perplexityResponse.json() as { error?: string, choices?: Array<{ message?: { content?: string } }> };

        if (!perplexityResponse.ok) {
          const errorMessage = typeof perplexityData.error === 'string' ? perplexityData.error : perplexityResponse.statusText;
          if (errorMessage.includes('rate limit') || perplexityResponse.status === 429) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error(`Transit data API error: ${errorMessage}`);
        }

        if (!perplexityData.choices?.[0]?.message?.content) {
          throw new Error('Invalid transit data response format');
        }

        transitData = perplexityData.choices[0].message.content;
        console.log('=== TRANSIT DATA FROM GEMINI ===');
        console.log(transitData);
        console.log('=== END TRANSIT DATA ===');
        console.log('Transit data retrieved successfully');
        break;
      } catch (error: unknown) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Transit data attempt ${retryCount} failed:`, errorMessage);

        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timed out');
        }

        if (retryCount === maxRetries) {
          console.log('Using fallback transit data after all retries failed.');
          transitData = `# Current Astrological Data
## Planetary Positions
- (Approximate or fallback data)
## Expected Transits
- (Approximate or fallback data)
## General Influences
- (Approximate or fallback data)`;
          break;
        }

        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // Generate report
    console.log('Starting report generation...');
    let reportContent: string = '';
    retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
            'X-Title': 'AstroGenie Report Generator'
          },
          body: JSON.stringify({
            model: 'qwen/qwen-plus',
            messages: [
              {
                role: 'system',
                content: `You are an expert metaphysical advisor and astrologer who creates personalized, comprehensive 30‑day forecasts. Your task is to analyze the provided data, including the user's name, the user's combined natal chart data, and the next 30 days of transits. 

CRITICAL: The report MUST begin with these two sections EXACTLY as shown:

Retrograde and Direct Planets:
[List ALL planets that are:
- Currently retrograde
- Going retrograde in next 30 days
- Coming out of retrograde in next 30 days
Format: "- [Month Day, Year]: [Planet] goes [direct/retrograde] at [degrees°minutes] in [Sign] at [time] UTC"]

Solar and Lunar Eclipses:
[List ALL eclipses in next 30 days
Format: "- [Month Day, Year]: [Type] Eclipse at [degrees°minutes] in [Sign] [time] UTC"]

After these sections, provide an in‑depth forecast that integrates all insights into a single, coherent narrative.

Your report should include:

- 30-day planetary positions and upcoming transits from ${new Date().toLocaleDateString('en-GB')} to 30 days later. 
- Use the I Ching as a method of divination which means using the traditional coin method for an initial hexagram, transition lines, and a final hexagram. Integrate it seamlessly without naming the method.
- An analysis of how upcoming planetary transits (Moon phases, nodes, Retrogrades, Eclipses, etc.) will interact with the client's natal chart (include specific degrees, houses, aspects, dates, etc.).
- Integrate user name references throughout to create a personal connection, welcoming and captivating.
- Provide guidance on love, career, finances, health, and timing for key decisions.
- An integrated interpretation of the influences that shape the client's personal design, life purpose, energetic blueprint, and inherent patterns—presented fluidly without reference to the specific methodologies.
- A comprehensive synthesis that provides actionable guidance on love, career, finances, health, and timing for key decisions and events.
- A captivating, warm, welcoming tone and casual language and it's ok to use urban language that is both empathic, honest and empowering.
- DO NOT USE ASTERIX (*) OR (**)
- Address the user when you talk, address the user directly in the report

Use a warm, friendly, honest tone. Be empowering but direct. Merge all interpretations into one cohesive narrative. Avoid explicitly naming systems like I Ching, Human Design, or Cardology by name.

Structure the report as follows:
  
# Main Overview
- Begin with a light hearted, captivating or even thought provoking hook that draws the reader in.
- Offer an integrated interpretation of the I Ching reading (include the initial hexagram, transition lines, and final hexagram without naming the method IChing). (one elaborate paragraph)
- Calculate and write the upcoming main theme and key energies based on current planetary positions and how upcoming transits will affect the client's natal chart ${JSON.stringify(combinedData, null, 2)} and life path. Include exact dates and degrees. (one paragraph)
- End this section introducing the upcoming section. 


# Key Planetary Influences and Aspects
Extract but do not print a verbatim copy and paste all of the Transit Data provided above from ${transitData}. Do not summarize or modify it in any way.
For each transit in the provided transit data, analyze its significance by checking if:

1. It involves:
   - A planet changing signs
   - A planet going retrograde (beginning retrograde motion)
   - A planet moving direct (ending retrograde motion/coming out of retrograde)
   - An eclipse
2. It forms a major aspect (conjunction, opposition, square, trine, sextile) with natal planets within a 3° orb
3. It involves the user's:
   - 5th, 7th, or 8th house for love
   - 2nd or 8th house for finances
   - 10th house for career
   - 6th or 12th house for health

Only list those transits that meet one or more of these criteria as verbatim copy and paste extracted from all of the Transit Data provided above. Do not summarize or modify it in any way.
For each significant transit, provide a detailed paragraph explaining:
- Why it's significant based on the above criteria
- How it specifically affects the user's life area(s)
- What opportunities or challenges it may present
- Write a full paragraphe for each and everyone of them.

###[Month Day, Year]: [Type] Eclipse at [degrees°minutes] in [Sign] [time] UTC
Create [aspect] in your [house] at [degrees°minutes] [Why it's significant based on the above criteria] [How it specifically affects the user's life area(s)]
[What opportunities or challenges it may present]

# In Deph Analysis
Introduce in a one welcoming, captivating paragraph that you are going to go into more details. 

##Love & Relationships:
- Emphasize Venus transits (ingresses, retrogrades) or aspects to natal Venus/7th house
- Note Mars influences on passion and conflict
- Watch for eclipses in 5th house (romance) or 7th house (partnership)
- Include the in relationship and signle aspect. Check the emotions the mood during that period of time. 
- Include insights on potential romantic opportunities and periods of enhanced personal magnetism based on the user's natal chart and houses ${JSON.stringify(combinedData, null, 2)} influence by the upcoming transist. 
- Integrate a I Ching divinatory reading into the interpretation seamlessly.
- make this section very extensively detailed, comprehensive and knowledgeable


##Career & Business:
- Focus on Midheaven (MC) or 10th house transits
- Highlight Saturn/Jupiter aspects to natal MC or 10th house planets
- Note Mercury's role in negotiations and business communications
- Provide timing strategies for initiatives based on the interplay of energies.
- Address if it's a good period to start a new job or business and why; and what field would be more likely successful and why. 
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very extensively detailed, comprehensive and knowledgeable

##Finances:
- Analyze 2nd house (personal finances) and 8th house (shared resources) transits
- Track Venus aspects for money matters
- Watch Jupiter transits to 2nd house for income opportunities
- Examine money flow patterns and investment timing influenced by planetary aspects.
- Advise on resource management and strategic timing.
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very extensively detailed, comprehensive and knowledgeable

##Health & Mental Health:
- Monitor 6th house (physical health) and 12th house (mental wellbeing) transits
- Note Mars aspects for energy levels
- Track Saturn for chronic conditions
- Watch eclipses/lunations in 6th/12th houses
- Explore physical energy cycles and emotional well‑being, with attention to stress management.
- Clearly outline how specific aspects will influence health and mood.
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very extensively detailed, comprehensive and knowledgeable

#Timing & Action Steps

For each transit period, analyze the following conditions to determine optimal timing:

##Favorable Periods (List specific dates for each that applies):
- Venus direct in harmonious aspect: Best for love, relationships, finances
- Mercury direct + good aspects: Ideal for communication, contracts, business deals
- Mars direct + strong aspects: Perfect for new initiatives, physical activities
- Jupiter making favorable aspects: Opportunities for growth, luck, expansion
- New Moon/Full Moon in favorable houses: Fresh starts or culminations
- Harmonious aspects to natal planets: Personal power days

##Challenging Periods (List specific dates for each that applies):
- Mercury retrograde: Communication issues, delay signing contracts
- Mars retrograde: Low energy, avoid new projects
- Eclipses in challenging houses: Major life changes needing careful handling
- Hard aspects to natal planets: Extra patience and planning needed
- Saturn transits: Periods requiring discipline and responsibility

Based on these conditions, here are the specific recommendations:

## Best Days For (Only list dates that strongly align):
- Meeting someone new (Venus/Jupiter favorable)
- Rekindling Love (Venus/Mars harmony)
- Important Communications (Mercury direct + good aspects)
- Business Launches (Mars direct + good aspects)
- Financial Decisions (Venus/Jupiter favorable to 2nd/8th houses)
- Career Moves (Good aspects to MC/10th house)
- Travel (Jupiter/9th house favorable)
- Major Purchases (Venus/Jupiter favorable to 2nd house)
- Legal Matters (Jupiter favorable to natal planets)
- Partnership Agreements (Venus/7th house harmony)

##Watch Out Days (Only list dates with clear challenging aspects):
- High Conflict Potential (Mars hard aspects)
- Legal Complications (Jupiter/Saturn stress)
- Financial Risks (Venus/Jupiter stress to 2nd/8th houses)
- Relationship Tension (Venus/Mars/7th house stress)
- Energy/Health Challenges (Mars/6th house stress)
- Career/Business Caution (Hard aspects to MC/10th house)

Note: Only include dates that show clear astrological correlations based on the transit data. Skip any categories where no strong astrological indicators are present during this period.


# Before I go...
- Synthesize all insights into a final, empowering summary, make it as detailed as possible. 
- Include important reminder 
- Conclude with a bold thought‑provoking statement that leaves the reader in awe, inspired and wanting to know more.

Guidelines:
- Use clean markdown formatting without emojis and do not put the asterix * or **.
- Ensure the final report is comprehensive, elaborate, detailed, and a minimum of 6000 words.
- Maintain a warm, engaging, casual language with a touch of urban expression and familiar tone where user feel cozy and at home or hearing their best friend talking.
- Use their name throughout the report, address them directly like they where your best friend. 
- Be direct and honest about both opportunities and challenges.
- Make each section comprehensive, detailed and elaborated do not hesitated to make it heartfelt when needed, or empowering if needed. But always remains straightforward, tell the truth, no sugarcoating.
- Seamlessly blend all interpretations so that the various influences appear as a natural part of one integrated narrative, without naming the underlying systems explicitly.`
    
             
              },
              {
                role: 'user',
                content: `Create a comprehensive 30-day forecast using the following data:

User Name: ${firstName}

Personal Data:
${JSON.stringify(combinedData, null, 2)}

Transit Data:
${transitData}

Follow these structure guidelines:
1. Open with a warmed and welcomed greeting to ${firstName}, forging a personal connection.
2. Generate the I Ching divinatory reading (initial hexagram, transition lines, final hexagram) but do not mention the method by name.
3. Include how the next 30 days of transits specifically affect ${firstName}'s chart.
4. Provide a deep, comprehensive, detailed, and knowledgeable analysis for love, career, finances, health, and timing.
5. Remember to not mention I ching, Human Design, Life Path, and Cardology.
6. At the end of your report, include a section titled "Appendix: Raw Transit Data" and verbatim copy and paste all of the Transit Data provided above. Do not summarize or modify it in any way.`
              }
            ],
            temperature: 0.8,
            max_tokens: 80000
          })
        });

        clearTimeout(timeoutId);

        console.log('Report generation response status:', response.status);
        const data = await response.json() as { error?: string, choices?: Array<{ message?: { content?: string } }> };

        if (!response.ok) {
          const error = data.error || response.statusText;
          if (error.includes('rate limit') || error.includes('429')) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error(`Report generation API error: ${error}`);
        }

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid report generation response format');
        }

        reportContent = data.choices[0].message.content;
        console.log('=== REPORT CONTENT ===');
        console.log('Transit Data passed to LLama:', transitData);
        console.log('Final Report Content:', reportContent);
        console.log('=== END REPORT CONTENT ===');
        console.log('Report generated successfully');
        break; // success

      } catch (error: unknown) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Report generation attempt ${retryCount} failed:`, errorMessage);

        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timed out');
        }

        if (retryCount === maxRetries) {
          throw new Error(`Failed to generate report after ${maxRetries} attempts: ${errorMessage}`);
        }


        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // Create PDF from the final report
    console.log('Creating PDF...');
    const pdfBytes = await createPDF(reportContent, firstName);

    // Save report to Supabase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${firstName}-30DayReport-${timestamp}.pdf`;


    let uploadAttempt = 1;
    let uploadError;

    while (uploadAttempt <= 3) {
      const currentFileName = uploadAttempt === 1
        ? fileName
        : fileName.replace('.pdf', `-${uploadAttempt}.pdf`);

      const { error } = await supabase
        .storage
        .from('reports')
        .upload(`${userId}/${currentFileName}`, pdfBytes, {
          upsert: false
        });

      if (!error) {

        uploadError = null;
        break;
      }

      if (error.message !== 'The resource already exists') {

        uploadError = error;
        break;
      }

      uploadAttempt++;
    }

    if (uploadError) {
      console.error('Error uploading report:', uploadError);
      throw new Error(`Failed to save report: ${uploadError.message}`);
    }

    // Final file name after successful upload
    let finalFileName = fileName;
    if (uploadAttempt > 1) {
      finalFileName = fileName.replace('.pdf', `-${uploadAttempt}.pdf`);
    }

    // Save metadata to user_reports table
    const { error: metadataError } = await supabase
      .from('user_reports')
      .insert({
        user_id: userId,
        report_type: reportType || 'Upcoming 30-days Forecast',
        file_name: finalFileName,
        content: reportContent,
        created_at: new Date().toISOString()
      });

    if (metadataError) {
      console.error('Error saving report metadata:', metadataError);
      throw new Error(`Failed to save report metadata: ${metadataError.message}`);
    }

    console.log('Report saved successfully');
    return NextResponse.json({
      success: true,
      fileName: finalFileName,
      pdfBytes: Buffer.from(pdfBytes).toString('base64')
    });
  } catch (error: unknown) {
    console.error('Error in report generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
