// netlify/functions/blockchain.js
// Proxies blockchain.info calls server-side — fixes browser CORS restrictions

exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const action = params.action || '';

  let url = '';

  if (action === 'richlist') {
    url = 'https://blockchain.info/richlist?format=json';
  } else if (action === 'mempool') {
    url = 'https://blockchain.info/unconfirmed-transactions?format=json&limit=50';
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown action: ' + action })
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NingFinance/1.0)'
      }
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'blockchain.info fetch failed: ' + e.message })
    };
  }
};
