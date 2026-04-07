(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const clients = [
    {
      id: 'customer-006',
      body: {
        customer: {
          external_id: 'customer-006',
          name: 'Bluebird Labs',
          email: 'admin@bluebirdlabs.com',
          customer_type: 'company',
          currency: 'USD',
          timezone: 'Asia/Kolkata'
        }
      },
      plan: { subscription: { external_customer_id: 'customer-006', plan_code: 'starter', billing_time: 'anniversary' } }
    },
    {
      id: 'customer-007',
      body: {
        customer: {
          external_id: 'customer-007',
          name: 'Greenfield LLC',
          email: 'billing@greenfieldllc.com',
          customer_type: 'company',
          currency: 'USD',
          timezone: 'Asia/Kolkata'
        }
      },
      plan: { subscription: { external_customer_id: 'customer-007', plan_code: 'pro', billing_time: 'anniversary' } }
    },
    {
      id: 'customer-008',
      body: {
        customer: {
          external_id: 'customer-008',
          name: 'Nova Solutions',
          email: 'finance@novasolutions.com',
          customer_type: 'company',
          currency: 'USD',
          timezone: 'Asia/Kolkata'
        }
      },
      plan: { subscription: { external_customer_id: 'customer-008', plan_code: 'enterprise', billing_time: 'anniversary' } }
    }
  ];

  for (const c of clients) {
    try {
      console.log(`Creating ${c.id}...`);
      const res1 = await fetch(`${base}/api/v1/customers`, { method: 'POST', headers, body: JSON.stringify(c.body) });
      const j1 = await res1.text();
      console.log(`Customer ${c.id} -> status=${res1.status}`);
      try { console.log(JSON.parse(j1)); } catch(e){ console.log(j1); }
    } catch (err) {
      console.error(`Customer ${c.id} create error:`, err.message || err);
    }

    await new Promise(r => setTimeout(r, 1000));

    try {
      c.plan.subscription.external_id = `sub-${c.id}-${Date.now()}`;
      console.log(`Assigning plan to ${c.id} (external_id=${c.plan.subscription.external_id})...`);
      const res2 = await fetch(`${base}/api/v1/subscriptions`, { method: 'POST', headers, body: JSON.stringify(c.plan) });
      const j2 = await res2.text();
      console.log(`Subscription ${c.id} -> status=${res2.status}`);
      try { console.log(JSON.parse(j2)); } catch(e){ console.log(j2); }
    } catch (err) {
      console.error(`Subscription ${c.id} error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All done.');
})();
