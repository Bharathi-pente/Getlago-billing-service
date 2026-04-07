const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoEventsService = require('../services/lagoEvents');
const customerQueries = require('../db/queries/customers');
const syncJobsQueries = require('../db/queries/syncJobs');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/v1/events
 * Push single event to Lago
 */
router.post('/', asyncHandler(async (req, res) => {
  const { internal_customer_id, event_code, properties } = req.body;

  if (!internal_customer_id || !event_code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: internal_customer_id, event_code',
      code: 400,
    });
  }

  // Lookup customer to verify existence
  const customer = await customerQueries.findByInternalId(internal_customer_id);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  try {
    // Push event to Lago (transaction_id and timestamp auto-generated)
    const result = await lagoEventsService.pushEvent({
      external_customer_id: internal_customer_id,
      code: event_code,
      properties: properties || {},
    });

    res.status(201).json({
      success: true,
      data: {
        transaction_id: result.transaction_id,
        event_code,
        internal_customer_id,
      },
    });
  } catch (error) {
    // If Lago fails, save to sync jobs
    logger.warn('Failed to push event to Lago, saving to sync jobs', {
      internal_customer_id,
      event_code,
      error: error.message,
    });

    await syncJobsQueries.createSyncJob({
      job_type: 'push_event',
      payload: { internal_customer_id, event_code, properties },
    });

    res.status(202).json({
      success: true,
      data: {
        message: 'Event queued for sync',
        internal_customer_id,
        event_code,
      },
    });
  }
}));

/**
 * POST /api/v1/events/batch
 * Push batch of events to Lago
 */
router.post('/batch', asyncHandler(async (req, res) => {
  const { events } = req.body;

  if (!events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid events array',
      code: 400,
    });
  }

  // Validate all events
  for (const event of events) {
    if (!event.internal_customer_id || !event.event_code) {
      return res.status(400).json({
        success: false,
        error: 'Each event must have internal_customer_id and event_code',
        code: 400,
      });
    }
  }

  // Transform events for Lago
  const lagoEvents = events.map(event => ({
    external_customer_id: event.internal_customer_id,
    code: event.event_code,
    properties: event.properties || {},
  }));

  // Push batch to Lago
  await lagoEventsService.pushBatchEvents(lagoEvents);

  res.status(201).json({
    success: true,
    data: {
      message: 'Batch events pushed successfully',
      count: events.length,
    },
  });
}));

/**
 * GET /api/v1/events/usage/:internalCustomerId
 * Get current billing period usage
 */
router.get('/usage/:internalCustomerId', asyncHandler(async (req, res) => {
  const { internalCustomerId } = req.params;
  const { external_subscription_id } = req.query;

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internalCustomerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found',
      code: 404,
    });
  }

  // Get usage from Lago
  const usage = await lagoEventsService.getUsage(
    internalCustomerId,
    external_subscription_id || null
  );

  res.json({
    success: true,
    data: usage,
  });
}));

module.exports = router;
