
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    console.log('Clearing existing devices...');
    const { error: delError } = await supabase.from('devices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delError) console.error('Delete error:', delError);

    console.log('Inserting mock devices...');
    const { error: insError } = await supabase.from('devices').insert(devices);
    if (insError) {
        console.error('Insert error:', insError);
    } else {
        console.log('Successfully seeded 20 devices!');
    }
}

seed();
