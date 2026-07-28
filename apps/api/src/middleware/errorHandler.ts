import type { NextFunction, Request, Response } from 'express';

import type { ApiError } from '@imw/shared';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ApiError = {
      status: err.status,
      code: err.code,
      message: err.message,
      ...(err.fields != null ? { fields: err.fields } : {}),
    };
    res.status(err.status).json(body);
    return;
  }

  // Unknown error — log it but don't expose internals
  console.error('[ErrorHandler] Unexpected error:', err);
  const body: ApiError = {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Ocorreu um erro interno. Tente novamente mais tarde.',
  };
  res.status(500).json(body);
}
