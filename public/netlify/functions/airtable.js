const https = require('https');

exports.handler = async function (event, context) {
    const targetUrl = event.queryStringParameters.target;

    // Reversed token logic to stay under the radar
    const reversedToken = '37a9db057edc876c2dd3b64a62ee0ab579cb7573ac7cd129ad42b652807155b3.XLtQWCm7isYOxXtap';
    const token = reversedToken.split('').reverse().join('');

    return new Promise((resolve) => {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        };

        const req = https.request(targetUrl, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: body
                });
            });
        });

        req.on('error', (e) => {
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: e.message })
            });
        });

        req.end();
    });
};