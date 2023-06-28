-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.4.0.6659
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table tradingbook.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `status` int(3) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.account: ~4 rows (approximately)
INSERT INTO `account` (`id`, `name`, `email`, `password`, `presence`, `status`, `input_date`, `update_date`) VALUES
	('230101.0001', 'Felix', 'cso1@email.com', '4297f44b13955235245b2497399d7a93', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('C0012', 'Wawa', 'wawa@emai.com', '4297f44b13955235245b2497399d7a93', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('C5555', 'Mada', 'mada@emai.com', '4297f44b13955235245b2497399d7a93', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('U1', 'dia', 'dia2', '4297f44b13955235245b2497399d7a93', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00');

-- Dumping structure for table tradingbook.account_login
CREATE TABLE IF NOT EXISTS `account_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `ip` varchar(50) NOT NULL DEFAULT '',
  `getUserAgent` varchar(250) NOT NULL DEFAULT '',
  `input_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.account_login: ~5 rows (approximately)
INSERT INTO `account_login` (`id`, `accountId`, `ip`, `getUserAgent`, `input_date`) VALUES
	(2, '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-18 19:06:55'),
	(3, '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-18 19:07:17'),
	(4, '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-18 19:08:47'),
	(5, '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-18 19:41:39'),
	(6, '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-18 19:50:53'),
	(7, '1', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', '2023-06-22 10:44:37'),
	(8, '230101.0001', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', '2023-06-22 17:25:53');

-- Dumping structure for table tradingbook.auto_number
CREATE TABLE IF NOT EXISTS `auto_number` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `prefix` varchar(50) NOT NULL DEFAULT '',
  `digit` int(10) NOT NULL DEFAULT 1,
  `runningNumber` int(10) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.auto_number: ~1 rows (approximately)
INSERT INTO `auto_number` (`id`, `name`, `prefix`, `digit`, `runningNumber`, `updateDate`) VALUES
	(10, 'backtest', 'B1-', 6, 18, '0000-00-00 00:00:00');

-- Dumping structure for table tradingbook.book
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `presence` int(1) DEFAULT 1,
  `inputDate` datetime DEFAULT '2023-01-01 00:00:00',
  `inputBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.book: ~0 rows (approximately)
INSERT INTO `book` (`id`, `accountId`, `name`, `presence`, `inputDate`, `inputBy`) VALUES
	(1, '1', 'SMC', 1, '2023-01-01 00:00:00', NULL);

-- Dumping structure for table tradingbook.journal
CREATE TABLE IF NOT EXISTS `journal` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(250) NOT NULL DEFAULT '',
  `url` varchar(250) NOT NULL DEFAULT '',
  `permissionId` int(3) NOT NULL DEFAULT 0,
  `borderColor` varchar(50) NOT NULL DEFAULT '',
  `backgroundColor` varchar(50) NOT NULL DEFAULT '',
  `version` varchar(20) NOT NULL DEFAULT '',
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingbook.journal: ~4 rows (approximately)
INSERT INTO `journal` (`id`, `accountId`, `name`, `url`, `permissionId`, `borderColor`, `backgroundColor`, `version`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	('B1-000014', '230101.0001', 'Smart Money Faster', '649b1a764438b', 30, '#3AA6B9', '#C1ECE4', '', 1, '2023-06-27 17:20:54', '230101.0001', '2023-06-27 18:49:33', '230101.0001'),
	('B1-000015', '230101.0001', 'New 2023-06-27 18:35', '649b2be58bfc2', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-27 18:35:17', '230101.0001', '2023-06-27 18:35:17', '230101.0001'),
	('B1-000016', '230101.0001', 'New 2023-06-27 18:36', '649b2c1c77d56', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-27 18:36:12', '230101.0001', '2023-06-27 18:36:12', '230101.0001'),
	('B1-000017', '230101.0001', 'New 2023-06-27 19:34', '649b39c6357a1', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-27 19:34:30', '230101.0001', '2023-06-27 19:34:30', '230101.0001'),
	('B1-000018', '230101.0001', 'New 2023-06-27 19:49', '649b3d2dc99e6', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-27 19:49:01', '230101.0001', '2023-06-27 19:49:01', '230101.0001'),
	('T013', 'C0012', 'tes t123', '', 20, '', '', '', 1, '2023-01-01 00:00:00', '', '2023-06-27 18:35:24', '');

-- Dumping structure for table tradingbook.journal_access
CREATE TABLE IF NOT EXISTS `journal_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `owner` int(1) NOT NULL DEFAULT 0,
  `editable` int(1) NOT NULL DEFAULT 0,
  `changeable` int(1) NOT NULL DEFAULT 0,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_access: ~4 rows (approximately)
INSERT INTO `journal_access` (`id`, `accountId`, `journalId`, `owner`, `editable`, `changeable`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(5, '230101.0001', 'B1-000014', 1, 1, 0, 1, '2023-06-27 17:20:54', '230101.0001', '2023-06-27 17:20:54', '230101.0001'),
	(6, '230101.0001', 'T013', 0, 0, 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(7, '230101.0001', 'B1-000015', 1, 1, 0, 1, '2023-06-27 18:35:17', '230101.0001', '2023-06-27 18:35:17', '230101.0001'),
	(8, '230101.0001', 'B1-000016', 1, 1, 0, 1, '2023-06-27 18:36:12', '230101.0001', '2023-06-27 18:36:12', '230101.0001'),
	(9, '230101.0001', 'B1-000017', 1, 1, 1, 1, '2023-06-27 19:34:30', '230101.0001', '2023-06-27 19:34:30', '230101.0001'),
	(10, '230101.0001', 'B1-000018', 1, 1, 1, 1, '2023-06-27 19:49:01', '230101.0001', '2023-06-27 19:49:01', '230101.0001');

-- Dumping structure for table tradingbook.journal_custom_field
CREATE TABLE IF NOT EXISTS `journal_custom_field` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `f` int(2) NOT NULL DEFAULT 0,
  `name` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `iType` varchar(250) NOT NULL,
  `sorting` int(3) NOT NULL DEFAULT 99,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_custom_field: ~4 rows (approximately)
INSERT INTO `journal_custom_field` (`id`, `journalId`, `f`, `name`, `iType`, `sorting`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(39, 'B1-000014', 1, 'custom Field 1', 'text', 10, '2023-06-27 17:38:35', '230101.0001', '2023-01-01 00:00:00', ''),
	(41, 'B1-000014', 2, 'custom Field 2', 'text', 20, '2023-06-27 17:38:57', '230101.0001', '2023-01-01 00:00:00', ''),
	(42, 'B1-000014', 3, 'custom Field 3', 'text', 30, '2023-06-27 17:38:58', '230101.0001', '2023-01-01 00:00:00', ''),
	(43, 'B1-000014', 4, 'custom Field 4', 'text', 40, '2023-06-27 17:40:02', '230101.0001', '2023-01-01 00:00:00', '');

-- Dumping structure for table tradingbook.journal_detail
CREATE TABLE IF NOT EXISTS `journal_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `positionId` int(2) NOT NULL DEFAULT 0,
  `marketId` int(3) NOT NULL DEFAULT 0,
  `openDate` datetime NOT NULL DEFAULT '2020-01-01 00:00:00',
  `closeDate` datetime NOT NULL DEFAULT '2020-01-01 00:00:00',
  `sl` float(5,2) NOT NULL DEFAULT 0.00,
  `rr` float(5,2) NOT NULL DEFAULT 0.00,
  `tp` float(5,2) NOT NULL DEFAULT 0.00,
  `resultId` int(2) NOT NULL DEFAULT 0,
  `note` varchar(250) NOT NULL DEFAULT '',
  `f1` text NOT NULL,
  `f2` text NOT NULL,
  `f3` text NOT NULL,
  `f4` text NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingbook.journal_detail: ~12 rows (approximately)
INSERT INTO `journal_detail` (`id`, `journalId`, `positionId`, `marketId`, `openDate`, `closeDate`, `sl`, `rr`, `tp`, `resultId`, `note`, `f1`, `f2`, `f3`, `f4`, `presence`, `input_date`, `update_date`) VALUES
	(1, 'B1-000014', 2, 2, '2023-01-13 06:05:00', '2023-01-13 20:34:00', 23.00, -5.00, -115.00, -1, '', 'FOMC', '1.244223', 'akao434', '5345345', 1, '2023-01-01 00:00:00', '2023-06-27 18:49:33'),
	(2, 'B1-000014', 1, 3, '2022-12-02 04:04:00', '2022-12-08 18:25:00', 20.00, 3.00, 60.00, 1, '', 'CPI', '', '', '', 1, '2023-01-01 00:00:00', '2023-06-27 18:49:33'),
	(3, 'B1-000014', 2, 5, '2021-06-11 00:00:00', '2021-06-13 18:25:00', 20.00, -8.00, -160.00, -1, '', '', '', '', '', 1, '2023-01-01 00:00:00', '2023-06-27 18:49:33'),
	(4, 'B1-000014', 1, 2, '2020-01-02 00:00:00', '2020-01-08 18:25:00', 21.00, 2.00, 42.00, 1, '', '', '', '', '', 1, '2023-06-16 17:18:03', '2023-06-27 18:49:33'),
	(5, 'B1-000014', 1, 2, '2020-01-02 00:00:00', '2020-01-04 18:25:00', 1.00, -2.00, -2.00, -1, '', '', '', '', '', 0, '2023-06-16 17:18:16', '2023-06-17 05:45:36'),
	(6, 'B1-000014', 2, 3, '2020-01-30 00:00:00', '2020-02-01 18:25:00', 1.00, 3.00, 3.00, 1, '', '', '', '', '', 0, '2023-06-16 17:18:26', '2023-06-17 05:45:36'),
	(7, 'B1-000014', 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', 0, '2023-06-16 18:56:19', '2023-06-17 05:45:27'),
	(8, 'B1-000014', 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', 0, '2023-06-17 05:34:28', '2023-06-17 05:45:27'),
	(9, 'B1-000014', 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 2.00, 42.00, 1, '', '', '', '', '', 1, '2023-06-17 05:54:41', '2023-06-27 18:49:33'),
	(10, 'B1-000014', 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', 0, '2023-06-17 19:10:26', '2023-06-17 19:10:32'),
	(11, 'B1-000014', 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', 'agasdf', 'bavd', '43434234', '34234', 1, '2023-06-23 17:48:26', '2023-06-27 18:49:33'),
	(12, 'B1-000014', 2, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 3.00, 0.00, 0.00, 0, '', '', '', '', '', 1, '2023-06-27 17:40:11', '2023-06-27 18:49:33');

-- Dumping structure for table tradingbook.journal_detail_images
CREATE TABLE IF NOT EXISTS `journal_detail_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalDetailId` varchar(50) NOT NULL DEFAULT '',
  `img` varchar(250) NOT NULL DEFAULT '',
  `sorting` int(2) NOT NULL DEFAULT 88,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingbook.journal_detail_images: ~14 rows (approximately)
INSERT INTO `journal_detail_images` (`id`, `journalDetailId`, `img`, `sorting`, `presence`, `input_date`, `update_date`) VALUES
	(1, '1', 'https://pbs.twimg.com/media/FygoJc1agAIYbCM?format=jpg&name=medium', 1, 1, '2023-01-01 00:00:00', '2023-01-01 00:00:00'),
	(2, '1', 'https://static.sextb.net/actor/kanna-shinozaki.jpg', 2, 0, '2023-01-01 00:00:00', '2023-06-23 18:19:39'),
	(3, '1', 'https://i.pinimg.com/564x/66/ba/00/66ba0049462f33036bba3989e9f6c5bf.jpg', 3, 1, '2023-01-01 00:00:00', '2023-01-01 00:00:00'),
	(4, '1', 'https://i.pinimg.com/564x/66/ba/00/66ba0049462f33036bba3989e9f6c5bf.jpg', 3, 0, '2023-01-01 00:00:00', '2023-06-17 13:05:51'),
	(5, '1', 'https://static.sextb.net/actor/kanna-shinozaki.jpg', 2, 0, '2023-01-01 00:00:00', '2023-06-17 13:04:27'),
	(6, '1', 'http://localhost/app/tradingapp/public/uploads/02. igarashi shinobu 2.jpg', 88, 1, '2023-06-17 16:01:24', '2023-06-17 16:01:24'),
	(7, '1', 'http://localhost/app/tradingapp/public/uploads/05. Meguri Fujiura.jpg', 88, 1, '2023-06-17 16:01:50', '2023-06-17 16:01:50'),
	(8, '1', 'http://localhost/app/tradingapp/public/uploads/09. Takeda Makoto.jpg', 88, 1, '2023-06-17 16:47:23', '2023-06-17 16:47:23'),
	(9, '2', 'http://localhost/app/tradingapp/public/uploads/10. hikari sakuraba.jpg', 88, 1, '2023-06-17 17:03:16', '2023-06-17 17:03:16'),
	(10, '2', 'http://localhost/app/tradingapp/public/uploads/02. igarashi shinobu.jpg', 88, 1, '2023-06-17 17:04:44', '2023-06-17 17:04:44'),
	(11, '2', 'http://localhost/app/tradingapp/public/uploads/03. Kaori Otonashi.jpg', 88, 1, '2023-06-17 17:04:59', '2023-06-17 17:04:59'),
	(12, '3', 'http://localhost/app/tradingapp/public/uploads/11. shinozaki kanna.jpg', 88, 1, '2023-06-17 17:59:41', '2023-06-17 17:59:41'),
	(13, '3', 'http://localhost/app/tradingapp/public/uploads/04. mitsuki an.jpg', 88, 1, '2023-06-17 17:59:46', '2023-06-17 17:59:46'),
	(14, '1', 'http://localhost/app/tradingapp/public/uploads/1553302096944.jpg', 88, 1, '2023-06-27 17:33:18', '2023-06-27 17:33:18');

-- Dumping structure for table tradingbook.market
CREATE TABLE IF NOT EXISTS `market` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.market: ~6 rows (approximately)
INSERT INTO `market` (`id`, `name`) VALUES
	(1, 'XAUUSD'),
	(2, 'EURUSD'),
	(3, 'AUDUSD'),
	(4, 'NZDJPY'),
	(5, 'USDJPY'),
	(6, 'USDCAD');

-- Dumping structure for table tradingbook.permission
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `fontIcon` varchar(250) NOT NULL,
  `private` int(1) NOT NULL DEFAULT 0,
  `share` int(1) NOT NULL DEFAULT 0,
  `comments` int(1) NOT NULL DEFAULT 0,
  `note` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.permission: ~3 rows (approximately)
INSERT INTO `permission` (`id`, `name`, `fontIcon`, `private`, `share`, `comments`, `note`) VALUES
	(0, 'Private', '<i class="bi bi-lock"></i>', 1, 0, 0, ''),
	(20, 'Share', '<i class="bi bi-link-45deg"></i>', 0, 1, 0, ''),
	(30, 'Share + Comments', '<i class="bi bi-share"></i>', 0, 1, 1, '');

-- Dumping structure for table tradingbook.select_position
CREATE TABLE IF NOT EXISTS `select_position` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.select_position: ~4 rows (approximately)
INSERT INTO `select_position` (`id`, `name`) VALUES
	(1, 'Buy Limit'),
	(2, 'Sales Limit'),
	(11, 'Buy Stop'),
	(12, 'Sell Stop');

-- Dumping structure for table tradingbook.v1_journal
CREATE TABLE IF NOT EXISTS `v1_journal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `sorting` int(9) NOT NULL DEFAULT 99999,
  `bookId` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(250) NOT NULL DEFAULT '',
  `openDate` date DEFAULT NULL,
  `openTime` time DEFAULT NULL,
  `closeDate` date DEFAULT NULL,
  `closeTime` time DEFAULT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `archived` int(3) NOT NULL DEFAULT 0,
  `ilock` int(2) NOT NULL DEFAULT 0,
  `positionId` int(2) NOT NULL DEFAULT 0,
  `sl` float(6,2) NOT NULL DEFAULT 0.00,
  `rr` float(6,1) NOT NULL DEFAULT 0.0,
  `f1` varchar(250) DEFAULT NULL,
  `f2` varchar(250) DEFAULT NULL,
  `f3` varchar(250) DEFAULT NULL,
  `f4` varchar(250) DEFAULT NULL,
  `f5` varchar(250) DEFAULT NULL,
  `f6` varchar(250) DEFAULT NULL,
  `f7` varchar(250) DEFAULT NULL,
  `f8` varchar(250) DEFAULT NULL,
  `f9` varchar(250) DEFAULT NULL,
  `f10` varchar(250) DEFAULT NULL,
  `f11` varchar(250) DEFAULT NULL,
  `f12` varchar(250) DEFAULT NULL,
  `f13` varchar(250) DEFAULT NULL,
  `inputBy` varchar(250) DEFAULT NULL,
  `updateBy` varchar(250) DEFAULT NULL,
  `inputDate` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `updateDate` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.v1_journal: ~16 rows (approximately)
INSERT INTO `v1_journal` (`id`, `accountId`, `sorting`, `bookId`, `name`, `openDate`, `openTime`, `closeDate`, `closeTime`, `presence`, `archived`, `ilock`, `positionId`, `sl`, `rr`, `f1`, `f2`, `f3`, `f4`, `f5`, `f6`, `f7`, `f8`, `f9`, `f10`, `f11`, `f12`, `f13`, `inputBy`, `updateBy`, `inputDate`, `updateDate`) VALUES
	(1, '1', 1, '1', 'NZDUSD', '2023-01-17', '17:45:00', '2023-01-18', '20:00:00', 1, 0, 1, 1, 11.40, 12.0, 'Strong Bullish', '80%', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00', '2023-04-30 19:36:22'),
	(2, '', 4, '1', 'NZDUSD', '2023-02-01', '09:30:00', '2023-02-02', '09:15:00', 1, 0, 1, 1, 14.30, 7.7, 'Bullish', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00', '2023-04-30 19:36:22'),
	(10, '', 7, '1', 'NZDUSD', '2023-02-21', '16:45:00', '2023-02-24', '21:04:00', 1, 0, 1, 2, 10.00, 9.3, 'Strong Bear', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-19 14:44:21', '2023-04-30 19:36:22'),
	(11, '', 10, '1', 'NZDUSD', '2023-03-22', '07:30:00', '2023-03-23', '01:45:00', 1, 0, 1, 1, 10.00, 9.8, 'Bullish', '70%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-19 17:23:35', '2023-04-30 19:36:22'),
	(12, '', 2, '1', 'EURUSD', '2023-01-19', '00:15:00', '2023-01-23', '14:00:00', 1, 0, 1, 1, 19.80, 6.3, 'Strong Bear', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-19 17:33:15', '2023-04-30 19:36:22'),
	(13, '', 6, '1', 'EURUSD', '2023-02-18', '14:30:00', '2023-02-23', '02:30:00', 1, 0, 1, 2, 12.20, 7.9, 'Strong Bear', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-20 08:55:08', '2023-04-30 19:36:22'),
	(14, '', 3, '1', 'EURUSD', '2023-01-27', '22:00:00', '2023-01-30', '15:00:00', 1, 0, 1, 2, 11.00, -1.0, 'Bear', '70%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-20 09:26:08', '2023-04-30 19:36:22'),
	(15, '', 11, '1', 'NZDJPY', '2023-04-20', '06:45:00', '2023-04-21', '03:00:00', 1, 0, 1, 1, 17.90, -1.0, 'Bullish', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-20 09:26:09', '2023-04-30 19:36:22'),
	(16, '', 4, '1', 'AUDUSD', '0000-00-00', NULL, '0000-00-00', NULL, 0, 0, 0, 1, 0.00, 0.0, NULL, '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-20 09:26:10', '2023-04-29 18:52:11'),
	(17, '', 8, '1', 'EURUSD', '2023-02-22', '22:30:00', '2023-02-23', '02:30:00', 1, 0, 1, 2, 20.00, 4.0, 'Bear', '80', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-20 09:26:11', '2023-04-30 19:36:22'),
	(18, '', 5, '1', 'EURUSD', '2023-02-14', '20:00:00', '2023-02-14', '20:00:00', 1, 0, 1, 2, 13.00, -1.0, 'Bear', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-23 13:02:25', '2023-04-30 19:36:22'),
	(19, '', 9, '1', 'EURUSD', '2023-03-03', '22:00:00', '2023-03-06', '23:00:00', 1, 0, 1, 1, 16.00, 6.0, 'Bear', '70%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-23 13:48:23', '2023-04-30 19:36:22'),
	(20, '', 14, '1', 'USDJPY', '2023-04-28', '10:15:00', '2023-04-28', '16:45:00', 1, 0, 1, 1, 21.00, 11.0, 'Bullish', '70%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-23 13:55:12', '2023-04-30 19:36:22'),
	(21, '', 13, '', 'EURUSD', '2023-04-25', '23:00:00', '2023-04-26', '20:00:00', 1, 0, 1, 1, 20.00, 4.7, 'Bullish', '70%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-29 16:41:04', '2023-04-30 19:36:22'),
	(22, '', 12, '', 'GBPUSD', '2023-04-21', '21:00:00', '2023-04-25', '07:00:00', 1, 0, 1, 1, 20.00, 6.0, 'Bullish', '80%', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-29 16:41:05', '2023-04-30 19:36:22'),
	(23, '', 9999, '', '', '0000-00-00', NULL, '0000-00-00', NULL, 1, 0, 0, 0, 0.00, 0.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-29 16:41:06', '2023-04-30 19:36:22');

-- Dumping structure for table tradingbook.v1_journal_header
CREATE TABLE IF NOT EXISTS `v1_journal_header` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `bookId` int(9) NOT NULL DEFAULT 0,
  `fId` varchar(50) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `sorting` int(3) DEFAULT 99,
  `inputDate` datetime DEFAULT '2023-01-01 00:00:00',
  `inputBy` varchar(50) DEFAULT NULL,
  `updateDate` datetime DEFAULT '2023-01-01 00:00:00',
  `updateBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.v1_journal_header: ~2 rows (approximately)
INSERT INTO `v1_journal_header` (`id`, `bookId`, `fId`, `label`, `sorting`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(1, 1, 'f1', 'Setup', 99, '2023-01-01 00:00:00', NULL, '2023-01-01 00:00:00', NULL),
	(2, 1, 'f2', 'D1 MACD', 99, '2023-01-01 00:00:00', NULL, '2023-01-01 00:00:00', NULL);

-- Dumping structure for table tradingbook.v1_journal_img
CREATE TABLE IF NOT EXISTS `v1_journal_img` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `sorting` int(3) DEFAULT 99,
  `inputDate` datetime DEFAULT '2023-01-01 00:00:00',
  `inputBy` varchar(50) DEFAULT NULL,
  `updateDate` datetime DEFAULT '2023-01-01 00:00:00',
  `updateBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.v1_journal_img: ~35 rows (approximately)
INSERT INTO `v1_journal_img` (`id`, `journalId`, `image`, `label`, `sorting`, `inputDate`, `inputBy`, `updateDate`, `updateBy`) VALUES
	(20, '1', 'http://localhost/application/tradingbook/api/uploads/images/1681906828NZDUSD_2023-04-19_19-20-09_6b383.png', NULL, 3, '2023-04-19 14:20:28', NULL, '2023-01-01 00:00:00', NULL),
	(21, '2', 'http://localhost/application/tradingbook/api/uploads/images/1681907557NZDUSD_2023-04-19_19-32-15_420eb.png', NULL, 1, '2023-04-19 14:32:37', NULL, '2023-01-01 00:00:00', NULL),
	(22, '2', 'http://localhost/application/tradingbook/api/uploads/images/1681907596NZDUSD_2023-04-19_19-33-10_c8c1b.png', NULL, 3, '2023-04-19 14:33:16', NULL, '2023-01-01 00:00:00', NULL),
	(23, '10', 'http://localhost/application/tradingbook/api/uploads/images/1681916633NZDUSD_2023-04-19_22-03-48_39b0a.png', NULL, 99, '2023-04-19 17:03:53', NULL, '2023-01-01 00:00:00', NULL),
	(24, '10', 'http://localhost/application/tradingbook/api/uploads/images/1681916978NZDUSD_2023-04-19_22-09-29_388eb.png', NULL, 99, '2023-04-19 17:09:38', NULL, '2023-01-01 00:00:00', NULL),
	(25, '11', 'http://localhost/application/tradingbook/api/uploads/images/1681917833NZDUSD_2023-04-19_22-23-43_7c185.png', NULL, 99, '2023-04-19 17:23:54', NULL, '2023-01-01 00:00:00', NULL),
	(27, '11', 'http://localhost/application/tradingbook/api/uploads/images/1681918557NZDUSD_2023-04-19_22-35-45_b9aff.png', NULL, 99, '2023-04-19 17:35:57', NULL, '2023-01-01 00:00:00', NULL),
	(28, '2', 'http://localhost/application/tradingbook/api/uploads/images/1681927288NZDUSD_2023-04-20_01-01-07_07c05.png', NULL, 2, '2023-04-19 20:01:28', NULL, '2023-01-01 00:00:00', NULL),
	(29, '2', 'http://localhost/application/tradingbook/api/uploads/images/1681927386NZDUSD_2023-04-20_01-03-02_da7ff.png', NULL, 4, '2023-04-19 20:03:06', NULL, '2023-01-01 00:00:00', NULL),
	(30, '1', 'http://localhost/application/tradingbook/api/uploads/images/1681927728NZDUSD_2023-04-20_01-08-43_ba536.png', NULL, 2, '2023-04-19 20:08:48', NULL, '2023-01-01 00:00:00', NULL),
	(31, '1', 'http://localhost/application/tradingbook/api/uploads/images/1681927836NZDUSD_2023-04-20_01-10-31_49584.png', NULL, 99, '2023-04-19 20:10:36', NULL, '2023-01-01 00:00:00', NULL),
	(32, '1', 'http://localhost/application/tradingbook/api/uploads/images/1681928036NZDUSD_2023-04-20_01-13-47_ec41b.png', NULL, 1, '2023-04-19 20:13:56', NULL, '2023-01-01 00:00:00', NULL),
	(33, '12', 'http://localhost/application/tradingbook/api/uploads/images/1681973528EURUSD_2023-04-20_13-52-06_0773c.png', NULL, 99, '2023-04-20 08:52:08', NULL, '2023-01-01 00:00:00', NULL),
	(34, '12', 'http://localhost/application/tradingbook/api/uploads/images/1681973589EURUSD_2023-04-20_13-53-03_3e3e0.png', NULL, 99, '2023-04-20 08:53:09', NULL, '2023-01-01 00:00:00', NULL),
	(35, '13', 'http://localhost/application/tradingbook/api/uploads/images/1682010329EURUSD_2023-04-21_00-02-34_82dfd.png', NULL, 1, '2023-04-20 19:05:29', NULL, '2023-01-01 00:00:00', NULL),
	(36, '13', 'http://localhost/application/tradingbook/api/uploads/images/1682010334EURUSD_2023-04-21_00-02-23_a25c9.png', NULL, 2, '2023-04-20 19:05:34', NULL, '2023-01-01 00:00:00', NULL),
	(38, '13', 'http://localhost/application/tradingbook/api/uploads/images/1682010567EURUSD_2023-04-21_00-09-05_9c426.png', NULL, 99, '2023-04-20 19:09:27', NULL, '2023-01-01 00:00:00', NULL),
	(39, '14', 'http://localhost/application/tradingbook/api/uploads/images/1682011275EURUSD_2023-04-21_00-21-12_b0d24.png', NULL, 1, '2023-04-20 19:21:15', NULL, '2023-01-01 00:00:00', NULL),
	(40, '14', 'http://localhost/application/tradingbook/api/uploads/images/1682011608EURUSD_2023-04-21_00-26-42_c0758.png', NULL, 2, '2023-04-20 19:26:48', NULL, '2023-01-01 00:00:00', NULL),
	(41, '15', 'http://localhost/application/tradingbook/api/uploads/images/1682069092NZDJPY_2023-04-21_16-24-38_942df.png', NULL, 1, '2023-04-21 11:24:52', NULL, '2023-01-01 00:00:00', NULL),
	(42, '15', 'http://localhost/application/tradingbook/api/uploads/images/1682069255NZDJPY_2023-04-21_16-27-31_e6de4.png', NULL, 99, '2023-04-21 11:27:35', NULL, '2023-01-01 00:00:00', NULL),
	(43, '15', 'http://localhost/application/tradingbook/api/uploads/images/1682069388NZDJPY_2023-04-21_16-29-43_0c1b7.png', NULL, 99, '2023-04-21 11:29:48', NULL, '2023-01-01 00:00:00', NULL),
	(44, '17', 'http://localhost/application/tradingbook/api/uploads/images/1682245932EURUSD_2023-04-23_17-32-09_d17ef.png', NULL, 99, '2023-04-23 12:32:12', NULL, '2023-01-01 00:00:00', NULL),
	(45, '17', 'http://localhost/application/tradingbook/api/uploads/images/1682246217EURUSD_2023-04-23_17-36-52_990e5.png', NULL, 99, '2023-04-23 12:36:57', NULL, '2023-01-01 00:00:00', NULL),
	(46, '18', 'http://localhost/application/tradingbook/api/uploads/images/1682248376EURUSD_2023-04-23_18-12-41_416b3.png', NULL, 99, '2023-04-23 13:12:56', NULL, '2023-01-01 00:00:00', NULL),
	(47, '18', 'http://localhost/application/tradingbook/api/uploads/images/1682248400EURUSD_2023-04-23_18-13-15_6b183.png', NULL, 99, '2023-04-23 13:13:20', NULL, '2023-01-01 00:00:00', NULL),
	(51, '19', 'http://localhost/application/tradingbook/api/uploads/images/1682250856EURUSD_2023-04-23_18-54-01_9f704.png', NULL, 2, '2023-04-23 13:54:16', NULL, '2023-01-01 00:00:00', NULL),
	(52, '19', 'http://localhost/application/tradingbook/api/uploads/images/1682250880EURUSD_2023-04-23_18-54-33_bf110.png', NULL, 1, '2023-04-23 13:54:40', NULL, '2023-01-01 00:00:00', NULL),
	(53, '20', 'http://localhost/application/tradingbook/api/uploads/images/1682779192USDJPY_2023-04-29_21-32-36_6f3ab.png', NULL, 99, '2023-04-29 16:39:52', NULL, '2023-01-01 00:00:00', NULL),
	(54, '20', 'http://localhost/application/tradingbook/api/uploads/images/1682779224USDJPY_2023-04-29_21-40-20_823b7.png', NULL, 99, '2023-04-29 16:40:24', NULL, '2023-01-01 00:00:00', NULL),
	(55, '21', 'http://localhost/application/tradingbook/api/uploads/images/1682784961EURUSD_2023-04-29_23-15-58_58f38.png', NULL, 99, '2023-04-29 18:16:01', NULL, '2023-01-01 00:00:00', NULL),
	(56, '21', 'http://localhost/application/tradingbook/api/uploads/images/1682785044EURUSD_2023-04-29_23-17-19_a52ad.png', NULL, 99, '2023-04-29 18:17:24', NULL, '2023-01-01 00:00:00', NULL),
	(57, '22', 'http://localhost/application/tradingbook/api/uploads/images/1682785910GBPUSD_2023-04-29_23-31-35_55174.png', NULL, 99, '2023-04-29 18:31:50', NULL, '2023-01-01 00:00:00', NULL),
	(58, '22', 'http://localhost/application/tradingbook/api/uploads/images/1682786060GBPUSD_2023-04-29_23-34-16_865f7.png', NULL, 99, '2023-04-29 18:34:20', NULL, '2023-01-01 00:00:00', NULL),
	(59, '15', 'http://localhost/application/tradingbook/api/uploads/images/1682786321NZDJPY_2023-04-29_23-38-34_8f87e.png', NULL, 99, '2023-04-29 18:38:41', NULL, '2023-01-01 00:00:00', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
