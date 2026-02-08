import crypto from 'crypto';
import https from 'https';

const ACCESS_ID = 'phmu3kurvy3afwq778nt';
const ACCESS_SECRET = 'fa2ce8f85d774bb6a5adb36b85f8da3e';
const timestamp = Date.now().toString();

// Calculate signature
const stringToSign = ACCESS_ID + timestamp;
const signature = crypto
    .createHmac('sha256', ACCESS_SECRET)
    .update(stringToSign)
    .digest('hex')
    .toUpperCase();

console.log('=== Tuya Signature Test ===');
console.log('Access ID:', ACCESS_ID);
console.log('Timestamp:', timestamp);
console.log('String to Sign:', stringToSign);
console.log('Signature:', signature);
console.log('\n=== Making API Request ===');

// Test the actual API call
const options = {
    hostname: 'openapi.tuyaus.com',
    port: 443,
    path: '/v1.0/token?grant_type=1',
    method: 'GET',
    headers: {
        'client_id': ACCESS_ID,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
    }
};

const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response:', data);
        try {
            const parsed = JSON.parse(data);
            if (parsed.success) {
                console.log('\n✓ SUCCESS! Token obtained:', parsed.result.access_token.substring(0, 20) + '...');
            } else {
                console.log('\n✗ FAILED!');
                console.log('Error Code:', parsed.code);
                console.log('Error Message:', parsed.msg);
            }
        } catch (e) {
            console.log('Failed to parse response');
        }
    });
});

req.on('error', (e) => {
    console.error('Request error:', e);
});

req.end();
