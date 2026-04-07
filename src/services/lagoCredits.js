const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create wallet transaction (top-up credits)
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Transaction response
 */
async function topupCredits(transactionData) {
  try {
    logger.info('Creating wallet transaction in Lago', {
      external_customer_id: transactionData.external_customer_id,
      amount_cents: transactionData.amount_cents,
    });
    
    const response = await lagoClient.walletTransactions.createWalletTransaction({
      wallet_transaction: {
        external_customer_id: transactionData.external_customer_id,
        paid_credits: String(transactionData.amount_cents / 100), // Convert cents to credits
        granted_credits: transactionData.granted_credits || '0',
      },
    });

    logger.info('Wallet transaction created in Lago', {
      external_customer_id: transactionData.external_customer_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to create wallet transaction in Lago', {
      external_customer_id: transactionData.external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get wallet info for customer
 * @param {string} external_customer_id - External customer ID
 * @returns {Promise<Object>} Wallet data
 */
async function getWallet(external_customer_id) {
  try {
    logger.debug('Fetching wallet from Lago', { external_customer_id });
    
    const response = await lagoClient.wallets.findAllWallets({
      external_customer_id,
    });

    logger.debug('Wallet fetched from Lago', {
      external_customer_id,
      count: response.wallets?.length || 0,
    });

    return response.wallets && response.wallets.length > 0 ? response.wallets[0] : null;
  } catch (error) {
    logger.error('Failed to fetch wallet from Lago', {
      external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get wallet transactions
 * @param {string} wallet_id - Lago wallet ID
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Wallet transactions
 */
async function getWalletTransactions(wallet_id, filters = {}) {
  try {
    logger.debug('Fetching wallet transactions from Lago', { wallet_id });

    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 20,
    };
    
    const response = await lagoClient.walletTransactions.findAllWalletTransactions(wallet_id, params);

    logger.debug('Wallet transactions fetched from Lago', {
      wallet_id,
      count: response.wallet_transactions?.length || 0,
    });

    return {
      transactions: response.wallet_transactions || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch wallet transactions from Lago', {
      wallet_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  topupCredits,
  getWallet,
  getWalletTransactions,
};
