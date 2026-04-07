require('dotenv').config();
const { retryPendingJobs } = require('./retrySyncJobs');
const logger = require('../utils/logger');

(async () => {
  try {
    logger.info('Manually triggering retryPendingJobs...');
    await retryPendingJobs();
    logger.info('retryPendingJobs completed');
    process.exit(0);
  } catch (err) {
    logger.error('Error running retryPendingJobs:', err);
    process.exit(1);
  }
})();
