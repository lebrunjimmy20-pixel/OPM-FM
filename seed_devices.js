
const SUPABASE_URL = 'https://slqveckngpvrmwakboeu.supabase.co';
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

async function seed() {
    try {
        console.log('Clearing existing devices for Aquablu...');
        // Note: DELETE might fail if RLS isn't configured for anon delete, but we try
        await fetch(`${SUPABASE_URL}/rest/v1/devices?building=eq.Aquablu`, {
            method: 'DELETE',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Inserting 20 mock devices...');
        const res = await fetch(`${SUPABASE_URL}/rest/v1/devices`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(devices)
        });

        if (res.ok) {
            console.log('Successfully seeded 20 devices for Aquablu!');
        } else {
            const err = await res.text();
            console.error('Failed to seed:', err);
        }
    } catch (e) {
        console.error('Error during seeding:', e);
    }
}

seed();
