-- A previous migration changed `blog`.`content` from JSON to LONGTEXT, but
-- MariaDB's auto-generated `CHECK (json_valid(content))` constraint from the
-- original JSON column definition was left attached to the column and kept
-- rejecting any non-JSON HTML content on insert/update. Existing rows had
-- also been written as JSON-encoded (quoted/escaped) strings instead of raw
-- HTML as a side effect of the same drift.
--
-- Rebuild the column from scratch (via a swap) so both the constraint and
-- the JSON-quoting are cleared, and unquote the existing data back to plain
-- HTML in the process.
ALTER TABLE `blog` ADD COLUMN `content_fixed` LONGTEXT NULL;

UPDATE `blog` SET `content_fixed` = JSON_UNQUOTE(`content`);

ALTER TABLE `blog` DROP COLUMN `content`;

ALTER TABLE `blog` CHANGE COLUMN `content_fixed` `content` LONGTEXT NOT NULL;
