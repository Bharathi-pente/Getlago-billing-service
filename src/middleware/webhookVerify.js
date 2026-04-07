const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Webhook signature verification middleware
 * Verifies HMAC SHA-256 signature from Lago webhooks
 */
function webhookVerify(req, res, next) {
  const signature = req.headers['x-lago-signature'];
  
  if (!signature) {
    logger.warn('Webhook verification failed: Missing signature header');
    return res.status(401).json({
      success: false,
      error: 'Missing webhook signature',
      code: 401,
    });
  }

  // Raw body should be available from express.raw() middleware
  const rawBody = req.body;
  
  if (!rawBody) {
    logger.error('Webhook verification failed: Raw body not available');
    return res.status(400).json({
      success: false,
      error: 'Invalid webhook payload',
      code: 400,
    });
  }

  // Compute HMAC signature
  const hmac = crypto.createHmac('sha256', process.env.LAGO_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const computedSignature = hmac.digest('hex');

  // Compare signatures
  if (signature !== computedSignature) {
    logger.warn('Webhook verification failed: Signature mismatch', {
      received: signature,
      computed: computedSignature.substring(0, 16) + '...',
    });
    return res.status(401).json({
      success: false,
      error: 'Invalid webhook signature',
      code: 401,
    });
  }

  logger.debug('Webhook signature verified successfully');
  
  // Parse JSON body for downstream handlers
  try {
    req.parsedBody = JSON.parse(rawBody.toString());
  } catch (error) {
    logger.error('Failed to parse webhook JSON body:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload',
      code: 400,
    });
  }

  next();
}

module.exports = webhookVerify;
