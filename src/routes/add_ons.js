const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoAddOnsService = require('../services/lagoAddOns');

const router = express.Router();

/**
 * POST /api/v1/add_ons
 * Create add-on in Lago
 */
router.post('/', asyncHandler(async (req, res) => {
  const { add_on } = req.body;

  if (!add_on) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain an "add_on" object.',
    });
  }

  const {
    name,
    code,
    description,
    amount_cents,
    amount_currency,
    tax_codes,
  } = add_on;

  // Required fields validation
  if (!name || !code || !amount_cents || !amount_currency) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, code, amount_cents, amount_currency.',
    });
  }

  const addOnData = {
    name,
    code,
    amount_cents,
    amount_currency,
    ...(description && { description }),
    ...(tax_codes && { tax_codes }),
  };

  const created = await lagoAddOnsService.createAddOn(addOnData);

  return res.status(201).json({ success: true, data: created });
}));

/**
 * GET /api/v1/add_ons
 * List all add-ons
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await lagoAddOnsService.getAddOns(filters);

  return res.json({ success: true, data: result.add_ons, meta: result.meta });
}));

/**
 * GET /api/v1/add_ons/:code
 * Retrieve a single add-on by code
 */
router.get('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  const addOn = await lagoAddOnsService.getAddOnByCode(code);

  if (!addOn) {
    return res.status(404).json({ success: false, error: 'Add-on not found.' });
  }

  return res.json({ success: true, data: addOn });
}));

/**
 * PUT /api/v1/add_ons/:code
 * Update an add-on
 */
router.put('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { add_on } = req.body;

  if (!add_on) {
    return res.status(400).json({ success: false, error: 'Request body must contain an "add_on" object.' });
  }

  const updated = await lagoAddOnsService.updateAddOn(code, add_on);

  return res.json({ success: true, data: updated });
}));

/**
 * DELETE /api/v1/add_ons/:code
 * Delete an add-on
 */
router.delete('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  await lagoAddOnsService.deleteAddOn(code);

  return res.json({ success: true, message: `Add-on "${code}" deleted.` });
}));

module.exports = router;