const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const walletsService = require('../services/lagoWallets');

const router = express.Router();

/**
 * POST /api/v1/wallets
 * Create a new wallet
 */
router.post('/', asyncHandler(async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "wallet" object.',
    });
  }

  const result = await walletsService.createWallet(wallet);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/wallets
 * List all wallets
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await walletsService.listWallets(filters);

  return res.json({ success: true, data: result.wallets, meta: result.meta });
}));

/**
 * GET /api/v1/wallets/:id
 * Retrieve a single wallet by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const wallet = await walletsService.getWallet(id);

  if (!wallet) {
    return res.status(404).json({ success: false, error: 'Wallet not found.' });
  }

  return res.json({ success: true, data: wallet });
}));

/**
 * PUT /api/v1/wallets/:id
 * Update a wallet
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "wallet" object.' });
  }

  const result = await walletsService.updateWallet(id, wallet);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/wallets/:id
 * Terminate a wallet
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await walletsService.terminateWallet(id);

  return res.json({ success: true, data: result });
}));

/**
 * POST /api/v1/wallets/:id/wallet_transactions
 * Create a wallet transaction
 */
router.post('/:id/wallet_transactions', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { wallet_transaction } = req.body;

  if (!wallet_transaction) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "wallet_transaction" object.' });
  }

  const result = await walletsService.createWalletTransaction(id, wallet_transaction);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/wallets/:id/wallet_transactions
 * List wallet transactions
 */
router.get('/:id/wallet_transactions', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const params = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await walletsService.listWalletTransactions(id, params);

  return res.json({ success: true, data: result.wallet_transactions, meta: result.meta });
}));

module.exports = router;