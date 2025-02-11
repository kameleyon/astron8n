import { NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is not set')
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'qwen/qwen-plus',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in OpenRouter API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
