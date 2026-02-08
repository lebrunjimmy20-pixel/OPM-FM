-- Check for whitespace or special characters in credentials
SELECT 
    access_id,
    LENGTH(access_id) as id_length,
    LENGTH(TRIM(access_id)) as id_trimmed_length,
    access_secret,
    LENGTH(access_secret) as secret_length,
    LENGTH(TRIM(access_secret)) as secret_trimmed_length,
    region
FROM tuya_config;

-- Clean up any whitespace
UPDATE tuya_config
SET 
    access_id = TRIM(access_id),
    access_secret = TRIM(access_secret),
    region = TRIM(region);

-- Verify
SELECT * FROM tuya_config;
