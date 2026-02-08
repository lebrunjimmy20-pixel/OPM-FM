-- Create a trigger function that automatically creates an electricity_consumption entry
-- whenever a new device is inserted into the devices table

CREATE OR REPLACE FUNCTION create_default_consumption_for_device()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a default consumption record for the new device
    INSERT INTO public.electricity_consumption (
        device_id,
        current_usage_kw,
        daily_total_kwh,
        peak_usage_kw,
        last_reading
    )
    VALUES (
        NEW.id,
        0.0,  -- Start with 0 kW current usage
        0.0,  -- Start with 0 kWh daily total
        0.0,  -- Start with 0 kW peak usage
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires after a device is inserted
DROP TRIGGER IF EXISTS trigger_create_consumption_on_device_insert ON public.devices;

CREATE TRIGGER trigger_create_consumption_on_device_insert
    AFTER INSERT ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION create_default_consumption_for_device();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_default_consumption_for_device() TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_consumption_for_device() TO anon;
