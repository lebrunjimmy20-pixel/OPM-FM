-- Create devices table
create table if not exists devices (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  location text not null,
  building text not null default 'Aquablu',
  status text not null check (status in ('online', 'offline')),
  last_updated timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table devices enable row level security;

-- Create policy to allow read access for all users (since it's a public demo/dashboard for now)
-- You might want to restrict this later
create policy "Allow public read access"
  on devices for select
  using (true);

-- Insert seed data
insert into devices (name, type, location, status, last_updated) values
('Main HVAC Unit', 'HVAC', 'Rooftop', 'online', now() - interval '2 minutes'),
('Lobby Thermostat', 'Thermostat', 'Lobby', 'online', now() - interval '1 minute'),
('Pool Pump Control', 'Pool System', 'Pool Area', 'online', now() - interval '5 minutes'),
('Conference Room A Lighting', 'Lighting', 'Conference Room A', 'offline', now() - interval '2 hours'),
('Main Entrance Camera', 'Security', 'Entrance', 'online', now()),
('Server Room Temp Sensor', 'Sensor', 'Server Room', 'online', now() - interval '30 seconds'),
('Cafeteria Fridge Monitor', 'Sensor', 'Cafeteria', 'online', now() - interval '10 minutes'),
('Parking Gate Controller', 'Access Control', 'Parking Lot', 'offline', now() - interval '1 day'),
('Executive Wing HVAC', 'HVAC', '2nd Floor', 'online', now() - interval '15 minutes'),
('Warehouse Motion Sensor 1', 'Sensor', 'Warehouse', 'online', now()),
('Warehouse Motion Sensor 2', 'Sensor', 'Warehouse', 'online', now()),
('Generator Status Monitor', 'Power', 'Utility Room', 'online', now() - interval '1 hour'),
('Elevator 1 Control', 'Elevator', 'Main Shaft', 'online', now()),
('Gym Air Quality Sensor', 'Sensor', 'Gym', 'online', now() - interval '45 minutes'),
('Irrigation System Controller', 'Irrigation', 'Gardens', 'offline', now() - interval '3 hours'),
('Solar Inverter 1', 'Power', 'Roof', 'online', now() - interval '5 minutes'),
('Solar Inverter 2', 'Power', 'Roof', 'online', now() - interval '5 minutes'),
('Break Room Water Dispenser', 'Appliance', 'Break Room', 'online', now() - interval '20 minutes'),
('Loading Dock Door Sensor', 'Sensor', 'Loading Dock', 'online', now()),
('Emergency Lighting Controller', 'Lighting', 'Building Wide', 'online', now() - interval '1 day');
