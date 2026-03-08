import { createClient } from "@libsql/client";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db-schema";

let _db: LibSQLDatabase<typeof schema> | null = null;

function getDb(): LibSQLDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Set it in Vercel Environment Variables for runtime."
    );
  }
  const client = createClient({
    url,
    authToken: token ?? undefined,
  });
  _db = drizzle(client, { schema });
  return _db;
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
