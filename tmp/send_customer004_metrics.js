(async () => {
  const fetch = global.fetch || (await import('node-fetch')).default;
  const url = 'http://localhost:3000/api/v1/events';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';

  const events = [
    { code: 'input_tokens', properties: { input_tokens: 500000 } },
    { code: 'output_tokens', properties: { output_tokens: 250000 } },
    { code: 'api_calls', properties: { api_calls: 1 } },
    { code: 'gpu_seconds', properties: { gpu_seconds: 3600 } },
    { code: 'storage_gb', properties: { storage_gb: 500 } },
  ];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const payload = {
      event: {
        transaction_id: `tx-${Math.random().toString(36).slice(2,10)}`,
        external_customer_id: 'customer-004',
        code: e.code,
        timestamp: Math.floor(Date.now() / 1000),
        properties: e.properties,
      }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.log(`Event ${i+1} (${e.code}) -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch (err) { console.log(text); }
    } catch (err) {
      console.error(`Event ${i+1} failed:`, err.message || err);
    }

    await new Promise(r => setTimeout(r, 800));
  }
})();
