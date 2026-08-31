-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `notes` TEXT NULL;
