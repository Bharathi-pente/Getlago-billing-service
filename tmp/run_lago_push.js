require('dotenv').config();
const lagoEvents = require('../src/services/lagoEvents');

(async () => {
  try {
    const res = await lagoEvents.pushEvent({
      external_customer_id: 'customer-test-002',
      code: 'input_tokens',
      properties: { input_tokens: 2000 }
    });
    console.log('Lago push result:', res);
  } catch (err) {
    console.error('Lago push failed:', err && err.message ? err.message : err);
    if (err && err.response) {
      console.error('Response data:', err.response.data || err.response);
    }
    process.exit(1);
  }
})();
