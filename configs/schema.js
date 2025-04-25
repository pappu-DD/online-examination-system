import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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