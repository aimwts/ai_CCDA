import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX || 5),
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000
});

db.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});
