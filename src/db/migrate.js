require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Run database migrations
 */
async function migrate() {
  try {
    logger.info('Starting database migration...');
    
    const migrationFile = path.join(__dirname, 'migrations', '001_initial.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await query(sql);
    
    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
