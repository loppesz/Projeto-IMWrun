import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[API Error]', err);

  const status = (err as any).status ?? 500;
  const message = status === 500
    ? 'Erro interno do servidor'
    : (err as Error).message;

  res.status(status).json({
    code: (err as any).code ?? 'INTERNAL_ERROR',
    message,
  });
};
