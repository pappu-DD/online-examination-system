import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { contacts } from '@/configs/schema';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}