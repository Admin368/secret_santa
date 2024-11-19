-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 14, 2024 at 10:56 PM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maravtak_santa_production`
--

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--

CREATE TABLE `Account` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerAccountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

CREATE TABLE `group` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_matched` tinyint(1) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `group`
--

INSERT INTO `group` (`id`, `name`, `password`, `is_matched`, `email`, `createdAt`) VALUES
('clpz2uwwy0000d1jr081mxkgz', 'OurChristmas ', '133', 1, NULL, '2023-12-11 16:38:41.087'),
('clpz34xnc0008d1jrm9a24b45', 'Our Christmas ', '2647', 1, NULL, '2023-12-11 16:38:41.087'),
('clpz7nmdm0000gbblnuc0x4nl', 'New Ligong List', '56', 1, 'paulkachule@hotmail.com', '2023-12-11 16:38:41.087'),
('clpzg1cpy0000i5c2fmlzwftt', 'Babakoto', '3853', 0, 'orelys37@gmail.com', '2023-12-11 16:38:41.087'),
('clpzghdau0003i5c2qvwmmpal', 'x', '426', 1, 'y@email.com', '2023-12-11 16:38:41.087'),
('clpzgllca000ai5c2gzt3p9q0', 'Secrete gift', '1064', 0, 'gadaacode12@gmail.com', '2023-12-11 16:38:41.087'),
('clq0dlgof0000wywuoxiyjtbm', 'Tests 66', '4122', 1, 'santa@maravianwebservices.com', '2023-12-11 16:38:41.087'),
('clq14lnrc0000akero9wqrfjo', 'Promo', '2503', 1, 'sk8kelwin@gmail.com', '2023-12-11 16:26:21.960'),
('clq1sifby0000jt4ehl3m80n4', '五虎', '4360', 0, '2660819786@qq.com', '2023-12-12 03:35:41.854'),
('clq3tyap00000kd75iqibyquv', 'Nisarg', '362', 0, 'itsnisargthakkar@gmail.com', '2023-12-13 13:51:34.308'),
('clqcrpsey000039c65kg4clpl', 'Family', '1223', 0, 'none@none.com', '2023-12-19 19:58:53.721'),
('clqi3ewfh00008jmk1nsroisn', 'theiosjack69', '2066', 0, 'theiosjack69@gmail.com', '2023-12-23 13:25:11.980'),
('clqztzn22000012m76gnhcucy', 'test', '4960', 1, 'janneaujulien@free.fr', '2024-01-04 23:21:14.617'),
('clssz9h820000fua8g741fuae', 'noel 2024', '873', 1, 'janneaujulien@free.fr', '2024-02-19 13:33:53.139'),
('cm0c2qjc7000010b94y7qvt7a', 'asd', '2323', 0, 'dasdsadasd@qq.com', '2024-08-27 06:56:41.574'),
('cm1dv217500004mj4qghj71yt', 'Test 2024.09.23', '4263', 1, 'paulkachule@maravian.com', '2024-09-22 17:36:55.389'),
('cm3atbgn80000fnmfo4b1woyh', 'Ciaoatutti', '4296', 0, 'Jspkay@gmail.com', '2024-11-09 23:44:22.531'),
('cm3hhtebj0000qmtcjisshngg', 'Ligong 2024', '3165', 0, 'paulkachule@hotmail.com', '2024-11-14 15:56:47.166');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hints` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hints_sent` tinyint(1) DEFAULT NULL,
  `receiver_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_is_seen` tinyint(1) DEFAULT NULL,
  `group_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `name`, `email`, `hints`, `hints_sent`, `receiver_id`, `link`, `link_is_seen`, `group_id`) VALUES
('clpz2w6d10002d1jr88iu4ji5', 'Andrew', 'makalaniandrewl@gmail.com', NULL, NULL, 'clpz2yp0s0006d1jr63qop8de', 'https://santa.maravian.com/revelio?id=clpz2w6d10002d1jr88iu4ji5', 1, 'clpz2uwwy0000d1jr081mxkgz'),
('clpz2xq260004d1jrf67dedok', 'Paul', 'pkachule@gmail.com', '[\"This Winter is very cold\",\"Shoe size 42, Shirt size Large\"]', NULL, 'clpz2w6d10002d1jr88iu4ji5', 'https://santa.maravian.com/revelio?id=clpz2xq260004d1jrf67dedok', 1, 'clpz2uwwy0000d1jr081mxkgz'),
('clpz2yp0s0006d1jr63qop8de', 'Charity', 'kachulecharity@gmail.com', NULL, NULL, 'clpz2xq260004d1jrf67dedok', 'https://santa.maravian.com/revelio?id=clpz2yp0s0006d1jr63qop8de', 1, 'clpz2uwwy0000d1jr081mxkgz'),
('clpz36b5y000ad1jrw54tijzj', 'Paul', 'paulkachule@hotmail.com', NULL, NULL, 'clpz3732m0001k73o4s1lubnq', 'https://santa.maravian.com/revelio?id=clpz36b5y000ad1jrw54tijzj', 0, 'clpz34xnc0008d1jrm9a24b45'),
('clpz36ult000cd1jrcp2y027k', 'Andrew', 'makalaniandrewl@gmail.com', NULL, NULL, 'clpz36b5y000ad1jrw54tijzj', 'https://santa.maravian.com/revelio?id=clpz36ult000cd1jrcp2y027k', 0, 'clpz34xnc0008d1jrm9a24b45'),
('clpz3732m0001k73o4s1lubnq', 'Charity', 'kachulecharity@gmail.com', NULL, NULL, 'clpz36ult000cd1jrcp2y027k', 'https://santa.maravian.com/revelio?id=clpz3732m0001k73o4s1lubnq', 0, 'clpz34xnc0008d1jrm9a24b45'),
('clpz7otp20002gbbljtfn33vl', 'Emmanuel', 'kaechem@outlook.com', '[\"Creative is fun\",\"Personal Would Be Lovely\",\"No pressure, let love guide you\",\"Keeping the Holiday Memorable. I shall keep this memory always\"]', NULL, 'clpz7q6yg0008gbbl8t8pkkg4', 'https://santa.maravian.com/revelio?id=clpz7otp20002gbbljtfn33vl', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7p87b0004gbblo3xsstrh', 'Layla', 'matavellayla@gmail.com', NULL, NULL, 'clpz7rqz7000ggbblj5ozbxl0', 'https://santa.maravian.com/revelio?id=clpz7p87b0004gbblo3xsstrh', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7pler0006gbbltfycypex', 'Jamila', 'jamilaconforme.jc@gmail.com', '[\"Don’t have any favorite color, shoe size 39, clothes M, anything that you think will look good on me😅\"]', NULL, 'clpz7otp20002gbbljtfn33vl', 'https://santa.maravian.com/revelio?id=clpz7pler0006gbbltfycypex', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7q6yg0008gbbl8t8pkkg4', 'Marielle', 'mariellegaba97@gmail.com', '[\"I love to smell good and I love chocolate \"]', NULL, 'clpz7p87b0004gbblo3xsstrh', 'https://santa.maravian.com/revelio?id=clpz7q6yg0008gbbl8t8pkkg4', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7qjf0000agbblc0lu5kka', 'Theoneste', 'theonesten92@gmail.com', NULL, NULL, 'clpz7rgxm000egbbl1xetustj', 'https://santa.maravian.com/revelio?id=clpz7qjf0000agbblc0lu5kka', 0, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7qvk6000cgbbl64hsy7gb', 'Muchanty', 'umuchanty@yahoo.com', NULL, NULL, 'clpz7pler0006gbbltfycypex', 'https://santa.maravian.com/revelio?id=clpz7qvk6000cgbbl64hsy7gb', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7rgxm000egbbl1xetustj', 'Aubrey', 'chigedeaubrey@yahoo.co.uk', NULL, NULL, 'clpz7qvk6000cgbbl64hsy7gb', 'https://santa.maravian.com/revelio?id=clpz7rgxm000egbbl1xetustj', 0, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7rqz7000ggbblj5ozbxl0', 'Kamate', 'gaiuskyanamire10@gmail.com', NULL, NULL, 'clpz7s0yp000igbblzasrqler', 'https://santa.maravian.com/revelio?id=clpz7rqz7000ggbblj5ozbxl0', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpz7s0yp000igbblzasrqler', 'Paulo', 'paulkachule@hotmail.com', '[\"This winter is very cold\",\"I like food as well\"]', NULL, 'clpz7qjf0000agbblc0lu5kka', 'https://santa.maravian.com/revelio?id=clpz7s0yp000igbblzasrqler', 0, 'clpz7nmdm0000gbblnuc0x4nl'),
('clpzg1d2g0002i5c2sjdha3gj', 'Orelys ', 'orelys37@gmail.com', NULL, NULL, NULL, NULL, NULL, 'clpzg1cpy0000i5c2fmlzwftt'),
('clpzghdnd0005i5c2thcdnryd', 'y', 'y@email.com', NULL, NULL, 'clpzgibpg0007i5c2gzxpe2jz', 'https://santa.maravian.com/revelio?id=clpzghdnd0005i5c2thcdnryd', 0, 'clpzghdau0003i5c2qvwmmpal'),
('clpzgibpg0007i5c2gzxpe2jz', 'b', 'b@email.com', NULL, NULL, 'clpzgiqp40009i5c267tkv3tw', 'https://santa.maravian.com/revelio?id=clpzgibpg0007i5c2gzxpe2jz', 0, 'clpzghdau0003i5c2qvwmmpal'),
('clpzgiqp40009i5c267tkv3tw', 'c', 'c@email.com', NULL, NULL, 'clpzghdnd0005i5c2thcdnryd', 'https://santa.maravian.com/revelio?id=clpzgiqp40009i5c267tkv3tw', 0, 'clpzghdau0003i5c2qvwmmpal'),
('clq0dlh0z0002wywufh3u3hsv', 'User 1', 'santa@maravianwebservices.com', NULL, NULL, 'clq0doum9000iwywu473ram1a', 'https://santa.maravian.com/revelio?id=clq0dlh0z0002wywufh3u3hsv', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dlxnb0004wywu17bizd1l', 'User 2', 'santa@maravianwebservices.com', NULL, NULL, 'clq0do2il000gwywuhrodvj43', 'https://santa.maravian.com/revelio?id=clq0dlxnb0004wywu17bizd1l', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dm4jt0006wywu63knmazl', 'User 3', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dnt8a000ewywugtvrglqs', 'https://santa.maravian.com/revelio?id=clq0dm4jt0006wywu63knmazl', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dmjij0008wywume50ytan', 'User 4', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dlh0z0002wywufh3u3hsv', 'https://santa.maravian.com/revelio?id=clq0dmjij0008wywume50ytan', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dn2tl000awywubjttk427', 'User 5', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dmjij0008wywume50ytan', 'https://santa.maravian.com/revelio?id=clq0dn2tl000awywubjttk427', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dne6p000cwywu4v476qhc', 'User 6', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dn2tl000awywubjttk427', 'https://santa.maravian.com/revelio?id=clq0dne6p000cwywu4v476qhc', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0dnt8a000ewywugtvrglqs', 'User 7', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dne6p000cwywu4v476qhc', 'https://santa.maravian.com/revelio?id=clq0dnt8a000ewywugtvrglqs', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0do2il000gwywuhrodvj43', 'User 8', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dm4jt0006wywu63knmazl', 'https://santa.maravian.com/revelio?id=clq0do2il000gwywuhrodvj43', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq0doum9000iwywu473ram1a', 'User 9', 'santa@maravianwebservices.com', NULL, NULL, 'clq0dlxnb0004wywu17bizd1l', 'https://santa.maravian.com/revelio?id=clq0doum9000iwywu473ram1a', 0, 'clq0dlgof0000wywuoxiyjtbm'),
('clq14lo420002akermhfbor77', 'Kelwin', 'sk8kelwin@gmail.com', NULL, NULL, 'clq14my380006akerqa9nghs1', 'https://santa.maravian.com/revelio?id=clq14lo420002akermhfbor77', 0, 'clq14lnrc0000akero9wqrfjo'),
('clq14mqwu0004aker0v11rxe0', 'Boby', 'sk8kelwin@gmail.com', NULL, NULL, 'clq14lo420002akermhfbor77', 'https://santa.maravian.com/revelio?id=clq14mqwu0004aker0v11rxe0', 0, 'clq14lnrc0000akero9wqrfjo'),
('clq14my380006akerqa9nghs1', 'John', 'sk8kelwin@gmail.com', NULL, NULL, 'clq14mqwu0004aker0v11rxe0', 'https://santa.maravian.com/revelio?id=clq14my380006akerqa9nghs1', 0, 'clq14lnrc0000akero9wqrfjo'),
('clq1sifom0002jt4eessa4rnl', '陈哥', '2660819786@qq.com', NULL, NULL, NULL, NULL, NULL, 'clq1sifby0000jt4ehl3m80n4'),
('clq2urwme0001o1inj1o9ew2t', 'Edna', 'edymar1303@gmail.com', NULL, NULL, 'clq2uujao0002o1inp1adwuy0', 'https://santa.maravian.com/revelio?id=clq2urwme0001o1inj1o9ew2t', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clq2uujao0002o1inp1adwuy0', 'Karene', 'ulrichkarene@gmail.com', '[\"Another beautiful bible in English \"]', NULL, 'clq2urwme0001o1inj1o9ew2t', 'https://santa.maravian.com/revelio?id=clq2uujao0002o1inp1adwuy0', 1, 'clpz7nmdm0000gbblnuc0x4nl'),
('clq3tyb1t0002kd75l551iond', 'Nisarg Thakkar', 'itsnisargthakkar@gmail.com', NULL, NULL, NULL, NULL, NULL, 'clq3tyap00000kd75iqibyquv'),
('clqcrpsrv000239c6wfeaqfh5', 'N', 'none@none.com', NULL, NULL, NULL, NULL, NULL, 'clqcrpsey000039c65kg4clpl'),
('clqi3ews100028jmkqmupxaur', 'theiosjack', 'theiosjack69@gmail.com', NULL, NULL, NULL, NULL, NULL, 'clqi3ewfh00008jmk1nsroisn'),
('clqztzner000212m7cf8sjray', 'testjulien', 'janneaujulien@free.fr', NULL, NULL, 'clqzu1rjl000412m7gywroj3w', 'https://santa.maravian.com/revelio?id=clqztzner000212m7cf8sjray', 0, 'clqztzn22000012m76gnhcucy'),
('clqzu1rjl000412m7gywroj3w', 'juju', 'julien.dev.paris@gmail.com', '[\"tennis\"]', NULL, 'clqzu1yo7000612m7ct7az21q', 'https://santa.maravian.com/revelio?id=clqzu1rjl000412m7gywroj3w', 1, 'clqztzn22000012m76gnhcucy'),
('clqzu1yo7000612m7ct7az21q', 'julll', 'julien.janneau@gmail.com', NULL, NULL, 'clqztzner000212m7cf8sjray', 'https://santa.maravian.com/revelio?id=clqzu1yo7000612m7ct7az21q', 0, 'clqztzn22000012m76gnhcucy'),
('clssz9hkm0002fua8yny2su38', 'julien', 'janneaujulien@free.fr', NULL, NULL, 'clsszbr9i0006fua88k9hlzjo', 'https://santa.maravian.com/revelio?id=clssz9hkm0002fua8yny2su38', 0, 'clssz9h820000fua8g741fuae'),
('clsszbatk0004fua8dxygzepe', 'juju', 'julien.dev.paris@gmail.com', NULL, NULL, 'clssz9hkm0002fua8yny2su38', 'https://santa.maravian.com/revelio?id=clsszbatk0004fua8dxygzepe', 0, 'clssz9h820000fua8g741fuae'),
('clsszbr9i0006fua88k9hlzjo', 'jul', 'julien@tolk.ai', NULL, NULL, 'clsszbatk0004fua8dxygzepe', 'https://santa.maravian.com/revelio?id=clsszbr9i0006fua88k9hlzjo', 0, 'clssz9h820000fua8g741fuae'),
('cm0c2qjop000210b9qhp3zgcd', 'asdasdas', 'dasdsadasd@qq.com', NULL, NULL, NULL, NULL, NULL, 'cm0c2qjc7000010b94y7qvt7a'),
('cm1dv22mw00024mj4nb6mjtfy', 'Paulo', 'paulkachule@maravian.com', NULL, NULL, 'cm1dve5ah00064mj4omjn8zbl', 'http://192.168.1.102:3000/revelio?id=cm1dv22mw00024mj4nb6mjtfy', 0, 'cm1dv217500004mj4qghj71yt'),
('cm1dvdflc00044mj4l2u50ece', 'paulkachule', 'paulkachule@hotmail.com', '[\"Hats\"]', NULL, 'cm1dv22mw00024mj4nb6mjtfy', 'http://192.168.1.102:3000/revelio?id=cm1dvdflc00044mj4l2u50ece', 1, 'cm1dv217500004mj4qghj71yt'),
('cm1dve5ah00064mj4omjn8zbl', 'paulkachule', 'paulkachule@csda-africa.com', NULL, NULL, 'cm1dvdflc00044mj4l2u50ece', 'http://192.168.1.102:3000/revelio?id=cm1dve5ah00064mj4omjn8zbl', 0, 'cm1dv217500004mj4qghj71yt'),
('cm3atbgwg0002fnmftsh9lsb4', 'Salvo', 'Jspkay@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3atbgn80000fnmfo4b1woyh'),
('cm3hhtekz0002qmtcrxh41c0t', 'Paul', 'paulkachule@hotmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhufv60004qmtcwlj68wla', 'Karene', 'ulrichkarene@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhuo0g0006qmtc2ci2mtj5', 'Layla', 'matavellayla@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhwjxs0008qmtcyeppg00a', 'Jamila', 'jamilaconforme.jc@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhwta7000aqmtc2louhxws', 'Marielle', 'mariellegaba97@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhx2nj000cqmtcjytit3v9', 'Kamate', 'gaiuskyanamire10@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hhyk77000eqmtcpyz5t58c', 'Marie Muchanty', 'umuchanty@yahoo.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkho7t000gqmtc2yyfca7e', 'Aslyelo 贝 ', 'aslyelo@icloud.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hknegg000iqmtc8ux4my2y', 'Emmanuel-Malawi', 'kaechem@outlook.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkohhk000kqmtcxgx6cva1', 'Aubrey - Defpac', 'chigedeaubrey@yahoo.co.uk', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkpp6m000mqmtcajr2kvgx', 'Gerrick - G', 'gerwazyschouten@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkqi00000oqmtci77cm1rp', 'Aulong', 'aluongmayom2021@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkrdko0001s3cgvwe89uu2', 'Theoneste', 'theonesten92@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hksb240003s3cgty7dv6nk', 'Siyanda', 'master.xaba@gmail.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg'),
('cm3hkuen40005s3cgmud53qf2', 'Estella', 'e4368@icloud.com', NULL, NULL, NULL, NULL, NULL, 'cm3hhtebj0000qmtcjisshngg');

-- --------------------------------------------------------

--
-- Table structure for table `Post`
--

CREATE TABLE `Post` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Session`
--

CREATE TABLE `Session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VerificationToken`
--

CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `Account_userId_fkey` (`userId`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `member_receiver_id_key` (`receiver_id`),
  ADD KEY `member_group_id_fkey` (`group_id`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Post_name_idx` (`name`),
  ADD KEY `Post_createdById_fkey` (`createdById`);

--
-- Indexes for table `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  ADD KEY `Session_userId_fkey` (`userId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `VerificationToken`
--
ALTER TABLE `VerificationToken`
  ADD UNIQUE KEY `VerificationToken_token_key` (`token`),
  ADD UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Post`
--
ALTER TABLE `Post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Account`
--
ALTER TABLE `Account`
  ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `member_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `Session`
--
ALTER TABLE `Session`
  ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
