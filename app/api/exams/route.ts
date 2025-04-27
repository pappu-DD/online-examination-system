import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { exams, questions } from '@/configs/schema';
import { eq } from 'drizzle-orm';

// GET all exams
export async function GET() {
  try {
    const allExams = await db.select().from(exams);
    return NextResponse.json(allExams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

// POST create new exam
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newExam = await db.insert(exams).values(body).returning();
    return NextResponse.json(newExam[0]);
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}

// PUT update exam
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('id');
    const body = await request.json();

    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const updatedExam = await db
      .update(exams)
      .set(body)
      .where(eq(exams.id, parseInt(examId)))
      .returning();

    return NextResponse.json(updatedExam[0]);
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}

// DELETE exam (already exists)