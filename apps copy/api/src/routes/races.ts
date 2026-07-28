import { Router } from 'express';

import { query, queryOne } from '../database/db';

export const racesRouter = Router();

// GET /api/races — lista todas as corridas
racesRouter.get('/', async (_req, res, next) => {
  try {
    const races = await query(`
      SELECT id, sequence_number, name, race_date, location,
             distance_meters, status, has_route, map_url, photos_url, donation_info
      FROM races
      ORDER BY sequence_number ASC
    `);
    res.json(races);
  } catch (err) {
    next(err);
  }
});

// GET /api/races/:id — detalhes de uma corrida
racesRouter.get('/:id', async (req, res, next) => {
  try {
    const race = await queryOne(`
      SELECT id, sequence_number, name, race_date, location,
             distance_meters, status, has_route, map_url, photos_url, donation_info
      FROM races
      WHERE id = $1
    `, [req.params.id]);

    if (!race) return res.status(404).json({ code: 'NOT_FOUND', message: 'Corrida não encontrada' });
    res.json(race);
  } catch (err) {
    next(err);
  }
});

// GET /api/races/:id/groups — grupos de uma corrida
racesRouter.get('/:id/groups', async (req, res, next) => {
  try {
    const groups = await query(`
      SELECT g.id, g.name, g.max_size, g.scheduled_start, g.started_at, g.finished_at,
             COUNT(gm.participant_id) AS member_count
      FROM groups g
      LEFT JOIN group_members gm ON gm.group_id = g.id
      WHERE g.race_id = $1
      GROUP BY g.id
      ORDER BY g.name ASC
    `, [req.params.id]);
    res.json(groups);
  } catch (err) {
    next(err);
  }
});
