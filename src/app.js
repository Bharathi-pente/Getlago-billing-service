require('dotenv').config();
require('express-async-errors');

const express = require('express');
const logger = require('./utils/logger');
const { migrate } = require('./db/migrate');
const requestLogger = require('./middleware/requestLogger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const { startScheduler } = require('./jobs/retrySyncJobs');

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Initialize application
 */
async function initializeApp() {
  try {
    // Run database migration
    logger.info('Running database migration...');
    await migrate();
    logger.info('Database migration completed');

    // Log environment configuration
    logger.info('Environment configuration:', {
      node_env: process.env.NODE_ENV,
      port: PORT,
      lago_url: process.env.LAGO_URL,
      db_host: process.env.DB_HOST,
      db_name: process.env.DB_NAME,
    });

    // Start cron job scheduler
    startScheduler();

    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Middleware setup order is critical!

// 1. Raw body parser ONLY for webhook route (must come before express.json)
app.use('/api/v1/webhooks/lago', express.raw({ type: 'application/json' }));

// 2. JSON body parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request logging
app.use(requestLogger);

// 4. Authentication (skips /health and /webhooks)
app.use(auth);

// 5. Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'billing-service',
    lago_url: process.env.LAGO_URL,
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount all API routes
app.use('/api/v1', routes);

// 7. Global error handler (must be last)
app.use(errorHandler);

// Start server
initializeApp().then(() => {
  app.listen(PORT, () => {
    logger.info(`Billing service listening on port ${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });
});

module.exports = app;
