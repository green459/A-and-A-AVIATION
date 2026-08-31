-- AlterTable
ALTER TABLE `blog` ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `destination` ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SeoMeta` (
    `path` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `noindex` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`path`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
