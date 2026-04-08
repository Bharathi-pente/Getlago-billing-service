(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer billing_internal_secret_key_2024',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        internal_customer_id: 'customer-test-002',
        event_code: 'input_tokens',
        properties: { input_tokens: 2000 }
      })
    });

    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Request failed:', e);
    process.exit(1);
  }
})();
