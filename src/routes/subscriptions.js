const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoSubscriptionService = require('../services/lagoSubscription');
const customerQueries = require('../db/queries/customers');
const subscriptionQueries = require('../db/queries/subscriptions');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/v1/subscriptions
 * Create subscription
 */
router.post('/', asyncHandler(async (req, res) => {
  const { internal_customer_id, plan_code, billing_time } = req.body;

  if (!internal_customer_id || !plan_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: internal_customer_id, plan_code',
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

  // Create subscription in Lago
  const lagoSubscription = await lagoSubscriptionService.createSubscription({
    external_customer_id: internal_customer_id,
    plan_code,
    billing_time: billing_time || 'anniversary',
  });

  // Insert into database
  const dbSubscription = await subscriptionQueries.createSubscription({
    customer_id: customer.id,
    lago_sub_id: lagoSubscription.lago_id,
    plan_code,
    status: lagoSubscription.status,
    started_at: new Date(),
  });

  // Update customer plan_code
  await customerQueries.updateCustomer(internal_customer_id, { plan_code });

  res.status(201).json({
    success: true,
    data: dbSubscription,
  });
}));

/**
 * PATCH /api/v1/subscriptions/:internalCustomerId
 * Update subscription (upgrade/downgrade plan)
 */
router.patch('/:internalCustomerId', asyncHandler(async (req, res) => {
  const { internalCustomerId } = req.params;
  const { plan_code } = req.body;

  if (!plan_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: plan_code',
      code: 400,
    });
  }

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internalCustomerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Find active subscription
  const activeSubscription = await subscriptionQueries.findActiveByCustomerId(customer.id);

  if (!activeSubscription) {
    return res.status(404).json({
      success: false,
      error: 'No active subscription found',
      code: 404,
    });
  }

  // Update subscription in Lago
  const lagoSubscription = await lagoSubscriptionService.updateSubscription(
    activeSubscription.lago_sub_id,
    { plan_code }
  );

  // Update in database
  const updatedSubscription = await subscriptionQueries.updateSubscription(
    activeSubscription.lago_sub_id,
    { plan_code }
  );

  // Update customer plan_code
  await customerQueries.updateCustomer(internalCustomerId, { plan_code });

  res.json({
    success: true,
    data: updatedSubscription,
  });
}));

/**
 * DELETE /api/v1/subscriptions/:internalCustomerId
 * Terminate subscription
 */
router.delete('/:internalCustomerId', asyncHandler(async (req, res) => {
  const { internalCustomerId } = req.params;

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internalCustomerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Find active subscription
  const activeSubscription = await subscriptionQueries.findActiveByCustomerId(customer.id);

  if (!activeSubscription) {
    return res.status(404).json({
      success: false,
      error: 'No active subscription found',
      code: 404,
    });
  }

  // Terminate in Lago
  await lagoSubscriptionService.terminateSubscription(internalCustomerId);

  // Update status in database
  await subscriptionQueries.updateStatus(activeSubscription.lago_sub_id, 'terminated');

  res.json({
    success: true,
    data: {
      message: 'Subscription terminated successfully',
      subscription_id: activeSubscription.lago_sub_id,
    },
  });
}));

module.exports = router;
