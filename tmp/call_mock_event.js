 (async () => {
  try {
    const payload = {
      event: {
        transaction_id: 'tx-test-123',
        external_customer_id: 'customer-test-002',
        code: 'input_tokens',
        timestamp: Math.floor(Date.now()/1000),
        properties: { input_tokens: 2000 }
      }
    };

    const res = await fetch('http://localhost:3001/api/v1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Status:', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
