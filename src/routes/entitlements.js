const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const entitlementsService = require('../services/lagoEntitlements');

const router = express.Router();

/**
 * POST /api/v1/entitlements
 * Create a new entitlement
 */
router.post('/', asyncHandler(async (req, res) => {
  const { entitlement } = req.body;

  if (!entitlement) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain an "entitlement" object.',
    });
  }

  const result = await entitlementsService.createEntitlement(entitlement);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/entitlements
 * List all entitlements
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await entitlementsService.listEntitlements(filters);

  return res.json({ success: true, data: result.entitlements, meta: result.meta });
}));

/**
 * GET /api/v1/entitlements/:id
 * Retrieve a single entitlement by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const entitlement = await entitlementsService.getEntitlement(id);

  if (!entitlement) {
    return res.status(404).json({ success: false, error: 'Entitlement not found.' });
  }

  return res.json({ success: true, data: entitlement });
}));

/**
 * PUT /api/v1/entitlements/:id
 * Update an entitlement
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { entitlement } = req.body;

  if (!entitlement) {
    return res.status(400).json({ success: false, error: 'Request body must contain an "entitlement" object.' });
  }

  const result = await entitlementsService.updateEntitlement(id, entitlement);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/entitlements/:id
 * Delete an entitlement
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await entitlementsService.deleteEntitlement(id);

  return res.json({ success: true, message: `Entitlement "${id}" deleted.` });
}));

module.exports = router;