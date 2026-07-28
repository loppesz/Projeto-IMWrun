import { Router } from 'express';

export const runsRouter = Router();

// POST /api/runs/start
runsRouter.post('/start', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 12.1' });
});

// POST /api/runs/:sessionId/track
runsRouter.post('/:sessionId/track', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 12.1' });
});

// POST /api/runs/:sessionId/finish
runsRouter.post('/:sessionId/finish', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 12.2' });
});

// GET /api/runs/:sessionId/status
runsRouter.get('/:sessionId/status', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 12.2' });
});
