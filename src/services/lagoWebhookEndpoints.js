const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create webhook endpoint in Lago
 * @param {Object} endpointData - Webhook endpoint data
 * @returns {Promise<Object>} Created webhook endpoint
 */
async function createWebhookEndpoint(endpointData) {
  try {
    logger.info('Creating webhook endpoint in Lago', {
      webhook_url: endpointData.webhook_url,
    });

    const response = await lagoClient.webhookEndpoints.createWebhookEndpoint({
      webhook_endpoint: endpointData,
    });

    logger.info('Webhook endpoint created in Lago', {
      webhook_url: endpointData.webhook_url,
      lago_id: response.webhook_endpoint?.lago_id,
    });

    return response.webhook_endpoint;
  } catch (error) {
    logger.error('Failed to create webhook endpoint in Lago', {
      webhook_url: endpointData.webhook_url,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get webhook endpoint by ID
 * @param {string} id - Webhook endpoint ID
 * @returns {Promise<Object>} Webhook endpoint data
 */
async function getWebhookEndpoint(id) {
  try {
    logger.debug('Fetching webhook endpoint from Lago', { id });

    const response = await lagoClient.webhookEndpoints.findWebhookEndpoint(id);

    logger.debug('Webhook endpoint fetched from Lago', { id });

    return response.webhook_endpoint;
  } catch (error) {
    logger.error('Failed to fetch webhook endpoint from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update webhook endpoint in Lago
 * @param {string} id - Webhook endpoint ID
 * @param {Object} endpointData - Updated webhook endpoint data
 * @returns {Promise<Object>} Updated webhook endpoint
 */
async function updateWebhookEndpoint(id, endpointData) {
  try {
    logger.info('Updating webhook endpoint in Lago', { id });

    const response = await lagoClient.webhookEndpoints.updateWebhookEndpoint(id, {
      webhook_endpoint: endpointData,
    });

    logger.info('Webhook endpoint updated in Lago', { id });

    return response.webhook_endpoint;
  } catch (error) {
    logger.error('Failed to update webhook endpoint in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete webhook endpoint from Lago
 * @param {string} id - Webhook endpoint ID
 * @returns {Promise<void>}
 */
async function deleteWebhookEndpoint(id) {
  try {
    logger.info('Deleting webhook endpoint from Lago', { id });

    await lagoClient.webhookEndpoints.destroyWebhookEndpoint(id);

    logger.info('Webhook endpoint deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete webhook endpoint from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all webhook endpoints
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Webhook endpoints list with meta
 */
async function listWebhookEndpoints(params = {}) {
  try {
    logger.debug('Fetching webhook endpoints from Lago', params);

    const response = await lagoClient.webhookEndpoints.findAllWebhookEndpoints(params);

    logger.debug('Webhook endpoints fetched from Lago', {
      count: response.webhook_endpoints?.length || 0,
    });

    return {
      webhook_endpoints: response.webhook_endpoints || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch webhook endpoints from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createWebhookEndpoint,
  getWebhookEndpoint,
  updateWebhookEndpoint,
  deleteWebhookEndpoint,
  listWebhookEndpoints,
};
