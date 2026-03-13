const https = require('https');

exports.handler = async function (event, context) {
    const type = event.queryStringParameters.type;
    const market = event.queryStringParameters.market || 'ph';
    const baseId = 'app1hHgLzAiJgLB8H';

    // THE FIX: Put your actual, newly generated PAT token right here!
    const token = 'patXxOYsi7mCWQtLX';

    let targetUrl = '';
    if (type === 'macro') {
        // THE FIX: We stop using the dead Table ID and just use the actual Table Name!
        targetUrl = `https://api.airtable.com/v0/${baseId}/Macro%20Report?maxRecords=1`;
    } else {
        const formula = encodeURIComponent(`{Market}='${market}'`);
        targetUrl = `https://api.airtable.com/v0/${baseId}/Quant%20Data?filterByFormula=${formula}`;
    }

    return new Promise((resolve) => {
        const req = https.get(targetUrl, { headers: { 'Authorization': `Bearer ${token}` } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {

                // Formatting magic so premium.html doesn't crash
                if (type === 'macro') {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.records && parsed.records.length > 0) {
                            data = JSON.stringify(parsed.records[0]);
                        }
                    } catch (e) { }
                }

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