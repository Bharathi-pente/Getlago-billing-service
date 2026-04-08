(async () => {
  const base = 'http://localhost:3000';
  const token = 'baf72dc9-b89e-4e15-bbb9-72703810f001';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    console.log('Fetching existing coupons...');
    const res = await fetch(`${base}/api/v1/coupons`, { method: 'GET', headers });
    const text = await res.text();
    console.log(`Coupons fetch -> status=${res.status}`);
    console.log('Raw response:', text);

    try {
      const data = JSON.parse(text);
      if (data.success) {
        console.log(`Found ${data.data.length} coupons:`);
        data.data.forEach((coupon, index) => {
          console.log(`${index + 1}. ${coupon.name} (${coupon.code}) - ${coupon.coupon_type}`);
        });
      } else {
        console.log('Error:', data.error);
      }
    } catch (parseErr) {
      console.log('Failed to parse JSON:', parseErr.message);
    }
  } catch (err) {
    console.error('Error fetching coupons:', err.message || err);
  }
})();