// netlify/functions/moralis.js
// Proxies Moralis API calls server-side — key never exposed to browser

exports.handler = async function(event) {
  const key = process.env.MORALIS_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Moralis API key not configured' })
    };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || '';
  const contract = params.contract || '';
  const chain = params.chain || '0x1'; // Ethereum mainnet default
  const limit = params.limit || '20';
  const cursor = params.cursor || '';

  let url = '';

  if (action === 'tokenowners') {
    url = `https://deep-index.moralis.io/api/v2.2/erc20/${contract}/holders?chain=${chain}&limit=${limit}&order=DESC`;
    if (cursor) url += `&cursor=${cursor}`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown action: ' + action })
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'X-API-Key': key,
        'Accept': 'application/json'
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
      body: JSON.stringify({ error: 'Moralis fetch failed: ' + e.message })
    };
  }
};
