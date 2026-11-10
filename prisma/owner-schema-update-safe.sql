-- Existing data is preserved. This script adds the owner/report fields and tables.
-- The CURRENT_TIMESTAMP defaults allow existing rows to receive updatedAt safely.

ALTER TABLE `community` ADD COLUMN `content` TEXT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `restaurant` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imageUrl` VARCHAR(500) NULL,
    ADD COLUMN `ownerId` VARCHAR(50) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `review` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `ownerApprovalStatus` ENUM('NONE', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'NONE',
    ADD COLUMN `role` ENUM('USER', 'OWNER', 'ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

CREATE TABLE `RestaurantPhoto` (
    `photoId` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurantId` VARCHAR(50) NOT NULL,
    `photoUrl` VARCHAR(500) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`photoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Report` (
    `reportId` VARCHAR(50) NOT NULL,
    `reporterId` VARCHAR(50) NOT NULL,
    `targetType` ENUM('REVIEW', 'COMMUNITY') NOT NULL,
    `reviewId` VARCHAR(50) NULL,
    `postId` VARCHAR(50) NULL,
    `reason` VARCHAR(100) NOT NULL,
    `detail` TEXT NULL,
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `action` VARCHAR(50) NULL,
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `Report_targetType_status_createdAt_idx`(`targetType`, `status`, `createdAt`),
    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `OwnerApplication` (
    `applicationId` VARCHAR(50) NOT NULL,
    `userId` VARCHAR(50) NOT NULL,
    `restaurantName` VARCHAR(100) NOT NULL,
    `businessNumber` VARCHAR(30) NULL,
    `reason` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejectReason` TEXT NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `OwnerApplication_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`applicationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `Community_userId_deletedAt_idx` ON `Community`(`userId`, `deletedAt`);
CREATE INDEX `Review_userId_deletedAt_idx` ON `Review`(`userId`, `deletedAt`);

ALTER TABLE `Restaurant` ADD CONSTRAINT `Restaurant_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `RestaurantPhoto` ADD CONSTRAINT `RestaurantPhoto_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Report` ADD CONSTRAINT `Report_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`reviewId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Report` ADD CONSTRAINT `Report_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Community`(`postId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `OwnerApplication` ADD CONSTRAINT `OwnerApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
