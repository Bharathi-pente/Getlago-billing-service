const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const feesService = require('../services/lagoFees');

const router = express.Router();

/**
 * GET /api/v1/fees
 * List all fees
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await feesService.listFees(filters);

  return res.json({ success: true, data: result.fees, meta: result.meta });
}));

/**
 * GET /api/v1/fees/:id
 * Retrieve a single fee by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fee = await feesService.getFee(id);

  if (!fee) {
    return res.status(404).json({ success: false, error: 'Fee not found.' });
  }

  return res.json({ success: true, data: fee });
}));

/**
 * PUT /api/v1/fees/:id
 * Update a fee
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fee } = req.body;

  if (!fee) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "fee" object.' });
  }

  const result = await feesService.updateFee(id, fee);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/fees/:id
 * Delete a fee
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await feesService.deleteFee(id);

  return res.json({ success: true, message: `Fee "${id}" deleted.` });
}));

module.exports = router;