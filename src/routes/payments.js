const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const paymentsService = require('../services/lagoPayments');

const router = express.Router();

/**
 * POST /api/v1/payments
 * Create a new payment
 */
router.post('/', asyncHandler(async (req, res) => {
  const { payment } = req.body;

  if (!payment) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "payment" object.',
    });
  }

  const result = await paymentsService.createPayment(payment);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/payments
 * List all payments
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await paymentsService.listPayments(filters);

  return res.json({ success: true, data: result.payments, meta: result.meta });
}));

/**
 * GET /api/v1/payments/:id
 * Retrieve a single payment by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await paymentsService.getPayment(id);

  if (!payment) {
    return res.status(404).json({ success: false, error: 'Payment not found.' });
  }

  return res.json({ success: true, data: payment });
}));

/**
 * PUT /api/v1/payments/:id
 * Update a payment
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { payment } = req.body;

  if (!payment) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "payment" object.' });
  }

  const result = await paymentsService.updatePayment(id, payment);

  return res.json({ success: true, data: result });
}));

module.exports = router;