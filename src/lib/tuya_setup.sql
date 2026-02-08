-- Create tuya_config table to store Cloud Project credentials
CREATE TABLE IF NOT EXISTS tuya_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_id TEXT NOT NULL,
    access_secret TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'us',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tuya_config
ALTER TABLE tuya_config ENABLE ROW LEVEL SECURITY;

-- Policy for tuya_config
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tuya_config' AND policyname = 'Enable all for authenticated users') THEN
        CREATE POLICY "Enable all for authenticated users" ON tuya_config FOR ALL USING (true);
    END IF;
END $$;

-- Update devices table to support Tuya
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS tuya_device_id TEXT,
ADD COLUMN IF NOT EXISTS is_tuya BOOLEAN DEFAULT false;

-- Add index on tuya_device_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_devices_tuya_id ON devices(tuya_device_id);
