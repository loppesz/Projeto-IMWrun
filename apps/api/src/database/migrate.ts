/**
 * IMW Run – Migration Runner
 *
 * Reads SQL files from the `migrations/` directory (in alphabetical order)
 * and executes each one that has not yet been applied, tracking state in the
 * `schema_migrations` bookkeeping table.
 *
 * Usage:
 *   npx tsx src/database/migrate.ts
 *   -- or --
 *   npm run migrate   (if a script is added to package.json)
 */

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load .env so DATABASE_URL is available when the script is run directly
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function migrate(): Promise<void> {
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const client = await pool.connect();
    try {
      // Ensure the bookkeeping table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          filename   VARCHAR     PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // Discover migration files, sorted lexicographically (001_, 002_, …)
      const files = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      if (files.length === 0) {
        console.log('[migrate] No migration files found.');
        return;
      }

      for (const filename of files) {
        // Check whether this migration was already applied
        const { rows } = await client.query<{ filename: string }>(
          'SELECT filename FROM schema_migrations WHERE filename = $1',
          [filename],
        );

        if (rows.length > 0) {
          console.log(`[migrate] Skipping  ${filename} (already applied)`);
          continue;
        }

        const filepath = path.join(MIGRATIONS_DIR, filename);
        const sql = fs.readFileSync(filepath, 'utf8');

        console.log(`[migrate] Applying  ${filename} …`);

        // Run the entire migration file inside a single transaction so that
        // a partial failure leaves the database unchanged.
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (filename) VALUES ($1)',
            [filename],
          );
          await client.query('COMMIT');
          console.log(`[migrate] Applied   ${filename} ✓`);
        } catch (err) {
          await client.query('ROLLBACK');
          throw new Error(
            `[migrate] Failed to apply ${filename}: ${(err as Error).message}`,
          );
        }
      }

      console.log('[migrate] All migrations complete.');
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
