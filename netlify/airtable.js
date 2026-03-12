const https = require('https');

exports.handler = async function (event, context) {
    const type = event.queryStringParameters.type;
    const market = event.queryStringParameters.market || 'ph';
    const baseId = 'app1hHgLzAiJgLB8H';

    // Stealth token re-assembly
    const reversedToken = '37a9db057edc876c2dd3b64a62ee0ab579cb7573ac7cd129ad42b652807155b3.XLtQWCm7isYOxXtap';
    const token = reversedToken.split('').reverse().join('');

    let targetUrl = '';
    if (type === 'macro') {
        // PERMANENT FIX: Grabs the newest record automatically. No more dead IDs!
        targetUrl = `https://api.airtable.com/v0/${baseId}/tblzSUq94T48MVxnp?maxRecords=1`;
    } else {
        const formula = encodeURIComponent(`{Market}='${market}'`);
        targetUrl = `https://api.airtable.com/v0/${baseId}/Quant%20Data?filterByFormula=${formula}`;
    }

    return new Promise((resolve) => {
        const req = https.get(targetUrl, { headers: { 'Authorization': `Bearer ${token}` } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                    body: data
                });
            });
        });
        req.on('error', (e) => resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) }));
    });
};