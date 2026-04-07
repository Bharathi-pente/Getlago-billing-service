const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Handles all errors and returns consistent JSON responses
 */
function errorHandler(err, req, res, next) {
  logger.error('Error handler caught exception:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
  }

  // Lago API errors
  if (err.response) {
    statusCode = err.response.status || 500;
    message = err.response.data?.error || err.response.statusText || 'Lago API error';
    
    logger.error('Lago API error:', {
      status: statusCode,
      data: err.response.data,
      url: err.config?.url,
      method: err.config?.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
