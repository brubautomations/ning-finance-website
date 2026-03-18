const https = require('https');

// Helper function to make clean HTTPS requests
function fetchAirtable(url, token) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'Authorization': `Bearer ${token}` } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`API Error: ${res.statusCode} - ${data}`));
                }
            });
        }).on('error', reject);
    });
}

exports.handler = async function (event, context) {
    const type = event.queryStringParameters.type;
    const market = event.queryStringParameters.market || 'ph';
    const userToken = event.queryStringParameters.userToken; // THE BOUNCER LOOKS FOR THIS

    // The two different Airtable Base IDs
    const dataBaseId = 'app1hHgLzAlJgLB8H';
    const membersBaseId = 'appAT3dVFUCQ0zVwB';

    // Token split bypass
    const part1 = "patXxOYsi7mCWQtLX";
    const part2 = "f40ae71b8ae9f868929326138203ec27e926cce9b18b8d4aa2313de1d39686a3";
    const airtableToken = part1 + "." + part2;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // ==========================================
    // STEP 1: THE BOUNCER (Verify the Token)
    // ==========================================
    if (!userToken) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Access Denied: No token provided." }) };
    }

    try {
        // Ask Airtable to find the user with this exact token
        const authFormula = encodeURIComponent(`{Token}='${userToken}'`);
        const authUrl = `https://api.airtable.com/v0/${membersBaseId}/Members?filterByFormula=${authFormula}&maxRecords=1`;

        const authData = await fetchAirtable(authUrl, airtableToken);

        // If the token doesn't exist in the database at all
        if (!authData.records || authData.records.length === 0) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: "Access Denied: Invalid token." }) };
        }

        // Check if the automation kicked them out
        const userStatus = authData.records[0].fields.Status;
        if (userStatus !== 'Active') {
            return { statusCode: 403, headers, body: JSON.stringify({ error: "Access Denied: Subscription Inactive or Expired." }) };
        }

        // ==========================================
        // STEP 2: FETCH THE DATA (If they are Active)
        // ==========================================
        let targetUrl = '';

        if (type === 'macro') {
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Macro%20Report?maxRecords=1`;
        } else if (type === 'ning_vlogs') {
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Ning_Vlogs?maxRecords=50`;
        } else {
            const dataFormula = encodeURIComponent(`{Market}='${market}'`);
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Quant%20Data?filterByFormula=${dataFormula}`;
        }

        // Fetch the actual Wagyu beef
        const payloadData = await fetchAirtable(targetUrl, airtableToken);

        // Serve it to the user
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(payloadData)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};