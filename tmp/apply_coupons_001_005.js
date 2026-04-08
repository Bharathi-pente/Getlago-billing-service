(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const couponApplications = [
    {
      id: 'coupon-001',
      body: {
        internal_customer_id: 'customer-001',
        coupon_code: 'WELCOME10'
      }
    },
    {
      id: 'coupon-002',
      body: {
        internal_customer_id: 'customer-002',
        coupon_code: 'DISCOUNT20'
      }
    },
    {
      id: 'coupon-003',
      body: {
        internal_customer_id: 'customer-003',
        coupon_code: 'STARTUP50'
      }
    },
    {
      id: 'coupon-004',
      body: {
        internal_customer_id: 'customer-004',
        coupon_code: 'LOYALTY15'
      }
    },
    {
      id: 'coupon-005',
      body: {
        internal_customer_id: 'customer-005',
        coupon_code: 'BETA25'
      }
    }
  ];

  for (const c of couponApplications) {
    try {
      console.log(`Applying coupon ${c.id} to ${c.body.internal_customer_id}...`);
      const res = await fetch(`${base}/api/v1/coupons/apply`, { method: 'POST', headers, body: JSON.stringify(c.body) });
      const text = await res.text();
      console.log(`Coupon ${c.id} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Coupon ${c.id} apply error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All coupon applications completed.');
})();