const { query } = require('../../config/db');

/**
 * Create sync job
 */
async function createSyncJob({ job_type, payload, max_attempts = 3 }) {
  const next_retry_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  
  const sql = `
    INSERT INTO sync_jobs (job_type, payload, status, max_attempts, next_retry_at)
    VALUES ($1, $2, 'pending', $3, $4)
    RETURNING *
  `;
  const result = await query(sql, [job_type, payload, max_attempts, next_retry_at]);
  return result.rows[0];
}

/**
 * Get pending sync jobs ready for retry
 */
async function getPendingJobs() {
  const sql = `
    SELECT * FROM sync_jobs 
    WHERE status = 'pending' 
      AND attempts < max_attempts
      AND (next_retry_at IS NULL OR next_retry_at <= NOW())
    ORDER BY created_at ASC
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Mark sync job as successful
 */
async function markJobSuccess(id) {
  const sql = `
    UPDATE sync_jobs
    SET status = 'done', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
}

/**
 * Mark sync job as failed (increment attempts)
 */
async function markJobFailed(id, error_message) {
  const next_retry_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  
  const sql = `
    UPDATE sync_jobs
    SET attempts = attempts + 1,
        last_error = $2,
        next_retry_at = $3,
        status = CASE 
          WHEN attempts + 1 >= max_attempts THEN 'failed'
          ELSE 'pending'
        END,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [id, error_message, next_retry_at]);
  return result.rows[0];
}

/**
 * Get sync job statistics
 */
async function getJobStats() {
  const sql = `
    SELECT 
      status,
      COUNT(*) as count
    FROM sync_jobs
    GROUP BY status
  `;
  const result = await query(sql);
  return result.rows;
}

module.exports = {
  createSyncJob,
  getPendingJobs,
  markJobSuccess,
  markJobFailed,
  getJobStats,
};
