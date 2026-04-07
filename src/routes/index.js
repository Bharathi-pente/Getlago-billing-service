const express = require('express');
const customersRouter = require('./customers');
const subscriptionsRouter = require('./subscriptions');
const eventsRouter = require('./events');
const invoicesRouter = require('./invoices');
const creditsRouter = require('./credits');
const couponsRouter = require('./coupons');
const webhooksRouter = require('./webhooks');

const router = express.Router();

// Mount all route modules
router.use('/customers', customersRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/events', eventsRouter);
router.use('/invoices', invoicesRouter);
router.use('/credits', creditsRouter);
router.use('/coupons', couponsRouter);
router.use('/webhooks', webhooksRouter);

module.exports = router;
