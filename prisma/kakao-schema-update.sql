-- 기존 데이터를 삭제하지 않고 실행하는 카카오 식당 스키마 보강 SQL
SET @db_name = DATABASE();

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `kakaoPlaceId` VARCHAR(50) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'kakaoPlaceId'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `categoryName` VARCHAR(255) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'categoryName'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `addressName` VARCHAR(255) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'addressName'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `roadAddress` VARCHAR(255) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'roadAddress'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `phone` VARCHAR(50) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'phone'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD COLUMN `placeUrl` VARCHAR(500) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND COLUMN_NAME = 'placeUrl'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `Restaurant` ADD UNIQUE KEY `Restaurant_kakaoPlaceId_key` (`kakaoPlaceId`)', 'SELECT 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'Restaurant' AND INDEX_NAME = 'Restaurant_kakaoPlaceId_key'); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS `RestaurantMenu` (
  `menuId` VARCHAR(50) NOT NULL,
  `restaurantId` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `keywords` VARCHAR(255) NULL,
  PRIMARY KEY (`menuId`),
  KEY `RestaurantMenu_name_idx` (`name`),
  KEY `RestaurantMenu_restaurantId_idx` (`restaurantId`),
  CONSTRAINT `RestaurantMenu_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SearchHistory` (
  `historyId` VARCHAR(50) NOT NULL,
  `userId` VARCHAR(50) NOT NULL,
  `query` VARCHAR(100) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`historyId`),
  KEY `SearchHistory_userId_createdAt_idx` (`userId`, `createdAt`),
  KEY `SearchHistory_query_idx` (`query`),
  CONSTRAINT `SearchHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
