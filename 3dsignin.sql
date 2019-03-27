/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80013
Source Host           : localhost:3306
Source Database       : 3dsignin

Target Server Type    : MYSQL
Target Server Version : 80013
File Encoding         : 65001

Date: 2019-03-27 13:56:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `t_activities`
-- ----------------------------
DROP TABLE IF EXISTS `t_activities`;
CREATE TABLE `t_activities` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `num` varchar(16) NOT NULL,
  `contact` varchar(8) NOT NULL,
  `phone` varchar(11) NOT NULL DEFAULT '',
  `startTime` date NOT NULL,
  `validity` int(8) NOT NULL DEFAULT '1',
  `account` varchar(16) NOT NULL,
  `remark` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(2) NOT NULL DEFAULT '-1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indexs_id` (`id`) USING BTREE,
  KEY `f_user` (`account`),
  CONSTRAINT `f_user` FOREIGN KEY (`account`) REFERENCES `t_users` (`name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_activities
-- ----------------------------
INSERT INTO `t_activities` VALUES ('45', '云南智巢科技有限公司年会', '100', '赵璇', '18213917293', '2019-03-04', '10', 'zx', '我只是个备注', '1', '2019-01-14 17:16:18', '2019-03-09 15:09:12');
INSERT INTO `t_activities` VALUES ('51', '2', '0-18', '2', '2', '2019-03-01', '3', 'rql', '2', '1', '2019-03-05 11:27:33', '2019-03-05 13:01:18');
INSERT INTO `t_activities` VALUES ('52', '4', '19-88', '4', '4', '2019-03-06', '8', 'zx', '4', '-1', '2019-03-05 17:24:57', '2019-03-09 15:36:55');
INSERT INTO `t_activities` VALUES ('54', '6', '19-88', '6', '6', '2019-03-26', '100', 'zx', '6', '1', '2019-03-09 15:37:15', '2019-03-27 13:42:34');
INSERT INTO `t_activities` VALUES ('55', '7', '19-88', '赵璇', '18213917293', '2019-03-11', '7', 'zx', '7', '1', '2019-03-11 16:09:56', '2019-03-11 16:12:27');

-- ----------------------------
-- Table structure for `t_signinusers`
-- ----------------------------
DROP TABLE IF EXISTS `t_signinusers`;
CREATE TABLE `t_signinusers` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `wechatId` varchar(255) NOT NULL,
  `activityId` int(16) NOT NULL,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` int(2) DEFAULT '1' COMMENT '鏄惁鍙敤',
  PRIMARY KEY (`id`),
  KEY `indexs_id` (`id`) USING BTREE,
  KEY `name` (`name`),
  KEY `f0` (`activityId`),
  CONSTRAINT `f0` FOREIGN KEY (`activityId`) REFERENCES `t_activities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_signinusers
-- ----------------------------
INSERT INTO `t_signinusers` VALUES ('35', 'abc-7854-dfdf-464afef-fdfd', '45', 'zhaoxuan', '18213917293', '2019-03-15 11:14:41', '2019-03-15 11:14:41', '1');
INSERT INTO `t_signinusers` VALUES ('36', 'abc-7854-dfdf-464afef-fdfd', '45', 'zx', '18213917294', '2019-03-15 11:48:51', '2019-03-15 11:48:51', '1');
INSERT INTO `t_signinusers` VALUES ('37', 'abc-7854-dfdf-464afef-fdfd', '45', 'zx', '18213917295', '2019-03-15 11:49:30', '2019-03-15 11:49:30', '1');
INSERT INTO `t_signinusers` VALUES ('38', 'abc-7854-dfdf-464afef-fdfd', '45', 'zx', '18213917296', '2019-03-15 15:07:01', '2019-03-15 15:07:01', '1');
INSERT INTO `t_signinusers` VALUES ('39', 'abc-7854-dfdf-464afef-fdfd', '45', '赵璇', '18213917297', '2019-03-27 13:55:10', '2019-03-27 13:55:10', '1');

-- ----------------------------
-- Table structure for `t_users`
-- ----------------------------
DROP TABLE IF EXISTS `t_users`;
CREATE TABLE `t_users` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `email` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `identity` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` int(2) DEFAULT '1' COMMENT '鏄惁鍙敤',
  PRIMARY KEY (`id`),
  KEY `indexs_id` (`id`) USING BTREE,
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_users
-- ----------------------------
INSERT INTO `t_users` VALUES ('24', 'zx', 'forever_ydy@163.com', '$2b$10$CRqcBW8X/L.HiSoTqkwNF.ibmCxH0DDgCvnwbCJCeGGowJIONmhS.', '//www.gravatar.com/avatar/159df4271d69ed162e860dce8b49f634?s=200&r=pg&d=mm', 'manager', '2019-03-05 10:31:42', '2019-03-05 11:45:06', '1');
INSERT INTO `t_users` VALUES ('25', 'rql', '605683153@qq.com', '$2b$10$Ox4O3H4oInDeSDGmUW3ZdOMFZABBwe1uJP8sNfLWm3SlHCqjb09au', '//www.gravatar.com/avatar/05db4600e9492dd9f50e4fcb357efd19?s=200&r=pg&d=mm', 'employee', '2019-03-05 11:16:04', '2019-03-05 11:45:45', '0');

-- ----------------------------
-- Table structure for `t_wins`
-- ----------------------------
DROP TABLE IF EXISTS `t_wins`;
CREATE TABLE `t_wins` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `activityId` int(8) NOT NULL,
  `signInUserID` int(8) NOT NULL,
  `grade` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `remark` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(2) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activityId` (`activityId`),
  KEY `signInUserID` (`signInUserID`),
  KEY `indexs_id` (`id`) USING BTREE,
  CONSTRAINT `t_wins_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `t_activities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_wins_ibfk_2` FOREIGN KEY (`signInUserID`) REFERENCES `t_signinusers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of t_wins
-- ----------------------------
INSERT INTO `t_wins` VALUES ('56', '非常高级的保温杯一个', '45', '37', '特等奖', '你很幸运', '1', '2019-03-15 14:02:57', '2019-03-15 14:03:00');
