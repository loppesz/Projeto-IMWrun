/**
 * Seed inicial — roda uma vez para popular o banco com dados base.
 * Execute: pnpm --filter @imw/api seed
 */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { db, query } from './db';

async function seed() {
  console.log('[seed] Iniciando...');

  // Admin padrão
  const hash = await bcrypt.hash('admin123', 12);
  await query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    ['admin@imwrun.com', hash]
  );
  console.log('[seed] ✓ Admin criado (admin@imwrun.com / admin123)');

  // 12 corridas
  const races = [
    { seq: 1,  name: 'IMW Run #01', date: '2025-02-15 07:00:00-03', location: 'Parque da Cidade, Brasília/DF', status: 'finished' },
    { seq: 2,  name: 'IMW Run #02', date: '2025-03-15 07:00:00-03', location: 'Lago Norte, Brasília/DF',       status: 'finished' },
    { seq: 3,  name: 'IMW Run #03', date: '2025-04-12 07:00:00-03', location: 'Asa Sul, Brasília/DF',          status: 'available' },
    { seq: 4,  name: 'IMW Run #04', date: '2025-05-10 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 5,  name: 'IMW Run #05', date: '2025-06-14 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 6,  name: 'IMW Run #06', date: '2025-07-12 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 7,  name: 'IMW Run #07', date: '2025-08-09 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 8,  name: 'IMW Run #08', date: '2025-09-13 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 9,  name: 'IMW Run #09', date: '2025-10-11 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 10, name: 'IMW Run #10', date: '2025-11-08 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 11, name: 'IMW Run #11', date: '2025-12-06 07:00:00-03', location: 'A definir',                     status: 'locked' },
    { seq: 12, name: 'IMW Run #12', date: '2025-12-20 08:00:00-03', location: 'A definir',                     status: 'locked' },
  ];

  for (const r of races) {
    await query(
      `INSERT INTO races (sequence_number, name, race_date, location, distance_meters, status)
       VALUES ($1, $2, $3, $4, 5000, $5)
       ON CONFLICT DO NOTHING`,
      [r.seq, r.name, r.date, r.location, r.status]
    );
  }
  console.log('[seed] ✓ 12 corridas criadas');

  // Achievements base
  const achievements = [
    { code: 'FIRST_RUN',  name: 'Primeira Corrida',  description: 'Completou a primeira corrida da jornada',      icon: '🏃' },
    { code: 'IMW_12_12',  name: 'IMW RUN 12/12',     description: 'Completou todas as 12 corridas da jornada',    icon: '🏆' },
    { code: 'STREAK_3',   name: 'Sequência de 3',    description: 'Completou 3 corridas consecutivas',            icon: '🔥' },
    { code: 'STREAK_6',   name: 'Sequência de 6',    description: 'Completou 6 corridas consecutivas',            icon: '⚡' },
    { code: 'STREAK_12',  name: 'Sequência completa',description: 'Completou as 12 corridas sem faltar nenhuma',  icon: '💎' },
  ];

  for (const a of achievements) {
    await query(
      `INSERT INTO achievements (code, name, description, icon)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (code) DO NOTHING`,
      [a.code, a.name, a.description, a.icon]
    );
  }
  console.log('[seed] ✓ Achievements criados');

  console.log('[seed] Concluído!');
  await db.end();
}

seed().catch(err => {
  console.error('[seed] Erro:', err.message);
  process.exit(1);
});
