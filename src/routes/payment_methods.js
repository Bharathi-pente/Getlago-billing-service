const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const paymentMethodsService = require('../services/lagoPaymentMethods');

const router = express.Router();

/**
 * POST /api/v1/payment_methods
 * Create a new payment method
 */
router.post('/', asyncHandler(async (req, res) => {
  const { payment_method } = req.body;

  if (!payment_method) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "payment_method" object.',
    });
  }

  const result = await paymentMethodsService.createPaymentMethod(payment_method);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/payment_methods
 * List all payment methods
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await paymentMethodsService.listPaymentMethods(filters);

  return res.json({ success: true, data: result.payment_methods, meta: result.meta });
}));

/**
 * GET /api/v1/payment_methods/:id
 * Retrieve a single payment method by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentMethod = await paymentMethodsService.getPaymentMethod(id);

  if (!paymentMethod) {
    return res.status(404).json({ success: false, error: 'Payment method not found.' });
  }

  return res.json({ success: true, data: paymentMethod });
}));

/**
 * PUT /api/v1/payment_methods/:id
 * Update a payment method
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { payment_method } = req.body;

  if (!payment_method) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "payment_method" object.' });
  }

  const result = await paymentMethodsService.updatePaymentMethod(id, payment_method);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/payment_methods/:id
 * Delete a payment method
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await paymentMethodsService.deletePaymentMethod(id);

  return res.json({ success: true, message: `Payment method "${id}" deleted.` });
}));

module.exports = router;