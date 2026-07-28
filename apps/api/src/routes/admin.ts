import { Router } from 'express';

export const adminRouter = Router();

// Admin auth
// POST /api/admin/auth/login
adminRouter.post('/auth/login', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 6.1' });
});

// POST /api/admin/auth/logout
adminRouter.post('/auth/logout', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 6.1' });
});

// Admin races CRUD — implemented in task 7.2
// GET /api/admin/races
adminRouter.get('/races', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.2' });
});

// POST /api/admin/races
adminRouter.post('/races', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.2' });
});

// PUT /api/admin/races/:id
adminRouter.put('/races/:id', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.2' });
});

// DELETE /api/admin/races/:id
adminRouter.delete('/races/:id', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.2' });
});

// PATCH /api/admin/races/:id/status
adminRouter.patch('/races/:id/status', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 7.2' });
});

// POST /api/admin/races/:id/route
adminRouter.post('/races/:id/route', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 8.1' });
});

// GET /api/admin/races/:id/registrations
adminRouter.get('/races/:id/registrations', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 16.1' });
});

// GET /api/admin/races/:id/registrations/csv
adminRouter.get('/races/:id/registrations/csv', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 16.1' });
});

// GET /api/admin/dashboard
adminRouter.get('/dashboard', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 16.1' });
});

// GET /api/admin/results/pending
adminRouter.get('/results/pending', (_req, res) => {
  res.status(501).json({ code: 'NOT_IMPLEMENTED', message: 'A ser implementado na tarefa 16.1' });
});
