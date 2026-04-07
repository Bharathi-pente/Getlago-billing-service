const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoCustomerService = require('../services/lagoCustomer');
const lagoSubscriptionService = require('../services/lagoSubscription');
const customerQueries = require('../db/queries/customers');
const subscriptionQueries = require('../db/queries/subscriptions');
const syncJobsQueries = require('../db/queries/syncJobs');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/v1/customers
 * Create customer in Lago and database
 */
router.post('/', asyncHandler(async (req, res) => {
  const { internal_id, org_id, name, email, plan_code } = req.body;

  if (!internal_id || !name || !email || !plan_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: internal_id, name, email, plan_code',
      code: 400,
    });
  }

  try {
    // Create customer in Lago
    const lagoCustomer = await lagoCustomerService.createCustomer({
      external_id: internal_id,
      name,
      email,
      metadata: org_id ? { org_id } : {},
    });

    // Insert into database
    const dbCustomer = await customerQueries.createCustomer({
      internal_id,
      lago_id: lagoCustomer.lago_id,
      org_id,
      email,
      name,
      plan_code,
    });

    // Create subscription
    const lagoSubscription = await lagoSubscriptionService.createSubscription({
      external_customer_id: internal_id,
      plan_code,
      billing_time: 'anniversary',
    });

    // Insert subscription into database
    const dbSubscription = await subscriptionQueries.createSubscription({
      customer_id: dbCustomer.id,
      lago_sub_id: lagoSubscription.lago_id,
      plan_code,
      status: lagoSubscription.status,
      started_at: new Date(),
    });

    res.status(201).json({
      success: true,
      data: {
        customer: dbCustomer,
        subscription: dbSubscription,
      },
    });
  } catch (error) {
    // If Lago fails, save to sync jobs
    logger.warn('Failed to create customer in Lago, saving to sync jobs', {
      internal_id,
      error: error.message,
    });

    await syncJobsQueries.createSyncJob({
      job_type: 'create_customer',
      payload: { internal_id, org_id, name, email, plan_code },
    });

    res.status(202).json({
      success: true,
      data: {
        message: 'Customer creation queued for sync',
        internal_id,
      },
    });
  }
}));

/**
 * GET /api/v1/customers/:internalId
 * Get customer details
 */
router.get('/:internalId', asyncHandler(async (req, res) => {
  const { internalId } = req.params;

  // Lookup in database
  const dbCustomer = await customerQueries.findByInternalId(internalId);

  if (!dbCustomer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Fetch live data from Lago
  const lagoCustomer = await lagoCustomerService.getCustomer(internalId);

  res.json({
    success: true,
    data: {
      ...dbCustomer,
      lago_data: lagoCustomer,
    },
  });
}));

/**
 * PATCH /api/v1/customers/:internalId
 * Update customer
 */
router.patch('/:internalId', asyncHandler(async (req, res) => {
  const { internalId } = req.params;
  const updates = req.body;

  // Check if customer exists
  const dbCustomer = await customerQueries.findByInternalId(internalId);

  if (!dbCustomer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Update in Lago
  const lagoCustomer = await lagoCustomerService.updateCustomer(internalId, updates);

  // Update in database
  const updatedCustomer = await customerQueries.updateCustomer(internalId, {
    name: updates.name,
    email: updates.email,
    synced_at: new Date(),
  });

  res.json({
    success: true,
    data: {
      ...updatedCustomer,
      lago_data: lagoCustomer,
    },
  });
}));

/**
 * DELETE /api/v1/customers/:internalId
 * Delete customer
 */
router.delete('/:internalId', asyncHandler(async (req, res) => {
  const { internalId } = req.params;

  // Check if customer exists
  const dbCustomer = await customerQueries.findByInternalId(internalId);

  if (!dbCustomer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Delete from Lago
  await lagoCustomerService.deleteCustomer(internalId);

  // Delete from database (cascade)
  await customerQueries.deleteCustomer(internalId);

  res.json({
    success: true,
    data: {
      message: 'Customer deleted successfully',
      internal_id: internalId,
    },
  });
}));

module.exports = router;
