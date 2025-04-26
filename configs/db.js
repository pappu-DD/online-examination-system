// configs/db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
console.log("Database URL:", process.env.DATABASE_URL);

// Add this export
const connectToDatabase = async () => {
  //  You were already connecting to the database
  return { db };
};

export { connectToDatabase };
