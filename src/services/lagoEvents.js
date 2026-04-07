const lagoClient = require('../config/lago');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * Push single event to Lago
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Event response
 */
async function pushEvent(eventData) {
  try {
    // Auto-generate transaction_id if not provided
    const transaction_id = eventData.transaction_id || uuidv4();
    
    // Auto-set timestamp to current Unix time if not provided
    const timestamp = eventData.timestamp || Math.floor(Date.now() / 1000);

    const payload = {
      event: {
        transaction_id,
        external_customer_id: eventData.external_customer_id,
        code: eventData.code,
        timestamp,
        properties: eventData.properties || {},
      },
    };

    logger.info('Pushing event to Lago', {
      transaction_id,
      external_customer_id: eventData.external_customer_id,
      code: eventData.code,
    });
    
    const response = await lagoClient.events.createEvent(payload);

    logger.info('Event pushed to Lago', {
      transaction_id,
      external_customer_id: eventData.external_customer_id,
      code: eventData.code,
      status: 'success',
    });

    return { ...response, transaction_id };
  } catch (error) {
    logger.error('Failed to push event to Lago', {
      external_customer_id: eventData.external_customer_id,
      code: eventData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Push batch of events to Lago
 * @param {Array} events - Array of event data
 * @returns {Promise<Object>} Batch response
 */
async function pushBatchEvents(events) {
  try {
    // Process each event to add transaction_id and timestamp
    const processedEvents = events.map(event => ({
      transaction_id: event.transaction_id || uuidv4(),
      external_customer_id: event.external_customer_id,
      code: event.code,
      timestamp: event.timestamp || Math.floor(Date.now() / 1000),
      properties: event.properties || {},
    }));

    logger.info('Pushing batch events to Lago', {
      count: processedEvents.length,
    });
    
    const response = await lagoClient.events.createBatchEvents({
      events: processedEvents,
    });

    logger.info('Batch events pushed to Lago', {
      count: processedEvents.length,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to push batch events to Lago', {
      count: events.length,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get usage data for a customer
 * @param {string} external_customer_id - External customer ID
 * @param {string} external_subscription_id - External subscription ID (optional)
 * @returns {Promise<Object>} Usage data
 */
async function getUsage(external_customer_id, external_subscription_id = null) {
  try {
    logger.debug('Fetching usage from Lago', {
      external_customer_id,
      external_subscription_id,
    });

    const params = {
      external_customer_id,
    };

    if (external_subscription_id) {
      params.external_subscription_id = external_subscription_id;
    }
    
    const response = await lagoClient.customers.findCustomerCurrentUsage(
      external_customer_id,
      external_subscription_id
    );

    logger.debug('Usage fetched from Lago', {
      external_customer_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to fetch usage from Lago', {
      external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  pushEvent,
  pushBatchEvents,
  getUsage,
};
