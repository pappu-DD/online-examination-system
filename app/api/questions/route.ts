import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/configs/db';
import { questions } from '@/configs/schema';
import { eq } from 'drizzle-orm';

// GET questions (with optional examId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');

    let query = db.select().from(questions)
      .where(examId ? eq(questions.examId, parseInt(examId)) : undefined);

    const allQuestions = await query;
    return NextResponse.json(allQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST create new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newQuestion = await db.insert(questions).values(body).returning();
    return NextResponse.json(newQuestion[0]);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('id');

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    await db.delete(questions).where(eq(questions.id, parseInt(questionId)));

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}