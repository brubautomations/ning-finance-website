exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Google Client ID not configured.' })
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ clientId })
    };
};
