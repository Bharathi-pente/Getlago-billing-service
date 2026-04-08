const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get payment receipt by ID
 * @param {string} id - Payment receipt ID
 * @returns {Promise<Object>} Payment receipt data
 */
async function getPaymentReceipt(id) {
  try {
    logger.debug('Fetching payment receipt from Lago', { id });

    const response = await lagoClient.paymentReceipts.findPaymentReceipt(id);

    logger.debug('Payment receipt fetched from Lago', { id });

    return response.payment_receipt;
  } catch (error) {
    logger.error('Failed to fetch payment receipt from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all payment receipts
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Payment receipts list with meta
 */
async function listPaymentReceipts(params = {}) {
  try {
    logger.debug('Fetching payment receipts from Lago', params);

    const response = await lagoClient.paymentReceipts.findAllPaymentReceipts(params);

    logger.debug('Payment receipts fetched from Lago', {
      count: response.payment_receipts?.length || 0,
    });

    return {
      payment_receipts: response.payment_receipts || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch payment receipts from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Download payment receipt
 * @param {string} id - Payment receipt ID
 * @returns {Promise<Object>} Payment receipt download data
 */
async function downloadPaymentReceipt(id) {
  try {
    logger.info('Downloading payment receipt from Lago', { id });

    const response = await lagoClient.paymentReceipts.downloadPaymentReceipt(id);

    logger.info('Payment receipt downloaded from Lago', { id });

    return response;
  } catch (error) {
    logger.error('Failed to download payment receipt from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getPaymentReceipt,
  listPaymentReceipts,
  downloadPaymentReceipt,
};
