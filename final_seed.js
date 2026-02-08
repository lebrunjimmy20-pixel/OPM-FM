
const https = require('https');

const SUPABASE_URL = 'slqveckngpvrmwakboeu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscXZlY2tuZ3B2cm13YWtib2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTM4NTIsImV4cCI6MjA4NTk2OTg1Mn0.MzmYyvi4SH9higv28Hns7ACnfSPdLP2vYfUwRz0Eco4';

const devices = [
    { name: 'Main HVAC Unit', type: 'HVAC', location: 'Rooftop', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Pool Heat Pump', type: 'Thermostat', location: 'Pool Deck', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Main Lobby Lighting', type: 'Lighting', location: 'Lobby', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Perimeter Security Cam 1', type: 'Security', location: 'Entrance', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Smart Water Meter', type: 'Sensor', location: 'Basement', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Backup Generator', type: 'Power', location: 'Utility Room', status: 'offline', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Elevator Controller A', type: 'Elevator', location: 'Shaft 1', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Garden Irrigation Zone 1', type: 'Irrigation', location: 'East Garden', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Boiler Temperature Sensor', type: 'Sensor', location: 'Boiler Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Gym AC Controller', type: 'HVAC', location: 'Gym', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Parking Gate Sensor', type: 'Access Control', location: 'Parking Level 1', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Main Electrical Panel', type: 'Power', location: 'Electrical Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Kitchen Exhaust Fan', type: 'Appliance', location: 'Restaurant Kitchen', status: 'offline', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Zonal Fire Alarm Hub', type: 'Security', location: 'Level 4 Hallway', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Pool pH Sensor', type: 'Sensor', location: 'Pump Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Master Lighting Hub', type: 'Lighting', location: 'Control Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'South Wing Chiller', type: 'HVAC', location: 'South Utility', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Guest Wi-Fi AP 04', type: 'Other', location: 'Lounge', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Waste Management Sensor', type: 'Sensor', location: 'Loading Dock', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Roof Solar Inverter', type: 'Power', location: 'Solar Array', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() }
];

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: `/rest/v1/${path}`,
            method: method,
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Status: ${res.statusCode}, Body: ${data}`));
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function seed() {
    try {
        console.log('Inserting mock devices...');
        await request('devices', 'POST', devices);
        console.log('Successfully seeded 20 devices!');
    } catch (e) {
        console.error('Seeding error:', e.message);
    }
}

seed();
