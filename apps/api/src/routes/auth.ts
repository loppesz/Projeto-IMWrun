import { Router } from 'express';

export const authRouter = Router();

// POST /api/auth/request-otp
authRouter.post('/request-otp', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 5.1' });
});

// POST /api/auth/verify-otp
authRouter.post('/verify-otp', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 5.1' });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 5.1' });
});
