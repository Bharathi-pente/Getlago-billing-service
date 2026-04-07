const { query } = require('../../config/db');

/**
 * Create customer mapping in database
 */
async function createCustomer({ internal_id, lago_id, org_id, email, name, plan_code }) {
  const sql = `
    INSERT INTO customer_lago_map (internal_id, lago_id, org_id, email, name, plan_code, synced_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  const result = await query(sql, [internal_id, lago_id, org_id, email, name, plan_code]);
  return result.rows[0];
}

/**
 * Find customer by internal ID
 */
async function findByInternalId(internal_id) {
  const sql = 'SELECT * FROM customer_lago_map WHERE internal_id = $1';
  const result = await query(sql, [internal_id]);
  return result.rows[0];
}

/**
 * Find customer by Lago ID
 */
async function findByLagoId(lago_id) {
  const sql = 'SELECT * FROM customer_lago_map WHERE lago_id = $1';
  const result = await query(sql, [lago_id]);
  return result.rows[0];
}

/**
 * Update customer mapping
 */
async function updateCustomer(internal_id, updates) {
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
  values.push(internal_id);

  const sql = `
    UPDATE customer_lago_map
    SET ${fields.join(', ')}
    WHERE internal_id = $${paramCount}
    RETURNING *
  `;

  const result = await query(sql, values);
  return result.rows[0];
}

/**
 * Delete customer mapping
 */
async function deleteCustomer(internal_id) {
  const sql = 'DELETE FROM customer_lago_map WHERE internal_id = $1 RETURNING *';
  const result = await query(sql, [internal_id]);
  return result.rows[0];
}

module.exports = {
  createCustomer,
  findByInternalId,
  findByLagoId,
  updateCustomer,
  deleteCustomer,
};
