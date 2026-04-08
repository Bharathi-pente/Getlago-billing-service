const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const auditLogsService = require('../services/lagoAuditLogs');

const router = express.Router();

/**
 * GET /api/v1/audit_logs
 * List all audit logs
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page, 10) || 1,
    per_page: parseInt(req.query.per_page, 10) || 20,
  };

  const result = await auditLogsService.listAuditLogs(filters);

  return res.json({ success: true, data: result.audit_logs, meta: result.meta });
}));

/**
 * GET /api/v1/audit_logs/:id
 * Retrieve a single audit log by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const auditLog = await auditLogsService.getAuditLog(id);

  if (!auditLog) {
    return res.status(404).json({ success: false, error: 'Audit log not found.' });
  }

  return res.json({ success: true, data: auditLog });
}));

module.exports = router;