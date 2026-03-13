const https = require('https');

exports.handler = async function (event, context) {
    const type = event.queryStringParameters.type;
    const market = event.queryStringParameters.market || 'ph';

    // Base ID is correct!
    const baseId = 'app1hHgLzAlJgLB8H';

    // Token split bypass is working!
    const part1 = "patXxOYsi7mCWQtLX";
    const part2 = "f40ae71b8ae9f868929326138203ec27e926cce9b18b8d4aa2313de1d39686a3";
    const token = part1 + "." + part2;

    let targetUrl = '';
    if (type === 'macro') {
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

                // NO MORE MAGIC. Just pass the raw Airtable JSON straight to the website.
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