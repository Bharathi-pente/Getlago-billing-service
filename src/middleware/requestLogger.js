const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * Custom Morgan token for request body
 */
morgan.token('body', (req) => {
  if (req.path.includes('/webhooks')) {
    return '[WEBHOOK]';
  }
  return JSON.stringify(req.body);
});

/**
 * Morgan logger middleware with custom format
 */
const requestLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length] bytes - :body',
  {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }
);

module.exports = requestLogger;
