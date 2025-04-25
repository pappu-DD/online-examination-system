import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { feedbacks } from '@/configs/schema';

export async function POST(req: NextRequest) {
  try {
    const { email, feedback } = await req.json();

    if (!email || !feedback) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.insert(feedbacks).values({
      email,
      message: feedback,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
