-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (x86_64)
--
-- Host: localhost    Database: upload_service
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `client_master`
--

DROP TABLE IF EXISTS `client_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_master`
--

LOCK TABLES `client_master` WRITE;
/*!40000 ALTER TABLE `client_master` DISABLE KEYS */;
INSERT INTO `client_master` VALUES (1,'instaRefi',NULL),(2,'Vp',NULL),(3,'meetthedrapers',NULL),(6,'Apple1','2025-05-12 12:13:05'),(7,'random client',NULL),(8,'My New Client',NULL);
/*!40000 ALTER TABLE `client_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `cdn_path` text,
  `s3_path` text,
  `client_id` int DEFAULT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `client_id` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'fd932206-d0ce-41b4-847d-eba098b41c23','smaple.png',NULL,NULL,2,'admin','2025-04-28 06:40:59','2025-05-12 07:33:46'),(2,'db342762-0241-41e9-b53b-44d05b0c9259','smaple.png',NULL,NULL,2,'admin','2025-04-28 06:42:17','2025-05-12 07:33:46'),(4,'505972c2-320c-42d6-8556-f841bbf5742b','smaple.png',NULL,NULL,2,'admin','2025-04-28 08:49:43','2025-05-12 07:33:46'),(5,'23f784cf-d663-4adb-b4b7-a3d37a5e2221','testimage.jpeg',NULL,NULL,5,'admin','2025-05-06 09:31:07','2025-05-12 07:33:46'),(6,'cc84129b-a13f-42a1-827a-3e05fc17f98f','testimage1.jpeg',NULL,NULL,5,'admin','2025-05-06 09:32:25','2025-05-12 07:33:46'),(7,'67521ebd-9b6e-4432-88d7-12377351a42f','smaple.png',NULL,NULL,2,'admin','2025-05-08 09:19:44','2025-05-12 07:33:46'),(8,'4893a961-4ecc-4fc4-9aa5-bed58227bf15','smaple.png',NULL,NULL,1,'admin','2025-05-08 14:31:34','2025-05-12 07:33:46'),(9,'64890de0-13e4-4ba3-9117-0385142594ad','testimage1.jpeg',NULL,NULL,2,'admin','2025-05-12 07:04:48','2025-05-12 07:33:46'),(10,'e3c62700-8fb6-44ef-b53b-29aadb8efecb','smaple.png',NULL,NULL,1,'admin','2025-05-12 11:06:56','2025-05-12 11:06:56'),(11,'404c0b2f-34ee-4972-b921-0fb35d9cfa39','Test sample 1.png','https://cdn-content.us-sea-1.linodeobjects.com/Vp/Test%20sample%201.png','Vp/Test sample 1.png',2,'admin','2025-05-14 12:09:37','2025-05-14 12:09:37');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_configs`
--

DROP TABLE IF EXISTS `file_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `format` varchar(50) DEFAULT NULL,
  `min_size` int DEFAULT NULL,
  `max_size` int DEFAULT NULL,
  `extensions` text,
  `types` text,
  `client_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_file_configs_client` (`client_id`),
  CONSTRAINT `fk_file_configs_client` FOREIGN KEY (`client_id`) REFERENCES `client_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_configs`
--

LOCK TABLES `file_configs` WRITE;
/*!40000 ALTER TABLE `file_configs` DISABLE KEYS */;
INSERT INTO `file_configs` VALUES (1,'document',1024,10485760,'.pdf,.doc','application/pdf,application/msword',1),(2,'image',1024,5242880,'.jpg,.jpeg,.png','image/jpeg,image/png',1),(4,'document',1024,10485760,'.pdf,.doc','application/pdf,application/msword',2),(5,'image',1024,5242880,'.jpg,.jpeg,.png','image/jpeg,image/png',2),(6,'document',1024,10485760,'.pdf,.doc','application/pdf,application/msword',3),(7,'image',1024,5242880,'.jpg,.jpeg,.png','image/jpeg,image/png',3);
/*!40000 ALTER TABLE `file_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` varchar(10) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `doc_id` int DEFAULT NULL,
  `message` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upload_configs`
--

DROP TABLE IF EXISTS `upload_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upload_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` varchar(50) DEFAULT NULL,
  `service` varchar(50) DEFAULT NULL,
  `access_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `bucket_name` varchar(255) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upload_configs`
--

LOCK TABLES `upload_configs` WRITE;
/*!40000 ALTER TABLE `upload_configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `upload_configs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-15 11:07:37
