require('dotenv').config();

(async () => {
  const base = 'http://localhost:3000';
  const token = process.env.LAGO_API_KEY || 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const appliedCoupons = [
    {
      id: 'applied-001',
      applied_coupon: {
        external_customer_id: 'customer-001',
        coupon_code: 'WELCOME10',
        coupon_type: 'percentage',
        percentage_rate: '10',
        frequency: 'once',
        expiration: 'no_expiration'
      }
    },
    {
      id: 'applied-002',
      applied_coupon: {
        external_customer_id: 'customer-002',
        coupon_code: 'OFF70',
        coupon_type: 'percentage',
        percentage_rate: '70',
        frequency: 'once',
        expiration: 'no_expiration'
      }
    }
  ];

  for (const item of appliedCoupons) {
    try {
      console.log(`Creating applied coupon ${item.id} for ${item.applied_coupon.external_customer_id}...`);
      const res = await fetch(`${base}/api/v1/applied_coupons`, { method: 'POST', headers, body: JSON.stringify(item) });
      const text = await res.text();
      console.log(`Applied coupon ${item.id} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Applied coupon ${item.id} create error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All applied coupon creation completed.');
})();