import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"
import { config } from "dotenv";

config(); // Load environment variables

const connection = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(connection);