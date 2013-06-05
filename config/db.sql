-- phpMyAdmin SQL Dump
-- version 4.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 05, 2013 at 09:55 PM
-- Server version: 5.5.31-0ubuntu0.12.10.1
-- PHP Version: 5.4.6-1ubuntu1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `dataanalyse2`
--

-- --------------------------------------------------------

--
-- Table structure for table `consumptions`
--

CREATE TABLE IF NOT EXISTS `consumptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consumption` float(8,2) NOT NULL,
  `datetime` datetime NOT NULL,
  `rate` varchar(5) NOT NULL DEFAULT '1',
  `meter_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_consumptions_meters_idx` (`meter_id`),
  KEY `quickSearch` (`datetime`,`rate`,`meter_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=367618 ;

-- --------------------------------------------------------

--
-- Table structure for table `daily_consumptions`
--

CREATE TABLE IF NOT EXISTS `daily_consumptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consumption` float(8,2) NOT NULL,
  `datetime` datetime NOT NULL,
  `rate` varchar(5) NOT NULL DEFAULT '1',
  `meter_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_consumptions_meters_idx` (`meter_id`),
  KEY `quickSearch` (`datetime`,`rate`,`meter_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8763 ;

-- --------------------------------------------------------

--
-- Table structure for table `meters`
--

CREATE TABLE IF NOT EXISTS `meters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(45) NOT NULL DEFAULT 'label',
  `identifier` varchar(32) NOT NULL,
  `meter_type` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_consumptions`
--

CREATE TABLE IF NOT EXISTS `monthly_consumptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consumption` float(8,2) NOT NULL,
  `datetime` datetime NOT NULL,
  `rate` varchar(5) NOT NULL DEFAULT '1',
  `meter_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_consumptions_meters_idx` (`meter_id`),
  KEY `quickSearch` (`datetime`,`rate`,`meter_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=302 ;

-- --------------------------------------------------------

--
-- Table structure for table `weather`
--

CREATE TABLE IF NOT EXISTS `weather` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `station` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `temperature` float(3,1) NOT NULL COMMENT 'In celcius degrees',
  PRIMARY KEY (`id`),
  KEY `station` (`station`),
  KEY `station_2` (`station`,`datetime`,`temperature`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29810 ;

-- --------------------------------------------------------

--
-- Table structure for table `weather_stations`
--

CREATE TABLE IF NOT EXISTS `weather_stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` point NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=311 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `consumptions`
--
ALTER TABLE `consumptions`
  ADD CONSTRAINT `fk_consumptions_meters` FOREIGN KEY (`meter_id`) REFERENCES `meters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `weather`
--
ALTER TABLE `weather`
  ADD CONSTRAINT `weather_ibfk_1` FOREIGN KEY (`station`) REFERENCES `weather_stations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
