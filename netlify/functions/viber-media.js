// Hands a shared Google Drive file to Viber under a link that ends in its file type.
// Viber only accepts picture links ending in .jpeg, and Drive links have no extension.
//
//   /.netlify/functions/viber-media/<Drive file ID>.jpeg
//   /.netlify/functions/viber-media/<Drive file ID>.pdf
//
// Only files whose Drive name starts with one of ALLOWED are served, so this is not
// an open door to any shared Drive file. Add a client's file names here when needed
// (or set MEDIA_PREFIXES in Netlify's environment variables, comma separated).
const https = require('https');

const ALLOWED = ['Equity Espresso', 'PSE Fear and Greed', 'Whale Watch'];
const TYPES = { jpeg: 'image/jpeg', jpg: 'image/jpeg', pdf: 'application/pdf' };
const MAX_BYTES = 4.5 * 1024 * 1024;

// GET with redirects followed: { status, headers, body (Buffer) }
function get(url, hops) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && (hops || 0) < 5) {
                res.resume();
                resolve(get(new URL(res.headers.location, url).toString(), (hops || 0) + 1));
                return;
            }
            const chunks = [];
            let size = 0;
            res.on('data', c => {
                size += c.length;
                if (size > MAX_BYTES) { res.destroy(); reject(new Error('too large')); return; }
                chunks.push(c);
            });
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
            res.on('error', reject);
        }).on('error', reject);
    });
}

exports.handler = async function (event) {
    const m = String(event.path || '').match(/([A-Za-z0-9_-]{20,})\.(jpe?g|pdf)$/i);
    if (!m) return { statusCode: 404, body: 'Not found' };
    const id = m[1], ext = m[2].toLowerCase();

    let res;
    try {
        res = await get('https://drive.google.com/uc?export=download&id=' + id);
    } catch (e) {
        return { statusCode: e.message === 'too large' ? 413 : 502, body: 'Could not get the file' };
    }
    if (res.status !== 200) return { statusCode: 404, body: 'Not found' };

    const disp = String(res.headers['content-disposition'] || '');
    const raw = (disp.match(/filename\*=UTF-8''([^;]+)/i) || disp.match(/filename="([^"]+)"/i) || [])[1] || '';
    let name = raw;
    try { name = decodeURIComponent(raw); } catch (e) {}
    const allowed = (process.env.MEDIA_PREFIXES ? process.env.MEDIA_PREFIXES.split(',') : ALLOWED).map(s => s.trim()).filter(Boolean);
    if (!allowed.some(p => name.indexOf(p) === 0)) return { statusCode: 403, body: 'Not allowed' };

    return {
        statusCode: 200,
        headers: {
            'Content-Type': TYPES[ext],
            'Content-Length': String(res.body.length),
            'Content-Disposition': 'inline; filename="' + name.replace(/"/g, '') + '"',
            'Cache-Control': 'public, max-age=86400',
        },
        body: res.body.toString('base64'),
        isBase64Encoded: true,
    };
};
