import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createPDF(content: string, userName: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add title
  page.drawText('AstroGenie Report', {
    x: 50,
    y: height - 50,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });

  // Add date
  page.drawText(new Date().toLocaleDateString(), {
    x: 50,
    y: height - 80,
    size: 12,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Add user name
  page.drawText(`Prepared for: ${userName}`, {
    x: 50,
    y: height - 110,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  // Parse markdown and add content
  const lines = content.split('\n');
  let y = height - 150;
  let currentPage = page;
  let fontSize = 12;
  let lineHeight = fontSize * 1.2;

  for (const line of lines) {
    // Check if we need a new page
    if (y < 50) {
      currentPage = pdfDoc.addPage();
      y = height - 50;
    }

    // Handle markdown formatting
    if (line.startsWith('# ')) {
      // Main header
      fontSize = 20;
      lineHeight = fontSize * 1.5;
      currentPage.drawText(line.substring(2), {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } else if (line.startsWith('## ')) {
      // Sub header
      fontSize = 16;
      lineHeight = fontSize * 1.4;
      currentPage.drawText(line.substring(3), {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } else if (line.startsWith('- ')) {
      // Bullet point
      fontSize = 12;
      lineHeight = fontSize * 1.3;
      currentPage.drawText('•', {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      currentPage.drawText(line.substring(2), {
        x: 70,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } else if (line.trim() === '') {
      // Empty line
      fontSize = 12;
      lineHeight = fontSize * 1.0;
    } else {
      // Regular text
      fontSize = 12;
      lineHeight = fontSize * 1.2;
      currentPage.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    y -= lineHeight;
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

    // Insert test data for the user if it doesn't exist
    const { error: insertError } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        birth_chart: {
          sun_sign: 'Aries',
          moon_sign: 'Taurus',
          rising_sign: 'Gemini',
          houses: {
            '1': 'Gemini',
            '2': 'Cancer',
            '3': 'Leo'
          },
          aspects: [
            { type: 'conjunction', planets: ['Sun', 'Mercury'] },
            { type: 'trine', planets: ['Moon', 'Venus'] }
          ]
        },
        human_design: {
          type: '6/2 Manifesting Generator',
          authority: 'Emotional',
          profile: 'Role Model Hermit',
          definition: 'Split Definition',
          centers: {
            root: true,
            sacral: true,
            solar_plexus: true
          }
        },
        numerology: {
          life_path_number: 7,
          destiny_number: 3,
          soul_urge_number: 9,
          personality_number: 5
        },
        life_path: {
          path: 'Spiritual Seeker',
          challenges: ['Self-discovery', 'Finding balance'],
          strengths: ['Intuition', 'Analysis']
        },
        cardology: {
          birth_card: 'Queen of Hearts',
          planetary_ruling_card: 'Jack of Diamonds',
          yearly_spreads: [
            { position: 1, card: '7 of Clubs' },
            { position: 2, card: 'Ace of Spades' }
          ]
        }
      });

    if (insertError) {
      console.error('Error inserting test data:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user data' },
        { status: 500 }
      );
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('birth_chart, human_design, numerology, life_path, cardology')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

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
              content: 'You are an expert astrologer and spiritual guide specializing in creating personalized reports that combine multiple modalities including astrology, human design, numerology, and cardology.'
            },
            {
              role: 'user',
              content: `Generate a comprehensive 30-day focus and action plan report for a person with the following data:
              Birth Chart: ${JSON.stringify(userData.birth_chart, null, 2)}
              Human Design: ${JSON.stringify(userData.human_design, null, 2)}
              Numerology: ${JSON.stringify(userData.numerology, null, 2)}
              Life Path: ${JSON.stringify(userData.life_path, null, 2)}
              Cardology: ${JSON.stringify(userData.cardology, null, 2)}
              
              The report should include:
              1. Key astrological transits for the next 30 days
              2. Focused action steps for career, relationships, finances, personal growth, and well-being
              3. Power dates and their significance
              4. Strategic insights for aligning with opportunities
              5. Guidance for overcoming potential challenges
              
              Format the response in markdown with clear section headers and bullet points.`
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
