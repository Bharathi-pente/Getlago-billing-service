const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get fee by ID
 * @param {string} id - Fee ID
 * @returns {Promise<Object>} Fee data
 */
async function getFee(id) {
  try {
    logger.debug('Fetching fee from Lago', { id });

    const response = await lagoClient.fees.findFee(id);

    logger.debug('Fee fetched from Lago', { id });

    return response.fee;
  } catch (error) {
    logger.error('Failed to fetch fee from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update fee in Lago
 * @param {string} id - Fee ID
 * @param {Object} feeData - Updated fee data
 * @returns {Promise<Object>} Updated fee
 */
async function updateFee(id, feeData) {
  try {
    logger.info('Updating fee in Lago', { id });

    const response = await lagoClient.fees.updateFee(id, {
      fee: feeData,
    });

    logger.info('Fee updated in Lago', { id });

    return response.fee;
  } catch (error) {
    logger.error('Failed to update fee in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all fees
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Fees list with meta
 */
async function listFees(params = {}) {
  try {
    logger.debug('Fetching fees from Lago', params);

    const response = await lagoClient.fees.findAllFees(params);

    logger.debug('Fees fetched from Lago', {
      count: response.fees?.length || 0,
    });

    return {
      fees: response.fees || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch fees from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete fee from Lago
 * @param {string} id - Fee ID
 * @returns {Promise<void>}
 */
async function deleteFee(id) {
  try {
    logger.info('Deleting fee from Lago', { id });

    await lagoClient.fees.destroyFee(id);

    logger.info('Fee deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete fee from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getFee,
  updateFee,
  listFees,
  deleteFee,
};
