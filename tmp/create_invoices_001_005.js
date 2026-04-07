(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const invoices = [
    { invoice: { external_customer_id: 'test-customer-001', currency: 'USD', fees: [{ add_on_code: 'setup_fee' }] } },
    { invoice: { external_customer_id: 'customer-002', currency: 'USD', fees: [{ add_on_code: 'setup_fee' }] } },
    { invoice: { external_customer_id: 'customer-003', currency: 'USD', fees: [{ add_on_code: 'setup_fee' }] } },
    { invoice: { external_customer_id: 'customer-004', currency: 'USD', fees: [{ add_on_code: 'extra_credits' }] } },
    { invoice: { external_customer_id: 'customer-005', currency: 'USD', fees: [{ add_on_code: 'setup_fee' }] } }
  ];

  for (let i = 0; i < invoices.length; i++) {
    const payload = invoices[i];
    try {
      console.log(`Creating invoice ${i+1} for ${payload.invoice.external_customer_id}...`);
      const res = await fetch(`${base}/api/v1/invoices`, { method: 'POST', headers, body: JSON.stringify(payload) });
      const text = await res.text();
      console.log(`Invoice ${i+1} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
    } catch (err) {
      console.error(`Invoice ${i+1} error:`, err.message || err);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('Invoice creation script finished.');
})();