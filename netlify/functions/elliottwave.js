// netlify/functions/elliottwave.js
// Sends OHLCV data to Gemini for Elliott Wave analysis

exports.handler = async function(event) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  const { ticker, timeframe, candles } = body;
  if (!candles || !candles.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No candles provided' }) };
  }

  // Format candles for Gemini — just OHLC, no need for full decimals
  const priceTable = candles.map((c, i) =>
    `${i}\t${c.date}\t${c.open.toFixed(4)}\t${c.high.toFixed(4)}\t${c.low.toFixed(4)}\t${c.close.toFixed(4)}`
  ).join('\n');

  const prompt = `You are an expert technical analyst specializing in Elliott Wave Theory with 20 years of experience.

Analyze the following OHLC price data for ${ticker} (${timeframe} timeframe) and identify the Elliott Wave structure.

Price data (index, date, open, high, low, close):
${priceTable}

Your task:
1. Identify the primary Elliott Wave count (impulse waves 1-2-3-4-5 and/or corrective waves A-B-C)
2. Return the wave turning points as JSON
3. Write a detailed analysis explaining the wave structure, current wave position, and what to expect next

Return ONLY this JSON format, no markdown, no backticks:
{
  "waves": [
    {"label": "1", "index": <candle_index_number>, "price": <price_at_turning_point>},
    {"label": "2", "index": <candle_index_number>, "price": <price_at_turning_point>},
    {"label": "3", "index": <candle_index_number>, "price": <price_at_turning_point>},
    {"label": "4", "index": <candle_index_number>, "price": <price_at_turning_point>},
    {"label": "5", "index": <candle_index_number>, "price": <price_at_turning_point>}
  ],
  "analysis": "<3-5 paragraphs of professional Elliott Wave analysis. Cover: current wave position, Fibonacci relationships between waves, key price targets for the next wave, invalidation levels, and overall trend bias. Use specific price levels from the data. Professional tone, no fluff.>"
}

Rules:
- Use actual candle index numbers (0 to ${candles.length - 1})
- Use actual prices from the data at those turning points
- Identify the most recent and clear wave structure visible
- If a full 5-wave impulse is complete, identify the A-B-C correction
- Include wave labels: 1, 2, 3, 4, 5 OR A, B, C OR both if applicable`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        })
      }
    );

    const geminiData = await geminiRes.json();
    const raw = (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    const clean = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try { parsed = JSON.parse(clean); }
    catch(e) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Gemini returned unparseable response', raw: clean.substring(0, 200) })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(parsed)
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini fetch failed: ' + e.message })
    };
  }
};
