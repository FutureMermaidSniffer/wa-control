import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be strong'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  AUTH_STATE_DIR: z.string().default('./auth-state'),
  UPLOAD_DIR: z.string().default('./uploads'),
  EXPORT_DIR: z.string().default('./exports'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),

  BAILEYS_BROWSER: z.string().default('Chrome (Linux)'),

  // Encryption for Baileys state + proxy creds (must be >=32 chars)
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 chars'),

  // Redis for BullMQ etc (optional at early bootstrap)
  REDIS_URL: z.string().optional(),
});

let config;
try {
  config = envSchema.parse(process.env);
} catch (err) {
  console.error('❌ Invalid environment configuration for wa-control:');
  if (err instanceof z.ZodError) {
    err.errors.forEach((e) => console.error(`   ${e.path.join('.')}: ${e.message}`));
  }
  process.exit(1);
}

export default config;
