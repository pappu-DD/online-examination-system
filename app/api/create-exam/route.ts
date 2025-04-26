import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { exams, questions } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examDetails, questions: questionList } = body;

    // Insert exam details
    const [exam] = await db.insert(exams).values({
      subject: examDetails.subject,
      description: examDetails.description,
      duration: examDetails.duration,
    }).returning();

    // Insert questions
    if (exam && questionList.length > 0) {
      const questionData = questionList.map((q: any) => ({
        examId: exam.id,
        text: q.text,
        options: q.options,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
      }));

      await db.insert(questions).values(questionData);
    }

    return NextResponse.json({ success: true, message: 'Exam created successfully!' });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ success: false, message: 'Failed to create exam.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get single exam with questions
      const exam = await db.select().from(exams).where(eq(exams.id, parseInt(id))).limit(1).then(res => res[0]);
      return NextResponse.json(exam);
    } else {
      // Get all exams
      const examsList = await db.select().from(exams);
      return NextResponse.json(examsList);
    }
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch exams.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Exam ID is required' }, { status: 400 });
    }

    const examId = Number(id); // Convert id to a number

    // Delete questions first to maintain referential integrity
    await db.delete(questions).where(eq(questions.examId, examId));
    await db.delete(exams).where(eq(exams.id, examId));

    return NextResponse.json({ success: true, message: 'Exam deleted successfully!' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete exam.' }, { status: 500 });
  }
}