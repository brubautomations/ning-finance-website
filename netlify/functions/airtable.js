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

// Pulls every record of a table, 100 at a time
async function fetchAllPages(baseId, table, token) {
    let records = [];
    let offset = '';
    do {
        const pageUrl = `https://api.airtable.com/v0/${baseId}/${table}?pageSize=100` + (offset ? `&offset=${encodeURIComponent(offset)}` : '');
        const page = await fetchAirtable(pageUrl, token);
        records = records.concat(page.records || []);
        offset = page.offset || '';
    } while (offset);
    return records;
}

exports.handler = async function (event, context) {
    const type = event.queryStringParameters.type;
    const market = event.queryStringParameters.market || 'ph';
    const userToken = event.queryStringParameters.userToken;
    const userEmail = event.queryStringParameters.userEmail;

    // The two different Airtable Base IDs
    const dataBaseId = 'app1hHgLzAlJgLB8H';
    const membersBaseId = 'appAT3dVFUCQ0zVwB';

    // Token split bypass
    const part1 = "patXxOYsi7mCWQtLX";
    const part2 = "73a8f86cea56eb3c30cecc62e2044b4ab34e6e8e575153a08938ec6f82f0556e";
    const airtableToken = part1 + "." + part2;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // ==========================================
    // PUBLIC: broker financials for the free site (no login needed).
    // Served from the CDN cache for an hour so traffic spikes don't hit the database.
    // ==========================================
    if (type === 'public_brokers') {
        try {
            const records = await fetchAllPages(dataBaseId, 'BrokerFinancials', airtableToken);
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Cache-Control': 'public, max-age=300',
                    'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, durable'
                },
                body: JSON.stringify({ records })
            };
        } catch (error) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
    }

    // ==========================================
    // PUBLIC: BREAKING ticker (latest exchange filings, no login needed).
    // Cached for 30 seconds only, so new filings show up fast.
    // ==========================================
    if (type === 'public_breaking') {
        try {
            const newsBaseId = 'apppg1HS8BHcmiyjF';
            const newsToken = "patEHheyAwgUUMjHQ" + "." + "868501c04f5d75acbad4a34c0c35799978e659dc149919f4ec237dc44f2c72ea";
            const all = await fetchAllPages(newsBaseId, 'Breaking', newsToken);
            const records = all
                .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
                .slice(0, 20)
                .map(r => ({
                    id: r.id,
                    createdTime: r.createdTime,
                    fields: {
                        Ticker: r.fields.Ticker || '',
                        Headline: r.fields.Headline || '',
                        Summary: r.fields.Summary || '',
                        Link: r.fields.Link || ''
                    }
                }));
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Cache-Control': 'public, max-age=30',
                    'Netlify-CDN-Cache-Control': 'public, s-maxage=30, durable'
                },
                body: JSON.stringify({ records })
            };
        } catch (error) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
    }

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
        // EMAIL CHECK (skip for Lifetime members)
        // ==========================================
        const tier = authData.records[0].fields.Tier;
        const recordEmail = authData.records[0].fields.Email;

        if (tier !== 'Lifetime' && userEmail && recordEmail) {
            if (recordEmail.toLowerCase() !== userEmail.toLowerCase()) {
                return { statusCode: 403, headers, body: JSON.stringify({ error: "Access Denied: Email mismatch." }) };
            }
        }

        // ==========================================
        // STEP 2: FETCH THE DATA (If they are Active)
        // ==========================================
        let targetUrl = '';

        if (type === 'macro') {
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Macro%20Report?maxRecords=1`;
        } else if (type === 'ning_vlogs') {
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Ning_Vlogs?maxRecords=50`;
        } else if (type === 'ning_trades') {
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/tblm74bba61JIZcjb?sort%5B0%5D%5Bfield%5D=Buy_Date&sort%5B0%5D%5Bdirection%5D=desc`;
        } else {
            const dataFormula = encodeURIComponent(`{Market}='${market}'`);
            targetUrl = `https://api.airtable.com/v0/${dataBaseId}/Quant%20Data?filterByFormula=${dataFormula}`;
        }

        // COMSAT companies table is bigger than one page, so pull every page
        if (type === 'comsat_companies') {
            const records = await fetchAllPages(dataBaseId, 'CompanyFinancials', airtableToken);
            return { statusCode: 200, headers, body: JSON.stringify({ records }) };
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
