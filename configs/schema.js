import {integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subject: text('subject').notNull(),
  numOfQuestions: integer('num_of_questions').notNull(),
  duration: integer('duration').notNull(),
  difficulty: text('difficulty').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').references(() => exams.id),
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // Store options as JSON array
  correctOption: integer('correct_option').notNull(),
  marks: integer('marks').notNull()
});