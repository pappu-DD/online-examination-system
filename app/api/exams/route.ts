import { questions, exams } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/configs/db';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get('id');

  if (!examId) {
    return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
  }

  try {
    // Delete questions associated with the exam
    await db.delete(questions).where(eq(questions.examId, parseInt(examId)));

    // Delete the exam
    await db.delete(exams).where(eq(exams.id, parseInt(examId)));

    return NextResponse.json({ message: 'Exam and associated questions deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}