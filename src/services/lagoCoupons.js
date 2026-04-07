const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Apply coupon to customer
 * @param {string} external_customer_id - External customer ID
 * @param {string} coupon_code - Coupon code to apply
 * @returns {Promise<Object>} Applied coupon response
 */
async function applyCoupon(external_customer_id, coupon_code) {
  try {
    logger.info('Applying coupon in Lago', {
      external_customer_id,
      coupon_code,
    });
    
    const response = await lagoClient.appliedCoupons.createAppliedCoupon({
      applied_coupon: {
        external_customer_id,
        coupon_code,
      },
    });

    logger.info('Coupon applied in Lago', {
      external_customer_id,
      coupon_code,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to apply coupon in Lago', {
      external_customer_id,
      coupon_code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Remove applied coupon from customer
 * @param {string} external_customer_id - External customer ID
 * @param {string} applied_coupon_id - Applied coupon ID to remove
 * @returns {Promise<Object>} Removal response
 */
async function removeCoupon(external_customer_id, applied_coupon_id) {
  try {
    logger.info('Removing coupon in Lago', {
      external_customer_id,
      applied_coupon_id,
    });
    
    const response = await lagoClient.appliedCoupons.destroyAppliedCoupon(applied_coupon_id);

    logger.info('Coupon removed in Lago', {
      external_customer_id,
      applied_coupon_id,
      status: 'success',
    });

    return response;
  } catch (error) {
    logger.error('Failed to remove coupon in Lago', {
      external_customer_id,
      applied_coupon_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get applied coupons for customer
 * @param {string} external_customer_id - External customer ID
 * @returns {Promise<Array>} Applied coupons
 */
async function getAppliedCoupons(external_customer_id) {
  try {
    logger.debug('Fetching applied coupons from Lago', { external_customer_id });
    
    const response = await lagoClient.appliedCoupons.findAllAppliedCoupons({
      external_customer_id,
    });

    logger.debug('Applied coupons fetched from Lago', {
      external_customer_id,
      count: response.applied_coupons?.length || 0,
    });

    return response.applied_coupons || [];
  } catch (error) {
    logger.error('Failed to fetch applied coupons from Lago', {
      external_customer_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  applyCoupon,
  removeCoupon,
  getAppliedCoupons,
};
