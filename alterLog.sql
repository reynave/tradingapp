ALTER TABLE `journal`
	ADD COLUMN `startBalance` INT(11) NOT NULL DEFAULT '0' AFTER `permissionId`;
