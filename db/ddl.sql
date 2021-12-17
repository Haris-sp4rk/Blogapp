
USE BLOGGING;

CREATE TABLE IF NOT EXISTS `Cattegory`
  (
    `Name`           VARCHAR(30) NOT NULL,
    `ID`             MEDIUMINT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (ID)

  );

CREATE TABLE IF NOT EXISTS `Blog`
  (

    
    `title`        VARCHAR(40) UNIQUE,
    `Content`      VARCHAR(10000) NOT NULL ,
    `Blog_ID`      VARCHAR(500) NOT NULL ,
    `Cattegory`   MEDIUMINT NOT NULL ,
    `Rating`       INTEGER DEFAULT 0,
    `Likes`        INTEGER DEFAULT 0,
    `Views`        MEDIUMINT NOT NULL DEFAULT 0,
    `Users_Handle` VARCHAR(500) NOT NULL,
    `Created_AT` DATE,
    `Updated_AT` DATE,
    FOREIGN KEY ( `Cattegory`) REFERENCES `Cattegory` (`ID`)
  ) ;
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_PK` PRIMARY KEY ( `Blog_ID` ) ;


CREATE TABLE IF NOT EXISTS `Comments`
  (
    `User_ID`      VARCHAR(500) NOT NULL ,
    `Content`      VARCHAR(40) NOT NULL ,
    `Comment_id`   VARCHAR(40) NOT NULL ,
    `Comment_Date` DATE NOT NULL ,
    `Blog_Blog_ID` VARCHAR(500) NOT NULL
  ) ;
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_PK` PRIMARY KEY ( `User_ID`, `Comment_id` ) ;


CREATE TABLE IF NOT EXISTS `Friends`
  (
    `Friends_handle` VARCHAR(500) NOT NULL ,
    `Users_Handle`   VARCHAR(500) NOT NULL
  ) ;
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_PK` PRIMARY KEY ( `Friends_handle` ) ;


CREATE TABLE IF NOT EXISTS `Likes`
  (
    `Liker_ID`    VARCHAR(40) NOT NULL ,
    `Blog_Blog_ID` VARCHAR(500) NOT NULL
  ) ;
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_PK` PRIMARY KEY ( `Liker_ID`, `Blog_Blog_ID` ) ;


CREATE TABLE IF NOT EXISTS `Photos`
  (
    
    `Blog_Blog_ID` VARCHAR(500) NOT NULL ,
    `Photo_ID`     VARCHAR(40) NOT NULL 
  );


CREATE TABLE IF NOT EXISTS `Users`
  (
    `Name`            VARCHAR(25) NOT NULL ,
    `Handle`          VARCHAR(500) NOT NULL ,
    `Email`           VARCHAR(100) NOT NULL ,
    `Password`       VARCHAR(500) NOT NULL ,
    `Start_Date`      DATE NOT NULL ,
    `Profile_Picture` VARCHAR(15) DEFAULT 'pic.svg' ,
    `Gender`          VARCHAR(10) ,
    `Status`          VARCHAR(10) DEFAULT 'UNACTIVE',
    `D.O.B`         DATE,
    `JWT`           VARCHAR(500) NOT NULL
  ) ;


ALTER TABLE `Users` ADD CONSTRAINT `Users_PK` PRIMARY KEY ( `Handle` ) ;

ALTER TABLE `Blog` ADD CONSTRAINT `Blog_Users_FK` FOREIGN KEY ( `Users_Handle` ) REFERENCES `Users` ( `Handle` ) ON DELETE CASCADE ON UPDATE CASCADE ;

ALTER TABLE `Comments` ADD CONSTRAINT `Comments_Blog_FK` FOREIGN KEY ( `Blog_Blog_ID` ) REFERENCES `Blog` ( `Blog_ID` ) ON DELETE CASCADE ON UPDATE CASCADE ;

ALTER TABLE `Friends` ADD CONSTRAINT `Friends_Users_FK` FOREIGN KEY ( `Users_Handle` ) REFERENCES `Users` ( `Handle` ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Likes` ADD CONSTRAINT `Likes_Blog_FK` FOREIGN KEY ( `Blog_Blog_ID` ) REFERENCES `Blog` ( `Blog_ID` ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Photos` ADD CONSTRAINT `Photos_Blog_FK` FOREIGN KEY ( `Blog_Blog_ID` ) REFERENCES `Blog` ( `Blog_ID` ) ON DELETE CASCADE ON UPDATE CASCADE;