-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bob
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `bob`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `bob` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `bob`;

--
-- Table structure for table `community`
--

DROP TABLE IF EXISTS `community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community` (
  `postId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetCount` int NOT NULL,
  `currentCount` int NOT NULL DEFAULT '1',
  `isClosed` tinyint(1) NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `category` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`postId`),
  KEY `Community_userId_deletedAt_idx` (`userId`,`deletedAt`),
  CONSTRAINT `Community_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community`
--

LOCK TABLES `community` WRITE;
/*!40000 ALTER TABLE `community` DISABLE KEYS */;
INSERT INTO `community` VALUES ('post-001','user-sarang','오늘 점심 청춘 치킨 같이 시켜요!',4,2,0,NULL,'2026-11-11 02:24:31.912',NULL,'2026-11-11 02:24:31.912',NULL),('post-002','user-hyemin','마루 덮밥 배달메이트 구합니다',3,1,0,NULL,'2026-11-11 02:24:31.912',NULL,'2026-11-11 02:24:31.912',NULL),('post-003','user-minjun','오늘 저녁 정든 부대찌개 드실 분',5,3,0,NULL,'2026-11-11 02:24:31.912',NULL,'2026-11-11 02:24:31.912',NULL),('post-004','user-seoyeon','최소주문금액 맞춰서 같이 주문해요',4,4,1,NULL,'2026-11-11 02:24:31.912',NULL,'2026-11-11 02:24:31.912',NULL),('post-005','user-junho','오늘 저녁 학생회관 석식 같이 먹을 사람',4,2,0,NULL,'2026-11-11 02:24:31.912',NULL,'2026-11-11 02:24:31.912',NULL),('post-1794907060397-khgf1','demo-user','ㅇ',2,1,0,'ㅇ','2026-11-17 09:17:40.399','2026-11-17 09:18:26.721','2026-11-17 09:18:26.723','한식'),('post-1794907145035-eo3fr','demo-user','ㅇ',2,1,0,'ㅇ','2026-11-17 09:19:05.037','2026-11-17 09:19:23.079','2026-11-17 09:19:23.081','한식');
/*!40000 ALTER TABLE `community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ownerapplication`
--

DROP TABLE IF EXISTS `ownerapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ownerapplication` (
  `applicationId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurantName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `businessNumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `rejectReason` text COLLATE utf8mb4_unicode_ci,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`applicationId`),
  KEY `OwnerApplication_status_createdAt_idx` (`status`,`createdAt`),
  KEY `OwnerApplication_userId_fkey` (`userId`),
  CONSTRAINT `OwnerApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ownerapplication`
--

LOCK TABLES `ownerapplication` WRITE;
/*!40000 ALTER TABLE `ownerapplication` DISABLE KEYS */;
INSERT INTO `ownerapplication` VALUES ('owner-1794331702325','123','2','111111111','사장님 계정 가입 요청','REJECTED','관리자 검토 결과 승인 기준을 충족하지 않습니다.','2026-11-10 17:30:48.819','2026-11-10 17:28:22.328','2026-11-10 17:30:48.822'),('owner-1794332030140','re','re','111111111','사장님 계정 가입 요청','APPROVED',NULL,'2026-11-10 17:34:28.808','2026-11-10 17:33:50.143','2026-11-10 17:34:28.810');
/*!40000 ALTER TABLE `ownerapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `reportId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reporterId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetType` enum('REVIEW','COMMUNITY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','RESOLVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `action` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`reportId`),
  KEY `Report_targetType_status_createdAt_idx` (`targetType`,`status`,`createdAt`),
  KEY `Report_reporterId_fkey` (`reporterId`),
  KEY `Report_reviewId_fkey` (`reviewId`),
  KEY `Report_postId_fkey` (`postId`),
  CONSTRAINT `Report_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `community` (`postId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Report_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`reviewId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES ('report-1794332547800','demo-user','REVIEW','review-012',NULL,'광고·홍보성 글',NULL,'RESOLVED','게시물 숨김','2026-11-10 17:43:12.046','2026-11-10 17:42:27.802');
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `restaurantId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `avgRating` double DEFAULT '0',
  `category` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suitableFor` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `imageUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`restaurantId`),
  KEY `Restaurant_ownerId_fkey` (`ownerId`),
  CONSTRAINT `Restaurant_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES ('restaurant-001','학생식당 오늘한끼','든든하고 저렴한 학교 앞 한식 백반집',37.4889,126.7828,5,'한식','1,2,4,6','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-17 09:18:53.756'),('restaurant-002','캠퍼스 김밥','혼밥하기 좋은 분식과 김밥 전문점',37.4893,126.7838,4,'분식','1,2','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-003','골목 즉석떡볶이','매콤한 떡볶이와 튀김을 함께 즐기는 곳',37.4879,126.7845,4.5,'분식','2,4,6','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-004','소담 국수집','잔치국수와 비빔국수가 인기인 작은 식당',37.4876,126.7819,4,'한식','1,2,4','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-005','마루 덮밥','빠르게 먹기 좋은 제육·연어 덮밥 전문점',37.4897,126.7818,4.2,'한식','1,2','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-17 08:44:47.137'),('restaurant-006','우리동네 카페','수업 전후 쉬어가기 좋은 조용한 카페',37.4869,126.7832,4,'기타','1,2,4','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-007','청춘 치킨','배달메이트와 함께 주문하기 좋은 치킨집',37.4901,126.7841,4.5,'기타','2,4,6','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-008','정든 부대찌개','여럿이 방문하기 좋은 얼큰한 부대찌개',37.4867,126.7809,4,'한식','2,4,6','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-009','한입 샐러드','가볍고 건강한 점심을 위한 샐러드 가게',37.489,126.785,5,'기타','1,2','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947'),('restaurant-010','학생회관 석식당','수업 후 든든하게 먹기 좋은 교내 석식 식당',37.4882,126.7854,4,'한식','1,2,4,6','2026-11-11 02:24:31.947',NULL,NULL,'2026-11-11 02:24:31.947');
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurantphoto`
--

DROP TABLE IF EXISTS `restaurantphoto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurantphoto` (
  `photoId` bigint NOT NULL AUTO_INCREMENT,
  `restaurantId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photoUrl` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`photoId`),
  KEY `RestaurantPhoto_restaurantId_fkey` (`restaurantId`),
  CONSTRAINT `RestaurantPhoto_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurantphoto`
--

LOCK TABLES `restaurantphoto` WRITE;
/*!40000 ALTER TABLE `restaurantphoto` DISABLE KEYS */;
/*!40000 ALTER TABLE `restaurantphoto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurantId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`reviewId`),
  KEY `Review_restaurantId_fkey` (`restaurantId`),
  KEY `Review_userId_deletedAt_idx` (`userId`,`deletedAt`),
  CONSTRAINT `Review_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`restaurantId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('review-003','user-minjun','restaurant-002','김밥이 든든하고 혼자 먹기 편합니다.',4,'2026-10-07 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-004','user-seoyeon','restaurant-002','참치김밥이 맛있어요. 포장도 빨라요.',4,'2026-10-08 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-005','user-junho','restaurant-003','맵기는 하지만 튀김과 같이 먹으면 딱 좋아요.',5,'2026-10-08 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-006','user-sarang','restaurant-004','국물이 깔끔하고 양이 넉넉합니다.',4,'2026-10-09 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-007','user-hyemin','restaurant-005','제육덮밥 양이 많아서 든든하게 먹었어요.',5,'2026-10-09 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-008','user-minjun','restaurant-005','키오스크 주문이라 점심에도 편합니다.',4,'2026-10-10 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-009','user-seoyeon','restaurant-006','콘센트가 많고 조용해서 공부하기 좋아요.',4,'2026-10-10 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-010','user-junho','restaurant-007','치킨이 바삭하고 배달이 빨랐어요.',5,'2026-10-11 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-011','user-sarang','restaurant-008','여럿이 먹기 좋고 사리가 다양해요.',4,'2026-10-11 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-012','user-hyemin','restaurant-009','신선하고 소스 선택지가 많아서 좋습니다.',5,'2026-10-12 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-013','user-minjun','restaurant-010','수업 끝나고 먹기 좋은 든든한 석식 메뉴예요.',4,'2026-10-12 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-014','user-junho','restaurant-003','친구들과 나눠 먹기 좋은 메뉴예요.',4,'2026-10-13 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-015','user-sarang','restaurant-007','배달메이트를 구해서 배달비를 아꼈어요.',4,'2026-10-13 00:00:00.000',NULL,'2026-11-11 02:24:31.972'),('review-1793151111509','test','restaurant-005','맛있어요!',5,'2026-10-28 01:31:51.512',NULL,'2026-11-11 02:24:31.972'),('review-1794902022067','demo-user','restaurant-005','맛잇긔연',3,'2026-11-17 07:53:42.070','2026-11-17 07:54:22.769','2026-11-17 07:54:22.771'),('review-1794905087128','demo-user','restaurant-005','ㅇ',4,'2026-11-17 08:44:47.129','2026-11-17 08:44:50.615','2026-11-17 08:44:50.616'),('review-1794907133747','demo-user','restaurant-001','ㅇ',5,'2026-11-17 09:18:53.750','2026-11-17 09:19:21.093','2026-11-17 09:19:21.095');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewphoto`
--

DROP TABLE IF EXISTS `reviewphoto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewphoto` (
  `photoId` bigint NOT NULL AUTO_INCREMENT,
  `reviewId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photoUrl` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`photoId`),
  KEY `ReviewPhoto_reviewId_fkey` (`reviewId`),
  CONSTRAINT `ReviewPhoto_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`reviewId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewphoto`
--

LOCK TABLES `reviewphoto` WRITE;
/*!40000 ALTER TABLE `reviewphoto` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviewphoto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isStudentVerified` tinyint(1) DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `ownerApprovalStatus` enum('NONE','PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NONE',
  `role` enum('USER','OWNER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('123','123','123@123.com','1234','',0,'2026-11-10 17:28:22.312','REJECTED','USER','2026-11-10 17:30:48.835'),('admin','쩝쩝대 관리자','admin@jjupjjupdae.test','admin1234','쩝쩝대 운영팀',1,'2026-11-10 17:55:09.558','NONE','ADMIN','2026-11-10 17:55:09.558'),('demo','홍길동','demo@test.com','1234','부천대',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('demo-user','홍길동','demo@jjupjjupdae.test','demo1234','부천대학교',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-17 09:17:24.164'),('demo1','뷰정이','boo@boo.com','1234','부천대',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('re','re','re@re.com','1234','',0,'2026-11-10 17:33:50.136','APPROVED','OWNER','2026-11-10 17:34:28.816'),('test','홍길동','test@test.comm','1234','부천대',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('user-hyemin','이혜민','hyemin@jjupjjupdae.test','demo1234','우리대학교',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('user-junho','정준호','junho@jjupjjupdae.test','demo1234','우리대학교',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('user-minjun','박민준','minjun@jjupjjupdae.test','demo1234','우리대학교',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('user-sarang','김사랑','sarang@jjupjjupdae.test','demo1234','우리대학교',1,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000'),('user-seoyeon','최서연','seoyeon@jjupjjupdae.test','demo1234','우리대학교',0,'2026-11-11 02:24:32.000','NONE','USER','2026-11-11 02:24:32.000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bob'
--

--
-- Dumping routines for database 'bob'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-17 19:58:38
