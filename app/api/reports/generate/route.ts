import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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

async function createPDF(content: string, userName: string) {
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
    y: y - logoDims.height, // adjust y as needed
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









  // Draw the divider line at current y (minus a little extra if you want spacing)
const lineY = y - 10; // move 10 more points below
firstPage.drawLine({
  start: { x: margin, y: lineY },
  end: { x: pageWidth - margin, y: lineY },
  thickness: 1,
  color: rgb(0.8, 0.8, 0.8),
});
y = lineY - 50; // move your y pointer below the line

  // Now we’ll parse the final content and place it below the top section
  let currentPage = firstPage;

  // Split the text content by lines

  const lines = content.split('\n');
  for (const line of lines) {
    // Check if we need a new page
    if (y < margin + 50) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    // Markdown-style formatting
    // In your for-loop where you parse lines:
    if (line.startsWith('# ')) {
      // Remove the rectangle background
      // Just print the text
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
      // No underline or background
      y -= 30;
    } else if (line.startsWith('- ')) {
      // Bullet points
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
      // Blank line
      y -= 20;
    } else {
      // Regular paragraph text with wrapping
      const words = line.split(' ');
      let currentLine = '';
      let xPos = margin;

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
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }

      y -= 20;
    }
  }

  // Return the PDF bytes
  return await pdfDoc.save();
}

export async function POST(req: Request) {
  try {
    // Verify auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Verify the access token
    const accessToken = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { userId, userName, reportType } = await req.json();

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

    // Calculate the user’s birth chart
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

    // Build a simplified birthChart object
    const birthChart = {
      sun_sign: sunPlanet.sign,
      moon_sign: moonPlanet.sign,
      rising_sign: birthChartData.ascendant.sign,
      houses: birthChartData.houses || [],
      aspects: birthChartData.aspects || [],
      planets: birthChartData.planets || []
    };

    // Attempt to fetch user data
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
      // Create new user_data row if needed
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

    // Combine birth chart with user data
    const combinedData = {
      birth_chart: birthChart,
      ...userDataFields
    };


    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // 1) Fetch transit data from perplexity
    console.log('Starting transit data search...');
    let transitData: string | undefined;


    let retryCount = 0;
    const maxRetries = 3;
    const timeout = 30000; // 30 seconds

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
            model: 'perplexity/llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: `You are an expert astrologer with real-time astronomical knowledge. Your task is to provide precise, current astrological data with specific dates and times. Focus on factual astronomical positions and transitions.

              Go to https://horoscopes.astro-seek.com/calculate-astrology-ephemeris-february-2025/?table=long_retro&bg_0=&aya=&presnost=1&barva=p&uzel_true=&lilith_true= and search for the next 30 days astrological transits.
              Go to https://horoscopes.astro-seek.com/retrograde-planets-astrology-calendar-2025 and look for all the retrograded planets  for the next 30 days astrological transits.
              Go to https://mooncalendar.astro-seek.com/solar-and-lunar-eclipses-2025 and check if we have any eclipse for the next 30 days astrological transits.

Required output format:
1. Current celestial positions (exact degrees)
2. Upcoming transits (exact dates and times)
3. Retrograde periods (start/end dates)
4. Lunar phases and eclipses
5. Notable aspects and configurations
6. Use astro.com for upcoming astrological transists
7. Use thecardsoflife.com/all-life-cards for cardology
Each data point must include:
- Exact dates (DD/MM/YYYY)
- Precise degrees for planetary positions
- Specific timing for transitions
- Duration for longer events`
              },
              {
                role: 'user',
                content: `Gather a comprehensive and detailed astrological aspects and transits for the next 30 days starting from ${new Date().toLocaleDateString('en-GB')}. 
                
                Include:
1. PLANETARY POSITIONS
- Current positions (degrees/minutes)
- Sign placements
- House positions
2. TRANSITS (next 30 days)
- All planetary ingresses include sign and the period of time they will remains in that sign
- All Major aspects formations including the degrees/minutes
- All planetary Retrograde stations in which sign and degrees/minutes
- All planetary moving forward after being retrograted in which sign include degrees/minutes
- Lunar phases and nodes in which signs include degrees/minutes
- Any stellium please mentions the planets involved in which sign, include degrees/minutes as well
- Upcoming eclipses (if any) in what sign and degrees/minutes what are they bringing and how long will be their effect 
3. CARDOLOGY INFLUENCES
- Current planetary rulers
- Active birth cards
- Yearly spread positions
Format in strict markdown with:
# [Main Sections]
## [Subsections]
- [Detailed points with exact dates]`
              }
            ],
            temperature: 0.2,
            max_tokens: 2000
          })
        });

        clearTimeout(timeoutId);

        console.log('Transit data response status:', perplexityResponse.status);
        const perplexityData = await perplexityResponse.json();

        if (!perplexityResponse.ok) {
          const error = perplexityData.error || perplexityResponse.statusText;
          if (error.includes('rate limit') || error.includes('429')) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error(`Transit data API error: ${error}`);
        }

        if (!perplexityData.choices?.[0]?.message?.content) {
          throw new Error('Invalid transit data response format');
        }

        transitData = perplexityData.choices[0].message.content;
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
          // Use a fallback template if all attempts fail
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

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // 2) Generate the final 30-day forecast with llama
    console.log('Starting report generation...');
    let reportContent: string;
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
            model: 'meta-llama/llama-3.3-70b-instruct',
            messages: [
              {
                role: 'system',
                content: `You are an expert metaphysical advisor and astrologer who creates personalized, comprehensive 30‑day forecasts. Your task is to analyze the provided data, including the user's name, the user's combined natal chart data, and the next 30 days of transits. Provide an in‑depth forecast that integrates all insights into a single, coherent narrative.

Your report should include:
- 30-day planetary positions and upcoming transits
- Use the I Ching as a method of divination which means using the traditional coin method for an initial hexagram, transition lines, and a final hexagram. Integrate it seamlessly without naming the method.
- An analysis of how upcoming planetary transits (Moon phases, nodes, Retrogrades, Eclipses, etc.) will interact with the client's natal chart (include specific degrees, houses, aspects, dates, etc.).
- Integrate user name references throughout to create a personal connection, welcoming and captivating.
- Provide guidance on love, career, finances, health, and timing for key decisions.
- An integrated interpretation of the influences that shape the client's personal design, life purpose, energetic blueprint, and inherent patterns—presented fluidly without reference to the specific methodologies.
- A comprehensive synthesis that provides actionable guidance on love, career, finances, health, and timing for key decisions and events.
- A captivating, warm, welcoming and casual tone that is both honest and empowering.

Use a warm, friendly, honest tone. Be empowering but direct. Merge all interpretations into one cohesive narrative. Avoid explicitly naming systems like I Ching, Human Design, or Cardology by name.

Structure the report as follows:
  
# Main Overview
- Begin with a light hearted, captivating or even thought provoking hook that draws the reader in.
- Offer an integrated interpretation of the I Ching reading (include the initial hexagram, transition lines, and final hexagram without naming the method IChing). (one elaborate paragraph)
- Calculate and write the upcoming main theme and key energies based on current planetary positions and how upcoming transits will affect the client's natal chart ${JSON.stringify(combinedData, null, 2)} and life path. Include exact dates and degrees. (one paragraph)
- End this section introducing the upcoming section. 


# Key Planetary Influences and Aspects
Start by listing:
Astrology transits for the next 30 days
- All planetary ingresses include sign and the period of time they will remains in that sign
- All Major aspects formations including the degrees/minutes
- All planetary Retrograde stations in which sign and degrees/minutes
- All planetary moving forward after being retrograted in which sign include degrees/minutes
- Lunar phases and nodes in which signs include degrees/minutes
- Any stellium please mentions the planets involved in which sign, include degrees/minutes as well
- Upcoming eclipses (if any) in what sign and degrees/minutes what are they bringing and how long will be their effect 

---------------------------
Aspect Analysis
- Based on the astrological transits and aspects noted in the previous section Go over each and every single one of of them and write for each a paragraph elaborating in detail how they will impact and influence they will have on the user's natal chart ${JSON.stringify(combinedData, null, 2)}, the aspect they will create on their birth chart and in which house and what degree and minuted. include why they are playing an important role on the user's natal chart for this period and for each of them a clear explanation of their effects on the user's natal charts in one paragraphe each
- make this section very detailed, comprehensive and knowledgeable


# In Deph Analysis
Introduce in a short paragraph that we are going to go into more details. 
## Love Life
- Check for Venus upcoming transit and how it will impact the user's birth chart ${JSON.stringify(combinedData, null, 2)}; Include the in relationship and signle aspect. Check the emotions the mood during that period of time. 
- Include insights on potential romantic opportunities and periods of enhanced personal magnetism based on the user's natal chart and houses ${JSON.stringify(combinedData, null, 2)} influence by the upcoming transist. 
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very detailed, comprehensive and knowledgeable

## Career or Business Path
- Discuss professional developments, leadership qualities, and key opportunities.
- Provide timing strategies for initiatives based on the interplay of energies.
- Address if it's a good period to start a new job or business and why; and what field would be more likely successful and why. 
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very detailed, comprehensive and knowledgeable

## Financial Outlook
- Examine money flow patterns and investment timing influenced by planetary aspects.
- Advise on resource management and strategic timing.
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very detailed, comprehensive and knowledgeable

## Health & Mental Health 
- Explore physical energy cycles and emotional well‑being, with attention to stress management.
- Clearly outline how specific aspects will influence health and mood.
- Integrate a I Ching divinatory reading into the interpretation seamlessly. 
- make this section very detailed, comprehensive and knowledgeable

# Timing Guide
## Best Days For
- Important conversations, major decisions, financial transactions, personal initiatives, travel and social events
- Organize as a list
  
## Watch Out Days
- Highlight challenging aspects, potential obstacles, energy dips, and cautionary periods.
- Organize as a list
  
# Key Dates and Points
- Provide a chronological timeline of significant events, power days, and critical decision points.
- Detail opportunity windows with clear explanations.

# Before I go...
- Synthesize all insights into a final, empowering summary, make it as detailed as possible. 
- Include important reminder 
- Conclude with a thought‑provoking statement that leaves the reader inspired and ready to engage with the coming month.

Guidelines:
- Use clean markdown formatting without emojis.
- Ensure the final report is comprehensive, elaborate, detailed, and a minimum of 5500 words.
- Maintain a warm, engaging, casual language with a touch of urban expression and familiar tone where user feel cozy and at home or hearing their best friend talking.
- Use their name throughout the report, address them directly like they where your best friend. 
- Be direct and honest about both opportunities and challenges.
- Make each section comprehensive, detailed and elaborated do not hesitated to make it heartfelt when needed, or empowering if needed. But always remains straightforward, tell the truth, no sugarcoating.
- Seamlessly blend all interpretations so that the various influences appear as a natural part of one integrated narrative, without naming the underlying systems explicitly.`
             
              },
              {
                role: 'user',
                content: `Create a comprehensive 30-day forecast using the following data:

User Name: ${userName}

Personal Data:
${JSON.stringify(combinedData, null, 2)}

Transit Data:
${transitData}

Follow these structure guidelines:
1. Open with a warmed and welcomed greeting to ${userName}, forging a personal connection.
2. Generate the I Ching divinatory reading (initial hexagram, transition lines, final hexagram) but do not mention the method by name.
3. Include how the next 30 days of transits specifically affect ${userName}'s chart.
4. Provide a deep, comprehensive, detailed, and knowledgeable analysis for love, career, finances, health, and timing.
5. Remember to not mention I ching, Human Design, Life Path, and Cardology.`
              }
            ],
            temperature: 0.7,
            max_tokens: 10000
          })
        });

        clearTimeout(timeoutId);

        console.log('Report generation response status:', response.status);
        const data = await response.json();

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
    const pdfBytes = await createPDF(reportContent, userName);

    // Save report to Supabase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userName}-30DayReport-${timestamp}.pdf`;


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