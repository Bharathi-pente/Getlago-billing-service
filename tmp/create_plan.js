require('dotenv').config();

(async () => {
  const base = 'http://localhost:3000';
  const token = process.env.LAGO_API_KEY || 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const plan = {
    plan: {
      name: 'Basic',
      code: 'basic',
      interval: 'monthly',
      pay_in_advance: true,
      amount_cents: 1000, // $10.00
      amount_currency: 'USD',
      description: 'Basic plan for small teams'
    }
  };

  try {
    console.log(`Creating plan: ${plan.plan.name} (${plan.plan.code})...`);
    const res = await fetch(`${base}/api/v1/plans`, { method: 'POST', headers, body: JSON.stringify(plan) });
    const text = await res.text();
    console.log(`Plan ${plan.plan.code} -> status=${res.status}`);
    try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
  } catch (err) {
    console.error(`Plan create error:`, err.message || err);
  }

  console.log('Plan creation completed.');
})();