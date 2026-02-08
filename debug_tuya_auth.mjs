import crypto from 'crypto';
import https from 'https';

const ACCESS_ID = 'phmu3kurvy3afwq778nt';
const ACCESS_SECRET = 'fa2ce8f85d774bb6a5adb36b85f8da3e';

function sha256_hmac(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest('hex').toUpperCase();
}

function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase(); // Tuya MD5 is usually lower, check? Docs say sign is usually uppercase.
}

async function testRequest(name, signature, t, extraHeaders = {}) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'openapi.tuyaus.com',
            path: '/v1.0/token?grant_type=1',
            method: 'GET',
            headers: {
                'client_id': ACCESS_ID,
                'sign': signature,
                't': t,
                'sign_method': 'HMAC-SHA256',
                ...extraHeaders
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ name, success: parsed.success, code: parsed.code, msg: parsed.msg });
                } catch (e) {
                    resolve({ name, success: false, msg: 'Parse Error' });
                }
            });
        });
        req.on('error', e => resolve({ name, success: false, msg: e.message }));
        req.end();
    });
}

async function runTests() {
    const t = Date.now().toString();
    console.log(`Testing with t=${t}`);

    const tests = [
        {
            name: 'Standard HMAC-SHA256 (ID + t)',
            sign: sha256_hmac(ACCESS_SECRET, ACCESS_ID + t)
        },
        {
            name: 'HMAC-SHA256 (ID + t + empty nonce)',
            sign: sha256_hmac(ACCESS_SECRET, ACCESS_ID + t + '')
        },
        // Maybe secret key is switched? (Unlikely)
        {
            name: 'HMAC-SHA256 (t + ID)',
            sign: sha256_hmac(ACCESS_SECRET, t + ACCESS_ID)
        },
        // MD5 Legacy?
        {
            name: 'MD5 (ID + t + secret) [sign_method=MD5]',
            sign: crypto.createHash('md5').update(ACCESS_ID + t + ACCESS_SECRET).digest('hex').toLowerCase(), // MD5 usually lower?
            headers: { 'sign_method': 'MD5' }
        },
    ];

    for (const test of tests) {
        console.log(`Trying: ${test.name}...`);
        console.log(`  Sign: ${test.sign}`);
        const result = await testRequest(test.name, test.sign, t, test.headers);
        console.log(`  Result: ${JSON.stringify(result)}`);
        if (result.success) {
            console.log("!!! FOUND WORKING METHOD !!!");
            break;
        }
    }
}

runTests();
