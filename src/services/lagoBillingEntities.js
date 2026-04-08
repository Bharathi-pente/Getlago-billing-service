const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create billing entity in Lago
 * @param {Object} entityData - Billing entity data
 * @returns {Promise<Object>} Created billing entity
 */
async function createBillingEntity(entityData) {
  try {
    logger.info('Creating billing entity in Lago', {
      name: entityData.name,
      code: entityData.code,
    });

    const response = await lagoClient.billingEntities.createBillingEntity({
      billing_entity: entityData,
    });

    logger.info('Billing entity created in Lago', {
      name: entityData.name,
      code: entityData.code,
      lago_id: response.billing_entity?.lago_id,
    });

    return response.billing_entity;
  } catch (error) {
    logger.error('Failed to create billing entity in Lago', {
      name: entityData.name,
      code: entityData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get billing entity by ID
 * @param {string} id - Billing entity ID
 * @returns {Promise<Object>} Billing entity data
 */
async function getBillingEntity(id) {
  try {
    logger.debug('Fetching billing entity from Lago', { id });

    const response = await lagoClient.billingEntities.findBillingEntity(id);

    logger.debug('Billing entity fetched from Lago', { id });

    return response.billing_entity;
  } catch (error) {
    logger.error('Failed to fetch billing entity from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update billing entity in Lago
 * @param {string} id - Billing entity ID
 * @param {Object} entityData - Updated billing entity data
 * @returns {Promise<Object>} Updated billing entity
 */
async function updateBillingEntity(id, entityData) {
  try {
    logger.info('Updating billing entity in Lago', { id });

    const response = await lagoClient.billingEntities.updateBillingEntity(id, {
      billing_entity: entityData,
    });

    logger.info('Billing entity updated in Lago', { id });

    return response.billing_entity;
  } catch (error) {
    logger.error('Failed to update billing entity in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete billing entity from Lago
 * @param {string} id - Billing entity ID
 * @returns {Promise<void>}
 */
async function deleteBillingEntity(id) {
  try {
    logger.info('Deleting billing entity from Lago', { id });

    await lagoClient.billingEntities.destroyBillingEntity(id);

    logger.info('Billing entity deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete billing entity from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all billing entities
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Billing entities list with meta
 */
async function listBillingEntities(params = {}) {
  try {
    logger.debug('Fetching billing entities from Lago', params);

    const response = await lagoClient.billingEntities.findAllBillingEntities(params);

    logger.debug('Billing entities fetched from Lago', {
      count: response.billing_entities?.length || 0,
    });

    return {
      billing_entities: response.billing_entities || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch billing entities from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createBillingEntity,
  getBillingEntity,
  updateBillingEntity,
  deleteBillingEntity,
  listBillingEntities,
};
