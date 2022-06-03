/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 8.0.25 : Database - official_download
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`official_download` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `official_download`;

/*Table structure for table `base_banner` */

DROP TABLE IF EXISTS `base_banner`;

CREATE TABLE `base_banner` (
  `code` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `image_url` varchar(256) DEFAULT NULL COMMENT '图片地址',
  `banner_url` varchar(256) DEFAULT NULL COMMENT '点击后去的地址',
  `disabled` tinyint(1) DEFAULT NULL COMMENT '是否可以点击',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `base_software` */

DROP TABLE IF EXISTS `base_software`;

CREATE TABLE `base_software` (
  `code` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '软件名称',
  `alias` varchar(32) DEFAULT NULL COMMENT '别名',
  `logo_url` varchar(256) DEFAULT NULL COMMENT 'logo地址',
  `official_website` varchar(128) DEFAULT NULL COMMENT '官网地址',
  `download_link` varchar(128) DEFAULT NULL COMMENT '下载地址',
  `pan_url` varchar(128) DEFAULT NULL COMMENT '网盘连接',
  `tutorial_url` varchar(128) DEFAULT NULL COMMENT '教程地址,推荐pdf',
  `like_num` int DEFAULT NULL COMMENT '点赞数 （小于负10删除网盘连接）',
  `affordable_alternative` varchar(32) DEFAULT NULL COMMENT '平替软件名',
  `software_type` int DEFAULT NULL COMMENT '类型',
  PRIMARY KEY (`code`),
  KEY `namne` (`name`,`alias`,`software_type`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `base_type` */

DROP TABLE IF EXISTS `base_type`;

CREATE TABLE `base_type` (
  `code` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(32) DEFAULT NULL COMMENT '分类名',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
