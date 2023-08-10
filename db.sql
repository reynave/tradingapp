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
  `email` varchar(250) NOT NULL,
  `googleSub` varchar(250) NOT NULL,
  `facebookSub` varchar(250) NOT NULL,
  `name` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `picture` varchar(250) NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `status` int(3) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.account: ~5 rows (approximately)
INSERT INTO `account` (`id`, `email`, `googleSub`, `facebookSub`, `name`, `password`, `picture`, `presence`, `status`, `input_date`, `update_date`) VALUES
	('230101.0001', 'sayamaai@emai.com', '', '', 'dia', '4297f44b13955235245b2497399d7a93', 'https://i.pravatar.cc/150?img=24', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('230808.000005', 'felix.mirrel@gmail.com', '108631244313733297359', '', 'Felix Mirrel', '', 'https://lh3.googleusercontent.com/a/AAcHTtd7docEnQHAmhogI-8lEVJ9giw7wmguIy4nPMBY5Y6oEzc=s96-c', 1, 1, '2023-08-08 18:14:52', '2022-01-01 00:00:00'),
	('230809.000006', 'felix.renaldi@gmail.com', '101221617854665478148', '', 'Felix Reynave', '', 'https://lh3.googleusercontent.com/a/AAcHTteF-aAeCUrnrEsBw0F8ma24A2kHTqOzCXVzRlwIMfyd6DM=s96-c', 1, 1, '2023-08-09 04:12:53', '2022-01-01 00:00:00'),
	('C0012', 'wawa@email.com', '', '', 'Wawa', '4297f44b13955235245b2497399d7a93', 'https://i.pravatar.cc/150?img=37', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('C5555', 'mada@email.com', '', '', 'Mada', '4297f44b13955235245b2497399d7a93', 'https://i.pravatar.cc/150?img=32', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00');

-- Dumping structure for table tradingbook.account_login
CREATE TABLE IF NOT EXISTS `account_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `jti` varchar(50) DEFAULT NULL,
  `iss` varchar(50) DEFAULT NULL,
  `expDate` datetime DEFAULT NULL,
  `getUserAgent` varchar(250) NOT NULL DEFAULT '',
  `ip` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.account_login: ~9 rows (approximately)
INSERT INTO `account_login` (`id`, `accountId`, `jti`, `iss`, `expDate`, `getUserAgent`, `ip`, `input_date`) VALUES
	(26, '230101.0001', NULL, NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82', '::1', '2023-07-20 04:54:10'),
	(29, '230101.0001', 'a16ad5e58572c11ee67290978a71d0d102e8d37a', 'https://accounts.google.com', '2023-09-07 17:55:13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-08 17:55:13'),
	(30, '230101.0001', '4b36856fe692367a06d8487eda94182a23ffafce', 'https://accounts.google.com', '2023-09-07 18:02:21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-08 18:02:21'),
	(31, '00000002', 'e3e1497a3bbdabe8575f6725d140c94d8ba772bb', 'https://accounts.google.com', '2023-09-07 18:10:33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-08 18:10:33'),
	(44, '230809.000006', '88976ebc74206f9b7ddba249ffc02c9573cf800c', 'https://accounts.google.com', '2023-09-08 09:01:20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-09 09:01:20'),
	(45, '230809.000006', 'ceb4f6338b70cd860035556e5b255160299abb6e', 'https://accounts.google.com', '2023-09-08 09:35:21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-09 09:35:21'),
	(46, '230809.000006', 'aeb3a1f8e09ee6e8bda9c0ef6a5cbf517fc032bf', 'https://accounts.google.com', '2023-09-08 09:36:04', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-09 09:36:04'),
	(47, '230809.000006', 'ee6fae8ca518a2f67cc32bb8d873df8cf1c6921a', 'https://accounts.google.com', '2023-09-08 09:36:32', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-09 09:36:32'),
	(48, '230809.000006', 'bd9cf0abeda51d04ba5d4802d607241713f8389a', 'https://accounts.google.com', '2023-09-08 09:40:13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', '::1', '2023-08-09 09:40:13');

-- Dumping structure for table tradingbook.account_team
CREATE TABLE IF NOT EXISTS `account_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL,
  `invitedId` varchar(50) NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `status` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL,
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.account_team: ~4 rows (approximately)
INSERT INTO `account_team` (`id`, `accountId`, `invitedId`, `presence`, `status`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(1, '230809.000006', '230101.0001', 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(2, '230809.000006', 'C0012', 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(3, '230809.000006', 'C5555', 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(4, '230809.000006', '230809.000006', 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', '');

-- Dumping structure for table tradingbook.account_token
CREATE TABLE IF NOT EXISTS `account_token` (
  `id` varchar(50) NOT NULL,
  `accountId` varchar(50) DEFAULT NULL,
  `token` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.account_token: ~0 rows (approximately)

-- Dumping structure for table tradingbook.auto_number
CREATE TABLE IF NOT EXISTS `auto_number` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `prefix` varchar(50) NOT NULL DEFAULT '',
  `digit` int(10) NOT NULL DEFAULT 1,
  `runningNumber` int(10) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.auto_number: ~3 rows (approximately)
INSERT INTO `auto_number` (`id`, `name`, `prefix`, `digit`, `runningNumber`, `updateDate`) VALUES
	(1, 'account', '', 6, 6, '0000-00-00 00:00:00'),
	(10, 'backtest', 'J23-', 6, 56, '0000-00-00 00:00:00'),
	(11, 'book', 'B23-', 4, 11, '0000-00-00 00:00:00');

-- Dumping structure for table tradingbook.book
CREATE TABLE IF NOT EXISTS `book` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `accountId` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `ilock` int(1) DEFAULT 0,
  `sorting` int(3) DEFAULT 99,
  `presence` int(1) DEFAULT 1,
  `input_date` datetime DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) DEFAULT NULL,
  `update_date` datetime DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingbook.book: ~9 rows (approximately)
INSERT INTO `book` (`id`, `accountId`, `name`, `ilock`, `sorting`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	('23060001', '230101.0001', 'Real Trading MT4', 0, 1, 1, '2023-01-01 00:00:00', NULL, '2023-07-25 05:51:57', '230101.0001'),
	('23060003', '230101.0001', 'Backtest 2023 Feb1', 0, 2, 1, '2023-01-01 00:00:00', NULL, '2023-07-03 08:01:52', '230101.0001'),
	('23060004', '230101.0001', 'Share to Me', 1, 999, 1, '2023-01-01 00:00:00', NULL, '2023-07-08 18:45:03', '230101.0001'),
	('23060008', '230809.000006', 'Trader 101', 0, 1, 1, '2023-08-09 10:46:52', '230809.000006', '2023-01-01 00:00:00', NULL),
	('23060009', '230809.000006', 'trade for dummy', 0, 2, 1, '2023-08-09 10:47:08', '230809.000006', '2023-01-01 00:00:00', NULL),
	('23060010', '230809.000006', 'SMC Hub 1.0', 0, 3, 1, '2023-08-09 10:48:41', '230809.000006', '2023-01-01 00:00:00', NULL),
	('23060011', '230809.000006', 'AB', 0, 4, 1, '2023-08-09 18:52:04', '230809.000006', '2023-01-01 00:00:00', NULL),
	('cook1', 'C0012', 'Book1', 0, 99, 1, '2023-01-01 00:00:00', NULL, '2023-01-01 00:00:00', NULL),
	('zook1', 'C5555', 'Book1', 0, 99, 1, '2023-01-01 00:00:00', NULL, '2023-01-01 00:00:00', NULL);

-- Dumping structure for table tradingbook.chartjs_type
CREATE TABLE IF NOT EXISTS `chartjs_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itype` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `image` varchar(250) NOT NULL DEFAULT '',
  `doc` text NOT NULL,
  `sorting` int(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.chartjs_type: ~9 rows (approximately)
INSERT INTO `chartjs_type` (`id`, `itype`, `label`, `status`, `image`, `doc`, `sorting`) VALUES
	(1, 'bar', 'Bars', 1, './assets/img/chartjs/bar.jpg', 'https://www.chartjs.org/docs/latest/samples/bar/stacked.html', 1),
	(2, 'bar', 'Stacked Bars', 1, './assets/img/chartjs/stackedBars.jpg', 'https://www.chartjs.org/docs/latest/samples/bar/stacked.html', 2),
	(3, 'line', 'Line', 1, './assets/img/chartjs/line.jpg', 'https://www.chartjs.org/docs/latest/samples/line/line.html', 3),
	(4, 'line', 'Line Filled', 1, './assets/img/chartjs/lineFilled.jpg', '', 4),
	(5, 'line', 'Stepped Line', 1, './assets/img/chartjs/steppedLine.jpg', 'https://www.chartjs.org/docs/latest/samples/line/stepped.html', 5),
	(6, 'radar', 'Radar', 1, './assets/img/chartjs/radar.jpg', 'https://www.chartjs.org/docs/latest/samples/other-charts/radar.html', 6),
	(7, 'pie', 'Pie', 1, './assets/img/chartjs/pie.jpg', 'https://www.chartjs.org/docs/latest/samples/other-charts/pie.html', 7),
	(8, 'pie', 'Polar area', 1, './assets/img/chartjs/polarArea.jpg', '', 8),
	(9, 'scatter', 'Scatter', 1, './assets/img/chartjs/scatter.jpg', 'https://www.chartjs.org/docs/latest/samples/other-charts/scatter.html', 9);

-- Dumping structure for table tradingbook.color
CREATE TABLE IF NOT EXISTS `color` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.color: ~22 rows (approximately)
INSERT INTO `color` (`id`, `color`) VALUES
	(1, '#393737'),
	(10, '#484D51'),
	(11, '#818D97'),
	(12, '#8FACC0'),
	(20, '#331D2C'),
	(21, '#3F2E3E'),
	(22, '#A78295'),
	(101, '#0278AE'),
	(102, '#53CDE2'),
	(103, '#51ADCF'),
	(200, '#0B666A'),
	(201, '#35A29F'),
	(202, '#1B9C85'),
	(300, '#E60965'),
	(301, '#F94892'),
	(302, '#FFA1C9'),
	(304, '#7E1717'),
	(400, '#FFD93D'),
	(410, '#DC8449'),
	(411, '#F1C27B'),
	(500, '#C04A82');

-- Dumping structure for table tradingbook.journal
CREATE TABLE IF NOT EXISTS `journal` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `templateCode` varchar(20) NOT NULL DEFAULT '1',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
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

-- Dumping data for table tradingbook.journal: ~30 rows (approximately)
INSERT INTO `journal` (`id`, `accountId`, `templateCode`, `name`, `url`, `permissionId`, `borderColor`, `backgroundColor`, `version`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	('B1-000026', '230101.0001', '0', 'SETUP NORA', '649d34f8bb389', 1, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-29 07:38:32', '230101.0001', '2023-08-06 18:45:40', '230101.0001'),
	('B1-000027', '230101.0001', '0', 'Book Order 充サ際査メフカ234', '649d34fa55074', 20, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-29 07:38:34', '230101.0001', '2023-08-07 12:06:34', '230101.0001'),
	('B1-000028', '230101.0001', '0', 'QM1', '649d34fb0bd97', 1, '#3AA6B9', '#C1ECE4', '1', 1, '2023-06-29 07:38:35', '230101.0001', '2023-08-02 05:42:26', '230101.0001'),
	('B1-000029', '230101.0001', '0', 'SNR 100', '649d34feba584', 0, '#3AA6B9', '#C1ECE4', '1', 0, '2023-06-29 07:38:38', '230101.0001', '2023-07-02 12:40:58', '230101.0001'),
	('B1-000031', '230101.0001', '1', 'New 2023-07-02 18:34', '64a1c33be7377', 0, '#3AA6B9', '#C1ECE4', '1', 0, '2023-07-02 18:34:35', '230101.0001', '2023-07-02 18:55:15', '230101.0001'),
	('B1-000032', '230101.0001', '1', 'New 2023-07-02 18:47', '64a1c658dc29a', 0, '#3AA6B9', '#C1ECE4', '1', 0, '2023-07-02 18:47:52', '230101.0001', '2023-07-02 18:55:15', '230101.0001'),
	('B1-000033', '230101.0001', '1', 'abcb', '64a1c6dbd3b9b', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-02 18:50:03', '230101.0001', '2023-07-02 18:50:03', '230101.0001'),
	('B1-000034', '230101.0001', '0', 'hahah', '64a1c7e7187e9', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-02 18:54:31', '230101.0001', '2023-07-02 18:54:31', '230101.0001'),
	('B1-000035', '230101.0001', '0', 'data baru 1', '64a1c8d3a6eb0', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-02 18:58:27', '230101.0001', '2023-07-02 18:58:27', '230101.0001'),
	('B1-000036', '230101.0001', '0', 'dua lipa Setup', '64a255db06717', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-03 05:00:11', '230101.0001', '2023-07-03 05:00:11', '230101.0001'),
	('B1-000037', '230101.0001', '0', '', '64a255dd790de', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-03 05:00:13', '230101.0001', '2023-07-03 05:00:18', '230101.0001'),
	('B1-000038', '230101.0001', '0', 'sdfadf', '64a2560c244a2', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-03 05:01:00', '230101.0001', '2023-07-03 05:01:21', '230101.0001'),
	('B1-000039', '230101.0001', '0', '34234', '64a2561a28d38', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-03 05:01:14', '230101.0001', '2023-07-03 05:01:21', '230101.0001'),
	('B1-000040', 'C0012', '1', 'abc wawa', '64b8bde5181ca', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-20 04:53:57', 'C0012', '2023-07-20 04:53:57', 'C0012'),
	('B1-000041', '230101.0001', '1', 'ABV', '64bf57b4f257e', 0, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-25 05:03:48', '230101.0001', '2023-07-25 05:03:48', '230101.0001'),
	('B1-000042', '230101.0001', '1', 'Vusal Zeinalov - Nagorno Mist', '64bf57f0db211', 20, '#3AA6B9', '#C1ECE4', '1', 1, '2023-07-25 05:04:48', '230101.0001', '2023-08-02 11:40:40', '230101.0001'),
	('B1-000043', '230101.0001', '1', 'salamat datang', '64c9ed22923a2', 0, '#3AA6B9', '#C1ECE4', '1', 0, '2023-08-02 05:44:02', '230101.0001', '2023-08-02 05:44:21', '230101.0001'),
	('B1-000044', '230101.0001', '1', 'abc', '64ca422390c27', 1, '', '', '1', 0, '2023-08-02 11:46:43', '230101.0001', '2023-08-02 11:54:47', '230101.0001'),
	('B1-000045', '230101.0001', '1', 'abc 1', '64ca423f21ef8', 20, '', '', '1', 0, '2023-08-02 11:47:11', '230101.0001', '2023-08-02 11:54:47', '230101.0001'),
	('B1-000046', '230101.0001', '1', 'SMC ver 1', '64ca42ad5c33c', 20, '', '', '1', 0, '2023-08-02 11:49:01', '230101.0001', '2023-08-02 11:54:47', '230101.0001'),
	('B1-000047', '230101.0001', 'blank', 'templateCode', '64ca442137c84', 1, '', '', '1', 0, '2023-08-02 11:55:13', '230101.0001', '2023-08-03 08:55:44', '230101.0001'),
	('B1-000048', '230101.0001', 'backtest', 'asa', '64ca45c851d76', 1, '', '', '1', 1, '2023-08-02 12:02:16', '230101.0001', '2023-08-02 12:02:16', '230101.0001'),
	('B1-000049', '230101.0001', 'backtest', 'asa', '64ca45ea9069b', 1, '', '', '1', 0, '2023-08-02 12:02:50', '230101.0001', '2023-08-02 17:22:03', '230101.0001'),
	('B1-000050', '230101.0001', 'backtest', 'An1', '64ca907770760', 1, '', '', '1', 0, '2023-08-02 17:20:55', '230101.0001', '2023-08-02 17:22:03', '230101.0001'),
	('B1-000051', '230101.0001', 'backtest', 'test123', '64ca90e4c6a98', 1, '', '', '1', 1, '2023-08-02 17:22:44', '230101.0001', '2023-08-02 17:22:44', '230101.0001'),
	('B1-000052', '230101.0001', 'backtest', 'SMC33', '64ce07dd40dc4', 1, '', '', '1', 1, '2023-08-05 08:27:09', '230101.0001', '2023-08-07 10:57:12', '230101.0001'),
	('B1-000053', '230809.000006', 'backtest', 'Jonnyf', '64d37951ee136', 1, '', '', '1', 1, '2023-08-09 11:32:33', '230809.000006', '2023-08-09 11:32:33', '230809.000006'),
	('B1-000054', '230809.000006', 'backtest', 'MS setup', '64d4f98b48502', 1, '', '', '1', 1, '2023-08-10 14:51:55', '230809.000006', '2023-08-10 14:51:55', '230809.000006'),
	('B1-000055', '230809.000006', 'backtest', 'missAV trade database', '64d4f99a42016', 1, '', '', '1', 1, '2023-08-10 14:52:10', '230809.000006', '2023-08-10 14:52:10', '230809.000006'),
	('B1-000056', '230809.000006', 'general', 'eToro channel', '64d4f9b114be6', 1, '', '', '1', 1, '2023-08-10 14:52:33', '230809.000006', '2023-08-10 14:52:33', '230809.000006');

-- Dumping structure for table tradingbook.journal_access
CREATE TABLE IF NOT EXISTS `journal_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookId` varchar(50) NOT NULL DEFAULT '',
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `owner` int(1) NOT NULL DEFAULT 0,
  `star` int(1) NOT NULL DEFAULT 0,
  `editable` int(1) NOT NULL DEFAULT 0,
  `changeable` int(1) NOT NULL DEFAULT 0,
  `admin` int(11) NOT NULL DEFAULT 0,
  `sorting` int(3) NOT NULL DEFAULT 99,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_access: ~31 rows (approximately)
INSERT INTO `journal_access` (`id`, `bookId`, `accountId`, `journalId`, `owner`, `star`, `editable`, `changeable`, `admin`, `sorting`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(26, '23060001', '230101.0001', 'B1-000026', 1, 0, 1, 1, 1, 3, 1, '2023-06-29 07:38:32', '230101.0001', '2023-07-02 12:35:56', '230101.0001'),
	(27, '23060001', '230101.0001', 'B1-000027', 1, 0, 1, 1, 1, 2, 1, '2023-06-29 07:38:34', '230101.0001', '2023-07-18 06:38:30', '230101.0001'),
	(28, '23060001', '230101.0001', 'B1-000028', 1, 0, 1, 1, 1, 1, 1, '2023-06-29 07:38:35', '230101.0001', '2023-07-02 12:35:56', '230101.0001'),
	(31, 'zook1', 'C5555', 'B1-000026', 0, 0, 1, 0, 0, 99, 1, '2023-06-29 07:40:07', '230101.0001', '2023-06-29 07:40:07', '230101.0001'),
	(43, 'zook1', 'C5555', 'B1-000027', 0, 0, 1, 0, 0, 99, 4, '2023-06-29 18:48:11', '230101.0001', '2023-08-02 10:23:45', '230101.0001'),
	(44, 'cook1', 'C0012', 'B1-000029', 0, 0, 1, 0, 0, 99, 4, '2023-06-29 18:49:27', '230101.0001', '2023-07-02 12:40:58', '230101.0001'),
	(47, 'zook1', 'C5555', 'B1-000029', 0, 0, 1, 0, 0, 99, 4, '2023-06-29 18:54:37', '230101.0001', '2023-07-02 12:40:58', '230101.0001'),
	(51, '23060003', '230101.0001', 'B1-000033', 1, 0, 1, 1, 1, 99, 1, '2023-07-02 18:50:03', '230101.0001', '2023-07-08 18:32:48', '230101.0001'),
	(52, '23060003', '230101.0001', 'B1-000034', 1, 0, 1, 1, 1, 99, 1, '2023-07-02 18:54:31', '230101.0001', '2023-07-08 18:32:45', '230101.0001'),
	(53, '23060004', '230101.0001', 'B1-000035', 1, 0, 1, 1, 1, 99, 1, '2023-07-02 18:58:27', '230101.0001', '2023-07-08 18:32:55', '230101.0001'),
	(54, '23060004', '230101.0001', 'B1-000036', 1, 0, 1, 1, 1, 99, 1, '2023-07-03 05:00:11', '230101.0001', '2023-07-08 18:32:53', '230101.0001'),
	(58, 'cook1', 'C0012', 'B1-000040', 1, 0, 1, 1, 1, 99, 1, '2023-07-20 04:53:57', 'C0012', '2023-07-20 04:53:57', 'C0012'),
	(59, '23060001', '230101.0001', 'B1-000041', 1, 0, 1, 1, 1, 99, 1, '2023-07-25 05:03:48', '230101.0001', '2023-07-25 05:03:48', '230101.0001'),
	(60, '23060001', '230101.0001', 'B1-000042', 1, 0, 1, 1, 1, 99, 1, '2023-07-25 05:04:48', '230101.0001', '2023-07-25 05:04:48', '230101.0001'),
	(61, '23060001', '230101.0001', 'B1-000043', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 05:44:02', '230101.0001', '2023-08-02 17:21:58', '230101.0001'),
	(62, '23060001', '230101.0001', 'B1-000044', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 11:46:43', '230101.0001', '2023-08-02 17:21:58', '230101.0001'),
	(63, '23060001', '230101.0001', 'B1-000045', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 11:47:11', '230101.0001', '2023-08-02 17:21:58', '230101.0001'),
	(64, '23060001', '230101.0001', 'B1-000046', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 11:49:01', '230101.0001', '2023-08-02 17:21:58', '230101.0001'),
	(69, '23060001', '230101.0001', 'B1-000047', 1, 0, 1, 1, 1, 99, 4, '2023-08-02 11:55:13', '230101.0001', '2023-08-03 08:55:44', '230101.0001'),
	(71, '23060001', '230101.0001', 'B1-000049', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 12:02:50', '230101.0001', '2023-08-02 17:22:05', '230101.0001'),
	(72, '23060001', '230101.0001', 'B1-000050', 1, 0, 1, 1, 1, 99, 0, '2023-08-02 17:20:55', '230101.0001', '2023-08-02 17:22:05', '230101.0001'),
	(73, '23060001', '230101.0001', 'B1-000051', 1, 0, 1, 1, 1, 99, 1, '2023-08-02 17:22:44', '230101.0001', '2023-08-02 17:22:44', '230101.0001'),
	(74, '23060001', '230101.0001', 'B1-000052', 1, 0, 1, 1, 1, 99, 1, '2023-08-05 08:27:09', '230101.0001', '2023-08-05 08:27:09', '230101.0001'),
	(75, '', 'C0012', 'B1-000051', 0, 0, 1, 0, 0, 99, 1, '2023-08-06 18:43:27', '230101.0001', '2023-08-06 18:43:27', '230101.0001'),
	(76, '', 'C0012', 'B1-000027', 0, 0, 1, 0, 0, 99, 0, '2023-08-07 11:26:00', '230101.0001', '2023-08-07 11:26:00', '230101.0001'),
	(77, '', 'C0012', 'B1-000027', 0, 0, 1, 0, 0, 99, 1, '2023-08-07 11:26:00', '230101.0001', '2023-08-07 11:26:00', '230101.0001'),
	(78, '23060008', '230809.000006', 'B1-000053', 1, 0, 1, 1, 1, 99, 1, '2023-08-09 11:32:33', '230809.000006', '2023-08-09 11:32:33', '230809.000006'),
	(79, '23060008', '230809.000006', 'B1-000054', 1, 0, 1, 1, 1, 99, 1, '2023-08-10 14:51:55', '230809.000006', '2023-08-10 14:51:55', '230809.000006'),
	(80, '23060008', '230809.000006', 'B1-000055', 1, 1, 1, 1, 1, 99, 1, '2023-08-10 14:52:10', '230809.000006', '2023-08-10 14:52:10', '230809.000006'),
	(81, '23060009', '230809.000006', 'B1-000056', 1, 1, 1, 1, 1, 99, 1, '2023-08-10 14:52:33', '230809.000006', '2023-08-10 14:52:33', '230809.000006'),
	(82, '23060001', '230809.000006', 'B1-000027', 0, 1, 1, 1, 0, 2, 1, '2023-06-29 07:38:34', '230101.0001', '2023-07-18 06:38:30', '230101.0001');

-- Dumping structure for table tradingbook.journal_chart_type
CREATE TABLE IF NOT EXISTS `journal_chart_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(11) DEFAULT NULL,
  `chartjsTypeId` int(3) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_chart_type: ~23 rows (approximately)
INSERT INTO `journal_chart_type` (`id`, `journalTableViewId`, `chartjsTypeId`, `status`, `presence`, `update_by`, `update_date`, `input_by`, `input_date`) VALUES
	(12, 11, 3, 1, 1, '230101.0001', '2023-08-04 15:58:49', '230101.0001', '2023-07-28 09:50:42'),
	(13, 12, 1, 1, 1, '230101.0001', '2023-08-03 18:01:43', '230101.0001', '2023-07-28 09:55:35'),
	(14, 18, 1, 1, 1, '230101.0001', '2023-08-03 05:19:36', '230101.0001', '2023-08-02 17:57:44'),
	(15, 25, 3, 1, 1, '230101.0001', '2023-08-03 17:00:25', '230101.0001', '2023-08-03 17:00:12'),
	(16, 22, 1, 1, 1, '230101.0001', '2023-08-03 17:00:49', '230101.0001', '2023-08-03 17:00:39'),
	(17, 23, 1, 1, 1, '230101.0001', '2023-08-03 17:01:03', '230101.0001', '2023-08-03 17:01:01'),
	(18, 24, 1, 1, 1, '230101.0001', '2023-08-03 17:12:09', '230101.0001', '2023-08-03 17:09:13'),
	(19, 26, 1, 1, 1, '230101.0001', '2023-08-03 17:15:34', '230101.0001', '2023-08-03 17:14:32'),
	(20, 27, 1, 1, 1, '230101.0001', '2023-08-03 17:28:42', '230101.0001', '2023-08-03 17:24:05'),
	(21, 29, 1, 1, 1, '230101.0001', '2023-08-03 17:29:41', '230101.0001', '2023-08-03 17:29:17'),
	(22, 13, 1, 1, 1, '230101.0001', '2023-08-03 18:17:25', '230101.0001', '2023-08-03 17:34:51'),
	(23, 19, 1, 1, 1, '230101.0001', '2023-08-03 18:09:20', '230101.0001', '2023-08-03 18:07:51'),
	(24, 30, 1, 1, 1, '230101.0001', '2023-08-03 18:48:48', '230101.0001', '2023-08-03 18:10:07'),
	(25, 31, 1, 1, 1, '230101.0001', '2023-08-03 18:51:55', '230101.0001', '2023-08-03 18:50:01'),
	(26, 32, 1, 1, 1, '230101.0001', '2023-08-04 03:54:19', '230101.0001', '2023-08-03 19:02:27'),
	(27, 33, 1, 1, 1, '230101.0001', '2023-08-03 20:14:11', '230101.0001', '2023-08-03 20:12:55'),
	(28, 36, 1, 1, 1, '230101.0001', '2023-08-04 03:56:52', '230101.0001', '2023-08-04 03:56:43'),
	(29, 35, 1, 1, 1, '230101.0001', '2023-08-04 11:33:59', '230101.0001', '2023-08-04 11:33:54'),
	(30, 37, 1, 1, 1, '230101.0001', '2023-08-04 11:34:10', '230101.0001', '2023-08-04 11:34:07'),
	(31, 39, 1, 1, 1, '230101.0001', '2023-08-05 08:28:18', '230101.0001', '2023-08-05 08:28:03'),
	(32, 40, 3, 1, 1, '230101.0001', '2023-08-06 04:12:41', '230101.0001', '2023-08-06 04:12:40'),
	(33, 42, 1, 1, 1, '230101.0001', '2023-08-06 18:08:00', '230101.0001', '2023-08-06 04:34:59'),
	(34, 43, 3, 1, 1, '230101.0001', '2023-08-06 04:35:27', '230101.0001', '2023-08-06 04:35:17');

-- Dumping structure for table tradingbook.journal_chart_where
CREATE TABLE IF NOT EXISTS `journal_chart_where` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_chart_where: ~16 rows (approximately)
INSERT INTO `journal_chart_where` (`id`, `journalTableViewId`, `value`, `status`, `presence`, `update_by`, `update_date`, `input_by`, `input_date`) VALUES
	(9, 11, '', 1, 1, '230101.0001', '2023-08-04 15:58:49', '230101.0001', '2023-07-28 09:50:42'),
	(10, 12, 'f4', 1, 1, '230101.0001', '2023-08-03 18:01:43', '230101.0001', '2023-07-28 09:55:35'),
	(11, 18, '', 1, 1, '230101.0001', '2023-08-03 05:19:36', '230101.0001', '2023-08-02 17:57:44'),
	(12, 13, 'f13', 1, 1, '230101.0001', '2023-08-03 18:17:25', '230101.0001', '2023-08-03 17:46:50'),
	(14, 19, 'f13', 1, 1, '230101.0001', '2023-08-03 18:09:20', '230101.0001', '2023-08-03 18:08:43'),
	(15, 30, '', 1, 1, '230101.0001', '2023-08-03 18:48:48', '230101.0001', '2023-08-03 18:10:12'),
	(16, 31, '', 1, 1, '230101.0001', '2023-08-03 18:50:12', '230101.0001', '2023-08-03 18:50:11'),
	(17, 33, '', 1, 1, '230101.0001', '2023-08-03 20:14:11', '230101.0001', '2023-08-03 20:12:57'),
	(18, 32, '', 1, 1, '230101.0001', '2023-08-04 03:54:19', '230101.0001', '2023-08-04 03:54:19'),
	(19, 36, 'f13', 1, 1, '230101.0001', '2023-08-04 03:56:52', '230101.0001', '2023-08-04 03:56:43'),
	(20, 35, '', 1, 1, '230101.0001', '2023-08-04 11:33:59', '230101.0001', '2023-08-04 11:33:54'),
	(21, 37, '', 1, 1, '230101.0001', '2023-08-04 11:34:10', '230101.0001', '2023-08-04 11:34:07'),
	(22, 39, '', 1, 1, '230101.0001', '2023-08-05 08:28:18', '230101.0001', '2023-08-05 08:28:03'),
	(23, 40, '', 1, 1, '230101.0001', '2023-08-06 04:12:41', '230101.0001', '2023-08-06 04:12:40'),
	(24, 42, '', 1, 1, '230101.0001', '2023-08-06 18:08:00', '230101.0001', '2023-08-06 04:34:59'),
	(25, 43, '', 1, 1, '230101.0001', '2023-08-06 04:35:27', '230101.0001', '2023-08-06 04:35:17');

-- Dumping structure for table tradingbook.journal_chart_where_select
CREATE TABLE IF NOT EXISTS `journal_chart_where_select` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(11) DEFAULT NULL,
  `journalSelectId` int(6) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=971 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_chart_where_select: ~28 rows (approximately)
INSERT INTO `journal_chart_where_select` (`id`, `journalTableViewId`, `journalSelectId`, `status`, `presence`, `update_by`, `update_date`, `input_by`, `input_date`) VALUES
	(740, 31, 2, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(741, 31, 7, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(742, 31, 19, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(743, 31, 23, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(744, 31, 24, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(745, 31, 25, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(746, 31, 26, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(901, 32, 2, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(902, 32, 7, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(903, 32, 19, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(904, 32, 23, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(905, 32, 24, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(906, 32, 25, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(907, 32, 26, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(943, 36, 23, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(944, 36, 24, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(945, 36, 25, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(946, 36, 26, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(947, 36, 2, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(948, 36, 7, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(949, 36, 19, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(964, 11, 2, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(965, 11, 7, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(966, 11, 19, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(967, 11, 23, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(968, 11, 24, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(969, 11, 25, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(970, 11, 26, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00');

-- Dumping structure for table tradingbook.journal_chart_xaxis
CREATE TABLE IF NOT EXISTS `journal_chart_xaxis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_chart_xaxis: ~23 rows (approximately)
INSERT INTO `journal_chart_xaxis` (`id`, `journalTableViewId`, `value`, `status`, `presence`, `update_by`, `update_date`, `input_by`, `input_date`) VALUES
	(13, 11, 'f9', 1, 1, '230101.0001', '2023-08-04 15:58:49', '230101.0001', '2023-07-28 09:50:42'),
	(14, 12, 'f14', 1, 1, '230101.0001', '2023-08-03 18:01:43', '230101.0001', '2023-07-28 09:55:35'),
	(16, 18, 'f3', 1, 1, '230101.0001', '2023-08-03 05:19:36', '230101.0001', '2023-08-03 05:19:23'),
	(17, 25, 'f4', 1, 1, '230101.0001', '2023-08-03 17:00:25', '230101.0001', '2023-08-03 17:00:16'),
	(18, 22, 'f4', 1, 1, '230101.0001', '2023-08-03 17:00:49', '230101.0001', '2023-08-03 17:00:40'),
	(19, 23, 'f3', 1, 1, '230101.0001', '2023-08-03 17:01:03', '230101.0001', '2023-08-03 17:01:03'),
	(20, 24, 'f3', 1, 1, '230101.0001', '2023-08-03 17:12:09', '230101.0001', '2023-08-03 17:12:09'),
	(21, 26, 'f3', 1, 1, '230101.0001', '2023-08-03 17:15:34', '230101.0001', '2023-08-03 17:14:51'),
	(22, 27, 'f3', 1, 1, '230101.0001', '2023-08-03 17:28:42', '230101.0001', '2023-08-03 17:24:14'),
	(23, 29, 'f3', 1, 1, '230101.0001', '2023-08-03 17:29:41', '230101.0001', '2023-08-03 17:29:37'),
	(24, 13, 'f14', 1, 1, '230101.0001', '2023-08-03 18:17:25', '230101.0001', '2023-08-03 17:34:53'),
	(25, 19, 'f14', 1, 1, '230101.0001', '2023-08-03 18:09:20', '230101.0001', '2023-08-03 18:07:53'),
	(26, 30, 'f14', 1, 1, '230101.0001', '2023-08-03 18:48:48', '230101.0001', '2023-08-03 18:10:07'),
	(27, 31, 'f14', 1, 1, '230101.0001', '2023-08-03 18:51:55', '230101.0001', '2023-08-03 18:50:03'),
	(28, 33, 'f3', 1, 1, '230101.0001', '2023-08-03 20:14:11', '230101.0001', '2023-08-03 20:12:57'),
	(29, 32, 'f14', 1, 1, '230101.0001', '2023-08-04 03:54:19', '230101.0001', '2023-08-04 03:54:19'),
	(30, 36, 'f14', 1, 1, '230101.0001', '2023-08-04 03:56:52', '230101.0001', '2023-08-04 03:56:43'),
	(31, 35, 'f3', 1, 1, '230101.0001', '2023-08-04 11:33:59', '230101.0001', '2023-08-04 11:33:54'),
	(32, 37, 'f3', 1, 1, '230101.0001', '2023-08-04 11:34:10', '230101.0001', '2023-08-04 11:34:07'),
	(33, 39, 'f3', 1, 1, '230101.0001', '2023-08-05 08:28:18', '230101.0001', '2023-08-05 08:28:03'),
	(34, 40, 'f3', 1, 1, '230101.0001', '2023-08-06 04:12:41', '230101.0001', '2023-08-06 04:12:40'),
	(35, 42, 'f3', 1, 1, '230101.0001', '2023-08-06 18:08:00', '230101.0001', '2023-08-06 04:34:59'),
	(36, 43, 'f4', 1, 1, '230101.0001', '2023-08-06 04:35:27', '230101.0001', '2023-08-06 04:35:17');

-- Dumping structure for table tradingbook.journal_chart_yaxis
CREATE TABLE IF NOT EXISTS `journal_chart_yaxis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `fill` int(1) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_chart_yaxis: ~85 rows (approximately)
INSERT INTO `journal_chart_yaxis` (`id`, `journalTableViewId`, `value`, `fill`, `status`, `presence`, `update_by`, `update_date`, `input_by`, `input_date`) VALUES
	(32, 11, 'f7', 1, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(33, 11, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(34, 11, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(35, 11, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(36, 12, 'f7', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(37, 12, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(38, 12, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(39, 12, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(40, 12, 'f14', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(41, 11, 'f14', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(42, 18, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(43, 18, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(44, 18, 'f3', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(45, 25, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(46, 25, 'f2', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(47, 25, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(48, 22, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(49, 22, 'f2', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(50, 22, 'f3', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(51, 23, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(52, 23, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(53, 23, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(54, 24, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(55, 24, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(56, 24, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(57, 26, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(58, 26, 'f2', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(59, 26, 'f3', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(60, 27, 'f1', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(61, 27, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(62, 27, 'f3', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(63, 29, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(64, 29, 'f2', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(65, 29, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(66, 13, 'f7', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(67, 13, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(68, 13, 'f14', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(69, 13, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(70, 13, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(71, 19, 'f7', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(72, 19, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(73, 19, 'f14', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(74, 19, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(75, 19, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(76, 30, 'f7', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(77, 30, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(78, 30, 'f14', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(79, 30, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(80, 30, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(81, 31, 'f7', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(82, 31, 'f8', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(83, 31, 'f14', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(84, 31, 'f9', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(85, 31, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(86, 32, 'f7', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(87, 32, 'f8', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(88, 32, 'f14', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(89, 32, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(90, 32, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(91, 33, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(92, 33, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(93, 33, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(94, 36, 'f7', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(95, 36, 'f8', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(96, 36, 'f14', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(97, 36, 'f9', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(98, 36, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(99, 35, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(100, 35, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(101, 35, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(102, 37, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(103, 37, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(104, 37, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(105, 39, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(106, 39, 'f2', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(107, 39, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(108, 40, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(109, 40, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(110, 40, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(111, 42, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(112, 42, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(113, 42, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(114, 43, 'f1', 0, 1, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(115, 43, 'f2', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00'),
	(116, 43, 'f3', 0, 0, 1, '', '2023-01-01 00:00:00', '', '2023-01-01 00:00:00');

-- Dumping structure for table tradingbook.journal_custom_field
CREATE TABLE IF NOT EXISTS `journal_custom_field` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ilock` int(1) NOT NULL DEFAULT 0,
  `hideDEL` int(1) NOT NULL DEFAULT 0,
  `f` int(2) NOT NULL DEFAULT 0,
  `name` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `iType` varchar(250) NOT NULL,
  `width` int(150) NOT NULL DEFAULT 300,
  `textAlign` varchar(50) NOT NULL DEFAULT 'center',
  `suffix` varchar(50) NOT NULL DEFAULT '',
  `sorting` int(3) NOT NULL DEFAULT 99,
  `eval` text NOT NULL DEFAULT '',
  `evalDev` text NOT NULL DEFAULT '',
  `presence` int(11) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_custom_field: ~52 rows (approximately)
INSERT INTO `journal_custom_field` (`id`, `journalId`, `ilock`, `hideDEL`, `f`, `name`, `iType`, `width`, `textAlign`, `suffix`, `sorting`, `eval`, `evalDev`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(39, 'B1-000014', 0, 0, 1, 'custom Field 1', 'text', 300, 'center', '', 10, '', '', 1, '2023-06-27 17:38:35', '230101.0001', '2023-01-01 00:00:00', ''),
	(41, 'B1-000014', 0, 0, 2, 'custom Field 2', 'text', 300, 'center', '', 20, '', '', 1, '2023-06-27 17:38:57', '230101.0001', '2023-01-01 00:00:00', ''),
	(42, 'B1-000014', 0, 0, 3, 'custom Field 3', 'text', 300, 'center', 'percent', 30, '', '', 1, '2023-06-27 17:38:58', '230101.0001', '2023-01-01 00:00:00', ''),
	(43, 'B1-000014', 0, 0, 4, 'custom Field 4', 'text', 300, 'center', '', 40, '', '', 1, '2023-06-27 17:40:02', '230101.0001', '2023-01-01 00:00:00', ''),
	(44, 'B1-000026', 0, 0, 1, 'custom Field 1', 'text', 300, 'center', '', 10, '', '', 1, '2023-06-29 07:57:14', '230101.0001', '2023-01-01 00:00:00', ''),
	(45, 'B1-000026', 0, 0, 2, 'custom Field 2', 'text', 300, 'center', '', 20, '', '', 1, '2023-06-29 07:57:15', '230101.0001', '2023-01-01 00:00:00', ''),
	(46, 'B1-000028', 0, 0, 1, 'custom Field 1', 'text', 300, 'center', '', 10, '', '', 1, '2023-07-01 17:34:39', '230101.0001', '2023-01-01 00:00:00', ''),
	(47, 'B1-000027', 0, 0, 1, 'custom Field 1', 'time', 125, 'center', '', 22, '', '', 0, '2023-07-09 18:25:13', '230101.0001', '2023-08-01 05:56:18', '230101.0001'),
	(48, 'B1-000027', 0, 0, 2, 'profit % f2', 'number', 150, 'end', '%', 18, '', '', 1, '2023-07-09 18:25:14', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(50, 'B1-000027', 0, 0, 4, 'Markets', 'select', 166, 'center', '', 15, '', '', 1, '2023-07-09 18:30:58', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(51, 'B1-000027', 0, 1, 3, 'custom Field 3123', 'note', 166, '', '', 17, '', '', 1, '2023-07-13 10:09:59', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(52, 'B1-000027', 0, 1, 5, 'custom Field 5555', 'url', 230, 'center', '', 16, '', '', 1, '2023-07-13 11:38:22', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(53, 'B1-000027', 0, 0, 6, 'custom Field 6', 'date', 123, 'center', '', 21, '', '', 0, '2023-07-13 11:38:23', '230101.0001', '2023-08-01 05:56:18', '230101.0001'),
	(58, 'B1-000027', 0, 0, 9, 'Formula', 'formula', 171, 'end', '', 13, '($f2 * 1000 )." USD"', '($f2 * 1000 )." USD"', 1, '2023-07-19 09:29:53', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(74, 'B1-000027', 0, 0, 7, 'TP point', 'number', 150, 'center', '', 9, '', '', 0, '2023-07-27 06:13:22', '230101.0001', '2023-08-01 18:42:13', '230101.0001'),
	(75, 'B1-000027', 0, 0, 8, 'Stop Loss', 'number', 150, 'center', '', 9, '', '', 1, '2023-07-27 06:13:36', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(76, 'B1-000027', 0, 0, 10, 'Label 1', 'text', 150, 'center', '', 12, '', '', 1, '2023-07-27 07:43:44', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(77, 'B1-000027', 0, 0, 11, 'label 2', 'text', 150, 'center', '', 14, '', '', 1, '2023-07-27 07:43:58', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(78, 'B1-000027', 0, 0, 12, 'label 4', 'text', 150, 'center', '', 24, '', '', 0, '2023-07-27 08:52:19', '230101.0001', '2023-08-01 05:56:18', '230101.0001'),
	(79, 'B1-000027', 0, 0, 13, 'Forex NEWS', 'select', 150, 'center', '', 19, '', '', 1, '2023-07-27 18:02:19', '230101.0001', '2023-08-03 10:36:51', '230101.0001'),
	(80, 'B1-000027', 0, 0, 14, 'Formual profit', 'formula', 150, 'center', '', 10, '(20*2) /7.6 . " Haha"', '(20*2) /7.6 . " Haha"', 1, '2023-07-30 17:53:19', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(81, 'B1-000027', 0, 0, 15, 'Mandona Code', 'text', 150, 'center', '', 20, '', '', 1, '2023-08-01 12:04:05', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(82, 'B1-000027', 0, 0, 16, 'Capsule Code', 'text', 150, 'center', '', 21, '', '', 1, '2023-08-01 12:04:55', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(83, 'B1-000027', 0, 0, 17, 'User Select', 'user', 150, 'center', '', 11, '', '', 1, '2023-08-01 18:38:23', '230101.0001', '2023-08-02 10:18:09', '230101.0001'),
	(84, 'B1-000049', 0, 0, 1, 'abc', 'text', 150, 'center', '', 1, '', '', 1, '2023-08-02 12:11:03', '230101.0001', '2023-01-01 00:00:00', ''),
	(85, 'B1-000050', 0, 0, 1, 'number A', 'number', 188, 'center', '', 1, '', '', 1, '2023-08-02 17:20:55', '', '2023-08-02 17:21:14', '230101.0001'),
	(86, 'B1-000050', 0, 0, 2, 'number B', 'number', 300, 'center', '', 2, '', '', 1, '2023-08-02 17:20:55', '', '2023-01-01 00:00:00', ''),
	(87, 'B1-000050', 0, 0, 3, 'formula1', 'formula', 300, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-02 17:20:55', '', '2023-01-01 00:00:00', ''),
	(88, 'B1-000050', 0, 0, 4, 'text 1', 'text', 300, 'center', '', 4, '', '', 1, '2023-08-02 17:20:55', '', '2023-01-01 00:00:00', ''),
	(89, 'B1-000051', 0, 0, 1, 'number A', 'number', 150, 'center', '', 1, '', '', 1, '2023-08-02 17:22:44', '', '2023-01-01 00:00:00', ''),
	(90, 'B1-000051', 0, 0, 2, 'number B', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-02 17:22:44', '', '2023-01-01 00:00:00', ''),
	(91, 'B1-000051', 0, 0, 3, 'formula1', 'formula', 150, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-02 17:22:44', '', '2023-01-01 00:00:00', ''),
	(92, 'B1-000051', 0, 0, 4, 'text 1', 'text', 150, 'center', '', 4, '', '', 1, '2023-08-02 17:22:44', '', '2023-01-01 00:00:00', ''),
	(93, 'B1-000042', 0, 0, 1, 'abc', 'text', 150, 'center', '', 1, '', '', 1, '2023-08-05 08:26:52', '230101.0001', '2023-01-01 00:00:00', ''),
	(94, 'B1-000052', 0, 0, 1, 'number A', 'number', 150, 'center', '', 1, '', '', 1, '2023-08-05 08:27:09', '', '2023-01-01 00:00:00', ''),
	(95, 'B1-000052', 0, 0, 2, 'number B', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-05 08:27:09', '', '2023-01-01 00:00:00', ''),
	(96, 'B1-000052', 0, 0, 3, 'formula1', 'formula', 150, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-05 08:27:09', '', '2023-01-01 00:00:00', ''),
	(97, 'B1-000052', 0, 0, 4, 'text 1', 'text', 150, 'center', '', 4, '', '', 1, '2023-08-05 08:27:09', '', '2023-01-01 00:00:00', ''),
	(98, 'B1-000053', 0, 0, 1, 'number A', 'number', 150, 'center', '', 1, '', '', 1, '2023-08-09 11:32:33', '', '2023-01-01 00:00:00', ''),
	(99, 'B1-000053', 0, 0, 2, 'number B', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-09 11:32:33', '', '2023-01-01 00:00:00', ''),
	(100, 'B1-000053', 0, 0, 3, 'formula1', 'formula', 150, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-09 11:32:33', '', '2023-01-01 00:00:00', ''),
	(101, 'B1-000053', 0, 0, 4, 'text 1', 'text', 150, 'center', '', 4, '', '', 1, '2023-08-09 11:32:33', '', '2023-01-01 00:00:00', ''),
	(102, 'B1-000054', 0, 0, 1, 'number A', 'number', 150, 'center', '', 1, '', '', 1, '2023-08-10 14:51:55', '', '2023-01-01 00:00:00', ''),
	(103, 'B1-000054', 0, 0, 2, 'number B', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-10 14:51:55', '', '2023-01-01 00:00:00', ''),
	(104, 'B1-000054', 0, 0, 3, 'formula1', 'formula', 150, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-10 14:51:55', '', '2023-01-01 00:00:00', ''),
	(105, 'B1-000054', 0, 0, 4, 'text 1', 'text', 150, 'center', '', 4, '', '', 1, '2023-08-10 14:51:55', '', '2023-01-01 00:00:00', ''),
	(106, 'B1-000055', 0, 0, 1, 'number A', 'number', 150, 'center', '', 1, '', '', 1, '2023-08-10 14:52:10', '', '2023-01-01 00:00:00', ''),
	(107, 'B1-000055', 0, 0, 2, 'number B', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-10 14:52:10', '', '2023-01-01 00:00:00', ''),
	(108, 'B1-000055', 0, 0, 3, 'formula1', 'formula', 150, 'center', '', 3, '$f1 * $f2', '', 1, '2023-08-10 14:52:10', '', '2023-01-01 00:00:00', ''),
	(109, 'B1-000055', 0, 0, 4, 'text 1', 'text', 150, 'center', '', 4, '', '', 1, '2023-08-10 14:52:10', '', '2023-01-01 00:00:00', ''),
	(110, 'B1-000056', 0, 0, 1, 'Abc', 'text', 150, 'center', '', 1, '', '', 1, '2023-08-10 14:52:33', '', '2023-01-01 00:00:00', ''),
	(111, 'B1-000056', 0, 0, 2, 'CDE', 'number', 150, 'center', '', 2, '', '', 1, '2023-08-10 14:52:33', '', '2023-01-01 00:00:00', '');

-- Dumping structure for table tradingbook.journal_detail
CREATE TABLE IF NOT EXISTS `journal_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `archives` int(1) NOT NULL DEFAULT 0,
  `presence` int(1) NOT NULL DEFAULT 1,
  `sorting` int(6) NOT NULL DEFAULT 9999,
  `ilock` int(1) NOT NULL DEFAULT 0,
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
  `f5` text NOT NULL,
  `f6` text NOT NULL,
  `f7` text NOT NULL,
  `f8` text NOT NULL,
  `f9` text NOT NULL,
  `f10` text NOT NULL,
  `f11` text NOT NULL,
  `f12` text NOT NULL,
  `f13` text NOT NULL,
  `f14` text NOT NULL,
  `f15` text NOT NULL,
  `f16` text NOT NULL,
  `f17` text NOT NULL,
  `f18` text NOT NULL,
  `f19` text NOT NULL,
  `f20` text NOT NULL,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingbook.journal_detail: ~67 rows (approximately)
INSERT INTO `journal_detail` (`id`, `journalId`, `archives`, `presence`, `sorting`, `ilock`, `positionId`, `marketId`, `openDate`, `closeDate`, `sl`, `rr`, `tp`, `resultId`, `note`, `f1`, `f2`, `f3`, `f4`, `f5`, `f6`, `f7`, `f8`, `f9`, `f10`, `f11`, `f12`, `f13`, `f14`, `f15`, `f16`, `f17`, `f18`, `f19`, `f20`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(1, 'B1-000026', 0, 1, 0, 1, 2, 2, '2023-01-13 06:05:00', '2023-01-13 20:34:00', 23.00, -1.00, -23.00, -1, '', '18:30', '1.244223', 'akao434', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-01-01 00:00:00', '', '2023-07-01 19:03:16', ''),
	(2, 'B1-000026', 0, 1, 0, 1, 1, 3, '2022-12-02 04:04:00', '2022-12-08 18:25:00', 20.00, 3.00, 60.00, 1, '', '18:30', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-01-01 00:00:00', '', '2023-07-01 19:03:16', ''),
	(3, 'B1-000026', 0, 1, 0, 0, 2, 5, '2021-06-11 00:00:00', '2021-06-13 18:25:00', 20.00, -8.00, -160.00, -1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-01-01 00:00:00', '', '2023-07-01 19:03:16', ''),
	(4, 'B1-000026', 0, 1, 0, 0, 1, 2, '2020-01-02 00:00:00', '2020-01-08 18:25:00', 21.00, 2.00, 42.00, 1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-16 17:18:03', '', '2023-07-01 19:03:16', ''),
	(5, 'B1-000026', 0, 0, 0, 0, 1, 2, '2020-01-02 00:00:00', '2020-01-04 18:25:00', 1.00, -2.00, -2.00, -1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-16 17:18:16', '', '2023-06-17 05:45:36', ''),
	(6, 'B1-000026', 0, 0, 0, 0, 2, 3, '2020-01-30 00:00:00', '2020-02-01 18:25:00', 1.00, 3.00, 3.00, 1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-16 17:18:26', '', '2023-06-17 05:45:36', ''),
	(7, 'B1-000026', 0, 0, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-16 18:56:19', '', '2023-06-17 05:45:27', ''),
	(8, 'B1-000026', 0, 0, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-17 05:34:28', '', '2023-06-17 05:45:27', ''),
	(9, 'B1-000026', 0, 1, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 2.00, 42.00, 1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-17 05:54:41', '', '2023-07-01 19:03:16', ''),
	(10, 'B1-000026', 0, 0, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-17 19:10:26', '', '2023-06-17 19:10:32', ''),
	(11, 'B1-000026', 0, 1, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '18:30', 'bavd', '43434234', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-23 17:48:26', '', '2023-07-01 19:03:16', ''),
	(12, 'B1-000026', 0, 1, 0, 0, 2, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 3.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-27 17:40:11', '', '2023-07-01 19:03:16', ''),
	(13, 'B1-000026', 0, 1, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-29 07:31:43', '', '2023-07-01 19:03:16', ''),
	(14, 'B1-000029', 0, 0, 0, 0, 0, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-29 19:15:59', '', '2023-07-02 12:40:58', '230101.0001'),
	(15, 'B1-000029', 0, 0, 0, 0, 0, 5, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-29 19:16:00', '', '2023-07-02 12:40:58', '230101.0001'),
	(16, 'B1-000029', 0, 0, 0, 0, 0, 4, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-06-29 19:16:01', '', '2023-07-02 12:40:58', '230101.0001'),
	(17, 'B1-000027', 0, 0, 0, 0, 1, 2, '2020-01-02 00:00:00', '2020-01-03 00:00:00', 22.00, 2.00, 44.00, 1, '', '17:31', '44', 'test', '2', 'sdfasdf', '2023-07-01', '充サ際査メフ', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-21 09:05:45', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(18, 'B1-000027', 0, 0, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 3.00, 63.00, 1, '', '19:43', '431', '', '7', 'abc', '1990-01-13', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-22 04:08:10', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(19, 'B1-000027', 0, 1, 7, 0, 1, 2, '2020-01-01 04:03:00', '2020-01-01 04:03:00', 21.00, -1.00, -21.00, -1, '', '18:34', '12', '', '2', 'abc', '2023-07-21', '3', '15', '', '2', '', '', '23', '', '', '', '230101.0001', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(20, 'B1-000027', 0, 0, 0, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 22.00, -1.00, -22.00, -1, '', '18:30', '13', '', '3', '', '1990-01-27', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-21 09:20:45', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(21, 'B1-000027', 0, 0, 0, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-04 00:00:00', 21.00, -1.00, -21.00, -1, '', '18:30', '67', '', '3', '', '2023-07-08', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-21 09:20:45', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(22, 'B1-000027', 0, 0, 6, 0, 2, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 22.00, -1.00, -22.00, -1, '', '18:30', '3434', '', '6', 'abcdfdrer', '2023-07-09', '4', '-1', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-01 10:17:00', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(23, 'B1-000027', 0, 1, 1, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, -1.00, -21.00, -1, '', '18:30', '12323123', '', '6', 'dgsdfg', '2023-07-07', '3', '1', '', '234', '', '', '26', '', '', '', '230101.0001', '', '', '', '2023-08-01 15:32:32', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(24, 'B1-000027', 0, 1, 4, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 4.00, 84.00, 1, '', '18:30', '61', '', '3', '234234', '2023-06-30', '1', '13', '', '', '', '', '23', '', '', '', '230101.0001', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(25, 'B1-000028', 0, 1, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 20.00, 1.00, 20.00, 1, '', '18:30', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-01 17:12:27', '', '2023-07-02 05:24:46', ''),
	(26, 'B1-000028', 0, 1, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, -4.00, -84.00, -1, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-01 17:12:29', '', '2023-07-02 05:24:46', ''),
	(48, 'B1-000027', 0, 0, 22, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '1', '', '6', '24234234', '2023-07-14', 'abbb', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-21 09:05:45', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(49, 'B1-000027', 0, 0, 28, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '45', '', '', '124234', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-21 09:05:45', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(50, 'B1-000027', 0, 0, 17, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-22 05:04:58', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(51, 'B1-000027', 0, 0, 19, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-22 05:04:58', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(52, 'B1-000027', 0, 0, 18, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-22 05:04:58', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(53, 'B1-000027', 0, 0, 20, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-22 05:04:58', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(54, 'B1-000027', 0, 1, 3, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, -1.00, -21.00, -1, '', '15:31', '12', '', '7', 'abc', '2023-07-21', '9', '11', '', '4343', '', '', '23', '', '', '', 'C0012', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(55, 'B1-000027', 0, 1, 5, 0, 2, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 22.00, -1.00, -22.00, -1, '', '18:30', '3434', '', '2', 'abcdfdrer', '2023-07-09', '2', '14', '', '12313', '232', '', '23', '', '', '', '230101.0001', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(56, 'B1-000027', 0, 1, 9, 0, 2, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 22.00, -1.00, -22.00, -1, '', '18:30', '3434', '', '21', 'abcdfdrer', '2023-07-09', '-12', '38', '', '', '', '', '25', '', '', '', '230101.0001', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(57, 'B1-000027', 0, 1, 10, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 4.00, 84.00, 1, '', '18:30', '61', '', '3', '234234', '2023-06-30', '323', '39', '', '34', '', '', '25', '', '', '', 'C5555', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(58, 'B1-000027', 0, 1, 14, 0, 1, 3, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, 4.00, 84.00, 1, '', '18:30', '61', '', '3', '234234', '2023-06-30', '12', '31', '', '', '', '', '26', '', '', '', '230101.0001', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(59, 'B1-000027', 0, 0, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, -1.00, -21.00, -1, '', '15:31', '112', '', '2', 'abc34234', '2023-07-21', '1', '-1', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-01 12:15:50', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(60, 'B1-000027', 0, 1, 8, 0, 2, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 22.00, -1.00, -22.00, -1, '', '18:30', '3434', '', '19', 'abcdfdrer', '2023-07-09', '24', '27', '', '', '', '', '24', '', '', '', 'C5555', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(61, 'B1-000027', 0, 0, 11, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(62, 'B1-000027', 0, 0, 12, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(63, 'B1-000027', 0, 0, 13, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(64, 'B1-000027', 0, 0, 14, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(65, 'B1-000027', 0, 0, 15, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(66, 'B1-000027', 0, 0, 16, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(67, 'B1-000027', 0, 0, 17, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(68, 'B1-000027', 0, 0, 18, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(69, 'B1-000027', 0, 0, 19, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(70, 'B1-000027', 0, 0, 19, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(71, 'B1-000027', 0, 0, 10, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-07-25 12:39:40', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(72, 'B1-000027', 0, 0, 0, 0, 1, 2, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 21.00, -1.00, -21.00, -1, '', '15:31', '112', '', '2', 'abc34234', '2023-07-21', '1', '-1', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-01 12:15:50', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(73, 'B1-000027', 0, 1, 7, 0, 1, 2, '2020-01-01 04:03:00', '2020-01-01 04:03:00', 21.00, -1.00, -21.00, -1, '', '18:34', '12', '', '6', 'abc', '2023-07-21', '2', '6', '', '2', '', '', '26', '', '', '', 'C0012', '', '', '', '2023-08-07 12:10:30', '230101.0001', '2023-08-07 12:15:23', '230101.0001'),
	(74, 'B1-000049', 0, 0, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', 'ag', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-02 12:11:06', '230101.0001', '2023-08-02 17:22:03', '230101.0001'),
	(75, 'B1-000050', 0, 0, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-02 17:20:55', '230101.0001', '2023-08-02 17:22:03', '230101.0001'),
	(76, 'B1-000051', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '3545', '21432', '', 'abc', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-02 17:22:44', '230101.0001', '2023-08-02 17:56:53', '230101.0001'),
	(77, 'B1-000051', 0, 1, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '9', '2', '', 're', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-02 17:22:44', '', '2023-08-02 17:35:37', '230101.0001'),
	(78, 'B1-000051', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '13', '2', '', 'abc', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-02 17:22:44', '230101.0001', '2023-08-02 17:53:42', '230101.0001'),
	(79, 'B1-000042', 0, 1, 0, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-05 08:26:38', '230101.0001', '2023-01-01 00:00:00', ''),
	(80, 'B1-000052', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '12', '222', '', 'a', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-05 08:27:09', '230101.0001', '2023-08-05 08:27:56', '230101.0001'),
	(81, 'B1-000052', 0, 1, 9999, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '53', '45', '', '3c', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-05 08:27:09', '', '2023-08-07 11:22:45', '230101.0001'),
	(82, 'B1-000052', 0, 1, 2, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '2', '234', '', '3424', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-06 04:40:05', '230101.0001', '2023-08-07 10:46:12', '230101.0001'),
	(83, 'B1-000053', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '3', '3', '', '4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-09 11:32:33', '230809.000006', '2023-08-09 19:11:10', '230809.000006'),
	(84, 'B1-000053', 0, 1, 9999, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '3', '43', '', '43', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-09 11:32:33', '', '2023-08-09 19:16:11', '230809.000006'),
	(85, 'B1-000054', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:51:55', '230809.000006', '2023-08-10 14:51:55', '230809.000006'),
	(86, 'B1-000054', 0, 1, 9999, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:51:55', '', '2023-01-01 00:00:00', ''),
	(87, 'B1-000055', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:52:10', '230809.000006', '2023-08-10 14:52:10', '230809.000006'),
	(88, 'B1-000055', 0, 1, 9999, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:52:10', '', '2023-01-01 00:00:00', ''),
	(89, 'B1-000056', 0, 1, 1, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:52:33', '230809.000006', '2023-08-10 14:52:33', '230809.000006'),
	(90, 'B1-000056', 0, 1, 9999, 0, 0, 0, '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0.00, 0.00, 0.00, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2023-08-10 14:52:33', '', '2023-01-01 00:00:00', '');

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingbook.journal_detail_images: ~13 rows (approximately)
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
	(14, '1', 'http://localhost/app/tradingapp/public/uploads/1553302096944.jpg', 88, 1, '2023-06-27 17:33:18', '2023-06-27 17:33:18'),
	(15, '18', 'http://localhost/app/tradingapp/public/uploads/1. ALAM SUTERA PROJECT.jpg', 88, 1, '2023-07-09 15:50:36', '2023-07-09 15:50:36'),
	(16, '18', 'http://localhost/app/tradingapp/public/uploads/2. B+J RESIDENCE.jpg', 88, 1, '2023-07-09 15:50:40', '2023-07-09 15:50:40');

-- Dumping structure for table tradingbook.journal_select
CREATE TABLE IF NOT EXISTS `journal_select` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `field` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(50) NOT NULL DEFAULT '',
  `sorting` int(3) NOT NULL DEFAULT 99,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_select: ~23 rows (approximately)
INSERT INTO `journal_select` (`id`, `journalId`, `field`, `value`, `color`, `sorting`, `presence`, `update_date`, `update_by`, `input_date`, `input_by`) VALUES
	(1, 'B1-000027', 'f4', 'BELI 1', '#F94892', 4, 0, '2023-07-15 11:57:42', '230101.0001', '2023-01-01 00:00:00', ''),
	(2, 'B1-000027', 'f4', 'Urutan no 220000', '#1B9C85', 1, 1, '2023-07-22 06:28:12', '230101.0001', '2023-01-01 00:00:00', ''),
	(3, 'B1-000027', 'f4', 'BEP to 0', '#8FACC0', 3, 0, '2023-07-25 10:11:14', '230101.0001', '2023-07-14 19:39:49', '230101.0001'),
	(4, 'B1-000027', 'f4', 'MRBEEN', '#DC8449', 6, 0, '2023-07-15 11:38:52', '230101.0001', '2023-07-14 19:47:16', '230101.0001'),
	(5, 'B1-000027', 'f4', 'abc123', '#A78295', 7, 0, '2023-07-15 11:38:57', '230101.0001', '2023-07-14 19:53:29', '230101.0001'),
	(6, 'B1-000027', 'f4', '11122333', '#393737', 0, 0, '2023-07-25 10:13:14', '230101.0001', '2023-07-14 19:55:48', '230101.0001'),
	(7, 'B1-000027', 'f4', '2222333', '#51ADCF', 2, 1, '2023-08-01 12:02:36', '230101.0001', '2023-07-14 19:57:43', '230101.0001'),
	(8, 'B1-000027', 'f4', 'CCDE', '#0B666A', 8, 0, '2023-07-15 11:37:59', '230101.0001', '2023-07-15 11:21:31', '230101.0001'),
	(9, 'B1-000027', 'f4', 'abc34', '#FFD93D', 9, 0, '2023-07-19 13:30:38', '230101.0001', '2023-07-15 18:09:28', '230101.0001'),
	(12, 'B1-000027', 'f4', 'aaaaaa', '#818D97', 10, 0, '2023-07-19 13:29:32', '230101.0001', '2023-07-15 18:12:56', '230101.0001'),
	(14, 'B1-000027', 'f4', '1', '#F94892', 11, 0, '2023-07-19 13:26:22', '230101.0001', '2023-07-15 18:18:46', '230101.0001'),
	(15, 'B1-000027', 'f4', '2', '#FFA1C9', 12, 0, '2023-07-19 13:27:51', '230101.0001', '2023-07-15 18:20:18', '230101.0001'),
	(16, 'B1-000027', 'f4', '3', '#FFD93D', 13, 0, '2023-07-19 13:26:33', '230101.0001', '2023-07-15 18:20:22', '230101.0001'),
	(17, 'B1-000027', 'f4', '4', '#DC8449', 14, 0, '2023-07-17 11:16:37', '230101.0001', '2023-07-15 18:20:27', '230101.0001'),
	(18, 'B1-000027', 'f4', 'ke 1', '', 15, 0, '2023-07-19 13:35:18', '230101.0001', '2023-07-19 13:34:52', '230101.0001'),
	(19, 'B1-000027', 'f4', 'ke 2', '#A78295', 4, 1, '2023-08-01 12:02:29', '230101.0001', '2023-07-19 13:34:56', '230101.0001'),
	(20, 'B1-000027', 'f4', 'ke 4', '#E60965', 17, 0, '2023-07-19 13:36:24', '230101.0001', '2023-07-19 13:35:02', '230101.0001'),
	(21, 'B1-000027', 'f4', 'ke 1', '#53CDE2', 6, 0, '2023-07-25 10:03:14', '230101.0001', '2023-07-19 13:36:53', '230101.0001'),
	(22, 'B1-000027', 'f4', 'ke 3', '#53CDE2', 5, 0, '2023-07-25 10:03:15', '230101.0001', '2023-07-19 13:36:58', '230101.0001'),
	(23, 'B1-000027', 'f13', 'FOMC', '#E60965', 1, 1, '2023-07-27 18:02:44', '230101.0001', '2023-07-27 18:02:44', '230101.0001'),
	(24, 'B1-000027', 'f13', 'FED', '#F1C27B', 2, 1, '2023-07-27 18:02:52', '230101.0001', '2023-07-27 18:02:52', '230101.0001'),
	(25, 'B1-000027', 'f13', 'CPI', '#1B9C85', 3, 1, '2023-07-27 18:03:00', '230101.0001', '2023-07-27 18:03:00', '230101.0001'),
	(26, 'B1-000027', 'f13', 'News', '#51ADCF', 4, 1, '2023-07-27 18:03:11', '230101.0001', '2023-07-27 18:03:11', '230101.0001');

-- Dumping structure for table tradingbook.journal_table_view
CREATE TABLE IF NOT EXISTS `journal_table_view` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `board` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `ilock` int(1) NOT NULL DEFAULT 1,
  `share` int(1) NOT NULL DEFAULT 0,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_table_view: ~53 rows (approximately)
INSERT INTO `journal_table_view` (`id`, `journalId`, `board`, `name`, `ilock`, `share`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(1, 'B1-000027', 'table', 'Main Table', 1, 0, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(2, 'B1-000027', 'table', 'Table Kazama 3123', 0, 1, 1, '2023-07-26 08:05:28', '230101.0001', '2023-01-01 00:00:00', ''),
	(3, 'B1-000027', 'table', 'Flix Chart', 0, 1, 0, '2023-07-26 08:15:31', '230101.0001', '2023-01-01 00:00:00', ''),
	(4, 'B1-000027', 'table', 'New table', 0, 1, 0, '2023-07-26 08:05:52', '230101.0001', '2023-01-01 00:00:00', ''),
	(5, 'B1-000027', 'table', 'New table', 0, 1, 0, '2023-07-26 08:06:04', '230101.0001', '2023-01-01 00:00:00', ''),
	(6, 'B1-000027', 'table', 'New table', 0, 1, 0, '2023-07-26 08:15:28', '230101.0001', '2023-01-01 00:00:00', ''),
	(7, 'B1-000027', 'table', 'New table', 0, 1, 0, '2023-07-26 08:15:22', '230101.0001', '2023-01-01 00:00:00', ''),
	(8, 'B1-000027', 'table', 'New table', 0, 1, 0, '2023-07-26 08:12:22', '230101.0001', '2023-01-01 00:00:00', ''),
	(9, 'B1-000027', 'table', 'New table', 0, 1, 1, '2023-07-26 08:15:43', '230101.0001', '2023-01-01 00:00:00', ''),
	(10, 'B1-000027', 'table', 'New table', 0, 1, 1, '2023-07-26 08:15:45', '230101.0001', '2023-01-01 00:00:00', ''),
	(11, 'B1-000027', 'chart', 'Chart JS test', 0, 1, 1, '2023-07-27 08:14:11', '230101.0001', '2023-01-01 00:00:00', ''),
	(12, 'B1-000027', 'chart', 'New chart', 0, 1, 0, '2023-08-03 18:09:57', '230101.0001', '2023-01-01 00:00:00', ''),
	(13, 'B1-000027', 'chart', 'New chart', 0, 1, 0, '2023-08-03 18:49:52', '230101.0001', '2023-01-01 00:00:00', ''),
	(14, 'B1-000049', 'table', 'New Table', 1, 0, 1, '2023-08-02 12:02:50', '230101.0001', '2023-08-02 12:02:50', '230101.0001'),
	(15, 'B1-000049', 'table', 'New table', 0, 1, 1, '2023-08-02 12:10:57', '230101.0001', '2023-01-01 00:00:00', ''),
	(16, 'B1-000050', 'table', 'New Table', 1, 0, 1, '2023-08-02 17:20:55', '230101.0001', '2023-08-02 17:20:55', '230101.0001'),
	(17, 'B1-000051', 'table', 'New Table', 1, 0, 1, '2023-08-02 17:22:44', '230101.0001', '2023-08-02 17:22:44', '230101.0001'),
	(18, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 17:14:25', '230101.0001', '2023-01-01 00:00:00', ''),
	(19, 'B1-000027', 'chart', 'New chart', 0, 1, 0, '2023-08-03 18:09:51', '230101.0001', '2023-01-01 00:00:00', ''),
	(20, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 08:47:28', '230101.0001', '2023-01-01 00:00:00', ''),
	(21, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 08:12:31', '230101.0001', '2023-01-01 00:00:00', ''),
	(22, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 17:14:14', '230101.0001', '2023-01-01 00:00:00', ''),
	(23, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 17:14:17', '230101.0001', '2023-01-01 00:00:00', ''),
	(24, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 17:14:20', '230101.0001', '2023-01-01 00:00:00', ''),
	(25, 'B1-000051', 'chart', 'New chart', 0, 1, 0, '2023-08-03 17:14:22', '230101.0001', '2023-01-01 00:00:00', ''),
	(26, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-03 17:14:27', '230101.0001', '2023-01-01 00:00:00', ''),
	(27, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-03 17:23:59', '230101.0001', '2023-01-01 00:00:00', ''),
	(28, 'B1-000051', 'table', 'New table', 0, 1, 0, '2023-08-03 17:29:03', '230101.0001', '2023-01-01 00:00:00', ''),
	(29, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-03 17:29:08', '230101.0001', '2023-01-01 00:00:00', ''),
	(30, 'B1-000027', 'chart', 'New chart', 0, 1, 0, '2023-08-03 18:49:46', '230101.0001', '2023-01-01 00:00:00', ''),
	(31, 'B1-000027', 'chart', 'New chart', 0, 1, 1, '2023-08-03 18:49:56', '230101.0001', '2023-01-01 00:00:00', ''),
	(32, 'B1-000027', 'chart', 'New chart', 0, 1, 0, '2023-08-04 04:20:46', '230101.0001', '2023-01-01 00:00:00', ''),
	(33, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-03 20:11:26', '230101.0001', '2023-01-01 00:00:00', ''),
	(34, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-03 20:15:35', '230101.0001', '2023-01-01 00:00:00', ''),
	(35, 'B1-000051', 'chart', 'New chart ', 0, 1, 1, '2023-08-04 11:34:41', '230101.0001', '2023-01-01 00:00:00', ''),
	(36, 'B1-000027', 'chart', 'New chart', 0, 1, 1, '2023-08-04 03:56:39', '230101.0001', '2023-01-01 00:00:00', ''),
	(37, 'B1-000051', 'chart', 'New chart', 0, 1, 1, '2023-08-04 11:34:03', '230101.0001', '2023-01-01 00:00:00', ''),
	(38, 'B1-000052', 'table', 'New Table', 1, 0, 1, '2023-08-05 08:27:09', '230101.0001', '2023-08-05 08:27:09', '230101.0001'),
	(39, 'B1-000052', 'chart', 'New chart', 0, 1, 1, '2023-08-05 08:27:58', '230101.0001', '2023-01-01 00:00:00', ''),
	(40, 'B1-000052', 'chart', 'New chart', 0, 1, 1, '2023-08-05 08:31:42', '230101.0001', '2023-01-01 00:00:00', ''),
	(41, 'B1-000052', 'table', 'New table', 0, 1, 1, '2023-08-06 04:33:51', '230101.0001', '2023-01-01 00:00:00', ''),
	(42, 'B1-000052', 'chart', 'New chart', 0, 1, 1, '2023-08-06 04:33:55', '230101.0001', '2023-01-01 00:00:00', ''),
	(43, 'B1-000052', 'chart', 'Rainy Coffee Shop Ambience with Calm Jazz Music an', 0, 1, 1, '2023-08-06 18:26:16', '230101.0001', '2023-01-01 00:00:00', ''),
	(44, 'B1-000052', 'chart', 'New chart', 0, 1, 1, '2023-08-06 05:29:36', '230101.0001', '2023-01-01 00:00:00', ''),
	(45, 'B1-000052', 'table', 'New table', 0, 1, 0, '2023-08-06 18:04:03', '230101.0001', '2023-01-01 00:00:00', ''),
	(46, 'B1-000026', 'table', 'New table', 0, 1, 0, '2023-08-06 18:46:06', '230101.0001', '2023-01-01 00:00:00', ''),
	(47, 'B1-000026', 'table', 'New table', 0, 1, 0, '2023-08-06 18:46:08', '230101.0001', '2023-01-01 00:00:00', ''),
	(48, 'B1-000026', 'chart', 'New chart', 0, 1, 0, '2023-08-06 18:46:16', '230101.0001', '2023-01-01 00:00:00', ''),
	(49, 'B1-000052', 'table', 'New table', 0, 1, 1, '2023-08-07 10:46:07', '230101.0001', '2023-01-01 00:00:00', ''),
	(50, 'B1-000053', 'table', 'New Table', 1, 0, 1, '2023-08-09 11:32:33', '230809.000006', '2023-08-09 11:32:33', '230809.000006'),
	(51, 'B1-000054', 'table', 'New Table', 1, 0, 1, '2023-08-10 14:51:55', '230809.000006', '2023-08-10 14:51:55', '230809.000006'),
	(52, 'B1-000055', 'table', 'New Table', 1, 0, 1, '2023-08-10 14:52:10', '230809.000006', '2023-08-10 14:52:10', '230809.000006'),
	(53, 'B1-000056', 'table', 'New Table', 1, 0, 1, '2023-08-10 14:52:33', '230809.000006', '2023-08-10 14:52:33', '230809.000006');

-- Dumping structure for table tradingbook.journal_table_view_show
CREATE TABLE IF NOT EXISTS `journal_table_view_show` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `journalTableViewId` int(9) NOT NULL DEFAULT 0,
  `journalCustomFieldId` int(9) NOT NULL DEFAULT 0,
  `hide` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.journal_table_view_show: ~35 rows (approximately)
INSERT INTO `journal_table_view_show` (`id`, `journalTableViewId`, `journalCustomFieldId`, `hide`) VALUES
	(108, 1, 50, 0),
	(109, 1, 58, 0),
	(110, 1, 52, 0),
	(111, 1, 53, 0),
	(112, 1, 48, 0),
	(113, 1, 47, 0),
	(114, 1, 51, 0),
	(115, 2, 58, 1),
	(116, 2, 50, 1),
	(117, 2, 52, 1),
	(118, 2, 51, 1),
	(119, 9, 58, 1),
	(120, 9, 50, 1),
	(121, 9, 52, 1),
	(122, 9, 51, 1),
	(123, 9, 53, 1),
	(124, 9, 47, 1),
	(125, 10, 74, 1),
	(126, 10, 75, 1),
	(127, 10, 76, 1),
	(128, 10, 58, 1),
	(129, 10, 77, 1),
	(130, 10, 50, 1),
	(131, 10, 52, 1),
	(132, 10, 51, 1),
	(133, 2, 76, 1),
	(134, 2, 77, 1),
	(135, 2, 53, 1),
	(136, 2, 47, 1),
	(137, 2, 48, 1),
	(138, 2, 78, 1),
	(139, 2, 79, 0),
	(140, 15, 84, 0),
	(141, 2, 81, 1),
	(142, 2, 82, 1),
	(143, 2, 80, 1),
	(144, 2, 83, 1);

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
	(1, 'Private', '<i class="bi bi-lock"></i>', 1, 0, 0, ''),
	(20, 'Share', '<i class="bi bi-link-45deg"></i>', 0, 1, 0, '');

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

-- Dumping structure for table tradingbook.template
CREATE TABLE IF NOT EXISTS `template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `presence` int(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingbook.template: ~3 rows (approximately)
INSERT INTO `template` (`id`, `name`, `code`, `presence`) VALUES
	(1, 'General Purpose', 'general', 1),
	(10, 'Backtest', 'backtest', 1),
	(100, 'Journal Trading', 'journalTrading', 1);

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
