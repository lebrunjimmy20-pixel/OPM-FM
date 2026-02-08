-- Update Tuya configuration with correct Access Secret
UPDATE tuya_config 
SET access_secret = 'fa2ce8f85d774bb6a5adb36b85f8da3e',
    updated_at = NOW()
WHERE access_id = 'phmu3kurvy3afwq778nt';

-- Verify the update
SELECT access_id, access_secret, region, updated_at FROM tuya_config;
