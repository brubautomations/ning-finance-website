// netlify/functions/eodhd.js
// Proxies EODHD API calls server-side — key never exposed to browser

exports.handler = async function(event) {
  const key = process.env.EODHD_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'EODHD_KEY not configured in Netlify environment variables' })
    };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || '';

  let url = '';

  if (action === 'ipo') {
    const from = params.from || '';
    const to   = params.to   || '';
    url = `https://eodhd.com/api/calendar/ipos?api_token=${key}&fmt=json&from=${from}&to=${to}`;

  } else if (action === 'earnings') {
    const symbols = params.symbols || '';
    url = `https://eodhd.com/api/calendar/trends?symbols=${symbols}&api_token=${key}&fmt=json`;

  } else if (action === 'sentiment') {
    const s    = params.s    || '';
    const from = params.from || '';
    const to   = params.to   || '';
    url = `https://eodhd.com/api/sentiments?s=${s}&from=${from}&to=${to}&api_token=${key}&fmt=json`;

  } else if (action === 'search') {
    const q     = params.q     || '';
    const limit = params.limit || '8';
    url = `https://eodhd.com/api/search/${encodeURIComponent(q)}?api_token=${key}&limit=${limit}&fmt=json`;

  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown action: ' + action })
    };
  }

  try {
    const response = await fetch(url);
    const data     = await response.json();
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
      body: JSON.stringify({ error: 'EODHD fetch failed: ' + e.message })
    };
  }
};
