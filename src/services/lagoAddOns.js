const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create add-on in Lago
 * @param {Object} addOnData - Add-on data
 * @param {string} addOnData.name - Add-on name
 * @param {string} addOnData.code - Add-on code
 * @param {string} [addOnData.description] - Optional description
 * @param {number} addOnData.amount_cents - Amount in cents
 * @param {string} addOnData.amount_currency - Currency code
 * @param {string[]} [addOnData.tax_codes] - Tax codes
 * @returns {Promise<Object>} Created add-on
 */
async function createAddOn(addOnData) {
  try {
    logger.info('Creating add-on in Lago', {
      name: addOnData.name,
      code: addOnData.code,
    });

    const response = await lagoClient.addOns.createAddOn({
      add_on: addOnData,
    });

    logger.info('Add-on created in Lago', {
      name: addOnData.name,
      code: addOnData.code,
      lago_id: response.add_on?.lago_id,
    });

    return response.add_on;
  } catch (error) {
    logger.error('Failed to create add-on in Lago', {
      name: addOnData.name,
      code: addOnData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all add-ons from Lago
 * @param {Object} filters - Query filters
 * @param {number} [filters.page=1]
 * @param {number} [filters.per_page=20]
 * @returns {Promise<Object>} Add-ons list with meta
 */
async function getAddOns(filters = {}) {
  try {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 20,
    };

    logger.debug('Fetching add-ons from Lago', params);

    const response = await lagoClient.addOns.findAllAddOns(params);

    logger.debug('Add-ons fetched from Lago', {
      count: response.add_ons?.length || 0,
    });

    return {
      add_ons: response.add_ons || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch add-ons from Lago', {
      filters,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get add-on by code
 * @param {string} code - Add-on code
 * @returns {Promise<Object>} Add-on data
 */
async function getAddOnByCode(code) {
  try {
    logger.debug('Fetching add-on from Lago', { code });

    const response = await lagoClient.addOns.findAddOn(code);

    logger.debug('Add-on fetched from Lago', { code });

    return response.add_on;
  } catch (error) {
    logger.error('Failed to fetch add-on from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update add-on in Lago
 * @param {string} code - Add-on code to update
 * @param {Object} addOnData - Updated add-on data
 * @returns {Promise<Object>} Updated add-on
 */
async function updateAddOn(code, addOnData) {
  try {
    logger.info('Updating add-on in Lago', { code });

    const response = await lagoClient.addOns.updateAddOn(code, {
      add_on: addOnData,
    });

    logger.info('Add-on updated in Lago', { code });

    return response.add_on;
  } catch (error) {
    logger.error('Failed to update add-on in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete add-on from Lago
 * @param {string} code - Add-on code to delete
 * @returns {Promise<void>}
 */
async function deleteAddOn(code) {
  try {
    logger.info('Deleting add-on from Lago', { code });

    await lagoClient.addOns.destroyAddOn(code);

    logger.info('Add-on deleted from Lago', { code });
  } catch (error) {
    logger.error('Failed to delete add-on from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createAddOn,
  getAddOns,
  getAddOnByCode,
  updateAddOn,
  deleteAddOn,
};