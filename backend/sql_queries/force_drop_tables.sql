SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables
SET GROUP_CONCAT_MAX_LEN=32768;
SELECT CONCAT('DROP TABLE IF EXISTS ', GROUP_CONCAT(CONCAT('`', table_name,'`'))) AS stmt
INTO @drop_stmt
FROM information_schema.tables
WHERE table_schema = DATABASE();

PREPARE stmt FROM @drop_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;
