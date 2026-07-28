import { Router } from 'express';

export const rankingRouter = Router();

// GET /api/ranking
rankingRouter.get('/', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 14.1' });
});
