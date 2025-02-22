-- First, clear existing Q4 2025 data
DELETE FROM transit_events 
WHERE year = 2025 
AND month IN (10, 11, 12);

-- Insert Q4 2025 transit events
INSERT INTO transit_events (year, month, event_date, planet, event_type, degrees, minutes, sign, time_utc, additional_info, secondary_planet) VALUES
-- October 2025
(2025, 10, '2025-10-06 16:41:00+00', 'Mercury', 'entered', 0, 0, 'Scorpio', '16:41:00', NULL, NULL),
(2025, 10, '2025-10-07 03:47:00+00', 'Moon', 'full_moon', 14, 8, 'Aries', '03:47:00', NULL, NULL),
(2025, 10, '2025-10-13 21:19:00+00', 'Venus', 'entered', 0, 0, 'Libra', '21:19:00', NULL, NULL),
(2025, 10, '2025-10-20 06:51:00+00', 'Mercury', 'conjunction', 19, 11, 'Scorpio', '06:51:00', NULL, 'Mars'),
(2025, 10, '2025-10-21 12:24:00+00', 'Moon', 'new_moon', 28, 21, 'Libra', '12:24:00', NULL, NULL),
(2025, 10, '2025-10-22 09:47:00+00', 'Neptune', 'left', 0, 0, 'Aries', '09:47:00', 'R', NULL),
(2025, 10, '2025-10-23 03:51:00+00', 'Sun', 'entered', 0, 0, 'Scorpio', '03:51:00', NULL, NULL),
(2025, 10, '2025-10-23 16:44:00+00', 'Mercury', 'conjunction', 23, 29, 'Scorpio', '16:44:00', NULL, 'Lilith'),
(2025, 10, '2025-10-26 21:52:00+00', 'Mars', 'conjunction', 23, 51, 'Scorpio', '21:52:00', NULL, 'Lilith'),
(2025, 10, '2025-10-29 11:02:00+00', 'Mercury', 'entered', 0, 0, 'Sagittarius', '11:02:00', NULL, NULL),

-- November 2025
(2025, 11, '2025-11-04 13:01:00+00', 'Mars', 'entered', 0, 0, 'Sagittarius', '13:01:00', NULL, NULL),
(2025, 11, '2025-11-05 13:19:00+00', 'Moon', 'full_moon', 13, 22, 'Taurus', '13:19:00', NULL, NULL),
(2025, 11, '2025-11-06 22:40:00+00', 'Venus', 'entered', 0, 0, 'Scorpio', '22:40:00', NULL, NULL),
(2025, 11, '2025-11-08 02:22:00+00', 'Uranus', 'left', 0, 0, 'Gemini', '02:22:00', 'R', NULL),
(2025, 11, '2025-11-12 23:15:00+00', 'Mercury', 'conjunction', 6, 4, 'Sagittarius', '23:15:00', NULL, 'Mars'),
(2025, 11, '2025-11-18 11:33:00+00', 'Sun', 'conjunction', 26, 22, 'Scorpio', '11:33:00', NULL, 'Lilith'),
(2025, 11, '2025-11-19 03:21:00+00', 'Mercury', 'left', 0, 0, 'Sagittarius', '03:21:00', 'R', NULL),
(2025, 11, '2025-11-20 06:46:00+00', 'Moon', 'new_moon', 28, 11, 'Scorpio', '06:46:00', NULL, NULL),
(2025, 11, '2025-11-20 09:22:00+00', 'Sun', 'conjunction', 28, 18, 'Scorpio', '09:22:00', NULL, 'Mercury'),
(2025, 11, '2025-11-21 13:37:00+00', 'Mercury', 'conjunction', 26, 43, 'Scorpio', '13:37:00', NULL, 'Lilith'),
(2025, 11, '2025-11-22 01:36:00+00', 'Sun', 'entered', 0, 0, 'Sagittarius', '01:36:00', NULL, NULL),
(2025, 11, '2025-11-25 01:51:00+00', 'Mercury', 'conjunction', 22, 45, 'Scorpio', '01:51:00', NULL, 'Venus'),
(2025, 11, '2025-11-28 21:22:00+00', 'Venus', 'conjunction', 27, 32, 'Scorpio', '21:22:00', NULL, 'Lilith'),
(2025, 11, '2025-11-30 20:14:00+00', 'Venus', 'entered', 0, 0, 'Sagittarius', '20:14:00', NULL, NULL),

-- December 2025
(2025, 12, '2025-12-04 23:13:00+00', 'Moon', 'full_moon', 13, 3, 'Gemini', '23:13:00', NULL, NULL),
(2025, 12, '2025-12-11 00:59:00+00', 'Mercury', 'conjunction', 28, 54, 'Scorpio', '00:59:00', NULL, 'Lilith'),
(2025, 12, '2025-12-11 22:40:00+00', 'Mercury', 'entered', 0, 0, 'Sagittarius', '22:40:00', NULL, NULL),
(2025, 12, '2025-12-15 07:34:00+00', 'Mars', 'entered', 0, 0, 'Capricorn', '07:34:00', NULL, NULL),
(2025, 12, '2025-12-20 01:43:00+00', 'Moon', 'new_moon', 28, 24, 'Sagittarius', '01:43:00', NULL, NULL),
(2025, 12, '2025-12-20 19:11:00+00', 'Lilith', 'entered', 0, 0, 'Sagittarius', '19:11:00', NULL, NULL),
(2025, 12, '2025-12-21 15:03:00+00', 'Sun', 'entered', 0, 0, 'Capricorn', '15:03:00', NULL, NULL),
(2025, 12, '2025-12-24 16:26:00+00', 'Venus', 'entered', 0, 0, 'Capricorn', '16:26:00', NULL, NULL);
