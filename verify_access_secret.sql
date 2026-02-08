-- Check the exact length and value of access_secret
-- User provided: fa2ce8f85d774bb6a5adb36b85f8da3e
SELECT 
    'access_secret_check' as check_name,
    LENGTH(access_secret) as actual_length,
    'fa2ce8f85d774bb6a5adb36b85f8da3e' as expected_secret,
    LENGTH('fa2ce8f85d774bb6a5adb36b85f8da3e') as expected_length,
    CASE 
        WHEN access_secret = 'fa2ce8f85d774bb6a5adb36b85f8da3e' THEN 'MATCH ✓'
        ELSE 'MISMATCH ✗'
    END as comparison
FROM tuya_config;
