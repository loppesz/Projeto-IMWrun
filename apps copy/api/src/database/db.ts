import { Pool } from 'pg';

import { env } from '../config/env';

// Pool de conexões PostgreSQL — reutiliza conexões entre requests
export const db = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

db.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool:', err.message);
});

/** Executa uma query e retorna as linhas */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await db.query<T>(sql, params);
  return result.rows;
}

/** Executa uma query e retorna a primeira linha ou null */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
