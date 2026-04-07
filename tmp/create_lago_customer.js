 (async () => {
  try {
    const url = 'http://localhost:3000/api/v1/customers';
    const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
    const body = {
      customer: {
        external_id: 'customer-002',
        name: 'Tech Solutions Ltd',
        email: 'billing@techsolutions.com',
        customer_type: 'company',
        currency: 'USD',
        timezone: 'Asia/Kolkata',
        billing_configuration: { payment_provider: null },
        metadata: []
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    console.log('Status:', res.status);
    try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exit(1);
  }
})();
