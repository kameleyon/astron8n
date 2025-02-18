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

    // First, use perplexity to search for transit data
    console.log('Starting transit data search...');
    let transitData;
    try {
      const perplexityResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
          'X-Title': 'AstroGenie Transit Data'
        },
        body: JSON.stringify({
          model: 'perplexity/llama-3.1-sonar-large-128k-online',
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

      console.log('Transit data response status:', perplexityResponse.status);
      const perplexityData = await perplexityResponse.json();
      console.log('Transit data response:', JSON.stringify(perplexityData, null, 2));

      if (!perplexityResponse.ok) {
        throw new Error(`Transit data API error: ${perplexityData.error || perplexityResponse.statusText}`);
      }

      if (!perplexityData.choices?.[0]?.message?.content) {
        throw new Error('Invalid transit data response format');
      }

      transitData = perplexityData.choices[0].message.content;
      console.log('Transit data retrieved successfully');
    } catch (error: unknown) {
      console.error('Error getting transit data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Transit data error details:', errorMessage);
      throw new Error(`Failed to get transit data: ${errorMessage}`);
    }

    // Now generate the report
    console.log('Starting report generation...');
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
          model: 'openai/gpt-4o-2024-11-20',
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

              Cover these sections:
              1. Monthly theme and overview
              2. Key planetary influences and aspects
              3. Love, career, and health forecasts
              4. Important dates and guidance
              5. Final reflections and mantras`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      console.log('Report generation response status:', response.status);
      const data = await response.json();
      console.log('Report generation response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(`Report generation API error: ${data.error || response.statusText}`);
      }

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid report generation response format');
      }

      reportContent = data.choices[0].message.content;
      console.log('Report generated successfully');
    } catch (error: unknown) {
      console.error('Error generating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Report generation error details:', errorMessage);
      throw new Error(`Failed to generate report: ${errorMessage}`);
    }

    // Create PDF
    console.log('Creating PDF...');
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

    console.log('Report saved successfully');
    return NextResponse.json({
      success: true,
      fileName,
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
