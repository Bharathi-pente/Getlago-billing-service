const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create entitlement in Lago
 * @param {Object} entitlementData - Entitlement data
 * @returns {Promise<Object>} Created entitlement
 */
async function createEntitlement(entitlementData) {
  try {
    logger.info('Creating entitlement in Lago', {
      code: entitlementData.code,
    });

    const response = await lagoClient.entitlements.createEntitlement({
      entitlement: entitlementData,
    });

    logger.info('Entitlement created in Lago', {
      code: entitlementData.code,
      lago_id: response.entitlement?.lago_id,
    });

    return response.entitlement;
  } catch (error) {
    logger.error('Failed to create entitlement in Lago', {
      code: entitlementData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get entitlement by ID
 * @param {string} id - Entitlement ID
 * @returns {Promise<Object>} Entitlement data
 */
async function getEntitlement(id) {
  try {
    logger.debug('Fetching entitlement from Lago', { id });

    const response = await lagoClient.entitlements.findEntitlement(id);

    logger.debug('Entitlement fetched from Lago', { id });

    return response.entitlement;
  } catch (error) {
    logger.error('Failed to fetch entitlement from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update entitlement in Lago
 * @param {string} id - Entitlement ID
 * @param {Object} entitlementData - Updated entitlement data
 * @returns {Promise<Object>} Updated entitlement
 */
async function updateEntitlement(id, entitlementData) {
  try {
    logger.info('Updating entitlement in Lago', { id });

    const response = await lagoClient.entitlements.updateEntitlement(id, {
      entitlement: entitlementData,
    });

    logger.info('Entitlement updated in Lago', { id });

    return response.entitlement;
  } catch (error) {
    logger.error('Failed to update entitlement in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete entitlement from Lago
 * @param {string} id - Entitlement ID
 * @returns {Promise<void>}
 */
async function deleteEntitlement(id) {
  try {
    logger.info('Deleting entitlement from Lago', { id });

    await lagoClient.entitlements.destroyEntitlement(id);

    logger.info('Entitlement deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete entitlement from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all entitlements
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Entitlements list with meta
 */
async function listEntitlements(params = {}) {
  try {
    logger.debug('Fetching entitlements from Lago', params);

    const response = await lagoClient.entitlements.findAllEntitlements(params);

    logger.debug('Entitlements fetched from Lago', {
      count: response.entitlements?.length || 0,
    });

    return {
      entitlements: response.entitlements || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch entitlements from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createEntitlement,
  getEntitlement,
  updateEntitlement,
  deleteEntitlement,
  listEntitlements,
};
