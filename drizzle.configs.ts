import type { Config } from "drizzle-kit";

export default {
  schema: "./configs/schema.js",  // or .ts based on your file
  out: "./drizzle",
  connectionString: process.env.DATABASE_URL!,
} satisfies Config;
