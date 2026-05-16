// netlify/functions/pexels.js
// Proxies Pexels API calls server-side — key never exposed to browser

exports.handler = async function(event) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PEXELS_API_KEY not configured' })
    };
  }

  const params = event.queryStringParameters || {};
  const query  = params.query || 'finance';
  const perPage = params.per_page || '1';

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': key }
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
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Pexels fetch failed: ' + e.message })
    };
  }
};
