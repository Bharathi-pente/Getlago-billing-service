require('dotenv').config();
const { query } = require('../src/config/db');

(async () => {
  try {
    const res = await query('SELECT * FROM sync_jobs ORDER BY created_at DESC LIMIT 20');
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
