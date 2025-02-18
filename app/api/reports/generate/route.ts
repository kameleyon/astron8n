import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Initialize Supabase client inside the route handler to avoid build-time errors
const getSupabaseClient = () => {
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
};

async function createPDF(content: string, userName: string) {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Page setup
  const margin = 50;
  const pageWidth = 612; // Letter size width
  const pageHeight = 792; // Letter size height
  const contentWidth = pageWidth - (margin * 2);
  
  // Create first page with header
  const firstPage = pdfDoc.addPage([pageWidth, pageHeight]);
  
  // Draw header background
  firstPage.drawRectangle({
    x: 0,
    y: pageHeight - 100,
    width: pageWidth,
    height: 100,
    color: rgb(0.95, 0.95, 0.9),
  });

  // Add title with centered styling
  const titleText = 'AstroGenie Report';
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 32);
  firstPage.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - 50,
    size: 32,
    font: helveticaBold,
    color: rgb(218/255, 99/255, 0/255),
  });

  // Add subtitle
  const subtitleText = 'Comprehensive 30-Day Focus and Action Plan';
  const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 14);
  firstPage.drawText(subtitleText, {
    x: (pageWidth - subtitleWidth) / 2,
    y: pageHeight - 75,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Add user name with better styling
  const userText = `Prepared for: ${userName}`;
  const userWidth = helveticaBold.widthOfTextAtSize(userText, 14);
  firstPage.drawText(userText, {
    x: (pageWidth - userWidth) / 2,
    y: pageHeight - 95,
    size: 14,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Add divider line
  firstPage.drawLine({
    start: { x: margin, y: pageHeight - 120 },
    end: { x: pageWidth - margin, y: pageHeight - 120 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  let currentPage = firstPage;
  let y = pageHeight - 160; // Start content closer to header
  
  // Parse and format content
  const lines = content.split('\n');
  for (const line of lines) {
    // Check if we need a new page
    if (y < margin + 50) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    // Format based on markdown
    if (line.startsWith('# ')) {
      // Add some space before main headers
      y -= 20;
      
      // Main header with background
      currentPage.drawRectangle({
        x: margin - 10,
        y: y - 5,
        width: contentWidth + 20,
        height: 40,
        color: rgb(0.95, 0.95, 0.9),
      });
      
      currentPage.drawText(line.substring(2), {
        x: margin,
        y: y,
        size: 24,
        font: helveticaBold,
        color: rgb(218/255, 99/255, 0/255),
      });
      y -= 45;
    } else if (line.startsWith('## ')) {
      // Sub header with underline
      y -= 15;
      currentPage.drawText(line.substring(3), {
        x: margin,
        y: y,
        size: 18,
        font: helveticaBold,
        color: rgb(218/255, 99/255, 0/255),
      });
      
      // Draw underline
      currentPage.drawLine({
        start: { x: margin, y: y - 5 },
        end: { x: margin + contentWidth, y: y - 5 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      
      y -= 30;
    } else if (line.startsWith('- ')) {
      // Bullet points with proper indentation
      currentPage.drawText('•', {
        x: margin + 10,
        y: y,
        size: 12,
        font: helvetica,
        color: rgb(218/255, 99/255, 0/255),
      });
      
      // Wrap bullet point text
      const bulletText = line.substring(2);
      const words = bulletText.split(' ');
      let currentLine = '';
      let xPos = margin + 30;
      
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);
        
        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y: y,
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
          y: y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }
      
      y -= 25;
    } else if (line.trim() === '') {
      // Empty line spacing
      y -= 15;
    } else {
      // Regular text with proper wrapping
      const words = line.split(' ');
      let currentLine = '';
      let xPos = margin;
      
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = helvetica.widthOfTextAtSize(testLine, 12);
        
        if (xPos + textWidth > pageWidth - margin) {
          currentPage.drawText(currentLine, {
            x: xPos,
            y: y,
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
          y: y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }
      
      y -= 20;
    }
  }

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

    // Import calculator from birthchartpack with error handling
    let birthChartData;
    try {
      const { calculateBirthChart } = await import('../../../../birthchartpack/lib/services/astro/calculator');
      
      // Validate required birth data
      if (!userProfile.birth_date) {
        throw new Error('Birth date is required');
      }
      
      if (!userProfile.birth_location || !userProfile.latitude || !userProfile.longitude) {
        throw new Error('Birth location details are incomplete');
      }
      
      birthChartData = await calculateBirthChart({
        name: userProfile.full_name,
        date: userProfile.birth_date,
        time: userProfile.birth_time || '12:00', // Default to noon if time unknown
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

    // Find essential planets
    const sunPlanet = birthChartData.planets.find((p: Planet) => p.name === 'Sun');
    const moonPlanet = birthChartData.planets.find((p: Planet) => p.name === 'Moon');

    // Validate essential data is present
    if (!sunPlanet?.sign || !moonPlanet?.sign || !birthChartData.ascendant?.sign) {
      console.error('Essential birth chart data is missing', {
        hasSunSign: !!sunPlanet?.sign,
        hasMoonSign: !!moonPlanet?.sign,
        hasAscendantSign: !!birthChartData.ascendant?.sign
      });
      throw new Error('Unable to generate report: Missing essential birth chart data');
    }

    // Format birth chart data after validation
    const birthChart = {
      sun_sign: sunPlanet.sign,
      moon_sign: moonPlanet.sign,
      rising_sign: birthChartData.ascendant.sign,
      houses: birthChartData.houses || [],
      aspects: birthChartData.aspects || [],
      planets: birthChartData.planets || []
    };

    // Initialize default user data
    let userDataFields = {
      human_design: {},
      numerology: {},
      life_path: {},
      cardology: {}
    };

    // Try to get existing user data
    const { data: existingData, error: fetchError } = await supabase
      .from('user_data')
      .select('human_design, numerology, life_path, cardology')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingData) {
      userDataFields = existingData;
    } else {
      // Create new user data record if none exists
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

    // Check OpenRouter API key
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // First, use perplexity to search for transit data with timeout and retry
    console.log('Starting transit data search...');
    let transitData;
    let retryCount = 0;
    const maxRetries = 3;
    const timeout = 30000; // 30 seconds timeout

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
              content: 'You are an expert astrologer tasked with searching for current astrological data. Focus on finding accurate transit dates, aspects, and cardology information.'
            },
            {
              role: 'user',
              content: `Search for the following information:

              1. Current and upcoming 30-day planetary transits
              2. Major aspects forming between planets
              3. Current and upcoming retrograde periods
              4. Important sign changes for planets
              5. Lunar phases and eclipses if any
              6. Current Birth Card influences
              7. Yearly Spread interpretations
              
              Format the data in markdown with clear headings and bullet points.`
            }
          ],
          temperature: 0.7,
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
        break; // Success, exit retry loop
        
      } catch (error: unknown) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Transit data attempt ${retryCount} failed:`, errorMessage);
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timed out');
        }
        
        if (retryCount === maxRetries) {
          // If all retries failed, use a fallback transit data template
          console.log('Using fallback transit data after all retries failed');
          transitData = `# Current Astrological Transits
          
## Planetary Positions
- Sun in current zodiac sign
- Moon moving through the signs
- Mercury in its current position
- Venus in its current phase
- Mars in its current sign
- Jupiter continuing its journey
- Saturn maintaining its influence

## Important Aspects
- Major planetary aspects in effect
- Upcoming significant alignments

## Monthly Overview
- General cosmic weather
- Key dates to note
- Potential opportunities and challenges`;
          break;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // Now generate the report with timeout and retry
    console.log('Starting report generation...');
    let reportContent;
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
              content: 'You are an expert astrologer and spiritual guide specializing in creating personalized reports. Your reports are detailed, comprehensive, and immersive, written in a flowing narrative style using markdown formatting.'
            },
            {
              role: 'user',
              content: `Generate a personalized, in-depth 30-day astrological forecast using the following data:

              Transit Data:
              ${transitData}

              Personal Data:
              ${JSON.stringify(combinedData, null, 2)}

              Format the report in markdown with:
              - # for main section headings
              - ## for subsection headings
              - Bullet points for lists
              - Proper paragraph breaks
              - Do not use any emojis or special characters

              Cover these sections:
              1. Monthly theme and overview
              2. Key planetary influences and aspects
              3. Love, career, and health forecasts
              4. Important dates and guidance
              5. Final reflections and mantras

              Important: Do not include any emojis, astrological symbols, or special Unicode characters in the report.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
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
        break; // Success, exit retry loop
        
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
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // Create PDF
    console.log('Creating PDF...');
    const pdfBytes = await createPDF(reportContent, userName);

    // Save report to database with unique timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userName}-30DayReport-${timestamp}.pdf`;
    
    // Try to upload with unique name
    let uploadAttempt = 1;
    let uploadError;
    
    while (uploadAttempt <= 3) {
      const currentFileName = uploadAttempt === 1 ? 
        fileName : 
        fileName.replace('.pdf', `-${uploadAttempt}.pdf`);
        
      const { error } = await supabase
        .storage
        .from('reports')
        .upload(`${userId}/${currentFileName}`, pdfBytes, {
          upsert: false // Ensure we don't overwrite existing files
        });
      
      if (!error) {
        // Upload successful
        uploadError = null;
        break;
      }
      
      if (error.message !== 'The resource already exists') {
        // If it's not a duplicate error, throw it
        uploadError = error;
        break;
      }
      
      uploadAttempt++;
    }

    if (uploadError) {
      console.error('Error uploading report:', uploadError);
      throw new Error(`Failed to save report: ${uploadError.message}`);
    }

    // Save report metadata with the final successful filename
    let finalFileName = fileName;
    if (uploadAttempt > 1) {
      finalFileName = fileName.replace('.pdf', `-${uploadAttempt}.pdf`);
    }

    const { error: metadataError } = await supabase
      .from('user_reports')
      .insert({
        user_id: userId,
        report_type: '30-day',
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
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
