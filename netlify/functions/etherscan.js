// netlify/functions/etherscan.js
// Proxies Etherscan API calls server-side — key never exposed to browser

exports.handler = async function(event) {
  const key = process.env.ETHERSCAN_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Etherscan API key not configured' })
    };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || '';
  const contract = params.contract || '';
  const address = params.address || '';
  const page = params.page || '1';
  const offset = params.offset || '20';
  const sort = params.sort || 'desc';

  let url = '';

  if (action === 'tokenholderlist') {
    url = `https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholderlist&contractaddress=${contract}&page=${page}&offset=${offset}&apikey=${key}`;
  } else if (action === 'tokensupply') {
    url = `https://api.etherscan.io/v2/api?chainid=1&module=stats&action=tokensupply&contractaddress=${contract}&apikey=${key}`;
  } else if (action === 'tokentx') {
    url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${contract}&page=${page}&offset=50&sort=${sort}&apikey=${key}`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown action: ' + action })
    };
  }

  try {
    const response = await fetch(url);
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
      body: JSON.stringify({ error: 'Etherscan fetch failed: ' + e.message })
    };
  }
};
