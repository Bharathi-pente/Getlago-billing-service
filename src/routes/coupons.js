const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoCouponsService = require('../services/lagoCoupons');
const customerQueries = require('../db/queries/customers');

const router = express.Router();

/**
 * POST /api/v1/coupons/apply
 * Apply coupon to customer
 */
router.post('/apply', asyncHandler(async (req, res) => {
  const { internal_customer_id, coupon_code } = req.body;

  if (!internal_customer_id || !coupon_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: internal_customer_id, coupon_code',
      code: 400,
    });
  }

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internal_customer_id);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Apply coupon in Lago
  const appliedCoupon = await lagoCouponsService.applyCoupon(
    internal_customer_id,
    coupon_code
  );

  res.status(201).json({
    success: true,
    data: appliedCoupon,
  });
}));

/**
 * DELETE /api/v1/coupons/:internalCustomerId/:couponCode
 * Remove applied coupon from customer
 */
router.delete('/:internalCustomerId/:couponCode', asyncHandler(async (req, res) => {
  const { internalCustomerId, couponCode } = req.params;

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internalCustomerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Get applied coupons to find the one to remove
  const appliedCoupons = await lagoCouponsService.getAppliedCoupons(internalCustomerId);

  const couponToRemove = appliedCoupons.find(c => c.coupon.code === couponCode);

  if (!couponToRemove) {
    return res.status(404).json({
      success: false,
      error: 'Coupon not found or not applied to customer',
      code: 404,
    });
  }

  // Remove coupon in Lago
  await lagoCouponsService.removeCoupon(internalCustomerId, couponToRemove.lago_id);

  res.json({
    success: true,
    data: {
      message: 'Coupon removed successfully',
      coupon_code: couponCode,
    },
  });
}));

module.exports = router;
