const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const billableMetricsService = require('../services/lagoBillableMetrics');

const router = express.Router();

/**
 * POST /api/v1/billable_metrics
 * Create a new billable metric
 */
router.post('/', asyncHandler(async (req, res) => {
  const { billable_metric } = req.body;

  if (!billable_metric) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "billable_metric" object.',
    });
  }

  const result = await billableMetricsService.createBillableMetric(billable_metric);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/billable_metrics
 * List all billable metrics
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await billableMetricsService.listBillableMetrics(filters);

  return res.json({ success: true, data: result.billable_metrics, meta: result.meta });
}));

/**
 * GET /api/v1/billable_metrics/:code
 * Retrieve a single billable metric by code
 */
router.get('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  const billableMetric = await billableMetricsService.getBillableMetric(code);

  if (!billableMetric) {
    return res.status(404).json({ success: false, error: 'Billable metric not found.' });
  }

  return res.json({ success: true, data: billableMetric });
}));

/**
 * GET /api/v1/billable_metrics/:code/groups
 * Get billable metric groups
 */
router.get('/:code/groups', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const params = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await billableMetricsService.getBillableMetricGroups(code, params);

  return res.json({ success: true, data: result.groups, meta: result.meta });
}));

/**
 * PUT /api/v1/billable_metrics/:code
 * Update a billable metric
 */
router.put('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { billable_metric } = req.body;

  if (!billable_metric) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "billable_metric" object.' });
  }

  const result = await billableMetricsService.updateBillableMetric(code, billable_metric);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/billable_metrics/:code
 * Delete a billable metric
 */
router.delete('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  await billableMetricsService.deleteBillableMetric(code);

  return res.json({ success: true, message: `Billable metric "${code}" deleted.` });
}));

module.exports = router;