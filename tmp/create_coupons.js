require('dotenv').config();

(async () => {
  const base = 'http://localhost:3000';
  const token = process.env.LAGO_API_KEY || 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const coupons = [
    {
      id: 'coupon-001',
      body: {
        coupon: {
          name: 'Welcome Discount',
          code: 'WELCOME10',
          coupon_type: 'fixed_amount',
          amount_cents: 1000,
          amount_currency: 'USD',
          reusable: true,
          frequency: 'once',
          expiration: 'no_expiration',
          applies_to: {
            plan_codes: ['starter', 'pro'],
            billable_metric_codes: []
          }
        }
      }
    }
  ];

  for (const c of coupons) {
    try {
      console.log(`Creating ${c.id}...`);
      const res = await fetch(`${base}/api/v1/coupons`, { method: 'POST', headers, body: JSON.stringify(c.body) });
      const text = await res.text();
      console.log(`Coupon ${c.id} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Coupon ${c.id} create error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All coupon creation completed.');
})();