const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const billingEntitiesService = require('../services/lagoBillingEntities');

const router = express.Router();

/**
 * POST /api/v1/billing_entities
 * Create a new billing entity
 */
router.post('/', asyncHandler(async (req, res) => {
  const { billing_entity } = req.body;

  if (!billing_entity) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "billing_entity" object.',
    });
  }

  const result = await billingEntitiesService.createBillingEntity(billing_entity);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/billing_entities
 * List all billing entities
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await billingEntitiesService.listBillingEntities(filters);

  return res.json({ success: true, data: result.billing_entities, meta: result.meta });
}));

/**
 * GET /api/v1/billing_entities/:id
 * Retrieve a single billing entity by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const billingEntity = await billingEntitiesService.getBillingEntity(id);

  if (!billingEntity) {
    return res.status(404).json({ success: false, error: 'Billing entity not found.' });
  }

  return res.json({ success: true, data: billingEntity });
}));

/**
 * PUT /api/v1/billing_entities/:id
 * Update a billing entity
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { billing_entity } = req.body;

  if (!billing_entity) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "billing_entity" object.' });
  }

  const result = await billingEntitiesService.updateBillingEntity(id, billing_entity);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/billing_entities/:id
 * Delete a billing entity
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await billingEntitiesService.deleteBillingEntity(id);

  return res.json({ success: true, message: `Billing entity "${id}" deleted.` });
}));

module.exports = router;