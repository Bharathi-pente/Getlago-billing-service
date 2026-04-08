require('dotenv').config();

(async () => {
  const base = 'http://localhost:3000';
  const token = process.env.LAGO_API_KEY || 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const addOns = [
    {
      id: 'addon-001',
      body: {
        add_on: {
          name: 'Extra Credits',
          code: 'extra_credits_new',
          description: 'Additional usage credits for customers.',
          amount_cents: 5000,
          amount_currency: 'USD'
        }
      }
    }
  ];

  for (const addon of addOns) {
    try {
      console.log(`Creating add-on: ${addon.body.add_on.name} (${addon.body.add_on.code})...`);
      const res = await fetch(`${base}/api/v1/add_ons`, { method: 'POST', headers, body: JSON.stringify(addon.body) });
      const text = await res.text();
      console.log(`Add-on ${addon.body.add_on.code} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Add-on ${addon.id} create error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All add-on creation completed.');
})();