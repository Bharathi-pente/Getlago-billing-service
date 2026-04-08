const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create billable metric in Lago
 * @param {Object} metricData - Billable metric data
 * @returns {Promise<Object>} Created billable metric
 */
async function createBillableMetric(metricData) {
  try {
    logger.info('Creating billable metric in Lago', {
      name: metricData.name,
      code: metricData.code,
    });

    const response = await lagoClient.billableMetrics.createBillableMetric({
      billable_metric: metricData,
    });

    logger.info('Billable metric created in Lago', {
      name: metricData.name,
      code: metricData.code,
      lago_id: response.billable_metric?.lago_id,
    });

    return response.billable_metric;
  } catch (error) {
    logger.error('Failed to create billable metric in Lago', {
      name: metricData.name,
      code: metricData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get billable metric by code
 * @param {string} code - Billable metric code
 * @returns {Promise<Object>} Billable metric data
 */
async function getBillableMetric(code) {
  try {
    logger.debug('Fetching billable metric from Lago', { code });

    const response = await lagoClient.billableMetrics.findBillableMetric(code);

    logger.debug('Billable metric fetched from Lago', { code });

    return response.billable_metric;
  } catch (error) {
    logger.error('Failed to fetch billable metric from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update billable metric in Lago
 * @param {string} code - Billable metric code
 * @param {Object} metricData - Updated billable metric data
 * @returns {Promise<Object>} Updated billable metric
 */
async function updateBillableMetric(code, metricData) {
  try {
    logger.info('Updating billable metric in Lago', { code });

    const response = await lagoClient.billableMetrics.updateBillableMetric(code, {
      billable_metric: metricData,
    });

    logger.info('Billable metric updated in Lago', { code });

    return response.billable_metric;
  } catch (error) {
    logger.error('Failed to update billable metric in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete billable metric from Lago
 * @param {string} code - Billable metric code
 * @returns {Promise<void>}
 */
async function deleteBillableMetric(code) {
  try {
    logger.info('Deleting billable metric from Lago', { code });

    await lagoClient.billableMetrics.destroyBillableMetric(code);

    logger.info('Billable metric deleted from Lago', { code });
  } catch (error) {
    logger.error('Failed to delete billable metric from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all billable metrics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Billable metrics list with meta
 */
async function listBillableMetrics(params = {}) {
  try {
    logger.debug('Fetching billable metrics from Lago', params);

    const response = await lagoClient.billableMetrics.findAllBillableMetrics(params);

    logger.debug('Billable metrics fetched from Lago', {
      count: response.billable_metrics?.length || 0,
    });

    return {
      billable_metrics: response.billable_metrics || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch billable metrics from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get billable metric groups
 * @param {string} code - Billable metric code
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Billable metric groups
 */
async function getBillableMetricGroups(code, params = {}) {
  try {
    logger.debug('Fetching billable metric groups from Lago', { code, params });

    const response = await lagoClient.billableMetrics.findAllBillableMetricGroups(code, params);

    logger.debug('Billable metric groups fetched from Lago', { code });

    return {
      groups: response.groups || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch billable metric groups from Lago', {
      code,
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createBillableMetric,
  getBillableMetric,
  updateBillableMetric,
  deleteBillableMetric,
  listBillableMetrics,
  getBillableMetricGroups,
};
