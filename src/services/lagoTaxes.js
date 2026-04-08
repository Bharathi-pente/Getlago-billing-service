const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create tax in Lago
 * @param {Object} taxData - Tax data
 * @returns {Promise<Object>} Created tax
 */
async function createTax(taxData) {
  try {
    logger.info('Creating tax in Lago', {
      name: taxData.name,
      code: taxData.code,
    });

    const response = await lagoClient.taxes.createTax({
      tax: taxData,
    });

    logger.info('Tax created in Lago', {
      name: taxData.name,
      code: taxData.code,
      lago_id: response.tax?.lago_id,
    });

    return response.tax;
  } catch (error) {
    logger.error('Failed to create tax in Lago', {
      name: taxData.name,
      code: taxData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get tax by code
 * @param {string} code - Tax code
 * @returns {Promise<Object>} Tax data
 */
async function getTax(code) {
  try {
    logger.debug('Fetching tax from Lago', { code });

    const response = await lagoClient.taxes.findTax(code);

    logger.debug('Tax fetched from Lago', { code });

    return response.tax;
  } catch (error) {
    logger.error('Failed to fetch tax from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update tax in Lago
 * @param {string} code - Tax code
 * @param {Object} taxData - Updated tax data
 * @returns {Promise<Object>} Updated tax
 */
async function updateTax(code, taxData) {
  try {
    logger.info('Updating tax in Lago', { code });

    const response = await lagoClient.taxes.updateTax(code, {
      tax: taxData,
    });

    logger.info('Tax updated in Lago', { code });

    return response.tax;
  } catch (error) {
    logger.error('Failed to update tax in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete tax from Lago
 * @param {string} code - Tax code
 * @returns {Promise<void>}
 */
async function deleteTax(code) {
  try {
    logger.info('Deleting tax from Lago', { code });

    await lagoClient.taxes.destroyTax(code);

    logger.info('Tax deleted from Lago', { code });
  } catch (error) {
    logger.error('Failed to delete tax from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all taxes
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Taxes list with meta
 */
async function listTaxes(params = {}) {
  try {
    logger.debug('Fetching taxes from Lago', params);

    const response = await lagoClient.taxes.findAllTaxes(params);

    logger.debug('Taxes fetched from Lago', {
      count: response.taxes?.length || 0,
    });

    return {
      taxes: response.taxes || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch taxes from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createTax,
  getTax,
  updateTax,
  deleteTax,
  listTaxes,
};
