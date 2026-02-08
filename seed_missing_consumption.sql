-- Seed electricity consumption data for devices that don't have it yet
-- This is a one-time script to populate missing consumption entries

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
        WHEN d.type = 'HVAC' THEN random() * 3 + 1.5  -- HVAC: 1.5-4.5 kW
        WHEN d.type = 'Lighting' THEN random() * 0.5 + 0.1  -- Lighting: 0.1-0.6 kW
        WHEN d.type = 'Sensor' THEN random() * 0.05 + 0.01  -- Sensor: 0.01-0.06 kW
        WHEN d.type = 'Power' THEN random() * 2 + 0.5  -- Power: 0.5-2.5 kW
        ELSE random() * 1 + 0.2  -- Other: 0.2-1.2 kW
    END as current_usage_kw,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 50 + 30  -- HVAC: 30-80 kWh
        WHEN d.type = 'Lighting' THEN random() * 10 + 2  -- Lighting: 2-12 kWh
        WHEN d.type = 'Sensor' THEN random() * 1 + 0.1  -- Sensor: 0.1-1.1 kWh
        WHEN d.type = 'Power' THEN random() * 30 + 10  -- Power: 10-40 kWh
        ELSE random() * 15 + 5  -- Other: 5-20 kWh
    END as daily_total_kwh,
    CASE 
        WHEN d.type = 'HVAC' THEN random() * 2 + 4.5  -- HVAC peak: 4.5-6.5 kW
        WHEN d.type = 'Lighting' THEN random() * 0.3 + 0.6  -- Lighting peak: 0.6-0.9 kW
        WHEN d.type = 'Sensor' THEN random() * 0.03 + 0.06  -- Sensor peak: 0.06-0.09 kW
        WHEN d.type = 'Power' THEN random() * 1.5 + 2.5  -- Power peak: 2.5-4 kW
        ELSE random() * 1 + 1.2  -- Other peak: 1.2-2.2 kW
    END as peak_usage_kw,
    NOW() as last_reading
FROM public.devices d
LEFT JOIN public.electricity_consumption ec ON d.id = ec.device_id
WHERE ec.id IS NULL;  -- Only insert for devices that don't have consumption data yet
