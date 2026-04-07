(async () => {
  const fetch = global.fetch || (await import('node-fetch')).default;
  const url = 'http://localhost:3000/api/v1/events';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const amounts = [80000, 150000, 250000];

  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];
    const transaction_id = `tx-${Math.random().toString(36).slice(2,10)}`;
    const timestamp = Math.floor(Date.now() / 1000);

    const body = {
      event: {
        transaction_id,
        external_customer_id: 'customer-002',
        code: 'input_tokens',
        timestamp,
        properties: { input_tokens: amount }
      }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      console.log(`Event ${i+1} -> amount=${amount} status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
    } catch (err) {
      console.error(`Event ${i+1} failed:`, err.message || err);
    }

    await new Promise(r => setTimeout(r, 800));
  }
})();
