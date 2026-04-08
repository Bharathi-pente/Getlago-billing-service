require('dotenv').config();

(async () => {
  const base = 'http://localhost:3000';
  const token = process.env.LAGO_API_KEY || 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const billableMetrics = [
    {
      id: 'metric-001',
      body: {
        billable_metric: {
          name: 'Bandwidth Usage',
          code: 'bandwidth_gb',
          description: 'Tracks bandwidth usage in gigabytes',
          aggregation_type: 'sum_agg',
          field_name: 'bandwidth_gb',
          recurring: true
        }
      }
    }
  ];

  for (const metric of billableMetrics) {
    try {
      console.log(`Creating billable metric: ${metric.body.billable_metric.name} (${metric.body.billable_metric.code})...`);
      const res = await fetch(`${base}/api/v1/billable_metrics`, { method: 'POST', headers, body: JSON.stringify(metric.body) });
      const text = await res.text();
      console.log(`Billable metric ${metric.body.billable_metric.code} -> status=${res.status}`);
      try { console.log(JSON.parse(text)); } catch(e){ console.log(text); }
    } catch (err) {
      console.error(`Billable metric ${metric.id} create error:`, err.message || err);
    }

    console.log('---');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All billable metrics creation completed.');
})();