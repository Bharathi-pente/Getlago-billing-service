const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create alert in Lago
 * @param {Object} alertData - Alert data
 * @returns {Promise<Object>} Created alert
 */
async function createAlert(alertData) {
  try {
    logger.info('Creating alert in Lago', {
      code: alertData.code,
    });

    const response = await lagoClient.alerts.createAlert({
      alert: alertData,
    });

    logger.info('Alert created in Lago', {
      code: alertData.code,
      lago_id: response.alert?.lago_id,
    });

    return response.alert;
  } catch (error) {
    logger.error('Failed to create alert in Lago', {
      code: alertData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get alert by ID
 * @param {string} id - Alert ID
 * @returns {Promise<Object>} Alert data
 */
async function getAlert(id) {
  try {
    logger.debug('Fetching alert from Lago', { id });

    const response = await lagoClient.alerts.findAlert(id);

    logger.debug('Alert fetched from Lago', { id });

    return response.alert;
  } catch (error) {
    logger.error('Failed to fetch alert from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update alert in Lago
 * @param {string} id - Alert ID
 * @param {Object} alertData - Updated alert data
 * @returns {Promise<Object>} Updated alert
 */
async function updateAlert(id, alertData) {
  try {
    logger.info('Updating alert in Lago', { id });

    const response = await lagoClient.alerts.updateAlert(id, {
      alert: alertData,
    });

    logger.info('Alert updated in Lago', { id });

    return response.alert;
  } catch (error) {
    logger.error('Failed to update alert in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete alert from Lago
 * @param {string} id - Alert ID
 * @returns {Promise<void>}
 */
async function deleteAlert(id) {
  try {
    logger.info('Deleting alert from Lago', { id });

    await lagoClient.alerts.destroyAlert(id);

    logger.info('Alert deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete alert from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all alerts
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Alerts list with meta
 */
async function listAlerts(params = {}) {
  try {
    logger.debug('Fetching alerts from Lago', params);

    const response = await lagoClient.alerts.findAllAlerts(params);

    logger.debug('Alerts fetched from Lago', {
      count: response.alerts?.length || 0,
    });

    return {
      alerts: response.alerts || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch alerts from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createAlert,
  getAlert,
  updateAlert,
  deleteAlert,
  listAlerts,
};
