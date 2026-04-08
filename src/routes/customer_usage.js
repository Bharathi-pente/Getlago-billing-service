const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const customerUsageService = require('../services/lagoCustomerUsage');

const router = express.Router();

/**
 * GET /api/v1/customers/:external_customer_id/current_usage
 * Get current usage for a customer subscription
 */
router.get('/customers/:external_customer_id/current_usage', asyncHandler(async (req, res) => {
  const { external_customer_id } = req.params;
  const { external_subscription_id } = req.query;

  if (!external_subscription_id) {
    return res.status(400).json({
      success: false,
      error: 'external_subscription_id query parameter is required.',
    });
  }

  const result = await customerUsageService.getCurrentUsage(external_customer_id, external_subscription_id);

  return res.json({ success: true, data: result });
}));

/**
 * GET /api/v1/customers/:external_customer_id/past_usage
 * Get past usage for a customer subscription
 */
router.get('/customers/:external_customer_id/past_usage', asyncHandler(async (req, res) => {
  const { external_customer_id } = req.params;
  const { external_subscription_id } = req.query;
  const params = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  if (!external_subscription_id) {
    return res.status(400).json({
      success: false,
      error: 'external_subscription_id query parameter is required.',
    });
  }

  const result = await customerUsageService.getPastUsage(external_customer_id, external_subscription_id, params);

  return res.json({ success: true, data: result.usage_periods, meta: result.meta });
}));

module.exports = router;