-- Check the exact length and value of access_id
SELECT 
    access_id,
    LENGTH(access_id) as actual_length,
    'phmu3kurvy3afwq778nt' as expected_id,
    LENGTH('phmu3kurvy3afwq778nt') as expected_length,
    CASE 
        WHEN access_id = 'phmu3kurvy3afwq778nt' THEN 'MATCH ✓'
        ELSE 'MISMATCH ✗'
    END as comparison
FROM tuya_config;
