import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { supabase } from '@/lib/supabase';

async function createPDF(content: string, userName: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add logo
  const logoImageBytes = await fetch('/public/orangelogo.png').then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);
  const logoDims = logoImage.scale(0.5);
  page.drawImage(logoImage, {
    x: 50,
    y: height - logoDims.height - 50,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Add content
  const lines = content.split('\n');
  let y = height - 150;
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;

  for (const line of lines) {
    if (y < 50) {
      const newPage = pdfDoc.addPage();
      y = height - 50;
    }

    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

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

    const { userId, userName, sessionId, reportType } = await req.json();

    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 403 }
      );
    }

    // Verify payment status
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('status')
      .eq('user_id', userId)
      .eq('stripe_session_id', sessionId)
      .eq('report_type', reportType)
      .single();

    if (paymentError || !paymentData || paymentData.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment required' },
        { status: 402 }
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
        },
        body: JSON.stringify({
          model: 'perplexity/llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: `Generate a comprehensive 30-day focus and action plan report for a person with the following data:
              Birth Chart: ${userData.birth_chart}
              Human Design: ${userData.human_design}
              Numerology: ${userData.numerology}
              Life Path: ${userData.life_path}
              Cardology: ${userData.cardology}
              
              The report should include:
              1. Key astrological transits for the next 30 days
              2. Focused action steps for career, relationships, finances, personal growth, and well-being
              3. Power dates and their significance
              4. Strategic insights for aligning with opportunities
              5. Guidance for overcoming potential challenges
              
              Format the response in markdown.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report content');
      }

      const data = await response.json();
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
        content: reportContent, // Store markdown content for future regeneration
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
