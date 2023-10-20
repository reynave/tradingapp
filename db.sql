-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.2.0.6576
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table tradingapp.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(250) NOT NULL,
  `plansId` int(3) NOT NULL DEFAULT 1,
  `username` varchar(250) NOT NULL,
  `googleSub` varchar(250) NOT NULL,
  `facebookSub` varchar(250) NOT NULL,
  `inviteLink` varchar(250) NOT NULL,
  `name` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `imgPath` varchar(250) NOT NULL,
  `picture` varchar(250) NOT NULL,
  `meansurment_id` varchar(20) NOT NULL,
  `description` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `party` varchar(250) NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `status` int(3) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2022-01-01 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingapp.account: ~5 rows (approximately)
INSERT INTO `account` (`id`, `email`, `plansId`, `username`, `googleSub`, `facebookSub`, `inviteLink`, `name`, `password`, `imgPath`, `picture`, `meansurment_id`, `description`, `party`, `presence`, `status`, `input_date`, `update_date`) VALUES
	('230101.0001', 'sayamaai@emai.com', 1, 'sayama.ai', '', '', 'a1235', 'Sayama AI', '', '', '2.jpeg', '', 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mo', 'team', 1, 1, '2022-01-01 00:00:00', '2023-09-07 09:24:32'),
	('231018.000012', 'felix.renaldi@gmail.com', 1, '', '101221617854665478148', '', '', 'Felix Reynave', '', './uploads/picture/', 'ACg8ocITtiYfykOWRszBec88U_lH1gMehp6hLilM6SP9DNvJZoc=s96-c.jpg', '', '', '', 1, 1, '2023-10-18 18:01:56', '2022-01-01 00:00:00'),
	('C0012', 'wawa@email.com', 1, 'wawa', '', '', 'mryko', 'Wawa', '4297f44b13955235245b2497399d7a93', '', '3.jpeg', '', '', 'team', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('C5555', 'mada@email.com', 1, 'mada', '', '', 'u3vnu', 'Mada', '', '', '5.jpeg', '', '', 'team', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	('T01', 'dummy@email.com', 1, 'dame', '123', '4', '42553', 'damue', '', '', '6.jpeg', '', '', 'personal', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00');

-- Dumping structure for table tradingapp.account_achievement
CREATE TABLE IF NOT EXISTS `account_achievement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `label` varchar(50) NOT NULL DEFAULT '',
  `icon` varchar(50) NOT NULL DEFAULT '',
  `link` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.account_achievement: ~0 rows (approximately)

-- Dumping structure for table tradingapp.account_bookmark
CREATE TABLE IF NOT EXISTS `account_bookmark` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `journalId` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.account_bookmark: ~0 rows (approximately)

-- Dumping structure for table tradingapp.account_login
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
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table tradingapp.account_login: ~6 rows (approximately)
INSERT INTO `account_login` (`id`, `accountId`, `jti`, `iss`, `expDate`, `getUserAgent`, `ip`, `input_date`) VALUES
	(70, '231018.000007', 'f9839c8b147b196322a938ee9eb1728e9f55b27a', 'https://accounts.google.com', '2023-11-17 17:49:20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 17:49:20'),
	(71, '231018.000007', '304301389647162183dc2c85d065b9603a9d61a2', 'https://accounts.google.com', '2023-11-17 17:51:09', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 17:51:09'),
	(72, '231018.000007', '7b52311ab1b3fad86b3cf4c2826bd0162c0eacf2', 'https://accounts.google.com', '2023-11-17 17:52:13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 17:52:13'),
	(73, '231018.000007', '16f315ef995524c72ca762be51f1c3315a9fcede', 'https://accounts.google.com', '2023-11-17 17:52:40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 17:52:40'),
	(74, '231018.000010', '9aad50a37dd86522981c47f63179970a9dcd55f3', 'https://accounts.google.com', '2023-11-17 17:58:28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 17:58:28'),
	(75, '231018.000012', '799407722454d9a7253554c8227a2f43f104d883', 'https://accounts.google.com', '2023-11-17 18:01:55', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', '::1', '2023-10-18 18:01:56');

-- Dumping structure for table tradingapp.account_sosmed
CREATE TABLE IF NOT EXISTS `account_sosmed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `label` varchar(50) NOT NULL DEFAULT '',
  `icon` varchar(50) NOT NULL DEFAULT '',
  `link` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.account_sosmed: ~0 rows (approximately)

-- Dumping structure for table tradingapp.account_team
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

-- Dumping data for table tradingapp.account_team: ~4 rows (approximately)
INSERT INTO `account_team` (`id`, `accountId`, `invitedId`, `presence`, `status`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	(1, '230809.000006', '230101.0001', 1, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(2, '230809.000006', 'C0012', 1, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(3, '230809.000006', 'C5555', 1, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', ''),
	(4, '230809.000006', '230809.000006', 1, 1, '2023-01-01 00:00:00', '', '2023-01-01 00:00:00', '');

-- Dumping structure for table tradingapp.account_token
CREATE TABLE IF NOT EXISTS `account_token` (
  `id` varchar(50) NOT NULL,
  `accountId` varchar(50) DEFAULT NULL,
  `token` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.account_token: ~2 rows (approximately)
INSERT INTO `account_token` (`id`, `accountId`, `token`) VALUES
	('65301b0db4db9', '231018.000007', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMjE2MTc4NTQ2NjU0NzgxNDgiLCJlbWFpbCI6ImZlbGl4LnJlbmFsZGlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzY1MTE2OSwibmFtZSI6IkZlbGl4IFJleW5hdmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVR0aVlmeWtPV1JzekJlYzg4VV9sSDFnTWVocDZoTGlsTTZTUDlETnZKWm9jPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IiwiZmFtaWx5X25hbWUiOiJSZXluYXZlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2OTc2NTE0NjksImV4cCI6MTcwMDI0MzQ2OSwianRpIjoiMzA0MzAxMzg5NjQ3MTYyMTgzZGMyYzg1ZDA2NWI5NjAzYTlkNjFhMiIsImFjY291bnQiOnsiaWQiOiIyMzEwMTguMDAwMDA3IiwiZW1haWwiOiJmZWxpeC5yZW5hbGRpQGdtYWlsLmNvbSIsIm5hbWUiOiJGZWxpeCBSZXluYXZlIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lUdGlZZnlrT1dSc3pCZWM4OFVfbEgxZ01laHA2aExpbE02U1A5RE52SlpvYz1zOTYtYyIsImludml0ZUxpbmsiOiIiLCJ1c2VybmFtZSI6IiJ9fQ.YRmHswttfxjsBpfcBZU_wtTcvl87l_hMz4tuy7W6SV0'),
	('65301b4daac93', '231018.000007', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMjE2MTc4NTQ2NjU0NzgxNDgiLCJlbWFpbCI6ImZlbGl4LnJlbmFsZGlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzY1MTIzMywibmFtZSI6IkZlbGl4IFJleW5hdmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVR0aVlmeWtPV1JzekJlYzg4VV9sSDFnTWVocDZoTGlsTTZTUDlETnZKWm9jPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IiwiZmFtaWx5X25hbWUiOiJSZXluYXZlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2OTc2NTE1MzMsImV4cCI6MTcwMDI0MzUzMywianRpIjoiN2I1MjMxMWFiMWIzZmFkODZiM2NmNGMyODI2YmQwMTYyYzBlYWNmMiIsImFjY291bnQiOnsiaWQiOiIyMzEwMTguMDAwMDA3IiwiZW1haWwiOiJmZWxpeC5yZW5hbGRpQGdtYWlsLmNvbSIsIm5hbWUiOiJGZWxpeCBSZXluYXZlIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lUdGlZZnlrT1dSc3pCZWM4OFVfbEgxZ01laHA2aExpbE02U1A5RE52SlpvYz1zOTYtYyIsImludml0ZUxpbmsiOiIiLCJ1c2VybmFtZSI6IiJ9fQ.Se4gGNXMVz2itaCla3FmWD4t-S22JfCbzZXyItOlAEg');

-- Dumping structure for table tradingapp.auto_number
CREATE TABLE IF NOT EXISTS `auto_number` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `prefix` varchar(50) NOT NULL DEFAULT '',
  `digit` int(10) NOT NULL DEFAULT 1,
  `runningNumber` int(10) NOT NULL DEFAULT 1,
  `updateDate` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.auto_number: ~3 rows (approximately)
INSERT INTO `auto_number` (`id`, `name`, `prefix`, `digit`, `runningNumber`, `updateDate`) VALUES
	(1, 'account', '', 6, 12, '0000-00-00 00:00:00'),
	(10, 'backtest', 'J23', 6, 131, '0000-00-00 00:00:00'),
	(11, 'book', 'B23', 4, 16, '0000-00-00 00:00:00');

-- Dumping structure for table tradingapp.book
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

-- Dumping data for table tradingapp.book: ~2 rows (approximately)
INSERT INTO `book` (`id`, `accountId`, `name`, `ilock`, `sorting`, `presence`, `input_date`, `input_by`, `update_date`, `update_by`) VALUES
	('B230015', '231018.000012', 'UAT', 0, 1, 1, '2023-10-19 04:43:38', '231018.000012', '2023-01-01 00:00:00', NULL),
	('B230016', '231018.000012', 'UAT2', 0, 2, 1, '2023-10-20 06:11:38', '231018.000012', '2023-01-01 00:00:00', NULL);

-- Dumping structure for table tradingapp.chartjs_type
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

-- Dumping data for table tradingapp.chartjs_type: ~9 rows (approximately)
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

-- Dumping structure for table tradingapp.color
CREATE TABLE IF NOT EXISTS `color` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=503 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.color: ~21 rows (approximately)
INSERT INTO `color` (`id`, `color`) VALUES
	(1, '#393737'),
	(11, '#818D97'),
	(12, '#8FACC0'),
	(20, '#9400FF'),
	(21, '#974EC3'),
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
	(500, '#C04A82'),
	(501, '#E55604');

-- Dumping structure for table tradingapp.journal
CREATE TABLE IF NOT EXISTS `journal` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `accountId` varchar(50) NOT NULL DEFAULT '',
  `templateCode` varchar(20) NOT NULL DEFAULT '1',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `url` varchar(250) NOT NULL DEFAULT '',
  `invitedLink` varchar(250) NOT NULL DEFAULT '',
  `permissionId` int(3) NOT NULL DEFAULT 0,
  `startBalance` int(11) NOT NULL DEFAULT 0,
  `borderColor` varchar(50) NOT NULL DEFAULT '',
  `backgroundColor` varchar(50) NOT NULL DEFAULT '',
  `image` varchar(250) NOT NULL DEFAULT '',
  `version` varchar(20) NOT NULL DEFAULT '',
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingapp.journal: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_access
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_access: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_chart_type
CREATE TABLE IF NOT EXISTS `journal_chart_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(11) DEFAULT NULL,
  `chartjsTypeId` int(3) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_chart_type: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_chart_where
CREATE TABLE IF NOT EXISTS `journal_chart_where` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_chart_where: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_chart_where_select
CREATE TABLE IF NOT EXISTS `journal_chart_where_select` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(11) DEFAULT NULL,
  `journalSelectId` int(6) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_chart_where_select: ~21 rows (approximately)

-- Dumping structure for table tradingapp.journal_chart_xaxis
CREATE TABLE IF NOT EXISTS `journal_chart_xaxis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_chart_xaxis: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_chart_yaxis
CREATE TABLE IF NOT EXISTS `journal_chart_yaxis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(11) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `fill` int(1) NOT NULL DEFAULT 0,
  `accumulation` int(1) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_chart_yaxis: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_custom_field
CREATE TABLE IF NOT EXISTS `journal_custom_field` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ilock` int(1) NOT NULL DEFAULT 0,
  `hide` int(1) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_custom_field: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_detail
CREATE TABLE IF NOT EXISTS `journal_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hr` int(1) NOT NULL DEFAULT 0,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `archives` int(1) NOT NULL DEFAULT 0,
  `presence` int(1) NOT NULL DEFAULT 1,
  `sorting` int(6) NOT NULL DEFAULT 9999,
  `ilock` int(1) NOT NULL DEFAULT 0,
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
  `f21` text NOT NULL,
  `f22` text NOT NULL,
  `f23` text NOT NULL,
  `f24` text NOT NULL,
  `f25` text NOT NULL,
  `f26` text NOT NULL,
  `f27` text NOT NULL,
  `f28` text NOT NULL,
  `f29` text NOT NULL,
  `f30` text NOT NULL,
  `f31` text NOT NULL,
  `f32` text NOT NULL,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingapp.journal_detail: ~100 rows (approximately)

-- Dumping structure for table tradingapp.journal_detail_images
CREATE TABLE IF NOT EXISTS `journal_detail_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalDetailId` varchar(50) NOT NULL DEFAULT '',
  `fn` varchar(3) NOT NULL DEFAULT '',
  `source` varchar(50) NOT NULL DEFAULT '',
  `path` varchar(250) NOT NULL DEFAULT '',
  `fileName` varchar(250) NOT NULL DEFAULT '',
  `caption` varchar(250) NOT NULL DEFAULT '',
  `sorting` int(2) NOT NULL DEFAULT 1,
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table tradingapp.journal_detail_images: ~0 rows (approximately)

-- Dumping structure for table tradingapp.journal_select
CREATE TABLE IF NOT EXISTS `journal_select` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `field` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(50) NOT NULL DEFAULT '',
  `sorting` int(3) NOT NULL DEFAULT 99,
  `presence` int(1) NOT NULL DEFAULT 1,
  `ilock` int(1) NOT NULL DEFAULT 0,
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_select: ~21 rows (approximately)

-- Dumping structure for table tradingapp.journal_table_view
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_table_view: ~4 rows (approximately)

-- Dumping structure for table tradingapp.journal_table_view_filter
CREATE TABLE IF NOT EXISTS `journal_table_view_filter` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(9) NOT NULL DEFAULT 0,
  `journalCustomFieldId` int(9) NOT NULL DEFAULT 0,
  `field` varchar(50) NOT NULL DEFAULT '',
  `selectId` varchar(50) NOT NULL DEFAULT '',
  `presence` int(1) NOT NULL DEFAULT 1,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `input_by` varchar(50) NOT NULL DEFAULT '',
  `update_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `update_by` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_table_view_filter: ~4 rows (approximately)

-- Dumping structure for table tradingapp.journal_table_view_show
CREATE TABLE IF NOT EXISTS `journal_table_view_show` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL DEFAULT '',
  `journalTableViewId` int(9) NOT NULL DEFAULT 0,
  `journalCustomFieldId` int(9) NOT NULL DEFAULT 0,
  `hide` int(1) NOT NULL DEFAULT 0,
  `presence` int(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_table_view_show: ~22 rows (approximately)

-- Dumping structure for table tradingapp.journal_token
CREATE TABLE IF NOT EXISTS `journal_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(50) DEFAULT NULL,
  `journalId` varchar(50) DEFAULT NULL,
  `journalTableViewId` varchar(50) DEFAULT NULL,
  `presence` int(1) DEFAULT 1,
  `accountId` varchar(50) DEFAULT NULL,
  `input_date` datetime DEFAULT '2023-01-01 00:00:00',
  `update_date` datetime DEFAULT '2023-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.journal_token: ~0 rows (approximately)

-- Dumping structure for table tradingapp.permission
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

-- Dumping data for table tradingapp.permission: ~2 rows (approximately)
INSERT INTO `permission` (`id`, `name`, `fontIcon`, `private`, `share`, `comments`, `note`) VALUES
	(1, 'Private', '<i class="bi bi-lock"></i>', 1, 0, 0, ''),
	(20, 'Share', '<i class="bi bi-link-45deg"></i>', 0, 1, 0, '');

-- Dumping structure for table tradingapp.plans
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `maxRow` int(5) DEFAULT 120,
  `verifiedBadge` int(1) DEFAULT 0,
  `icon` varchar(250) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.plans: ~3 rows (approximately)
INSERT INTO `plans` (`id`, `name`, `maxRow`, `verifiedBadge`, `icon`, `description`) VALUES
	(1, 'Personal', 100, 0, NULL, NULL),
	(20, 'Pro', 1020, 1, 'verified-badge-pro.png', NULL),
	(30, 'Business', 5020, 1, 'verified-badge-master.png', NULL);

-- Dumping structure for table tradingapp.template
CREATE TABLE IF NOT EXISTS `template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `presence` int(1) DEFAULT 1,
  `path` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.template: ~3 rows (approximately)
INSERT INTO `template` (`id`, `name`, `code`, `presence`, `path`) VALUES
	(10, 'Backtest', 'backtest', 0, './template/master/backtest.json'),
	(100, 'Journal FX Trading', 'journalFXTrading', 1, './template/master/journalFXTrading.json'),
	(101, 'TV Account History', 'TVaccountHistory', 0, './template/master/TVaccountHistory.json');

-- Dumping structure for table tradingapp.upload_history
CREATE TABLE IF NOT EXISTS `upload_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(50) NOT NULL,
  `template` varchar(50) NOT NULL,
  `accountId` varchar(50) NOT NULL,
  `total` int(6) NOT NULL DEFAULT 0,
  `path` varchar(250) NOT NULL,
  `files` varchar(250) NOT NULL,
  `input_date` datetime NOT NULL DEFAULT '2023-01-01 00:00:00',
  `exp_date` datetime NOT NULL DEFAULT '2024-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tradingapp.upload_history: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
