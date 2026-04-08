(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer billing_internal_secret_key_2024',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        internal_id: 'customer-test-002',
        org_id: 'org-001',
        name: 'Test Company',
        email: 'test@company.com',
        plan_code: 'pro'
      })
    });

    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Request failed:', e);
    process.exit(1);
  }
})();
