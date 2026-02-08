-- 0. Ensure the 'building' column exists in the devices table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'devices' AND column_name = 'building') THEN
        ALTER TABLE public.devices ADD COLUMN building text DEFAULT 'OPM Tower';
    END IF;
END $$;

-- 1. Insert Mock Devices (if they don't exist by name)
-- Building: Aquablu
INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Main HVAC Plant', 'HVAC', 'Rooftop', 'Aquablu', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Main HVAC Plant');

INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Lobby Lighting System', 'Lighting', 'Main Lobby', 'Aquablu', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Lobby Lighting System');

INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Server Room Rack A', 'Power', 'Basement B1', 'Aquablu', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Server Room Rack A');

-- Building: Jimmy's Home
INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Home HVAC System', 'HVAC', 'Outside Attic', 'Jimmy''s Home', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Home HVAC System');

INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Living Room Smart Lights', 'Lighting', 'Living Room', 'Jimmy''s Home', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Living Room Smart Lights');

INSERT INTO public.devices (name, type, location, building, status)
SELECT 'Garage Power Monitor', 'Power', 'Garage', 'Jimmy''s Home', 'online'
WHERE NOT EXISTS (SELECT 1 FROM public.devices WHERE name = 'Garage Power Monitor');

-- 2. Link these devices to electricity consumption data
-- We use a CROSS JOIN with a filter to match names if IDs are unknown
INSERT INTO public.electricity_consumption (device_id, current_usage_kw, daily_total_kwh, peak_usage_kw)
SELECT 
    d.id,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 10 + 5 -- HVAC uses more (5-15kW)
        WHEN d.type = 'Power' THEN random() * 8 + 2  -- Servers (2-10kW)
        WHEN d.type = 'Lighting' THEN random() * 3 + 1 -- Lighting (1-4kW)
        ELSE random() * 1 + 0.1 -- Sensors (0.1-1.1kW)
    END as current_usage_kw,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 100 + 50
        WHEN d.type = 'Power' THEN random() * 150 + 100
        ELSE random() * 30 + 10
    END as daily_total_kwh,
    15.0 as peak_usage_kw
FROM public.devices d
WHERE d.name IN (
    'Main HVAC Plant', 
    'Lobby Lighting System', 
    'Server Room Rack A', 
    'Home HVAC System', 
    'Living Room Smart Lights', 
    'Garage Power Monitor'
)
-- Avoid duplicates if running the script multiple times
AND NOT EXISTS (
    SELECT 1 FROM public.electricity_consumption ec 
    WHERE ec.device_id = d.id
);

-- 3. Cleanup: If there are devices without consumption after this, add them too
INSERT INTO public.electricity_consumption (device_id, current_usage_kw, daily_total_kwh, peak_usage_kw)
SELECT 
    id, 
    random() * 2 + 0.5, 
    random() * 20 + 5, 
    5.0
FROM public.devices d
WHERE NOT EXISTS (
    SELECT 1 FROM public.electricity_consumption ec 
    WHERE ec.device_id = d.id
);
