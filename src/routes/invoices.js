const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const lagoInvoiceService = require('../services/lagoInvoice');
const customerQueries = require('../db/queries/customers');

const router = express.Router();

/**
 * GET /api/v1/invoices
 * Get invoices with filters
 */
router.get('/', asyncHandler(async (req, res) => {
  const { internal_customer_id, status, page, per_page } = req.query;

  const filters = {
    page: parseInt(page, 10) || 1,
    per_page: parseInt(per_page, 10) || 20,
  };

  // Map internal_customer_id to external_customer_id for Lago
  if (internal_customer_id) {
    const customer = await customerQueries.findByInternalId(internal_customer_id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
        code: 404,
      });
    }

    filters.external_customer_id = internal_customer_id;
  }

  if (status) {
    filters.status = status;
  }

  // Fetch invoices from Lago
  const result = await lagoInvoiceService.getInvoices(filters);

  res.json({
    success: true,
    data: result.invoices,
    meta: result.meta,
  });
}));

/**
 * GET /api/v1/invoices/:invoiceId
 * Get invoice details
 */
router.get('/:invoiceId', asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  // Fetch invoice from Lago
  const invoice = await lagoInvoiceService.getInvoice(invoiceId);

  res.json({
    success: true,
    data: invoice,
  });
}));

/**
 * POST /api/v1/invoices/:invoiceId/retry
 * Retry payment for failed invoice
 */
router.post('/:invoiceId/retry', asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  // Retry payment in Lago
  const result = await lagoInvoiceService.retryPayment(invoiceId);

  res.json({
    success: true,
    data: result,
  });
}));

module.exports = router;
