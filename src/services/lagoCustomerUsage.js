const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get current usage for a customer subscription
 * @param {string} externalCustomerId - External customer ID
 * @param {string} externalSubscriptionId - External subscription ID
 * @returns {Promise<Object>} Current usage data
 */
async function getCurrentUsage(externalCustomerId, externalSubscriptionId) {
  try {
    logger.debug('Fetching current usage from Lago', {
      externalCustomerId,
      externalSubscriptionId,
    });

    const response = await lagoClient.customers.findCustomerCurrentUsage(
      externalCustomerId,
      externalSubscriptionId
    );

    logger.debug('Current usage fetched from Lago', {
      externalCustomerId,
      externalSubscriptionId,
    });

    return response.customer_usage;
  } catch (error) {
    logger.error('Failed to fetch current usage from Lago', {
      externalCustomerId,
      externalSubscriptionId,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get past usage for a customer subscription
 * @param {string} externalCustomerId - External customer ID
 * @param {string} externalSubscriptionId - External subscription ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Past usage data
 */
async function getPastUsage(externalCustomerId, externalSubscriptionId, params = {}) {
  try {
    logger.debug('Fetching past usage from Lago', {
      externalCustomerId,
      externalSubscriptionId,
      params,
    });

    const response = await lagoClient.customers.findCustomerPastUsage(
      externalCustomerId,
      externalSubscriptionId,
      params
    );

    logger.debug('Past usage fetched from Lago', {
      externalCustomerId,
      externalSubscriptionId,
    });

    return {
      usage_periods: response.usage_periods || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch past usage from Lago', {
      externalCustomerId,
      externalSubscriptionId,
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getCurrentUsage,
  getPastUsage,
};
