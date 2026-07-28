import 'dotenv/config';

import { createApp } from './app';
import { env } from './config/env';

const PORT = env.PORT;

const app = createApp();

app.listen(PORT, () => {
  console.warn(`[IMW Run API] Server running on http://localhost:${PORT}`);
  console.warn(`[IMW Run API] Environment: ${env.NODE_ENV}`);
});
