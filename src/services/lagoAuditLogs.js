const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get audit log by ID
 * @param {string} id - Audit log ID
 * @returns {Promise<Object>} Audit log data
 */
async function getAuditLog(id) {
  try {
    logger.debug('Fetching audit log from Lago', { id });

    const response = await lagoClient.auditLogs.findAuditLog(id);

    logger.debug('Audit log fetched from Lago', { id });

    return response.audit_log;
  } catch (error) {
    logger.error('Failed to fetch audit log from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all audit logs
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Audit logs list with meta
 */
async function listAuditLogs(params = {}) {
  try {
    logger.debug('Fetching audit logs from Lago', params);

    const response = await lagoClient.auditLogs.findAllAuditLogs(params);

    logger.debug('Audit logs fetched from Lago', {
      count: response.audit_logs?.length || 0,
    });

    return {
      audit_logs: response.audit_logs || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch audit logs from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getAuditLog,
  listAuditLogs,
};
