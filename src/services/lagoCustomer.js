const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create customer in Lago
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} Created customer
 */
async function createCustomer(customerData) {
  try {
    logger.info('Creating customer in Lago', { external_id: customerData.external_id });
    
    const response = await lagoClient.customers.createCustomer({
      customer: {
        external_id: customerData.external_id,
        name: customerData.name,
        email: customerData.email,
        ...customerData,
      },
    });

    logger.info('Customer created in Lago', {
      lago_id: response.lago_id,
      external_id: response.external_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to create customer in Lago', {
      external_id: customerData.external_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get customer from Lago by external ID
 * @param {string} external_id - Customer external ID
 * @returns {Promise<Object>} Customer data
 */
async function getCustomer(external_id) {
  try {
    logger.debug('Fetching customer from Lago', { external_id });
    
    const response = await lagoClient.customers.findCustomer(external_id);

    logger.debug('Customer fetched from Lago', {
      lago_id: response.lago_id,
      external_id: response.external_id,
    });

    return response;
  } catch (error) {
    logger.error('Failed to fetch customer from Lago', {
      external_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update customer in Lago
 * @param {string} external_id - Customer external ID
 * @param {Object} updates - Customer updates
 * @returns {Promise<Object>} Updated customer
 */
async function updateCustomer(external_id, updates) {
  try {
    logger.info('Updating customer in Lago', { external_id });
    
    const response = await lagoClient.customers.updateCustomer(external_id, {
      customer: updates,
    });

    logger.info('Customer updated in Lago', {
      lago_id: response.lago_id,
      external_id: response.external_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to update customer in Lago', {
      external_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete customer from Lago
 * @param {string} external_id - Customer external ID
 * @returns {Promise<Object>} Deletion response
 */
async function deleteCustomer(external_id) {
  try {
    logger.info('Deleting customer from Lago', { external_id });
    
    const response = await lagoClient.customers.destroyCustomer(external_id);

    logger.info('Customer deleted from Lago', {
      external_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to delete customer from Lago', {
      external_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
