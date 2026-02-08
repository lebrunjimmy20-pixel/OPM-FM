
const SUPABASE_URL = 'https://slqveckngpvrmwakboeu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscXZlY2tuZ3B2cm13YWtib2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTM4NTIsImV4cCI6MjA4NTk2OTg1Mn0.MzmYyvi4SH9higv28Hns7ACnfSPdLP2vYfUwRz0Eco4';

const devices = [
    { name: 'Main HVAC Unit', type: 'HVAC', location: 'Rooftop', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Pool Temp Sensor', type: 'Sensor', location: 'Pool Pump Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Lobby Smart Lights', type: 'Lighting', location: 'Main Lobby', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Entrance Security Cam', type: 'Security', location: 'Front Entrance', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Smart Water Meter', type: 'Sensor', location: 'Basement Utility', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Emergency Generator', type: 'Power', location: 'Generator Room', status: 'offline', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Elevator A Controller', type: 'Elevator', location: 'Main Shaft', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Irrigation Hub East', type: 'Irrigation', location: 'East Garden', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Boiler Pressure Gauge', type: 'Sensor', location: 'Boiler Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Gym AC Unit', type: 'HVAC', location: 'Level 2 Gym', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Parking Gate Sensor', type: 'Access Control', location: 'Parking Entrance', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Electrical Panel B1', type: 'Power', location: 'Basement Electrical', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Kitchen Vent Monitor', type: 'Appliance', location: 'Restaurant Kitchen', status: 'offline', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Fire Alarm Hub 4', type: 'Security', location: 'Level 4 Hallway', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Pool pH Monitor', type: 'Sensor', location: 'Pool Deck', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Master Lighting Hub', type: 'Lighting', location: 'Control Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Chiller System 01', type: 'HVAC', location: 'South Utility', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Lounge Wi-Fi Node', type: 'Other', location: 'Resident Lounge', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Trash Chute Sensor', type: 'Sensor', location: 'Utility Room', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() },
    { name: 'Solar Inverter 03', type: 'Power', location: 'Roof Array', status: 'online', building: 'Aquablu', last_updated: new Date().toISOString() }
];

async function seed() {
    try {
        console.log('Clearing existing devices for Aquablu...');
        // Note: This relies on the table having RLS set to allow delete or no RLS
        await fetch(`${SUPABASE_URL}/rest/v1/devices?building=eq.Aquablu`, {
            method: 'DELETE',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
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
