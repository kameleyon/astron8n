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
    y: pageHeight - 150,
    width: pageWidth,
    height: 150,
    color: rgb(0.95, 0.95, 1), // Light blue background
  });

  // Add title with larger size and centered
  const titleText = 'AstroGenie Report';
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 40);
  firstPage.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - 80,
    size: 40,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.8), // Dark blue text
  });

  // Add subtitle
  const subtitleText = 'Comprehensive 30-Day Focus and Action Plan';
  const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 18);
  firstPage.drawText(subtitleText, {
    x: (pageWidth - subtitleWidth) / 2,
    y: pageHeight - 120,
    size: 18,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Add date with better formatting
  const dateText = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const dateWidth = helvetica.widthOfTextAtSize(dateText, 14);
  firstPage.drawText(dateText, {
    x: (pageWidth - dateWidth) / 2,
    y: pageHeight - 145,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Add user name with better styling
  const userText = `Prepared for: ${userName}`;
  const userWidth = helveticaBold.widthOfTextAtSize(userText, 16);
  firstPage.drawText(userText, {
    x: (pageWidth - userWidth) / 2,
    y: pageHeight - 170,
    size: 16,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Add divider line
  firstPage.drawLine({
    start: { x: margin, y: pageHeight - 190 },
    end: { x: pageWidth - margin, y: pageHeight - 190 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Add websites reference
  const websitesText = 'Transit data sourced from:';
  firstPage.drawText(websitesText, {
    x: margin,
    y: pageHeight - 220,
    size: 12,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  firstPage.drawText('• astro.com - Extended Chart Selection (30-day transits)', {
    x: margin + 20,
    y: pageHeight - 240,
    size: 12,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });

  firstPage.drawText('• cardology.com - Birth Card and Yearly Spread', {
    x: margin + 20,
    y: pageHeight - 260,
    size: 12,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });

  let currentPage = firstPage;
  let y = pageHeight - 300; // Start below website references
  
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
        color: rgb(0.95, 0.95, 1),
      });
      
      currentPage.drawText(line.substring(2), {
        x: margin,
        y: y,
        size: 24,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.8),
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
        color: rgb(0.3, 0.3, 0.3),
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
        color: rgb(0.2, 0.2, 0.8),
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

    // Import calculator from birthchartpack
    const { calculateBirthChart } = await import('../../../../birthchartpack/lib/services/astro/calculator');
    const birthChartData = await calculateBirthChart({
      name: userProfile.full_name,
      date: userProfile.birth_date,
      time: userProfile.birth_time || '12:00', // Default to noon if time unknown
      location: userProfile.birth_location,
      latitude: userProfile.latitude,
      longitude: userProfile.longitude,
      houseSystem: 'PLACIDUS'
    });

    // Format birth chart data for report
    const birthChart = {
      sun_sign: birthChartData.planets.find((p: Planet) => p.name === 'Sun')?.sign || 'Unknown',
      moon_sign: birthChartData.planets.find((p: Planet) => p.name === 'Moon')?.sign || 'Unknown',
      rising_sign: birthChartData.ascendant.sign,
      houses: birthChartData.houses,
      aspects: birthChartData.aspects,
      planets: birthChartData.planets
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

    // Generate report content
    let reportContent;
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
          'X-Title': 'AstroGenie Report Generator'
        },
        body: JSON.stringify({
          model: 'perplexity/llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are an expert astrologer and spiritual guide specializing in creating personalized reports that combine multiple modalities including astrology, human design, numerology, life path, natal chart (including degrees, houses, and planets), cardology (birth card), and upcoming 30-day transits. Your reports are detailed, comprehensive, and immersive, written in a flowing narrative style rather than a segmented format. Your tone is expertly knowledgeable, warm, and engaging.

To ensure accuracy in your transit predictions:
1. Retrieve upcoming 30-day transits from astro.com:
   - Go to "Extended Chart Selection"
   - Pull natal transits for the next 30 days
   - Use these exact transit dates and aspects in your analysis

2. Get cardology data from cardology.com:
   - Look up the Birth Card and Yearly Spread
   - Incorporate this information into your analysis

This ensures your transit predictions and cardology interpretations are precise and timely.`
            },
            {
              role: 'user',
              content: `Generate a personalized, in-depth 30-day astrological and energetic forecast using the following data:
              Birth Chart: ${JSON.stringify(combinedData.birth_chart, null, 2)}
              Human Design: ${JSON.stringify(combinedData.human_design, null, 2)}
              Numerology: ${JSON.stringify(combinedData.numerology, null, 2)}
              Life Path: ${JSON.stringify(combinedData.life_path, null, 2)}
              Cardology: ${JSON.stringify(combinedData.cardology, null, 2)}

              Structure the report as follows:

              1. Introduction: Setting the Stage
              - Brief but powerful introduction setting the theme for the next 30 days
              - Highlight the energetic shift shaped by natal chart, life path, personal cycles, and upcoming transits
              - Set the tone for the month's theme (growth, transformation, breakthroughs, reflection, or action)

              2. Core Analysis & Cosmic Influences
              - Analyze key planetary transits and their interaction with natal placements
              - Provide Human Design guidance based on type and authority
              - Include I Ching hexagram interpretation for the month
              - Integrate numerology and Life Path insights
              - Incorporate Birth Card and yearly influence analysis

              3. Love, Money, & Health Forecasts
              - Love & Relationships: Venus transits, 7th House activations
              - Money & Career: 2nd House transits, Jupiter/Saturn influences
              - Health & Well-being: 6th and 12th House transits, energy levels

              4. Key Dates & Action Steps
              - Best days for career, love, investments, health
              - Days to avoid major decisions or actions
              - Specific guidance for navigating challenges

              5. Final Words & Integration
              - Monthly theme reflection
              - Affirmation/mantra for the month
              - Guidance for mid-month review

              Write in a flowing narrative style, blending insights seamlessly rather than listing separate sections. Ensure all systems (astrology, human design, numerology, etc.) feel interconnected in one cohesive story. Format the response in markdown with elegant section transitions.`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      reportContent = data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating report content:', error);
      return NextResponse.json(
        { error: 'Failed to generate report content' },
        { status: 500 }
      );
    }

    // Create PDF
    const pdfBytes = await createPDF(reportContent, userName);

    // Save report to database
    const fileName = `${userName}30DayReport${new Date().toISOString().split('T')[0]}.pdf`;
    const { error: uploadError } = await supabase
      .storage
      .from('reports')
      .upload(`${userId}/${fileName}`, pdfBytes);

    if (uploadError) {
      throw uploadError;
    }

    // Save report metadata
    const { error: metadataError } = await supabase
      .from('user_reports')
      .insert({
        user_id: userId,
        report_type: '30-day',
        file_name: fileName,
        content: reportContent,
        created_at: new Date().toISOString()
      });

    if (metadataError) {
      throw metadataError;
    }

    return NextResponse.json({
      success: true,
      fileName,
      pdfBytes: Buffer.from(pdfBytes).toString('base64')
    });
  } catch (error) {
    console.error('Error in report generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
