const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoCoupons = require('../services/lagoCoupons');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/v1/coupons
// Create a new coupon in Lago
// ─────────────────────────────────────────────
router.post('/', asyncHandler(async (req, res) => {
  const { coupon } = req.body;

  if (!coupon) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "coupon" object.',
    });
  }

  const {
    name,
    code,
    coupon_type,
    amount_cents,
    amount_currency,
    percentage_rate,
    frequency,
    frequency_duration,
    expiration,
    expiration_at,
    reusable,
    applies_to,
    description,
  } = coupon;

  // ── Required fields ──
  if (!name || !code || !coupon_type) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, code, coupon_type.',
    });
  }

  if (!['fixed_amount', 'percentage'].includes(coupon_type)) {
    return res.status(400).json({
      success: false,
      error: 'coupon_type must be "fixed_amount" or "percentage".',
    });
  }

  if (coupon_type === 'fixed_amount') {
    if (!amount_cents || !amount_currency) {
      return res.status(400).json({
        success: false,
        error: 'fixed_amount coupons require amount_cents and amount_currency.',
      });
    }
  }

  if (coupon_type === 'percentage') {
    if (percentage_rate == null) {
      return res.status(400).json({
        success: false,
        error: 'percentage coupons require percentage_rate.',
      });
    }
  }

  if (!['once', 'recurring', 'forever'].includes(frequency || 'once')) {
    return res.status(400).json({
      success: false,
      error: 'frequency must be "once", "recurring", or "forever".',
    });
  }

  if ((frequency === 'recurring') && !frequency_duration) {
    return res.status(400).json({
      success: false,
      error: 'frequency_duration is required when frequency is "recurring".',
    });
  }

  if (expiration === 'time_limit' && !expiration_at) {
    return res.status(400).json({
      success: false,
      error: 'expiration_at is required when expiration is "time_limit".',
    });
  }

  const payload = {
    name,
    code,
    coupon_type,
    reusable: reusable !== undefined ? reusable : true,
    frequency: frequency || 'once',
    expiration: expiration || 'no_expiration',
    applies_to: applies_to || { plan_codes: [], billable_metric_codes: [] },
    ...(description && { description }),
    ...(coupon_type === 'fixed_amount' && { amount_cents, amount_currency }),
    ...(coupon_type === 'percentage' && { percentage_rate }),
    ...(frequency === 'recurring' && { frequency_duration }),
    ...(expiration === 'time_limit' && { expiration_at }),
  };

  const created = await lagoCoupons.createCoupon(payload);

  return res.status(201).json({ success: true, data: created });
}));

// ─────────────────────────────────────────────
// GET /api/v1/coupons
// List all coupons
// ─────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await lagoCoupons.getCoupons(filters);

  return res.json({ success: true, data: result.coupons, meta: result.meta });
}));

// ─────────────────────────────────────────────
// GET /api/v1/coupons/:code
// Retrieve a single coupon by code
// ─────────────────────────────────────────────
router.get('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  const coupon = await lagoCoupons.getCouponByCode(code);

  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found.' });
  }

  return res.json({ success: true, data: coupon });
}));

// ─────────────────────────────────────────────
// PUT /api/v1/coupons/:code
// Update a coupon
// ─────────────────────────────────────────────
router.put('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { coupon } = req.body;

  if (!coupon) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "coupon" object.' });
  }

  const updated = await lagoCoupons.updateCoupon(code, coupon);

  return res.json({ success: true, data: updated });
}));

// ─────────────────────────────────────────────
// DELETE /api/v1/coupons/:code
// Delete a coupon definition
// ─────────────────────────────────────────────
router.delete('/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;

  await lagoCoupons.deleteCoupon(code);

  return res.json({ success: true, message: `Coupon "${code}" deleted.` });
}));

// ─────────────────────────────────────────────
// POST /api/v1/coupons/apply
// Apply a coupon to a customer
// ─────────────────────────────────────────────
router.post('/apply', asyncHandler(async (req, res) => {
  const { external_customer_id, coupon_code, ...overrides } = req.body;

  if (!external_customer_id || !coupon_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: external_customer_id, coupon_code.',
    });
  }

  const applied = await lagoCoupons.applyCoupon(external_customer_id, coupon_code, overrides);

  return res.status(201).json({ success: true, data: applied });
}));

// ─────────────────────────────────────────────
// GET /api/v1/coupons/applied
// List applied coupons (optionally filter by customer)
// ─────────────────────────────────────────────
router.get('/applied', asyncHandler(async (req, res) => {
  const filters = {
    external_customer_id: req.query.external_customer_id,
    status: req.query.status,
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await lagoCoupons.getAppliedCoupons(filters);

  return res.json({ success: true, data: result.applied_coupons, meta: result.meta });
}));

// ─────────────────────────────────────────────
// DELETE /api/v1/coupons/applied/:external_customer_id/:applied_coupon_id
// Remove an applied coupon from a customer
// ─────────────────────────────────────────────
router.delete('/applied/:external_customer_id/:applied_coupon_id', asyncHandler(async (req, res) => {
  const { external_customer_id, applied_coupon_id } = req.params;

  await lagoCoupons.removeCoupon(external_customer_id, applied_coupon_id);

  return res.json({
    success: true,
    message: `Applied coupon "${applied_coupon_id}" removed from customer "${external_customer_id}".`,
  });
}));

module.exports = router;