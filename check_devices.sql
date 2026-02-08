-- Check devices for Jimmy's Home
SELECT id, name, type, location, building, status, created_at 
FROM devices 
WHERE building = 'Jimmy''s Home' 
ORDER BY created_at DESC;

-- Check electricity consumption for Jimmy's Home devices
SELECT 
    d.id as device_id,
    d.name,
    d.type,
    d.building,
    ec.id as consumption_id,
    ec.current_usage_kw,
    ec.daily_total_kwh
FROM devices d
LEFT JOIN electricity_consumption ec ON d.id = ec.device_id
WHERE d.building = 'Jimmy''s Home'
ORDER BY d.created_at DESC;
