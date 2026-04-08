const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create a coupon in Lago
 * POST /api/v1/coupons
 *
 * @param {Object} couponData
 * @param {string}  couponData.name                  - Display name
 * @param {string}  couponData.code                  - Unique code (no spaces)
 * @param {string}  couponData.coupon_type            - 'fixed_amount' | 'percentage'
 * @param {number}  [couponData.amount_cents]         - Required for fixed_amount
 * @param {string}  [couponData.amount_currency]      - ISO 4217, required for fixed_amount
 * @param {number}  [couponData.percentage_rate]      - Required for percentage (e.g. 20.0)
 * @param {string}  couponData.frequency              - 'once' | 'recurring' | 'forever'
 * @param {number}  [couponData.frequency_duration]   - Required when frequency = 'recurring'
 * @param {string}  couponData.expiration             - 'no_expiration' | 'time_limit'
 * @param {string}  [couponData.expiration_at]        - ISO8601, required when expiration = 'time_limit'
 * @param {boolean} couponData.reusable               - Whether the coupon can be applied multiple times
 * @param {Object}  [couponData.applies_to]           - { plan_codes: [], billable_metric_codes: [] }
 * @param {string}  [couponData.description]          - Optional description
 */
async function createCoupon(couponData) {
  try {
    logger.info('Creating coupon in Lago', {
      name: couponData.name,
      code: couponData.code,
    });

    const response = await lagoClient.coupons.createCoupon({
      coupon: couponData,
    });

    logger.info('Coupon created in Lago', {
      name: couponData.name,
      code: couponData.code,
      lago_id: response.coupon?.lago_id,
    });

    return response.coupon;
  } catch (error) {
    logger.error('Failed to create coupon in Lago', {
      name: couponData.name,
      code: couponData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all coupons from Lago
 * GET /api/v1/coupons
 *
 * @param {Object} filters
 * @param {number} [filters.page=1]
 * @param {number} [filters.per_page=20]
 */
async function getCoupons(filters = {}) {
  try {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 20,
    };

    logger.debug('Fetching coupons from Lago', params);

    const response = await lagoClient.coupons.findAllCoupons(params);

    logger.debug('Coupons fetched from Lago', {
      count: response.coupons?.length || 0,
    });

    return {
      coupons: response.coupons || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch coupons from Lago', {
      filters,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Retrieve a single coupon by code
 * GET /api/v1/coupons/:code
 *
 * @param {string} code - Coupon code
 */
async function getCouponByCode(code) {
  try {
    logger.debug('Fetching coupon from Lago', { code });

    const response = await lagoClient.coupons.findCoupon(code);

    logger.debug('Coupon fetched from Lago', { code });

    return response.coupon;
  } catch (error) {
    logger.error('Failed to fetch coupon from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update a coupon in Lago
 * PUT /api/v1/coupons/:code
 *
 * @param {string} code         - Coupon code to update
 * @param {Object} couponData   - Fields to update
 */
async function updateCoupon(code, couponData) {
  try {
    logger.info('Updating coupon in Lago', { code });

    const response = await lagoClient.coupons.updateCoupon(code, {
      coupon: couponData,
    });

    logger.info('Coupon updated in Lago', { code });

    return response.coupon;
  } catch (error) {
    logger.error('Failed to update coupon in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete a coupon from Lago
 * DELETE /api/v1/coupons/:code
 *
 * @param {string} code - Coupon code to delete
 */
async function deleteCoupon(code) {
  try {
    logger.info('Deleting coupon in Lago', { code });

    const response = await lagoClient.coupons.destroyCoupon(code);

    logger.info('Coupon deleted in Lago', { code });

    return response.coupon;
  } catch (error) {
    logger.error('Failed to delete coupon in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Apply a coupon to a customer
 * POST /api/v1/applied_coupons
 *
 * @param {string} external_customer_id
 * @param {string} coupon_code
 * @param {Object} [overrides]  - Optional: amount_cents, amount_currency, percentage_rate, frequency, frequency_duration
 */
async function applyCoupon(external_customer_id, coupon_code, overrides = {}) {
  try {
    logger.info('Applying coupon in Lago', { external_customer_id, coupon_code });

    const response = await lagoClient.appliedCoupons.createAppliedCoupon({
      applied_coupon: {
        external_customer_id,
        coupon_code,
        ...overrides,
      },
    });

    logger.info('Coupon applied in Lago', { external_customer_id, coupon_code });

    return response.applied_coupon;
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
 * Delete (terminate) an applied coupon from a customer
 * DELETE /api/v1/customers/:external_customer_id/applied_coupons/:applied_coupon_id
 *
 * @param {string} external_customer_id
 * @param {string} applied_coupon_id  - lago_id of the applied coupon
 */
async function removeCoupon(external_customer_id, applied_coupon_id) {
  try {
    logger.info('Removing applied coupon in Lago', { external_customer_id, applied_coupon_id });

    const response = await lagoClient.appliedCoupons.destroyAppliedCoupon(
      external_customer_id,
      applied_coupon_id
    );

    logger.info('Applied coupon removed in Lago', { external_customer_id, applied_coupon_id });

    return response;
  } catch (error) {
    logger.error('Failed to remove applied coupon in Lago', {
      external_customer_id,
      applied_coupon_id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Create applied coupon directly
 * POST /api/v1/applied_coupons
 *
 * @param {Object} appliedCouponData - The applied coupon data
 * @param {Object} appliedCouponData.applied_coupon
 */
async function createAppliedCoupon(appliedCouponData) {
  try {
    logger.info('Creating applied coupon in Lago', appliedCouponData);

    const response = await lagoClient.appliedCoupons.createAppliedCoupon(appliedCouponData);

    logger.info('Applied coupon created in Lago', {
      external_customer_id: appliedCouponData.applied_coupon?.external_customer_id,
      coupon_code: appliedCouponData.applied_coupon?.coupon_code,
    });

    return response.applied_coupon;
  } catch (error) {
    logger.error('Failed to create applied coupon in Lago', {
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all applied coupons (optionally filter by customer)
 * GET /api/v1/applied_coupons
 *
 * @param {Object} filters
 * @param {string} [filters.external_customer_id]
 * @param {string} [filters.status]  - 'active' | 'terminated'
 * @param {number} [filters.page]
 * @param {number} [filters.per_page]
 */
async function getAppliedCoupons(filters = {}) {
  try {
    logger.debug('Fetching applied coupons from Lago', filters);

    const response = await lagoClient.appliedCoupons.findAllAppliedCoupons(filters);

    logger.debug('Applied coupons fetched from Lago', {
      count: response.applied_coupons?.length || 0,
    });

    return {
      applied_coupons: response.applied_coupons || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch applied coupons from Lago', {
      filters,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  createAppliedCoupon,
  removeCoupon,
  getAppliedCoupons,
};