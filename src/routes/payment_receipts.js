const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const paymentReceiptsService = require('../services/lagoPaymentReceipts');

const router = express.Router();

/**
 * GET /api/v1/payment_receipts
 * List all payment receipts
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await paymentReceiptsService.listPaymentReceipts(filters);

  return res.json({ success: true, data: result.payment_receipts, meta: result.meta });
}));

/**
 * GET /api/v1/payment_receipts/:id
 * Retrieve a single payment receipt by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentReceipt = await paymentReceiptsService.getPaymentReceipt(id);

  if (!paymentReceipt) {
    return res.status(404).json({ success: false, error: 'Payment receipt not found.' });
  }

  return res.json({ success: true, data: paymentReceipt });
}));

/**
 * GET /api/v1/payment_receipts/:id/download
 * Download a payment receipt
 */
router.get('/:id/download', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await paymentReceiptsService.downloadPaymentReceipt(id);

  return res.json({ success: true, data: result });
}));

module.exports = router;