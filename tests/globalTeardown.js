import { pool } from "../src/db.js";

export default async function globalTeardown() {
  await pool.end();
}
