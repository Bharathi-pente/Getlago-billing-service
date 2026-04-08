const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const resourcesService = require('../services/lagoResources');

const router = express.Router();

/**
 * POST /api/v1/resources
 * Create a new resource
 */
router.post('/', asyncHandler(async (req, res) => {
  const { resource } = req.body;

  if (!resource) {
    return res.status(400).json({
      success: false,
      error: 'Request body must contain a "resource" object.',
    });
  }

  const result = await resourcesService.createResource(resource);

  return res.status(201).json({ success: true, data: result });
}));

/**
 * GET /api/v1/resources
 * List all resources
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await resourcesService.listResources(filters);

  return res.json({ success: true, data: result.resources, meta: result.meta });
}));

/**
 * GET /api/v1/resources/:id
 * Retrieve a single resource by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await resourcesService.getResource(id);

  if (!resource) {
    return res.status(404).json({ success: false, error: 'Resource not found.' });
  }

  return res.json({ success: true, data: resource });
}));

/**
 * PUT /api/v1/resources/:id
 * Update a resource
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resource } = req.body;

  if (!resource) {
    return res.status(400).json({ success: false, error: 'Request body must contain a "resource" object.' });
  }

  const result = await resourcesService.updateResource(id, resource);

  return res.json({ success: true, data: result });
}));

/**
 * DELETE /api/v1/resources/:id
 * Delete a resource
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await resourcesService.deleteResource(id);

  return res.json({ success: true, message: `Resource "${id}" deleted.` });
}));

module.exports = router;