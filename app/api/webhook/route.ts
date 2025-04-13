import { NextResponse } from 'next/server';

// Webhook is completely disabled as per user request
export async function POST(request: Request) {
  console.log('Webhook endpoint called but is disabled');
  return NextResponse.json({ message: 'Webhook is disabled' }, { status: 200 });
}
