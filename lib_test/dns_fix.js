const dns = require('dns');
dns.resolve4('quote-api.jup.ag', (err, addresses) => {
  if (err) console.error('DNS Lookup Failed:', err);
  else console.log('Addresses:', addresses);
});
