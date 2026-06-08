import { logger } from '../../utils/logger.js';

/**
 * Centralized error handler middleware.
 * Use as app.use(errorHandler) at the end.
 */
export function errorHandler(err, req, res, next) {
  // Log full error server-side
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.method !== 'GET' ? req.body : undefined,
  });

  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal server error'
    : err.message || 'Unexpected error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
  });
}

export default errorHandler;
