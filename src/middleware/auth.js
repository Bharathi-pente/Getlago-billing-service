const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Validates Bearer token for all routes except /health, /api-docs, and /webhooks
 */
function auth(req, res, next) {
  // Skip auth for health check, API docs, and webhooks
  if (req.path === '/health' || req.path.startsWith('/api-docs') || req.path.startsWith('/api/v1/webhooks')) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized request: Missing or invalid Authorization header', {
      path: req.path,
      ip: req.ip,
    });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      code: 401,
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (token !== process.env.INTERNAL_API_KEY) {
    logger.warn('Unauthorized request: Invalid API key', {
      path: req.path,
      ip: req.ip,
    });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      code: 401,
    });
  }

  next();
}

module.exports = auth;
