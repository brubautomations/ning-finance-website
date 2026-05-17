// netlify/functions/twelvedata.js
// Fetches OHLCV candle data from Twelve Data API

exports.handler = async function(event) {
  const key = process.env.TWELVE_DATA_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'TWELVE_DATA_KEY not configured' }) };
  }

  const params   = event.queryStringParameters || {};
  const ticker   = params.ticker   || 'BTC/USD';
  const timeframe = params.timeframe || '1month';

  // Map timeframe to Twelve Data interval + outputsize
  const TF_MAP = {
    '1week':  { interval: '1day',  outputsize: 7   },
    '1month': { interval: '1day',  outputsize: 30  },
    '3month': { interval: '1day',  outputsize: 90  },
    '6month': { interval: '1week', outputsize: 26  },
    '1year':  { interval: '1week', outputsize: 52  },
  };
  const tf = TF_MAP[timeframe] || TF_MAP['1month'];

  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(ticker)}&interval=${tf.interval}&outputsize=${tf.outputsize}&apikey=${key}&format=JSON`;

  try {
    const response = await fetch(url);
    const data     = await response.json();

    if (data.status === 'error' || !data.values) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.message || 'No data returned for this ticker' })
      };
    }

    // Twelve Data returns newest first — reverse to oldest first for charting
    const candles = data.values.reverse().map(v => ({
      date:   v.datetime,
      open:   parseFloat(v.open),
      high:   parseFloat(v.high),
      low:    parseFloat(v.low),
      close:  parseFloat(v.close),
      volume: parseFloat(v.volume || 0),
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ candles, ticker, timeframe })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twelve Data fetch failed: ' + e.message })
    };
  }
};
