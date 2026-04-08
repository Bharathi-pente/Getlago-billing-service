const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create payment request in Lago
 * @param {Object} requestData - Payment request data
 * @returns {Promise<Object>} Created payment request
 */
async function createPaymentRequest(requestData) {
  try {
    logger.info('Creating payment request in Lago', {
      external_customer_id: requestData.external_customer_id,
    });

    const response = await lagoClient.paymentRequests.createPaymentRequest({
      payment_request: requestData,
    });

    logger.info('Payment request created in Lago', {
      external_customer_id: requestData.external_customer_id,
      lago_id: response.payment_request?.lago_id,
    });

    return response.payment_request;
  } catch (error) {
    logger.error('Failed to create payment request in Lago', {
      external_customer_id: requestData.external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get payment request by ID
 * @param {string} id - Payment request ID
 * @returns {Promise<Object>} Payment request data
 */
async function getPaymentRequest(id) {
  try {
    logger.debug('Fetching payment request from Lago', { id });

    const response = await lagoClient.paymentRequests.findPaymentRequest(id);

    logger.debug('Payment request fetched from Lago', { id });

    return response.payment_request;
  } catch (error) {
    logger.error('Failed to fetch payment request from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all payment requests
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Payment requests list with meta
 */
async function listPaymentRequests(params = {}) {
  try {
    logger.debug('Fetching payment requests from Lago', params);

    const response = await lagoClient.paymentRequests.findAllPaymentRequests(params);

    logger.debug('Payment requests fetched from Lago', {
      count: response.payment_requests?.length || 0,
    });

    return {
      payment_requests: response.payment_requests || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch payment requests from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createPaymentRequest,
  getPaymentRequest,
  listPaymentRequests,
};
