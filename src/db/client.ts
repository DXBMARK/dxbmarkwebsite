import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { env } from "../server/env";

if (typeof window !== "undefined") {
  throw new Error("Database client can only be used on the server side.");
}

let dbInstance: NeonHttpDatabase<Record<string, never>> | null = null;

/**
 * Lazily retrieves the initialized Drizzle database client instance.
 * Throws a runtime error if DATABASE_URL is missing.
 */
export function getDb(): NeonHttpDatabase<Record<string, never>> {
  if (dbInstance) {
    return dbInstance;
  }

  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("[CRITICAL] DATABASE_URL is missing — database disabled.");
  }

  const sqlClient = neon(databaseUrl);
  dbInstance = drizzle(sqlClient);

  return dbInstance;
}

/**
 * Executes a lightweight SELECT 1 probe to verify the database is reachable.
 * Returns false (never throws) — safe to use as a health gate.
 *
 * @returns true if DB is reachable, false if unavailable or misconfigured.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!env.DATABASE_URL) {
    return false;
  }
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

