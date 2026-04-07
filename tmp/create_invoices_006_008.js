(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const invoices = [
    {
      invoice: {
        external_customer_id: 'customer-006',
        currency: 'USD',
        fees: [{ add_on_code: 'setup_fee' }],
        lines: [
          { description: 'One-time setup', quantity: 1, unit_amount: 10000 }
        ]
      }
    },
    {
      invoice: {
        external_customer_id: 'customer-007',
        currency: 'USD',
        fees: [],
        lines: [
          { description: 'Monthly service (prorated)', quantity: 1, unit_amount: 5000 }
        ]
      }
    },
    {
      invoice: {
        external_customer_id: 'customer-008',
        currency: 'USD',
        fees: [{ add_on_code: 'extra_credits' }],
        lines: [
          { description: 'Consulting hours', quantity: 2, unit_amount: 7500 }
        ]
      }
    }
  ];

  for (let i = 0; i < invoices.length; i++) {
    const payload = invoices[i];
    try {
      console.log(`Creating invoice ${i + 1} for ${payload.invoice.external_customer_id}...`);
      const res = await fetch(`${base}/api/v1/invoices`, { method: 'POST', headers, body: JSON.stringify(payload) });
      const text = await res.text();
      console.log(`Invoice ${i + 1} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
    } catch (err) {
      console.error(`Invoice ${i + 1} error:`, err.message || err);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('Invoice creation script finished.');
})();
