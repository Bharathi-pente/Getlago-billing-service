const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

app.post('/api/v1/customers', (req, res) => {
  const incoming = req.body.customer || req.body;
  const lago_id = `lago_cust_${uuidv4()}`;
  const external_id = incoming.external_id || incoming.external_customer_id || incoming.external_id;

  console.log('[LAGO MOCK] Create customer', { external_id });

  res.status(201).json({
    lago_id,
    external_id,
    name: incoming.name || null,
    email: incoming.email || null,
  });
});

app.post('/api/v1/subscriptions', (req, res) => {
  const data = req.body.subscription || req.body;
  const lago_id = `lago_sub_${uuidv4()}`;
  console.log('[LAGO MOCK] Create subscription', { external_customer_id: data.external_customer_id, plan_code: data.plan_code });
  res.status(201).json({ lago_id, status: 'active', plan_code: data.plan_code });
});

app.post('/api/v1/events', (req, res) => {
  const evt = req.body.event || req.body;
  console.log('[LAGO MOCK] Event received', evt);
  res.status(201).json({ success: true, transaction_id: evt.transaction_id || uuidv4() });
});

app.post('/api/v1/events/batch', (req, res) => {
  const events = req.body.events || [];
  console.log('[LAGO MOCK] Batch events received', events.length);
  res.status(201).json({ success: true, count: events.length });
});

app.get('/api/v1/customers/:external_id', (req, res) => {
  const external_id = req.params.external_id;
  console.log('[LAGO MOCK] Get customer', external_id);
  res.json({ lago_id: `lago_cust_${uuidv4()}`, external_id, name: 'Mock Name', email: 'mock@example.com' });
});

app.post('/api/v1/invoices/:invoice_id/retry', (req, res) => {
  console.log('[LAGO MOCK] Retry invoice', req.params.invoice_id);
  res.json({ success: true });
});

app.listen(3001, () => console.log('[LAGO MOCK] Listening on http://localhost:3001'));
