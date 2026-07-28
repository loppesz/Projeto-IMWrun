import { Router } from 'express';

export const registrationsRouter = Router();

// POST /api/registrations
registrationsRouter.post('/', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 9.1' });
});
