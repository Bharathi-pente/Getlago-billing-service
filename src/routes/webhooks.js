const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const webhookVerify = require('../middleware/webhookVerify');
const lagoWebhookService = require('../services/lagoWebhook');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/v1/webhooks/lago
 * Handle Lago webhooks
 * 
 * Note: This route uses express.raw() middleware which is configured in app.js
 * The raw body is needed for signature verification
 */
router.post('/lago', webhookVerify, asyncHandler(async (req, res) => {
  // parsedBody is set by webhookVerify middleware
  const webhookData = req.parsedBody;

  logger.info('Received Lago webhook', {
    webhook_type: webhookData.webhook_type,
    lago_id: webhookData.lago_id,
  });

  // Process webhook (always return 200 to Lago)
  const result = await lagoWebhookService.processWebhook(webhookData);

  // Always return 200 to acknowledge receipt
  res.status(200).json({
    success: true,
    message: 'Webhook received',
    duplicate: result.duplicate || false,
  });
}));

module.exports = router;
