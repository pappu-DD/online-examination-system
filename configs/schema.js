import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { number } from 'framer-motion';

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});