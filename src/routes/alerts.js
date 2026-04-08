const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const alertsService = require('../services/lagoAlerts');

const router = express.Router();

/**
 * POST /api/v1/alerts
 * Create a new alert
 */
router.post('/', asyncHandler(async (req, res) => {
  const { alert } = req.body;

  if (!alert) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain an "alert" object.',
    });
  }

  const result = await alertsService.createAlert(alert);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/alerts
 * List all alerts
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await alertsService.listAlerts(filters);

  return res.json({ success: true, data: result.alerts, meta: result.meta });
}));

/**
 * GET /api/v1/alerts/:id
 * Retrieve a single alert by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const alert = await alertsService.getAlert(id);

  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found.' });
  }

  return res.json({ success: true, data: alert });
}));

/**
 * PUT /api/v1/alerts/:id
 * Update an alert
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { alert } = req.body;

  if (!alert) {
    return res.status(400).json({ success: false, error: 'Request body must contain an "alert" object.' });
  }

  const result = await alertsService.updateAlert(id, alert);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/alerts/:id
 * Delete an alert
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await alertsService.deleteAlert(id);

  return res.json({ success: true, message: `Alert "${id}" deleted.` });
}));

module.exports = router;