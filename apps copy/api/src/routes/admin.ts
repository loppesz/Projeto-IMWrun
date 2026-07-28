import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { query, queryOne } from '../database/db';

export const adminRouter = Router();

// ── Auth ──────────────────────────────────────────────────────────────────

// POST /api/admin/login
adminRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Email e senha obrigatórios' });

    const admin = await queryOne<any>(`SELECT id, email, password_hash FROM admins WHERE email = $1`, [email]);
    if (!admin)
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid)
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' });

    await query(`UPDATE admins SET last_login = NOW() WHERE id = $1`, [admin.id]);

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// ── Middleware de auth admin ──────────────────────────────────────────────
function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token não fornecido' });

  try {
    const payload = jwt.verify(auth.slice(7), env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token inválido ou expirado' });
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
adminRouter.get('/dashboard', requireAdmin, async (_req, res, next) => {
  try {
    const [participants, completions, kmRow] = await Promise.all([
      queryOne<any>(`SELECT COUNT(*) AS total FROM participants`),
      queryOne<any>(`SELECT COUNT(*) AS total FROM run_results WHERE completed = true`),
      queryOne<any>(`SELECT COALESCE(SUM(valid_km), 0) AS total FROM run_results WHERE completed = true`),
    ]);

    res.json({
      totalParticipants: Number(participants?.total ?? 0),
      totalCompletions:  Number(completions?.total ?? 0),
      totalKm:           Number(kmRow?.total ?? 0),
    });
  } catch (err) {
    next(err);
  }
});

// ── Corridas ──────────────────────────────────────────────────────────────

// GET /api/admin/races
adminRouter.get('/races', requireAdmin, async (_req, res, next) => {
  try {
    const races = await query(`SELECT * FROM races ORDER BY sequence_number ASC`);
    res.json(races);
  } catch (err) { next(err); }
});

// POST /api/admin/races
adminRouter.post('/races', requireAdmin, async (req, res, next) => {
  try {
    const { name, race_date, location, sequence_number, map_url, photos_url, donation_info } = req.body;
    const race = await queryOne<any>(
      `INSERT INTO races (name, race_date, location, sequence_number, map_url, photos_url, donation_info)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, race_date, location, sequence_number, map_url, photos_url, donation_info]
    );
    res.status(201).json(race);
  } catch (err) { next(err); }
});

// PUT /api/admin/races/:id
adminRouter.put('/races/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, race_date, location, map_url, photos_url, donation_info } = req.body;
    const race = await queryOne<any>(
      `UPDATE races SET name=$1, race_date=$2, location=$3, map_url=$4, photos_url=$5,
       donation_info=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [name, race_date, location, map_url, photos_url, donation_info, req.params.id]
    );
    if (!race) return res.status(404).json({ code: 'NOT_FOUND', message: 'Corrida não encontrada' });
    res.json(race);
  } catch (err) { next(err); }
});

// PATCH /api/admin/races/:id/status
adminRouter.patch('/races/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body as { status: string };
    const allowed = ['locked', 'available', 'ongoing', 'finished'];
    if (!allowed.includes(status))
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Status inválido' });

    const race = await queryOne<any>(
      `UPDATE races SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING id, status`,
      [status, req.params.id]
    );
    if (!race) return res.status(404).json({ code: 'NOT_FOUND', message: 'Corrida não encontrada' });
    res.json(race);
  } catch (err) { next(err); }
});

// ── Grupos ────────────────────────────────────────────────────────────────

// GET /api/admin/races/:raceId/groups
adminRouter.get('/races/:raceId/groups', requireAdmin, async (req, res, next) => {
  try {
    const groups = await query<any>(`
      SELECT g.*,
        json_agg(json_build_object(
          'id', p.id, 'name', p.name, 'number', p.participant_number,
          'present', gm.present, 'finish_time', rr.total_seconds
        ) ORDER BY p.participant_number) AS members
      FROM groups g
      LEFT JOIN group_members gm ON gm.group_id = g.id
      LEFT JOIN participants p ON p.id = gm.participant_id
      LEFT JOIN run_results rr ON rr.participant_id = p.id AND rr.race_id = g.race_id
      WHERE g.race_id = $1
      GROUP BY g.id
      ORDER BY g.name ASC
    `, [req.params.raceId]);
    res.json(groups);
  } catch (err) { next(err); }
});

// POST /api/admin/races/:raceId/groups — criar grupo
adminRouter.post('/races/:raceId/groups', requireAdmin, async (req, res, next) => {
  try {
    const { name, max_size = 10, scheduled_start } = req.body;
    const group = await queryOne<any>(
      `INSERT INTO groups (race_id, name, max_size, scheduled_start)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.raceId, name, max_size, scheduled_start ?? null]
    );
    res.status(201).json(group);
  } catch (err) { next(err); }
});

// PATCH /api/admin/groups/:id/start — iniciar grupo
adminRouter.patch('/groups/:id/start', requireAdmin, async (req, res, next) => {
  try {
    const group = await queryOne<any>(
      `UPDATE groups SET started_at = NOW() WHERE id = $1 AND started_at IS NULL RETURNING *`,
      [req.params.id]
    );
    if (!group) return res.status(400).json({ code: 'ALREADY_STARTED', message: 'Grupo já foi iniciado' });
    res.json(group);
  } catch (err) { next(err); }
});

// PATCH /api/admin/groups/:id/start-all — largada geral (todos os grupos da corrida)
adminRouter.patch('/races/:raceId/groups/start-all', requireAdmin, async (req, res, next) => {
  try {
    await query(
      `UPDATE groups SET started_at = NOW() WHERE race_id = $1 AND started_at IS NULL`,
      [req.params.raceId]
    );
    res.json({ message: 'Largada geral disparada' });
  } catch (err) { next(err); }
});

// PATCH /api/admin/groups/:groupId/members/:participantId/present — marcar presença
adminRouter.patch('/groups/:groupId/members/:participantId/present', requireAdmin, async (req, res, next) => {
  try {
    const { present } = req.body as { present: boolean };
    await query(
      `UPDATE group_members SET present = $1 WHERE group_id = $2 AND participant_id = $3`,
      [present, req.params.groupId, req.params.participantId]
    );
    res.json({ message: 'Presença atualizada' });
  } catch (err) { next(err); }
});

// ── Resultados ────────────────────────────────────────────────────────────

// POST /api/admin/results — registrar chegada
adminRouter.post('/results', requireAdmin, async (req, res, next) => {
  try {
    const { participantId, raceId, groupId, totalSeconds, validKm = 5.0, completed = true, notes } = req.body;

    const result = await queryOne<any>(
      `INSERT INTO run_results (participant_id, race_id, group_id, total_seconds, valid_km, completed, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (participant_id, race_id)
       DO UPDATE SET total_seconds=$4, valid_km=$5, completed=$6, notes=$7, recorded_at=NOW()
       RETURNING *`,
      [participantId, raceId, groupId ?? null, totalSeconds, validKm, completed, notes ?? null]
    );
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// GET /api/admin/races/:raceId/registrations — lista inscritos
adminRouter.get('/races/:raceId/registrations', requireAdmin, async (req, res, next) => {
  try {
    const rows = await query<any>(`
      SELECT p.participant_number, p.name, p.phone, p.age, p.gender,
             r.registered_at, g.name AS group_name
      FROM registrations r
      JOIN participants p ON p.id = r.participant_id
      LEFT JOIN groups g ON g.id = r.group_id
      WHERE r.race_id = $1
      ORDER BY p.participant_number ASC
    `, [req.params.raceId]);
    res.json(rows);
  } catch (err) { next(err); }
});
