-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2026 at 07:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pice_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accomplishments`
--

CREATE TABLE `accomplishments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` enum('projects_programs','events') NOT NULL DEFAULT 'projects_programs'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accomplishments`
--

INSERT INTO `accomplishments` (`id`, `title`, `description`, `image`, `date`, `created_at`, `category`) VALUES
(1, 'Best PICE organization student chapter', 'awarded as the best PICE organization in the entire region', '6984a45731cf7.jpg', '2026-01-27', '2026-01-28 11:21:40', 'events'),
(3, 'test', 'test', '1769602271_244879.jpg', '2026-01-27', '2026-01-28 12:11:11', 'projects_programs'),
(6, 'tetetetetetesad asd asd ', 'tatada sdasd adas das', '6984a3f67ab40.jpg', '2026-01-28', '2026-01-29 13:22:20', 'projects_programs'),
(7, 'asd asd asdasd asd ', 'ad asd asd asd asd', '6984a3ed1c695.jpg', '2026-02-04', '2026-02-03 08:20:55', 'projects_programs'),
(8, 'adasd as', 'asd asda d', '6984a3e4a3616.jpg', '2026-02-05', '2026-02-05 13:06:49', 'projects_programs'),
(9, 'asd ad', 'asd ', '6984a3df6aa5f.jpg', '2026-02-05', '2026-02-05 13:06:57', 'projects_programs'),
(10, 'asd asd ', 'dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd dasdasd asda sdasd asda asd asd ', '6984a3da58901.jpg', '2026-02-05', '2026-02-05 13:07:05', 'projects_programs');

-- --------------------------------------------------------

--
-- Table structure for table `action_plan`
--

CREATE TABLE `action_plan` (
  `id` int(11) NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `action_plan`
--

INSERT INTO `action_plan` (`id`, `file`, `updated_at`) VALUES
(1, '6984a3405e9e3.pdf', '2026-02-05 14:03:44');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', '$2y$10$8acO4bJg6NLkWicelZoO7eJsqexJShA5rzybaPBhyTq9yW9K1.38O');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `created_at`) VALUES
(2, 'First organizational orientation S.Y. 2026-2027', 'This is to conduct the first organizational orientation of all the members asdas dasd asd asd asd asd asd as', '2026-01-28 11:18:29'),
(4, 'AAAA', 'AAAAAAAAAAAAAAAAAAA', '2026-02-03 08:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `cbl_documents`
--

CREATE TABLE `cbl_documents` (
  `id` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cbl_documents`
--

INSERT INTO `cbl_documents` (`id`, `file`, `updated_at`) VALUES
(1, '6981ca1c7f2fb.pdf', '2026-02-03 10:12:44');

-- --------------------------------------------------------

--
-- Table structure for table `ce_files`
--

CREATE TABLE `ce_files` (
  `id` int(11) NOT NULL,
  `folder_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filetype` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ce_files`
--

INSERT INTO `ce_files` (`id`, `folder_id`, `title`, `filename`, `filetype`, `created_at`) VALUES
(2, 1, 'Action plan', '6984d1c9b7e17.pdf', 'pdf', '2026-02-05 17:22:17'),
(4, 1, 'ACTION PLAN.docx', 'ACTION_PLAN.docx', 'docx', '2026-02-05 18:09:17'),
(5, 1, 'PICE-CBL.pdf', 'PICE-CBL.pdf', 'pdf', '2026-02-05 18:09:24'),
(6, 1, 'CE-BOARD-AND-ACAD-PERF.2.edited.docx', 'CE-BOARD-AND-ACAD-PERF.2.edited.docx', 'docx', '2026-02-05 18:09:34'),
(7, 1, 'Tracer study.2- rollie_docx.docx.docx', 'Tracer_study.2-_rollie_docx.docx.docx', 'docx', '2026-02-05 18:09:42'),
(8, 9, 'for cict summer grad 2024.xlsx', 'for_cict_summer_grad_2024.xlsx', 'xlsx', '2026-02-05 18:11:12');

-- --------------------------------------------------------

--
-- Table structure for table `ce_folders`
--

CREATE TABLE `ce_folders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ce_folders`
--

INSERT INTO `ce_folders` (`id`, `name`, `parent_id`, `created_at`) VALUES
(1, 'First Year', NULL, '2026-02-05 17:10:47'),
(2, 'Second Year', NULL, '2026-02-05 17:10:58'),
(3, 'Third Year', NULL, '2026-02-05 17:11:03'),
(4, 'Fourth Year', NULL, '2026-02-05 17:11:07'),
(9, 'first set files', 1, '2026-02-05 18:10:56');

-- --------------------------------------------------------

--
-- Table structure for table `chairman_page`
--

CREATE TABLE `chairman_page` (
  `id` int(11) NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chairman_page`
--

INSERT INTO `chairman_page` (`id`, `cover_image`, `updated_at`) VALUES
(1, '6981db8533222.png', '2026-02-03 11:27:01');

-- --------------------------------------------------------

--
-- Table structure for table `chairman_sections`
--

CREATE TABLE `chairman_sections` (
  `id` int(11) NOT NULL,
  `subheader` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chairman_sections`
--

INSERT INTO `chairman_sections` (`id`, `subheader`, `content`, `sort_order`) VALUES
(1, 'Research and Development', 'In order to contribute towards the attainment of the University vision and mission, as guided by its core values, University R&D has adopted the strategic goal in bolstering research culture and excellence.\r\n\r\nThe University as a Higher Education Institution is deemed as a generator of knowledge and technology. ISU has developed 21 research centers involved actively in the conduct of basic, strategic, applied, technology development, technology adaptation and integration, social science and higher education research. With these, the University leads the region in fronting innovative research initiatives.\r\n\r\nISU R&D has also strengthened its research management through improved coordination in planning and programming of research activities, which resulted to the generation of over 84 million worth of funds from various external research funding institutions locally, nationally and internationally.\r\n\r\nInstitutional mechanisms for technology transfer of mature technologies developed by the University were promoted through the establishment of technology ownership and intellectual property right for the protection of the creative works of scientists and researchers in the University. The University was able to obtain 18 Intellectual Property Registration, 2 patents and registered copyrights, 3 utility model, 8 industrial designs and 5 trademarks.', 0),
(2, 'Extension and Training Services', 'The ISU has maintained strong programs for extension and training. It has gained positive and satisfactory reputation with regard to its program innovation, community engagement and management.\r\n\r\nIt is further intensified by its strong leadership not only in the region but also in the national and international networks for extension support, thus hosting the 2nd Philippine Association of Extension Program Implementers, Inc. International Conference & 6th Biennial Convention & General Assembly Meeting.\r\n\r\nIt has established strong collaboration with other agencies in extension and training initiatives, forwarding sustainable community engagement services which are ably reinforced by the University’s strong culture of research and innovation.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `downloads`
--

CREATE TABLE `downloads` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file` varchar(255) NOT NULL,
  `category` enum('forms','reports','others') DEFAULT 'forms',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `downloads`
--

INSERT INTO `downloads` (`id`, `title`, `description`, `file`, `category`, `created_at`) VALUES
(2, 'test', 'test', '1769607205_CE-BOARD-AND-ACAD-PERF.2.edited.docx', 'reports', '2026-01-28 13:33:25'),
(3, 'test asd asasd asd ', 'test', '1769607347_PFF049_MembersChangeInformationForm_V10 (1).pdf', 'forms', '2026-01-28 13:35:47'),
(4, 'test', 'ad asd asd asdas ', '6981a44c6a976.jpg', 'forms', '2026-02-03 07:31:24');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `created_at`) VALUES
(1, 'how to be a member', 'just fill out the form from the organization office', '2026-01-29 13:38:31'),
(2, 'How to be a member of PICE', 'Accomplished the membership form from the organization office', '2026-01-29 13:43:27');

-- --------------------------------------------------------

--
-- Table structure for table `financial_report`
--

CREATE TABLE `financial_report` (
  `id` int(11) NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `financial_report`
--

INSERT INTO `financial_report` (`id`, `file`, `updated_at`) VALUES
(1, '6984a09f28fcd.pdf', '2026-02-05 13:52:31');

-- --------------------------------------------------------

--
-- Table structure for table `login_logs`
--

CREATE TABLE `login_logs` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` enum('success','failed','logout','password_change','password_change_failed') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_logs`
--

INSERT INTO `login_logs` (`id`, `username`, `ip_address`, `user_agent`, `status`, `created_at`) VALUES
(2, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'success', '2026-02-03 05:44:57'),
(4, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '', '2026-02-03 05:55:03'),
(5, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'password_change', '2026-02-03 06:02:27'),
(6, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'password_change_failed', '2026-02-03 06:02:49'),
(7, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'success', '2026-02-03 06:37:50'),
(8, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'failed', '2026-02-03 06:37:53'),
(9, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'failed', '2026-02-03 06:38:00'),
(10, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'success', '2026-02-03 06:38:07'),
(11, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'logout', '2026-02-03 06:56:05'),
(12, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'success', '2026-02-03 06:56:10'),
(13, 'admin', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'success', '2026-02-05 10:59:11');

-- --------------------------------------------------------

--
-- Table structure for table `officers`
--

CREATE TABLE `officers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `group_name` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officers`
--

INSERT INTO `officers` (`id`, `name`, `position`, `group_name`, `photo`, `sort_order`, `created_at`) VALUES
(1, 'Mark M. Balajadia', 'President', 'executive', '', 1, '2026-02-05 11:15:23'),
(2, 'Juan Dela Cruz', 'Vice President for Internal Affairs', 'executive', '', 2, '2026-02-05 11:15:52'),
(3, 'John Wayne G. Prieto', 'Vice President for External Affairs', 'executive', '', 3, '2026-02-05 11:16:02'),
(4, 'Danica Trisha Mae A. Macarilay', 'Secretary for Internal Affairs', 'executive', '', 4, '2026-02-05 11:16:13'),
(5, 'Ma. Kathleen Joyce C. Cabanlong', 'Secretary for External Affairs', 'executive', '', 5, '2026-02-05 11:16:26'),
(6, 'Lexter D. Saguibo', 'Treasurer', 'executive', '', 6, '2026-02-05 11:16:36'),
(7, 'Roderick A. Vino', 'Auditor', 'executive', '', 7, '2026-02-05 11:16:45'),
(8, 'Jayvee M. Casasola', 'Public Relations Officer', 'executive', '', 8, '2026-02-05 11:16:55'),
(9, 'Jonard Joff N. Lantano', 'Business Manager', 'executive', '', 9, '2026-02-05 11:17:04'),
(10, 'Leigh Andrei T. Respicio', 'Grievance Officer', 'executive', '', 10, '2026-02-05 11:17:17'),
(11, 'Dominic T. Juan', 'Chief Director for Academics', 'board', '', 11, '2026-02-05 11:17:28'),
(12, 'Sharlene A. Ladisla', 'Chief Director for Socio-cultural Affairs', 'board', '', 12, '2026-02-05 11:17:39'),
(13, 'Ivan John P. Villegas ', 'Chief Director for Media', 'board', '', 13, '2026-02-05 11:17:50'),
(14, 'Edmar Junel S. Olino', 'Chief Director for Documentation', 'board', '', 14, '2026-02-05 11:17:59'),
(15, 'Juan Dela Cruz', 'Director for Academics', 'board', '', 15, '2026-02-05 11:18:50'),
(16, 'Juan Dela Cruz', 'Director for Socio-cultural Affairs', 'board', '', 16, '2026-02-05 11:19:01'),
(17, 'Juan Dela Cruz', 'Director for Business Management', 'board', '', 17, '2026-02-05 11:19:12'),
(18, 'Gio T. Concepcion', 'Directors for Media', 'board', '', 18, '2026-02-05 11:19:26'),
(19, 'Rica Arlea Lapastora', 'Directors for Documentation', 'board', '', 19, '2026-02-05 11:19:35'),
(20, 'Christian C. Nebalasca', 'Directors for Sports', 'board', '', 20, '2026-02-05 11:19:52'),
(21, 'Sherin Marie Asuncion', 'Directors for Sports', 'board', '', 21, '2026-02-05 11:20:06'),
(22, 'Fritzy Lei A. Rivera', 'Committee on Membership', 'membership', '', 22, '2026-02-05 11:20:19'),
(23, 'Raiven Alexiz C. Apostol', 'Committee on Membership', 'membership', '', 23, '2026-02-05 11:20:27'),
(24, 'Aldrin B. Melarpes', 'Committee on Events', 'events', '', 24, '2026-02-05 11:21:05'),
(25, 'John Mark F. Valdez', 'Committee on Events', 'events', '', 25, '2026-02-05 11:21:14'),
(26, 'Juan Dela Cruz', 'Committee on Creatives', 'creatives', '', 26, '2026-02-05 11:21:28'),
(27, 'Sairyl Kim A. Babas', 'First Year Representative', 'year_reps', '', 27, '2026-02-05 11:21:39'),
(28, 'Eldrin B. Cabang', 'Second Year Representative', 'year_reps', '', 28, '2026-02-05 11:21:50'),
(29, 'Dan Darell M. Passion', 'Third Year Representative', 'year_reps', '', 29, '2026-02-05 11:22:00'),
(30, 'Patricia Gale S. Jimenez', 'Fourth Year  Representative', 'year_reps', '', 30, '2026-02-05 11:22:10'),
(31, 'Juan Dela Cruz', 'Fifth Year Representative', 'year_reps', '', 31, '2026-02-05 11:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `president_page`
--

CREATE TABLE `president_page` (
  `id` int(11) NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `president_page`
--

INSERT INTO `president_page` (`id`, `cover_image`, `updated_at`) VALUES
(1, '6981d150cdff4.jpg', '2026-02-03 10:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `president_sections`
--

CREATE TABLE `president_sections` (
  `id` int(11) NOT NULL,
  `subheader` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `president_sections`
--

INSERT INTO `president_sections` (`id`, `subheader`, `content`, `sort_order`) VALUES
(1, 'Message from the President', 'The Isabela State University (ISU) envisions as a leading Research University in the ASEAN Region by 2024. Focused with its vision, the University has endeavored to be faithful in its mission to develop globally competitive human, technological resources and services through quality instruction, innovative research, responsive community engagement and viable resource management programs for inclusive growth and sustainable development.\r\n\r\nIt capitalizes in educating and training the students to become competent professionals who are equipped with the appropriate knowledge, values, skills and technology needed to help improve the productivity and the quality of life.\r\n\r\nIn doing so, the University’s Instruction, Research & Development, Extension & Training and Administration, has adopted the strategic goal of “strengthening research culture, foster excellence and leadership for academic advancement and sustainable countryside development.”\r\n\r\nISU has gained monumental achievements over the course of time, which set a perceptive course for the University’s response to the evolving development needs while materializing its vision. Highlights of these accomplishments illustrate ISU’s commitment to One ISU for Quality and Relevance.', 0),
(2, 'Instruction', 'Endeavoring to implement universal access to quality higher education, the university is determined to contribute and make quality education accessible to all who have the motivation to become learned, skilled, productive, innovative, and valuable members of society.\r\n\r\nIn confirmation, ISU is recognized as one of the top ranking SUCs in the country. ISU is committed in subjecting its program offerings to accrediting agencies to foster quality, transparency and excellence. Moreover, ISU was awarded Center of Development in Agriculture, Information Technology and Education.\r\n\r\nISU also delivers globally engaged education programs, such as Cultural Exchange and Learning Express Programs, with Temasek Polytechnic and Singapore Polytechnic. It develops global awareness and intercultural understanding, and develop the skills that the students need to be successful, interconnected, active and informed global citizens.\r\n\r\nPerformance in the board examinations is viewed as one of the measures of the quality of a program. ISU places its mark to various licensure examinations surpassing national passing rates and providing topnotchers.', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accomplishments`
--
ALTER TABLE `accomplishments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `action_plan`
--
ALTER TABLE `action_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cbl_documents`
--
ALTER TABLE `cbl_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ce_files`
--
ALTER TABLE `ce_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folder_id` (`folder_id`);

--
-- Indexes for table `ce_folders`
--
ALTER TABLE `ce_folders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chairman_page`
--
ALTER TABLE `chairman_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chairman_sections`
--
ALTER TABLE `chairman_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financial_report`
--
ALTER TABLE `financial_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `president_page`
--
ALTER TABLE `president_page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `president_sections`
--
ALTER TABLE `president_sections`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accomplishments`
--
ALTER TABLE `accomplishments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `action_plan`
--
ALTER TABLE `action_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cbl_documents`
--
ALTER TABLE `cbl_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ce_files`
--
ALTER TABLE `ce_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ce_folders`
--
ALTER TABLE `ce_folders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chairman_page`
--
ALTER TABLE `chairman_page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chairman_sections`
--
ALTER TABLE `chairman_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `downloads`
--
ALTER TABLE `downloads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `financial_report`
--
ALTER TABLE `financial_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `officers`
--
ALTER TABLE `officers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `president_page`
--
ALTER TABLE `president_page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `president_sections`
--
ALTER TABLE `president_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ce_files`
--
ALTER TABLE `ce_files`
  ADD CONSTRAINT `ce_files_ibfk_1` FOREIGN KEY (`folder_id`) REFERENCES `ce_folders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
