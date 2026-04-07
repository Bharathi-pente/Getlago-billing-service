const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoCreditsService = require('../services/lagoCredits');
const customerQueries = require('../db/queries/customers');

const router = express.Router();

/**
 * POST /api/v1/credits/topup
 * Top up customer credits
 */
router.post('/topup', asyncHandler(async (req, res) => {
  const { internal_customer_id, amount_cents, currency, description } = req.body;

  if (!internal_customer_id || !amount_cents) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: internal_customer_id, amount_cents',
      code: 400,
    });
  }

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internal_customer_id);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Create wallet transaction in Lago
  const transaction = await lagoCreditsService.topupCredits({
    external_customer_id: internal_customer_id,
    amount_cents,
    currency: currency || 'USD',
    description,
  });

  res.status(201).json({
    success: true,
    data: transaction,
  });
}));

/**
 * GET /api/v1/credits/:internalCustomerId
 * Get wallet balance and transaction history
 */
router.get('/:internalCustomerId', asyncHandler(async (req, res) => {
  const { internalCustomerId } = req.params;

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internalCustomerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Get wallet from Lago
  const wallet = await lagoCreditsService.getWallet(internalCustomerId);

  if (!wallet) {
    return res.json({
      success: true,
      data: {
        message: 'No wallet found for customer',
        balance: 0,
        transactions: [],
      },
    });
  }

  // Get wallet transactions
  const transactionsResult = await lagoCreditsService.getWalletTransactions(wallet.lago_id);

  res.json({
    success: true,
    data: {
      wallet,
      transactions: transactionsResult.transactions,
      meta: transactionsResult.meta,
    },
  });
}));

module.exports = router;
