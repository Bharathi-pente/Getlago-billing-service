const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const webhookEndpointsService = require('../services/lagoWebhookEndpoints');

const router = express.Router();

/**
 * POST /api/v1/webhook_endpoints
 * Create a new webhook endpoint
 */
router.post('/', asyncHandler(async (req, res) => {
  const { webhook_endpoint } = req.body;

  if (!webhook_endpoint) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "webhook_endpoint" object.',
    });
  }

  const result = await webhookEndpointsService.createWebhookEndpoint(webhook_endpoint);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/webhook_endpoints
 * List all webhook endpoints
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await webhookEndpointsService.listWebhookEndpoints(filters);

  return res.json({ success: true, data: result.webhook_endpoints, meta: result.meta });
}));

/**
 * GET /api/v1/webhook_endpoints/:id
 * Retrieve a single webhook endpoint by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const webhookEndpoint = await webhookEndpointsService.getWebhookEndpoint(id);

  if (!webhookEndpoint) {
    return res.status(404).json({ success: false, error: 'Webhook endpoint not found.' });
  }

  return res.json({ success: true, data: webhookEndpoint });
}));

/**
 * PUT /api/v1/webhook_endpoints/:id
 * Update a webhook endpoint
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { webhook_endpoint } = req.body;

  if (!webhook_endpoint) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "webhook_endpoint" object.' });
  }

  const result = await webhookEndpointsService.updateWebhookEndpoint(id, webhook_endpoint);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/webhook_endpoints/:id
 * Delete a webhook endpoint
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await webhookEndpointsService.deleteWebhookEndpoint(id);

  return res.json({ success: true, message: `Webhook endpoint "${id}" deleted.` });
}));

module.exports = router;