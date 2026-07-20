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

  // MoreLogin Cloud Phone (outsourced emulator replacement)
  MORELOGIN_API_ID: z.string().optional(),
  MORELOGIN_API_KEY: z.string().optional(),
  MORELOGIN_LOCAL_API: z.string().url().default('http://127.0.0.1:40000'),
  MORELOGIN_DEFAULT_SKU_ID: z.string().default('10004'),
  MORELOGIN_MODE: z.enum(['open', 'local']).default('open'),

  // Pairing handshake verification gate (opt-in; default off = legacy behavior)
  PAIRING_HANDSHAKE_GATE: z.enum(['0', '1']).default('0'),
  HANDSHAKE_WAIT_MS: z.coerce.number().default(18000),
  HANDSHAKE_WEAK_ACCEPT_MS: z.coerce.number().default(12000),
  // When gate is on, still allow weak accept (socket open) for debug — not proof of phone notify
  HANDSHAKE_ALLOW_WEAK_WITH_GATE: z.enum(['0', '1']).default('0'),
  // How many companion_hello attempts per /sessions/connect (restores pre-teardown recovery)
  PAIRING_HELLO_ATTEMPTS: z.coerce.number().min(1).max(5).default(3),
  // Auto re-request pairing after Connection Failure (legacy recovery path)
  PAIRING_AUTO_RETRY_ON_FAILURE: z.enum(['0', '1']).default('1'),

  // Meta WhatsApp Cloud API webhooks (official Business API — separate from Baileys)
  WHATSAPP_VERIFY_TOKEN: z.string().min(8).optional(),
  WHATSAPP_APP_SECRET: z.string().optional(),
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
