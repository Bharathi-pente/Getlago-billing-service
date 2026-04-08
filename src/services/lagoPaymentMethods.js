const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create payment method in Lago
 * @param {Object} methodData - Payment method data
 * @returns {Promise<Object>} Created payment method
 */
async function createPaymentMethod(methodData) {
  try {
    logger.info('Creating payment method in Lago', {
      external_customer_id: methodData.external_customer_id,
    });

    const response = await lagoClient.paymentMethods.createPaymentMethod({
      payment_method: methodData,
    });

    logger.info('Payment method created in Lago', {
      external_customer_id: methodData.external_customer_id,
      lago_id: response.payment_method?.lago_id,
    });

    return response.payment_method;
  } catch (error) {
    logger.error('Failed to create payment method in Lago', {
      external_customer_id: methodData.external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get payment method by ID
 * @param {string} id - Payment method ID
 * @returns {Promise<Object>} Payment method data
 */
async function getPaymentMethod(id) {
  try {
    logger.debug('Fetching payment method from Lago', { id });

    const response = await lagoClient.paymentMethods.findPaymentMethod(id);

    logger.debug('Payment method fetched from Lago', { id });

    return response.payment_method;
  } catch (error) {
    logger.error('Failed to fetch payment method from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update payment method in Lago
 * @param {string} id - Payment method ID
 * @param {Object} methodData - Updated payment method data
 * @returns {Promise<Object>} Updated payment method
 */
async function updatePaymentMethod(id, methodData) {
  try {
    logger.info('Updating payment method in Lago', { id });

    const response = await lagoClient.paymentMethods.updatePaymentMethod(id, {
      payment_method: methodData,
    });

    logger.info('Payment method updated in Lago', { id });

    return response.payment_method;
  } catch (error) {
    logger.error('Failed to update payment method in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete payment method from Lago
 * @param {string} id - Payment method ID
 * @returns {Promise<void>}
 */
async function deletePaymentMethod(id) {
  try {
    logger.info('Deleting payment method from Lago', { id });

    await lagoClient.paymentMethods.destroyPaymentMethod(id);

    logger.info('Payment method deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete payment method from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all payment methods
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Payment methods list with meta
 */
async function listPaymentMethods(params = {}) {
  try {
    logger.debug('Fetching payment methods from Lago', params);

    const response = await lagoClient.paymentMethods.findAllPaymentMethods(params);

    logger.debug('Payment methods fetched from Lago', {
      count: response.payment_methods?.length || 0,
    });

    return {
      payment_methods: response.payment_methods || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch payment methods from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createPaymentMethod,
  getPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  listPaymentMethods,
};
