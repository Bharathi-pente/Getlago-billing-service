const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create payment in Lago
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Created payment
 */
async function createPayment(paymentData) {
  try {
    logger.info('Creating payment in Lago', {
      external_customer_id: paymentData.external_customer_id,
    });

    const response = await lagoClient.payments.createPayment({
      payment: paymentData,
    });

    logger.info('Payment created in Lago', {
      external_customer_id: paymentData.external_customer_id,
      lago_id: response.payment?.lago_id,
    });

    return response.payment;
  } catch (error) {
    logger.error('Failed to create payment in Lago', {
      external_customer_id: paymentData.external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get payment by ID
 * @param {string} id - Payment ID
 * @returns {Promise<Object>} Payment data
 */
async function getPayment(id) {
  try {
    logger.debug('Fetching payment from Lago', { id });

    const response = await lagoClient.payments.findPayment(id);

    logger.debug('Payment fetched from Lago', { id });

    return response.payment;
  } catch (error) {
    logger.error('Failed to fetch payment from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update payment in Lago
 * @param {string} id - Payment ID
 * @param {Object} paymentData - Updated payment data
 * @returns {Promise<Object>} Updated payment
 */
async function updatePayment(id, paymentData) {
  try {
    logger.info('Updating payment in Lago', { id });

    const response = await lagoClient.payments.updatePayment(id, {
      payment: paymentData,
    });

    logger.info('Payment updated in Lago', { id });

    return response.payment;
  } catch (error) {
    logger.error('Failed to update payment in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all payments
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Payments list with meta
 */
async function listPayments(params = {}) {
  try {
    logger.debug('Fetching payments from Lago', params);

    const response = await lagoClient.payments.findAllPayments(params);

    logger.debug('Payments fetched from Lago', {
      count: response.payments?.length || 0,
    });

    return {
      payments: response.payments || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch payments from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createPayment,
  getPayment,
  updatePayment,
  listPayments,
};
