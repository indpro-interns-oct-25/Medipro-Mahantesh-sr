import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

let pool;

export function createPool() {
  if (pool) return Promise.resolve(pool);
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  pool = new pg.Pool({ connectionString });
  return pool.connect().then((client) => {
    client.release();
    return pool;
  });
}

export function getPool() {
  if (!pool) throw new Error('DB pool not initialized. Call createPool() first.');
  return pool;
}

export async function query(sql, params = []) {
  const p = getPool();
  const res = await p.query(sql, params);
  return res;
}


