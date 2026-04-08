const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoCouponsService = require('../services/lagoCoupons');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/v1/applied_coupons
 * Create applied coupon directly
 */
router.post('/', asyncHandler(async (req, res) => {
  const { applied_coupon } = req.body;

  if (!applied_coupon) {
    return res.status(400).json({
      success: false,
      error: 'Missing applied_coupon object',
      code: 400,
    });
  }

  const { external_customer_id, coupon_code, coupon_type, amount_cents, amount_currency, percentage_rate, frequency, expiration } = applied_coupon;

  if (!external_customer_id || !coupon_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: external_customer_id, coupon_code',
      code: 400,
    });
  }

  // Validate coupon type
  if (!['fixed_amount', 'percentage'].includes(coupon_type)) {
    return res.status(400).json({
      success: false,
      error: 'coupon_type must be "fixed_amount" or "percentage"',
      code: 400,
    });
  }

  // Validate required fields based on type
  if (coupon_type === 'fixed_amount' && (!amount_cents || !amount_currency)) {
    return res.status(400).json({
      success: false,
      error: 'fixed_amount coupons require amount_cents and amount_currency',
      code: 400,
    });
  }

  if (coupon_type === 'percentage' && percentage_rate == null) {
    return res.status(400).json({
      success: false,
      error: 'percentage coupons require percentage_rate',
      code: 400,
    });
  }

  try {
    // Create applied coupon in Lago
    const appliedCouponData = {
      applied_coupon: {
        external_customer_id,
        coupon_code,
        coupon_type,
        frequency: frequency || 'once',
        expiration: expiration || 'no_expiration',
      },
    };

    // Add type-specific fields
    if (coupon_type === 'fixed_amount') {
      appliedCouponData.applied_coupon.amount_cents = amount_cents;
      appliedCouponData.applied_coupon.amount_currency = amount_currency;
    } else if (coupon_type === 'percentage') {
      appliedCouponData.applied_coupon.percentage_rate = percentage_rate;
    }

    const result = await lagoCouponsService.createAppliedCoupon(appliedCouponData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Failed to create applied coupon', {
      external_customer_id,
      coupon_code,
      error: error.message,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create applied coupon',
      code: 500,
    });
  }
}));

module.exports = router;