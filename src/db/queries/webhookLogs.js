const { query } = require('../../config/db');

/**
 * Create webhook log entry
 */
async function createWebhookLog({ lago_event_id, webhook_type, payload, status }) {
  const sql = `
    INSERT INTO webhook_logs (lago_event_id, webhook_type, payload, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await query(sql, [lago_event_id, webhook_type, payload, status || 'received']);
  return result.rows[0];
}

/**
 * Find webhook log by Lago event ID
 */
async function findByLagoEventId(lago_event_id) {
  const sql = 'SELECT * FROM webhook_logs WHERE lago_event_id = $1';
  const result = await query(sql, [lago_event_id]);
  return result.rows[0];
}

/**
 * Update webhook log status
 */
async function updateStatus(lago_event_id, status, error_message = null) {
  const sql = `
    UPDATE webhook_logs
    SET status = $1, processed_at = NOW(), error_message = $2
    WHERE lago_event_id = $3
    RETURNING *
  `;
  const result = await query(sql, [status, error_message, lago_event_id]);
  return result.rows[0];
}

/**
 * Get recent webhook logs
 */
async function getRecentLogs(limit = 100) {
  const sql = `
    SELECT * FROM webhook_logs 
    ORDER BY created_at DESC 
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
}

module.exports = {
  createWebhookLog,
  findByLagoEventId,
  updateStatus,
  getRecentLogs,
};
