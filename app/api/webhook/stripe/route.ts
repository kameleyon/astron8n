import { NextResponse } from 'next/server';

// Stripe webhook is completely disabled as per user request
export async function POST(req: Request) {
  console.log('Stripe webhook endpoint called but is disabled');
  return NextResponse.json({ message: 'Stripe webhook is disabled' }, { status: 200 });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
