const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const organizationsService = require('../services/lagoOrganizations');

const router = express.Router();

/**
 * GET /api/v1/organizations
 * Get organization details
 */
router.get('/', asyncHandler(async (req, res) => {
  const result = await organizationsService.getOrganization();

  return res.json({ success: true, data: result });
}));

/**
 * PUT /api/v1/organizations
 * Update organization details
 */
router.put('/', asyncHandler(async (req, res) => {
  const { organization } = req.body;

  if (!organization) {
    return res.status(400).json({ success: false, error: 'Request body must contain an "organization" object.' });
  }

  const result = await organizationsService.updateOrganization(organization);

  return res.json({ success: true, data: result });
}));

module.exports = router;