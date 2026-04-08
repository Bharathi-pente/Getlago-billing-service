const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create wallet in Lago
 * @param {Object} walletData - Wallet data
 * @returns {Promise<Object>} Created wallet
 */
async function createWallet(walletData) {
  try {
    logger.info('Creating wallet in Lago', {
      external_customer_id: walletData.external_customer_id,
    });

    const response = await lagoClient.wallets.createWallet({
      wallet: walletData,
    });

    logger.info('Wallet created in Lago', {
      external_customer_id: walletData.external_customer_id,
      lago_id: response.wallet?.lago_id,
    });

    return response.wallet;
  } catch (error) {
    logger.error('Failed to create wallet in Lago', {
      external_customer_id: walletData.external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get wallet by ID
 * @param {string} id - Wallet ID
 * @returns {Promise<Object>} Wallet data
 */
async function getWallet(id) {
  try {
    logger.debug('Fetching wallet from Lago', { id });

    const response = await lagoClient.wallets.findWallet(id);

    logger.debug('Wallet fetched from Lago', { id });

    return response.wallet;
  } catch (error) {
    logger.error('Failed to fetch wallet from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update wallet in Lago
 * @param {string} id - Wallet ID
 * @param {Object} walletData - Updated wallet data
 * @returns {Promise<Object>} Updated wallet
 */
async function updateWallet(id, walletData) {
  try {
    logger.info('Updating wallet in Lago', { id });

    const response = await lagoClient.wallets.updateWallet(id, {
      wallet: walletData,
    });

    logger.info('Wallet updated in Lago', { id });

    return response.wallet;
  } catch (error) {
    logger.error('Failed to update wallet in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Terminate wallet in Lago
 * @param {string} id - Wallet ID
 * @returns {Promise<Object>} Terminated wallet
 */
async function terminateWallet(id) {
  try {
    logger.info('Terminating wallet in Lago', { id });

    const response = await lagoClient.wallets.destroyWallet(id);

    logger.info('Wallet terminated in Lago', { id });

    return response.wallet;
  } catch (error) {
    logger.error('Failed to terminate wallet in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all wallets
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Wallets list with meta
 */
async function listWallets(params = {}) {
  try {
    logger.debug('Fetching wallets from Lago', params);

    const response = await lagoClient.wallets.findAllWallets(params);

    logger.debug('Wallets fetched from Lago', {
      count: response.wallets?.length || 0,
    });

    return {
      wallets: response.wallets || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch wallets from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Create wallet transaction
 * @param {string} walletId - Wallet ID
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created wallet transaction
 */
async function createWalletTransaction(walletId, transactionData) {
  try {
    logger.info('Creating wallet transaction in Lago', { walletId });

    const response = await lagoClient.walletTransactions.createWalletTransaction({
      wallet_transaction: {
        ...transactionData,
        wallet_id: walletId,
      },
    });

    logger.info('Wallet transaction created in Lago', { walletId });

    return response.wallet_transaction;
  } catch (error) {
    logger.error('Failed to create wallet transaction in Lago', {
      walletId,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List wallet transactions
 * @param {string} walletId - Wallet ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Wallet transactions list with meta
 */
async function listWalletTransactions(walletId, params = {}) {
  try {
    logger.debug('Fetching wallet transactions from Lago', { walletId, params });

    const response = await lagoClient.walletTransactions.findAllWalletTransactions({
      ...params,
      wallet_id: walletId,
    });

    logger.debug('Wallet transactions fetched from Lago', {
      walletId,
      count: response.wallet_transactions?.length || 0,
    });

    return {
      wallet_transactions: response.wallet_transactions || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch wallet transactions from Lago', {
      walletId,
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createWallet,
  getWallet,
  updateWallet,
  terminateWallet,
  listWallets,
  createWalletTransaction,
  listWalletTransactions,
};
