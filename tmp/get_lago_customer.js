(async () => {
  const urls = ['http://localhost:3000', 'http://localhost:3001'];
  const headers = { Authorization: 'Bearer baf72dc9-b89e-4e15-bbb9-72703810f001' };

  for (const base of urls) {
    const url = `${base}/api/v1/customers/test-customer-001`;
    try {
      console.log(`\nRequesting ${url}`);
      const res = await fetch(url, { method: 'GET', headers });
      const text = await res.text();
      console.log(`Status: ${res.status}`);
      try { console.log(JSON.parse(text)); } catch (e) { console.log(text); }
    } catch (err) {
      console.error(`Error requesting ${url}:`, err.message || err);
    }
  }
})();
