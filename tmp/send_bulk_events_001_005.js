(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const rand = () => Math.random().toString(36).slice(2,9);
  const now = () => Math.floor(Date.now()/1000);

  const batches = [
    // Customer 001
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'test-customer-001', code: 'input_tokens', timestamp: now(), properties: { input_tokens: 450000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'test-customer-001', code: 'output_tokens', timestamp: now(), properties: { output_tokens: 120000 } } },
    // Customer 002
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-002', code: 'input_tokens', timestamp: now(), properties: { input_tokens: 380000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-002', code: 'output_tokens', timestamp: now(), properties: { output_tokens: 95000 } } },
    // Customer 003
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-003', code: 'input_tokens', timestamp: now(), properties: { input_tokens: 85000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-003', code: 'api_calls', timestamp: now(), properties: { api_calls: 1 } } },
    // Customer 004
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-004', code: 'input_tokens', timestamp: now(), properties: { input_tokens: 1200000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-004', code: 'output_tokens', timestamp: now(), properties: { output_tokens: 600000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-004', code: 'gpu_seconds', timestamp: now(), properties: { gpu_seconds: 7200 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-004', code: 'storage_gb', timestamp: now(), properties: { storage_gb: 1000 } } },
    // Customer 005
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-005', code: 'input_tokens', timestamp: now(), properties: { input_tokens: 220000 } } },
    { event: { transaction_id: `tx-${rand()}`, external_customer_id: 'customer-005', code: 'output_tokens', timestamp: now(), properties: { output_tokens: 75000 } } }
  ];

  for (let i = 0; i < batches.length; i++) {
    const payload = batches[i];
    try {
      const res = await fetch(`${base}/api/v1/events`, { method: 'POST', headers, body: JSON.stringify(payload) });
      const text = await res.text();
      console.log(`Event ${i+1} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Event ${i+1} error:`, err.message || err);
    }
    // small delay
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All events sent.');
})();