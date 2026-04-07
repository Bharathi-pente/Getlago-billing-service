require('dotenv').config();
const { query } = require('../src/config/db');

(async () => {
  try {
    const res = await query("UPDATE sync_jobs SET next_retry_at = NOW(), updated_at = NOW() WHERE status = 'pending' AND attempts < max_attempts RETURNING *");
    console.log('Updated rows:', res.rowCount);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
