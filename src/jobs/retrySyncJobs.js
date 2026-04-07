const cron = require('node-cron');
const logger = require('../utils/logger');
const syncJobsQueries = require('../db/queries/syncJobs');
const lagoCustomerService = require('../services/lagoCustomer');
const lagoSubscriptionService = require('../services/lagoSubscription');
const lagoEventsService = require('../services/lagoEvents');
const customerQueries = require('../db/queries/customers');
const subscriptionQueries = require('../db/queries/subscriptions');

/**
 * Retry pending sync jobs
 */
async function retryPendingJobs() {
  try {
    logger.debug('Running sync job retry scheduler');

    const jobs = await syncJobsQueries.getPendingJobs();

    if (jobs.length === 0) {
      logger.debug('No pending sync jobs to retry');
      return;
    }

    logger.info(`Found ${jobs.length} pending sync jobs to retry`);

    for (const job of jobs) {
      try {
        await retryJob(job);
      } catch (error) {
        logger.error('Failed to retry sync job', {
          job_id: job.id,
          job_type: job.job_type,
          error: error.message,
        });
      }
    }
  } catch (error) {
    logger.error('Error in sync job retry scheduler', { error: error.message });
  }
}

/**
 * Retry a single sync job
 */
async function retryJob(job) {
  logger.info('Retrying sync job', {
    job_id: job.id,
    job_type: job.job_type,
    attempt: job.attempts + 1,
  });

  try {
    switch (job.job_type) {
      case 'create_customer':
        await retryCreateCustomer(job);
        break;

      case 'push_event':
        await retryPushEvent(job);
        break;

      case 'create_subscription':
        await retryCreateSubscription(job);
        break;

      default:
        logger.warn('Unknown job type', { job_type: job.job_type });
        await syncJobsQueries.markJobFailed(job.id, 'Unknown job type');
        return;
    }

    // Mark as successful
    await syncJobsQueries.markJobSuccess(job.id);
    logger.info('Sync job completed successfully', { job_id: job.id });
  } catch (error) {
    // Mark as failed (increments attempts)
    await syncJobsQueries.markJobFailed(job.id, error.message);
    logger.warn('Sync job failed', {
      job_id: job.id,
      attempts: job.attempts + 1,
      max_attempts: job.max_attempts,
      error: error.message,
    });
  }
}

/**
 * Retry create customer job
 */
async function retryCreateCustomer(job) {
  const { internal_id, org_id, name, email, plan_code } = job.payload;

  // Check if customer already exists
  const existing = await customerQueries.findByInternalId(internal_id);
  if (existing) {
    logger.info('Customer already exists, skipping', { internal_id });
    return;
  }

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
  await subscriptionQueries.createSubscription({
    customer_id: dbCustomer.id,
    lago_sub_id: lagoSubscription.lago_id,
    plan_code,
    status: lagoSubscription.status,
    started_at: new Date(),
  });

  logger.info('Customer created successfully from sync job', { internal_id });
}

/**
 * Retry push event job
 */
async function retryPushEvent(job) {
  const { internal_customer_id, event_code, properties } = job.payload;

  // Push event to Lago
  await lagoEventsService.pushEvent({
    external_customer_id: internal_customer_id,
    code: event_code,
    properties: properties || {},
  });

  logger.info('Event pushed successfully from sync job', {
    internal_customer_id,
    event_code,
  });
}

/**
 * Retry create subscription job
 */
async function retryCreateSubscription(job) {
  const { internal_customer_id, plan_code, billing_time } = job.payload;

  // Lookup customer
  const customer = await customerQueries.findByInternalId(internal_customer_id);

  if (!customer) {
    throw new Error(`Customer not found: ${internal_customer_id}`);
  }

  // Create subscription in Lago
  const lagoSubscription = await lagoSubscriptionService.createSubscription({
    external_customer_id: internal_customer_id,
    plan_code,
    billing_time: billing_time || 'anniversary',
  });

  // Insert into database
  await subscriptionQueries.createSubscription({
    customer_id: customer.id,
    lago_sub_id: lagoSubscription.lago_id,
    plan_code,
    status: lagoSubscription.status,
    started_at: new Date(),
  });

  logger.info('Subscription created successfully from sync job', {
    internal_customer_id,
    plan_code,
  });
}

/**
 * Start the cron job scheduler
 */
function startScheduler() {
  // Run every 5 minutes
  const task = cron.schedule('*/5 * * * *', retryPendingJobs);

  logger.info('Sync job retry scheduler started (runs every 5 minutes)');

  return task;
}

module.exports = {
  startScheduler,
  retryPendingJobs,
};
