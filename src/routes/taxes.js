const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const taxesService = require('../services/lagoTaxes');

const router = express.Router();

/**
 * POST /api/v1/taxes
 * Create a new tax
 */
router.post('/', asyncHandler(async (req, res) => {
  const { tax } = req.body;

  if (!tax) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "tax" object.',
    });
  }

  const result = await taxesService.createTax(tax);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/taxes
 * List all taxes
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await taxesService.listTaxes(filters);

  return res.json({ success: true, data: result.taxes, meta: result.meta });
}));

/**
 * GET /api/v1/taxes/:code
 * Retrieve a single tax by code
 */
router.get('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  const tax = await taxesService.getTax(code);

  if (!tax) {
    return res.status(404).json({ success: false, error: 'Tax not found.' });
  }

  return res.json({ success: true, data: tax });
}));

/**
 * PUT /api/v1/taxes/:code
 * Update a tax
 */
router.put('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { tax } = req.body;

  if (!tax) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "tax" object.' });
  }

  const result = await taxesService.updateTax(code, tax);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/taxes/:code
 * Delete a tax
 */
router.delete('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  await taxesService.deleteTax(code);

  return res.json({ success: true, message: `Tax "${code}" deleted.` });
}));

module.exports = router;