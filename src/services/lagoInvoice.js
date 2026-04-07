const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get invoices with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Invoices list
 */
async function getInvoices(filters = {}) {
  try {
    logger.debug('Fetching invoices from Lago', filters);

    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 20,
    };

    if (filters.external_customer_id) {
      params.external_customer_id = filters.external_customer_id;
    }

    if (filters.status) {
      params.status = filters.status;
    }
    
    const response = await lagoClient.invoices.findAllInvoices(params);

    logger.debug('Invoices fetched from Lago', {
      count: response.invoices?.length || 0,
      page: params.page,
    });

    return {
      invoices: response.invoices || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch invoices from Lago', {
      filters,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get invoice by ID
 * @param {string} invoice_id - Lago invoice ID
 * @returns {Promise<Object>} Invoice details
 */
async function getInvoice(invoice_id) {
  try {
    logger.debug('Fetching invoice from Lago', { invoice_id });
    
    const response = await lagoClient.invoices.findInvoice(invoice_id);

    logger.debug('Invoice fetched from Lago', {
      invoice_id,
      status: response.status,
    });

    return response;
  } catch (error) {
    logger.error('Failed to fetch invoice from Lago', {
      invoice_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Download invoice PDF
 * @param {string} invoice_id - Lago invoice ID
 * @returns {Promise<Object>} PDF download response
 */
async function downloadInvoice(invoice_id) {
  try {
    logger.info('Downloading invoice from Lago', { invoice_id });
    
    const response = await lagoClient.invoices.downloadInvoice(invoice_id);

    logger.info('Invoice downloaded from Lago', {
      invoice_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to download invoice from Lago', {
      invoice_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Retry payment for invoice
 * @param {string} invoice_id - Lago invoice ID
 * @returns {Promise<Object>} Retry response
 */
async function retryPayment(invoice_id) {
  try {
    logger.info('Retrying payment for invoice in Lago', { invoice_id });
    
    const response = await lagoClient.invoices.retryPayment(invoice_id);

    logger.info('Payment retry initiated in Lago', {
      invoice_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to retry payment in Lago', {
      invoice_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getInvoices,
  getInvoice,
  downloadInvoice,
  retryPayment,
};
