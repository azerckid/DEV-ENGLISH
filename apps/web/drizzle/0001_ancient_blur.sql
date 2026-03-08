ALTER TABLE `account` ADD `access_token_expires_at` integer;
ALTER TABLE `account` ADD `refresh_token_expires_at` integer;
ALTER TABLE `account` ADD `scope` text;
