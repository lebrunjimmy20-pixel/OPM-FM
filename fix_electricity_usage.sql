-- Combined script to fix electricity usage display issue
-- Run this in Supabase SQL Editor

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION create_default_consumption_for_device()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.electricity_consumption (
        device_id,
        current_usage_kw,
        daily_total_kwh,
        peak_usage_kw,
        last_reading
    )
    VALUES (
        NEW.id,
        0.0,
        0.0,
        0.0,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS trigger_create_consumption_on_device_insert ON public.devices;

CREATE TRIGGER trigger_create_consumption_on_device_insert
    AFTER INSERT ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION create_default_consumption_for_device();

-- Step 3: Seed missing consumption data for existing devices
INSERT INTO public.electricity_consumption (
    device_id,
    current_usage_kw,
    daily_total_kwh,
    peak_usage_kw,
    last_reading
)
SELECT 
    d.id,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 3 + 1.5
        WHEN d.type = 'Lighting' THEN random() * 0.5 + 0.1
        WHEN d.type = 'Sensor' THEN random() * 0.05 + 0.01
        WHEN d.type = 'Power' THEN random() * 2 + 0.5
        ELSE random() * 1 + 0.2
    END as current_usage_kw,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 50 + 30
        WHEN d.type = 'Lighting' THEN random() * 10 + 2
        WHEN d.type = 'Sensor' THEN random() * 1 + 0.1
        WHEN d.type = 'Power' THEN random() * 30 + 10
        ELSE random() * 15 + 5
    END as daily_total_kwh,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 2 + 4.5
        WHEN d.type = 'Lighting' THEN random() * 0.3 + 0.6
        WHEN d.type = 'Sensor' THEN random() * 0.03 + 0.06
        WHEN d.type = 'Power' THEN random() * 1.5 + 2.5
        ELSE random() * 1 + 1.2
    END as peak_usage_kw,
    NOW() as last_reading
FROM public.devices d
LEFT JOIN public.electricity_consumption ec ON d.id = ec.device_id
WHERE ec.id IS NULL;

-- Step 4: Verify the results
SELECT 
    d.name,
    d.type,
    d.building,
    ec.current_usage_kw,
    ec.daily_total_kwh
FROM devices d
LEFT JOIN electricity_consumption ec ON d.id = ec.device_id
WHERE d.building = 'Jimmy''s Home'
ORDER BY d.name;
