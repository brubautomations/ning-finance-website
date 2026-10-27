// Viber needs one address it can reach that answers "OK".
// Nothing is done with what Viber sends here.
exports.handler = async function () {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 0 })
    };
};
