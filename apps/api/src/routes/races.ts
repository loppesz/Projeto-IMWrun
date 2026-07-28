import { Router } from 'express';

export const racesRouter = Router();

// GET /api/races
racesRouter.get('/', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.1' });
});

// GET /api/races/:id
racesRouter.get('/:id', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.1' });
});

// GET /api/races/:id/route
racesRouter.get('/:id/route', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 8.1' });
});
