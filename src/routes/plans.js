const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const plansService = require('../services/lagoPlans');

const router = express.Router();

/**
 * POST /api/v1/plans
 * Create a new plan
 */
router.post('/', asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "plan" object.',
    });
  }

  const result = await plansService.createPlan(plan);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/plans
 * List all plans
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await plansService.listPlans(filters);

  return res.json({ success: true, data: result.plans, meta: result.meta });
}));

/**
 * GET /api/v1/plans/:code
 * Retrieve a single plan by code
 */
router.get('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  const plan = await plansService.getPlan(code);

  if (!plan) {
    return res.status(404).json({ success: false, error: 'Plan not found.' });
  }

  return res.json({ success: true, data: plan });
}));

/**
 * PUT /api/v1/plans/:code
 * Update a plan
 */
router.put('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "plan" object.' });
  }

  const result = await plansService.updatePlan(code, plan);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/plans/:code
 * Delete a plan
 */
router.delete('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  await plansService.deletePlan(code);

  return res.json({ success: true, message: `Plan "${code}" deleted.` });
}));

module.exports = router;