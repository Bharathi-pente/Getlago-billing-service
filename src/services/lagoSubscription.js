const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create subscription in Lago
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Created subscription
 */
async function createSubscription(subscriptionData) {
  try {
    logger.info('Creating subscription in Lago', {
      external_customer_id: subscriptionData.external_customer_id,
      plan_code: subscriptionData.plan_code,
    });
    
    const response = await lagoClient.subscriptions.createSubscription({
      subscription: {
        external_customer_id: subscriptionData.external_customer_id,
        plan_code: subscriptionData.plan_code,
        billing_time: subscriptionData.billing_time || 'anniversary',
        ...subscriptionData,
      },
    });

    logger.info('Subscription created in Lago', {
      lago_id: response.lago_id,
      external_customer_id: subscriptionData.external_customer_id,
      plan_code: subscriptionData.plan_code,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to create subscription in Lago', {
      external_customer_id: subscriptionData.external_customer_id,
      plan_code: subscriptionData.plan_code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update subscription in Lago (upgrade/downgrade plan)
 * @param {string} subscription_id - Lago subscription ID
 * @param {Object} updates - Subscription updates
 * @returns {Promise<Object>} Updated subscription
 */
async function updateSubscription(subscription_id, updates) {
  try {
    logger.info('Updating subscription in Lago', {
      subscription_id,
      updates,
    });
    
    const response = await lagoClient.subscriptions.updateSubscription(subscription_id, {
      subscription: updates,
    });

    logger.info('Subscription updated in Lago', {
      subscription_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to update subscription in Lago', {
      subscription_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Terminate subscription in Lago
 * @param {string} external_customer_id - External customer ID
 * @returns {Promise<Object>} Termination response
 */
async function terminateSubscription(external_customer_id) {
  try {
    logger.info('Terminating subscription in Lago', { external_customer_id });
    
    const response = await lagoClient.subscriptions.destroySubscription(external_customer_id);

    logger.info('Subscription terminated in Lago', {
      external_customer_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to terminate subscription in Lago', {
      external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get subscription details from Lago
 * @param {string} external_customer_id - External customer ID
 * @returns {Promise<Array>} Customer subscriptions
 */
async function getSubscriptions(external_customer_id) {
  try {
    logger.debug('Fetching subscriptions from Lago', { external_customer_id });
    
    const response = await lagoClient.customers.findCustomer(external_customer_id);

    logger.debug('Subscriptions fetched from Lago', {
      external_customer_id,
      count: response.subscriptions?.length || 0,
    });

    return response.subscriptions || [];
  } catch (error) {
    logger.error('Failed to fetch subscriptions from Lago', {
      external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createSubscription,
  updateSubscription,
  terminateSubscription,
  getSubscriptions,
};
