/*
 Navicat Premium Dump SQL

 Source Server         : yyyyssyy
 Source Server Type    : SQLite
 Source Server Version : 3045000 (3.45.0)
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3045000 (3.45.0)
 File Encoding         : 65001

 Date: 17/10/2024 08:05:03
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for followers
-- ----------------------------
DROP TABLE IF EXISTS "followers";
CREATE TABLE "followers" (
  "user_id" INTEGER,
  "follower_id" INTEGER,
  PRIMARY KEY ("user_id", "follower_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("follower_id") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- ----------------------------
-- Records of followers
-- ----------------------------
INSERT INTO "followers" VALUES (12, 13);
INSERT INTO "followers" VALUES (11, 13);
INSERT INTO "followers" VALUES (12, 14);
INSERT INTO "followers" VALUES (11, 14);
INSERT INTO "followers" VALUES (13, 14);
INSERT INTO "followers" VALUES (14, 15);
INSERT INTO "followers" VALUES (13, 15);
INSERT INTO "followers" VALUES (12, 15);
INSERT INTO "followers" VALUES (11, 15);
INSERT INTO "followers" VALUES (15, 16);
INSERT INTO "followers" VALUES (14, 16);
INSERT INTO "followers" VALUES (13, 16);
INSERT INTO "followers" VALUES (12, 16);
INSERT INTO "followers" VALUES (11, 16);
INSERT INTO "followers" VALUES (16, 17);
INSERT INTO "followers" VALUES (15, 17);
INSERT INTO "followers" VALUES (14, 17);
INSERT INTO "followers" VALUES (13, 17);
INSERT INTO "followers" VALUES (12, 17);
INSERT INTO "followers" VALUES (11, 17);
INSERT INTO "followers" VALUES (17, 18);
INSERT INTO "followers" VALUES (16, 18);
INSERT INTO "followers" VALUES (15, 18);
INSERT INTO "followers" VALUES (14, 18);
INSERT INTO "followers" VALUES (11, 18);
INSERT INTO "followers" VALUES (12, 18);
INSERT INTO "followers" VALUES (13, 18);
INSERT INTO "followers" VALUES (17, 19);
INSERT INTO "followers" VALUES (18, 19);
INSERT INTO "followers" VALUES (12, 19);
INSERT INTO "followers" VALUES (11, 19);
INSERT INTO "followers" VALUES (19, 20);
INSERT INTO "followers" VALUES (18, 20);
INSERT INTO "followers" VALUES (17, 20);
INSERT INTO "followers" VALUES (20, 11);

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS "likes";
CREATE TABLE "likes" (
  "post_id" INTEGER,
  "user_id" INTEGER,
  PRIMARY KEY ("post_id", "user_id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO "likes" VALUES (15, 17);
INSERT INTO "likes" VALUES (20, 17);
INSERT INTO "likes" VALUES (14, 17);
INSERT INTO "likes" VALUES (19, 17);
INSERT INTO "likes" VALUES (16, 17);
INSERT INTO "likes" VALUES (17, 17);
INSERT INTO "likes" VALUES (18, 17);

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS "posts";
CREATE TABLE "posts" (
  "post_id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "text" TEXT,
  "date_published" INTEGER,
  "author_id" INTEGER,
  "status" integer DEFAULT 0,
  FOREIGN KEY ("author_id") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO "posts" VALUES (14, 'In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.', 1729122571167, 11, 1);
INSERT INTO "posts" VALUES (15, 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.', 1729122602726, 12, 1);
INSERT INTO "posts" VALUES (16, 'Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.', 1729122789030, 13, 1);
INSERT INTO "posts" VALUES (17, 'Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.', 1729123048661, 14, 1);
INSERT INTO "posts" VALUES (18, 'In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.', 1729123098265, 15, 1);
INSERT INTO "posts" VALUES (19, 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.', 1729123130115, 16, 1);
INSERT INTO "posts" VALUES (20, 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.', 1729123166819, 17, 1);
INSERT INTO "posts" VALUES (21, 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.', 1729123247297, 18, 1);
INSERT INTO "posts" VALUES (22, 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.', 1729123280336, 19, 1);
INSERT INTO "posts" VALUES (23, 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.', 1729123330675, 20, 1);
INSERT INTO "posts" VALUES (24, 'Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.', 1729123339389, 20, 1);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
INSERT INTO "sqlite_sequence" VALUES ('users', 20);
INSERT INTO "sqlite_sequence" VALUES ('posts', 24);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "user_id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "first_name" text,
  "last_name" text,
  "username" text,
  "password" text,
  "salt" text,
  "session_token" text,
  UNIQUE ("username" ASC),
  CONSTRAINT "username_unique" UNIQUE ("username" ASC)
);

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "users" VALUES (11, 'Danika', 'Kells', 'dkells0', '$2a$10$dzq8beMkQvDMBpf9VX7GjuamHdQ.zwP6Xz3lEvR534qtp6MqqgM5e', '$2a$10$dzq8beMkQvDMBpf9VX7Gju', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMSwidXNlcm5hbWUiOiJka2VsbHMwIiwiaWF0IjoxNzI5MTIzNDQ2LCJleHAiOjE3MjkxMjcwNDZ9.t-HzRwDN5-cQwYSU6ULRjgb3f1b6YEO_357gDqnOb84');
INSERT INTO "users" VALUES (12, 'Jonie', 'Morston', 'jmorston1', '$2a$10$.jIPTmlyTROcWKU58uS/eu8xxCw8A6RsywAYrPfV5gSd8XzDdUHa6', '$2a$10$.jIPTmlyTROcWKU58uS/eu', NULL);
INSERT INTO "users" VALUES (13, 'Rogerio', 'Giovanardi', 'rgiovanardi2', '$2a$10$zN929om6ZN4T6rQ7HlsocuVaarirtKbdOTFCRDCUSny9i4CdLjsFi', '$2a$10$zN929om6ZN4T6rQ7Hlsocu', NULL);
INSERT INTO "users" VALUES (14, 'Bryanty', 'Issit', 'bissit3', '$2a$10$Kc.S54w0Xbbn1d6jydU.g.mHU.TlysZ2FGRXe/r9oly4gPP6pFFh6', '$2a$10$Kc.S54w0Xbbn1d6jydU.g.', NULL);
INSERT INTO "users" VALUES (15, 'Ethelbert', 'Ondricek', 'eondricek4', '$2a$10$XUrZp3GWCfJSPKlK2deXXeapRMSIq4w5xRh0aFMyIpjRP54Ogvx8O', '$2a$10$XUrZp3GWCfJSPKlK2deXXe', NULL);
INSERT INTO "users" VALUES (16, 'Law', 'Dowding', 'ldowding5', '$2a$10$JckXM5gw4RSlraW4unWBXeMyINun7nyrb6heBsYQh0GxusLaGgrwW', '$2a$10$JckXM5gw4RSlraW4unWBXe', NULL);
INSERT INTO "users" VALUES (17, 'Lisetta', 'Lindfors', 'llindfors6', '$2a$10$rqHl9wQtOIAMbEbNFr8GO.bf8UhOju79/S2Wgz18UwvDFfd6vwaPu', '$2a$10$rqHl9wQtOIAMbEbNFr8GO.', NULL);
INSERT INTO "users" VALUES (18, 'Riva', 'Lavalde', 'rlavalde7', '$2a$10$N1R1ghduVBBNgG3ZRACC..ZeAHTXJeYSmmjYAN1iNA1zh2DWHX/cO', '$2a$10$N1R1ghduVBBNgG3ZRACC..', NULL);
INSERT INTO "users" VALUES (19, 'Stinky', 'Stivani', 'sstivani8', '$2a$10$/uwck9NLI5.GVeXOOWx83OLTaV7spqEEwuoWN6HvZdQwOcbJLoMPi', '$2a$10$/uwck9NLI5.GVeXOOWx83O', NULL);
INSERT INTO "users" VALUES (20, 'Florentia', 'Deehan', 'fdeehan9', '$2a$10$o.B1k6DegDCxlR1L39doGOFaLClTONxlxUZCwYYxRzjVf8.CpWcnu', '$2a$10$o.B1k6DegDCxlR1L39doGO', NULL);

-- ----------------------------
-- Auto increment value for posts
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 24 WHERE name = 'posts';

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 20 WHERE name = 'users';

PRAGMA foreign_keys = true;
