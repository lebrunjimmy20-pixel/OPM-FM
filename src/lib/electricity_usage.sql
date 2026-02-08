-- Create electricity_consumption table
CREATE TABLE IF NOT EXISTS public.electricity_consumption (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE,
  current_usage_kw decimal NOT NULL DEFAULT 0.0,
  daily_total_kwh decimal NOT NULL DEFAULT 0.0,
  peak_usage_kw decimal NOT NULL DEFAULT 0.0,
  last_reading timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.electricity_consumption ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for demo)
CREATE POLICY "Allow public read access to consumption"
  ON public.electricity_consumption FOR SELECT
  USING (true);

-- Function to handle timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_electricity_consumption_updated_at
    BEFORE UPDATE ON public.electricity_consumption
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Seed data for devices (joining with existing devices)
-- Assuming the devices from setup_database.sql exist
DO $$
DECLARE
    device_record RECORD;
BEGIN
    FOR device_record IN SELECT id FROM public.devices LOOP
        INSERT INTO public.electricity_consumption (device_id, current_usage_kw, daily_total_kwh, peak_usage_kw)
        VALUES (
            device_record.id, 
            random() * 5 + 0.5, -- Random current usage between 0.5 and 5.5 kW
            random() * 50 + 10,  -- Random daily total between 10 and 60 kWh
            5.5 + random() * 2   -- Random peak
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
