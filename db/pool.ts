import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "node_practice",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
  }
}

export default pool;