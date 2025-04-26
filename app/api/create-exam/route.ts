import { z } from 'zod';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/configs/db';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/neon-http';

// Define schema for validation
const examSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subject: z.string().min(1, 'Subject is required'),
    numOfQuestions: z.number().min(1, 'At least one question is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    description: z.string().min(1, 'Description is required'),
    questions: z.array(
        z.object({
            question: z.string().min(1, 'Question text is required'),
            options: z.array(z.string().min(1, 'Option text is required')).length(4),
            correctOption: z.number().min(0).max(3, 'Correct option must be between 0 and 3'),
        })
    ).min(1, 'At least one question is required'),
});

// Define table for exams
const exams = pgTable('exams', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    subject: text('subject').notNull(),
    numOfQuestions: integer('num_of_questions').notNull(),
    duration: integer('duration').notNull(),
    difficulty: text('difficulty').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define table for questions
const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    examId: integer('exam_id').notNull().references(() => exams.id),
    question: text('question').notNull(),
    options: text('options').array().notNull(),
    correctOption: integer('correct_option').notNull(),
});

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        console.log('Database connected successfully');

        const data = await request.json();
        const validatedData = examSchema.parse(data);
        console.log('Validated Data:', validatedData);

        const insertedExam = await db.insert(exams).values({
            title: validatedData.title,
            subject: validatedData.subject,
            numOfQuestions: validatedData.numOfQuestions,
            duration: validatedData.duration,
            difficulty: validatedData.difficulty,
            description: validatedData.description,
            createdAt: new Date(),
        }).returning({ id: exams.id });

        console.log('Inserted Exam:', insertedExam);

        const examId = insertedExam[0]?.id;

        if (!examId) {
            return NextResponse.json({ error: 'Failed to retrieve exam ID' }, { status: 500 });
        }

        const questionData = validatedData.questions.map((q) => ({
            examId,
            question: q.question,
            options: q.options,
            correctOption: q.correctOption,
        }));

        await db.insert(questions).values(questionData);

        return NextResponse.json({ success: true, examId: examId });
    } catch (error) {
        console.error('Error creating exam:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
