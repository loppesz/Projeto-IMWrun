import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { adminRouter } from './routes/admin';
import { authRouter } from './routes/auth';
import { racesRouter } from './routes/races';
import { rankingRouter } from './routes/ranking';
import { registrationsRouter } from './routes/registrations';
import { runsRouter } from './routes/runs';

export function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  // Logging
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRouter);
  app.use('/api/races', racesRouter);
  app.use('/api/registrations', registrationsRouter);
  app.use('/api/runs', runsRouter);
  app.use('/api/ranking', rankingRouter);
  app.use('/api/admin', adminRouter);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
