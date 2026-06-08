import knex from 'knex';
import knexfile from '../../knexfile.js';
import config from '../config/index.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const environment = config.NODE_ENV || 'development';
const connectionConfig = knexfile[environment];

if (!connectionConfig) {
  logger.error(`No knex configuration for environment: ${environment}`);
  process.exit(1);
}

const db = knex(connectionConfig);

db.raw('SELECT 1')
  .then(() => {
    logger.info(`Database connected [${environment}] → ${connectionConfig.connection.database}`);
  })
  .catch((err) => {
    logger.error('Database connection failed:', err.message);
    // In real start we may want to exit, but for dev allow retry
  });

export default db;
