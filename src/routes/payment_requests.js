const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const paymentRequestsService = require('../services/lagoPaymentRequests');

const router = express.Router();

/**
 * POST /api/v1/payment_requests
 * Create a new payment request
 */
router.post('/', asyncHandler(async (req, res) => {
  const { payment_request } = req.body;

  if (!payment_request) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "payment_request" object.',
    });
  }

  const result = await paymentRequestsService.createPaymentRequest(payment_request);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/payment_requests
 * List all payment requests
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await paymentRequestsService.listPaymentRequests(filters);

  return res.json({ success: true, data: result.payment_requests, meta: result.meta });
}));

/**
 * GET /api/v1/payment_requests/:id
 * Retrieve a single payment request by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentRequest = await paymentRequestsService.getPaymentRequest(id);

  if (!paymentRequest) {
    return res.status(404).json({ success: false, error: 'Payment request not found.' });
  }

  return res.json({ success: true, data: paymentRequest });
}));

module.exports = router;