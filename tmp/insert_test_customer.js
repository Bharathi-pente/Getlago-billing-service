require('dotenv').config();
const { query } = require('../src/config/db');
const logger = require('../src/utils/logger');

(async () => {
  try {
    const sql = `
      INSERT INTO customer_lago_map (internal_id, lago_id, org_id, email, name, plan_code, synced_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (internal_id) DO UPDATE SET lago_id = EXCLUDED.lago_id, org_id = EXCLUDED.org_id, email = EXCLUDED.email, name = EXCLUDED.name, plan_code = EXCLUDED.plan_code, updated_at = NOW()
      RETURNING *
    `;

    const values = [
      'customer-test-002',
      'lago_cust_manual_001',
      'org-001',
      'test@company.com',
      'Test Company',
      'pro'
    ];

    const res = await query(sql, values);
    logger.info('Inserted/updated test customer:', res.rows[0]);
    console.log(JSON.stringify(res.rows[0], null, 2));
    process.exit(0);
  } catch (err) {
    logger.error('Failed to insert test customer:', err);
    console.error(err);
    process.exit(1);
  }
})();
