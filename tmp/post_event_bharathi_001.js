(async () => {
  const url = 'http://localhost:3001/api/v1/events';
  const headers = { 'Authorization': 'Bearer baf72dc9-b89e-4e15-bbb9-72703810f001', 'Content-Type': 'application/json' };
  const payload = {
    event: {
      transaction_id: 'txn_api_bharathi_001',
      external_customer_id: 'test-customer-001',
      code: 'api_calls',
      timestamp: 1743900000,
      properties: { value: '10' }
    }
  };

  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    const text = await res.text();
    console.log('status=', res.status);
    try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
  } catch (err) {
    console.error('request error:', err);
  }
})();
