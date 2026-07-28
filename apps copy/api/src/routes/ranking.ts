import { Router } from 'express';

import { query } from '../database/db';

export const rankingRouter = Router();

// GET /api/ranking?filter=geral|M|F|18-29|30-39|40-49|50-59|60+&raceId=uuid
rankingRouter.get('/', async (req, res, next) => {
  try {
    const { filter = 'geral', raceId } = req.query as { filter?: string; raceId?: string };

    let whereClause = '';
    const params: unknown[] = [];

    if (raceId) {
      params.push(raceId);
      whereClause += ` AND rr.race_id = $${params.length}`;
    }

    if (filter === 'M' || filter === 'F') {
      params.push(filter);
      whereClause += ` AND p.gender = $${params.length}`;
    } else if (filter && filter !== 'geral') {
      // Faixa etária ex: "18-29", "60+"
      if (filter === '60+') {
        whereClause += ` AND p.age >= 60`;
      } else {
        const [min, max] = filter.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          params.push(min, max);
          whereClause += ` AND p.age >= $${params.length - 1} AND p.age <= $${params.length}`;
        }
      }
    }

    const rows = await query<any>(`
      SELECT
        p.name,
        COUNT(DISTINCT rr.race_id) AS races_completed,
        ROUND(SUM(rr.valid_km)::numeric, 1) AS total_km,
        MIN(rr.total_seconds) AS best_time
      FROM run_results rr
      JOIN participants p ON p.id = rr.participant_id
      WHERE rr.completed = true ${whereClause}
      GROUP BY p.id, p.name
      ORDER BY races_completed DESC, total_km DESC, p.name ASC
    `, params);

    const ranking = rows.map((r, i) => ({
      position: i + 1,
      name: r.name,
      racesCompleted: Number(r.races_completed),
      totalKm: Number(r.total_km),
    }));

    res.json(ranking);
  } catch (err) {
    next(err);
  }
});
