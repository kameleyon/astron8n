-- First, clear existing Q2 2025 data
DELETE FROM transit_events 
WHERE year = 2025 
AND month IN (4, 5, 6);

-- Insert Q2 2025 transit events
INSERT INTO transit_events (year, month, event_date, planet, event_type, degrees, minutes, sign, time_utc, additional_info, secondary_planet) VALUES
-- April 2025
(2025, 4, '2025-04-03 02:26:00+00', 'Venus', 'conjunction', 26, 37, 'Pisces', '02:26:00', NULL, 'Node'),
(2025, 4, '2025-04-07 11:00:00+00', 'Venus', 'conjunction', 25, 15, 'Pisces', '11:00:00', NULL, 'Saturn'),
(2025, 4, '2025-04-12 15:59:00+00', 'Sun', 'conjunction', 22, 59, 'Aries', '15:59:00', NULL, 'Chiron'),
(2025, 4, '2025-04-13 00:21:00+00', 'Moon', 'full_moon', 23, 19, 'Libra', '00:21:00', NULL, NULL),
(2025, 4, '2025-04-14 04:25:00+00', 'Saturn', 'conjunction', 26, 01, 'Pisces', '04:25:00', NULL, 'Node'),
(2025, 4, '2025-04-16 06:25:00+00', 'Mercury', 'entered', 0, 0, 'Aries', '06:25:00', NULL, NULL),
(2025, 4, '2025-04-17 04:10:00+00', 'Mercury', 'conjunction', 0, 38, 'Aries', '04:10:00', NULL, 'Neptune'),
(2025, 4, '2025-04-18 04:21:00+00', 'Mars', 'entered', 0, 0, 'Leo', '04:21:00', NULL, NULL),
(2025, 4, '2025-04-19 19:56:00+00', 'Sun', 'entered', 0, 0, 'Taurus', '19:56:00', NULL, NULL),
(2025, 4, '2025-04-20 13:37:00+00', 'Venus', 'conjunction', 25, 41, 'Pisces', '13:37:00', NULL, 'Node'),
(2025, 4, '2025-04-25 00:01:00+00', 'Venus', 'conjunction', 27, 13, 'Pisces', '00:01:00', NULL, 'Saturn'),
(2025, 4, '2025-04-27 19:30:00+00', 'Moon', 'new_moon', 7, 46, 'Taurus', '19:30:00', NULL, NULL),
(2025, 4, '2025-04-30 17:16:00+00', 'Venus', 'entered', 0, 0, 'Aries', '17:16:00', NULL, NULL),

-- May 2025
(2025, 5, '2025-05-02 17:06:00+00', 'Venus', 'conjunction', 1, 8, 'Aries', '17:06:00', NULL, 'Neptune'),
(2025, 5, '2025-05-07 01:47:00+00', 'Mercury', 'conjunction', 24, 25, 'Aries', '01:47:00', NULL, 'Chiron'),
(2025, 5, '2025-05-10 12:15:00+00', 'Mercury', 'entered', 0, 0, 'Taurus', '12:15:00', NULL, NULL),
(2025, 5, '2025-05-12 16:55:00+00', 'Moon', 'full_moon', 22, 12, 'Scorpio', '16:55:00', NULL, NULL),
(2025, 5, '2025-05-17 23:32:00+00', 'Sun', 'conjunction', 27, 17, 'Taurus', '23:32:00', NULL, 'Uranus'),
(2025, 5, '2025-05-20 18:55:00+00', 'Sun', 'entered', 0, 0, 'Gemini', '18:55:00', NULL, NULL),
(2025, 5, '2025-05-24 23:14:00+00', 'Mercury', 'conjunction', 27, 42, 'Taurus', '23:14:00', NULL, 'Uranus'),
(2025, 5, '2025-05-25 03:36:00+00', 'Saturn', 'entered', 0, 0, 'Aries', '03:36:00', NULL, NULL),
(2025, 5, '2025-05-26 01:00:00+00', 'Mercury', 'entered', 0, 0, 'Gemini', '01:00:00', NULL, NULL),
(2025, 5, '2025-05-27 03:02:00+00', 'Moon', 'new_moon', 6, 5, 'Gemini', '03:02:00', NULL, NULL),
(2025, 5, '2025-05-30 04:12:00+00', 'Sun', 'conjunction', 9, 1, 'Gemini', '04:12:00', NULL, 'Mercury'),

-- June 2025
(2025, 6, '2025-06-01 20:10:00+00', 'Venus', 'conjunction', 25, 44, 'Aries', '20:10:00', NULL, 'Chiron'),
(2025, 6, '2025-06-06 04:43:00+00', 'Venus', 'entered', 0, 0, 'Taurus', '04:43:00', NULL, NULL),
(2025, 6, '2025-06-08 20:11:00+00', 'Mercury', 'conjunction', 29, 45, 'Gemini', '20:11:00', NULL, 'Jupiter'),
(2025, 6, '2025-06-08 22:58:00+00', 'Mercury', 'entered', 0, 0, 'Cancer', '22:58:00', NULL, NULL),
(2025, 6, '2025-06-09 21:02:00+00', 'Jupiter', 'entered', 0, 0, 'Cancer', '21:02:00', NULL, NULL),
(2025, 6, '2025-06-11 07:43:00+00', 'Moon', 'full_moon', 20, 38, 'Sagittarius', '07:43:00', NULL, NULL),
(2025, 6, '2025-06-17 08:36:00+00', 'Mars', 'entered', 0, 0, 'Virgo', '08:36:00', NULL, NULL),
(2025, 6, '2025-06-21 02:42:00+00', 'Sun', 'entered', 0, 0, 'Cancer', '02:42:00', NULL, NULL),
(2025, 6, '2025-06-24 15:16:00+00', 'Sun', 'conjunction', 3, 21, 'Cancer', '15:16:00', NULL, 'Jupiter'),
(2025, 6, '2025-06-25 10:31:00+00', 'Moon', 'new_moon', 4, 7, 'Cancer', '10:31:00', NULL, NULL),
(2025, 6, '2025-06-26 19:09:00+00', 'Mercury', 'entered', 0, 0, 'Leo', '19:09:00', NULL, NULL);
