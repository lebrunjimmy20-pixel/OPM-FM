-- Delete all existing Tuya configurations
DELETE FROM tuya_config;

-- Insert a single, clean configuration
INSERT INTO tuya_config (access_id, access_secret, region, created_at, updated_at)
VALUES (
    'phmu3kurvy3afwq778nt',
    'fa2ce8f85d774bb6a5adb36b85f8da3e',
    'us',
    NOW(),
    NOW()
);

-- Verify the result
SELECT * FROM tuya_config;
