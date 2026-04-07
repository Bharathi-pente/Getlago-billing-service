const logger = require('../utils/logger');
const webhookLogsQueries = require('../db/queries/webhookLogs');
const subscriptionsQueries = require('../db/queries/subscriptions');

/**
 * Process webhook event
 * @param {Object} webhookData - Webhook payload
 * @returns {Promise<void>}
 */
async function processWebhook(webhookData) {
  const webhookType = webhookData.webhook_type;
  const eventId = webhookData.lago_id || webhookData.object?.lago_id;

  logger.info('Processing webhook', {
    webhook_type: webhookType,
    lago_id: eventId,
  });

  // Check for duplicate
  const existing = await webhookLogsQueries.findByLagoEventId(eventId);
  if (existing) {
    logger.info('Webhook already processed (duplicate)', {
      lago_id: eventId,
      webhook_type: webhookType,
    });
    return { duplicate: true };
  }

  // Insert webhook log
  await webhookLogsQueries.createWebhookLog({
    lago_event_id: eventId,
    webhook_type: webhookType,
    payload: webhookData,
    status: 'received',
  });

  try {
    // Process based on webhook type
    switch (webhookType) {
      case 'invoice.created':
        await handleInvoiceCreated(webhookData);
        break;

      case 'invoice.payment_status_updated':
        await handleInvoicePaymentStatusUpdated(webhookData);
        break;

      case 'customer.payment_overdue':
        await handlePaymentOverdue(webhookData);
        break;

      case 'subscription.terminated':
        await handleSubscriptionTerminated(webhookData);
        break;

      case 'wallet.depleted_ongoing_balance':
        await handleWalletDepleted(webhookData);
        break;

      default:
        logger.info('Webhook type not handled', { webhook_type: webhookType });
    }

    // Mark as processed
    await webhookLogsQueries.updateStatus(eventId, 'processed');

    logger.info('Webhook processed successfully', {
      webhook_type: webhookType,
      lago_id: eventId,
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to process webhook', {
      webhook_type: webhookType,
      lago_id: eventId,
      error: error.message,
    });

    // Mark as failed
    await webhookLogsQueries.updateStatus(eventId, 'failed', error.message);

    // Don't throw - we still want to return 200 to Lago
    return { success: false, error: error.message };
  }
}

/**
 * Handle invoice.created webhook
 */
async function handleInvoiceCreated(data) {
  logger.info('Invoice created', {
    invoice_id: data.invoice?.lago_id,
    customer_id: data.invoice?.customer?.external_id,
    amount_cents: data.invoice?.amount_cents,
  });
}

/**
 * Handle invoice.payment_status_updated webhook
 */
async function handleInvoicePaymentStatusUpdated(data) {
  logger.info('Invoice payment status updated', {
    invoice_id: data.invoice?.lago_id,
    customer_id: data.invoice?.customer?.external_id,
    payment_status: data.invoice?.payment_status,
  });

  // Could update subscription status based on payment status
  if (data.invoice?.payment_status === 'failed') {
    logger.warn('Payment failed for invoice', {
      invoice_id: data.invoice?.lago_id,
      customer_id: data.invoice?.customer?.external_id,
    });
  }
}

/**
 * Handle customer.payment_overdue webhook
 */
async function handlePaymentOverdue(data) {
  logger.warn('Customer payment overdue', {
    customer_id: data.customer?.external_id,
    lago_id: data.customer?.lago_id,
  });

  // Could flag customer or trigger notifications
}

/**
 * Handle subscription.terminated webhook
 */
async function handleSubscriptionTerminated(data) {
  logger.info('Subscription terminated', {
    subscription_id: data.subscription?.lago_id,
    customer_id: data.subscription?.external_customer_id,
  });

  // Update subscription status in database
  try {
    const lagoSubId = data.subscription?.lago_id;
    if (lagoSubId) {
      await subscriptionsQueries.updateStatus(lagoSubId, 'terminated');
      logger.info('Subscription status updated to terminated', { lago_sub_id: lagoSubId });
    }
  } catch (error) {
    logger.error('Failed to update subscription status', {
      lago_sub_id: data.subscription?.lago_id,
      error: error.message,
    });
  }
}

/**
 * Handle wallet.depleted_ongoing_balance webhook
 */
async function handleWalletDepleted(data) {
  logger.warn('Wallet balance depleted', {
    wallet_id: data.wallet?.lago_id,
    customer_id: data.wallet?.external_customer_id,
  });

  // Could trigger credit top-up notifications
}

module.exports = {
  processWebhook,
};
