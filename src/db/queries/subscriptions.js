const { query } = require('../../config/db');

/**
 * Create subscription record
 */
async function createSubscription({ customer_id, lago_sub_id, plan_code, status, started_at }) {
  const sql = `
    INSERT INTO subscriptions (customer_id, lago_sub_id, plan_code, status, started_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await query(sql, [customer_id, lago_sub_id, plan_code, status || 'active', started_at]);
  return result.rows[0];
}

/**
 * Find subscription by customer ID
 */
async function findByCustomerId(customer_id) {
  const sql = 'SELECT * FROM subscriptions WHERE customer_id = $1 ORDER BY created_at DESC';
  const result = await query(sql, [customer_id]);
  return result.rows;
}

/**
 * Find active subscription by customer ID
 */
async function findActiveByCustomerId(customer_id) {
  const sql = `
    SELECT * FROM subscriptions 
    WHERE customer_id = $1 AND status = 'active'
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  const result = await query(sql, [customer_id]);
  return result.rows[0];
}

/**
 * Find subscription by Lago subscription ID
 */
async function findByLagoSubId(lago_sub_id) {
  const sql = 'SELECT * FROM subscriptions WHERE lago_sub_id = $1';
  const result = await query(sql, [lago_sub_id]);
  return result.rows[0];
}

/**
 * Update subscription
 */
async function updateSubscription(lago_sub_id, updates) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updates[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(lago_sub_id);

  const sql = `
    UPDATE subscriptions
    SET ${fields.join(', ')}
    WHERE lago_sub_id = $${paramCount}
    RETURNING *
  `;

  const result = await query(sql, values);
  return result.rows[0];
}

/**
 * Update subscription status
 */
async function updateStatus(lago_sub_id, status) {
  const sql = `
    UPDATE subscriptions
    SET status = $1, updated_at = NOW()
    WHERE lago_sub_id = $2
    RETURNING *
  `;
  const result = await query(sql, [status, lago_sub_id]);
  return result.rows[0];
}

module.exports = {
  createSubscription,
  findByCustomerId,
  findActiveByCustomerId,
  findByLagoSubId,
  updateSubscription,
  updateStatus,
};
